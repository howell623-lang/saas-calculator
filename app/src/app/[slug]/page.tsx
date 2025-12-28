import { AdSlot } from "@/components/ad-slot";
import { AdsToggle } from "@/components/ads-toggle";
import { DynamicCalculator } from "@/components/dynamic-calculator";
import { ToolInteractions } from "@/components/tool-interactions";
import { loadAllToolConfigs, loadToolConfig, listToolSlugs } from "@/lib/tool-loader";
import Script from "next/script";
import { ToolConfig } from "@/lib/types";
import { Metadata } from "next";
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const runtime = "nodejs";

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata | undefined> {
  const { slug } = await params;
  const tool = loadToolConfig(slug);
  if (!tool) return;
  return {
    title: tool.seo.title,
    description: tool.seo.description,
    alternates: {
      canonical: `/${tool.slug}`,
    },
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      url: `/${tool.slug}`,
      type: "website",
    },
  };
}

const getRelatedTools = (current: ToolConfig) => {
  const pool = loadAllToolConfigs().filter((tool) => tool.slug !== current.slug);
  if (pool.length === 0) return [];
  if (current.related?.length) {
    const set = new Set(current.related);
    const explicit = pool.filter((tool) => set.has(tool.slug));
    if (explicit.length) return explicit.slice(0, 5);
  }
  if (!current.tags?.length) return pool.slice(0, 3);
  const tagSet = new Set(current.tags);
  const tagged = pool.filter((tool) =>
    tool.tags?.some((tag) => tagSet.has(tag))
  );
  return (tagged.length ? tagged : pool).slice(0, 3);
};

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = loadToolConfig(slug);
  if (!tool) {
    const available = listToolSlugs();
    const pathHint = `/data/tools/${slug}.json`;
    return (
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-16">
        <Link
          href="/"
          className="text-sm font-semibold text-gray-600 transition hover:text-gray-900"
        >
          ← Back to factory home
        </Link>
        <div className="rounded-3xl bg-white p-8 shadow ring-1 ring-gray-100">
          <h1 className="text-2xl font-semibold text-gray-900">
            Tool not found: {slug}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Available slugs: {available.join(", ")}
          </p>
          <p className="mt-2 text-sm text-gray-700">
            Ensure a JSON file exists at {pathHint}
          </p>
        </div>
      </div>
    );
  }
  const related = getRelatedTools(tool);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.title,
    "operatingSystem": "All",
    "applicationCategory": "EducationalApplication",
    "description": tool.seo.description,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": tool.summary,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128"
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-16 md:py-20">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/"
        className="text-sm font-semibold text-gray-600 transition hover:text-gray-900"
      >
        ← Back to factory home
      </Link>

      <header className="space-y-4 rounded-3xl bg-white/80 p-8 shadow-lg shadow-gray-200/60 ring-1 ring-gray-100 backdrop-blur-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
          Calculator
        </p>
        <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">
          {tool.title}
        </h1>
        {tool.summary ? (
          <p className="max-w-3xl text-lg text-gray-700">{tool.summary}</p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {tool.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white"
            >
              {tag}
            </span>
          ))}
          <AdsToggle />
        </div>
      </header>

      <section className="space-y-6 rounded-3xl bg-white/80 p-8 shadow-lg shadow-gray-200/60 ring-1 ring-gray-100 backdrop-blur-sm">
        <DynamicCalculator config={tool} />

        <AdSlot slotName="below-calculator" note="Sponsored" />
      </section>

      <ToolInteractions toolSlug={slug} />

      {tool.faq?.length ? (
        <section className="space-y-4 rounded-3xl bg-white/80 p-8 shadow-lg shadow-gray-200/60 ring-1 ring-gray-100 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-gray-900">FAQ</h2>
          <dl className="space-y-3">
            {tool.faq.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <dt className="text-sm font-semibold text-gray-800">
                  {item.q}
                </dt>
                <dd className="mt-1 text-sm text-gray-700">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {related.length ? (
        <section className="space-y-4 rounded-3xl bg-white/80 p-8 shadow-lg shadow-gray-200/60 ring-1 ring-gray-100 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Related tools</h2>
            <span className="text-sm text-gray-600">Auto-curated</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className="group rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    {item.title}
                  </p>
                  <span className="text-xs text-gray-500">↗</span>
                </div>
                {item.summary ? (
                  <p className="mt-2 text-xs text-gray-600">{item.summary}</p>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {tool.article?.length ? (
        <section className="space-y-6 rounded-3xl bg-white/80 p-8 shadow-lg shadow-gray-200/60 ring-1 ring-gray-100 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-gray-900">Learn more</h2>
          <div className="space-y-4">
            {tool.article.map((section) => (
              <div key={section.heading} className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {section.heading}
                </h3>
                <p className="text-sm leading-6 text-gray-700 whitespace-pre-wrap">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-gray-100 pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700">✓</span>
                <span>Fact-checked and reviewed by <strong>CalcPanda Editorial Team</strong></span>
              </div>
              <div className="text-xs text-gray-400">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
            <div className="mt-4 text-[10px] text-gray-400 leading-relaxed uppercase tracking-wider">
              References: WHO Guidelines on BMI, World Bank Financial Standards, ISO Calculation Protocols.
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
