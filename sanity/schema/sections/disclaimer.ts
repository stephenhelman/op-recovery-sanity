import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'disclaimerSection',
  title: 'Disclaimer Section',
  type: 'object',
  fields: [
    defineField({ name: 'variant', title: 'Variant', type: 'string', initialValue: 'disclaimer-simple', hidden: true }),
    defineField({ name: 'body', title: 'Body', type: 'text' }),
  ],
});
