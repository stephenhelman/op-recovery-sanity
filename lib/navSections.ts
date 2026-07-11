import { Section } from '@/types/content';

/**
 * Nav structure is owned by CODE, not Sanity — so a nav anchor can never drift
 * from the section's rendered `id`. Sanity owns only the *label* (per-section
 * `navLabel`, optional; falls back to `defaultLabel` here).
 *
 * A section type NOT in this map (hero, impactNumbers, problem, whyChooseUs,
 * disclaimer, chatWidget, cta, team) simply produces no nav link.
 *
 * `anchor` is the on-page `#id` the section renders. The nav walks the sections
 * that are actually present (in page order) and emits one link per matching
 * type — see buildNavLinks().
 */
export type NavEligibleType = Extract<
  Section['_type'],
  'howItWorks' | 'serviceBlock' | 'statesServed' | 'aboutSection' | 'faqSection' | 'contactForm'
>;

export const NAV_SECTIONS: Record<NavEligibleType, { anchor: string; defaultLabel: string }> = {
  howItWorks: { anchor: '#process', defaultLabel: 'How It Works' },
  serviceBlock: { anchor: '#services', defaultLabel: 'Services' },
  statesServed: { anchor: '#states', defaultLabel: 'States' },
  aboutSection: { anchor: '#about', defaultLabel: 'About' },
  faqSection: { anchor: '#faq', defaultLabel: 'FAQ' },
  contactForm: { anchor: '#contact', defaultLabel: 'Contact' },
};

export type NavLink = { label: string; href: string };

function isNavEligible(type: Section['_type']): type is NavEligibleType {
  return type in NAV_SECTIONS;
}

/**
 * Derive nav links from the sections actually present, in page order.
 * - Deduped by anchor (grouped serviceBlocks → one "Services" link).
 * - Label = section.navLabel ?? defaultLabel.
 * - When `statesKnowledgeBase` is on, the States link points to `/states`
 *   instead of the `#states` homepage anchor.
 */
export function buildNavLinks(
  sections: Section[],
  opts: { stateKnowledgeBase?: boolean } = {}
): NavLink[] {
  const links: NavLink[] = [];
  const seen = new Set<string>();

  for (const section of sections) {
    const type = section._type;
    if (!isNavEligible(type)) continue;

    const { anchor, defaultLabel } = NAV_SECTIONS[type];
    if (seen.has(anchor)) continue;
    seen.add(anchor);

    const label = (section as { navLabel?: string }).navLabel || defaultLabel;
    const href =
      type === 'statesServed' && opts.stateKnowledgeBase ? '/states' : anchor;

    links.push({ label, href });
  }

  return links;
}
