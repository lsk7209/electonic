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
        <p>Production AdSense usage requires a consent management platform and Google Consent Mode v2 configuration for applicable visitors. Visitors must be able to review or change cookie preferences when consent features are active.</p>
        <p>wattbenchs does not sell electricity plans, collect utility account numbers, or ask visitors to submit personal billing details through the estimator.</p>
      </div>
    </main>
  );
}
