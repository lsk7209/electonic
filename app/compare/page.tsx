import type { Metadata } from "next";
import { Estimator } from "@/components/Estimator";
import { SourceBadge } from "@/components/SourceBadge";
import { getDirectoryWithLiveRates } from "@/lib/eia";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Compare electricity rates by state",
  description: "Compare electricity rates by state with residential cents-per-kWh benchmarks and average electric bill estimates.",
  path: "/compare"
});

export default async function ComparePage() {
  const directory = await getDirectoryWithLiveRates();
  const max = Math.max(...directory.map((row) => row.rate));
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <SourceBadge />
            <h1>Compare electricity rates by state</h1>
            <p>Scan average residential rates, then use the estimator to translate cents per kWh into a monthly bill range.</p>
          </div>
          <Estimator />
        </div>
      </section>
      <section className="section">
        <div className="container card card-pad">
          <p className="eyebrow">Rate comparison</p>
          <h2>Residential rate benchmarks</h2>
          <p className="muted">This table compares average residential electricity prices by state. Treat the ranking as a benchmark, not a final bill prediction: a state with a lower average rate can still produce a higher bill when cooling load, electric heat, household usage, or fixed delivery fees are high.</p>
          <p className="muted">Start with the cents-per-kWh comparison, then use the estimator on this page to test low, typical, and high usage scenarios. If you are comparing utilities inside one state, check each utility page or published tariff because local delivery charges and rider adjustments can matter more than the statewide average.</p>
          <div className="bar-list" style={{ marginTop: 22 }}>
            {directory.map((row) => (
              <div className="bar-row" key={row.abbr}>
                <strong>{row.name}</strong>
                <span className="bar-track"><span className="bar-fill" style={{ width: `${(row.rate / max) * 100}%`, background: row.rank <= 10 ? "var(--good)" : row.rank >= 42 ? "var(--caution)" : "var(--primary)" }} /></span>
                <span className="tnum rate">{row.rate.toFixed(1)}¢</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, display: "grid", gap: 10 }}>
            <h3>What the comparison does not include</h3>
            <p className="muted">Average rates usually do not show every bill component a household sees. Your bill may include customer charges, distribution fees, public-purpose program charges, fuel adjustments, time-of-use pricing, demand charges for some plans, or taxes that vary by city and utility.</p>
            <p className="muted">For that reason, wattbenchs presents ranges and source context instead of telling readers that one state or utility will always be cheaper. The safest workflow is to compare the benchmark, estimate several usage levels, and then verify the current rate schedule before switching plans or changing a household budget.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
