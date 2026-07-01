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
      title: 'Brand Name',
      type: 'string',
      description: 'Company name. Drives the monogram initial. Defaults to the site company name.',
    }),
    defineField({
      name: 'ownerName',
      title: 'Owner First Name (optional)',
      type: 'string',
      description:
        'If set, the assistant is named "{Owner}’s Assistant" (e.g. "Maureen’s Assistant") — warm and honest. Overridden by Assistant Name below.',
    }),
    defineField({
      name: 'assistantName',
      title: 'Assistant Name (optional override)',
      type: 'string',
      description:
        'Exact name shown in the header. Leave blank to use "{Owner}’s Assistant", or "{Brand} Assistant" if no owner is set. Do not use a fake human first name.',
    }),
    defineField({
      name: 'statusText',
      title: 'Status Line (optional override)',
      type: 'string',
      description: 'Small line under the assistant name. Defaults to "Typically replies instantly".',
    }),
    defineField({
      name: 'avatarInitials',
      title: 'Monogram Initials (optional override)',
      type: 'string',
      description:
        'Override the header/launcher monogram. Defaults to the first letter of the brand name (e.g. "N"). Keep it 1–2 characters.',
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: 'nudgeMessage',
      title: 'Proactive Nudge Message (optional)',
      type: 'string',
      description:
        'Quiet teaser shown once per visit above the launcher. Defaults to "Questions about surplus funds? I’m here to help — no pressure."',
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
