import type { AmplenoteTask, MoodDataPoint } from '../../utils/types';
import { DayEntry } from './dayEntry/DayEntry';
import { MoodFilterBar } from './filterBar/MoodFilterBar';
import styles from './readBackLayout.module.css';
import { ThemeAnalysisPanel } from './themeAnalysis/ThemeAnalysisPanel';

interface ChartProps {
    data: MoodDataPoint[];
    completedTasks: AmplenoteTask[]
}

export function ReadBackLayout({ data, completedTasks }: ChartProps) {

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
                    words={[
                        { name: 'Logo', taskCount: 33, score: 1.44 },
                        { name: 'Design', taskCount: 18, score: 0.92 },
                        { name: 'Marketing', taskCount: 11, score: 0.54 },
                        { name: 'Logo', taskCount: 33, score: 1.44 },
                        { name: 'Design', taskCount: 18, score: 0.92 },
                        { name: 'Marketing', taskCount: 11, score: 0.54 },
                        { name: 'Logo', taskCount: 33, score: 1.44 },
                        { name: 'Design', taskCount: 18, score: 0.92 },
                        { name: 'Marketing', taskCount: 11, score: 0.54 },
                    ]}
                />
                <ThemeAnalysisPanel
                    variant='worst'
                    words={[
                        { name: 'Logo', taskCount: 33, score: -1.44 },
                        { name: 'Design', taskCount: 18, score: -0.92 },
                        { name: 'Marketing', taskCount: 11, score: -0.54 },
                        { name: 'Logo', taskCount: 33, score: -1.44 },
                        { name: 'Design', taskCount: 18, score: -0.92 },
                        { name: 'Marketing', taskCount: 11, score: -0.54 },
                        { name: 'Logo', taskCount: 33, score: -1.44 },
                        { name: 'Design', taskCount: 18, score: -0.92 },
                        { name: 'Marketing', taskCount: 11, score: -0.54 },
                    ]}
                />
            </aside>
        </div>
    );
}