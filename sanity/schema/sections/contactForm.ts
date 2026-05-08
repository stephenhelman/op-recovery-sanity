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
  ],
});

export { textField, emailField, phoneField, dropdownField, textareaField };
export default contactForm;
