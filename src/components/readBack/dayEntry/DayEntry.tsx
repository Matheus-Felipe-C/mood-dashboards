import type { AmplenoteTask, MoodDataPoint } from "../../../utils/types";
import { TaskRow } from "../taskRow/TaskRow";
import style from './DayEntry.module.css';

interface DayEntryProps {
    mood: MoodDataPoint;
    tasks: AmplenoteTask[];
}

function formatDate(timestamp: number) {
    const date = new Date(timestamp * 1000);

    return {
        monthDay: date.toLocaleDateString("en-US", {
            month: "long",
            day: 'numeric',
        }),
        weekday: date.toLocaleDateString("en-US", {
            weekday: 'long',
        }),
        year: date.getFullYear(),
    }
}

export function DayEntry({ mood, tasks }: DayEntryProps) {
    const { monthDay, weekday, year } = formatDate(mood.timestamp);
    const taskCount = tasks.length;

    const totalPoints = tasks.reduce((sum, task) => sum + task.score, 0);
    return (
        <div className={style.layout}>
            <div className={style.fulldate}>
                <h3>{monthDay}</h3>
                <p>{weekday}</p>
                <p>{year}</p>
            </div>
            <div className={style.timeline}>
                <div className={style.mood}>
                    <p>{mood.rating > 0 ? "+" : "" }{mood.rating.toFixed(1)}</p>
                </div>

                <div className={style.line} />

            </div>
            <div className={style.info_column}>
                <div className={style.mood_quote}>
                    <p>"{mood.note}"</p>
                </div>

                <div className={style.task_list}>
                    <p>{taskCount} tasks - {Math.round(totalPoints)} pts</p>
                    {tasks.map(task => (
                        <TaskRow
                            key={task.uuid}
                            taskName={task.content}
                            taskValue={Math.floor(task.score)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}