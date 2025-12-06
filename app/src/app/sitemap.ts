import { listToolSlugs } from "@/lib/tool-loader";
import { MetadataRoute } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = listToolSlugs();
  const now = new Date();
  const freq: MetadataRoute.Sitemap[0]["changeFrequency"] = "weekly";
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: freq,
      priority: 1,
    } satisfies MetadataRoute.Sitemap[number],
    ...slugs.map((slug) =>
      ({
        url: `${baseUrl}/${slug}`,
        lastModified: now,
        changeFrequency: freq,
        priority: 0.8,
      } satisfies MetadataRoute.Sitemap[number])
    ),
  ];
  return entries;
}
