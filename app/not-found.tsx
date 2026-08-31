import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  alternates: {
    canonical: null,
  },
};

export default function NotFound() {
  return (
    <main>
      <section className="section">
        <div className="reading" style={{ display: "grid", gap: 18 }}>
          <p className="eyebrow">404</p>
          <h1>That electricity benchmark page is not available.</h1>
          <p className="muted">
            The requested page is not in the current wattbenchs dataset. Use a verified guide,
            state comparison, or the bill estimator instead.
          </p>
          <div className="meta-row">
            <Link className="button" href="/compare">Compare states</Link>
            <Link className="button-secondary" href="/">Use the bill estimator</Link>
          </div>
          <nav aria-label="Helpful wattbenchs pages">
            <ul>
              <li><Link href="/guides">Read electricity guides</Link></li>
              <li><Link href="/methodology">Review the methodology</Link></li>
              <li><Link href="/sources">Check public data sources</Link></li>
            </ul>
          </nav>
        </div>
      </section>
    </main>
  );
}
