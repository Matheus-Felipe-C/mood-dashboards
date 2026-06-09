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
}

export const MoodPulseChart: React.FC<ChartProps> = ({ data }) => {

    const processedData = useMemo(() => {
        return data.map((item, index, arr) => {
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
    }, [data]);

    const maxTaskValue = useMemo(
        () => Math.max(...processedData.map(d => d.taskValue)),
        [processedData]
    );

    const formatXAxis = (tickItem: string, index: number) => {
        if (index === 0) return processedData[index]?.monthStr || '';
        const prev = processedData[index - 1];
        if (prev && prev.monthStr !== processedData[index].monthStr) {
            return processedData[index].monthStr;
        }
        return '';
    };

    return (
        <div className="mood-pulse-container">

            {/* Header Section */}
            <div className="mood-pulse-header">
                <div className="mood-pulse-title-group">
                    <span className="chart-label">Mood Pulse</span>
                    <h2>
                        Avg <span>+1.04</span>
                    </h2>
                </div>

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
                    <ResponsiveContainer width="100%" height="75%">
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
                                tickFormatter={formatXAxis}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--color-axis-text)', fontSize: 11 }}
                                interval={0}
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

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--color-bg-tooltip)',
                                    borderColor: 'var(--color-border-tooltip)',
                                    borderRadius: '6px'
                                }}
                                itemStyle={{ color: 'var(--color-text-main)' }}
                                labelStyle={{ color: 'var(--color-text-muted)', fontWeight: 'bold' }}
                                formatter={(value: any, name: any, props: any) => {
                                    const nameStr = String(name);

                                    // Safely extract the raw value as a string/number if it exists
                                    const displayValue = Array.isArray(value) ? value.join(' - ') : (value ?? '');

                                    if (nameStr === "Smoothed Trend") {
                                        return [displayValue, "Mood Trend"];
                                    }
                                    if (nameStr === "Task Value") {
                                        return [props.payload?.note ? "Logged" : "None", "Activity"];
                                    }

                                    return [displayValue, nameStr];
                                }}
                            />

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
                    <ResponsiveContainer width="100%" height="100%">
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