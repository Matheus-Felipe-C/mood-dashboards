import styles from './readBackLayout.module.css';

export function ReadBackLayout() {
    return (
        <div className={styles.layout}>
            <main className={styles.main}>
                <section className={styles.card}>
                    <div className={styles.filters}>
                        <div className={`${styles.placeholder} ${styles.title}`}></div>
                        
                        <div className={`${styles.placeholder} ${styles.subtitle}`}></div>

                        <div className={`${styles.placeholder} ${styles.timeline}`}></div>
                    <span>210 entries</span>   
                    </div>
                </section>
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