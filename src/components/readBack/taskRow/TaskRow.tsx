import style from './TaskRow.module.css';

interface TaskRowProps {
    taskName: string,
    taskValue: number,
}

export function TaskRow({ taskName, taskValue }: TaskRowProps) {
    return (
        <div className={style.layout}>
            <div className={style.taskLine}>
                <div className={style.checkbox} />
                <span className={style.taskName}>
                    {taskName}
                </span>
            </div>

            <span className={style.taskValue}>
                {taskValue}
            </span>
        </div>
    )
}