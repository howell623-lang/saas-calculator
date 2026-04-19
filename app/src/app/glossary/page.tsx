import Link from "next/link";
import { GlossaryEntry } from "@/lib/types";
import glossaryData from "../../../data/glossary.json";
import { Book, Search, ArrowLeft, ExternalLink } from "lucide-react";

const glossary = glossaryData as GlossaryEntry[];

export const metadata = {
  title: "Professional Strategy Lexicon | calcpanda.com",
  description: "A comprehensive index of professional terminology used across SaaS, Finance, and Engineering diagnostics.",
};

export default function GlossaryPage() {
  const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term));
  
  // Group by first letter
  const grouped = sorted.reduce((acc, item) => {
    const letter = item.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(item);
    return acc;
  }, {} as Record<string, GlossaryEntry[]>);

  const letters = Object.keys(grouped).sort();

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-6 py-16 md:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-indigo-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Workspace
      </Link>

      <header className="mt-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
            <Book className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-white via-indigo-200 to-indigo-500 bg-clip-text text-transparent tracking-tight">
            Strategy Lexicon
          </h1>
        </div>
        <p className="max-w-2xl text-lg text-gray-400">
           A curated index of high-precision terminology and benchmarks. 
           Expertly verified definitions to power your strategic decision-making.
        </p>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_250px]">
        <div className="space-y-16">
          {letters.map((letter) => (
            <section key={letter} id={`letter-${letter}`} className="scroll-mt-24 space-y-6">
              <h2 className="text-3xl font-black text-white/20 border-b border-white/5 pb-2">
                {letter}
              </h2>
              <div className="grid gap-6">
                {grouped[letter].map((entry) => (
                  <div 
                    key={entry.term} 
                    className="group rounded-3xl border border-white/5 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10 hover:ring-1 hover:ring-indigo-500/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {entry.term}
                          </h3>
                          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                            {entry.category}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-400">
                          {entry.definition}
                        </p>
                        {entry.source && (
                          <p className="text-[10px] italic text-gray-600">Verification Source: {entry.source}</p>
                        )}
                      </div>
                      {entry.relatedSlug && (
                        <Link 
                          href={`/${entry.relatedSlug}`}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-emerald-500/20"
                          title="Open Related Tool"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="sticky top-24 hidden h-fit flex-col gap-8 lg:flex">
          <div className="space-y-4">
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Quick Index</p>
             <div className="flex flex-wrap gap-2">
               {letters.map(l => (
                 <a 
                   key={l}
                   href={`#letter-${l}`}
                   className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-gray-400 transition-colors hover:bg-indigo-500/20 hover:text-indigo-400"
                 >
                   {l}
                 </a>
               ))}
             </div>
          </div>

          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 space-y-3">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">E-E-A-T Verified</h4>
            <p className="text-[11px] leading-relaxed text-indigo-300/60">
              All definitions are cross-referenced with GAAP, WHO, and BVP benchmark standards to ensure institutional-grade calculations.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
