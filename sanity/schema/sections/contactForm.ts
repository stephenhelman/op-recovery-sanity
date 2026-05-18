import { defineType, defineField } from 'sanity';

const textField = defineType({
  name: 'textField',
  title: 'Text Field',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'placeholder', title: 'Placeholder', type: 'string' }),
    defineField({ name: 'required', title: 'Required', type: 'boolean' }),
  ],
});

const emailField = defineType({
  name: 'emailField',
  title: 'Email Field',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'required', title: 'Required', type: 'boolean' }),
  ],
});

const phoneField = defineType({
  name: 'phoneField',
  title: 'Phone Field',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'required', title: 'Required', type: 'boolean' }),
  ],
});

const dropdownField = defineType({
  name: 'dropdownField',
  title: 'Dropdown Field',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'required', title: 'Required', type: 'boolean' }),
    defineField({ name: 'options', title: 'Options', type: 'array', of: [{ type: 'string' }] }),
  ],
});

const textareaField = defineType({
  name: 'textareaField',
  title: 'Textarea Field',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'placeholder', title: 'Placeholder', type: 'string' }),
    defineField({ name: 'required', title: 'Required', type: 'boolean' }),
  ],
});

const contactForm = defineType({
  name: 'contactForm',
  title: 'Contact Form',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Stacked', value: 'contact-stacked' },
          { title: 'Split', value: 'contact-split' },
          { title: 'Minimal', value: 'contact-minimal' },
        ],
        layout: 'radio',
      },
      initialValue: 'contact-stacked',
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'string' }),
    defineField({ name: 'submitText', title: 'Submit Button Text', type: 'string' }),
    defineField({ name: 'successMessage', title: 'Success Message', type: 'string' }),
    defineField({ name: 'footerNote', title: 'Footer Note (below submit button)', type: 'string' }),
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      of: [
        { type: 'textField' },
        { type: 'emailField' },
        { type: 'phoneField' },
        { type: 'dropdownField' },
        { type: 'textareaField' },
      ],
    }),
    defineField({
      name: 'formSettings',
      title: 'Form Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'replyToEmail',
          title: 'Reply-To Email',
          type: 'string',
          description: 'When you receive a lead notification, hitting reply will go to this address. Leave blank to reply to the lead directly.',
        }),
        defineField({
          name: 'fromName',
          title: 'From Name',
          type: 'string',
          description: 'Name shown on emails sent to leads. Defaults to company name.',
        }),
        defineField({
          name: 'fromEmail',
          title: 'From Email Address',
          type: 'string',
          description: 'Email address confirmation emails are sent from. Must be verified in Resend.',
        }),
        defineField({
          name: 'formAction',
          title: 'Form Action',
          type: 'string',
          options: {
            list: [
              { title: 'Email Only', value: 'email' },
              { title: 'Email + Google Sheets', value: 'email+sheets' },
              { title: 'Email + GHL', value: 'email+ghl' },
              { title: 'Email + Sheets + GHL', value: 'email+sheets+ghl' },
            ],
            layout: 'radio',
          },
          initialValue: 'email',
        }),
        defineField({
          name: 'googleWebhookUrl',
          title: 'Google Sheets Webhook URL',
          type: 'string',
          description: 'Paste the Google Apps Script webhook URL here. See setup instructions.',
          hidden: ({ parent }: { parent: { formAction?: string } }) =>
            !parent?.formAction?.includes('sheets'),
        }),
        defineField({
          name: 'ghlApiKey',
          title: 'GHL API Key',
          type: 'string',
          description: 'Your GoHighLevel API key from Settings → Integrations.',
          hidden: ({ parent }: { parent: { formAction?: string } }) =>
            !parent?.formAction?.includes('ghl'),
        }),
        defineField({
          name: 'ghlPipelineId',
          title: 'GHL Pipeline ID',
          type: 'string',
          description: 'Optional. The pipeline to add this lead to.',
          hidden: ({ parent }: { parent: { formAction?: string } }) =>
            !parent?.formAction?.includes('ghl'),
        }),
        defineField({
          name: 'ghlStageId',
          title: 'GHL Stage ID',
          type: 'string',
          description: 'Optional. The stage within the pipeline.',
          hidden: ({ parent }: { parent: { formAction?: string } }) =>
            !parent?.formAction?.includes('ghl'),
        }),
      ],
    }),
  ],
});

export { textField, emailField, phoneField, dropdownField, textareaField };
export default contactForm;
