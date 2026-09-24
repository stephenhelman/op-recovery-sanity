import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'trustBar',
  title: 'Trust Bar',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: { list: [{ title: 'Minimal', value: 'trust-minimal' }], layout: 'radio' },
      initialValue: 'trust-minimal',
    }),
    defineField({
      name: 'items',
      title: 'Trust Phrases',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Short phrases, shown in a row with dividers.',
    }),
    defineField({
      name: 'subline',
      title: 'Subline (optional)',
      type: 'text',
      rows: 2,
      description: 'Reassurance line shown beneath the phrases.',
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }: { items?: string[] }) => ({
      title: items?.length ? items.join(' | ') : 'Trust Bar',
      subtitle: 'Trust Bar',
    }),
  },
});
