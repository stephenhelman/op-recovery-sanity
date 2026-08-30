// Reads siteConfig.features.crmLite directly via fetch (no @sanity/client)
// so this is safe to call from Edge middleware, not just Node routes.
export async function crmLiteEnabled(): Promise<boolean> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';
  if (!projectId) return false;

  const query = encodeURIComponent(`*[_type == "siteConfig"][0]{ "crmLite": features.crmLite }`);
  const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const json = (await res.json()) as { result?: { crmLite?: boolean } };
    return Boolean(json.result?.crmLite);
  } catch {
    return false;
  }
}
