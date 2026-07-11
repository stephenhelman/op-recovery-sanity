import { NextResponse } from 'next/server';
import { findStateBySlug } from '@/lib/statesGeo';
import type { KbSurplusInfo } from '@/lib/stateKb';

// Server-side proxy to the Hub state knowledge base. The Hub key lives ONLY here
// (never NEXT_PUBLIC_*), and the call is server-to-server — no browser Origin, so
// it bypasses the Hub's CORS gate. The client keeps calling this same-origin
// route with a slug; we resolve slug → 2-letter code here.

const OK_HEADERS = {
  'Cache-Control': 'public, max-age=3600',
  'Access-Control-Allow-Origin': '*',
};
const ERR_HEADERS = {
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
};

// Opaque failure — never leaks the key, the Hub URL, or Hub internals.
function unavailable(status: number) {
  return NextResponse.json(
    { error: 'State data is temporarily unavailable' },
    { status, headers: ERR_HEADERS }
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const state = findStateBySlug(slug);

  // Not a real continental state we serve — a genuine 404 (not a Hub call).
  if (!state) {
    return NextResponse.json({ error: 'State not found' }, { status: 404, headers: ERR_HEADERS });
  }

  const base = process.env.HUB_API_URL;
  const key = process.env.HUB_API_KEY;
  if (!base || !key) {
    console.error('[states] HUB_API_URL / HUB_API_KEY not configured');
    return unavailable(500);
  }

  // slug → 2-letter uppercase stateCode (already resolved above; no new lookup).
  const stateCode = state.abbr.toUpperCase();

  let records: KbSurplusInfo[] = [];
  try {
    const res = await fetch(`${base}/api/kb/states/${stateCode}`, {
      headers: { 'x-api-key': key },
      // Match the Hub's 1-hour cache; keeps repeat opens cheap.
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      // 401 (bad/inactive key) or any 5xx → opaque failure, logged server-side.
      console.error(`[states] Hub returned ${res.status} for ${stateCode}`);
      return unavailable(502);
    }

    const body = await res.json();
    // Empty array is valid "no data" — pass it through as [], never a 404.
    records = Array.isArray(body) ? body : [];
  } catch (err) {
    console.error('[states] Hub request failed:', err instanceof Error ? err.message : err);
    return unavailable(502);
  }

  return NextResponse.json(
    { name: state.name, slug: state.slug, stateCode, records },
    { headers: OK_HEADERS }
  );
}
