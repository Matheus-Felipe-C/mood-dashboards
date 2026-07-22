import styles from './MoodFilterBar.module.css';

export type SelectedMoodFilter = number | null;

interface MoodFilterBarProps {
    selectedMood: SelectedMoodFilter;
    onSelectMood: (mood: SelectedMoodFilter) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    totalEntries: number;
}

export function MoodFilterBar({
    selectedMood,
    onSelectMood,
    searchQuery,
    onSearchChange,
    totalEntries
}: MoodFilterBarProps) {
    const moodOptions: { label: string, value: SelectedMoodFilter }[] = [
        { label: 'All Notes', value: null},
        { label: '+2', value: 2},
        { label: '+1', value: 1},
        { label: '0', value: 0},
        { label: '-1', value: -1},
        { label: '-2', value: -2},
    ]

    return (
        <div className={styles.layout}>
            <div className={styles.groups}>
                <div className={styles.button_group}>
                    {moodOptions.map((opt) => {
                        const isActive = selectedMood === opt.value;

                        return (
                            <button
                                key={opt.label}
                                className={isActive ? styles.active : ''}
                                onClick={() => onSelectMood(opt.value)}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
                <input 
                    className={styles.search} 
                    type="text" 
                    placeholder="Search notes or tasks..." 
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}    
                />
            </div>

            <span>{totalEntries} entries</span>
        </div>
    )
}