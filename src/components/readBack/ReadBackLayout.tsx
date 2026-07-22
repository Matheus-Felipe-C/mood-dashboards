import { useMemo } from 'react';
import type { AmplenoteTask, MoodDataPoint } from '../../utils/types';
import { DayEntry } from './dayEntry/DayEntry';
import { MoodFilterBar } from './filterBar/MoodFilterBar';
import styles from './readBackLayout.module.css';
import { ThemeAnalysisPanel } from './themeAnalysis/ThemeAnalysisPanel';
import { getRankedTaskWords } from '../../utils/taskMoodAnalytics';

interface ChartProps {
    data: MoodDataPoint[];
    completedTasks: AmplenoteTask[]
}

export function ReadBackLayout({ data, completedTasks }: ChartProps) {
    const rankedWords = useMemo(
        () => getRankedTaskWords(completedTasks, data),
        [completedTasks, data],
    );

    const { bestWords, worstWords } = useMemo(() => {
        const formatted = rankedWords.map(w => ({
            name: w.word,
            taskCount: w.count,
            score: w.smoothedScore,
        }));

        const best = formatted
            .filter(w => w.score > 0)
            .slice(0, 10);
        
        const worst = [...formatted]
            .filter(w => w.score < 0)
            .sort((a, b) => a.score - b.score)
            .slice(0, 10);
        
        return { bestWords: best, worstWords: worst };
    }, [rankedWords]);
    

    return (
        <div className={styles.layout}>
            <main className={styles.main}>
                <section className={styles.card}>
                    <div className={styles.filters}>
                        <MoodFilterBar />
                    </div>
                </section>

                {data.map((mood) => {
                    const tasksForDay = completedTasks.filter(task => {
                        if (!task.completedAt) return false;

                        const taskDate = new Date(task.completedAt * 1000).toDateString();
                        const moodDate = new Date(mood.timestamp * 1000).toDateString();

                        return taskDate === moodDate;
                    });

                    return (
                        <DayEntry
                            key={mood.timestamp}
                            mood={mood}
                            tasks={tasksForDay}
                        />
                    );
                })}
            </main>

            <aside className={styles.sidebar}>
                <ThemeAnalysisPanel
                    variant='best'
                    words={bestWords}
                />
                <ThemeAnalysisPanel
                    variant='worst'
                    words={worstWords}
                />
            </aside>
        </div>
    );
}