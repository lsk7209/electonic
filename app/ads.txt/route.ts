export const dynamic = "force-static";

export function GET() {
  const publisherId = process.env.ADSENSE_PUBLISHER_ID || "pub-3050601904412736";

  return new Response(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
