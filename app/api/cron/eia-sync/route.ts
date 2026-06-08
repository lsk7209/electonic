import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const expected = process.env.CRON_SECRET;
  const provided = request.headers.get("x-cron-secret") || request.nextUrl.searchParams.get("secret");

  if (expected && provided !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // Production TODO:
  // 1. Fetch EIA-826 monthly state residential/commercial/industrial rates.
  // 2. Use EIA bulk download for backfills.
  // 3. Upsert into Turso with period + vintage.
  // 4. Revalidate changed state, utility, and guide paths.
  return NextResponse.json({
    ok: true,
    status: "stub",
    message: "EIA sync route is wired. Implement fetch/upsert after Phase 0 field mapping."
  });
}
