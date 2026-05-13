import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Centered', value: 'hero-centered' },
          { title: 'Split', value: 'hero-split' },
        ],
        layout: 'radio',
      },
      initialValue: 'hero-centered',
    }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'subheadline', title: 'Subheadline', type: 'text' }),
    defineField({ name: 'ctaText', title: 'CTA Button Text', type: 'string' }),
    defineField({ name: 'ctaNote', title: 'CTA Note (below button)', type: 'string' }),
  ],
});
