import { getSiteContent } from '@/sanity/queries';
import { mergeContent } from '@/lib/mergeContent';
import { fontPairings } from '@/lib/fontPairings';
import { requireAuth } from '@/lib/auth/requireAuth';
import LeadInbox from '@/components/crm/LeadInbox';

export default async function CrmDashboardPage() {
  // Second layer behind middleware (Sprint 4) — consistent with the
  // defense-in-depth pattern used in the auth config's own signIn callback.
  const session = await requireAuth();

  const content = mergeContent(await getSiteContent());
  const { colors, fontPairing } = content.siteConfig;
  const fonts = fontPairings[fontPairing] ?? fontPairings.professional;

  return (
    <div
      style={
        {
          '--color-primary': colors.primary,
          '--color-accent': colors.accent,
          '--color-bg': colors.background,
          '--color-text': colors.text,
          '--font-heading': fonts.heading,
          '--font-body': fonts.body,
        } as React.CSSProperties
      }
    >
      <LeadInbox colors={colors} ownerEmail={session?.user?.email} />
    </div>
  );
}
