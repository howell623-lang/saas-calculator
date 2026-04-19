"use client";

import { useEffect, useState, useCallback } from "react";
import { ListTree, ArrowDown } from "lucide-react";

type Props = {
  selectors: string;
};

type Heading = {
  id: string;
  text: string;
  level: number;
};

export function SidebarTOC({ selectors }: Props) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const findHeadings = () => {
      const elements = Array.from(document.querySelectorAll(selectors));
      const mapped = elements.map((el, i) => {
        if (!el.id) {
          el.id = `heading-${i}-${el.textContent?.toLowerCase().replace(/\s+/g, "-")}`;
        }
        return {
          id: el.id,
          text: el.textContent || "",
          level: parseInt(el.tagName[1]) || 2,
        };
      });
      setHeadings(mapped);
    };

    findHeadings();
    
    // Re-check after a brief delay for any hydrated content
    const timer = setTimeout(findHeadings, 1000);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-10% 0% -40% 0%", threshold: 0 }
    );

    document.querySelectorAll(selectors).forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [selectors]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100; // Account for sticky header
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveId(id);
    }
  }, []);

  if (headings.length < 2) return null;

  return (
    <aside className="sticky top-24 hidden h-fit max-w-[200px] flex-col gap-6 lg:flex no-print animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex items-center gap-2 text-indigo-400">
        <ListTree className="h-4 w-4" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Navigation</span>
      </div>
      
      <nav className="relative">
        <div className="absolute left-0 top-0 h-full w-[1px] bg-white/5" />
        <ul className="space-y-4">
          {headings.map((h) => (
            <li 
              key={h.id} 
              className={`relative pl-4 transition-all duration-300 ${
                h.level > 2 ? "ml-3" : ""
              }`}
            >
              <div 
                className={`absolute left-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full transition-all duration-300 ${
                  activeId === h.id ? "bg-indigo-400 scale-150 shadow-[0_0_8px_rgba(129,140,248,0.8)]" : "bg-white/10"
                }`} 
              />
              <button
                onClick={() => scrollTo(h.id)}
                className={`block text-left text-[11px] font-bold transition-colors hover:text-indigo-300 ${
                  activeId === h.id ? "text-indigo-300" : "text-gray-500"
                }`}
              >
                {h.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-4 flex flex-col gap-2 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Pro Strategist Tip</p>
        <p className="text-[10px] leading-relaxed text-gray-400">
          Analyze every metric in context. A high CAC is only a risk if LTV is stagnant.
        </p>
      </div>

      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="group flex items-center gap-2 text-[10px] font-bold text-gray-500 transition-colors hover:text-white"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 transition-transform group-hover:-translate-y-1">
          <ArrowDown className="h-3 w-3 rotate-180" />
        </div>
        Back to Top
      </button>
    </aside>
  );
}
