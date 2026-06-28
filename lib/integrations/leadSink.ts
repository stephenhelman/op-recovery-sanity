import { client } from '@/sanity/client';
import { channels } from './channels';
import {
  ChannelResult,
  ChannelConfig,
  FormSettings,
  LeadField,
  LeadPayload,
} from './channels/types';

export type { ChannelResult, FormSettings, LeadField };

export interface SiteData {
  companyName?: string;
  contactEmail?: string;
  colors?: { primary: string; accent: string; background: string; text: string };
  formSettings?: FormSettings;
}

// Shared query so chat leads load the SAME config the contact form uses.
export const SITE_QUERY = `*[_type == "siteConfig"][0]{
  companyName,
  contactEmail,
  colors,
  "formSettings": sections[_type == "contactForm"][0].formSettings
}`;

export async function loadSiteData(): Promise<SiteData | null> {
  return client.fetch(SITE_QUERY).catch(() => null);
}

const DEFAULT_COLORS = {
  primary: '#1B2A4A',
  accent: '#C8963A',
  background: '#F8F7F4',
  text: '#1B2A4A',
};

export interface DispatchSummary {
  results: ChannelResult[];
  anyFailed: boolean;
}

/**
 * Thin orchestrator. Normalizes the lead, builds injected config from env +
 * siteData, selects the enabled channels (gated by formSettings, same as
 * before), runs them, logs every `ok: false` explicitly, and returns a
 * summary. It does NOT swallow failures — a partial failure is visible in the
 * summary and the logs.
 *
 * `transcript` rides on the notification email only (handled inside the email
 * channel); sheets/GHL receive the clean `fields`.
 */
export async function dispatchLead({
  fields,
  formSettings = {},
  siteData,
  transcript,
}: {
  fields: LeadField[];
  formSettings?: FormSettings;
  siteData: SiteData | null;
  transcript?: string;
}): Promise<DispatchSummary> {
  const companyName =
    siteData?.companyName || process.env.NEXT_PUBLIC_COMPANY_NAME || 'Surplus Recovery';
  const colors = siteData?.colors ?? DEFAULT_COLORS;
  const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

  const byLabel = (label: string) => fields.find((f) => f.label === label)?.value || '';
  const submitterEmail = byLabel('Email Address') || byLabel('Email');
  const recipientName = byLabel('Full Name') || byLabel('Name') || 'there';

  const payload: LeadPayload = {
    fields,
    companyName,
    colors,
    submittedAt,
    submitterEmail,
    recipientName,
    transcript,
  };

  const cfg: ChannelConfig = {
    formSettings,
    resendApiKey: process.env.RESEND_API_KEY,
    notifyEmail: process.env.NEXT_PUBLIC_NOTIFY_EMAIL,
    contactEmail: siteData?.contactEmail,
  };

  const active = channels.filter((c) => c.enabled(cfg));
  const results = await Promise.all(
    active.map(async (c): Promise<ChannelResult> => {
      try {
        return await c.run(payload, cfg);
      } catch (err) {
        return { channel: c.key, ok: false, error: err instanceof Error ? err.message : String(err) };
      }
    })
  );

  for (const r of results) {
    if (!r.ok) console.error(`[lead] channel "${r.channel}" failed: ${r.error}`);
  }

  return { results, anyFailed: results.some((r) => !r.ok) };
}
