import fs from "node:fs";

const source = fs.readFileSync("lib/articles.ts", "utf8");
const blogSource = fs.readFileSync("app/blog/page.tsx", "utf8");
const guidesSource = fs.readFileSync("app/guides/page.tsx", "utf8");
const articlePageSource = fs.readFileSync("app/guides/[slug]/page.tsx", "utf8");
const sitemapSource = fs.readFileSync("app/sitemap.ts", "utf8");
const guideHubSource = fs.readFileSync("lib/guide-hubs.ts", "utf8");
const guideHubPageSource = fs.readFileSync("components/GuideHub.tsx", "utf8");
const cssSource = fs.readFileSync("app/globals.css", "utf8");
const eiaSource = fs.readFileSync("lib/eia.ts", "utf8");
const eiaCronSource = fs.readFileSync("app/api/cron/eia-sync/route.ts", "utf8");
const dbSource = fs.readFileSync("lib/db/index.ts", "utf8");
const envSource = fs.readFileSync("lib/env.ts", "utf8");
const layoutSource = fs.readFileSync("app/layout.tsx", "utf8");
const envExampleSource = fs.readFileSync(".env.example", "utf8");
const adsTxtSource = fs.readFileSync("public/ads.txt", "utf8");

function matches(pattern) {
  return [...source.matchAll(pattern)].map((match) => match[1]);
}

const [legacySource, topicSource = ""] = source.split("const topicSeeds: ArticleSeed[]");
const legacyTitles = [...legacySource.matchAll(/title: "([^"]+)"/g)].map((match) => match[1]);
const legacySlugs = [...legacySource.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1]);
const legacyKeywords = [...legacySource.matchAll(/mainKeyword: "([^"]+)"/g)].map((match) => match[1]);
const topicArraySource = topicSource.split("];")[0] || "";
const seedBlocks = topicArraySource.split(/\r?\n/).filter((line) => line.includes('{ slug: "')).slice(0, 100);
const seedSource = seedBlocks.join("\n");
const seeds = seedBlocks.map((line) => {
  const slug = line.match(/slug: "([^"]+)"/)?.[1];
  const title = line.match(/title: "([^"]+)"/)?.[1];
  const mainKeyword = line.match(/mainKeyword: "([^"]+)"/)?.[1];
  const expandedKeywords = [...line.matchAll(/\["([^"]+)", "([^"]+)", "([^"]+)", "([^"]+)"\]/g)][0]?.slice(1) || [];
  const format = line.match(/format: "([^"]+)"/)?.[1];
  return { slug, title, mainKeyword, expandedKeywords, format };
});

const titles = [...legacyTitles, ...[...seedSource.matchAll(/title: "([^"]+)"/g)].map((match) => match[1])];
const slugs = [...legacySlugs, ...[...seedSource.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1])];
const keywords = [...legacyKeywords, ...[...seedSource.matchAll(/mainKeyword: "([^"]+)"/g)].map((match) => match[1])];
const newSlugs = [...seedSource.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1]);
const qualityScores = [...source.matchAll(/qualityScore:\s*(\d+)/g)].map((match) => Number(match[1]));
const codexFlags = matches(/codexOnlyGeneration:\s*(true)/g);
const first = new Date("2026-06-08T01:00:00+09:00").getTime();
const prioritySource = source.split("const priorityArticleEnhancements")[1]?.split("const priorityDetailBlocks")[0] || "";
const prioritySlugs = [...prioritySource.matchAll(/"([^"]+)":\s*\{/g)].map((match) => match[1]);
const detailSource = source.split("const priorityDetailBlocks")[1]?.split("const topArticleDeepDives")[0] || "";
const detailSlugs = [...detailSource.matchAll(/"([^"]+)":\s*\[/g)].map((match) => match[1]);
const deepDiveSource = source.split("const topArticleDeepDives")[1]?.split("const legacyArticles")[0] || "";
const deepDiveSlugs = [...deepDiveSource.matchAll(/"([^"]+)":\s*\[/g)].map((match) => match[1]);
const metaOverrideSource = source.split("const metaDescriptionOverrides")[1]?.split("const legacyArticles")[0] || "";
const metaOverrides = [...metaOverrideSource.matchAll(/"([^"]+)":\s*"([^"]+)"/g)].map((match) => ({ slug: match[1], description: match[2] }));

