import { DayEntry } from './dayEntry/DayEntry';
import { MoodFilterBar } from './filterBar/MoodFilterBar';
import styles from './readBackLayout.module.css';

export function ReadBackLayout() {
    return (
        <div className={styles.layout}>
            <main className={styles.main}>
                <section className={styles.card}>
                    <div className={styles.filters}>
                        <MoodFilterBar />
                        <span>210 entries</span>
                    </div>
                </section>
                <DayEntry />
                <DayEntry />
            </main>

            <aside className={styles.sidebar}>
                <section className={styles.card}>
                    <div className={`${styles.placeholder} ${styles.title}`}></div>

                    <div className={`${styles.placeholder} ${styles.line}`}></div>
                    <div className={`${styles.placeholder} ${styles.line}`}></div>
                    <div className={`${styles.placeholder} ${styles.line}`}></div>
                    <div className={`${styles.placeholder} ${styles.line}`}></div>
                    <div className={`${styles.placeholder} ${styles.short}`}></div>

                    <div className={styles.analysis}></div>
                </section>

                <section className={styles.card}>
                    <div className={`${styles.placeholder} ${styles.title}`}></div>
                    
                    <div className={`${styles.placeholder} ${styles.line}`}></div>
                    <div className={`${styles.placeholder} ${styles.line}`}></div>
                    <div className={`${styles.placeholder} ${styles.short}`}></div>

                    <div className={styles.analysis}></div>
                </section>
            </aside>
        </div>
    );
}