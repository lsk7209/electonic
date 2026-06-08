import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Estimator } from "@/components/Estimator";
import { JsonLd } from "@/components/JsonLd";
import { Notice } from "@/components/Notice";
import { RankBadge } from "@/components/RankBadge";
import { SourceBadge } from "@/components/SourceBadge";
import { TrendChart } from "@/components/TrendChart";
import { getState, states } from "@/lib/data";
import { getStateWithLiveRate } from "@/lib/eia";
import { absoluteUrl } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ state: string }> };

export function generateStaticParams() {
  return states.map((state) => ({ state: state.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getState(slug);
  if (!state) return {};
  return pageMetadata({
    title: `${state.name} electricity rates: average electric bill estimate`,
    description: `${state.name} electricity rates, average electric bill estimates, EIA trend data, utility benchmarks, and bill-saving resources.`,
    path: `/${state.slug}`
  });
}

export default async function StatePage({ params }: Props) {
  const { state: slug } = await params;
  const state = await getStateWithLiveRate(slug);
  if (!state) notFound();
  const isDeregulated = state.market === "deregulated";

  return (
    <main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: `${state.name} residential electricity rates`,
        spatialCoverage: state.name,
        url: absoluteUrl(`/${state.slug}`),
        variableMeasured: "Average residential electricity price",
        isBasedOn: "EIA-826 monthly retail sales data"
      }} />
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <SourceBadge />
            <div className="meta-row"><RankBadge rank={state.rank} /><span className="chip">{isDeregulated ? "Competitive market" : "Regulated market"}</span></div>
            <h1>{state.name} electricity rates</h1>
            <p>{state.blurb}</p>
            {isDeregulated ? (
              <Notice>This is a competitive retail market. Benchmarks show average public-data prices; actual plan terms and prices can differ.</Notice>
            ) : (
              <Notice>Rates are generally set through utility and public commission processes. Shopping language is intentionally avoided on this page.</Notice>
            )}
          </div>
          <Estimator fixedStateSlug={state.slug} title={`${state.name} bill estimator`} />
        </div>
      </section>

      <section className="section">
        <div className="container grid-3">
          <div className="card card-pad stat"><span className="muted">Residential rate</span><strong className="tnum">{state.rate.toFixed(1)}¢</strong><p className="muted">per kWh benchmark</p></div>
          <div className="card card-pad stat"><span className="muted">Typical usage</span><strong className="tnum">{state.usageAvg}</strong><p className="muted">kWh/month example</p></div>
          <div className="card card-pad stat"><span className="muted">YoY movement</span><strong className={state.yoy > 0 ? "caution" : "good"}>{state.yoy > 0 ? "+" : ""}{state.yoy.toFixed(1)}%</strong><p className="muted">demo trend</p></div>
        </div>
      </section>

      <section className="section surface">
        <div className="container grid-2">
          <TrendChart points={state.trend} label={`${state.name} residential rate`} />
          <div className="card card-pad">
            <p className="eyebrow">Utilities</p>
            <h2>Large utility benchmarks</h2>
            <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
              {state.utilities.map((utility) => (
                <Link className="rank-row" style={{ gridTemplateColumns: "1fr 80px 92px 28px", padding: 12 }} key={utility.slug} href={`/${state.slug}/${utility.slug}`}>
                  <strong>{utility.name}</strong>
                  <span className="rate tnum">{utility.rate.toFixed(1)}¢</span>
                  <span className="muted tnum">{utility.vintage}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div className="card card-pad">
            <p className="eyebrow">Lower your bill</p>
            <h2>Practical next steps</h2>
            <p className="muted" style={{ marginTop: 12 }}>Reduce high-use appliances first, review budget billing if cash flow is the issue, and check assistance programs before an arrears balance grows.</p>
            <div className="meta-row" style={{ marginTop: 18 }}><Link className="button" href={`/save/${state.slug}`}>Saving guide</Link><Link className="button-secondary" href={`/assistance/${state.slug}`}>Bill help</Link></div>
          </div>
          <div className="card card-pad">
            <p className="eyebrow">FAQ</p>
            <h3>Is {state.name} expensive for electricity?</h3>
            <p className="muted" style={{ marginTop: 10 }}>{state.rank >= 42 ? "Yes, compared with most states." : state.rank <= 10 ? "No, it is among the cheaper states." : "It sits near the middle of the national ranking."} The benchmark should still be read as an average, not a specific plan or tariff.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