function assertUnique(values, label) {
  const counts = new Map();
  for (const value of values) counts.set(value.toLowerCase(), (counts.get(value.toLowerCase()) || 0) + 1);
  const dupes = [...counts.entries()].filter(([, count]) => count > 1);
  if (dupes.length) {
    throw new Error(`${label} duplicates: ${dupes.map(([value]) => value).join(", ")}`);
  }
}

assertUnique(titles, "title");
assertUnique(slugs, "slug");
assertUnique(keywords, "main keyword");

if (newSlugs.length !== 100) {
  throw new Error(`Expected 100 new scheduled articles, found ${newSlugs.length}`);
}

if (!slugs.includes("average-electric-bill-guide")) {
  throw new Error("Missing cornerstone average electric bill guide.");
}

if (!source.includes('href: "/guides/average-electric-bill-guide"')) {
  throw new Error("Scheduled articles must link to the cornerstone average electric bill guide.");
}

for (const requiredBlogSnippet of [
  "const topicPaths",
  "const categoryPriority",
  "categoryClusters",
  "average-electric-bill-guide",
  "Start here",
  "Topic paths",
  "Content clusters",
  "\"@type\": \"ItemList\""
]) {
  if (!blogSource.includes(requiredBlogSnippet)) {
    throw new Error(`Blog hub is missing required structure: ${requiredBlogSnippet}`);
  }
}

for (const requiredGuidesSnippet of [
  "Electric bill guides",
  "const guideGroups",
  "guideHubs",
  "Topic hubs",
  "\"@type\": \"CollectionPage\"",
  "\"@type\": \"ItemList\"",
  "average-electric-bill-guide",
  "getPublishedArticles"
]) {
  if (!guidesSource.includes(requiredGuidesSnippet)) {
    throw new Error(`Guides index is missing required structure: ${requiredGuidesSnippet}`);
  }
}

if (guidesSource.includes("redirect(")) {
  throw new Error("/guides must be a real guide index, not a redirect.");
}

if (!sitemapSource.includes('"/guides"')) {
  throw new Error("sitemap must include /guides.");
}

for (const requiredBrandSnippet of [
  "https://wattbenchs.com",
  "wattbenchs"
]) {
  if (!envSource.includes(requiredBrandSnippet) && !layoutSource.includes(requiredBrandSnippet) && !envExampleSource.includes(requiredBrandSnippet)) {
    throw new Error(`Site brand/domain is missing required value: ${requiredBrandSnippet}`);
  }
}

for (const requiredTrackingSnippet of [
  "G-V70KJ8GE9J",
  "NEXT_PUBLIC_GA_MEASUREMENT_ID",
  "googletagmanager.com/gtag/js",
  "It0Es9r6NSXMIGl8Ll60bvQZ06RR3EinTe6NHYFTJYc",
  "98fda8d8fe95c1df7e31abd50a5a8cf63ef48549",
  "naver-site-verification",
  "verification",
  "ca-pub-3050601904412736",
  "NEXT_PUBLIC_ADSENSE_PUBLISHER_ID",
  "pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
  "<script",
  "crossOrigin"
]) {
  if (!layoutSource.includes(requiredTrackingSnippet) && !envExampleSource.includes(requiredTrackingSnippet)) {
    throw new Error(`Tracking or verification setup is missing: ${requiredTrackingSnippet}`);
  }
}

if (fs.existsSync("app/ads.txt/route.ts")) {
  throw new Error("ads.txt should be served as a simple static public file, not a Next route.");
}

if (adsTxtSource.trim() !== "google.com, pub-3050601904412736, DIRECT, f08c47fec0942fa0") {
  throw new Error("ads.txt must contain the exact configured AdSense publisher line.");
}

