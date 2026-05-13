import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'ctaSection',
  title: 'CTA Section',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Phone Bar', value: 'cta-phone' },
          { title: 'Button', value: 'cta-button' },
          { title: 'Banner', value: 'cta-banner' },
        ],
        layout: 'radio',
      },
      initialValue: 'cta-phone',
    }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'subheadline', title: 'Subheadline', type: 'string' }),
    defineField({ name: 'ctaText', title: 'CTA Text', type: 'string' }),
    defineField({ name: 'ctaPhone', title: 'Phone Number', type: 'string' }),
  ],
});
