import { defineType, defineField } from 'sanity';
import { ALL_STATES } from '../../../lib/statesData';

export default defineType({
  name: 'statesServed',
  title: 'States Served',
  type: 'object',
  fields: [
    defineField({ name: 'variant', title: 'Variant', type: 'string', initialValue: 'states-pills', hidden: true }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'states',
      title: 'States',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: ALL_STATES.map((s) => ({ title: s, value: s })),
        layout: 'grid',
      },
    }),
  ],
});
