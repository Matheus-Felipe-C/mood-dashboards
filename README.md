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

## Customization
All colors are controlled by CSS variables in `MoodPulseChart.css`. The most useful ones to override:
 
| Variable | Default | Controls |
|---|---|---|
| `--color-bg-chart` | `#13151a` | Chart background |
| `--color-trend-orange` | `#e67e22` | Smoothed mood line |
| `--color-deviation-yellow` | `#f1c40f` | Daily deviation spikes |
| `--color-task-low` | `#7a6e2a` | Task bars (low activity) |
| `--color-task-high` | `#5a8a3a` | Task bars (high activity) |
| `--color-axis-text` | `#666666` | Axis tick labels |
| `--color-accent-gold` | `#d9a75d` | Average mood value in header |

## Tech choices and constraints
- I chose to compile React into a single file and embed it inside the file `mood-embed.js`, which then gets imported by `plugin.ts`, so it allows esbuild to add it as plain text and get it rendered properly by `RenderEmbed`. 
    - This causes a bit of overhead on the build step, but right now it only takes ~300ms to build, so I think it should be fine.
- Recharts: a famous charting lib for creating charts with React. Due to its overall size, it ended up making the final `plugin.js` file weight about 600kb. 
    - I didn't percieve a noticeable slowdown on my entry level mobile device (where I tested the plugin on), but if it is not acceptable, the dashboard can be rewritten to use only the HTML canvas tag, but with more code work necessary to make it work.
- I used Typescript to type hint the project and make it harder to get bugs due to mismatched types.
