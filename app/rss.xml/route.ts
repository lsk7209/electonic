import { getPublishedArticles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/env";

export const revalidate = 3600;

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const articles = getPublishedArticles();
  const items = articles.map((article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${absoluteUrl(`/guides/${article.slug}`)}</link>
      <guid>${absoluteUrl(`/guides/${article.slug}`)}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <pubDate>${new Date(article.scheduledAt).toUTCString()}</pubDate>
    </item>
  `).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>WattBench electric bill blog</title>
    <link>${absoluteUrl("/blog")}</link>
    <description>Electricity rates, average bill estimates, savings, and assistance guides.</description>
    <language>en-US</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
