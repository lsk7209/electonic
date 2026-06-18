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
          <div className="container grid-2">
            <div className="card card-pad">
              <p className="eyebrow">How to read the estimate</p>
              <h2>Separate usage, rate, and fixed charges before comparing bills</h2>
              <p className="muted">A high electric bill is not always caused by a high state rate. Two households can pay very different bills at the same cents-per-kWh price because weather, heating fuel, appliance load, household size, and fixed utility charges change the monthly total.</p>
              <p className="muted">Use the estimator as a screening tool: enter a realistic monthly kWh range, compare it with the state benchmark, then check your utility tariff or current bill for delivery charges, riders, taxes, and minimum fees before making a budget decision.</p>
            </div>
            <div className="card card-pad">
              <p className="eyebrow">Editorial standard</p>
              <h2>Public data first, no savings guarantees</h2>
              <p className="muted">wattbenchs avoids unsupported savings promises. State pages and guides explain the source vintage, where a benchmark comes from, and which parts of a bill may not be captured by a simple average residential rate.</p>
              <p className="muted">For account-specific disputes, outage credits, shutoff notices, medical baseline programs, or assistance eligibility, readers should use the utility, state regulator, or assistance-office link shown on the relevant guide instead of relying on an estimate alone.</p>
            </div>
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
