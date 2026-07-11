import { NextResponse } from 'next/server';
import { US_STATES_LIST } from '@/lib/statesGeo';

// Public, cacheable list of all states (for the map). Served flag included.
export async function GET() {
  return NextResponse.json(
    {
      states: US_STATES_LIST.map(({ name, slug, abbr, served }) => ({
        name,
        slug,
        abbr,
        served,
      })),
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
