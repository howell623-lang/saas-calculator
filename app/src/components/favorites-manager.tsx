"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ToolConfig } from "@/lib/types";

type Props = {
  tools: ToolConfig[];
};

export function FavoritesManager({ tools }: Props) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("calcpanda_favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  const favoriteTools = favorites
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean) as ToolConfig[];

  if (!isLoaded || favorites.length === 0) return null;

  return (
    <section className="space-y-4 rounded-3xl bg-blue-900/20 p-8 ring-1 ring-blue-500/30 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="text-xl">❤️</span>
        <h2 className="text-xl font-bold text-blue-300">Your Favorite Tools</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {favoriteTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="group flex flex-col gap-1 rounded-2xl bg-black/20 p-4 shadow-lg ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/5 hover:shadow-cyan-500/20"
          >
            <p className="font-bold text-gray-200 text-sm truncate group-hover:text-cyan-400 transition-colors">{tool.title}</p>
            <p className="text-[10px] text-gray-500 truncate">{tool.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
