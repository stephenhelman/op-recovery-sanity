import { NextRequest, NextResponse } from 'next/server';
import { dispatchLead, loadSiteData, LeadField } from '@/lib/integrations/leadSink';
import { Lead } from '@/lib/chat/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lead, transcript } = body as { lead: Lead; transcript?: string };

    // Need at least one way to contact the lead, or there's nothing to log.
    if (!lead || (!lead.email && !lead.phone)) {
      return NextResponse.json({ success: false, error: 'No contact details' }, { status: 400 });
    }

    // Use the EXACT contact-form labels so chat leads land in matching columns.
    const fields: LeadField[] = [
      { label: 'Full Name', value: lead.name ?? '' },
      { label: 'Email Address', value: lead.email ?? '' },
      ...(lead.phone ? [{ label: 'Phone Number', value: lead.phone }] : []),
      { label: 'Source', value: 'Website Chat' },
    ];

    // Same config source as the contact route. If no contactForm/formSettings
    // exists, dispatchLead degrades to email-only (env) and skips sheets/GHL.
    const siteData = await loadSiteData();

    await dispatchLead({
      fields,
      formSettings: siteData?.formSettings ?? {},
      siteData,
      transcript,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
