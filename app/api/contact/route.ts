import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { client } from '@/sanity/client';
import { buildNotificationEmail, buildConfirmationEmail } from '@/lib/emailTemplates';
import { postToSheets } from '@/lib/formActions/postToSheets';
import { postToGHL } from '@/lib/formActions/postToGHL';

const SITE_QUERY = `*[_type == "siteConfig"][0]{
  companyName,
  contactEmail,
  colors,
  "formSettings": sections[_type == "contactForm"][0].formSettings
}`;

const DEFAULT_COLORS = {
  primary: '#1B2A4A',
  accent: '#C8963A',
  background: '#F8F7F4',
  text: '#1B2A4A',
};

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { fields, honeypot } = body as {
      fields: Record<string, string>;
      honeypot: string;
    };

    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    const siteData = await client.fetch(SITE_QUERY).catch(() => null);

    const companyName =
      siteData?.companyName || process.env.NEXT_PUBLIC_COMPANY_NAME || 'Surplus Recovery';
    const notifyEmail = process.env.NEXT_PUBLIC_NOTIFY_EMAIL;
    const submitterEmail = fields['Email Address'] || fields['Email'] || '';
    const formSettings = siteData?.formSettings ?? {};
    const colors = siteData?.colors ?? DEFAULT_COLORS;

    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
    const fieldArray = Object.entries(fields).map(([label, value]) => ({ label, value }));

    const notifyDomain = notifyEmail?.split('@')[1] || 'mail.example.com';
    const fromName = formSettings.fromName || companyName;
    const confirmFromAddress = formSettings.fromEmail || `noreply@${notifyDomain}`;

    const promises: Promise<unknown>[] = [];

    if (notifyEmail) {
      promises.push(
        resend.emails.send({
          from: `${companyName} <noreply@${notifyDomain}>`,
          to: notifyEmail,
          ...(submitterEmail ? { replyTo: submitterEmail } : {}),
          subject: `New Inquiry — ${companyName}`,
          html: buildNotificationEmail({ companyName, colors, fields: fieldArray, submittedAt }),
        })
      );
    }

    if (submitterEmail) {
      const recipientName =
        fields['Full Name'] || fields['Name'] || 'there';
      const successMessage =
        'A member of our team will be in touch within 1 business day.';
      const confirmReplyTo =
        formSettings.replyToEmail || siteData?.contactEmail || undefined;

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

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
