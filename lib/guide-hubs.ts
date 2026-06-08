import type { Article } from "@/lib/articles";

export type GuideHub = {
  slug: "ev" | "assistance" | "appliances" | "rate-plans";
  title: string;
  h1: string;
  description: string;
  path: string;
  primaryKeywords: string[];
  categories: string[];
  featuredSlugs: string[];
};

export const guideHubs: GuideHub[] = [
  {
    slug: "ev",
    title: "EV electricity bill guides: charging costs, rate timing, and home load checks",
    h1: "EV electricity bill guides",
    description: "EV electricity bill guides for home charging costs, off-peak timing, monthly kWh load, charger setup, and electric rate decisions.",
    path: "/guides/ev",
    primaryKeywords: ["EV charging electric bill", "home charging cost", "off-peak EV charging"],
    categories: ["EV", "Electrification"],
    featuredSlugs: ["ev-charging-electric-bill", "electric-bill-after-adding-ev", "level-2-charger-electric-bill", "ev-time-of-use-rate"]
  },
  {
    slug: "assistance",
    title: "Electric bill assistance guides: LIHEAP, payment plans, and shutoff prevention",
    h1: "Electric bill assistance guides",
    description: "Electric bill assistance guides for LIHEAP documents, past-due payment plans, budget billing, crisis help, and utility shutoff prevention.",
    path: "/guides/assistance",
    primaryKeywords: ["electric bill assistance", "LIHEAP documents", "past-due electric bill"],
    categories: ["Assistance"],
    featuredSlugs: ["electric-bill-past-due-plan", "liheap-electric-bill-documents", "budget-billing-pros-cons", "energy-assistance-vs-budget-billing"]
  },
  {
    slug: "appliances",
    title: "Appliance electricity cost guides: AC, heat pumps, water heaters, and home loads",
    h1: "Appliance electricity cost guides",
    description: "Appliance electricity cost guides for air conditioners, heat pumps, water heaters, refrigerators, laundry, standby load, and monthly kWh usage.",
    path: "/guides/appliances",
    primaryKeywords: ["appliance electricity cost", "air conditioner electricity cost", "monthly kWh usage"],
    categories: ["Appliances", "Heating and cooling", "Efficiency"],
    featuredSlugs: ["air-conditioner-electricity-cost", "heat-pump-electric-bill-winter", "electric-water-heater-cost", "refrigerator-electricity-cost"]
  },
  {
    slug: "rate-plans",
    title: "Electric rate plan guides: time-of-use, delivery charges, and bill comparison",
    h1: "Electric rate plan guides",
    description: "Electric rate plan guides for time-of-use pricing, delivery charges, rate increases, regulated markets, and state electricity bill comparison.",
    path: "/guides/rate-plans",
    primaryKeywords: ["electric rate plan", "time-of-use electric rates", "delivery charges"],
    categories: ["Rate plans", "Rate changes", "Market structure", "State guides", "Tools"],
    featuredSlugs: ["time-of-use-electric-rates", "texas-delivery-charges", "electric-rate-increase-news-check", "regulated-vs-deregulated-electricity"]
  }
];

export function getGuideHub(slug: GuideHub["slug"]) {
  return guideHubs.find((hub) => hub.slug === slug);
}

export function articlesForGuideHub(hub: GuideHub, articles: Article[]) {
  const featured = hub.featuredSlugs
    .map((slug) => articles.find((article) => article.slug === slug))
    .filter(Boolean) as Article[];
  const featuredSlugs = new Set(featured.map((article) => article.slug));
  const clustered = articles
    .filter((article) => !featuredSlugs.has(article.slug) && hub.categories.includes(article.category))
    .slice(0, 12);
  return { featured, clustered };
}
