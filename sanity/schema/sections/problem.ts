import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'problemSection',
  title: 'Problem Section',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'text' }),
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
  ],
});
