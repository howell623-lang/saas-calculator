"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ToolConfig } from "@/lib/types";
import { History, ArrowRight } from "lucide-react";

type Props = {
  tools: ToolConfig[];
};

export function RecentTools({ tools }: Props) {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("calcpanda_recent_tools");
    if (saved) {
      try {
        const decoded = JSON.parse(saved);
        if (Array.isArray(decoded)) {
          setRecentSlugs(decoded.slice(0, 4));
        }
      } catch (e) {
        console.error("Failed to parse recent tools", e);
      }
    }
  }, []);

  if (recentSlugs.length === 0) return null;

  const usedTools = recentSlugs
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter((t): t is ToolConfig => !!t);

  if (usedTools.length === 0) return null;

  return (
    <section className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center gap-2 text-indigo-400">
        <History className="h-5 w-5" />
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">Resume Your Work</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {usedTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="group relative overflow-hidden rounded-2xl bg-white/5 p-5 shadow-lg ring-1 ring-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-indigo-500/10"
          >
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-gray-200 group-hover:text-white transition-colors truncate">
                {tool.title}
              </h3>
              <p className="text-[10px] text-gray-500 line-clamp-1">{tool.summary}</p>
              <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100 uppercase tracking-widest">
                Continue <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
