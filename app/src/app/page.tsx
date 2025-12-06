import Link from "next/link";
import { AdsToggle } from "@/components/ads-toggle";
import { loadAllToolConfigs } from "@/lib/tool-loader";
import { ToolsDirectory } from "@/components/tools-directory";

export default function Home() {
  const tools = loadAllToolConfigs();
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-16 md:py-20">
      <header className="flex flex-col gap-6 rounded-3xl bg-white/70 p-10 shadow-lg shadow-gray-200/60 ring-1 ring-gray-100 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Calculator Hub
          </p>
          <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
            Fast, accurate calculators in one place
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

      <ToolsDirectory tools={tools} />

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
    </div>
  );
}
