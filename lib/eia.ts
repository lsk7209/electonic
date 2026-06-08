import { desc, eq } from "drizzle-orm";
import { eiaStateRates } from "@/lib/db/schema";
import { getDb, getLibsqlClient } from "@/lib/db";
import { directory, states, type StateRate, type TrendPoint } from "@/lib/data";

type EiaRetailSalesRow = {
  period?: string;
  stateid?: string;
  sectorid?: string;
  price?: string | number;
};

export type LiveStateRate = {
  state: string;
  period: string;
  centsPerKwh: number;
  vintage: number;
};

const EIA_RETAIL_SALES_URL = "https://api.eia.gov/v2/electricity/retail-sales/data/";
const RESIDENTIAL_SECTOR = "RES";

function stateAbbrs() {
  return [...new Set([...states.map((state) => state.abbr), ...directory.map((row) => row.abbr)])];
}

function eiaRetailSalesUrl(apiKey: string) {
  const url = new URL(EIA_RETAIL_SALES_URL);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("frequency", "monthly");
  url.searchParams.append("data[0]", "price");
  url.searchParams.append("facets[sectorid][]", RESIDENTIAL_SECTOR);
  for (const abbr of stateAbbrs()) {
    url.searchParams.append("facets[stateid][]", abbr);
  }
  url.searchParams.append("sort[0][column]", "period");
  url.searchParams.append("sort[0][direction]", "desc");
  url.searchParams.set("offset", "0");
  url.searchParams.set("length", "5000");
  return url;
}

function parseVintage(period: string) {
  return Number(period.slice(0, 4)) || new Date().getFullYear();
}

export async function fetchEiaResidentialStateRates(apiKey = process.env.EIA_API_KEY) {
  if (!apiKey) {
    throw new Error("Missing EIA_API_KEY.");
  }

  const response = await fetch(eiaRetailSalesUrl(apiKey), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`EIA API failed: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json() as { response?: { data?: EiaRetailSalesRow[] } };
  const rows = payload.response?.data || [];
  return rows
    .map((row) => {
      const period = row.period || "";
      const state = row.stateid || "";
      const centsPerKwh = Number(row.price);
      if (!period || !state || row.sectorid !== RESIDENTIAL_SECTOR || !Number.isFinite(centsPerKwh)) return null;
      return {
        state,
        sector: RESIDENTIAL_SECTOR,
        period,
        centsPerKwh,
        vintage: parseVintage(period),
        sourceForm: "EIA-826"
      };
    })
    .filter(Boolean) as Array<{
      state: string;
      sector: string;
      period: string;
      centsPerKwh: number;
      vintage: number;
      sourceForm: string;
    }>;
}

export async function ensureEiaTables() {
  const client = getLibsqlClient();
  if (!client) {
    throw new Error("Missing TURSO_DATABASE_URL.");
  }

  await client.batch([
    `CREATE TABLE IF NOT EXISTS eia_state_rates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      state TEXT NOT NULL,
      sector TEXT NOT NULL DEFAULT 'RES',
      period TEXT NOT NULL,
      cents_per_kwh REAL NOT NULL,
      vintage INTEGER NOT NULL,
      source_form TEXT NOT NULL DEFAULT 'EIA-826',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    "CREATE UNIQUE INDEX IF NOT EXISTS eia_state_rates_unique ON eia_state_rates (state, sector, period, vintage)",
    "CREATE INDEX IF NOT EXISTS eia_state_rates_state_period_idx ON eia_state_rates (state, period)"
  ]);
}

export async function syncEiaResidentialStateRates() {
  const db = getDb();
  if (!db) {
    throw new Error("Missing TURSO_DATABASE_URL.");
  }

  await ensureEiaTables();
  const rates = await fetchEiaResidentialStateRates();
  const now = new Date().toISOString();

  for (const rate of rates) {
    await db.insert(eiaStateRates)
      .values({ ...rate, createdAt: now, updatedAt: now })
      .onConflictDoUpdate({
        target: [eiaStateRates.state, eiaStateRates.sector, eiaStateRates.period, eiaStateRates.vintage],
        set: {
          centsPerKwh: rate.centsPerKwh,
          sourceForm: rate.sourceForm,
          updatedAt: now
        }
      });
  }

  const latest = latestRatesFromRows(rates.map((rate) => ({
    state: rate.state,
    period: rate.period,
    centsPerKwh: rate.centsPerKwh,
    vintage: rate.vintage
  })));

  return { insertedOrUpdated: rates.length, latest };
}

function latestRatesFromRows(rows: LiveStateRate[]) {
  const latest = new Map<string, LiveStateRate>();
  for (const row of rows.sort((a, b) => b.period.localeCompare(a.period))) {
    if (!latest.has(row.state)) latest.set(row.state, row);
  }
  return latest;
}

export async function getLatestLiveStateRates() {
  const db = getDb();
  if (!db) return new Map<string, LiveStateRate>();

  try {
    const rows = await db.select({
      state: eiaStateRates.state,
      period: eiaStateRates.period,
      centsPerKwh: eiaStateRates.centsPerKwh,
      vintage: eiaStateRates.vintage
    })
      .from(eiaStateRates)
      .where(eq(eiaStateRates.sector, RESIDENTIAL_SECTOR))
      .orderBy(desc(eiaStateRates.period));

    return latestRatesFromRows(rows);
  } catch {
    return new Map<string, LiveStateRate>();
  }
}

function trendWithLatest(points: TrendPoint[], latest?: LiveStateRate) {
  if (!latest || points.length === 0) return points;
  const month = latest.period.length >= 7
    ? new Date(`${latest.period}-01T00:00:00Z`).toLocaleString("en-US", { month: "short", timeZone: "UTC" })
    : points[points.length - 1].month;
  return [...points.slice(0, -1), { month, value: Number(latest.centsPerKwh.toFixed(2)) }];
}

export async function getStatesWithLiveRates() {
  const latest = await getLatestLiveStateRates();
  return states.map((state) => {
    const live = latest.get(state.abbr);
    if (!live) return state;
    return {
      ...state,
      rate: Number(live.centsPerKwh.toFixed(1)),
      rateLow: Number(Math.min(state.rateLow, live.centsPerKwh).toFixed(1)),
      rateHigh: Number(Math.max(state.rateHigh, live.centsPerKwh).toFixed(1)),
      trend: trendWithLatest(state.trend, live)
    };
  });
}

export async function getStateWithLiveRate(slug: string) {
  return (await getStatesWithLiveRates()).find((state) => state.slug === slug);
}

export async function getDirectoryWithLiveRates() {
  const latest = await getLatestLiveStateRates();
  const rows = directory.map((row) => {
    const live = latest.get(row.abbr);
    return live ? { ...row, rate: Number(live.centsPerKwh.toFixed(1)) } : row;
  });
  const ranked = [...rows].sort((a, b) => a.rate - b.rate).map((row, index) => ({ ...row, rank: index + 1 }));
  const rankByAbbr = new Map(ranked.map((row) => [row.abbr, row.rank]));
  return rows.map((row) => ({ ...row, rank: rankByAbbr.get(row.abbr) || row.rank }));
}
