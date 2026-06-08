import type { Metadata } from "next";
import { GuideHubPage } from "@/components/GuideHub";
import { getGuideHub } from "@/lib/guide-hubs";
import { pageMetadata } from "@/lib/seo";

const hub = getGuideHub("ev")!;

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: hub.title,
  description: hub.description,
  path: hub.path
});

export default function EvGuidesPage() {
  return <GuideHubPage hub={hub} />;
}