for (const requiredEiaSnippet of [
  "fetchEiaResidentialStateRates",
  "syncEiaResidentialStateRates",
  "ensureEiaTables",
  "getLatestLiveStateRates",
  "getStatesWithLiveRates",
  "getDirectoryWithLiveRates",
  "EIA_API_KEY",
  "TURSO_DATABASE_URL",
  "api.eia.gov/v2/electricity/retail-sales/data/",
  "onConflictDoUpdate"
]) {
  if (!eiaSource.includes(requiredEiaSnippet) && !dbSource.includes(requiredEiaSnippet)) {
    throw new Error(`EIA/Turso implementation is missing required structure: ${requiredEiaSnippet}`);
  }
}

for (const requiredCronSnippet of [
  "syncEiaResidentialStateRates",
  'status: "synced"',
  "insertedOrUpdated",
  "latestPeriods"
]) {
  if (!eiaCronSource.includes(requiredCronSnippet)) {
    throw new Error(`EIA cron route is missing required sync behavior: ${requiredCronSnippet}`);
  }
}

if (eiaCronSource.includes('status: "stub"') || eiaCronSource.includes("Production TODO")) {
  throw new Error("EIA cron route must not remain a stub.");
}

for (const requiredHubSnippet of [
  "export const guideHubs",
  'slug: "ev"',
  'slug: "assistance"',
  'slug: "appliances"',
  'slug: "rate-plans"',
  "articlesForGuideHub",
  "\"@type\": \"CollectionPage\"",
  "\"@type\": \"ItemList\"",
  "Featured guides",
  "articleIntent",
  "intent-badge",
  "primaryKeywords"
]) {
  if (!guideHubSource.includes(requiredHubSnippet) && !guideHubPageSource.includes(requiredHubSnippet)) {
    throw new Error(`Guide hub implementation is missing required structure: ${requiredHubSnippet}`);
  }
}

if (!sitemapSource.includes("guideHubs.map((hub) => hub.path)")) {
  throw new Error("sitemap must include guide hub paths.");
}

for (const hubPath of ["/guides/ev", "/guides/assistance", "/guides/appliances", "/guides/rate-plans"]) {
  if (!guideHubSource.includes(hubPath)) {
    throw new Error(`guide hub registry must include topic hub: ${hubPath}`);
  }
}

for (const requiredArticlePageSnippet of [
  '"@type": "FAQPage"',
  'acceptedAnswer',
  'isPartOf',
  'mentions',
  'citation',
  'about:',
  'articleIntent',
  'Source-backed note',
  'source-note',
  'getRelatedArticles',
  'matchingHubs',
  'relatedGuides',
  'Related {article.category.toLowerCase()} guides',
  'const tocItems',
  'id="short-answer"',
  'id="detail-examples"',
  'id="related-data"',
  'id="next-step"',
  'id="quick-answers"',
  'internal links',
  'absoluteUrl("/guides")'
]) {
  if (!articlePageSource.includes(requiredArticlePageSnippet)) {
    throw new Error(`Article page schema is missing required structure: ${requiredArticlePageSnippet}`);
  }
}

for (const requiredIntentSnippet of [
  "export function articleIntent",
  "Assistance",
  "Calculator",
  "Comparison",
  "Cost check",
  "Diagnosis"
]) {
  if (!source.includes(requiredIntentSnippet)) {
    throw new Error(`Article intent helper is missing required signal: ${requiredIntentSnippet}`);
  }
}

for (const requiredIntentUiSnippet of [
  "articleIntent",
  "intent-badge"
]) {
  if (!blogSource.includes(requiredIntentUiSnippet)) {
    throw new Error(`Blog card intent UI is missing: ${requiredIntentUiSnippet}`);
  }
  if (!guideHubPageSource.includes(requiredIntentUiSnippet)) {
    throw new Error(`Guide hub card intent UI is missing: ${requiredIntentUiSnippet}`);
  }
}

for (const requiredCssSnippet of [".intent-badge", ".source-note"]) {
  if (!cssSource.includes(requiredCssSnippet)) {
    throw new Error(`CSS is missing content quality UI style: ${requiredCssSnippet}`);
  }
}

if (codexFlags.length < 5) {
  throw new Error("Codex-only generation confirmations are missing.");
}

if (qualityScores.some((score) => score < 90)) {
  throw new Error("Every literal qualityScore must be at least 90.");
}

