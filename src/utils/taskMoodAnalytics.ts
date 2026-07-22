import type { AmplenoteTask, MoodDataPoint } from "./types";

export interface WordMoodScore {
    word: string;
    count: number;
    rawAverageMood: number;
    smoothedScore: number;
}

const STOP_WORDS = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'were', 'will', 'with', 'my', 'your', 'this', 'have'
]);

function extractWords(markdownContent: string): string[] {
    const plainText = markdownContent
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[*_~`>#\-\+]/g, ' ')
        .toLowerCase();

    const tokens = plainText.match(/\b[a-z0-9']+\b/g) || [];
    return tokens.filter(word => word.length > 1 && !STOP_WORDS.has(word));
}

function findClosestMood(taskTime: number, moods: MoodDataPoint[]): MoodDataPoint | null {
    if (moods.length === 0) return null;

    let closest = moods[0];
    let minDiff = Math.abs(taskTime - closest.timestamp);

    for (let i = 1; i < moods.length; i++) {
        const diff = Math.abs(taskTime - moods[i].timestamp);

        if (diff < minDiff) {
            minDiff = diff;
            closest = moods[i];
        }
    }

    return closest;
}

export function getRankedTaskWords(
    tasks: AmplenoteTask[],
    moods: MoodDataPoint[],
    minOccurrences: number = 2,
    smoothingWeight: number = 3
): WordMoodScore[] {
    if (tasks.length === 0 || moods.length === 0) return [];

    const globalMoodSum = moods.reduce((acc, m) => acc + m.rating, 0);
    const globalAverageMood = globalMoodSum / moods.length;

    const wordStatsMap = new Map<string, { count: number; totalMood: number}>();

    for (const task of tasks) {
        const tasktime = task.completedAt ?? task.createdAt;
        const closestMood = findClosestMood(tasktime, moods);
        if (!closestMood) continue;

        const words = new Set(extractWords(task.content));

        for (const word of words) {
            const stats = wordStatsMap.get(word) || { count: 0, totalMood: 0 };
            stats.count += 1;
            stats.totalMood += closestMood.rating;
            wordStatsMap.set(word, stats);
        }
    }

    const results: WordMoodScore[] = [];

    for (const [word, stats] of wordStatsMap.entries()) {
        if (stats.count < minOccurrences) continue;

        const rawAverage = stats.totalMood / stats.count;
        const smoothedScore = 
            (smoothingWeight * globalAverageMood + stats.totalMood) /
            (smoothingWeight + stats.count);

        results.push({
            word,
            count: stats.count,
            rawAverageMood: Number(rawAverage.toFixed(2)),
            smoothedScore: Number(smoothedScore.toFixed(2)),
        });
    }

    return results.sort((a, b) => b.smoothedScore - a.smoothedScore);
}