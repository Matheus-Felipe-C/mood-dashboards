import { useState } from 'react'
import './App.css'
import { MoodPulseChart } from './components/moodPulseChart/MoodPulseChart'
import { generateMockMoods } from './utils/mockData'

function App() {

  const [moodData, setMoodData] = useState(() => generateMockMoods(60, 30));

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
