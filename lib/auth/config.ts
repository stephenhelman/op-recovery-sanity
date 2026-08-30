import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { Resend } from 'resend';
import { crmLiteEnabled } from '@/lib/crmLiteFlag';
import { buildAuthAdapter } from './adapter';

const OWNER_EMAIL = process.env.CRM_OWNER_EMAIL;

/**
 * Custom send step — reuses the existing Resend integration instead of
 * NextAuth's default SMTP transport. Silently no-ops for any address other
 * than the configured owner (locked decision #5's single-operator model): no
 * link is ever delivered to a non-owner email, and the response gives no
 * signal either way.
 */
async function sendVerificationRequest({
  identifier: email,
  url,
}: {
  identifier: string;
  url: string;
}) {
  if (email !== OWNER_EMAIL) return;
  if (!(await crmLiteEnabled())) return;

  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NEXT_PUBLIC_NOTIFY_EMAIL;
  const domain = notifyEmail?.includes('@') ? notifyEmail.split('@')[1] : undefined;
  if (!apiKey || !domain) {
    throw new Error('RESEND_API_KEY / NEXT_PUBLIC_NOTIFY_EMAIL not set — cannot send sign-in link');
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: `CRM Lite <noreply@${domain}>`,
    to: email,
    subject: 'Sign in to CRM Lite',
    html: `<p>Sign in to your CRM Lite dashboard:</p><p><a href="${url}">${url}</a></p><p>This link expires in 24 hours and can only be used once.</p>`,
  });
  if (error) throw new Error(`sign-in email failed: ${error.message} (${error.name})`);
}

export const authOptions: NextAuthOptions = {
  adapter: buildAuthAdapter(),
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    EmailProvider({
      // Unused when sendVerificationRequest is overridden, but required by
      // the provider's type.
      server: '',
      from: process.env.NEXT_PUBLIC_NOTIFY_EMAIL,
      sendVerificationRequest,
    }),
  ],
  pages: {
    signIn: '/app/sign-in',
  },
  callbacks: {
    // Defense-in-depth: even if a token were somehow minted or used outside
    // the adapter/send guards above, sign-in still requires the owner email
    // and the tier flag to be on.
    async signIn({ user }) {
      if (user.email !== OWNER_EMAIL) return false;
      return crmLiteEnabled();
    },
  },
};
