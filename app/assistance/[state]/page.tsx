import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Notice } from "@/components/Notice";
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
    title: `Electric bill help in ${state.name}: LIHEAP and payment options`,
    description: `Electric bill help in ${state.name}, including LIHEAP, payment arrangements, budget billing, weatherization, and documents to prepare.`,
    path: `/assistance/${state.slug}`
  }) : {};
}

export default async function AssistancePage({ params }: Props) {
  const { state: slug } = await params;
  const state = getState(slug);
  if (!state) notFound();
  return (
    <main>
      <section className="hero">
        <div className="reading hero-copy">
          <SourceBadge />
          <h1>Electric bill help in {state.name}</h1>
          <p>Start with the utility, then check LIHEAP, weatherization assistance, and local hardship programs.</p>
          <Notice>Program rules vary by state and household. This page is informational and does not collect personal information.</Notice>
        </div>
      </section>
      <section className="section">
        <div className="reading prose">
          <h2>Four steps to try first</h2>
          <ol>
            <li>Call the utility before a disconnection notice becomes urgent.</li>
            <li>Ask about payment arrangements, budget billing, and hardship protections.</li>
            <li>Check LIHEAP through your state energy or human services office.</li>
            <li>Gather ID, income proof, account number, and a recent bill before applying.</li>
          </ol>
        </div>
      </section>
    </main>
  );
}
