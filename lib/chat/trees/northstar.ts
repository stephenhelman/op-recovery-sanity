import { Tree } from '../types';

/**
 * NorthStar Overages Recovery — guided intake flow.
 *
 * COMPLIANCE: Surplus-fund recovery. Every line is reviewed here in code.
 * The bot must NEVER: give legal advice, tell anyone they "qualify" or are
 * "owed" money, estimate or confirm a dollar amount, or guarantee an outcome.
 * It only educates at a high level and hands off to a human specialist.
 * Keep these constraints in mind when editing any string below.
 */
export const northstar: Tree = {
  id: 'northstar',
  start: 'welcome',
  nodes: {
    welcome: {
      id: 'welcome',
      say: [
        'Hi! I can help point you in the right direction and connect you with a NorthStar specialist.',
        'What brings you in today?',
      ],
      options: [
        { label: 'I got a notice about surplus or excess funds', next: 'about_notice' },
        { label: 'I think there may be unclaimed funds in my name', next: 'about_search' },
        { label: 'I just have some questions', next: 'about_questions' },
        { label: 'I’d like to speak with someone', next: 'collect_intro' },
      ],
    },

    about_notice: {
      id: 'about_notice',
      say: [
        'Thanks for sharing that. After events like a foreclosure or tax sale, money is sometimes left over and held by a government office.',
        'NorthStar helps people identify and recover those surplus funds, and we work on a contingency basis — there’s no upfront cost to look into it.',
        'I can’t confirm any specific amount or whether a particular case is eligible — a specialist reviews each situation individually.',
      ],
      options: [
        { label: 'Okay, have someone reach out', next: 'collect_intro' },
        { label: 'I have another question first', next: 'about_questions' },
      ],
    },

    about_search: {
      id: 'about_search',
      say: [
        'Happy to help you get that looked into. NorthStar can research whether surplus funds may be associated with a property and guide you through the recovery process.',
        'I’m not able to tell you whether you have funds or how much — a specialist confirms that after reviewing the details.',
      ],
      options: [
        { label: 'Sounds good — let’s connect', next: 'collect_intro' },
        { label: 'I have another question first', next: 'about_questions' },
      ],
    },

    about_questions: {
      id: 'about_questions',
      say: [
        'Of course. NorthStar specializes in surplus and excess-fund recovery nationwide, on a no-upfront-cost basis.',
        'For anything specific to your situation — eligibility, amounts, or the steps involved — the best next step is a quick review with a specialist.',
      ],
      options: [
        { label: 'Have a specialist contact me', next: 'collect_intro' },
        { label: 'Maybe later', next: 'soft_end' },
      ],
    },

    collect_intro: {
      id: 'collect_intro',
      say: ['Great — I’ll just need a couple of details so the right person can follow up.'],
      options: [{ label: 'Let’s do it', next: 'capture_name' }],
    },

    capture_name: {
      id: 'capture_name',
      say: ['First, what’s your name?'],
      capture: {
        field: 'name',
        invalid: 'Sorry, I didn’t catch that — could you type your name?',
        next: 'capture_email',
      },
    },

    capture_email: {
      id: 'capture_email',
      say: ['Thanks! What’s the best email address to reach you?'],
      capture: {
        field: 'email',
        invalid: 'That doesn’t look like a valid email — could you double-check and re-enter it?',
        next: 'capture_phone',
      },
    },

    capture_phone: {
      id: 'capture_phone',
      say: ['And a phone number, in case a specialist would like to call? (Optional.)'],
      capture: {
        field: 'phone',
        invalid: 'That doesn’t look like a valid phone number — please use a 10-digit format, or skip.',
        optional: true,
        skipLabel: 'Skip for now',
        next: 'done',
      },
    },

    done: {
      id: 'done',
      say: [
        'Perfect — you’re all set. A NorthStar specialist will review your information and reach out, typically within one business day.',
        'If you’d like to connect sooner, you can reach out directly below.',
      ],
      end: true,
      cta: true,
    },

    soft_end: {
      id: 'soft_end',
      say: [
        'No problem at all. Whenever you’re ready, NorthStar is here to help — feel free to reach out anytime.',
      ],
      end: true,
      cta: true,
    },
  },
};
