export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || "https://wattbenchs.com");

export function normalizeSiteUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${cleanPath}`;
}

export function assertProductionSiteUrl() {
  if (siteUrl === "https://example.com") {
    throw new Error("Set NEXT_PUBLIC_SITE_URL to the production URL before sitemap/GSC operations.");
  }
  return siteUrl;
}

export function requireServerEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
