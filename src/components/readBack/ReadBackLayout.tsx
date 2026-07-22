import { useMemo, useState } from 'react';
import type { AmplenoteTask, MoodDataPoint } from '../../utils/types';
import { DayEntry } from './dayEntry/DayEntry';
import { MoodFilterBar, type SelectedMoodFilter } from './filterBar/MoodFilterBar';
import styles from './readBackLayout.module.css';
import { ThemeAnalysisPanel } from './themeAnalysis/ThemeAnalysisPanel';
import { getRankedTaskWords } from '../../utils/taskMoodAnalytics';

interface ChartProps {
    data: MoodDataPoint[];
    completedTasks: AmplenoteTask[]
}

export function ReadBackLayout({ data, completedTasks }: ChartProps) {
    const [selectedMood, setSelectedMood] = useState<SelectedMoodFilter>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMoods = useMemo(() => {
        return data.filter((mood) => {
            if (selectedMood !== null && Math.round(mood.rating) !== selectedMood) {
                return false;
            }

            if (searchQuery.trim() !== '') {
                const query = searchQuery.toLowerCase();
                const noteMatches = mood.note?.toLowerCase().includes(query);

                const taskMatches = completedTasks.some((task) => {
                    if (!task.completedAt) return false;

                    const sameDay =
                        new Date(task.completedAt * 1000).toDateString() ===
                        new Date(mood.timestamp * 1000).toDateString();
                    
                    return sameDay && task.content.toLowerCase().includes(query);
                });

                return noteMatches || taskMatches;
            };

            return true;
        });
    }, [data, completedTasks, selectedMood, searchQuery]);

    const rankedWords = useMemo(
        () => getRankedTaskWords(completedTasks, filteredMoods),
        [completedTasks, filteredMoods],
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
                        <MoodFilterBar 
                            selectedMood={selectedMood}
                            onSelectMood={setSelectedMood}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            totalEntries={filteredMoods.length}
                        />
                    </div>
                </section>

                {filteredMoods.map((mood) => {
                    const tasksForDay = completedTasks.filter(task => {
                        if (!task.completedAt) return false;

                        const taskDate = new Date(task.completedAt * 1000).toDateString();
                        const moodDate = new Date(mood.timestamp * 1000).toDateString();

                        return taskDate === moodDate;
                    });

                    const finalTasks = searchQuery.trim()
                        ? tasksForDay.filter(t => t.content.toLowerCase().includes(searchQuery.toLowerCase()))
                        : tasksForDay;

                    return (
                        <DayEntry
                            key={mood.timestamp}
                            mood={mood}
                            tasks={finalTasks}
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