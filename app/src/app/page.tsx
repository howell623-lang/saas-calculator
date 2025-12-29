import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { AdsToggle } from "@/components/ads-toggle";
import { loadAllToolConfigs } from "@/lib/tool-loader";
import { ToolsDirectory } from "@/components/tools-directory";
import { INSIGHTS } from "./insights/page";
import { FavoritesManager } from "@/components/favorites-manager";

export default function Home() {
  const tools = loadAllToolConfigs();
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-16 md:py-20">
      <header className="flex flex-col gap-6 rounded-3xl bg-white/70 p-10 shadow-lg shadow-gray-200/60 ring-1 ring-gray-100 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="Panda logo">🐼</span>
            <p className="text-xl font-bold tracking-tight text-gray-900">
              CalcPanda
            </p>
            <span className="h-4 w-px bg-gray-300" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Calculator Hub
            </p>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
            Professional tools for every decision
          </h1>
          <p className="max-w-2xl text-lg text-gray-700">
            One-stop mini tools for daily life, pets, engineering, and health. Enter your data to get precise results instantly.
            Optional ad-free mode for a distraction-free experience.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={tools.length ? `/${tools[0].slug}` : "#"}
              className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-gray-900/20 transition hover:-translate-y-0.5 hover:bg-black"
            >
              Try a popular tool
              <span aria-hidden>↗</span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:ring-gray-900/20"
            >
              Why choose us
            </a>
            <AdsToggle />
          </div>
        </div>
        <div className="w-full max-w-sm rounded-2xl bg-gray-900 px-6 py-5 text-white shadow-xl shadow-gray-900/30">
          <h2 className="text-lg font-semibold">What you get</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-100">
            <li>• No sign-up, ready to use</li>
            <li>• Accurate logic, instant results</li>
            <li>• Optional ad-free mode</li>
            <li>• More tools added regularly</li>
            <li>• Works on mobile and desktop</li>
          </ul>
        </div>
      </header>

      {/* Featured Insight Banner - Moved to 2nd position */}
      <section className="relative overflow-hidden rounded-3xl bg-gray-900 p-8 text-white shadow-2xl md:p-12">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-block rounded-full bg-blue-500 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
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
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-gray-900 transition hover:bg-gray-100"
              >
                Read Full Story
              </Link>
              <Link
                href={`/${INSIGHTS[0].relatedTool}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-3 text-sm font-bold text-white ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/20"
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

      <AdSlot slotName="home-top" note="Sponsored" />

      <FavoritesManager tools={tools} />

      <ToolsDirectory tools={tools} />

      <section className="space-y-6" id="categories">
        <h2 className="text-2xl font-bold text-gray-900">Explore by Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Finance", icon: "💰", id: "finance", tools: ["loan-amortization-calculator", "cagr-calculator", "mortgage-extra-payment"] },
            { name: "Health", icon: "🏥", id: "health", tools: ["bmi-calculator", "calorie-deficit-weight-loss", "macronutrient-calculator"] },
            { name: "Engineering", icon: "⚙️", id: "engineering", tools: ["advanced-structural-beam-analysis", "concrete-slab-calculator", "hvac-duct-sizing-cfm-velocity-friction-loss"] },
            { name: "Lifestyle", icon: "🌟", id: "lifestyle", tools: ["dog-chocolate-toxicity-calculator", "garden-plant-spacing-yield", "home-emergency-kit-cost-duration"] }
          ].map(cat => (
            <div key={cat.name} id={cat.id} className="scroll-mt-20 rounded-3xl bg-white/60 p-6 shadow-sm ring-1 ring-gray-100 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="font-bold text-gray-900">{cat.name}</h3>
              </div>
              <ul className="space-y-2">
                {cat.tools.slice(0, 3).map(t => {
                  const tool = tools.find(x => x.slug === t);
                  return (
                    <li key={t}>
                      <Link href={`/${t}`} className="text-sm text-gray-600 hover:text-blue-600 transition truncate block">
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
        className="grid gap-6 rounded-3xl bg-white/80 p-10 shadow-lg shadow-gray-200/60 ring-1 ring-gray-100 backdrop-blur-sm md:grid-cols-3"
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
            className="rounded-2xl border border-gray-100 bg-gray-50 p-6"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-500">
              {item.title}
            </p>
            <p className="mt-3 text-sm text-gray-700">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="space-y-12 rounded-3xl bg-white/80 p-10 shadow-lg shadow-gray-200/60 ring-1 ring-gray-100 backdrop-blur-sm">
        <div className="prose prose-gray max-w-none">
          <h2 className="text-3xl font-bold text-gray-900">Professional Calculation Factory</h2>
          <p className="text-lg leading-8 text-gray-700">
            Welcome to CalcPanda, your premier destination for precise and reliable calculation tools. In an era where data drives decisions, we provide a streamlined, high-performance platform that transforms complex formulas into instant answers. Our "Micro-SaaS Factory" approach ensures that whether you are a financial analyst, a health enthusiast, or an engineer, you have access to specialized tools designed with accuracy and user experience in mind.
          </p>
          
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Why Accuracy Matters</h3>
              <p className="mt-2 text-gray-700">
                A single decimal point can change a financial projection or a medical dosage. That's why every tool on CalcPanda is built using validated formulas and undergoes rigorous logic testing. We don't just provide numbers; we provide peace of mind through transparency and precision.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Community & Innovation</h3>
              <p className="mt-2 text-gray-700">
                CalcPanda is more than just a toolset; it's a growing ecosystem. We listen to our users and constantly expand our library based on real-world needs. From multi-leg flight carbon estimators to complex debt snowball accelerators, our tools are crafted to solve actual problems faced by our global community.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 border-t border-gray-100 pt-10 text-sm font-medium text-gray-500">
          <Link href="/insights" className="hover:text-gray-900 transition font-bold text-gray-900">Insights & Cases</Link>
          <Link href="/index" className="hover:text-gray-900 transition font-bold text-gray-900">A-Z Index</Link>
          <Link href="/about" className="hover:text-gray-900 transition">About Us</Link>
          <Link href="/privacy" className="hover:text-gray-900 transition">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-900 transition">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-900 transition">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
// Trigger build at Mon Dec 29 10:22:51 CST 2025
