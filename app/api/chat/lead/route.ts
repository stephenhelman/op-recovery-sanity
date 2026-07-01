import { NextRequest, NextResponse } from 'next/server';
import { dispatchLead, loadSiteData, LeadField } from '@/lib/integrations/leadSink';
import { Lead } from '@/lib/chat/types';
import { extractLeadFromTranscript } from '@/lib/chat/extractLeadFromTranscript';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lead, transcript } = body as { lead: Lead; transcript?: string };

    // Need at least one way to contact the lead, or there's nothing to log.
    if (!lead || (!lead.email && !lead.phone)) {
      return NextResponse.json({ success: false, error: 'No contact details' }, { status: 400 });
    }

    // Server-side enrichment: a cheap Haiku pass reads the transcript and fills
    // gaps (typically name + situation). Client-captured values ALWAYS win; the
    // extractor only fills what's missing. A failed pass returns null → we fall
    // back to the regex-only lead (never drop, never block the visitor's reply).
    let name = lead.name ?? '';
    let email = lead.email ?? '';
    let phone = lead.phone ?? '';
    let situation = '';

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey && transcript) {
      const extracted = await extractLeadFromTranscript(transcript, apiKey);
      if (extracted) {
        name = name || extracted.name; // fill gap only — never overwrite a user value
        email = email || extracted.email;
        phone = phone || extracted.phone;
        situation = extracted.situation; // new field, no client-provided counterpart
      }
    }

    // FIXED-SHAPE payload: every field is always present (empty when unknown), in
    // a stable order, so a position-based Apps Script never shifts columns. This
    // is why a phone-less lead was dropping `Source` — a missing Phone Number
    // moved Source (and Situation) up a column. Same labels the contact form uses.
    const fields: LeadField[] = [
      { label: 'Full Name', value: name },
      { label: 'Email Address', value: email },
      { label: 'Phone Number', value: phone },
      { label: 'Source', value: 'Website Chat' },
      { label: 'Situation', value: situation },
    ];

    // Same config source as the contact route. If no contactForm/formSettings
    // exists, dispatchLead degrades to email-only (env) and skips sheets/GHL.
    const siteData = await loadSiteData();

    const summary = await dispatchLead({
      fields,
      formSettings: siteData?.formSettings ?? {},
      siteData,
      transcript,
    });

    if (summary.anyFailed) {
      console.warn('[chat-lead] partial lead delivery:', JSON.stringify(summary.results));
    }

    return NextResponse.json({ success: true, delivery: summary });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
