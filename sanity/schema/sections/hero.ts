import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Centered', value: 'hero-centered' },
          { title: 'Split', value: 'hero-split' },
          { title: 'Photo (full-bleed background image)', value: 'hero-photo' },
        ],
        layout: 'radio',
      },
      initialValue: 'hero-centered',
    }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({
      name: 'headlineAccent',
      title: 'Headline Accent Word (optional)',
      type: 'string',
      description: 'Emphasised word/phrase shown in the accent color after the headline.',
    }),
    defineField({ name: 'subheadline', title: 'Subheadline', type: 'text' }),
    defineField({ name: 'ctaText', title: 'CTA Button Text', type: 'string' }),
    defineField({ name: 'ctaNote', title: 'CTA Note (below button)', type: 'string' }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'Shown only when the variant is "Photo". Full-bleed behind the hero content.',
      options: { hotspot: true },
      hidden: ({ parent }: { parent?: { variant?: string } }) => parent?.variant !== 'hero-photo',
    }),
    defineField({
      name: 'overlayOpacity',
      title: 'Image Overlay Darkness (0–100)',
      type: 'number',
      description: 'Darkening overlay over the photo so white text stays readable. Default 60.',
      initialValue: 60,
      validation: (Rule) => Rule.min(0).max(100),
      hidden: ({ parent }: { parent?: { variant?: string } }) => parent?.variant !== 'hero-photo',
    }),
    defineField({
      name: 'logoChipEnabled',
      title: 'Logo Backdrop Chip',
      type: 'boolean',
      description: 'Puts the logo on a solid panel so a dark logo stays readable on the photo. On by default for the Photo variant.',
      hidden: ({ parent }: { parent?: { variant?: string } }) => parent?.variant !== 'hero-photo',
    }),
    defineField({
      name: 'logoChipColor',
      title: 'Logo Chip Color (hex)',
      type: 'string',
      description: 'Panel color behind the logo. Default #ffffff.',
      validation: (Rule) => Rule.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, { name: 'hex color' }).warning('Use a hex color like #ffffff'),
      hidden: ({ parent }: { parent?: { variant?: string } }) => parent?.variant !== 'hero-photo',
    }),
    defineField({
      name: 'logoChipPadding',
      title: 'Logo Chip Padding (px)',
      type: 'number',
      description: 'Space between the logo and the panel edge. Default 16.',
      validation: (Rule) => Rule.min(0).max(64).integer(),
      hidden: ({ parent }: { parent?: { variant?: string } }) => parent?.variant !== 'hero-photo',
    }),
  ],
});
