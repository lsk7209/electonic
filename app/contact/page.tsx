import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact wattbenchs electricity rate editors",
  description: "Contact wattbenchs editors about US electricity rates, average electric bill guides, data corrections, source questions, and privacy requests.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <main>
      <section className="hero">
        <div className="reading hero-copy">
          <p className="eyebrow">Contact</p>
          <h1>Contact wattbenchs electricity rate editors</h1>
          <p>Use this page for data corrections, source questions, privacy requests, and editorial feedback about electricity rate or electric bill content.</p>
        </div>
      </section>
      <section className="section">
        <div className="reading prose">
          <h2>Email</h2>
          <p>Editorial and site questions: <a href="mailto:editorial@wattbenchs.com">editorial@wattbenchs.com</a></p>
          <h2>What to include</h2>
          <ul>
            <li>The page URL or guide title.</li>
            <li>The data point, source, or statement you want reviewed.</li>
            <li>A public source link when the request is about a correction.</li>
          </ul>
          <h2>Editorial scope</h2>
          <p>wattbenchs explains public electricity rate benchmarks and bill-estimate methods. We do not sell electricity plans, provide utility account support, or collect personal utility account numbers.</p>
          <p>For data methodology, read the <Link href="/methodology">electric bill estimate methodology</Link>. For source references, review <Link href="/sources">electricity rate data sources</Link>.</p>
        </div>
      </section>
    </main>
  );
}
