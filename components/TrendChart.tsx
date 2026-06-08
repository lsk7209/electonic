import { nationalTrend, TrendPoint } from "@/lib/data";

export function TrendChart({ points, label }: { points: TrendPoint[]; label: string }) {
  const all = [...points, ...nationalTrend];
  const min = Math.min(...all.map((p) => p.value)) - 1;
  const max = Math.max(...all.map((p) => p.value)) + 1;
  const width = 680;
  const height = 230;
  const x = (i: number) => (i / (points.length - 1)) * (width - 44) + 24;
  const y = (v: number) => height - 32 - ((v - min) / (max - min)) * (height - 58);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.value)}`).join(" ");
  const natPath = nationalTrend.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.value)}`).join(" ");

  return (
    <div className="card card-pad">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
        <div>
          <p className="eyebrow">12-month trend</p>
          <h3>{label}</h3>
        </div>
        <span className="chip">Dashed line: U.S. average</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="230" role="img" aria-label={`${label} monthly electricity rate trend`}>
        {[0, 1, 2, 3].map((i) => {
          const gy = 24 + i * 45;
          return <line key={i} x1="24" x2={width - 20} y1={gy} y2={gy} stroke="#E2E8F0" />;
        })}
        <path d={natPath} fill="none" stroke="#64748B" strokeWidth="2" strokeDasharray="6 6" />
        <path d={path} fill="none" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => <circle key={p.month} cx={x(i)} cy={y(p.value)} r="4" fill="#fff" stroke="#1D4ED8" strokeWidth="3" />)}
        {points.map((p, i) => i % 2 === 0 ? <text key={p.month} x={x(i)} y={height - 8} textAnchor="middle" fontSize="12" fill="#64748B">{p.month}</text> : null)}
      </svg>
    </div>
  );
}

export function Sparkline({ points }: { points: TrendPoint[] }) {
  const min = Math.min(...points.map((p) => p.value));
  const max = Math.max(...points.map((p) => p.value));
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * 88;
    const y = 26 - ((p.value - min) / Math.max(0.1, max - min)) * 22;
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");
  return <svg className="spark" viewBox="0 0 88 28" aria-hidden="true"><path d={path} fill="none" stroke="#1D4ED8" strokeWidth="2.5" /></svg>;
}
