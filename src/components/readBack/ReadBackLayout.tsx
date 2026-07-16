import { DayEntry } from './dayEntry/DayEntry';
import { MoodFilterBar } from './filterBar/MoodFilterBar';
import styles from './readBackLayout.module.css';
import { ThemeAnalysisPanel } from './themeAnalysis/ThemeAnalysisPanel';

export function ReadBackLayout() {
    return (
        <div className={styles.layout}>
            <main className={styles.main}>
                <section className={styles.card}>
                    <div className={styles.filters}>
                        <MoodFilterBar />
                    </div>
                </section>
                <DayEntry />
                <DayEntry />
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