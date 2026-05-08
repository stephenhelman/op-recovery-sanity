import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'whyChooseUs',
  title: 'Why Choose Us',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
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
