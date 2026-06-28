import { defineType, defineField } from 'sanity';

type ModeParent = { parent: { mode?: string } };

export default defineType({
  name: 'chatWidget',
  title: 'Chat Widget',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      description: 'Off by default. Turn on to show the chat launcher on this site.',
      initialValue: false,
    }),
    defineField({
      name: 'mode',
      title: 'Engine',
      type: 'string',
      description: 'Decision Tree = guided buttons, no AI cost. AI Assistant = free conversation (requires API key, Sprint 2).',
      options: {
        list: [
          { title: 'Decision Tree (no AI)', value: 'tree' },
          { title: 'AI Assistant (Claude)', value: 'ai' },
        ],
        layout: 'radio',
      },
      initialValue: 'tree',
    }),
    defineField({
      name: 'brandName',
      title: 'Brand Name (header)',
      type: 'string',
      description: 'Name shown in the chat header. Defaults to the site company name.',
    }),
    defineField({
      name: 'welcomeMessage',
      title: 'Welcome Message',
      type: 'text',
      rows: 2,
      description: 'First message shown when the chat opens.',
    }),
    defineField({
      name: 'captureEmail',
      title: 'Capture Email',
      type: 'boolean',
      description: 'Require an email address before completing a lead.',
      initialValue: true,
    }),
    defineField({
      name: 'ctaPhone',
      title: 'CTA Phone Number',
      type: 'string',
      description: 'Phone number offered as a call-to-action at the end of a conversation.',
    }),
    defineField({
      name: 'ctaFormHref',
      title: 'CTA Form Link',
      type: 'string',
      description: 'Anchor or URL to the contact form (e.g. "#contact"). Offered as a CTA at the end.',
      initialValue: '#contact',
    }),
    defineField({
      name: 'treeId',
      title: 'Decision Tree',
      type: 'string',
      description: 'Which code-defined conversation flow to run (tree mode only).',
      options: {
        list: [{ title: 'NorthStar Overages Recovery', value: 'northstar' }],
      },
      initialValue: 'northstar',
      hidden: ({ parent }: ModeParent) => parent?.mode === 'ai',
    }),
    defineField({
      name: 'knowledge',
      title: 'AI Knowledge Base',
      type: 'text',
      rows: 10,
      description:
        'Background the AI assistant may use (services, process, states, FAQ). Compliance guardrails are enforced in code and cannot be edited here. (AI mode — used in Sprint 2.)',
      hidden: ({ parent }: ModeParent) => parent?.mode !== 'ai',
    }),

    // --- Phase 2 (Meta integration) — present but unused by the widget ---
    defineField({
      name: 'facebookEnabled',
      title: 'Facebook Messenger (Phase 2)',
      type: 'boolean',
      description: 'Reserved for the Phase 2 Messenger integration. Not yet active.',
      initialValue: false,
    }),
    defineField({
      name: 'whatsappEnabled',
      title: 'WhatsApp (Phase 2)',
      type: 'boolean',
      description: 'Reserved for the Phase 2 WhatsApp integration. Not yet active.',
      initialValue: false,
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number (Phase 2)',
      type: 'string',
      description: 'Reserved for the Phase 2 WhatsApp integration. Not yet active.',
      hidden: ({ parent }: { parent: { whatsappEnabled?: boolean } }) => !parent?.whatsappEnabled,
    }),
  ],
  preview: {
    select: { enabled: 'enabled', mode: 'mode' },
    prepare({ enabled, mode }: { enabled?: boolean; mode?: string }) {
      return {
        title: 'Chat Widget',
        subtitle: `${enabled ? 'Enabled' : 'Disabled'} · ${mode === 'ai' ? 'AI Assistant' : 'Decision Tree'}`,
      };
    },
  },
});
