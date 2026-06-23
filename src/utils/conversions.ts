export function convertTasksToMap(tasks: any[]): Map<string, number> {
    const counts = new Map<string, number>();

    tasks.forEach(task => {
        if (!task.completedAt) return; // skips dismissed or incomplete tasks

        const dayKey = new Date(task.completedAt * 1000).toDateString();
        counts.set(dayKey, (counts.get(dayKey) ?? 0) + 1);
    });

    return counts;
}