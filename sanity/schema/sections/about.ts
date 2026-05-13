import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'aboutSection',
  title: 'About Section',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Centered', value: 'about-centered' },
          { title: 'Split', value: 'about-split' },
        ],
        layout: 'radio',
      },
      initialValue: 'about-centered',
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'text' }),
  ],
});
