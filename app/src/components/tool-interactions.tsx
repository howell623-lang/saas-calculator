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

    // Initial mock comments
    const mockComments: Comment[] = [
      {
        id: "1",
        author: "Alex Thompson",
        content: "This tool helped me save 2 hours of manual work today. Very accurate!",
        date: "2 days ago",
      },
      {
        id: "2",
        author: "Sarah J.",
        content: "Case Study: Used this for our Q4 planning. The results were within 1% of our professional audit.",
        date: "1 week ago",
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
      <div className="flex items-center gap-4 rounded-2xl bg-gray-900 px-6 py-4 text-white shadow-xl">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          <span className="text-xl">📊</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">Trusted by the community</p>
          <p className="text-lg font-bold">
            {usageCount.toLocaleString()} people used this tool today
          </p>
        </div>
      </div>

      {/* Interaction Section */}
      <section className="rounded-3xl bg-white/80 p-8 shadow-lg shadow-gray-200/60 ring-1 ring-gray-100 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-gray-900">Community Discussion & Cases</h2>
        <p className="mt-2 text-gray-600">
          Share your experience or submit a case study on how you use this tool.
        </p>

        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment or share a case study..."
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 min-h-[100px]"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isCase}
                onChange={(e) => setIsCase(e.target.checked)}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              Mark as User Case Study
            </label>
            <button
              type="submit"
              className="rounded-xl bg-gray-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-black"
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
              className={`rounded-2xl p-6 ring-1 ring-gray-100 ${
                c.isUserCase ? "bg-blue-50/50 border-l-4 border-l-blue-500" : "bg-gray-50/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-900">{c.author}</p>
                <span className="text-xs text-gray-500">{c.date}</span>
              </div>
              {c.isUserCase && (
                <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
                  Case Study
                </span>
              )}
              <p className="mt-3 text-sm leading-relaxed text-gray-700">{c.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
