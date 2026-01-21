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
        <div className="mt-8 space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
                {config.title || "Visual Breakdown"}
            </h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {config.type === "pie" ? (
                        <PieChart>
                            <Pie
                                data={activeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {activeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number | undefined) => [
                                    value?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? "0",
                                    ""
                                ]}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    ) : (
                        <BarChart data={activeData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                                formatter={(value: number | undefined) => [
                                    value?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? "0",
                                    ""
                                ]}
                                cursor={{ fill: 'transparent' }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
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
