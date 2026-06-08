import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SourceBadge } from "@/components/SourceBadge";
import { getPublishedArticles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/env";
import { guideHubs } from "@/lib/guide-hubs";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Electric bill guides: calculators, rates, savings, and assistance",
  description: "Electric bill guides organized by average bills, kWh usage, electricity rates, appliance costs, EV charging, solar bills, LIHEAP help, and state benchmarks.",
  path: "/guides"
});

const guideGroups = [
  {
    title: "Bill diagnosis",
    description: "Start here when the bill feels high, strange, or hard to compare.",
    slugs: ["average-electric-bill-guide", "electric-bill-normal-check", "high-kwh-low-rate-diagnosis", "low-kwh-high-bill-diagnosis"]
  },
  {
    title: "Appliance and home loads",
    description: "Find the load that moved kWh before chasing rate changes.",
    slugs: ["air-conditioner-electricity-cost", "heat-pump-electric-bill-winter", "electric-water-heater-cost", "refrigerator-electricity-cost"]
  },
  {
    title: "EV and solar",
    description: "Read these when a new energy system changes the bill shape.",
    slugs: ["ev-charging-electric-bill", "electric-bill-after-adding-ev", "electric-bill-after-solar", "solar-with-heat-pump-bill"]
  },
  {
    title: "Payment and assistance",
    description: "Use these when timing, hardship, or documents matter most.",
    slugs: ["electric-bill-past-due-plan", "liheap-electric-bill-documents", "budget-billing-pros-cons", "energy-assistance-vs-budget-billing"]
  }
];

export default function GuidesPage() {
  const articles = getPublishedArticles();
  const articleMap = new Map(articles.map((article) => [article.slug, article]));
  const groupedGuides = guideGroups.map((group) => ({
    ...group,
    articles: group.slugs.map((slug) => articleMap.get(slug)).filter(Boolean)
  }));

  return (
    <main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CollectionPage",
            name: "Electric bill guides",
            description: "Guides for reading, estimating, reducing, and getting help with electric bills.",
            url: absoluteUrl("/guides")
          },
          {
            "@type": "ItemList",
            name: "Electric bill topic hubs",
            itemListElement: guideHubs.map((hub, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: hub.h1,
              url: absoluteUrl(hub.path)
            }))
          },
          {
            "@type": "ItemList",
            name: "Electric bill guide groups",
            itemListElement: groupedGuides.flatMap((group, groupIndex) => group.articles.map((article, index) => ({
              "@type": "ListItem",
              position: groupIndex * 10 + index + 1,
              name: article!.title,
              url: absoluteUrl(`/guides/${article!.slug}`)
            })))
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Guides", item: absoluteUrl("/guides") }
            ]
          }
        ]
      }} />
      <section className="hero">
        <div className="container hero-copy">
          <SourceBadge />
          <h1>Electric bill guides</h1>
          <p>Use this directory to move from a confusing bill to the right calculator, benchmark, appliance check, or assistance guide.</p>
          <div className="meta-row">
            <Link className="button" href="/guides/average-electric-bill-guide">Start with average bills</Link>
            <Link className="button-secondary" href="/blog">Browse the blog</Link>
          </div>
        </div>
      </section>
      <section className="section surface">
        <div className="container">
          <div className="section-head">
            <h2>Topic hubs</h2>
            <p className="muted">Use these hub pages when you already know the kind of bill problem you are solving.</p>
          </div>
          <div className="grid-2">
            {guideHubs.map((hub) => (
              <Link key={hub.path} href={hub.path} className="card card-pad topic-path">
                <span className="chip" style={{ width: "fit-content" }}>{hub.primaryKeywords[0]}</span>
                <h2 className="serif" style={{ fontSize: 30 }}>{hub.h1}</h2>
                <p className="muted">{hub.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          {groupedGuides.map((group) => (
            <div key={group.title} className="card card-pad topic-path">
              <span className="chip" style={{ width: "fit-content" }}>{group.title}</span>
              <h2 className="serif" style={{ fontSize: 32 }}>{group.title}</h2>
              <p className="muted">{group.description}</p>
              {group.articles.map((article) => (
                <Link key={article!.slug} href={`/guides/${article!.slug}`}>{article!.title}</Link>
              ))}
            </div>
          ))}
        </div>
      </section>
      <section className="section surface">
        <div className="container">
          <div className="section-head">
            <h2>All published guides</h2>
            <p className="muted">Scheduled guides appear here after their publish time and are also added to RSS and sitemap output.</p>
          </div>
          <div className="cluster-grid">
            {articles.slice(0, 18).map((article) => (
              <Link key={article.slug} href={`/guides/${article.slug}`} className="card card-pad cluster-card">
                <span className="chip" style={{ width: "fit-content" }}>{article.category}</span>
                <strong>{article.title}</strong>
                <span className="muted">{article.mainKeyword}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
