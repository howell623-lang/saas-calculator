import path from "path";
import fs from "fs";
import { listToolSlugs } from "@/lib/tool-loader";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function DebugPage() {
  const cwd = process.cwd();
  const toolsDir = path.join(cwd, "data", "tools");
  const slugs = listToolSlugs();
  const checks = slugs.map((slug) => {
    const filePath = path.join(toolsDir, `${slug}.json`);
    return {
      slug,
      filePath,
      exists: fs.existsSync(filePath),
    };
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-4 px-6 py-10">
      <h1 className="text-2xl font-semibold text-gray-900">Debug</h1>
      <p className="text-sm text-gray-700">cwd: {cwd}</p>
      <p className="text-sm text-gray-700">toolsDir: {toolsDir}</p>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Slugs & files</h2>
        <ul className="mt-2 space-y-2 text-sm text-gray-800">
          {checks.map((item) => (
            <li key={item.slug}>
              {item.slug} → {item.exists ? "exists" : "missing"} ({item.filePath})
            </li>
          ))}
          {checks.length === 0 && <li>No JSON files detected.</li>}
        </ul>
      </div>
    </div>
  );
}
