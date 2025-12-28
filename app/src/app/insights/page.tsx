import Link from "next/link";

export type Article = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  relatedTool: string;
  content: string;
};

export const INSIGHTS: Article[] = [
  {
    slug: "how-to-optimize-mortgage-payments",
    title: "How to Optimize Your Mortgage Payments in a High-Interest Environment",
    summary: "Real-world case study on using amortization tools to save over $50,000 in interest payments.",
    date: "Dec 28, 2025",
    category: "Finance",
    relatedTool: "loan-amortization-calculator",
    content: "Using the professional Loan Amortization Calculator, we analyzed a $400,000 mortgage..."
  },
  {
    slug: "tracking-health-metrics-effectively",
    title: "Beyond the Scale: Tracking Health Metrics Effectively",
    summary: "Why BMI is just one part of the story and how to use health calculators for a holistic view.",
    date: "Dec 27, 2025",
    category: "Health",
    relatedTool: "bmi-calculator",
    content: "When using the Professional BMI Calculator, it's important to consider muscle mass..."
  }
];

export default function InsightsPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-16 md:py-20">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900">CalcPanda Insights</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Deep dives, case studies, and professional guides on how to make the most of our calculation tools.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {INSIGHTS.map((article) => (
          <article key={article.slug} className="group flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 uppercase tracking-wider">
                {article.category}
              </span>
              <span className="text-xs text-gray-500">{article.date}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition">
              {article.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {article.summary}
            </p>
            <div className="mt-auto pt-4 flex items-center justify-between">
              <Link href={`/insights/${article.slug}`} className="text-sm font-bold text-gray-900 hover:underline">
                Read full case study →
              </Link>
              <Link href={`/${article.relatedTool}`} className="text-[10px] bg-gray-100 px-2 py-1 rounded-md text-gray-500 font-mono">
                Used tool: {article.relatedTool}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
