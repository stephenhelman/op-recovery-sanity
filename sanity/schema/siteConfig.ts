import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteConfig',
  title: 'Site Configuration',
  type: 'document',
  fields: [
    defineField({ name: 'companyName', title: 'Company Name', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image' }),
    defineField({
      name: 'logoHeight',
      title: 'Logo Max Height (px)',
      type: 'number',
      description: 'Maximum display height of the logo in pixels. Width scales automatically. Default: 80',
      validation: (Rule) => Rule.min(20).max(400).integer(),
      initialValue: 80,
    }),
    defineField({
      name: 'logoWidth',
      title: 'Logo Max Width (px)',
      type: 'number',
      description: 'Optional maximum display width in pixels. Leave blank to let width scale naturally.',
      validation: (Rule) => Rule.min(20).max(800).integer(),
    }),
    defineField({
      name: 'headerLogo',
      title: 'Header Logo (optional)',
      type: 'image',
      description: 'Logo shown in the sticky nav. Leave blank to use the main Logo.',
    }),
    defineField({
      name: 'headerLogoHeight',
      title: 'Header Logo Height (px)',
      type: 'number',
      description: 'Display height of the nav logo in pixels. Width scales automatically. Default: 36',
      validation: (Rule) => Rule.min(20).max(120).integer(),
    }),
    defineField({
      name: 'headerLogoBackground',
      title: 'Header Logo Background (optional)',
      type: 'string',
      description: 'Hex color (e.g. #ffffff). Puts the nav logo on a padded panel of this color so a dark logo stays visible. Leave blank for no panel.',
      validation: (Rule) => Rule.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, { name: 'hex color' }).warning('Use a hex color like #ffffff'),
    }),
    defineField({ name: 'contactEmail', title: 'Contact Email', type: 'string' }),
    defineField({
      name: 'colors',
      title: 'Brand Colors',
      type: 'object',
      fields: [
        defineField({ name: 'primary', title: 'Primary Color (hex)', type: 'string' }),
        defineField({ name: 'accent', title: 'Accent Color (hex)', type: 'string' }),
        defineField({ name: 'background', title: 'Background Color (hex)', type: 'string' }),
        defineField({ name: 'text', title: 'Text Color (hex)', type: 'string' }),
      ],
    }),
    defineField({
      name: 'fontPairing',
      title: 'Font Pairing',
      type: 'string',
      options: {
        list: [
          { title: 'Authority (Black Ops One + Barlow Condensed)', value: 'authority' },
          { title: 'Professional (Playfair Display + DM Sans)', value: 'professional' },
          { title: 'Modern (Syne + Inter)', value: 'modern' },
          { title: 'Clean (DM Serif Display + Nunito)', value: 'clean' },
        ],
      },
    }),
    defineField({
      name: 'navCta',
      title: 'Nav CTA Button Text',
      type: 'string',
      description: 'Overrides the nav button text. Leave blank to use the Primary CTA Text, then the built-in default.',
    }),
    defineField({
      name: 'primaryCtaText',
      title: 'Primary CTA Text',
      type: 'string',
      description: 'One CTA wording used everywhere (nav, hero, content blocks). A section’s own CTA text still overrides it.',
    }),
    // Nav link labels live per-section as `navLabel` (single source of truth).
    // Nav anchors are owned by code (lib/navSections.ts) so they can't drift.
    defineField({
      name: 'features',
      title: 'Features',
      type: 'object',
      // A "feature" is anything that changes the STRUCTURE of the site — adds a
      // page, splits sections into their own routes, etc. (stateKnowledgeBase
      // adds /states; crmLite adds the dashboard; multipage, when built, splits
      // sections into pages). Content toggles (chat section) and lead-delivery
      // channels (Sheets/GHL) are NOT features — they live on their section.
      description: 'Structural toggles: things that change the shape of the site (extra pages, split routes). Not for content or lead-delivery options.',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'stateKnowledgeBase',
          title: 'State Knowledge Base',
          type: 'boolean',
          description: 'Enable interactive state map with filing deadlines and recovery data.',
          initialValue: false,
        }),
        defineField({
          name: 'crmLite',
          title: 'CRM Lite',
          type: 'boolean',
          description: 'Enable lead management dashboard at app.yourdomain.com.',
          initialValue: false,
        }),
        // Google Sheets and the Chat Widget are NOT feature flags:
        //  • Sheets is a lead-delivery channel — chosen per form in the Contact
        //    Form section's "Send Lead To" multi-select.
        //  • The Chat Widget is a page section — toggled by its own `enabled`.
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        { type: 'heroSection' },
        { type: 'problemSection' },
        { type: 'impactNumbers' },
        { type: 'serviceBlock' },
        { type: 'howItWorks' },
        { type: 'whyChooseUs' },
        { type: 'statesServed' },
        { type: 'aboutSection' },
        { type: 'faqSection' },
        { type: 'contactForm' },
        { type: 'disclaimerSection' },
        { type: 'stepsSection' },
        { type: 'ctaSection' },
        { type: 'chatWidget' },
        { type: 'teamSection' },
        { type: 'contentBlock' },
        { type: 'trustBar' },
      ],
    }),
  ],
});
