"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ToolConfig } from "@/lib/types";
import { Search, Command, Calculator, Clock, Star } from "lucide-react";

type Props = {
  tools: ToolConfig[];
};

export function CommandCenter({ tools }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("calcpanda_recent_tools");
    if (saved) {
      setRecentSlugs(JSON.parse(saved).slice(0, 3));
    }
  }, [isOpen]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const filtered = useMemo(() => {
    if (!query) return [];
    return tools.filter(
      (t) =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.slug.toLowerCase().includes(query.toLowerCase()) ||
        t.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 8);
  }, [query, tools]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/80 p-4 pt-[10vh] backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl ring-1 ring-white/10 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/5 p-4">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            autoFocus
            className="flex-1 bg-transparent text-lg text-white outline-none placeholder:text-gray-500"
            placeholder="Search 100+ tools... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider ring-1 ring-white/10">
            <Command className="h-3 w-3" /> K
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query ? (
            filtered.length > 0 ? (
              <div className="space-y-1">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-left">Search Results</p>
                {filtered.map((tool) => (
                  <button
                    key={tool.slug}
                    onClick={() => {
                      router.push(`/${tool.slug}`);
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-2xl p-4 text-left transition-all hover:bg-white/5 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20 group-hover:bg-blue-500/20">
                        <Calculator className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-gray-200 group-hover:text-white">{tool.title}</span>
                        <span className="text-xs text-gray-500 line-clamp-1">{tool.summary}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-400 opacity-0 group-hover:opacity-100 uppercase tracking-widest">Jump</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-sm text-gray-500 italic">No tools found for "{query}"</div>
            )
          ) : (
            <div className="space-y-4">
               {recentSlugs.length > 0 && (
                <div className="space-y-1">
                  <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-left">Recently Viewed</p>
                  {recentSlugs.map((slug) => {
                    const tool = tools.find(t => t.slug === slug);
                    if (!tool) return null;
                    return (
                      <button
                        key={slug}
                        onClick={() => {
                          router.push(`/${slug}`);
                          setIsOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-2xl p-4 text-left transition-all hover:bg-white/5 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                            <Clock className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-gray-300">
                             {tool.title}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="space-y-1">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-left">Quick Actions</p>
                <button
                  onClick={() => { router.push("/insights"); setIsOpen(false); }}
                  className="flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all hover:bg-white/5 group"
                >
                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
                    <Star className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-gray-300">Browse Expert Insights</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between border-t border-white/5 bg-black/20 px-4 py-3 text-[10px] text-gray-500 uppercase tracking-tighter">
          <span>Arrows to navigate</span>
          <span>Enter to select</span>
          <span>ESC to close</span>
        </div>
      </div>
      <div 
        className="fixed inset-0 -z-10" 
        onClick={() => setIsOpen(false)}
      />
    </div>
  );
}
