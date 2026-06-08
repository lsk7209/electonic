import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/articles";
import { states } from "@/lib/data";
import { siteUrl } from "@/lib/env";
import { guideHubs } from "@/lib/guide-hubs";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const articles = getPublishedArticles(now);
  const urls = [
    "",
    "/compare",
    "/blog",
    "/guides",
    ...guideHubs.map((hub) => hub.path),
    "/rss.xml",
    "/methodology",
    "/editorial-policy",
    "/sources",
    "/about",
    "/contact",
    "/privacy",
    ...states.map((state) => `/${state.slug}`),
    ...states.flatMap((state) => state.utilities.map((utility) => `/${state.slug}/${utility.slug}`)),
    ...states.flatMap((state) => [`/save/${state.slug}`, `/assistance/${state.slug}`]),
    ...articles.map((article) => `/guides/${article.slug}`)
  ];

  return urls.map((url) => ({
    url: `${siteUrl}${url}`,
    lastModified: now,
    changeFrequency: url === "" ? "weekly" : "monthly",
    priority: url === "" ? 1 : 0.7
  }));
}
