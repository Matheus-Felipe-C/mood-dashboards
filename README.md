# Mood Dashboards
A React visualization that display mood trackings in various contexts and styles.

## Getting started

**Prerequisites:** Node.js 18+ and npm or yarn.

```bash
npm install
npm run dev
```

## Project structure

```
src/
├── components/
|───|── moodPulseChart/
│────├── MoodPulseChart.tsx   # Main chart component
│   └── MoodPulseChart.css   # Chart theming via CSS variables
├── utils/
│   └── generateMockMoods.ts # Sample data generator (replace for production)
└── App.tsx                  # Mounts the chart and owns mood data state

```