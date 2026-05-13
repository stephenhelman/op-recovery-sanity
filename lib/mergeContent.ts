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
    contactEmail: sanityCfg.contactEmail || defaultCfg.contactEmail,
    colors: mergeColors(sanityCfg.colors, defaultCfg.colors),
    fontPairing: sanityCfg.fontPairing || defaultCfg.fontPairing,
  };
}

function ensureVariant(section: Section): Section {
  const s = section as Section & { variant?: string };
  if (!s.variant) {
    return { ...s, variant: defaultVariants[section._type] } as Section;
  }
  return section;
}

// These section types always render — inject from defaults if Sanity omits them
const ALWAYS_PRESENT: Array<Section['_type']> = ['impactNumbers', 'statesServed'];

function injectMissingSections(sanitySections: Section[]): Section[] {
  const existingTypes = new Set(sanitySections.map((s) => s._type));
  const result = [...sanitySections].map(ensureVariant);

  for (const type of ALWAYS_PRESENT) {
    if (existingTypes.has(type)) continue;

    const fallback = defaultContent.sections.find((s) => s._type === type);
    if (!fallback) continue;

    if (type === 'impactNumbers') {
      const heroIdx = result.findIndex((s) => s._type === 'heroSection');
      result.splice(heroIdx !== -1 ? heroIdx + 1 : 1, 0, fallback);
    } else {
      const contactIdx = result.findIndex((s) => s._type === 'contactForm');
      result.splice(contactIdx !== -1 ? contactIdx : result.length, 0, fallback);
    }
  }

  return result;
}

export function mergeContent(sanityData: Partial<SiteContent> | null): SiteContent {
  if (!sanityData) return defaultContent;

  return {
    siteConfig: mergeSiteConfig(sanityData.siteConfig, defaultContent.siteConfig),
    sections:
      sanityData.sections && sanityData.sections.length > 0
        ? injectMissingSections(sanityData.sections)
        : defaultContent.sections,
  };
}
