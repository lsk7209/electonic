"use client";

import { useMemo, useState } from "react";
import { estimateBill, formatMoney } from "@/lib/calc";
import { AVG_USAGE, getState, states } from "@/lib/data";
import { Notice } from "@/components/Notice";

type Props = {
  fixedStateSlug?: string;
  compact?: boolean;
  rateOverride?: number;
  title?: string;
};

export function Estimator({ fixedStateSlug, compact = false, rateOverride, title = "Bill estimator" }: Props) {
  const [stateSlug, setStateSlug] = useState(fixedStateSlug ?? "texas");
  const [usage, setUsage] = useState(fixedStateSlug ? (getState(fixedStateSlug)?.usageAvg ?? AVG_USAGE) : AVG_USAGE);
  const [level, setLevel] = useState("avg");
  const state = getState(fixedStateSlug ?? stateSlug) ?? states[0];
  const centsPerKwh = rateOverride ?? state.rate;

  const estimate = useMemo(() => estimateBill({
    centsPerKwh,
    usageKwh: usage,
    lowRate: state.rateLow,
    highRate: state.rateHigh
  }), [centsPerKwh, state.rateLow, state.rateHigh, usage]);

  function chooseLevel(next: string) {
    setLevel(next);
    if (next === "low") setUsage(Math.round(state.usageAvg * 0.7));
    if (next === "avg") setUsage(state.usageAvg);
    if (next === "high") setUsage(Math.round(state.usageAvg * 1.35));
  }

  return (
    <section className="card estimator" aria-label="Monthly electric bill estimator">
      <div className="estimator-head">
        <div>
          <p className="eyebrow">Client-side tool · PII 0</p>
          <h3>{title}</h3>
        </div>
        <span className="chip">{state.name}</span>
      </div>
      <div className="estimator-body">
        <div className="est-inputs">
          {!fixedStateSlug && (
            <div className="field">
              <label htmlFor="state">State</label>
              <select id="state" value={stateSlug} onChange={(e) => setStateSlug(e.target.value)}>
                {states.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
            </div>
          )}
          <div className="field">
            <label>Usage level</label>
            <div className="seg">
              {[
                ["low", "Low"],
                ["avg", "Average"],
                ["high", "High"]
              ].map(([value, label]) => (
                <button type="button" key={value} className={level === value ? "active" : ""} onClick={() => chooseLevel(value)}>{label}</button>
              ))}
            </div>
          </div>
          <div className="field">
            <label htmlFor="usage">Monthly usage: <span className="tnum">{usage}</span> kWh</label>
            <input className="range" id="usage" type="range" min="250" max="2200" step="10" value={usage} onChange={(e) => { setUsage(Number(e.target.value)); setLevel("custom"); }} />
          </div>
          {!compact && (
            <div className="field">
              <label>Season</label>
              <div className="seg">
                <button type="button">Winter</button>
                <button type="button" className="active">Normal</button>
                <button type="button">Summer</button>
              </div>
            </div>
          )}
        </div>
        <div className="est-output">
          <p className="eyebrow">Estimated monthly bill</p>
          <div className="big-money tnum">{formatMoney(estimate.low)} – {formatMoney(estimate.high)}</div>
          <p className="muted">Midpoint about <strong className="tnum">{formatMoney(estimate.mid)}</strong> at {centsPerKwh.toFixed(1)}¢/kWh.</p>
          <div className="bill-band" aria-hidden="true">
            <span className="band" />
            <span className="marker" />
            <span className="dot" />
          </div>
          <div className="grid-2">
            <div className="stat"><span className="muted">Vs national avg</span><strong className={estimate.nationalDeltaPct > 0 ? "caution" : "good"}>{estimate.nationalDeltaPct > 0 ? "+" : ""}{estimate.nationalDeltaPct}%</strong></div>
            <div className="stat"><span className="muted">ND annual gap</span><strong className="tnum">{formatMoney(estimate.annualSavings)}</strong></div>
          </div>
          <Notice>
            Estimate based on average rates. Excludes fixed fees, tiered/TOU pricing, and specific plans. Your actual bill may differ.
            {state.market === "deregulated" ? " This is a competitive market benchmark; actual plan prices vary." : ""}
          </Notice>
        </div>
      </div>
    </section>
  );
}
