export type Market = "regulated" | "deregulated";

export type TrendPoint = {
  month: string;
  value: number;
};

export type Utility = {
  slug: string;
  name: string;
  rate: number;
  customers: number;
  vintage: number;
};

export type StateRate = {
  slug: string;
  name: string;
  abbr: string;
  market: Market;
  rate: number;
  rateLow: number;
  rateHigh: number;
  rank: number;
  yoy: number;
  usageAvg: number;
  blurb: string;
  trend: TrendPoint[];
  utilities: Utility[];
};

export const NATIONAL_AVG = 16.4;
export const AVG_USAGE = 900;
export const TOTAL_RANKS = 51;
export const UPDATED = "Jun 2026";
export const VINTAGE = 2024;

const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];

function trend(base: number, amp = 0.9, rise = 0.6): TrendPoint[] {
  return months.map((month, i) => {
    const seasonal = Math.sin((i / 12) * Math.PI * 2 + 0.6) * amp;
    const drift = (i / 11) * rise;
    return { month, value: Number((base + seasonal + drift).toFixed(2)) };
  });
}

export const states: StateRate[] = [
  {
    slug: "california",
    name: "California",
    abbr: "CA",
    market: "regulated",
    rate: 31.8,
    rateLow: 28.4,
    rateHigh: 41.2,
    rank: 49,
    yoy: 5.2,
    usageAvg: 560,
    trend: trend(31.8, 1.4, 1.6),
    blurb: "Among the highest residential rates in the nation, driven by wildfire-hardening costs, transmission investment, and tiered pricing.",
    utilities: [
      { slug: "pge", name: "Pacific Gas & Electric", rate: 38.4, customers: 4600000, vintage: 2024 },
      { slug: "sce", name: "Southern California Edison", rate: 34.1, customers: 4300000, vintage: 2024 },
      { slug: "sdge", name: "San Diego Gas & Electric", rate: 41.2, customers: 1400000, vintage: 2024 },
      { slug: "ladwp", name: "Los Angeles Dept. of Water & Power", rate: 24.7, customers: 1500000, vintage: 2024 },
      { slug: "smud", name: "Sacramento Municipal Utility District", rate: 19.8, customers: 650000, vintage: 2024 }
    ]
  },
  {
    slug: "texas",
    name: "Texas",
    abbr: "TX",
    market: "deregulated",
    rate: 15.1,
    rateLow: 11.2,
    rateHigh: 22,
    rank: 27,
    yoy: 2.1,
    usageAvg: 1140,
    trend: trend(15.1, 1.9, 0.8),
    blurb: "A competitive retail market across most of the state. This is an average benchmark; the plan you choose determines your actual price.",
    utilities: [
      { slug: "oncor", name: "Oncor delivery area average", rate: 15.4, customers: 4000000, vintage: 2024 },
      { slug: "centerpoint", name: "CenterPoint delivery area average", rate: 16.1, customers: 2900000, vintage: 2024 },
      { slug: "aep-texas", name: "AEP Texas area average", rate: 14.8, customers: 1100000, vintage: 2024 },
      { slug: "austin-energy", name: "Austin Energy", rate: 13.2, customers: 530000, vintage: 2024 },
      { slug: "cps-energy", name: "CPS Energy", rate: 12.6, customers: 920000, vintage: 2024 }
    ]
  },
  {
    slug: "washington",
    name: "Washington",
    abbr: "WA",
    market: "regulated",
    rate: 11.4,
    rateLow: 9.8,
    rateHigh: 13.4,
    rank: 4,
    yoy: 1.6,
    usageAvg: 1000,
    trend: trend(11.4, 0.8, 0.7),
    blurb: "Among the cheapest power in the country, anchored by abundant federal hydroelectricity and public power.",
    utilities: [
      { slug: "puget-sound", name: "Puget Sound Energy", rate: 12.8, customers: 1200000, vintage: 2024 },
      { slug: "seattle-city-light", name: "Seattle City Light", rate: 11.2, customers: 480000, vintage: 2024 },
      { slug: "snohomish-pud", name: "Snohomish County PUD", rate: 10.6, customers: 360000, vintage: 2024 },
      { slug: "avista", name: "Avista Utilities", rate: 10.9, customers: 270000, vintage: 2024 },
      { slug: "tacoma-power", name: "Tacoma Power", rate: 9.8, customers: 180000, vintage: 2024 }
    ]
  }
];

