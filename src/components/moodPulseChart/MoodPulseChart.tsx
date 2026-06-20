import React, { useMemo } from 'react';
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ErrorBar,
    BarChart
} from 'recharts';
import './MoodPulseChart.css';


interface MoodDataPoint {
    uuid: string;
    rating: number;
    note: string;
    timestamp: number;
}

interface ChartProps {
    data: MoodDataPoint[];
    onRegenerate: () => void;
}

function groupByDay(data: MoodDataPoint[]) {
    const groups = new Map<String, MoodDataPoint[]>();

    data.forEach((point) => {
        const dayKey = new Date(point.timestamp * 1000).toDateString();

        if (!groups.has(dayKey)) groups.set(dayKey, []);

        groups.get(dayKey)!.push(point);
    });

    return Array.from(groups.values()).map((entries) => {
        const avgRating = entries.reduce((sum, p) => sum + p.rating, 0) / entries.length;

        return {
            rating: avgRating,
            entries,
            note: entries.map(e => e.note).join(' '),
            timestamp: entries[entries.length - 1].timestamp,
        };
    }).sort((a, b) => a.timestamp - b.timestamp);
}

function formatXAxis(tickItem: string, index: number, processedData: any[]) {
    if (index === 0) return processedData[0]?.monthStr || '';

    const prev = processedData[index - 1];

    if (prev && prev.monthStr !== processedData[index]?.monthStr) {
        return processedData[index].monthStr;
    }

    return '';
}

const CustomToolTip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0]?.payload;
    const deviation = data.rating - data.smoothedMood;

    return (
        <div style={{
            backgroundColor: 'var(--color-bg-tooltip)',
            border: '1px solid var(--color-border-tooltip)',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '12px',
        }}>
            <div style={{ color: 'var(--color-text-legend)', fontWeight: 'bold', marginBottom: 4 }}>
                {data.dateStr}
            </div>
            <div style={{ color: 'var(--color-text-muted)' }}>
                Mood: <span style={{ color: 'var(--color-trend-orange)'}}>{data.rating >= 0 ? `+${data.rating.toFixed(2)}` : data.rating.toFixed(2)}</span>
            </div>
            <div style={{ color: 'var(--color-text-muted)' }}>
                Deviation: <span style={{ color: 'var(--color-deviation-yellow)'}}>{deviation >= 0 ? `+${deviation.toFixed(2)}` : deviation.toFixed(2)}</span>
            </div>
            <div style={{ color: 'var(--color-text-muted)' }}>
                Tasks: <span style={{ color: 'var(--color-task-high)'}}>{data.taskValue}</span>
            </div>
            {data.entries.length > 1 && (
                <div style={{ color: 'var(--color-text-muted)', fontSize: 11, marginTop: 4 }}>
                    {data.entries.length} ratings logged ({data.entries.map((e: any) => e.rating).join(', ')})
                </div>
            )}
        </div>
    )
}

export const MoodPulseChart: React.FC<ChartProps> = ({ data, onRegenerate }) => {

    const groupedData = useMemo(() => groupByDay(data), [data]);

    const averageMood = useMemo(() => {
        if (groupedData.length === 0) return 0;

        const sum = groupedData.reduce((acc, point) => acc + point.rating, 0);

        return (sum / groupedData.length).toFixed(2);
    }, [groupedData]);

    const processedData = useMemo(() => {
        return groupedData.map((item, index, arr) => {
            const start = Math.max(0, index - 3);
            const end = Math.min(arr.length, index + 4);
            const subset = arr.slice(start, end);
            const smoothedMood = subset.reduce((sum, p) => sum + p.rating, 0) / subset.length;

            const deviation = item.rating - smoothedMood;
            const errorData = deviation >= 0 ? [0, deviation] : [Math.abs(deviation), 0];

            // Using length of note as a proxy metric for task values
            const taskValue = item.note ? Math.min(100, item.note.length * 2 + Math.floor(Math.random() * 20)) : 10;

            return {
                ...item,
                dateStr: new Date(item.timestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                monthStr: new Date(item.timestamp * 1000).toLocaleDateString('en-US', { month: 'short' }),
                smoothedMood: parseFloat(smoothedMood.toFixed(2)),
                deviationError: errorData,
                taskValue: taskValue
            };
        });
    }, [groupedData]);

    const maxTaskValue = useMemo(
        () => Math.max(...processedData.map(d => d.taskValue)),
        [processedData]
    );

    return (
        <div className="mood-pulse-container">

            {/* Header Section */}
            <div className="mood-pulse-header">
                <div className="mood-pulse-title-group">
                    <span className="chart-label">Mood Pulse</span>
                    <h2>
                        Avg <span>{Number(averageMood) >= 0 ? `+${averageMood}` : averageMood}</span>
                    </h2>
                </div>
                <button onClick={onRegenerate}>Regenerate</button>

                {/* Custom Legend Layout */}
                <div className="mood-pulse-legend">
                    <span className="legend-item">
                        <span className="legend-indicator trend" /> Smoothed mood
                    </span>
                    <span className="legend-item">
                        <span className="legend-indicator deviation" /> Daily deviation
                    </span>
                    <span className="legend-item">
                        <span className="legend-indicator task" /> Task value
                    </span>
                </div>
            </div>

            {/* Chart Canvas Area */}
            <div className="mood-pulse-charts">
                <div className="mood-pulse-chart-main">
                    <ResponsiveContainer width="100%" height="75%" debounce={50}>
                        <ComposedChart data={processedData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-trend-orange)" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="var(--color-trend-orange)" stopOpacity={0.01} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} stroke="var(--color-grid)" />

                            <XAxis
                                dataKey="dateStr"
                                tickFormatter={(tick, index) => formatXAxis(tick, index, processedData)}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--color-axis-text)', fontSize: 11 }}
                                interval={0}
                                orientation='top'
                            />

                            <YAxis
                                yAxisId="mood"
                                domain={[-2.2, 2.2]}
                                ticks={[-2, -1, 0, 1, 2]}
                                tickFormatter={(v) => (v >= 0 ? `+${v}` : v)}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--color-axis-text)', fontSize: 12 }}
                            />

                            <Tooltip content={<CustomToolTip />}/>

                            <Area
                                yAxisId="mood"
                                type="monotone"
                                dataKey="smoothedMood"
                                fill="url(#colorMood)"
                                stroke="none"
                                legendType="none"
                            />

                            <Line
                                yAxisId="mood"
                                name="Smoothed Trend"
                                type="monotone"
                                dataKey="smoothedMood"
                                stroke="var(--color-trend-orange)"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0 }}
                            >
                                <ErrorBar
                                    dataKey="deviationError"
                                    width={0}
                                    stroke="var(--color-deviation-yellow)"
                                    strokeWidth={1.5}
                                    opacity={0.7}
                                />
                            </Line>
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                <div className="mood-pulse-chart-bars">
                    <ResponsiveContainer width="100%" height="100%" debounce={50}>
                        <BarChart data={processedData} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="dateStr" hide />
                            <YAxis domain={[0, maxTaskValue]} />
                            <Bar
                                dataKey="taskValue"
                                fill="var(--color-task-green)"
                                maxBarSize={3}
                                isAnimationActive={false}

                                shape={(props) => {
                                    const { x, y, width, height, value } = props;
                                    const fill = (value as number) / maxTaskValue > 0.6
                                        ? 'var(--color-task-high)'
                                        : 'var(--color-task-low)';
                                    return <rect x={x} y={y} width={width} height={height} fill={fill} />;
                                }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};