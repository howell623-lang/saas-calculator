"use client";

import { useState, useEffect, useMemo } from "react";

type Comment = {
  id: string;
  author: string;
  content: string;
  date: string;
  isUserCase?: boolean;
};

type Props = {
  toolSlug: string;
};

export function ToolInteractions({ toolSlug }: Props) {
  const [usageCount, setUsageCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isCase, setIsCase] = useState(false);

  // Simulate usage count based on slug hash + daily random
  useEffect(() => {
    const hash = toolSlug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const base = (hash % 500) + 100;
    const daily = Math.floor(Date.now() / 86400000) % 50;
    setUsageCount(base + daily);

    // Dynamic mock comments based on tool
    const authors = ["Michael R.", "Jessica W.", "David L.", "Emma B.", "Chris P.", "Anna S."];
    const commentPool = [
      `Just used this ${toolSlug.replace(/-/g, ' ')} for my project, very reliable results.`,
      "Exactly what I was looking for, saved me a lot of time on formulas.",
      "The explanation at the bottom is very helpful to understand the logic.",
      "Professional tool, will definitely bookmark this.",
      "Interface is clean and the calculation is instantaneous.",
      "Helping our team with daily estimations, great work!"
    ];

    const seed = hash % authors.length;
    const mockComments: Comment[] = [
      {
        id: "1",
        author: authors[seed],
        content: commentPool[seed],
        date: `${(hash % 5) + 1} days ago`,
      },
      {
        id: "2",
        author: authors[(seed + 1) % authors.length],
        content: `Case Study: We integrated this ${toolSlug.replace(/-/g, ' ')} into our weekly workflow. It significantly improved our accuracy.`,
        date: `${(hash % 3) + 2} weeks ago`,
        isUserCase: true,
      },
    ];
    setComments(mockComments);
  }, [toolSlug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: "Guest User",
      content: newComment,
      date: "Just now",
      isUserCase: isCase,
    };

    setComments([comment, ...comments]);
    setNewComment("");
    setIsCase(false);
  };

  return (
    <div className="space-y-8 mt-10">
      {/* Usage Stats */}
      <div className="flex items-center gap-4 rounded-2xl bg-white/5 px-6 py-4 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 ring-1 ring-blue-500/30">
          <span className="text-xl">📊</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">Trusted by the community</p>
          <p className="text-lg font-bold text-gray-100">
            {usageCount.toLocaleString()} people used this tool today
          </p>
        </div>
      </div>

      {/* Interaction Section */}
      <section className="rounded-3xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl transition-all duration-500 hover:bg-white/10">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">Community Discussion & Cases</h2>
        <p className="mt-2 text-gray-400">
          Share your experience or submit a case study on how you use this tool.
        </p>

        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment or share a case study..."
            className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white/5 focus:ring-2 focus:ring-blue-500/50 hover:bg-white/5 min-h-[100px]"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={isCase}
                onChange={(e) => setIsCase(e.target.checked)}
                className="rounded border-gray-500 bg-black/20 text-blue-500 focus:ring-blue-500/50"
              />
              Mark as User Case Study
            </label>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-blue-500/40 active:scale-95"
            >
              Post
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="mt-8 space-y-6">
          {comments.map((c) => (
            <div
              key={c.id}
              className={`rounded-2xl p-6 ring-1 ring-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/5 ${c.isUserCase ? "bg-blue-900/20 border-l-4 border-l-blue-500" : "bg-black/20"
                }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-100">{c.author}</p>
                <span className="text-xs text-gray-500">{c.date}</span>
              </div>
              {c.isUserCase && (
                <span className="mt-1 inline-block rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 uppercase ring-1 ring-blue-500/30">
                  Case Study
                </span>
              )}
              <p className="mt-3 text-sm leading-relaxed text-gray-300">{c.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
