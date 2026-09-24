import { SiteContent, SiteConfig, TemplateColors, Section } from '@/types/content';
import { defaultContent } from './defaultContent';
import { defaultVariants } from './variants';

function mergeColors(
  sanityColors: Partial<TemplateColors> | null | undefined,
  defaultColors: TemplateColors
): TemplateColors {
  if (!sanityColors) return defaultColors;
  return {
    primary: sanityColors.primary || defaultColors.primary,
    accent: sanityColors.accent || defaultColors.accent,
    background: sanityColors.background || defaultColors.background,
    text: sanityColors.text || defaultColors.text,
  };
}

function mergeSiteConfig(
  sanityCfg: Partial<SiteConfig> | null | undefined,
  defaultCfg: SiteConfig
): SiteConfig {
  if (!sanityCfg) return defaultCfg;
  return {
    companyName: sanityCfg.companyName || defaultCfg.companyName,
    tagline: sanityCfg.tagline || defaultCfg.tagline,
    logo: sanityCfg.logo !== undefined ? sanityCfg.logo : defaultCfg.logo,
    logoHeight: sanityCfg.logoHeight ?? defaultCfg.logoHeight,
    logoWidth: sanityCfg.logoWidth ?? defaultCfg.logoWidth,
    headerLogo: sanityCfg.headerLogo ?? defaultCfg.headerLogo,
    headerLogoHeight: sanityCfg.headerLogoHeight ?? defaultCfg.headerLogoHeight,
    headerLogoBackground: sanityCfg.headerLogoBackground || defaultCfg.headerLogoBackground,
    primaryCtaText: sanityCfg.primaryCtaText || defaultCfg.primaryCtaText,
    contactEmail: sanityCfg.contactEmail || defaultCfg.contactEmail,
    colors: mergeColors(sanityCfg.colors, defaultCfg.colors),
    fontPairing: sanityCfg.fontPairing || defaultCfg.fontPairing,
    navCta: sanityCfg.navCta || defaultCfg.navCta,
    // Feature flags: Sanity wins per-key, falling back to defaults. Must be
    // carried through — dropping it silently disables every feature toggle
    // (state knowledge base, etc.).
    features: { ...defaultCfg.features, ...sanityCfg.features },
  };
}

function ensureVariant(section: Section): Section {
  const s = section as Section & { variant?: string };
  if (!s.variant) {
    return { ...s, variant: defaultVariants[section._type] } as Section;
  }
  return section;
}

// `sections` is atomic: any Sanity entries → render exactly those (nothing
// injected); none → the full default template.
export function mergeContent(sanityData: Partial<SiteContent> | null): SiteContent {
  if (!sanityData) return defaultContent;

  return {
    siteConfig: mergeSiteConfig(sanityData.siteConfig, defaultContent.siteConfig),
    sections:
      sanityData.sections && sanityData.sections.length > 0
        ? sanityData.sections.map(ensureVariant)
        : defaultContent.sections,
  };
}
