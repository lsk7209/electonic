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
      <section className="section">
        <div className="reading prose">
          <h2>How to use these guides without treating a benchmark as your bill</h2>
          <p>Start by separating usage from price. A bill can rise because the home used more kWh, because the billing period was longer, because a rate or fee changed, or because a new load such as cooling, electric heat, or vehicle charging appeared. The articles in this topic hub are arranged to help narrow that question before a reader changes equipment, chooses a plan, or contacts a provider.</p>
          <p>For a first pass, save one or two recent bills and note the billing days, total kWh, energy charge, delivery or fixed charges, and any plan name shown on the statement. Compare like with like: a hot month should be compared with another hot month, and a 35-day bill should not be compared with a 28-day bill as though they were identical. A state average can provide context, but it cannot tell a household what its exact tariff should charge.</p>
          <h2>Public data and source checks</h2>
          <p>wattbenchs uses U.S. Energy Information Administration data as a public benchmark. The <a href="https://api.eia.gov/v2/electricity/retail-sales/data/" target="_blank" rel="noreferrer">EIA retail-sales API</a> supplies monthly residential average-rate context by state. Utility references use the annual <a href="https://www.eia.gov/electricity/data/eia861/" target="_blank" rel="noreferrer">EIA-861 electric power industry data</a>. Both sources are useful for orientation, but neither is a live quote, a bill correction, or a promise about a future rate.</p>
          <p>Before acting on a rate-plan, delivery-charge, or assistance article, open the current tariff, bill insert, agency notice, or program page that applies to the service address. Program funding, application windows, document requirements, account status, and utility rules can change. The guides explain questions to ask and records to gather; the provider or administering agency decides account-specific charges and eligibility.</p>
          <p>The <Link href="/sources">source register</Link> explains which EIA series supports each benchmark, while the <Link href="/methodology">methodology</Link> explains the calculation boundary. If a figure appears out of date, use the <Link href="/contact">correction route</Link> with the page URL and a public source. That allows the site to distinguish a useful benchmark from a claim that needs a source update.</p>
          <h2>Decision sequence</h2>
          <ol>
            <li>Read the bill line by line before assuming a rate increase caused the total.</li>
            <li>Use the relevant guide to identify the next evidence: usage history, tariff sheet, appliance runtime, or a program notice.</li>
            <li>Use the EIA benchmark to frame a question, not to replace the utility&apos;s current account terms.</li>
            <li>Confirm changes directly with the utility, provider, or assistance office before enrolling, paying, or relying on a deadline.</li>
          </ol>
        </div>
      </section>
    </main>
  );
}
