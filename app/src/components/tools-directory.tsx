"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ToolConfig } from "@/lib/types";

type Props = {
  tools: ToolConfig[];
};

export function ToolsDirectory({ tools }: Props) {
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    tools.forEach((tool) => {
      (tool.tags || []).forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 30);
  }, [tools]);

  const [showMore, setShowMore] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesSearch =
        !term ||
        tool.title.toLowerCase().includes(term) ||
        (tool.summary || "").toLowerCase().includes(term) ||
        (tool.tags || []).some((t) => t.toLowerCase().includes(term));
      const matchesTag =
        !tagFilter || (tool.tags || []).some((tag) => tag === tagFilter);
      return matchesSearch && matchesTag;
    });
  }, [search, tagFilter, tools]);

  const displayedTools = useMemo(() => {
    if (showMore || search.trim() !== "" || tagFilter !== null) {
      return filtered;
    }
    return filtered.slice(0, 10);
  }, [filtered, showMore, search, tagFilter]);

  return (
    <section className="space-y-6 rounded-3xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-blue-400">
            Directory
          </p>
          <h2 className="text-2xl font-semibold text-white drop-shadow-sm">
            Browse and search {tools.length} calculators
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {tagFilter && (
            <button
              onClick={() => setTagFilter(null)}
              className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-blue-500/40 active:scale-95"
            >
              Clear tag: {tagFilter}
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.4fr_2.6fr]">
        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-300">Search</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, tags, or keywords..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 hover:bg-white/10"
            />
          </label>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-300">Top tags</p>
            <div className="flex flex-wrap gap-2">
              {tagCounts.map(([tag, count]) => (
                <button
                  key={tag}
                  onClick={() => setTagFilter((prev) => (prev === tag ? null : tag))}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 active:scale-95 ${tagFilter === tag
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-blue-500"
                      : "bg-white/5 text-gray-300 ring-1 ring-white/10 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {tag} <span className="text-[10px] opacity-70">({count})</span>
                </button>
              ))}
              {tagCounts.length === 0 && (
                <span className="text-xs text-gray-500">No tags available.</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              Showing {filtered.length} of {tools.length}
              {tagFilter ? ` • tag: ${tagFilter}` : ""}
              {search ? ` • search: "${search}"` : ""}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {displayedTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="group flex h-full flex-col justify-between rounded-2xl bg-white/5 p-5 shadow-lg ring-1 ring-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-cyan-500/20 active:scale-[0.98]"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-gray-100 group-hover:text-white transition-colors">
                      {tool.title}
                    </h3>
                    <span className="text-sm text-gray-500 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-blue-400">↗</span>
                  </div>
                  {tool.summary ? (
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {tool.summary}
                    </p>
                  ) : null}
                  {tool.tags?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300 ring-1 ring-blue-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <p className="mt-4 text-sm font-semibold text-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Open tool
                </p>
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="rounded-2xl bg-white/5 p-6 text-sm text-gray-300 ring-1 ring-white/10">
                No tools match your search/tag. Clear filters to see all.
              </div>
            )}
          </div>

          {!showMore &&
            filtered.length > 10 &&
            search.trim() === "" &&
            tagFilter === null && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setShowMore(true)}
                  className="rounded-2xl bg-white/5 px-6 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 active:scale-95 hover:shadow-cyan-500/20"
                >
                  Show all {filtered.length} calculators
                </button>
              </div>
            )}
        </div>
      </div>
    </section>
  );
}
