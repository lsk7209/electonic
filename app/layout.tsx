import type { Metadata } from "next";
import { Inter, Newsreader, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { siteUrl } from "@/lib/env";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "US electricity rates and average bill estimator",
    template: "%s | wattbenchs"
  },
  description: "US electricity rates, average electric bill estimates, state comparisons, and public EIA data guides from wattbenchs.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml"
    }
  },
  verification: {
    google: "It0Es9r6NSXMIGl8Ll60bvQZ06RR3EinTe6NHYFTJYc"
  },
  other: {
    "naver-site-verification": "98fda8d8fe95c1df7e31abd50a5a8cf63ef48549"
  }
};

const nav = [
  ["States", "/#states"],
  ["Compare", "/compare"],
  ["Blog", "/blog"],
  ["Methodology", "/methodology"],
  ["Sources", "/sources"]
];

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-V70KJ8GE9J";
const adsensePublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-3050601904412736";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {gaMeasurementId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
            <Script id="ga4-config" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}
        {adsensePublisherId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${newsreader.variable}`}>
        <header className="nav">
          <div className="container nav-inner">
            <Link className="brand" href="/" aria-label="wattbenchs home">
              <span className="bolt">W</span>
              <span>wattbenchs</span>
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
              <div className="brand"><span className="bolt">W</span><span>wattbenchs</span></div>
              <p style={{ marginTop: 12 }}>Public-data electricity benchmarks, bill estimates, and practical guides. Not affiliated with any utility.</p>
            </div>
            <div><strong>Data</strong><Link href="/methodology">Methodology</Link><Link href="/sources">Sources</Link><Link href="/compare">Compare</Link></div>
            <div><strong>Guides</strong><Link href="/blog">Blog</Link><Link href="/assistance/california">Bill help</Link><Link href="/save/texas">Save money</Link><Link href="/rss.xml">RSS feed</Link></div>
            <div><strong>Company</strong><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/sources">Sources</Link><a href="mailto:editorial@wattbenchs.com">Contact</a></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
