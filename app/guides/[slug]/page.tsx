import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Estimator } from "@/components/Estimator";
import { JsonLd } from "@/components/JsonLd";
import { SourceBadge } from "@/components/SourceBadge";
import { articleIntent, articles, getArticle, getRelatedArticles, isPublished } from "@/lib/articles";
import { getState } from "@/lib/data";
import { absoluteUrl } from "@/lib/env";
import { guideHubs } from "@/lib/guide-hubs";
import { articleMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

export function generateStaticParams() {
  return articles.filter((article) => isPublished(article)).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article || !isPublished(article)) {
    return {
      title: "Scheduled article",
      robots: { index: false, follow: false }
    };
  }
  return articleMetadata({
    title: article.metaTitle,
    description: article.metaDescription,
    path: `/guides/${article.slug}`
  });
}

export default async function GuideArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article || !isPublished(article)) notFound();

  const state = getState(article.stateSlug)!;
  const intent = articleIntent(article);
  const primaryLink = article.internalLinks[0] || { href: `/${state.slug}`, label: `${state.name} electricity rates` };
  const compareLink = article.internalLinks[1] || { href: "/compare", label: "compare state electricity rates" };
  const supportLink = article.internalLinks[2] || { href: "/methodology", label: "bill estimate methodology" };
  const relatedGuides = getRelatedArticles(article, 3);
  const matchingHubs = guideHubs.filter((hub) => hub.categories.includes(article.category) || hub.featuredSlugs.includes(article.slug)).slice(0, 2);
  const insightPanel = article.readerProblem || article.uniqueAngle ? (
    <div className="insight-grid">
      {article.readerProblem && (
        <div>
          <p className="eyebrow">Reader problem</p>
          <p>{article.readerProblem}</p>
        </div>
      )}
      {article.uniqueAngle && (
        <div>
          <p className="eyebrow">Unique angle</p>
          <p>{article.uniqueAngle}</p>
        </div>
      )}
    </div>
  ) : null;
  const examplePanel = article.practicalExample ? (
    <section className="article-slice">
      <h2>Practical example</h2>
      <p>{article.practicalExample}</p>
    </section>
  ) : null;
  const evidencePanel = article.evidenceNotes && article.evidenceNotes.length > 0 ? (
    <section className="article-slice">
      <h2>Evidence notes</h2>
      <ul>
        {article.evidenceNotes.map((note) => <li key={note}>{note}</li>)}
      </ul>
    </section>
  ) : null;
  const checklistPanel = article.decisionChecklist && article.decisionChecklist.length > 0 ? (
    <section className="article-slice">
      <h2>Decision checklist</h2>
      <ul className="action-list">
        {article.decisionChecklist.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  ) : null;
  const mistakePanel = article.commonMistake ? (
    <div className="article-callout article-callout-warning">
      <p className="eyebrow">Common mistake</p>
      <p>{article.commonMistake}</p>
    </div>
  ) : null;
  const whenPanel = article.whenToAct ? (
    <div className="article-callout article-callout-savings">
      <p className="eyebrow">When to act</p>
      <p>{article.whenToAct}</p>
    </div>
  ) : null;
  const detailPanel = article.detailBlocks && article.detailBlocks.length > 0 ? (
    <section id="detail-examples" className="article-slice">
      {article.detailBlocks.map((block) => (
        <div key={block.title} className={`detail-block detail-block-${block.kind}`}>
          <p className="eyebrow">{block.kind}</p>
          <h2>{block.title}</h2>
          <p>{block.intro}</p>
          <div className="detail-rows">
            {block.rows.map((row) => (
              <div key={`${block.title}-${row.label}`} className="detail-row">
                <strong>{row.label}</strong>
                <span>{row.value}</span>
                <p>{row.note}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  ) : null;

  const beforeSections = article.contentLayout === "example-first"
    ? [examplePanel, insightPanel]
    : article.contentLayout === "evidence-first"
      ? [evidencePanel, insightPanel]
      : article.contentLayout === "action-first"
        ? [checklistPanel, insightPanel]
        : [insightPanel, mistakePanel];
  const afterSections = article.contentLayout === "example-first"
    ? [evidencePanel, detailPanel, checklistPanel, mistakePanel, whenPanel]
    : article.contentLayout === "evidence-first"
      ? [examplePanel, detailPanel, mistakePanel, checklistPanel, whenPanel]
      : article.contentLayout === "action-first"
        ? [examplePanel, detailPanel, evidencePanel, mistakePanel, whenPanel]
      : [examplePanel, evidencePanel, detailPanel, checklistPanel, whenPanel];
  const tocItems = [
    ...(article.answerSummary ? [{ href: "#short-answer", label: "Short answer" }] : []),
    ...article.sections.map(({ heading }, index) => ({ href: `#section-${index + 1}`, label: heading })),
    ...(article.detailBlocks && article.detailBlocks.length > 0 ? [{ href: "#detail-examples", label: "Examples and checks" }] : []),
    ...(article.actionItems && article.actionItems.length > 0 ? [{ href: "#next-actions", label: "What to do next" }] : []),
    { href: "#related-data", label: "Related data" },
    { href: "#next-step", label: "Next step" },
    ...(article.faq.length > 0 ? [{ href: "#quick-answers", label: "Quick answers" }] : []),
    ...(relatedGuides.length > 0 ? [{ href: "#related-guides", label: "Related guides" }] : [])
  ];

  return (
    <main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": article.schemaType,
            headline: article.title,
            description: article.metaDescription,
            datePublished: article.scheduledAt,
            dateModified: article.scheduledAt,
            author: { "@type": "Organization", name: "WattBench Data Desk", url: absoluteUrl("/about") },
            publisher: { "@type": "Organization", name: "WattBench", url: absoluteUrl("/") },
            mainEntityOfPage: absoluteUrl(`/guides/${article.slug}`),
            url: absoluteUrl(`/guides/${article.slug}`),
            keywords: [article.mainKeyword, ...article.expandedKeywords],
            wordCount: article.wordCount || 950,
            citation: article.externalSource.href,
            about: [
              article.mainKeyword,
              ...article.expandedKeywords.slice(0, 3),
              intent
            ],
            isPartOf: { "@type": "CollectionPage", name: "Electric bill guides", url: absoluteUrl("/guides") },
            mentions: [
              ...matchingHubs.map((hub) => ({
                "@type": "CollectionPage",
                name: hub.h1,
                url: absoluteUrl(hub.path)
              })),
              ...article.internalLinks.slice(0, 4).map((link) => ({
              "@type": "WebPage",
              name: link.label,
              url: absoluteUrl(link.href)
              }))
            ]
          },
          ...(article.faq.length > 0 ? [{
            "@type": "FAQPage",
            mainEntity: article.faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer
              }
            }))
          }] : []),
          {
            "@type": "ItemList",
            name: `${article.title} internal links`,
            itemListElement: [
              ...matchingHubs.map((hub, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: hub.h1,
                url: absoluteUrl(hub.path)
              })),
              ...article.internalLinks.slice(0, 4).map((link, index) => ({
                "@type": "ListItem",
                position: matchingHubs.length + index + 1,
                name: link.label,
                url: absoluteUrl(link.href)
              })),
              ...relatedGuides.map((guide, index) => ({
                "@type": "ListItem",
                position: matchingHubs.length + index + 5,
                name: guide.title,
                url: absoluteUrl(`/guides/${guide.slug}`)
              }))
            ]
          },
          ...(relatedGuides.length > 0 ? [{
            "@type": "ItemList",
            name: `${article.category} related guides`,
            itemListElement: relatedGuides.map((guide, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: guide.title,
              url: absoluteUrl(`/guides/${guide.slug}`)
            }))
          }] : []),
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
              { "@type": "ListItem", position: 3, name: article.title, item: absoluteUrl(`/guides/${article.slug}`) }
            ]
          }
        ]
      }} />
      <div className="progress"><span /></div>
      <section className="hero">
        <div className="reading hero-copy">
          <SourceBadge />
          <div className="meta-row">
            <span className="chip" style={{ width: "fit-content" }}>{article.category}</span>
            <span className="intent-badge">{intent}</span>
          </div>
          <h1 className="serif">{article.title}</h1>
          <p>{article.subtitle}</p>
          <p className="muted">{article.date} - WattBench Data Desk</p>
        </div>
      </section>
      <section className="section">
        <div className="container article-layout">
          <article className="prose">
            <p>{article.intro}</p>
            {article.answerSummary && (
              <div id="short-answer" className={`article-callout ${article.accentTone === "warning" ? "article-callout-warning" : "article-callout-savings"}`}>
                <p className="eyebrow">Short answer</p>
                <p>{article.answerSummary}</p>
              </div>
            )}
            <div className="keyword-strip" aria-label="Article keywords">
              <span>{article.mainKeyword}</span>
              {article.expandedKeywords.slice(0, 4).map((keyword) => <span key={keyword}>{keyword}</span>)}
            </div>
            {beforeSections.map((panel, index) => panel ? <div key={`before-${index}`}>{panel}</div> : null)}
            {article.sections.map(({ heading, body }, index) => (
              <section key={heading} id={`section-${index + 1}`}>
                <h2>{heading}</h2>
                <p>{body}</p>
              </section>
            ))}
            {afterSections.map((panel, index) => panel ? <div key={`after-${index}`}>{panel}</div> : null)}
            {article.highlight && (
              <div className={`article-callout ${article.accentTone === "warning" ? "article-callout-warning" : "article-callout-savings"}`}>
                <p className="eyebrow">Reading note</p>
                <p>{article.highlight}</p>
              </div>
            )}
            {article.actionItems && article.actionItems.length > 0 && (
              <section id="next-actions">
                <h2>What to do next</h2>
                <ul className="action-list">
                  {article.actionItems.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
            )}
            <Estimator fixedStateSlug={state.slug} title={`${state.name} example estimator`} compact />
            <section id="related-data">
              <h2>Related data</h2>
              <div className="source-note">
                <p className="eyebrow">Source-backed note</p>
                <p>This guide uses <a href={article.externalSource.href} rel="noopener noreferrer" target="_blank">{article.externalSource.label}</a> as its public reference point, then applies the data conservatively to household billing decisions.</p>
              </div>
              <p>For the full state context, review the <Link href={primaryLink.href}>{primaryLink.label}</Link>. For a broader comparison, use the <Link href={compareLink.href}>{compareLink.label}</Link>.</p>
              <p>For a next-step reference, read <Link href={supportLink.href}>{supportLink.label}</Link> before making a billing or equipment decision.</p>
              <ul>
                {matchingHubs.map((hub) => (
                  <li key={`${article.slug}-${hub.path}`}><Link href={hub.path}>{hub.h1}</Link></li>
                ))}
                {article.internalLinks.slice(0, 4).map((link) => (
                  <li key={`${article.slug}-${link.href}`}><Link href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
              <p>External reference: <a href={article.externalSource.href} rel="noopener noreferrer" target="_blank">{article.externalSource.label}</a>.</p>
            </section>
            <div id="next-step" className="card card-pad surface" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h2>Next step</h2>
              <p>Use the estimator with your monthly kWh usage, then compare your result with state benchmarks before making billing or assistance decisions.</p>
              <div className="meta-row">
                <Link className="button" href={article.cta.href}>{article.cta.label}</Link>
                <Link className="button-secondary" href="/compare">Compare states</Link>
              </div>
            </div>
            {article.faq.length > 0 && (
              <section id="quick-answers">
                <h2>Quick answers</h2>
                {article.faq.map((item) => (
                  <div key={item.question} className="card card-pad" style={{ marginBottom: 12 }}>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </div>
                ))}
              </section>
            )}
            {relatedGuides.length > 0 && (
              <section id="related-guides">
                <h2>Related {article.category.toLowerCase()} guides</h2>
                <div className="related-guides">
                  {relatedGuides.map((guide) => (
                    <Link key={guide.slug} href={`/guides/${guide.slug}`} className="card card-pad">
                      <div className="meta-row">
                        <span className="chip" style={{ width: "fit-content" }}>{guide.category}</span>
                        <span className="intent-badge">{articleIntent(guide)}</span>
                      </div>
                      <strong>{guide.title}</strong>
                      <p className="muted">{guide.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            <div className="card card-pad">
              <p className="eyebrow">Author</p>
              <p><strong>WattBench Data Desk</strong> publishes consumer-facing explanations based on public EIA data, visible methodology, and conservative bill estimates. This article was written directly in Codex without external API or external LLM prose generation.</p>
            </div>
          </article>
          <aside className="toc" aria-label="Article table of contents">
            <strong>On this page</strong>
            {tocItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
            <Link href="/blog">All blog guides</Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
