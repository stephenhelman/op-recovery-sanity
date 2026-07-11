import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'aboutSection',
  title: 'About Section',
  type: 'object',
  fields: [
    defineField({
      name: 'navLabel',
      title: 'Nav Label (optional)',
      type: 'string',
      description: 'Overrides this section’s label in the sticky nav. Leave blank to use the default.',
    }),
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
