import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Electricity rate data sources",
  description: "Electricity rate data sources used by wattbenchs, including EIA-826 monthly state rates and EIA-861 annual utility benchmarks.",
  path: "/sources"
});

export default function SourcesPage() {
  return (
    <main className="section">
      <div className="reading prose">
        <h1>Electricity rate data sources</h1>
        <p>Primary data source: U.S. Energy Information Administration electricity datasets, including EIA-826 for monthly state residential retail-rate context and EIA-861 for annual utility references.</p>
        <p>These records are public benchmarks, not a substitute for the tariff or account terms that apply to one household. Electricity bills can include fixed charges, taxes, riders, tiered prices, time-of-use periods, credits, and service-specific rules that are outside a state average. The site therefore labels its source form and vintage instead of presenting an estimate as a current utility quote.</p>
        <h2>What each source supports</h2>
        <ul>
          <li><a href="https://api.eia.gov/v2/electricity/retail-sales/data/" target="_blank" rel="noreferrer">EIA retail-sales API</a>: monthly residential average-rate context by state. The reporting period travels with the stored value so a state page can identify its data vintage.</li>
          <li><a href="https://www.eia.gov/electricity/data/eia861/" target="_blank" rel="noreferrer">EIA-861 annual data</a>: utility-level reference context. It is not used as a live rate quote and should be read with its visible annual vintage.</li>
          <li><a href="https://www.eia.gov/electricity/data.php" target="_blank" rel="noreferrer">EIA electricity data catalog</a>: the public catalog for checking source scope, releases, and documentation.</li>
        </ul>
        <h2>How wattbenchs uses the records</h2>
        <p>Production ingestion uses monthly EIA-826 fetches and can use bulk downloads for backfills to avoid unnecessary API load. The adapter stores the state, residential sector, reporting period, cents-per-kWh value, source form, and vintage. When a fresher stored monthly record is available, state pages use it for rate context; otherwise they retain the site&apos;s labelled baseline data. Utility pages use EIA-861 only as a separately labelled annual reference.</p>
        <p>State averages are a benchmark for interpreting kWh usage and the broad price environment. They are not a replacement for a utility bill, a plan disclosure, or a customer-specific quote. A newer page does not make an older source period current, and a newer source period still does not establish the exact charges on an individual account.</p>
        <h2>Reader verification checklist</h2>
        <ol>
          <li>Check the source form and vintage shown on the wattbenchs page.</li>
          <li>Compare the benchmark with the billing period and kWh on the actual utility bill.</li>
          <li>Open the utility&apos;s current tariff, plan disclosure, or customer notice for account-specific rates and fees.</li>
          <li>For affordability programs, confirm deadlines, funding, documents, and program eligibility with the administering agency; a guide cannot determine eligibility.</li>
          <li>Send a correction request through the <Link href="/contact">contact page</Link> with the page URL, the disputed item, and a public supporting source.</li>
        </ol>
        <h2>Limits and corrections</h2>
        <p>Source links document the inputs used for public context. They do not certify a provider, recommend a plan, or guarantee savings. When a public source changes or a page needs clarification, the editorial process can update, qualify, or remove the affected statement. Read the <Link href="/methodology">methodology</Link> for the estimate boundary and the <Link href="/editorial-policy">editorial policy</Link> for source, correction, and advertising-separation standards.</p>
      </div>
    </main>
  );
}
