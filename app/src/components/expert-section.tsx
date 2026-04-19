"use client";

import { ToolConfig } from "@/lib/types";
import { ShieldCheck, Calendar, BookOpen } from "lucide-react";

type Props = {
    config: ToolConfig;
};

export function ExpertSection({ config }: Props) {
    if (!config.reviewer && !config.sources?.length) return null;

    return (
        <section className="space-y-6 rounded-3xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl transition-all hover:bg-white/10">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                {config.reviewer && (
                    <div className="space-y-4 max-w-md">
                        <div className="flex items-center gap-2 text-emerald-400">
                            <ShieldCheck className="h-5 w-5" />
                            <span className="text-sm font-bold uppercase tracking-wider">Expert Verified Logic</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5 shadow-lg">
                                <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-900 font-bold text-white text-xl">
                                    {config.reviewer.name.charAt(0)}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{config.reviewer.name}</h3>
                                <p className="text-sm text-gray-400">{config.reviewer.role}</p>
                            </div>
                        </div>
                        <p className="text-sm leading-6 text-gray-400">
                            This tool's mathematical formulas and diagnostic logic have been audited to ensure compliance with {config.reviewer.role} standards as of {config.reviewer.verificationDate}.
                        </p>
                    </div>
                )}

                {config.sources && config.sources.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-400">
                            <BookOpen className="h-5 w-5" />
                            <span className="text-sm font-bold uppercase tracking-wider">Verification Sources</span>
                        </div>
                        <ul className="space-y-3">
                            {config.sources.map((source, i) => (
                                <li key={i} className="flex items-center gap-3 group">
                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-600 group-hover:bg-blue-400 transition-colors" />
                                    {source.url ? (
                                        <a 
                                            href={source.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-gray-400 hover:text-white transition-colors underline decoration-gray-700 underline-offset-4"
                                        >
                                            {source.name}
                                        </a>
                                    ) : (
                                        <span className="text-sm font-medium text-gray-400">{source.name}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4 items-center text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Last logic audit: {config.reviewer?.verificationDate || config.updatedAt}</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-gray-700" />
                <span>Verification ID: CP-{config.slug.substring(0, 4).toUpperCase()}-2026</span>
            </div>
        </section>
    );
}
