import Link from "next/link";
import { getState } from "@/lib/data";
import { getDirectoryWithLiveRates } from "@/lib/eia";
import { Sparkline } from "@/components/TrendChart";

export async function StateDirectory() {
  const directory = await getDirectoryWithLiveRates();
  return (
    <div className="card rank-table" id="states">
      <div className="rank-head">
        <span>Rank</span><span>State</span><span>Rate</span><span>YoY</span><span>Trend</span>
      </div>
      {directory.map((row) => {
        const state = getState(row.name.toLowerCase().replace(/\s+/g, "-"));
        return (
          <Link className="rank-row" key={row.abbr} href={state ? `/${state.slug}` : "/#states"}>
            <span className="tnum">#{row.rank}</span>
            <strong>{row.name} <span className="muted">({row.abbr})</span></strong>
            <span className="rate tnum">{row.rate.toFixed(1)}¢</span>
            <span className={row.yoy > 0 ? "caution" : "good"}>{row.yoy > 0 ? "+" : ""}{row.yoy.toFixed(1)}%</span>
            {state ? <Sparkline points={state.trend} /> : <span className="muted">Demo row</span>}
          </Link>
        );
      })}
    </div>
  );
}
