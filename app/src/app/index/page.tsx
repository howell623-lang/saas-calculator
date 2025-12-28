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
        <h1 className="text-4xl font-bold text-gray-900">A-Z Calculator Index</h1>
        <p className="text-lg text-gray-700">
          Browse our complete collection of professional tools, organized alphabetically for your convenience.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2 rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-200">
        {sortedLetters.map(letter => (
          <a 
            key={letter} 
            href={`#letter-${letter}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-gray-900 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-900 hover:text-white"
          >
            {letter}
          </a>
        ))}
      </nav>

      <div className="space-y-12">
        {sortedLetters.map(letter => (
          <section key={letter} id={`letter-${letter}`} className="scroll-mt-10 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-100 pb-2">
              {letter}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groups[letter].sort((a, b) => a.title.localeCompare(b.title)).map(tool => (
                <Link 
                  key={tool.slug} 
                  href={`/${tool.slug}`}
                  className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
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
