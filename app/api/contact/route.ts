import { NextRequest, NextResponse } from 'next/server';
import { dispatchLead, loadSiteData } from '@/lib/integrations/leadSink';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fields, honeypot } = body as {
      fields: Record<string, string>;
      honeypot: string;
    };

    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    const siteData = await loadSiteData();
    const fieldArray = Object.entries(fields).map(([label, value]) => ({ label, value }));

    const summary = await dispatchLead({
      fields: fieldArray,
      formSettings: siteData?.formSettings ?? {},
      siteData,
    });

    if (summary.anyFailed) {
      console.warn('[contact] partial lead delivery:', JSON.stringify(summary.results));
    }

    // Lead is still captured (e.g. sheet/GHL) even if a channel failed, so the
    // form shows success; the per-channel summary rides along for visibility.
    return NextResponse.json({ success: true, delivery: summary });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
