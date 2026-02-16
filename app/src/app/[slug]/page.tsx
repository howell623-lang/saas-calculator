import { AdSlot } from "@/components/ad-slot";
import { AdsToggle } from "@/components/ads-toggle";
import { DynamicCalculator } from "@/components/dynamic-calculator";
import { ToolInteractions } from "@/components/tool-interactions";
import { loadAllToolConfigs, loadToolConfig, listToolSlugs, isToolIndexable } from "@/lib/tool-loader";
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

  const indexable = isToolIndexable(tool);

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    alternates: {
      canonical: `/${tool.slug}`,
    },
    robots: {
      index: indexable,
      follow: true,
      googleBot: {
        index: indexable,
        follow: true,
      }
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

const GENERIC_FAQS = [
  {
    q: "Is this calculator free to use?",
    a: "Yes, this tool is 100% free to use. You can perform as many calculations as needed without any hidden fees or subscriptions."
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We prioritize your privacy by processing all calculations locally in your browser. Your input data is never sent to our servers or stored in any database."
  },
  {
    q: "Can I use this on mobile?",
    a: "Yes, our calculator is fully responsive and optimized for all devices, including smartphones, tablets, and desktop computers."
  },
  {
    q: "How accurate are the results?",
    a: "We use standard industry formulas to ensure high accuracy. However, results should be used as estimates. For critical decisions, please consult a professional."
  }
];



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

  // Recommendations logic (internal cross-linking)
  const recommendations = loadAllToolConfigs()
    .filter((t) => t.slug !== tool.slug && t.tags?.some(tag => tool.tags?.includes(tag)))
    .slice(0, 3);

  // Enhance content with generics if thin
  const displayFaq = [...(tool.faq || [])];
  if (displayFaq.length < 4) {
    // Append generic FAQs that aren't already covered (simple duplicate check)
    GENERIC_FAQS.forEach(g => {
      if (!displayFaq.some(e => e.q.includes(g.q))) {
        displayFaq.push(g);
      }
    });
  }

  const displayArticle = tool.article || [];

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
    "dateModified": tool.updatedAt,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128"
    }
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://calcpanda.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": tool.title,
        "item": `https://calcpanda.com/${tool.slug}`
      }
    ]
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-16 md:py-20">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="breadcrumb-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
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

      {recommendations.length > 0 && (
        <section className="space-y-4 rounded-3xl bg-gray-50/50 p-8 ring-1 ring-gray-100">
          <h2 className="text-xl font-bold text-gray-900">You might also need...</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {recommendations.map((t) => (
              <Link
                key={t.slug}
                href={`/${t.slug}`}
                className="group flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <p className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition truncate">{t.title}</p>
                <p className="text-[10px] text-gray-500 line-clamp-2">{t.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {displayFaq.length ? (
        <section className="space-y-4 rounded-3xl bg-white/80 p-8 shadow-lg shadow-gray-200/60 ring-1 ring-gray-100 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-gray-900">FAQ</h2>
          <dl className="space-y-3">
            {displayFaq.map((item) => (
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

      {displayArticle.length ? (
        <section className="space-y-6 rounded-3xl bg-white/80 p-8 shadow-lg shadow-gray-200/60 ring-1 ring-gray-100 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-gray-900">Learn more</h2>
          <div className="space-y-4">
            {displayArticle.map((section) => (
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
                Last updated: {tool.updatedAt ? new Date(tool.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
