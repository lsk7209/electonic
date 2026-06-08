import type { Metadata } from "next";
import { SourceBadge } from "@/components/SourceBadge";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Electric bill estimate methodology",
  description: "Electric bill estimate methodology for WattBench, including EIA data sources, rate calculations, included factors, excluded fees, and data freshness rules.",
  path: "/methodology"
});

export default function MethodologyPage() {
  return (
    <main>
      <section className="hero">
        <div className="reading hero-copy">
          <SourceBadge />
          <h1>Electric bill estimate methodology</h1>
          <p>WattBench turns public average rates into conservative bill ranges. The calculation is useful for benchmarking, not tariff-level billing.</p>
        </div>
      </section>
      <section className="section">
        <div className="reading prose">
          <h2>Calculation</h2>
          <p>Monthly estimate midpoint equals monthly kWh usage multiplied by residential average cents per kWh, divided by 100. The displayed result is widened into a range to avoid false precision.</p>
          <div className="grid-2">
            <div className="card card-pad"><h3 className="good">Included</h3><p>Average rate, user-selected usage, state market context, source vintage.</p></div>
            <div className="card card-pad"><h3 className="caution">Excluded</h3><p>Fixed fees, tiered pricing, taxes, time-of-use details, discounts, and specific plan terms.</p></div>
          </div>
          <h2>Freshness rules</h2>
          <p>State pages should use EIA-826 monthly data for current rate context. Utility pages use EIA-861 annual data as a reference and must show vintage labels.</p>
          <h2>Advertising and editorial separation</h2>
          <p>WattBench is designed for AdSense Auto Ads, but estimate tools, disclaimers, source labels, and editorial explanations remain the primary page content. Manual ad slots are intentionally not placed in the layout.</p>
        </div>
      </section>
    </main>
  );
}
