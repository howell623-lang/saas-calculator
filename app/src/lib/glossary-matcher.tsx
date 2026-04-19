import React from "react";
import { GlossaryTooltip } from "@/components/glossary-tooltip";
import { GlossaryEntry } from "./types";

/**
 * Scans text for glossary terms and wraps them in Tooltip components.
 * Returns a React element tree.
 */
export function matchGlossaryTerms(text: string, glossary: GlossaryEntry[]) {
  if (!text) return text;

  // 1. Sort terms by length descending to match longer terms first (e.g., "Monthly Churn" before "Churn")
  const sortedGlossary = [...glossary].sort((a, b) => b.term.length - a.term.length);
  
  // 2. Create the massive search regex
  const terms = sortedGlossary
    .map(g => g.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escape special characters
    .join('|');
  
  // Use word boundaries \b to avoid matching sub-strings (e.g., matching "CAC" inside "CACKLE")
  const regex = new RegExp(`\\b(${terms})\\b`, 'gi');

  // 3. Split and map
  const parts = text.split(regex);
  const result: (string | React.ReactNode)[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (i % 2 === 1) { // This part matched one of the terms
      const matchingEntry = sortedGlossary.find(g => g.term.toLowerCase() === part.toLowerCase());
      if (matchingEntry) {
        result.push(
          <GlossaryTooltip key={`${part}-${i}`} entry={matchingEntry}>
            {part}
          </GlossaryTooltip>
        );
      } else {
        result.push(part);
      }
    } else {
      result.push(part);
    }
  }

  return <span>{result}</span>;
}
