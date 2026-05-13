import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'whyChooseUs',
  title: 'Why Choose Us',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Bullets', value: 'list-bullets' },
          { title: 'Checks', value: 'list-checks' },
          { title: 'Cards', value: 'list-cards' },
        ],
        layout: 'radio',
      },
      initialValue: 'list-bullets',
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'listTitle', title: 'List Title (above bullets)', type: 'string' }),
    defineField({
      name: 'bullets',
      title: 'Bullets',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [defineField({ name: 'point', title: 'Point', type: 'string' })],
        },
      ],
    }),
    defineField({
      name: 'summary',
      title: 'Summary Paragraphs (below bullets)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [defineField({ name: 'paragraph', title: 'Paragraph', type: 'text' })],
        },
      ],
    }),
  ],
});
