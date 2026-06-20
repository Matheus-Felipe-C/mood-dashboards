import { useEffect, useState } from 'react'
import './App.css'
import { MoodPulseChart } from './components/moodPulseChart/MoodPulseChart'
import { generateMockMoods } from './utils/mockData'

declare global {
  interface Window {
    callAmplenotePlugin: (functionName: string, ...args: any[]) => Promise<any>;
  }
}

function App() {

  const [moodData, setMoodData] = useState(() => generateMockMoods(60, 30));

  async function fetchMoods(days: number) {
    if (typeof window.callAmplenotePlugin !== 'function') {
      console.log('Could not get mood from the plugin API, falling back to mocked data...');
      setMoodData(generateMockMoods(60, days));
      return;
    }

    try {
      const result = await window.callAmplenotePlugin("getMoods", days);
      setMoodData(result);
    } catch (err) {
      console.error("failed to fetch mood data:", err);
    }
  }

  useEffect(() => {
    fetchMoods(30);
  }, []);

  function regenerate() {
    setMoodData(generateMockMoods(60, 30));
  }

  return (
    <div className="app-container" style={{ padding: '20px', backgroundColor: '#0b0c10'}}> 
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ color: '#ffffff', fontFamily: 'sans-serif', margin: 0}}>
          Workspace Analytics
        </h1>
      </header>

      <main>
        <MoodPulseChart data={moodData} onRegenerate={regenerate} />
      </main>
    </div>
  )
}

export default App
