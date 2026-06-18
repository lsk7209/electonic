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
              <p className="muted">For a quick audit, run three scenarios: a low-usage month, a normal month, and a seasonal peak month. If the peak result is the only one that looks unusual, weather or equipment load may be the better explanation. If every scenario looks high, the rate plan, delivery charge, or fixed customer charge deserves closer review.</p>
              <p className="muted">The next step is to compare the estimate with the usage line on an actual bill. If kWh is higher than expected, focus on appliances, HVAC runtime, insulation, or occupancy. If kWh looks normal but the bill is still high, focus on the price line items and whether the household is on a default, variable, or time-of-use plan.</p>
              <p className="muted">This approach is also useful after a move. Instead of comparing a prior annual bill to a new address, compare expected kWh, the local benchmark rate, and the fixed customer charge separately. That prevents a relocation, new appliance mix, or changed heating fuel from being misread as a rate problem.</p>
            </div>
            <div className="card card-pad">
              <p className="eyebrow">Editorial standard</p>
              <h2>Public data first, no savings guarantees</h2>
              <p className="muted">wattbenchs avoids unsupported savings promises. State pages and guides explain the source vintage, where a benchmark comes from, and which parts of a bill may not be captured by a simple average residential rate.</p>
              <p className="muted">For account-specific disputes, outage credits, shutoff notices, medical baseline programs, or assistance eligibility, readers should use the utility, state regulator, or assistance-office link shown on the relevant guide instead of relying on an estimate alone.</p>
              <p className="muted">When a guide mentions bill help, rate plans, or usage changes, the page should point readers back to a verifiable public source. That keeps the site useful for comparison while avoiding claims that a generic calculator cannot prove for a specific service address.</p>
              <p className="muted">Pages are reviewed to keep ads away from the core calculator task and to avoid confusing paid placement with utility data. If a reader needs a final answer, the page should make clear which public source or utility document can confirm the number.</p>
              <p className="muted">The site is intentionally conservative with language. It can show a benchmark, explain why a bill might be high, and point to assistance or tariff resources, but it should not promise a lower bill, recommend a provider as a paid placement, or imply that a public average is the same as a customer-specific quote.</p>
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
