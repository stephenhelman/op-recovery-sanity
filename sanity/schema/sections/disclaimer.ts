import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'disclaimerSection',
  title: 'Disclaimer Section',
  type: 'object',
  fields: [
    defineField({ name: 'body', title: 'Body', type: 'text' }),
  ],
});
