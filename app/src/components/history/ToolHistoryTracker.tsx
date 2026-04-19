"use client";

import { useEffect } from "react";

type Props = {
  slug: string;
};

export function ToolHistoryTracker({ slug }: Props) {
  useEffect(() => {
    const saved = localStorage.getItem("calcpanda_recent_tools");
    let slugs: string[] = saved ? JSON.parse(saved) : [];
    
    // Remove if already exists to move to front
    slugs = slugs.filter((s) => s !== slug);
    
    // Prepend new slug
    slugs.unshift(slug);
    
    // Limit to 10
    slugs = slugs.slice(0, 10);
    
    localStorage.setItem("calcpanda_recent_tools", JSON.stringify(slugs));
  }, [slug]);

  return null;
}
