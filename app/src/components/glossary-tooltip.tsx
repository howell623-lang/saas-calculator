"use client";

import React, { useState } from "react";
import { GlossaryEntry } from "@/lib/types";
import Link from "next/link";
import { Info, ExternalLink } from "lucide-react";

type Props = {
  entry: GlossaryEntry;
  children: React.ReactNode;
};

export function GlossaryTooltip({ entry, children }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
    >
      <span className="cursor-help border-b border-dotted border-indigo-400/60 text-indigo-300 transition-colors hover:text-indigo-200 hover:border-indigo-300/80">
        {children}
      </span>
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 z-[110] mb-3 w-72 -translate-x-1/2 animate-in fade-in zoom-in-95 duration-200">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
            <div className="flex items-center justify-between gap-2 border-b border-white/5 bg-white/5 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/30">
                  <Info className="h-3 w-3" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white">{entry.term}</span>
              </div>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{entry.category}</span>
            </div>
            
            <div className="p-4 space-y-3">
              <p className="text-xs leading-relaxed text-gray-300">
                {entry.definition}
              </p>
              
              {entry.source && (
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                   <span className="font-semibold uppercase text-gray-600">Trust Source:</span>
                   <span className="italic">{entry.source}</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-1 border-t border-white/5">
                <Link 
                  href="/glossary" 
                  className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Lexicon Index
                </Link>
                {entry.relatedSlug && (
                  <Link 
                    href={`/${entry.relatedSlug}`}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Open Tool <ExternalLink className="h-2.5 w-2.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1.5 rotate-45 bg-slate-900 border-b border-r border-white/10 shadow-xl" />
        </div>
      )}
    </span>
  );
}
