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
        <section className="rounded-3xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl transition-all duration-500 hover:bg-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">A-Z Quick Jump</h2>
                <Link href="/index" className="text-sm font-semibold text-blue-400 transition-colors hover:text-cyan-300">
                    View Full Index →
                </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {letters.map((letter) => (
                    <div key={letter} className="space-y-2 group">
                        <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-blue-400 transition-colors">
                            {letter}
                        </span>
                        <ul className="space-y-1">
                            {grouped[letter].slice(0, 3).map((tool) => (
                                <li key={tool.slug}>
                                    <Link
                                        href={`/${tool.slug}`}
                                        className="block truncate text-sm text-gray-400 transition-colors hover:text-cyan-400"
                                        title={tool.title}
                                    >
                                        {tool.title}
                                    </Link>
                                </li>
                            ))}
                            {grouped[letter].length > 3 && (
                                <li>
                                    <span className="text-xs text-gray-500 italic">
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
