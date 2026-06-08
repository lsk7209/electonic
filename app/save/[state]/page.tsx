import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Estimator } from "@/components/Estimator";
import { SourceBadge } from "@/components/SourceBadge";
import { getState, states } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ state: string }> };

export function generateStaticParams() {
  return states.map((state) => ({ state: state.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getState(slug);
  return state ? pageMetadata({
    title: `Lower electric bill in ${state.name}: practical savings guide`,
    description: `Lower your electric bill in ${state.name} with usage-focused steps for cooling, heating, TOU windows, budget billing, and bill estimate checks.`,
    path: `/save/${state.slug}`
  }) : {};
}

export default async function SavePage({ params }: Props) {
  const { state: slug } = await params;
  const state = getState(slug);
  if (!state) notFound();
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <SourceBadge />
            <h1>How to lower your electric bill in {state.name}</h1>
            <p>Focus first on the loads that move kWh: cooling, heating, water heating, dryers, pumps, and EV charging.</p>
          </div>
          <Estimator fixedStateSlug={state.slug} title={`${state.name} savings estimator`} />
        </div>
      </section>
      <section className="section">
        <div className="reading prose">
          <h2>Highest-impact moves</h2>
          <ul>
            <li>Raise cooling setpoints a few degrees during peak hours.</li>
            <li>Shift flexible loads away from time-of-use peak windows when applicable.</li>
            <li>Seal air leaks and replace dirty HVAC filters.</li>
            <li>Use budget billing for cash-flow stability if your utility offers it.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
