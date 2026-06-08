import fs from "node:fs";
import path from "node:path";

const DEFAULT_CLIENT_FILE = "D:\\env\\gsc_credentials.json";
const FALLBACK_CLIENT_FILE = "D:\\env\\adsense_oauth_client.json";
const DEFAULT_TOKEN_FILE = "D:\\env\\gsc_token.json";
const WEBMASTERS_SCOPE = "https://www.googleapis.com/auth/webmasters";

function loadDotEnv(file) {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

function normalizeSiteUrl(value) {
  return value.replace(/\/+$/, "");
}

function requireProductionSiteUrl() {
  loadDotEnv(path.join(process.cwd(), ".env.local"));
  loadDotEnv(path.join(process.cwd(), ".env"));

  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw || raw === "https://example.com") {
    throw new Error("NEXT_PUBLIC_SITE_URL must be set to the production URL before submitting a sitemap.");
  }
  if (!raw.startsWith("https://")) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an https production URL.");
  }
  return normalizeSiteUrl(raw);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function getClientData() {
  const clientFile = process.env.GSC_CLIENT_FILE || (fs.existsSync(DEFAULT_CLIENT_FILE) ? DEFAULT_CLIENT_FILE : FALLBACK_CLIENT_FILE);
  if (!fs.existsSync(clientFile)) {
    throw new Error(`GSC OAuth client file not found: ${clientFile}`);
  }
  const data = readJson(clientFile);
  return data.installed || data.web || data;
}

function getTokenData() {
  const tokenFile = process.env.GSC_TOKEN_FILE || DEFAULT_TOKEN_FILE;
  if (!fs.existsSync(tokenFile)) {
    throw new Error(`GSC token file not found: ${tokenFile}`);
  }
  return { tokenFile, tokenData: readJson(tokenFile) };
}

async function refreshAccessToken(client, tokenFile, tokenData) {
  const existingToken = tokenData.token || tokenData.access_token;
  const expiry = tokenData.expiry_date || 0;
  if (existingToken && expiry > Date.now() + 60_000) {
    return existingToken;
  }

  if (!tokenData.refresh_token) {
    throw new Error("GSC token has no refresh_token. Re-authenticate Search Console OAuth.");
  }

  const body = new URLSearchParams({
    client_id: tokenData.client_id || client.client_id,
    client_secret: tokenData.client_secret || client.client_secret,
    refresh_token: tokenData.refresh_token,
    grant_type: "refresh_token",
    scope: WEBMASTERS_SCOPE
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!res.ok) {
    throw new Error(`OAuth refresh failed: ${res.status} ${await res.text()}`);
  }

  const refreshed = await res.json();
  const merged = {
    ...tokenData,
    token: refreshed.access_token,
    access_token: refreshed.access_token,
    expiry_date: Date.now() + (refreshed.expires_in || 3600) * 1000,
    token_uri: tokenData.token_uri || "https://oauth2.googleapis.com/token",
    client_id: tokenData.client_id || client.client_id,
    client_secret: tokenData.client_secret || client.client_secret
  };
  fs.writeFileSync(tokenFile, JSON.stringify(merged, null, 2));
  return refreshed.access_token;
}

async function gscFetch(accessToken, endpoint, init = {}) {
  const res = await fetch(`https://www.googleapis.com/webmasters/v3${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init.headers || {})
    }
  });
  if (!res.ok) {
    throw new Error(`GSC API failed: ${res.status} ${await res.text()}`);
  }
  if (res.status === 204) return {};
  return res.json();
}

function hostnameFromSite(siteUrl) {
  return new URL(siteUrl).hostname.replace(/^www\./, "");
}

function chooseProperty(siteUrl, sites) {
  const urlWithSlash = `${siteUrl}/`;
  const host = hostnameFromSite(siteUrl);
  const candidates = [urlWithSlash, siteUrl, `sc-domain:${host}`];
  const entries = sites.siteEntry || [];
  for (const candidate of candidates) {
    const match = entries.find((entry) => entry.siteUrl === candidate);
    if (match) return match.siteUrl;
  }
  const visible = entries.map((entry) => entry.siteUrl).sort();
  throw new Error(`No matching GSC property for ${siteUrl}. Available properties:\n${visible.join("\n")}`);
}

function encode(value) {
  return encodeURIComponent(value);
}

async function main() {
  const siteUrl = requireProductionSiteUrl();
  const sitemapUrl = `${siteUrl}/sitemap.xml`;
  const client = getClientData();
  const { tokenFile, tokenData } = getTokenData();
  const accessToken = await refreshAccessToken(client, tokenFile, tokenData);

  const sites = await gscFetch(accessToken, "/sites");
  const property = chooseProperty(siteUrl, sites);
  console.log(`[GSC] property: ${property}`);
  console.log(`[GSC] sitemap: ${sitemapUrl}`);

  await gscFetch(accessToken, `/sites/${encode(property)}/sitemaps/${encode(sitemapUrl)}`, { method: "PUT" });
  console.log("[GSC] sitemap submitted");

  const result = await gscFetch(accessToken, `/sites/${encode(property)}/sitemaps`);
  const sitemap = (result.sitemap || []).find((item) => item.path === sitemapUrl);
  if (!sitemap) {
    throw new Error("Sitemap was submitted but not returned by sitemaps.list yet.");
  }

  const errors = Number(sitemap.errors || 0);
  const warnings = Number(sitemap.warnings || 0);
  const lastSubmitted = sitemap.lastSubmitted || "pending";
  const lastDownloaded = sitemap.lastDownloaded || "pending";
  console.log(`[GSC] status errors=${errors} warnings=${warnings} lastSubmitted=${lastSubmitted} lastDownloaded=${lastDownloaded}`);

  if (errors > 0) {
    throw new Error("GSC sitemap has errors. Check Search Console details.");
  }
}

main().catch((error) => {
  console.error(`[GSC] ${error.message}`);
  process.exit(1);
});
