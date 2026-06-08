import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Electricity rate data sources",
  description: "Electricity rate data sources used by WattBench, including EIA-826 monthly state rates and EIA-861 annual utility benchmarks.",
  path: "/sources"
});

export default function SourcesPage() {
  return (
    <main className="section">
      <div className="reading prose">
        <h1>Electricity rate data sources</h1>
        <p>Primary data source: U.S. Energy Information Administration electricity datasets, including EIA-826 for monthly state retail rates and EIA-861 for annual utility references.</p>
        <p>EIA data is public domain. Production ingestion should use monthly fetches plus bulk download for backfills to avoid unnecessary API load.</p>
        <p>Every data page should show the source form, data vintage, and last-updated label so readers and crawlers can understand freshness and limitations.</p>
      </div>
    </main>
  );
}
