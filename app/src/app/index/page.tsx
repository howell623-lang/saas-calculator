import Link from "next/link";
import { loadAllToolConfigs } from "@/lib/tool-loader";

export default function IndexPage() {
  const tools = loadAllToolConfigs();

  // Group tools by first letter
  const groups = tools.reduce((acc, tool) => {
    const letter = tool.title[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);

  const sortedLetters = Object.keys(groups).sort();

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-16 md:py-20">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">A-Z Calculator Index</h1>
        <p className="text-lg text-gray-400">
          Browse our complete collection of professional tools, organized alphabetically for your convenience.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-md">
        {sortedLetters.map(letter => (
          <Link
            key={letter}
            href={`#letter-${letter}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/20 text-sm font-bold text-gray-300 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:text-white hover:ring-blue-500 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
          >
            {letter}
          </Link>
        ))}
      </nav>

      <div className="space-y-12">
        {sortedLetters.map(letter => (
          <section key={letter} id={`letter-${letter}`} className="scroll-mt-10 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b-2 border-white/10 pb-2">
              {letter}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groups[letter].sort((a, b) => a.title.localeCompare(b.title)).map(tool => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="group rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-cyan-500/20 active:scale-95"
                >
                  <p className="font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors">
                    {tool.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 line-clamp-1">{tool.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
