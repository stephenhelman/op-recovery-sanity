import { getSiteContent } from "@/sanity/queries";
import { mergeContent } from "@/lib/mergeContent";
import { fontPairings } from "@/lib/fontPairings";
import SectionRenderer from "@/components/sections/SectionRenderer";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import { ServiceBlocksWrapper } from "@/components/sections/ServiceBlock";
import { Section, ServiceBlock, HeroSection } from "@/types/content";

export const revalidate = 60;

type ServiceBlockGroup = { _type: 'serviceBlockGroup'; blocks: ServiceBlock[] };
type ProcessedSection = Section | ServiceBlockGroup;

export default async function Home() {
  const sanityData = await getSiteContent();
  const content = mergeContent(sanityData);

  if (process.env.NEXT_PUBLIC_COMPANY_NAME) {
    content.siteConfig.companyName = process.env.NEXT_PUBLIC_COMPANY_NAME;
  }

  const { colors, fontPairing } = content.siteConfig;
  const fonts = fontPairings[fontPairing] ?? fontPairings.authority;

  // Group consecutive serviceBlock sections so they render side-by-side
  const processedSections: ProcessedSection[] = [];
  let i = 0;
  while (i < content.sections.length) {
    const s = content.sections[i];
    if (s._type === 'serviceBlock') {
      const blocks: ServiceBlock[] = [];
      while (i < content.sections.length && content.sections[i]._type === 'serviceBlock') {
        blocks.push(content.sections[i] as ServiceBlock);
        i++;
      }
      processedSections.push({ _type: 'serviceBlockGroup', blocks });
    } else {
      processedSections.push(s);
      i++;
    }
  }

  // Precompute alternating bg flags (hero and impactNumbers keep their own explicit bg)
  let neutralCount = 0;
  const sectionMeta = processedSections.map((section) => {
    const isFixed =
      section._type === 'heroSection' || section._type === 'impactNumbers';
    const altBg = !isFixed && neutralCount % 2 === 1;
    if (!isFixed) neutralCount++;
    return { section, altBg };
  });

  return (
    <div
      style={
        {
          "--color-primary": colors.primary,
          "--color-accent": colors.accent,
          "--color-bg": colors.background,
          "--color-text": colors.text,
          "--font-heading": fonts.heading,
          "--font-body": fonts.body,
          backgroundColor: colors.background,
          color: colors.text,
        } as React.CSSProperties
      }
    >
      {sectionMeta.map(({ section, altBg }, idx) => {
        if (section._type === 'heroSection') {
          return (
            <Hero
              key={idx}
              data={section as HeroSection}
              logo={content.siteConfig.logo}
              companyName={content.siteConfig.companyName}
            />
          );
        }
        if (section._type === 'serviceBlockGroup') {
          const group = section as ServiceBlockGroup;
          return (
            <div key={idx} className={altBg ? 'bg-black/[0.03]' : ''}>
              <ServiceBlocksWrapper blocks={group.blocks} />
              <div className="mx-8 h-px" style={{ backgroundColor: 'var(--color-accent)', opacity: 0.12 }} />
            </div>
          );
        }
        return (
          <SectionRenderer key={idx} section={section as Section} altBg={altBg} />
        );
      })}
      <Footer config={content.siteConfig} />
    </div>
  );
}
