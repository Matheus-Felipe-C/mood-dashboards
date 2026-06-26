import { useEffect, useState } from 'react'
import './App.css'
import { MoodPulsePage } from './pages/MoodPulsePage';
import { ReadDaysBack } from './pages/ReadBackPage';

declare global {
  interface Window {
    callAmplenotePlugin: (functionName: string, ...args: any[]) => Promise<any>;
  }
}

function App() {
  const [dashboard, setDashboard] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      if (typeof window.callAmplenotePlugin !== 'function') {
        setDashboard('readback');
        return;
      }

      const selected = await window.callAmplenotePlugin('getDashboard');
      setDashboard(selected);
    }
    init();
  }, []);

  if (!dashboard) return null;

  return (
    <div className='app-container' style={{ padding: '20px', backgroundColor: '#0b0c10 '}}>
      {dashboard === 'mood' && <MoodPulsePage />}
      {dashboard === 'readback' && <ReadDaysBack />}
    </div>
  )
}

export default App
