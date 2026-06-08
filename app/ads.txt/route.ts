export const dynamic = "force-static";

export function GET() {
  const publisherId = process.env.ADSENSE_PUBLISHER_ID;
  if (!publisherId) {
    return new Response("ads.txt is not configured because ADSENSE_PUBLISHER_ID is not set.\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  return new Response(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
