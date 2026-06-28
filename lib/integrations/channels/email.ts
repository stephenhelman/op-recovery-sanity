import { Resend } from 'resend';
import { buildNotificationEmail, buildConfirmationEmail } from '@/lib/emailTemplates';
import { ChannelResult, LeadPayload, ChannelConfig } from './types';

const SUCCESS_MESSAGE = 'A member of our team will be in touch within 1 business day.';

/**
 * Email channel — sends the branded notification + confirmation via Resend.
 *
 * THE CORE FIX: every `resend.emails.send()` return is inspected; a returned
 * `error` becomes `ok: false` (Resend resolves with `{ data, error }` rather
 * than throwing, so an unchecked return swallowed every failure).
 *
 * Fails loud, never from a bogus domain: if there is no API key or no usable
 * sender domain, returns `ok: false` instead of attempting a doomed send from
 * a placeholder address.
 *
 * `from` behavior preserved exactly:
 *   - notification: `noreply@<notifyDomain>`
 *   - confirmation: `formSettings.fromEmail || noreply@<notifyDomain>`
 */
export async function sendEmail(payload: LeadPayload, cfg: ChannelConfig): Promise<ChannelResult> {
  const channel = 'email';

  if (!cfg.resendApiKey) {
    return { channel, ok: false, error: 'RESEND_API_KEY is not set' };
  }

  const { formSettings, notifyEmail, contactEmail } = cfg;
  const { companyName, colors, submittedAt, submitterEmail, recipientName, fields, transcript } = payload;

  // No placeholder fallback — a missing/invalid notify email yields no domain.
  const notifyDomain = notifyEmail && notifyEmail.includes('@') ? notifyEmail.split('@')[1] : undefined;

  const resend = new Resend(cfg.resendApiKey);
  const failures: string[] = [];
  let attempted = 0;
  let firstId: string | undefined;

  // --- Notification (to the team inbox) ---
  if (notifyEmail) {
    if (!notifyDomain) {
      failures.push(`notification: "${notifyEmail}" is not a usable sender address`);
    } else {
      attempted++;
      const notifyFields = transcript
        ? [...fields, { label: 'Conversation', value: transcript }]
        : fields;
      const { data, error } = await resend.emails.send({
        from: `${companyName} <noreply@${notifyDomain}>`,
        to: notifyEmail,
        ...(submitterEmail ? { replyTo: submitterEmail } : {}),
        subject: `New Inquiry — ${companyName}`,
        html: buildNotificationEmail({ companyName, colors, fields: notifyFields, submittedAt }),
      });
      if (error) failures.push(`notification: ${error.message} (${error.name})`);
      else if (data && !firstId) firstId = data.id;
    }
  }

  // --- Confirmation (to the lead) ---
  if (submitterEmail) {
    const fromName = formSettings.fromName || companyName;
    const confirmFrom = formSettings.fromEmail || (notifyDomain ? `noreply@${notifyDomain}` : undefined);
    if (!confirmFrom) {
      failures.push(
        'confirmation: no sender domain (set a verified From Email, or NEXT_PUBLIC_NOTIFY_EMAIL)'
      );
    } else {
      attempted++;
      const replyTo = formSettings.replyToEmail || contactEmail || undefined;
      const { data, error } = await resend.emails.send({
        from: `${fromName} <${confirmFrom}>`,
        to: submitterEmail,
        ...(replyTo ? { replyTo } : {}),
        subject: `We received your inquiry — ${companyName}`,
        html: buildConfirmationEmail({
          companyName,
          colors,
          recipientName,
          successMessage: SUCCESS_MESSAGE,
          fields,
        }),
      });
      if (error) failures.push(`confirmation: ${error.message} (${error.name})`);
      else if (data && !firstId) firstId = data.id;
    }
  }

  if (attempted === 0 && failures.length === 0) {
    return { channel, ok: false, error: 'no notification inbox or submitter email to send to' };
  }
  if (failures.length > 0) {
    return { channel, ok: false, error: failures.join('; ') };
  }
  return { channel, ok: true, id: firstId };
}
