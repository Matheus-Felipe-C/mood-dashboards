import { useEffect, useState } from "react";
import { generateMockMoods, generateMockTaskCounts } from "../utils/mockData";
import { convertTasksToMap } from "../utils/conversions";
import { MoodPulseChart } from "../components/moodPulseChart/MoodPulseChart";

export function MoodPulsePage() {
    const [selectedRange, setSelectedRange] = useState(30);
    const [moodData, setMoodData] = useState(() => generateMockMoods(60, 30));
    const [taskCounts, setTaskCounts] = useState(() => generateMockTaskCounts(30));

    async function loadData(days: number) {
        setSelectedRange(days);

        if (typeof window.callAmplenotePlugin !== 'function') {
            console.log('Failed to get mood from the plugin API, falling back to mocked data...');

            setMoodData(generateMockMoods(days * 2, days));
            setTaskCounts(generateMockTaskCounts(days));

            return;
        }

        try {
            const moods = await window.callAmplenotePlugin('getMoods', days);
            const completedTasks = await window.callAmplenotePlugin("getCompletedTasks", days);

            setMoodData(moods);
            setTaskCounts(convertTasksToMap(completedTasks));
        } catch (err) {
            console.error('Failed to fetch mood data:', err);
        }
    }

    useEffect(() => {
        loadData(30);
    }, []);

    return <MoodPulseChart data={moodData} taskCounts={taskCounts} selectedRange={selectedRange} onLoadRange={loadData} />
}