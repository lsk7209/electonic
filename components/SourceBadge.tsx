import Link from "next/link";
import { UPDATED, VINTAGE } from "@/lib/data";

export function SourceBadge({ vintage = VINTAGE }: { vintage?: number }) {
  return (
    <div className="meta-row" aria-label="Data source details">
      <span className="chip">Source: EIA</span>
      <span className="chip">Data: {vintage}</span>
      <span className="chip">Updated: {UPDATED}</span>
      <Link className="chip" href="/methodology">Methodology</Link>
    </div>
  );
}
