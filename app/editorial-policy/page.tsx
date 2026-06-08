import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Editorial policy for wattbenchs electricity guides",
  description: "Editorial policy for wattbenchs electricity rate guides, including public data sourcing, corrections, advertising separation, and estimate limitations.",
  path: "/editorial-policy"
});

export default function EditorialPolicyPage() {
  return (
    <main>
      <section className="hero">
        <div className="reading hero-copy">
          <p className="eyebrow">Editorial policy</p>
          <h1>Editorial policy for wattbenchs electricity guides</h1>
          <p>wattbenchs publishes consumer-facing electricity rate and electric bill guidance based on public data, conservative estimates, and clear source labeling.</p>
        </div>
      </section>
      <section className="section">
        <div className="reading prose">
          <h2>Source standard</h2>
          <p>Electricity rate and utility benchmark pages prioritize public sources such as the U.S. Energy Information Administration, state utility commission materials, and official program pages when assistance or affordability topics are discussed.</p>
          <h2>Estimate limitations</h2>
          <p>Bill estimates are educational benchmarks. They do not replace a utility tariff, retail electricity contract, tax calculation, or account-specific utility notice. Pages should explain when fixed fees, riders, billing days, weather, and household usage can change the final bill.</p>
          <h2>Corrections</h2>
          <p>Readers can request a correction through the <Link href="/contact">contact page</Link>. Useful correction requests include the page URL, the disputed data point, and a public source that supports the update.</p>
          <h2>Advertising separation</h2>
          <p>wattbenchs uses Google AdSense Auto Ads, but advertising does not determine article topics, source selection, rate explanations, calculator behavior, or correction decisions. Manual ad slots are intentionally not placed inside the editorial templates.</p>
          <h2>Reader safety</h2>
          <p>When an electric bill involves shutoff risk, payment hardship, meter disputes, or account-specific charges, readers should contact the utility, public commission, or assistance office directly. wattbenchs does not collect account numbers or act as a utility representative.</p>
        </div>
      </section>
    </main>
  );
}
