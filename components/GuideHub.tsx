import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SourceBadge } from "@/components/SourceBadge";
import { articlesForGuideHub, type GuideHub } from "@/lib/guide-hubs";
import { articleIntent, getPublishedArticles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/env";

type Props = {
  hub: GuideHub;
};

export function GuideHubPage({ hub }: Props) {
  const articles = getPublishedArticles();
  const { featured, clustered } = articlesForGuideHub(hub, articles);
  const visibleArticles = [...featured, ...clustered];

  return (
    <main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CollectionPage",
            name: hub.h1,
            description: hub.description,
            url: absoluteUrl(hub.path),
            keywords: hub.primaryKeywords
          },
          {
            "@type": "ItemList",
            name: `${hub.h1} article list`,
            itemListElement: visibleArticles.map((article, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: article.title,
              url: absoluteUrl(`/guides/${article.slug}`)
            }))
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Guides", item: absoluteUrl("/guides") },
              { "@type": "ListItem", position: 3, name: hub.h1, item: absoluteUrl(hub.path) }
            ]
          }
        ]
      }} />
      <section className="hero">
        <div className="container hero-copy">
          <SourceBadge />
          <span className="chip" style={{ width: "fit-content" }}>Topic hub</span>
          <h1>{hub.h1}</h1>
          <p>{hub.description}</p>
          <div className="keyword-strip compact" aria-label={`${hub.h1} keywords`}>
            {hub.primaryKeywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
          </div>
          <div className="meta-row">
            <Link className="button" href="/guides/average-electric-bill-guide">Start with the bill guide</Link>
            <Link className="button-secondary" href="/guides">All guide topics</Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Featured guides</h2>
            <p className="muted">Start with these articles when this topic is the main reason the bill changed.</p>
          </div>
          <div className="grid-2">
            {featured.map((article) => (
              <Link key={article.slug} href={`/guides/${article.slug}`} className="card card-pad topic-path">
                <div className="meta-row">
                  <span className="chip" style={{ width: "fit-content" }}>{article.category}</span>
                  <span className="intent-badge">{articleIntent(article)}</span>
                </div>
                <h2 className="serif" style={{ fontSize: 30 }}>{article.title}</h2>
                <p><strong>{article.subtitle}</strong></p>
                <p className="muted">{article.excerpt}</p>
                <span className="button-secondary" style={{ width: "fit-content" }}>Read guide</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {clustered.length > 0 && (
        <section className="section surface">
          <div className="container">
            <div className="section-head">
              <h2>More {hub.h1.toLowerCase()}</h2>
              <p className="muted">These supporting guides build topical depth around the same bill decision.</p>
            </div>
            <div className="cluster-grid">
              {clustered.map((article) => (
                <Link key={article.slug} href={`/guides/${article.slug}`} className="card card-pad cluster-card">
                  <div className="meta-row">
                    <span className="chip" style={{ width: "fit-content" }}>{article.category}</span>
                    <span className="intent-badge">{articleIntent(article)}</span>
                  </div>
                  <strong>{article.title}</strong>
                  <span className="muted">{article.mainKeyword}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
