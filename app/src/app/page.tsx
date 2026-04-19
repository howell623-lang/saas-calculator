import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { AdsToggle } from "@/components/ads-toggle";
import { loadAllToolConfigs } from "@/lib/tool-loader";
import { ToolsDirectory } from "@/components/tools-directory";
import { INSIGHTS } from "@/lib/insights-data";
import { FavoritesManager } from "@/components/favorites-manager";
import { RecentTools } from "@/components/history/RecentTools";
import { QuickJumpGlossary } from "@/components/quick-jump-glossary";

export default function Home() {
  const tools = loadAllToolConfigs();
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-16 md:py-20">
      <header className="flex flex-col gap-6 rounded-3xl bg-white/5 p-10 shadow-2xl shadow-indigo-500/10 ring-1 ring-white/10 backdrop-blur-xl md:flex-row md:items-center md:justify-between transition-all duration-500 hover:bg-white/10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="Panda logo">🐼</span>
            <p className="text-xl font-bold tracking-tight text-white drop-shadow-md">
              CalcPanda
            </p>
            <span className="h-4 w-px bg-white/20" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Calculator Hub
            </p>
          </div>
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-white via-blue-100 to-indigo-300 bg-clip-text text-transparent sm:text-4xl drop-shadow-sm">
            Professional tools for every decision
          </h1>
           <p className="max-w-2xl text-lg text-gray-400">
            Professional mini-tools for SaaS growth, finance, health, and engineering. 
            Now featuring <span className="text-indigo-400 font-bold">Expert Strategy Diagnostics</span> to turn your data into actionable growth logic.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={tools.length ? `/${tools[0].slug}` : "#"}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-blue-500/40 active:scale-95 group"
            >
              Try a popular tool
              <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 active:scale-95"
            >
              Why choose us
            </a>
            <AdsToggle />
          </div>
        </div>
        <div className="w-full max-w-sm rounded-2xl bg-indigo-600/10 px-6 py-5 text-white shadow-xl shadow-indigo-900/20 ring-1 ring-indigo-500/30 backdrop-blur-md transition-all hover:bg-indigo-600/20">
          <h2 className="text-lg font-extrabold text-indigo-300 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            Expert Diagnostic Suite
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-300">
            <li className="flex items-center gap-2 font-medium">✨ Logic-Based Analysis</li>
            <li className="flex items-center gap-2 font-medium">📊 Advanced SaaS Economics</li>
            <li className="flex items-center gap-2">• Institutional Formulae</li>
            <li className="flex items-center gap-2">• Expert Growth Case Studies</li>
            <li className="flex items-center gap-2">• 100% Private & Locally Computed</li>
          </ul>
        </div>
      </header>

      {/* Featured Insight Banner - Moved to 2nd position */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900/50 p-8 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-xl md:p-12 transition-all hover:ring-blue-500/30 group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-block rounded-full bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30 px-3 py-1 text-xs font-bold uppercase tracking-widest">
              Featured Insight
            </span>
            <h2 className="text-3xl font-bold md:text-4xl">
              {INSIGHTS[0].title}
            </h2>
            <p className="text-gray-300 text-lg">
              {INSIGHTS[0].summary}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href={`/insights/${INSIGHTS[0].slug}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
              >
                Read Full Story
              </Link>
              <Link
                href={`/${INSIGHTS[0].relatedTool}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-6 py-3 text-sm font-bold text-white ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 active:scale-95"
              >
                Try the Calculator
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative h-40 w-40 animate-pulse rounded-full bg-blue-500/20 blur-3xl" />
            <span className="absolute right-20 top-1/2 -translate-y-1/2 text-8xl opacity-20 select-none">📈</span>
          </div>
        </div>
      </section>

      {/* More Insights Grid */}
      <section className="grid gap-6 md:grid-cols-2">
        {INSIGHTS.slice(1, 3).map((article) => (
          <div key={article.slug} className="group relative overflow-hidden rounded-3xl bg-white/5 p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-500/20 hover:bg-white/10 ring-1 ring-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 uppercase tracking-wider ring-1 ring-blue-500/20">
                {article.category}
              </span>
              <span className="text-xs text-gray-500">{article.date}</span>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-100 group-hover:text-blue-400 transition-colors duration-300">
              <Link href={`/insights/${article.slug}`}>
                <span className="absolute inset-0" />
                {article.title}
              </Link>
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">
              {article.summary}
            </p>
          </div>
        ))}
      </section>

      <AdSlot slotName="home-top" note="Sponsored" />

      <QuickJumpGlossary tools={tools} />

      <RecentTools tools={tools} />

      <section className="space-y-6" id="categories">
        <div className="flex items-center gap-2 text-indigo-400">
           <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">Explore Categories</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "SaaS Business", icon: "🚀", id: "saas", tools: ["saas-unit-economics", "startup-equity-dilution", "startup-breakeven-analyzer"] },
            { name: "Finance", icon: "💰", id: "finance", tools: ["loan-amortization-calculator", "cagr-calculator", "mortgage-extra-payment"] },
            { name: "Health", icon: "🏥", id: "health", tools: ["bmi-calculator", "calorie-deficit-weight-loss", "macronutrient-calculator"] },
            { name: "Engineering", icon: "⚙️", id: "engineering", tools: ["beam-span-deflection-estimate-simplified-wood-joist", "concrete-slab-calculator", "hvac-duct-sizing-cfm-velocity-friction-loss"] },
          ].map(cat => (
            <div key={cat.name} id={cat.id} className="group scroll-mt-20 rounded-3xl bg-white/5 p-6 shadow-lg ring-1 ring-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-cyan-500/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{cat.icon}</span>
                <h3 className="font-bold text-gray-100">{cat.name}</h3>
              </div>
              <ul className="space-y-2">
                {cat.tools.slice(0, 3).map(t => {
                  const tool = tools.find(x => x.slug === t);
                  return (
                    <li key={t}>
                      <Link href={`/${t}`} className="text-sm text-gray-400 transition-colors hover:text-cyan-400 truncate block">
                        • {tool?.title || t.replace(/-/g, ' ')}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="grid gap-6 rounded-3xl bg-white/5 p-10 shadow-xl ring-1 ring-white/10 backdrop-blur-xl md:grid-cols-3"
      >
        {[
          {
            title: "1) Pick a tool",
            body: "Daily, pets, engineering, health, and more—choose what you need.",
          },
          {
            title: "2) Enter data",
            body: "Follow the prompts and get instant results with clear labels.",
          },
          {
            title: "3) Save favorites",
            body: "Come back anytime, or switch to ad-free mode for a focused view.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="group rounded-2xl border border-white/5 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-400 group-hover:text-cyan-300 transition-colors">
              {item.title}
            </p>
            <p className="mt-3 text-sm text-gray-300">{item.body}</p>
          </div>
        ))}
      </section>



      {/* Did You Know Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/80 to-indigo-900/80 p-8 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-xl md:p-10 border border-white/10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">
          <div className="text-6xl">💡</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-blue-100">Did you know?</h2>
            <p className="text-lg text-blue-200/80 max-w-3xl leading-relaxed">
              Using a strict <strong className="text-white">Debt Avalanche</strong> strategy (paying highest interest first) typically saves the average American household over <strong className="text-white">$4,500</strong> in interest payments compared to random payments? Check out our <Link href="/loan-amortization-calculator" className="font-bold underline decoration-blue-400/50 underline-offset-4 hover:decoration-blue-400 hover:text-white transition-all">Amortization Tool</Link> to simulate your savings.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-12 rounded-3xl bg-white/5 p-10 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-3xl font-bold text-white">Professional Calculation Factory</h2>
          <p className="text-lg leading-8 text-gray-300">
            Welcome to CalcPanda, your premier destination for precise and reliable calculation tools. In an era where data drives decisions, we provide a streamlined, high-performance platform that transforms complex formulas into instant answers. Our "Micro-SaaS Factory" approach ensures that whether you are a financial analyst, a health enthusiast, or an engineer, you have access to specialized tools designed with accuracy and user experience in mind.
          </p>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold text-white">Why Accuracy Matters</h3>
              <p className="mt-2 text-gray-400">
                A single decimal point can change a financial projection or a medical dosage. That's why every tool on CalcPanda is built using validated formulas and undergoes rigorous logic testing. We don't just provide numbers; we provide peace of mind through transparency and precision.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Community & Innovation</h3>
              <p className="mt-2 text-gray-400">
                CalcPanda is more than just a toolset; it's a growing ecosystem. We listen to our users and constantly expand our library based on real-world needs. From multi-leg flight carbon estimators to complex debt snowball accelerators, our tools are crafted to solve actual problems faced by our global community.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">The CalcPanda Standard</h3>
            <p className="text-gray-300 mb-6">
              We operate under a strict "Verification First" policy. Unlike content farms that auto-generate pages, our tools follow a manual review pipeline:
            </p>
            <ul className="grid gap-4 sm:grid-cols-2">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs ring-1 ring-emerald-500/30">1</span>
                <div>
                  <h4 className="font-bold text-white">Source Verification</h4>
                  <p className="text-sm text-gray-400">Formulas are sourced directly from government (IRS, WHO) or academic documentation.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs ring-1 ring-emerald-500/30">2</span>
                <div>
                  <h4 className="font-bold text-white">Code Audit</h4>
                  <p className="text-sm text-gray-400">Logic is unit-tested against known datasets to ensure computational parity.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs ring-1 ring-emerald-500/30">3</span>
                <div>
                  <h4 className="font-bold text-white">Expert Review</h4>
                  <p className="text-sm text-gray-400">Explanations are reviewed by domain experts to ensure context is accurate.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs ring-1 ring-emerald-500/30">4</span>
                <div>
                  <h4 className="font-bold text-white">Regular Specificity</h4>
                  <p className="text-sm text-gray-400">We update tools annually to reflect changing tax laws, health guidelines, and economic conditions.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 border-t border-white/10 pt-10 text-sm font-medium text-gray-400">
          <Link href="/insights" className="hover:text-white transition-colors font-bold text-gray-200">Insights & Cases</Link>
          <Link href="/index" className="hover:text-white transition-colors font-bold text-gray-200">A-Z Index</Link>
          <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
        </div>
      </section>
    </div >
  );
}
// Trigger build at Mon Dec 29 10:22:51 CST 2025
// Final verification sync at Tue Dec 30 07:20:54 CST 2025
