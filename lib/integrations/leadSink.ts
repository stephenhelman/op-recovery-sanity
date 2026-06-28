import { Resend } from 'resend';
import { client } from '@/sanity/client';
import { buildNotificationEmail, buildConfirmationEmail } from '@/lib/emailTemplates';
import { postToSheets } from '@/lib/formActions/postToSheets';
import { postToGHL } from '@/lib/formActions/postToGHL';

export type LeadField = { label: string; value: string };

export interface FormSettings {
  replyToEmail?: string;
  fromName?: string;
  fromEmail?: string;
  formAction?: 'email' | 'email+sheets' | 'email+ghl' | 'email+sheets+ghl';
  googleWebhookUrl?: string;
  ghlApiKey?: string;
  ghlPipelineId?: string;
  ghlStageId?: string;
}

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

/**
 * The single lead sink. Logic moved verbatim from the original
 * app/api/contact/route.ts so contact-form and chat leads hit identical
 * destinations (notification + confirmation email, Sheets, GHL).
 *
 * `transcript`, when present, is appended ONLY to the notification email
 * (as a "Conversation" field) — never to the Sheets or GHL payloads, so
 * sheet columns stay clean.
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
}): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const companyName =
    siteData?.companyName || process.env.NEXT_PUBLIC_COMPANY_NAME || 'Surplus Recovery';
  const notifyEmail = process.env.NEXT_PUBLIC_NOTIFY_EMAIL;

  const byLabel = (label: string) => fields.find((f) => f.label === label)?.value || '';
  const submitterEmail = byLabel('Email Address') || byLabel('Email');
  const colors = siteData?.colors ?? DEFAULT_COLORS;

  const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
  const fieldArray = fields;

  const notifyDomain = notifyEmail?.split('@')[1] || 'mail.example.com';
  const fromName = formSettings.fromName || companyName;
  const confirmFromAddress = formSettings.fromEmail || `noreply@${notifyDomain}`;

  // Transcript rides along on the notification email only.
  const notifyFields = transcript
    ? [...fieldArray, { label: 'Conversation', value: transcript }]
    : fieldArray;

  const promises: Promise<unknown>[] = [];

  if (notifyEmail) {
    promises.push(
      resend.emails.send({
        from: `${companyName} <noreply@${notifyDomain}>`,
        to: notifyEmail,
        ...(submitterEmail ? { replyTo: submitterEmail } : {}),
        subject: `New Inquiry — ${companyName}`,
        html: buildNotificationEmail({ companyName, colors, fields: notifyFields, submittedAt }),
      })
    );
  }

  if (submitterEmail) {
    const recipientName = byLabel('Full Name') || byLabel('Name') || 'there';
    const successMessage = 'A member of our team will be in touch within 1 business day.';
    const confirmReplyTo = formSettings.replyToEmail || siteData?.contactEmail || undefined;

    promises.push(
      resend.emails.send({
        from: `${fromName} <${confirmFromAddress}>`,
        to: submitterEmail,
        ...(confirmReplyTo ? { replyTo: confirmReplyTo } : {}),
        subject: `We received your inquiry — ${companyName}`,
        html: buildConfirmationEmail({
          companyName,
          colors,
          recipientName,
          successMessage,
          fields: fieldArray,
        }),
      })
    );
  }

  await Promise.all(promises);

  const formAction = formSettings.formAction ?? 'email';

  if (formAction.includes('sheets') && formSettings.googleWebhookUrl) {
    const sheetsResult = await postToSheets(formSettings.googleWebhookUrl, {
      submittedAt,
      companyName,
      fields: fieldArray,
    });
    if (!sheetsResult.success) {
      console.error('Sheets post failed:', sheetsResult.error);
    }
  }

  if (formAction.includes('ghl') && formSettings.ghlApiKey) {
    const ghlResult = await postToGHL(formSettings.ghlApiKey, {
      fields: fieldArray,
      pipelineId: formSettings.ghlPipelineId,
      stageId: formSettings.ghlStageId,
      companyName,
    });
    if (!ghlResult.success) {
      console.error('GHL post failed:', ghlResult.error);
    }
  }
}
