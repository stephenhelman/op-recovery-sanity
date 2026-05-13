import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'impactNumbers',
  title: 'Impact Numbers',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Dark', value: 'numbers-dark' },
          { title: 'Light', value: 'numbers-light' },
        ],
        layout: 'radio',
      },
      initialValue: 'numbers-dark',
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string' }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
          ],
        },
      ],
    }),
  ],
});
