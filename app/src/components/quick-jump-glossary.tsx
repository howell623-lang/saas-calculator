"use client";

import Link from "next/link";
import { ToolConfig } from "@/lib/types";

type Props = {
    tools: ToolConfig[];
};

export function QuickJumpGlossary({ tools }: Props) {
    // Group tools by first letter
    const grouped = tools.reduce((acc, tool) => {
        const letter = tool.title[0].toUpperCase();
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(tool);
        return acc;
    }, {} as Record<string, ToolConfig[]>);

    const letters = Object.keys(grouped).sort();

    return (
        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900">A-Z Quick Jump</h2>
                <Link href="/index" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                    View Full Index →
                </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {letters.map((letter) => (
                    <div key={letter} className="space-y-2">
                        <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                            {letter}
                        </span>
                        <ul className="space-y-1">
                            {grouped[letter].slice(0, 3).map((tool) => (
                                <li key={tool.slug}>
                                    <Link
                                        href={`/${tool.slug}`}
                                        className="block truncate text-sm text-gray-600 transition hover:text-gray-900 hover:underline"
                                        title={tool.title}
                                    >
                                        {tool.title}
                                    </Link>
                                </li>
                            ))}
                            {grouped[letter].length > 3 && (
                                <li>
                                    <span className="text-xs text-gray-400 italic">
                                        + {grouped[letter].length - 3} more
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
