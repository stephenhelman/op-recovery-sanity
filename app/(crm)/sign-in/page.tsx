import { getSiteContent } from '@/sanity/queries';
import { mergeContent } from '@/lib/mergeContent';
import { fontPairings } from '@/lib/fontPairings';
import SignInForm from '@/components/crm/SignInForm';

export default async function CrmSignInPage() {
  const content = mergeContent(await getSiteContent());
  const { colors, fontPairing, companyName } = content.siteConfig;
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
          backgroundColor: colors.background,
          color: colors.text,
          minHeight: '100vh',
        } as React.CSSProperties
      }
      className="flex items-center justify-center px-6"
    >
      <div className="w-full max-w-sm py-16">
        <p
          className="text-xs font-semibold tracking-wide uppercase mb-2"
          style={{ color: colors.accent }}
        >
          {companyName}
        </p>
        <h1
          className="text-2xl font-bold mb-6"
          style={{ fontFamily: 'var(--font-heading)', color: colors.primary }}
        >
          CRM Lite sign-in
        </h1>
        <SignInForm colors={colors} />
      </div>
    </div>
  );
}
