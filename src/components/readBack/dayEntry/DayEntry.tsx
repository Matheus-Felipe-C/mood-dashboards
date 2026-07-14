import type { MoodDataPoint } from "../../../utils/types";
import { TaskRow } from "../taskRow/TaskRow";
import style from './DayEntry.module.css';

interface Props {
    data: MoodDataPoint;
}

export function DayEntry() {
    return (
        <div className={style.layout}>
            <div className={style.fulldate}>
                <h3>May 25</h3>
                <p>Monday</p>
                <p>2026</p>
            </div>
            <div className={style.timeline}>
                <div className={style.mood}>
                    <p>+0.5</p>
                </div>

                <div className={style.line} />

            </div>
            <div className={style.info_column}>
                <div className={style.mood_quote}>
                    <p>"Decent day. Some friction with the contract review but moved past it."</p>
                </div>

                <div className={style.task_list}>
                    <p>6 tasks - 404 pts</p>
                    {/* Tasks get added here */}
                    <TaskRow taskName="Test task" taskValue={61} />
                    <TaskRow taskName="Test task" taskValue={61} />
                    <TaskRow taskName="Test task" taskValue={61} />
                </div>
            </div>
        </div>
    )
}