import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy policy for wattbenchs",
  description: "wattbenchs privacy policy covering electric bill estimator inputs, cookies, AdSense, consent, and analytics.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
    <main className="section">
      <div className="reading prose">
        <h1>Privacy policy for wattbenchs</h1>
        <p>The bill estimator runs in the browser. Usage selections are not transmitted or stored by the estimator.</p>
        <p>When advertising or analytics are enabled, third-party services such as Google AdSense or Google Analytics may use cookies or similar technologies, subject to consent requirements that apply in the visitor region.</p>
        <h2>Advertising</h2>
        <p>wattbenchs uses Google AdSense Auto Ads. Google may use cookies, device identifiers, and ad personalization signals to serve or measure ads. Visitors can review Google advertising controls through Google ad settings and privacy resources.</p>
        <h2>Analytics</h2>
        <p>Google Analytics 4 may collect aggregated usage signals such as page views, device type, approximate geography, and traffic source. These signals help us improve electricity rate pages, guide navigation, and technical performance.</p>
        <h2>Data we do not request</h2>
        <p>wattbenchs does not ask visitors to submit utility account numbers, Social Security numbers, payment details, or personal billing documents. Any correction or privacy request can be sent through the contact page.</p>
        <p>Production AdSense usage requires a consent management platform and Google Consent Mode v2 configuration for applicable visitors. Visitors must be able to review or change cookie preferences when consent features are active.</p>
        <p>wattbenchs does not sell electricity plans, collect utility account numbers, or ask visitors to submit personal billing details through the estimator.</p>
      </div>
    </main>
  );
}
