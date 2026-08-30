import type { Metadata } from 'next';
import Header from '@/components/Header';
import { getSiteContent } from '@/sanity/queries';
import { mergeContent } from '@/lib/mergeContent';
import { fontPairings } from '@/lib/fontPairings';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Surplus Funds Recovery',
  description: 'We identify unclaimed surplus funds and guide you through the claims process — nationwide, at no upfront cost.',
  openGraph: {
    title: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Surplus Funds Recovery',
    description: 'We identify unclaimed surplus funds and guide you through the claims process — nationwide, at no upfront cost.',
    type: 'website',
  },
};

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  // The nav is global to marketing (mounts above every marketing page, including
  // /states) so it resolves siteConfig here. getSiteContent() is React-cached, so
  // page.tsx shares this same fetch — no double round-trip.
  const content = mergeContent(await getSiteContent());
  if (process.env.NEXT_PUBLIC_COMPANY_NAME) {
    content.siteConfig.companyName = process.env.NEXT_PUBLIC_COMPANY_NAME;
  }
  const { colors, fontPairing } = content.siteConfig;
  const fonts = fontPairings[fontPairing] ?? fontPairings.authority;

  return (
    <>
      <Header siteConfig={content.siteConfig} sections={content.sections} colors={colors} fonts={fonts} />
      {children}
    </>
  );
}
