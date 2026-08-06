import type { Metadata } from "next";
import Link from "next/link";
import { SourceBadge } from "@/components/SourceBadge";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Electric bill estimate methodology",
  description: "Electric bill estimate methodology for wattbenchs, including EIA data sources, rate calculations, included factors, excluded fees, and data freshness rules.",
  path: "/methodology"
});

export default function MethodologyPage() {
  return (
    <main>
      <section className="hero">
        <div className="reading hero-copy">
          <SourceBadge />
          <h1>Electric bill estimate methodology</h1>
          <p>wattbenchs turns public average rates into conservative bill ranges. The calculation is useful for benchmarking, not tariff-level billing.</p>
        </div>
      </section>
      <section className="section">
        <div className="reading prose">
          <h2>Calculation</h2>
          <p>Monthly estimate midpoint equals monthly kWh usage multiplied by residential average cents per kWh, divided by 100. The displayed result is widened into a range to avoid false precision.</p>
          <p>For example, the calculation starts with the household&apos;s stated kWh and a labelled state benchmark: <strong>monthly kWh x cents per kWh / 100</strong>. The result is a comparison point for investigating a bill, not a reconstruction of the utility invoice. A reader should enter the billing period&apos;s kWh where possible and keep fixed charges separate from the energy-rate comparison.</p>
          <div className="grid-2">
            <div className="card card-pad"><h3 className="good">Included</h3><p>Average rate, user-selected usage, state market context, source vintage.</p></div>
            <div className="card card-pad"><h3 className="caution">Excluded</h3><p>Fixed fees, tiered pricing, taxes, time-of-use details, discounts, and specific plan terms.</p></div>
          </div>
          <h2>Freshness rules</h2>
          <p>State pages use EIA-826 monthly residential retail-sales data for rate context. Utility pages use EIA-861 annual data only as a reference, and each utility page must show its vintage because an annual series can lag a current bill.</p>
          <h2>Read the estimate beside the bill, not instead of it</h2>
          <p>The estimator starts with a state-level residential average and the kWh value a reader enters. It does not retrieve a reader&apos;s utility tariff, account balance, meter data, or enrollment status. A result can be useful for checking the scale of a bill or comparing a change in usage, but it cannot confirm what a utility will charge.</p>
          <p>Before choosing a rate plan, changing service, or relying on an assistance option, compare the result with the current utility bill and the utility&apos;s official terms. Fixed customer charges, taxes, riders, tier thresholds, time-of-use windows, credits, discounts, and local eligibility rules can change the final amount. The applicable utility or program administrator is the source of record for those details.</p>
          <h2>Primary source records</h2>
          <p>Our state-rate ingestion reads the EIA electricity retail-sales API with the residential sector filter and records the reporting period with every stored value. A source release date, its reporting period, and a page update date are different facts: updating a page does not convert historical data into a live tariff quote.</p>
          <ul>
            <li><a href="https://www.eia.gov/electricity/data.php" target="_blank" rel="noreferrer">EIA electricity data catalog</a> — the public index for electricity datasets and releases.</li>
            <li><a href="https://api.eia.gov/v2/electricity/retail-sales/data/" target="_blank" rel="noreferrer">EIA retail-sales API</a> — the source endpoint used for monthly residential average-rate context.</li>
            <li><a href="https://www.eia.gov/electricity/data/eia861/" target="_blank" rel="noreferrer">EIA-861 annual electric power industry data</a> — the annual utility-reference series used with a visible vintage.</li>
          </ul>
          <h2>Review and correction boundary</h2>
          <p>Use the estimate to decide what to inspect next: billing days, kWh, fixed and delivery charges, tax lines, and the tariff or plan name. Time-of-use pricing, solar exports, budget-billing reconciliation, and partial service months can all produce a difference that a state average cannot explain. If a reader finds an issue, they can send the page URL, the specific data point, and a public source through the <Link href="/contact">contact page</Link>. The team can then correct, clarify, or remove the claim based on the supporting record.</p>
          <p>These links document the public source records; they do not make an estimate a current tariff quote or an eligibility decision. See <Link href="/sources">the source register</Link> for the short data-use summary and <Link href="/editorial-policy">the editorial policy</Link> for correction requests.</p>
          <h2>Advertising and editorial separation</h2>
          <p>wattbenchs is designed for AdSense Auto Ads, but estimate tools, disclaimers, source labels, and editorial explanations remain the primary page content. Manual ad slots are intentionally not placed in the layout.</p>
        </div>
      </section>
    </main>
  );
}
