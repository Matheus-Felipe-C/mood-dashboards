import { useEffect, useState } from 'react'
import './App.css'
import { MoodPulseChart } from './components/moodPulseChart/MoodPulseChart'
import { generateMockMoods, generateMockTaskCounts } from './utils/mockData'
import { convertTasksToMap } from './utils/conversions';

declare global {
  interface Window {
    callAmplenotePlugin: (functionName: string, ...args: any[]) => Promise<any>;
  }
}

function App() {

  const [selectedRange, setSelectedRange] = useState(30);
  const [moodData, setMoodData] = useState(() => generateMockMoods(60, 30));
  const [taskCounts, setTaskCounts] = useState(() => generateMockTaskCounts(30));

  async function loadData(days: number) {
    setSelectedRange(days);

    if (typeof window.callAmplenotePlugin !== 'function') {
      console.log('Could not get mood from the plugin API, falling back to mocked data...');
      setMoodData(generateMockMoods(60, days));
      setTaskCounts(generateMockTaskCounts(days));

      return;
    }

    try {
      const moods = await window.callAmplenotePlugin("getMoods", days);
      const completedTasks = await window.callAmplenotePlugin("getCompletedTasks", days);
      setMoodData(moods);
      setTaskCounts(convertTasksToMap(completedTasks));
    } catch (err) {
      console.error("failed to fetch mood data:", err);
    }
  }

  useEffect(() => {
    loadData(30);
  }, []);

  return (
    <div className="app-container" style={{ padding: '20px', backgroundColor: '#0b0c10'}}> 
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ color: '#ffffff', fontFamily: 'sans-serif', margin: 0}}>
          Workspace Analytics
        </h1>
      </header>

      <main>
        <MoodPulseChart data={moodData} taskCounts={taskCounts} selectedRange={selectedRange} onLoadRange={loadData} />
      </main>
    </div>
  )
}

export default App
