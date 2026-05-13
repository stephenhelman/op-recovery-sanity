import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'howItWorks',
  title: 'How It Works',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Numbered', value: 'steps-numbered' },
          { title: 'Timeline', value: 'steps-timeline' },
        ],
        layout: 'radio',
      },
      initialValue: 'steps-numbered',
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text' }),
          ],
        },
      ],
    }),
  ],
});
