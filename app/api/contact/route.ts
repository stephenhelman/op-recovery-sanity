import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function formatFields(fields: Record<string, string>): string {
  return Object.entries(fields)
    .map(([label, value]) => `${label}: ${value || '(not provided)'}`)
    .join('\n');
}

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

    const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Surplus Recovery';
    const notifyEmail = process.env.NEXT_PUBLIC_NOTIFY_EMAIL;
    const submitterEmail = fields['Email Address'] || fields['Email'] || '';

    const fieldsSummary = formatFields(fields);

    const promises: Promise<unknown>[] = [];

    if (notifyEmail) {
      promises.push(
        resend.emails.send({
          from: `${companyName} <noreply@${notifyEmail.split('@')[1]}>`,
          to: notifyEmail,
          subject: `New Inquiry — ${companyName}`,
          text: `You have received a new inquiry from your website.\n\n${fieldsSummary}`,
        })
      );
    }

    if (submitterEmail) {
      promises.push(
        resend.emails.send({
          from: `${companyName} <noreply@${notifyEmail?.split('@')[1] || 'mail.example.com'}>`,
          to: submitterEmail,
          subject: `We received your inquiry — ${companyName}`,
          text: `Thank you for reaching out to ${companyName}.\n\nWe received the following from you:\n\n${fieldsSummary}\n\nA member of our team will be in touch within 1 business day.\n\n— The ${companyName} Team`,
        })
      );
    }

    await Promise.all(promises);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
