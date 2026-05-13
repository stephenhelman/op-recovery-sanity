import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'serviceBlock',
  title: 'Service Block',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Cards', value: 'service-cards' },
          { title: 'List', value: 'service-list' },
        ],
        layout: 'radio',
      },
      initialValue: 'service-cards',
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'text' }),
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
    defineField({ name: 'summary', title: 'Summary (below bullets)', type: 'text' }),
  ],
});
