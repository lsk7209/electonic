import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SourceBadge } from "@/components/SourceBadge";
import { articleIntent, getPublishedArticles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Electric bill blog: rates, savings, and assistance guides",
  description: "Electric bill blog with guides about electricity rates, average bills, time-of-use pricing, LIHEAP help, and regulated versus competitive markets.",
  path: "/blog"
});

const topicPaths = [
  {
    title: "Start with the bill",
    description: "Use these guides when the bill feels high, confusing, or hard to compare.",
    links: [
      { href: "/guides/average-electric-bill-guide", label: "Average electric bill guide" },
      { href: "/guides/electric-bill-normal-check", label: "Is my electric bill normal?" },
      { href: "/guides/high-kwh-low-rate-diagnosis", label: "High kWh with a low rate" }
    ]
  },
  {
    title: "Find the load",
    description: "Use these when an appliance, HVAC system, EV, or solar setup may be moving usage.",
    links: [
      { href: "/guides/air-conditioner-electricity-cost", label: "Air conditioner electricity cost" },
      { href: "/guides/ev-charging-electric-bill", label: "EV charging electric bill" },
      { href: "/guides/electric-bill-after-solar", label: "Electric bill after solar" }
    ]
  },
  {
    title: "Handle payment pressure",
    description: "Use these when timing, arrears, or assistance matters more than another estimate.",
    links: [
      { href: "/guides/electric-bill-past-due-plan", label: "Past-due electric bill plan" },
      { href: "/guides/liheap-electric-bill-documents", label: "LIHEAP documents" },
      { href: "/guides/budget-billing-pros-cons", label: "Budget billing pros and cons" }
    ]
  }
];

const categoryPriority = ["Cornerstone", "Bill shock", "Tools", "Assistance", "Appliances", "Efficiency", "EV", "Rate changes", "State guides"];

export default function BlogPage() {
  const articles = getPublishedArticles();
  const cornerstone = articles.find((article) => article.slug === "average-electric-bill-guide");
  const remainingArticles = cornerstone ? articles.filter((article) => article.slug !== cornerstone.slug) : articles;
  const categoryClusters = [...articles.reduce((clusters, article) => {
    const existing = clusters.get(article.category) || { category: article.category, count: 0, articles: [] as typeof articles };
    clusters.set(article.category, { ...existing, count: existing.count + 1, articles: [...existing.articles, article].slice(0, 3) });
    return clusters;
  }, new Map<string, { category: string; count: number; articles: typeof articles }>()).values()]
    .sort((a, b) => {
      const aPriority = categoryPriority.indexOf(a.category);
      const bPriority = categoryPriority.indexOf(b.category);
      if (aPriority !== -1 || bPriority !== -1) return (aPriority === -1 ? 99 : aPriority) - (bPriority === -1 ? 99 : bPriority);
      return b.count - a.count || a.category.localeCompare(b.category);
    })
    .slice(0, 9);

  return (
    <main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Blog",
            name: "WattBench electric bill blog",
            url: absoluteUrl("/blog"),
            blogPost: articles.map((article) => ({
              "@type": "BlogPosting",
              headline: article.title,
              description: article.excerpt,
              url: absoluteUrl(`/guides/${article.slug}`)
            }))
          },
          {
            "@type": "ItemList",
            name: "Electric bill topic paths",
            itemListElement: topicPaths.flatMap((path, groupIndex) => path.links.map((link, index) => ({
              "@type": "ListItem",
              position: groupIndex * 10 + index + 1,
              name: link.label,
              url: absoluteUrl(link.href)
            })))
          },
          {
            "@type": "ItemList",
            name: "Electric bill content categories",
            itemListElement: categoryClusters.map((cluster, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: `${cluster.category} guides`,
              description: `${cluster.count} published guide${cluster.count === 1 ? "" : "s"}`
            }))
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") }
            ]
          }
        ]
      }} />
      <section className="hero">
        <div className="container hero-copy">
          <SourceBadge />
          <h1>Electric bill blog</h1>
          <p>Editorial explanations paired with calculators, source links, and data cards so each guide is useful beyond a single fact.</p>
        </div>
      </section>
      {cornerstone && (
        <section className="section">
          <div className="container blog-feature">
            <div>
              <span className="chip">Start here</span>
              <h2 className="serif">{cornerstone.title}</h2>
              <p>{cornerstone.subtitle}</p>
              <p className="muted">{cornerstone.excerpt}</p>
              <div className="meta-row">
                <Link className="button" href={`/guides/${cornerstone.slug}`}>Read the hub guide</Link>
                <Link className="button-secondary" href="/compare">Compare states</Link>
              </div>
            </div>
            <div className="detail-block detail-block-table">
              <p className="eyebrow">Reading path</p>
              <h2>Choose your next step</h2>
              <div className="detail-rows">
                <div className="detail-row"><strong>High usage</strong><span>Diagnose kWh</span><p>Start with the load before blaming the rate.</p></div>
                <div className="detail-row"><strong>High rate</strong><span>Compare context</span><p>Use state benchmarks, then read the bill line items.</p></div>
                <div className="detail-row"><strong>Hard to pay</strong><span>Check help</span><p>Move toward assistance or payment options before arrears grow.</p></div>
              </div>
            </div>
          </div>
        </section>
      )}
      <section className="section surface">
        <div className="container">
          <div className="section-head">
            <h2>Topic paths</h2>
            <p className="muted">The guides are grouped by what the reader needs to decide next.</p>
          </div>
          <div className="grid-3">
            {topicPaths.map((path) => (
              <div key={path.title} className="card card-pad topic-path">
                <h3>{path.title}</h3>
                <p className="muted">{path.description}</p>
                {path.links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Content clusters</h2>
            <p className="muted">Scan the strongest guide groups before opening the full article list.</p>
          </div>
          <div className="cluster-grid">
            {categoryClusters.map((cluster) => (
              <div key={cluster.category} className="card card-pad cluster-card">
                <div className="meta-row">
                  <span className="chip">{cluster.category}</span>
                  <span className="muted">{cluster.count} guides</span>
                </div>
                {cluster.articles.map((article) => (
                  <Link key={`${cluster.category}-${article.slug}`} href={`/guides/${article.slug}`}>
                    <span>{article.title}</span>
                    <span className="intent-badge">{articleIntent(article)}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          {remainingArticles.map((article) => (
            <Link key={article.slug} href={`/guides/${article.slug}`} className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="meta-row">
                <span className="chip" style={{ width: "fit-content" }}>{article.category}</span>
                <span className="intent-badge">{articleIntent(article)}</span>
              </div>
              <h2 className="serif" style={{ fontSize: 32 }}>{article.title}</h2>
              <p><strong>{article.subtitle}</strong></p>
              <p className="muted">{article.excerpt}</p>
              <div className="keyword-strip compact" aria-label="Article keywords">
                <span>{article.mainKeyword}</span>
                {article.expandedKeywords.slice(0, 2).map((keyword) => <span key={keyword}>{keyword}</span>)}
              </div>
              <span className="muted">{article.date} - WattBench Data Desk</span>
              <span className="button-secondary" style={{ width: "fit-content" }}>Read guide</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
