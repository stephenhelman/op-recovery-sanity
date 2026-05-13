import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteConfig',
  title: 'Site Configuration',
  type: 'document',
  fields: [
    defineField({ name: 'companyName', title: 'Company Name', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image' }),
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
      ],
    }),
  ],
});
