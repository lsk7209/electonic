import Link from "next/link";
import { Estimator } from "@/components/Estimator";
import { JsonLd } from "@/components/JsonLd";
import { SourceBadge } from "@/components/SourceBadge";
import { StateDirectory } from "@/components/StateDirectory";
import { TrendChart } from "@/components/TrendChart";
import { directory, nationalTrend, states } from "@/lib/data";
import { absoluteUrl } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "US electricity rates: average bill estimator by state",
  description: "US electricity rates and average electric bill estimates by state, with EIA data, rankings, comparisons, and a client-side bill estimator.",
  path: "/"
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: "US residential electricity rate benchmarks",
        creator: "wattbenchs",
        license: "https://www.eia.gov/about/copyrights_reuse.php",
        url: absoluteUrl("/"),
        variableMeasured: "Average residential retail electricity price"
      }} />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <SourceBadge />
              <h1>Is your electric bill normal?</h1>
              <p>Estimate a monthly bill range, compare state rates, and see how your benchmark stacks up against the national average using transparent EIA public data.</p>
              <div className="meta-row">
                <Link className="button" href="/compare">Compare states</Link>
                <Link className="button-secondary" href="/methodology">How estimates work</Link>
              </div>
            </div>
            <Estimator />
          </div>
        </section>

        <section className="section">
          <div className="container grid-3">
            <div className="card card-pad stat"><span className="muted">Demo states live</span><strong>{states.length}</strong><p className="muted">CA, TX, WA with utility details.</p></div>
            <div className="card card-pad stat"><span className="muted">Directory rows</span><strong>{directory.length}</strong><p className="muted">Ranked examples for state discovery.</p></div>
            <div className="card card-pad stat"><span className="muted">Rule</span><strong>Range</strong><p className="muted">No false single-number precision.</p></div>
          </div>
        </section>

        <section className="section">
          <div className="container" style={{ display: "grid", gap: 18 }}>
            <div>
              <p className="eyebrow">State rankings</p>
              <h2>Cheapest and most expensive electricity states</h2>
            </div>
            <StateDirectory />
          </div>
        </section>

        <section className="section surface">
          <div className="container grid-2">
            <TrendChart points={nationalTrend} label="U.S. residential rate benchmark" />
            <div className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p className="eyebrow">Guides</p>
              <h2>Helpful context, not just numbers</h2>
              <p className="muted">Each guide includes data cards or an estimator so the page stays useful even when search answers the simple fact.</p>
              <Link className="button" href="/blog">Read guides</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
