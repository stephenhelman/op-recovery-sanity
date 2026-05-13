import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'stepsSection',
  title: 'Steps Section',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Cards', value: 'steps-cards' },
          { title: 'Circles', value: 'steps-circles' },
          { title: 'Numbered', value: 'steps-numbered' },
          { title: 'Timeline', value: 'steps-timeline' },
        ],
        layout: 'radio',
      },
      initialValue: 'steps-cards',
    }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'headlineAccent', title: 'Headline Accent (colored part)', type: 'string' }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'stepNumber', title: 'Step Number (e.g. "Step 1")', type: 'string' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'ctaType',
      title: 'CTA Type',
      type: 'string',
      options: {
        list: [
          { title: 'Phone', value: 'phone' },
          { title: 'Button', value: 'button' },
          { title: 'None', value: 'none' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
    defineField({ name: 'ctaText', title: 'CTA Text', type: 'string' }),
    defineField({ name: 'ctaPhone', title: 'CTA Phone Number', type: 'string' }),
  ],
});
