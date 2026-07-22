import type { AmplenoteTask } from "./types";

/**
 * Generates an array of mock mood ratings.
 * @param count Number of mock entries to generate.
 * @param daysBack How far into the past (in days) the timestamps should span.
 */
export function generateMockMoods(count: number = 10, daysBack: number = 7) {
    const moodsPool = [
        { rating: 2, note: "Feeling amazing! Productive day, hit all my milestones." },
        { rating: 1, note: "Good day. Got a lot done and had a nice lunch." },
        { rating: 0, note: "Pretty neutral. Just grinding through routine tasks." },
        { rating: -1, note: "A bit tired and frustrated with some bugs today." },
        { rating: -2, note: "Exhausted. Burnt out and felt like procrastinating all afternoon." }
    ];

    const nowInSeconds = Math.floor(Date.now() / 1000);

    return Array.from({ length: daysBack }, (_, i) => {
        const randomTemplate = moodsPool[Math.floor(Math.random() * moodsPool.length)];
        const timestamp = nowInSeconds - i * 86400; // one entry per day, sequential
        return {
            uuid: crypto.randomUUID(),
            rating: randomTemplate.rating,
            note: randomTemplate.note,
            timestamp,
        };
    }).sort((a, b) => b.timestamp - a.timestamp);
}

export function generateMockTaskCounts(days: number): Map<string, number> {
    const counts = new Map<string, number>();
    const now = Math.floor(Date.now() / 1000);

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date((now - i * 86400) * 1000).toDateString();
        counts.set(date, Math.floor(Math.random() * 40 + 5));
    }

    return counts;
}

export function generateMockTasks(count: number = 20, completed: boolean = false, daysBack = 7): AmplenoteTask[] {
    const now = Math.floor(Date.now() / 1000);

    const taskNames = [
        "Fix authentication bug in login API",
        "Design landing page header",
        "Update database schema for users",
        "Code review for pull request",
        "Refactor CSS layout and styles",
        "Emergency server deployment fix",
        "Write unit tests for checkout",
        "Prepare weekly marketing deck",
        "Debug memory leak in production",
        "Draft project roadmap and scope",
        "Sync with design team on Figma",
        "Pay quarterly credit card invoice",
        "Setup Docker container for dev",
        "Clean up obsolete documentation",
        "Investigate database query lag"
    ];

    return Array.from({ length: count }, (_, i) => {
        const randomDay = Math.floor(Math.random() * daysBack);

        const randomTitle = taskNames[Math.floor(Math.random() * taskNames.length)];

        return {
            uuid: crypto.randomUUID(),
            noteUUID: crypto.randomUUID(),
            content: `${randomTitle} #${i + 1}`,
            createdAt: now - randomDay * 86400,
            completedAt:
                completed
                    ? now - randomDay * 86400
                    : undefined,
            important: Math.random() > 0.7,
            urgent: !completed && Math.random() > 0.8,
            victoryValue: Math.random() * 100,
            isRepeating: false,
            repeat: null,
        };
    });
}