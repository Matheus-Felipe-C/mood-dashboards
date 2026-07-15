import style from './ThemeAnalysisPanel.module.css';

interface ThemeWord {
    name: string,
    taskCount: number;
    score: number;
}

interface ThemeAnalysisPanelProps {
    variant: 'best' | 'worst';
    words: ThemeWord[];
}

export function ThemeAnalysisPanel({ variant, words }: ThemeAnalysisPanelProps) {
    return (
        <section className={style.layout}>
            <span className={style.mutedTitle}>Theme Analysis</span>
            <h3>Words on your
                <span className={variant === 'best' ? style.green : style.red}> {variant}</span> days
            </h3>
            <span className={style.muted}>Click any to filter the timeline</span>

            <div className={style.wordsContainer}>
                {words.map((word) => (
                    <div key={word.name} className={style.wordItem}>
                        <div className={style.wordInfo}>
                            <span>{word.name}</span>
                            <span className={style.muted}>
                                {word.taskCount} tasks
                            </span>
                        </div>

                        <span
                            className={
                                word.score >= 0
                                    ? style.green
                                    : style.red
                            }
                        >
                            {word.score > 0 ? '+' : ''}
                            {word.score}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    )
}