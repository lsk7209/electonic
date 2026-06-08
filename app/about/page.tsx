import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About wattbenchs electricity rate data",
  description: "About wattbenchs, an independent public-data site for US electricity rates, average bill estimates, and EIA-based guides.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <main className="section">
      <div className="reading prose">
        <h1>About wattbenchs electricity rate data</h1>
        <p>wattbenchs is an independent public-data electricity rate benchmark site for U.S. consumers. It explains average rates, bill estimates, market differences, and affordability resources in plain English.</p>
        <p>We are not affiliated with utilities, retail electricity providers, or government agencies. Utility names are used only to identify public EIA data and service-area benchmarks.</p>
        <p>Our editorial standard is conservative: show sources, label data vintage, avoid false precision, and keep advertising subordinate to the reader task.</p>
      </div>
    </main>
  );
}
