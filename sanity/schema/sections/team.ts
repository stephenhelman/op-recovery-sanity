import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'teamSection',
  title: 'Team Section',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Single (one person, headshot + bio)', value: 'team-single' },
          { title: 'Grid (2–3 column cards)', value: 'team-grid' },
        ],
        layout: 'radio',
      },
      initialValue: 'team-single',
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading (optional)', type: 'string' }),
    defineField({
      name: 'members',
      title: 'Team Members',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'teamMember',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'title', title: 'Title / Role', type: 'string' }),
            defineField({
              name: 'photo',
              title: 'Photo',
              type: 'image',
              options: { hotspot: true },
              description: 'Headshot. A neutral placeholder is shown until one is uploaded.',
            }),
            defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 4 }),
            defineField({
              name: 'bilingualNote',
              title: 'Bilingual Note (optional)',
              type: 'string',
              description: 'e.g. "Fluent in English and Spanish". Shown as a badge under the name.',
            }),
            defineField({ name: 'phone', title: 'Phone (optional)', type: 'string' }),
            defineField({ name: 'email', title: 'Email (optional)', type: 'string' }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'title', media: 'photo' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading', variant: 'variant' },
    prepare({ heading, variant }: { heading?: string; variant?: string }) {
      return {
        title: heading || 'Team Section',
        subtitle: variant === 'team-grid' ? 'Grid' : 'Single',
      };
    },
  },
});
