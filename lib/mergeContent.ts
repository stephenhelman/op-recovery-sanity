import { SiteContent, SiteConfig, TemplateColors } from '@/types/content';
import { defaultContent } from './defaultContent';

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
    contactEmail: sanityCfg.contactEmail || defaultCfg.contactEmail,
    colors: mergeColors(sanityCfg.colors, defaultCfg.colors),
    fontPairing: sanityCfg.fontPairing || defaultCfg.fontPairing,
  };
}

export function mergeContent(sanityData: Partial<SiteContent> | null): SiteContent {
  if (!sanityData) return defaultContent;

  return {
    siteConfig: mergeSiteConfig(sanityData.siteConfig, defaultContent.siteConfig),
    sections:
      sanityData.sections && sanityData.sections.length > 0
        ? sanityData.sections
        : defaultContent.sections,
  };
}
