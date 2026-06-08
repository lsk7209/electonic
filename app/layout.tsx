import type { Metadata } from "next";
import { Inter, Newsreader, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { siteUrl } from "@/lib/env";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "US electricity rates and average bill estimator",
    template: "%s | WattBench"
  },
  description: "US electricity rates, average electric bill estimates, state comparisons, and public EIA data guides from WattBench.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml"
    }
  }
};

const nav = [
  ["States", "/#states"],
  ["Compare", "/compare"],
  ["Blog", "/blog"],
  ["Methodology", "/methodology"],
  ["Sources", "/sources"]
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${newsreader.variable}`}>
        <header className="nav">
          <div className="container nav-inner">
            <Link className="brand" href="/" aria-label="WattBench home">
              <span className="bolt">W</span>
              <span>WattBench</span>
            </Link>
            <nav className="nav-links" aria-label="Main navigation">
              {nav.map(([label, href]) => (
                <Link key={href} href={href}>{label}</Link>
              ))}
            </nav>
            <Link className="button-secondary" href="/compare">Compare states</Link>
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="container footer-grid">
            <div>
              <div className="brand"><span className="bolt">W</span><span>WattBench</span></div>
              <p style={{ marginTop: 12 }}>Public-data electricity benchmarks, bill estimates, and practical guides. Not affiliated with any utility.</p>
            </div>
            <div><strong>Data</strong><Link href="/methodology">Methodology</Link><Link href="/sources">Sources</Link><Link href="/compare">Compare</Link></div>
            <div><strong>Guides</strong><Link href="/blog">Blog</Link><Link href="/assistance/california">Bill help</Link><Link href="/save/texas">Save money</Link><Link href="/rss.xml">RSS feed</Link></div>
            <div><strong>Company</strong><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/sources">Sources</Link><a href="mailto:editorial@wattbench.example">Contact</a></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
