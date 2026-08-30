import { notFound } from 'next/navigation';
import { getSiteContent } from '@/sanity/queries';
import { mergeContent } from '@/lib/mergeContent';
import { fontPairings } from '@/lib/fontPairings';
import { isEnabled } from '@/lib/features';
import StateMap from '@/components/sections/states/StateMap';
import Footer from '@/components/sections/Footer';

export const revalidate = 60;

export default async function StatesPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state: initialSlug } = await searchParams;
  const content = mergeContent(await getSiteContent());

  // Gated entirely by the feature flag. Off → the route 404s (nav never links
  // here when the flag is off, but a direct hit is handled too).
  if (!isEnabled(content.siteConfig.features, 'stateKnowledgeBase')) {
    notFound();
  }

  const { colors, fontPairing } = content.siteConfig;
  const fonts = fontPairings[fontPairing] ?? fontPairings.authority;

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
        } as React.CSSProperties
      }
    >
      <section className="pt-28 pb-16 md:pt-32 md:pb-24 px-6" style={{ color: 'var(--color-text)' }}>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
          >
            States We Serve
          </h1>
          <div className="mt-3 w-12 h-[3px] mx-auto" style={{ backgroundColor: 'var(--color-accent)' }} />
          <p className="mt-4 text-base sm:text-lg opacity-80" style={{ fontFamily: 'var(--font-body)' }}>
            Click your state to learn about surplus fund recovery in your area.
          </p>
        </div>
        <StateMap initialSlug={initialSlug} />
      </section>
      <Footer config={content.siteConfig} />
    </div>
  );
}
