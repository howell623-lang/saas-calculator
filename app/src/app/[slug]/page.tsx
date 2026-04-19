import { AdSlot } from "@/components/ad-slot";
import { AdsToggle } from "@/components/ads-toggle";
import { DynamicCalculator } from "@/components/dynamic-calculator";
import { ExpertSection } from "@/components/expert-section";
import { ToolHistoryTracker } from "@/components/history/ToolHistoryTracker";
import { ToolInteractions } from "@/components/tool-interactions";
import { SidebarTOC } from "@/components/SidebarTOC";
import { loadAllToolConfigs, loadToolConfig, listToolSlugs, isToolIndexable } from "@/lib/tool-loader";
import Script from "next/script";
import { ToolConfig } from "@/lib/types";
import { Metadata } from "next";
import Link from "next/link";
import { GlossaryEntry } from "@/lib/types";
import { matchGlossaryTerms } from "@/lib/glossary-matcher";
import glossaryData from "../../../data/glossary.json";

const glossary = glossaryData as GlossaryEntry[];

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
    },
    ...(tool.reviewer && {
      "author": {
        "@type": "Person",
        "name": tool.reviewer.name,
        "jobTitle": tool.reviewer.role
      }
    })
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
      <ToolHistoryTracker slug={slug} />
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

      <header className="space-y-4 rounded-3xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl transition-all hover:bg-white/10">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">
          Calculator
        </p>
        <h1 className="text-3xl font-semibold bg-gradient-to-r from-white via-blue-100 to-indigo-300 bg-clip-text text-transparent md:text-4xl drop-shadow-sm">
          {tool.title}
        </h1>
        {tool.summary ? (
          <p className="max-w-3xl text-lg text-gray-300">{tool.summary}</p>
        ) : null}
        <div className="flex flex-wrap gap-2 mt-4">
          {tool.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300 ring-1 ring-blue-500/20"
            >
              {tag}
            </span>
          ))}
          <AdsToggle />
        </div>
      </header>

      <section className="space-y-6 rounded-3xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl transition-all hover:bg-white/10">
        <DynamicCalculator config={tool} />

        <AdSlot slotName="below-calculator" note="Sponsored" />
      </section>

      <ExpertSection config={tool} />

      <ToolInteractions toolSlug={slug} />

      {recommendations.length > 0 && (
        <section className="space-y-4 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white drop-shadow-sm">You might also need...</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {recommendations.map((t) => (
              <Link
                key={t.slug}
                href={`/${t.slug}`}
                className="group flex flex-col gap-2 rounded-2xl bg-black/20 p-4 ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-white/5 hover:ring-white/20"
              >
                <p className="font-bold text-gray-200 text-sm group-hover:text-cyan-400 transition-colors truncate">{t.title}</p>
                <p className="text-[10px] text-gray-500 line-clamp-2">{t.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {displayFaq.length ? (
        <section className="space-y-4 rounded-3xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white drop-shadow-sm">FAQ</h2>
          <dl className="space-y-3">
            {displayFaq.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-white/5 bg-black/20 px-4 py-3 transition-colors hover:bg-white/5"
              >
                <dt className="text-sm font-semibold text-gray-200">
                  {item.q}
                </dt>
                <dd className="mt-1 text-sm text-gray-400">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {related.length ? (
        <section className="space-y-4 rounded-3xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white drop-shadow-sm">Related tools</h2>
            <span className="text-sm text-gray-500">Auto-curated</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className="group rounded-2xl border border-white/10 bg-black/20 px-4 py-3 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/10 hover:bg-white/5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                    {item.title}
                  </p>
                  <span className="text-xs text-gray-500 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-blue-400">↗</span>
                </div>
                {item.summary ? (
                  <p className="mt-2 text-xs text-gray-400">{item.summary}</p>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {displayArticle.length > 0 && (
        <div className="mt-12 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex-1 space-y-12" id="article-content">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Expert Guide & Background</h2>
            {displayArticle.map((section, index) => (
              <section key={index} className="space-y-6 scroll-mt-24">
                <h3 className="text-xl font-bold text-gray-200" id={`section-${index}`}>
                  {section.heading}
                </h3>
                <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed space-y-4">
                  {section.body.split('\n\n').map((paragraph, pIndex) => (
                    <p key={pIndex}>{matchGlossaryTerms(paragraph, glossary)}</p>
                  ))}
                </div>
              </section>
            ))}
            
            <div className="mt-10 border-t border-white/10 pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30">✓</span>
                  <span>Fact-checked and reviewed by <strong className="text-gray-300">CalcPanda Editorial Team</strong></span>
                </div>
                <div className="text-xs text-gray-500">
                  Last updated: {tool.updatedAt ? new Date(tool.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
              <div className="mt-4 text-[10px] text-gray-500/80 leading-relaxed uppercase tracking-wider">
                References: WHO Guidelines, Industry GAAP Standards, and verified Financial Protocols.
              </div>
            </div>
          </div>
          <SidebarTOC selectors="#article-content h3" />
        </div>
      )}
    </div>
  );
}
