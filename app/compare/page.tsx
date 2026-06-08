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
          <div className="bar-list" style={{ marginTop: 22 }}>
            {directory.map((row) => (
              <div className="bar-row" key={row.abbr}>
                <strong>{row.name}</strong>
                <span className="bar-track"><span className="bar-fill" style={{ width: `${(row.rate / max) * 100}%`, background: row.rank <= 10 ? "var(--good)" : row.rank >= 42 ? "var(--caution)" : "var(--primary)" }} /></span>
                <span className="tnum rate">{row.rate.toFixed(1)}¢</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
