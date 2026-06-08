import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Estimator } from "@/components/Estimator";
import { Notice } from "@/components/Notice";
import { SourceBadge } from "@/components/SourceBadge";
import { TrendChart } from "@/components/TrendChart";
import { getUtility, states } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ state: string; utility: string }> };

export function generateStaticParams() {
  return states.flatMap((state) => state.utilities.map((utility) => ({ state: state.slug, utility: utility.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, utility: utilitySlug } = await params;
  const { state, utility } = getUtility(stateSlug, utilitySlug);
  if (!state || !utility) return {};
  return pageMetadata({
    title: `${utility.name} electricity rates: average utility benchmark`,
    description: `${utility.name} electricity rates in ${state.name}, utility benchmark, state comparison, bill estimate, and EIA vintage ${utility.vintage} data.`,
    path: `/${state.slug}/${utility.slug}`
  });
}

export default async function UtilityPage({ params }: Props) {
  const { state: stateSlug, utility: utilitySlug } = await params;
  const { state, utility } = getUtility(stateSlug, utilitySlug);
  if (!state || !utility) notFound();
  const delta = Math.round(((utility.rate - state.rate) / state.rate) * 100);
  const utilityTrend = state.trend.map((point) => ({ ...point, value: Number((point.value * (utility.rate / state.rate)).toFixed(2)) }));

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <SourceBadge vintage={utility.vintage} />
            <Link className="chip" href={`/${state.slug}`}>← {state.name}</Link>
            <h1>{utility.name}</h1>
            <p>Average electricity benchmark for a demand-gated utility page. Utility names are used for identification only; no logo or affiliation is implied.</p>
            <Notice>Not affiliated with {utility.name}. Utility-level EIA-861 data is annual and can lag current monthly rates; vintage is shown prominently.</Notice>
            <div className="grid-3">
              <div className="card card-pad stat"><span className="muted">Utility rate</span><strong>{utility.rate.toFixed(1)}¢</strong></div>
              <div className="card card-pad stat"><span className="muted">Vs state avg</span><strong className={delta > 0 ? "caution" : "good"}>{delta > 0 ? "+" : ""}{delta}%</strong></div>
              <div className="card card-pad stat"><span className="muted">Customers</span><strong className="tnum">{utility.customers.toLocaleString()}</strong></div>
            </div>
          </div>
          <Estimator fixedStateSlug={state.slug} rateOverride={utility.rate} compact title="Utility benchmark estimator" />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <TrendChart points={utilityTrend} label={`${utility.name} benchmark trend`} />
        </div>
      </section>
    </main>
  );
}
