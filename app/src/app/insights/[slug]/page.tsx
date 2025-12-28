import Link from "next/link";
import { INSIGHTS } from "./page";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function InsightDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = INSIGHTS.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold">Insight not found</h1>
        <Link href="/insights" className="text-blue-600 hover:underline">
          Back to Insights
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-16 md:py-24">
      <Link
        href="/insights"
        className="text-sm font-semibold text-gray-600 transition hover:text-gray-900"
      >
        ← Back to all insights
      </Link>

      <article className="space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-sm text-gray-500">{article.date}</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
            {article.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed italic">
            {article.summary}
          </p>
        </header>

        <div className="prose prose-gray max-w-none border-t border-gray-100 pt-8 text-gray-700">
          <p className="whitespace-pre-wrap leading-loose">
            {article.content}
            {"\n\n"}
            At CalcPanda, our mission is to provide more than just raw numbers. Through our case studies, we demonstrate how precision calculation tools can impact real-world outcomes.
            {"\n\n"}
            In this specific scenario, we utilized our specialized <strong>{article.relatedTool.replace(/-/g, ' ')}</strong> to model complex variables. Whether you are looking to optimize financial interest or track health trends, having a validated logic engine is the first step toward better decisions.
          </p>
        </div>

        <section className="mt-12 rounded-3xl bg-gray-900 p-8 text-white shadow-xl">
          <h2 className="text-2xl font-bold">Put this into practice</h2>
          <p className="mt-2 text-gray-400">
            Ready to run your own numbers? Use the same tool featured in this case study.
          </p>
          <div className="mt-6">
            <Link
              href={`/${article.relatedTool}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-gray-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-gray-100"
            >
              Try the {article.title.split(":")[0]} tool
              <span aria-hidden>↗</span>
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
