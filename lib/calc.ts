import { cheapest, NATIONAL_AVG } from "@/lib/data";

export type EstimateInput = {
  centsPerKwh: number;
  usageKwh: number;
  lowRate?: number;
  highRate?: number;
};

export function estimateBill({ centsPerKwh, usageKwh, lowRate, highRate }: EstimateInput) {
  const low = Math.round((usageKwh * (lowRate ?? centsPerKwh * 0.88)) / 100);
  const mid = Math.round((usageKwh * centsPerKwh) / 100);
  const high = Math.round((usageKwh * (highRate ?? centsPerKwh * 1.18)) / 100);
  const national = Math.round((usageKwh * NATIONAL_AVG) / 100);
  const cheapestBill = Math.round((usageKwh * cheapest.rate) / 100);
  const annualSavings = Math.max(0, (mid - cheapestBill) * 12);
  const nationalDeltaPct = Math.round(((mid - national) / national) * 100);

  return { low, mid, high, national, cheapestBill, annualSavings, nationalDeltaPct };
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}
