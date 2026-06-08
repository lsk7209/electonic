import { TOTAL_RANKS } from "@/lib/data";

export function RankBadge({ rank }: { rank: number }) {
  const label = rank <= 10 ? "cheapest" : rank >= 42 ? "most expensive" : "middle";
  return <span className="chip">#{rank} {label} of {TOTAL_RANKS}</span>;
}
