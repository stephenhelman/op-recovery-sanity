import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'contentBlock',
  title: 'Content Block',
  type: 'object',
  fields: [
    defineField({ name: 'variant', title: 'Variant', type: 'string', initialValue: 'content-simple', hidden: true }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      description: 'Add items in the order they should appear.',
      of: [
        {
          name: 'subheading',
          title: 'Subheading',
          type: 'object',
          fields: [defineField({ name: 'text', title: 'Text', type: 'string' })],
          preview: {
            select: { title: 'text' },
            prepare: ({ title }: { title?: string }) => ({ title: title || 'Subheading', subtitle: 'Subheading' }),
          },
        },
        {
          name: 'paragraph',
          title: 'Paragraph',
          type: 'object',
          fields: [defineField({ name: 'text', title: 'Text', type: 'text' })],
          preview: {
            select: { title: 'text' },
            prepare: ({ title }: { title?: string }) => ({ title: title || 'Paragraph', subtitle: 'Paragraph' }),
          },
        },
        {
          name: 'bullets',
          title: 'Bullets',
          type: 'object',
          fields: [
            defineField({ name: 'listTitle', title: 'List Title (optional)', type: 'string' }),
            defineField({
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [defineField({ name: 'point', title: 'Point', type: 'string' })],
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'listTitle' },
            prepare: ({ title }: { title?: string }) => ({ title: title || 'Bullet list', subtitle: 'Bullets' }),
          },
        },
        {
          name: 'image',
          title: 'Image',
          type: 'object',
          fields: [
            defineField({ name: 'asset', title: 'Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption (optional)', type: 'string' }),
          ],
          preview: {
            select: { title: 'alt', media: 'asset' },
            prepare: ({ title, media }: { title?: string; media?: unknown }) => ({
              title: title || 'Image',
              subtitle: 'Image',
              media: media as never,
            }),
          },
        },
        {
          name: 'cta',
          title: 'CTA Button',
          type: 'object',
          fields: [
            defineField({
              name: 'ctaText',
              title: 'Button Text (optional)',
              type: 'string',
              description: 'Falls back to the site-wide Primary CTA text. Scrolls to the contact form.',
            }),
          ],
          preview: {
            select: { title: 'ctaText' },
            prepare: ({ title }: { title?: string }) => ({ title: title || 'Default CTA text', subtitle: 'CTA Button' }),
          },
        },
      ],
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
