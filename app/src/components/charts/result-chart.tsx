"use client";

import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    Label,
} from "recharts";
import { ChartConfig, ToolResult } from "@/lib/types";

type Props = {
    config: ChartConfig;
    results: ToolResult;
};

export function ResultChart({ config, results }: Props) {
    const data = config.data.map((item) => ({
        name: item.label,
        value: Number(results[item.key] || 0),
        color: item.color,
    }));

    // Filter out zero values for cleaner charts
    const activeData = data.filter((d) => d.value > 0);

    if (activeData.length === 0) return null;

    return (
        <div className="mt-8 space-y-6 rounded-2xl border border-white/5 bg-white/5 p-6 shadow-xl backdrop-blur-md">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                {config.title || "Visual Data Breakdown"}
            </h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {config.type === "pie" ? (
                        <PieChart>
                            <Pie
                                data={activeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                            >
                                {activeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                itemStyle={{ color: '#f1f5f9' }}
                                formatter={(value: number | undefined) => [
                                    value?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? "0",
                                    ""
                                ]}
                            />
                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold' }} />
                        </PieChart>
                    ) : (
                        <BarChart data={activeData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                itemStyle={{ color: '#f1f5f9' }}
                                formatter={(value: number | undefined) => [
                                    value?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? "0",
                                    ""
                                ]}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            {config.benchmarks?.map((bm, index) => (
                                <ReferenceLine
                                    key={index}
                                    y={bm.value}
                                    stroke={bm.color}
                                    strokeDasharray="5 5"
                                >
                                    <Label
                                        value={bm.label}
                                        position="insideTopRight"
                                        fill={bm.color}
                                        fontSize={10}
                                        fontWeight="bold"
                                    />
                                </ReferenceLine>
                            ))}
                            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                                {activeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
