import { client } from './client';
import { SiteContent } from '@/types/content';

const SITE_CONTENT_QUERY = `*[_type == "siteConfig"][0]{
  companyName,
  tagline,
  "logo": logo.asset->url,
  logoHeight,
  logoWidth,
  contactEmail,
  colors,
  fontPairing,
  "sections": sections[]{
    _type,
    _key,
    variant,
    // heroSection
    headline,
    headlineAccent,
    subheadline,
    ctaText,
    ctaNote,
    ctaPhone,
    ctaType,
    // problemSection / serviceBlock / aboutSection / whyChooseUs
    heading,
    body,
    listTitle,
    bullets,
    summary,
    // impactNumbers
    stats,
    // howItWorks / stepsSection
    steps,
    stepNumber,
    // statesServed
    states,
    // faqSection
    items,
    // contactForm
    subheading,
    submitText,
    successMessage,
    footerNote,
    fields[]{
      _type,
      label,
      placeholder,
      required,
      options,
    },
    // disclaimerSection
    // body already included above
  }
}`;

export async function getSiteContent(): Promise<Partial<SiteContent> | null> {
  try {
    const raw = await client.fetch(SITE_CONTENT_QUERY);
    if (!raw) return null;
    const { sections, ...configFields } = raw;
    return {
      siteConfig: configFields,
      sections: sections || [],
    };
  } catch {
    return null;
  }
}
