import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'statesServed',
  title: 'States Served',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'states',
      title: 'States',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
});
