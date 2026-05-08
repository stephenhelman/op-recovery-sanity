import { getSiteContent } from '@/sanity/queries';
import { mergeContent } from '@/lib/mergeContent';
import { fontPairings } from '@/lib/fontPairings';
import SectionRenderer from '@/components/sections/SectionRenderer';
import Footer from '@/components/sections/Footer';

export const revalidate = 60;

export default async function Home() {
  const sanityData = await getSiteContent();
  const content = mergeContent(sanityData);

  if (process.env.NEXT_PUBLIC_COMPANY_NAME) {
    content.siteConfig.companyName = process.env.NEXT_PUBLIC_COMPANY_NAME;
  }

  const { colors, fontPairing } = content.siteConfig;
  const fonts = fontPairings[fontPairing] ?? fontPairings.authority;

  return (
    <div
      style={{
        '--color-primary': colors.primary,
        '--color-accent': colors.accent,
        '--color-bg': colors.background,
        '--color-text': colors.text,
        '--font-heading': fonts.heading,
        '--font-body': fonts.body,
        backgroundColor: colors.background,
        color: colors.text,
      } as React.CSSProperties}
    >
      {content.sections.map((section, i) => (
        <SectionRenderer key={i} section={section} />
      ))}
      <Footer config={content.siteConfig} />
    </div>
  );
}
