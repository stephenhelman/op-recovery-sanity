import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'contentBlock',
  title: 'Content Block',
  type: 'object',
  fields: [
    defineField({ name: 'variant', title: 'Variant', type: 'string', initialValue: 'content-simple', hidden: true }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'text' }),
    defineField({ name: 'listTitle', title: 'List Title (above bullets, optional)', type: 'string' }),
    defineField({
      name: 'bullets',
      title: 'Bullets (optional)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [defineField({ name: 'point', title: 'Point', type: 'string' })],
        },
      ],
    }),
    defineField({ name: 'summary', title: 'Summary (below bullets, optional)', type: 'text' }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text (optional)',
      type: 'string',
      description: 'Falls back to the site-wide Primary CTA text. Scrolls to the contact form.',
    }),
    defineField({
      name: 'navLabel',
      title: 'Nav Label (optional)',
      type: 'string',
      description: 'Reserved. Content blocks are not yet linked from the sticky nav.',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }: { title?: string }) => ({ title: title || 'Content Block', subtitle: 'Content Block' }),
  },
});
