import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'faqSection',
  title: 'FAQ Section',
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
          { title: 'Accordion', value: 'faq-accordion' },
          { title: 'Grid', value: 'faq-grid' },
        ],
        layout: 'radio',
      },
      initialValue: 'faq-accordion',
    }),
    defineField({
      name: 'items',
      title: 'FAQ Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string' }),
            defineField({ name: 'answer', title: 'Answer', type: 'text' }),
          ],
        },
      ],
    }),
  ],
});
