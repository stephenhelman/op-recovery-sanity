import { cache } from 'react';
import { client } from './client';
import { SiteContent } from '@/types/content';

const SITE_CONTENT_QUERY = `*[_type == "siteConfig"][0]{
  companyName,
  tagline,
  "logo": logo.asset->url,
  logoHeight,
  logoWidth,
  "headerLogo": headerLogo.asset->url,
  headerLogoBackground,
  headerLogoHeight,
  primaryCtaText,
  contactEmail,
  colors,
  fontPairing,
  navCta,
  navLinks,
  features,
  "sections": sections[]{
    _type,
    _key,
    variant,
    navLabel,
    // heroSection
    headline,
    headlineAccent,
    subheadline,
    ctaText,
    ctaNote,
    ctaPhone,
    ctaType,
    "backgroundImage": backgroundImage.asset->url,
    overlayOpacity,
    logoChipEnabled,
    logoChipColor,
    logoChipPadding,
    // contentBlock — multi-type array, each item type projected explicitly
    content[]{
      _type,
      _key,
      _type == "subheading" => { text },
      _type == "paragraph" => { text },
      _type == "bullets" => { listTitle, items[]{ point } },
      _type == "contentImage" => { "url": asset.asset->url, alt, caption },
      _type == "cta" => { ctaText },
    },
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
    // faqSection (object items) / trustBar (string items)
    items,
    subline,
    // teamSection
    members[]{
      name,
      title,
      "photo": photo.asset->url,
      bio,
      bilingualNote,
      phone,
      email,
    },
    // contactForm
    subheading,
    submitText,
    successMessage,
    footerNote,
    formSettings,
    fields[]{
      _type,
      label,
      placeholder,
      required,
      options,
    },
    // disclaimerSection
    // body already included above
    // chatWidget
    enabled,
    mode,
    brandName,
    ownerName,
    assistantName,
    statusText,
    avatarInitials,
    nudgeMessage,
    welcomeMessage,
    captureEmail,
    ctaFormHref,
    treeId,
    treeJson,
    knowledge,
    facebookEnabled,
    whatsappEnabled,
    whatsappNumber,
  }
}`;

// Wrapped in React `cache` so the layout-level <Nav> and the page can each call
// getSiteContent() within one render pass and share a single Sanity fetch.
export const getSiteContent = cache(
  async (): Promise<Partial<SiteContent> | null> => {
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
);
