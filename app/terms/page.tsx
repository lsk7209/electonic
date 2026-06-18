import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of use for wattbenchs",
  description: "wattbenchs terms of use covering public electricity data, estimator limitations, advertising separation, and acceptable use.",
  path: "/terms"
});

export default function TermsPage() {
  return (
    <main className="section">
      <div className="reading prose">
        <h1>Terms of use for wattbenchs</h1>
        <p>wattbenchs is an independent public-data site about U.S. electricity rates, average bills, utility benchmarks, and affordability resources. By using the site, you agree to treat the content as general information, not as legal, financial, engineering, or account-specific utility advice.</p>
        <h2>Data limitations</h2>
        <p>Rate benchmarks, average bill estimates, utility names, state comparisons, and guide content may rely on public sources such as EIA datasets, utility filings, assistance program pages, and other referenced materials. These sources can change, lag behind current bills, or differ from a reader&apos;s exact tariff, taxes, fees, usage pattern, or service address.</p>
        <h2>Estimator use</h2>
        <p>Calculator and estimator outputs are approximate. They are intended to help readers understand usage, rate, and bill drivers. They should not replace a utility bill, official rate schedule, energy audit, professional advice, or assistance-program eligibility determination.</p>
        <h2>Advertising and editorial separation</h2>
        <p>Advertising may appear on wattbenchs through services such as Google AdSense. Ads do not decide which states, utilities, datasets, or guides we publish. Editorial pages should remain source-led and separate from ad targeting or advertiser interests.</p>
        <h2>Corrections</h2>
        <p>If a page appears inaccurate or outdated, contact us with the page URL, the data point at issue, and the public source that supports a correction. We may update, clarify, or remove content when source evidence supports the change.</p>
        <h2>Acceptable use</h2>
        <p>Do not overload the site, bypass technical controls, misrepresent wattbenchs content as official utility or government guidance, or reuse pages in a way that violates applicable law or third-party source terms.</p>
      </div>
    </main>
  );
}
