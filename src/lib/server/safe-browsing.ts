/**
 * Optional Google Safe Browsing check for tracked-link destinations.
 * Enabled only when SAFE_BROWSING_API_KEY is set. Fails open (allows the link)
 * if the API is unreachable, so an outage never blocks legitimate users.
 */
export async function isFlaggedUrl(urls: string[]): Promise<boolean> {
  const key = process.env.SAFE_BROWSING_API_KEY;
  if (!key || urls.length === 0) return false;
  try {
    const res = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          client: { clientId: "qrwright", clientVersion: "1.0" },
          threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: urls.map((url) => ({ url })),
          },
        }),
        signal: AbortSignal.timeout(2500),
      },
    );
    if (!res.ok) return false;
    const data = (await res.json()) as { matches?: unknown[] };
    return Array.isArray(data.matches) && data.matches.length > 0;
  } catch {
    return false;
  }
}
