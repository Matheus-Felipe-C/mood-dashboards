import { useEffect, useState } from "react";
import { ReadBackLayout } from "../components/readBack/ReadBackLayout";
import { generateMockMoods, generateMockTasks } from "../utils/mockData";

export function ReadDaysBack() {
    const [moodData, setMoodData] = useState(() => generateMockMoods(10, 10));
    const [completedTasks, setCompletedTasks] = useState(() => generateMockTasks(10, true));

    async function loadData(days: number) {
        if (typeof window.callAmplenotePlugin !== 'function') {
            console.log('Failed to get mood data from the plugin API, falling back to mocked data...');

            setMoodData(generateMockMoods(10, 10));
            setCompletedTasks(generateMockTasks(10, true, 10));

            return;
        }

        try {
            const moods = await window.callAmplenotePlugin('getMoods', days);
            const completedTasks = await window.callAmplenotePlugin('getCompletedTasks', days);

            console.log(moods);
            console.log(completedTasks);

            setMoodData(moods);
            setCompletedTasks(completedTasks);
        } catch (err) {
            console.error('Failed to fetch mood data:', err);
        }
    }

    useEffect(() => {
        loadData(60);
    }, []);

    return (
        <div>
            <ReadBackLayout data={moodData} completedTasks={completedTasks}></ReadBackLayout>
        </div>
    )
}