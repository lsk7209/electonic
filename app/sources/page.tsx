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
        <h2>What each source supports</h2>
        <ul>
          <li><a href="https://api.eia.gov/v2/electricity/retail-sales/data/" target="_blank" rel="noreferrer">EIA retail-sales API</a>: monthly residential average-rate context by state. The reporting period travels with the stored value so a state page can identify its data vintage.</li>
          <li><a href="https://www.eia.gov/electricity/data/eia861/" target="_blank" rel="noreferrer">EIA-861 annual data</a>: utility-level reference context. It is not used as a live rate quote and should be read with its visible annual vintage.</li>
          <li><a href="https://www.eia.gov/electricity/data.php" target="_blank" rel="noreferrer">EIA electricity data catalog</a>: the public catalog for checking source scope, releases, and documentation.</li>
        </ul>
        <h2>How wattbenchs uses the records</h2>
        <p>State averages are a benchmark for interpreting kWh usage and the broad price environment. They are not a replacement for a utility bill, a plan disclosure, or a customer-specific quote. Fixed charges, taxes, riders, time-of-use periods, credits, and enrollment choices may not appear in an average-rate estimate.</p>
        <p>Likewise, assistance information on this site is a starting point for finding the right official agency or utility contact. Funding, deadlines, program eligibility, benefits, and payment-arrangement terms are decided by the relevant program or utility and may change. Readers should verify those details with the official administrator before acting.</p>
        <p>EIA data is public domain. Production ingestion uses monthly fetches and can use bulk downloads for backfills to avoid unnecessary API load. Every data page should show the source form, data vintage, and last-updated label so readers and crawlers can understand freshness and limitations. For the calculation boundary, read the <Link href="/methodology">methodology</Link>; to report a correction, use the <Link href="/contact">contact page</Link>.</p>
      </div>
    </main>
  );
}
