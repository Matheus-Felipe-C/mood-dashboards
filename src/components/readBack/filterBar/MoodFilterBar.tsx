import styles from './MoodFilterBar.module.css';

export function MoodFilterBar() {
    return (
        <div className={styles.layout}>
            <div className={styles.button_group}>
                <button>All Notes</button>
                <button>+2</button>
                <button>+1</button>
                <button>0</button>
                <button>-1</button>
                <button>-2</button>
            </div>
            <input className={styles.search} type="text" placeholder="Search notes or tasks..." />
        </div>
    )
}