export const directory = [
  { name: "North Dakota", abbr: "ND", rate: 10.6, rank: 1, yoy: 0.8, market: "regulated" },
  { name: "Nebraska", abbr: "NE", rate: 10.9, rank: 2, yoy: 1.1, market: "regulated" },
  { name: "Idaho", abbr: "ID", rate: 11.2, rank: 3, yoy: 0.4, market: "regulated" },
  { name: "Washington", abbr: "WA", rate: 11.4, rank: 4, yoy: 1.6, market: "regulated" },
  { name: "Utah", abbr: "UT", rate: 11.7, rank: 5, yoy: 0.9, market: "regulated" },
  { name: "Louisiana", abbr: "LA", rate: 12.1, rank: 6, yoy: -0.3, market: "regulated" },
  { name: "Florida", abbr: "FL", rate: 14.6, rank: 22, yoy: 2.8, market: "regulated" },
  { name: "Texas", abbr: "TX", rate: 15.1, rank: 27, yoy: 2.1, market: "deregulated" },
  { name: "Illinois", abbr: "IL", rate: 16, rank: 31, yoy: 2.4, market: "deregulated" },
  { name: "New York", abbr: "NY", rate: 22.9, rank: 42, yoy: 3.6, market: "deregulated" },
  { name: "Massachusetts", abbr: "MA", rate: 28.4, rank: 47, yoy: 4.1, market: "deregulated" },
  { name: "California", abbr: "CA", rate: 31.8, rank: 49, yoy: 5.2, market: "regulated" },
  { name: "Connecticut", abbr: "CT", rate: 32.6, rank: 50, yoy: 4.8, market: "deregulated" },
  { name: "Hawaii", abbr: "HI", rate: 41.9, rank: 51, yoy: 3, market: "regulated" }
] as const;

export const cheapest = directory.find((row) => row.rank === 1)!;
export const nationalTrend = trend(NATIONAL_AVG, 0.7, 0.7);

export function getState(slug: string) {
  return states.find((state) => state.slug === slug);
}

export function getUtility(stateSlug: string, utilitySlug: string) {
  const state = getState(stateSlug);
  return {
    state,
    utility: state?.utilities.find((utility) => utility.slug === utilitySlug)
  };
}

export const articles = [
  {
    slug: "why-your-electric-bill-jumps-in-summer",
    title: "Why your electric bill jumps in summer",
    tag: "Explainer",
    date: "Jun 7, 2026",
    stateSlug: "texas",
    description: "How cooling load turns average electric rates into a much larger monthly bill."
  },
  {
    slug: "time-of-use-electric-rates",
    title: "Time-of-use electric rates: when they help and when they do not",
    tag: "How-to",
    date: "Jun 7, 2026",
    stateSlug: "california",
    description: "A practical guide to peak windows, off-peak usage, and bill risk."
  },
  {
    slug: "electric-bill-help",
    title: "What to do if you cannot pay your electric bill",
    tag: "Support",
    date: "Jun 7, 2026",
    stateSlug: "california",
    description: "LIHEAP, weatherization, budget billing, and the application steps to try first."
  },
  {
    slug: "regulated-vs-deregulated-electricity",
    title: "Regulated vs deregulated electricity markets",
    tag: "Explainer",
    date: "Jun 7, 2026",
    stateSlug: "texas",
    description: "Why shopping language belongs on some state pages but not others."
  }
] as const;
