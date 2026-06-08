import { NextRequest, NextResponse } from "next/server";
import { syncEiaResidentialStateRates } from "@/lib/eia";

export async function GET(request: NextRequest) {
  const expected = process.env.CRON_SECRET;
  const provided = request.headers.get("x-cron-secret") || request.nextUrl.searchParams.get("secret");

  if (expected && provided !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncEiaResidentialStateRates();
    return NextResponse.json({
      ok: true,
      status: "synced",
      insertedOrUpdated: result.insertedOrUpdated,
      latestPeriods: [...result.latest.entries()].map(([state, rate]) => ({
        state,
        period: rate.period,
        vintage: rate.vintage
      }))
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown EIA sync error"
    }, { status: 500 });
  }
}
