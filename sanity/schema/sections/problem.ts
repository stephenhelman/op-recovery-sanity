import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'problemSection',
  title: 'Problem Section',
  type: 'object',
  fields: [
    defineField({ name: 'variant', title: 'Variant', type: 'string', initialValue: 'problem-simple', hidden: true }),
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