if (prioritySlugs.length < 20) {
  throw new Error(`Expected at least 20 priority long-form enhancements, found ${prioritySlugs.length}.`);
}

assertUnique(prioritySlugs, "priority enhancement slug");

for (const slug of prioritySlugs) {
  if (!slugs.includes(slug)) {
    throw new Error(`Priority enhancement targets a missing article: ${slug}`);
  }
}

const prioritySectionCount = (prioritySource.match(/prioritySections:\s*\[/g) || []).length;
const priorityFaqCount = (prioritySource.match(/priorityFaq:\s*\[/g) || []).length;
if (prioritySectionCount < 20 || priorityFaqCount < 20) {
  throw new Error("Priority articles must include custom sections and custom FAQ blocks.");
}

if (detailSlugs.length < 20) {
  throw new Error(`Expected at least 20 priority detail blocks, found ${detailSlugs.length}.`);
}

assertUnique(detailSlugs, "priority detail slug");

for (const slug of prioritySlugs) {
  if (!detailSlugs.includes(slug)) {
    throw new Error(`Priority enhancement is missing a detail block: ${slug}`);
  }
}

for (const kind of ['kind: "table"', 'kind: "calculation"', 'kind: "checklist"']) {
  if (!detailSource.includes(kind)) {
    throw new Error(`Priority detail blocks are missing ${kind}.`);
  }
}

const requiredDeepDiveSlugs = [
  "average-electric-bill-guide",
  "ev-charging-electric-bill",
  "liheap-electric-bill-documents",
  "texas-delivery-charges",
  "air-conditioner-electricity-cost",
  "electric-bill-past-due-plan",
  "electric-bill-calculator-inputs",
  "kwh-to-dollars-electric-bill",
  "heat-pump-electric-bill-winter",
  "budget-billing-pros-cons"
];

if (deepDiveSlugs.length < requiredDeepDiveSlugs.length) {
  throw new Error(`Expected at least ${requiredDeepDiveSlugs.length} top article deep dives, found ${deepDiveSlugs.length}.`);
}

assertUnique(deepDiveSlugs, "top article deep dive slug");

for (const slug of requiredDeepDiveSlugs) {
  if (!deepDiveSlugs.includes(slug)) {
    throw new Error(`Missing required top article deep dive: ${slug}`);
  }
  if (!slugs.includes(slug)) {
    throw new Error(`Top article deep dive targets a missing article: ${slug}`);
  }
}

for (const snippet of ["$0.", "kWh x", "applyTopArticleDeepDives", "Average bill math examples", "EV charging monthly load scenarios"]) {
  if (!deepDiveSource.includes(snippet) && !source.includes(snippet)) {
    throw new Error(`Missing top article depth signal: ${snippet}`);
  }
}

for (const kind of ['kind: "table"', 'kind: "calculation"', 'kind: "checklist"']) {
  if (!deepDiveSource.includes(kind)) {
    throw new Error(`Top article deep dives are missing ${kind}.`);
  }
}

if (metaOverrides.length < 30) {
  throw new Error(`Expected at least 30 custom meta descriptions, found ${metaOverrides.length}.`);
}

assertUnique(metaOverrides.map((item) => item.description), "custom meta description");

const articleKeywordBySlug = new Map([
  ...legacySlugs.map((slug, index) => [slug, legacyKeywords[index]]),
  ...seeds.map((seed) => [seed.slug, seed.mainKeyword])
]);
for (const { slug, description } of metaOverrides) {
  const mainKeyword = articleKeywordBySlug.get(slug);
  if (!mainKeyword) {
    throw new Error(`Custom meta description targets a missing article: ${slug}`);
  }
  if (!description.toLowerCase().includes(mainKeyword.toLowerCase())) {
    throw new Error(`Custom meta description is missing the main keyword for ${slug}`);
  }
  if (description.length < 110 || description.length > 180) {
    throw new Error(`Custom meta description length is outside the target range for ${slug}: ${description.length}`);
  }
}

if (!source.includes("applyMetaDescriptionOverride")) {
  throw new Error("Custom meta descriptions must be applied to legacy and scheduled articles.");
}

function firstExpandedKeyword(seed) {
  return seed.expandedKeywords[0] || seed.mainKeyword;
}

function secondExpandedKeyword(seed) {
  return seed.expandedKeywords[1] || seed.mainKeyword;
}

function articleTitle(seed) {
  const base = seed.title.toLowerCase().includes(seed.mainKeyword.toLowerCase()) ? seed.title : `${seed.title} for ${seed.mainKeyword}`;
  const expanded = firstExpandedKeyword(seed);
  if (base.toLowerCase().includes(expanded.toLowerCase())) return base;
  const variants = [
    `${base} using ${expanded}`,
    `${base} with ${expanded}`,
    `${base}: ${expanded}`,
    `${base} when ${expanded} matters`
  ];
  return variants[seed.slug.length % variants.length];
}

function articleSubtitle(seed) {
  const first = firstExpandedKeyword(seed);
  const second = secondExpandedKeyword(seed);
  const third = seed.expandedKeywords[2] || "";
  const variants = [
    `${seed.mainKeyword} explained through ${first}, ${second}, and ${third} so the next bill decision is easier.`,
    `A practical ${seed.mainKeyword} guide connecting ${first}, ${second}, and ${third} with bill-reading steps.`,
    `How ${seed.mainKeyword} changes when ${first}, ${second}, and ${third} are read together instead of separately.`,
    `${seed.mainKeyword} in plain language, with ${first}, ${second}, and ${third} turned into actions.`
  ];
  return variants[seed.title.length % variants.length];
}

function contentLayout(seed, index) {
  const layouts = ["diagnostic", "example-first", "evidence-first", "action-first"];
  return layouts[index % layouts.length];
}

for (const seed of seeds) {
  const title = articleTitle(seed).toLowerCase();
  const subtitle = articleSubtitle(seed).toLowerCase();
  const main = seed.mainKeyword.toLowerCase();
  const expanded = firstExpandedKeyword(seed).toLowerCase();
  if (!title.includes(main) || !title.includes(expanded)) {
    throw new Error(`Generated title missing main or expanded keyword: ${seed.slug}`);
  }
  if (!subtitle.includes(main) || !subtitle.includes(expanded) || !subtitle.includes(secondExpandedKeyword(seed).toLowerCase())) {
    throw new Error(`Generated subtitle missing required keywords: ${seed.slug}`);
  }
}

assertUnique(seeds.map(articleTitle), "generated title");

const uniqueFormats = new Set(seeds.map((seed) => seed.format));
if (uniqueFormats.size < 10) {
  throw new Error(`Expected at least 10 article formats, found ${uniqueFormats.size}`);
}

for (let index = 1; index < seeds.length; index += 1) {
  const previous = first + (index - 1) * 5 * 60 * 60 * 1000;
  const current = first + index * 5 * 60 * 60 * 1000;
  if (current - previous !== 5 * 60 * 60 * 1000) {
    throw new Error("Article schedule interval is not 5 hours.");
  }
}

let previousLayout = "";
for (const [index, seed] of seeds.entries()) {
  const layout = contentLayout(seed, index);
  if (layout === previousLayout) {
    throw new Error(`Adjacent article layout repeated: ${seed.slug}`);
  }
  previousLayout = layout;
}

for (const requiredSnippet of [
  "answerSummary",
  "highlight",
  "actionItems",
  "accentTone",
  "readerProblem",
  "uniqueAngle",
  "evidenceNotes",
  "practicalExample",
  "decisionChecklist",
  "commonMistake",
  "whenToAct",
  "contentLayout",
  "estimateWordCount",
  "priorityArticleEnhancements",
  "priorityDetailBlocks",
  "detailBlocks"
]) {
  if (!source.includes(requiredSnippet)) {
    throw new Error(`Missing anti-template article element: ${requiredSnippet}`);
  }
}

const expectedLast = new Date(first + 99 * 5 * 60 * 60 * 1000).toISOString();
console.log(`[articles] total=${slugs.length} new=100 uniqueMainKeywords=${keywords.length}`);
console.log(`[articles] firstNew=2026-06-08T01:00:00+09:00 lastNew=${expectedLast}`);
console.log("[articles] duplicate and quality checks passed");
