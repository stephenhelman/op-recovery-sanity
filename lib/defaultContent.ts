import { SiteContent } from '@/types/content';
import { ALL_STATES } from './statesData';

// Premium default template. This is what a BRAND-NEW deployment renders when its
// Sanity project is empty. Existing clients are unaffected: mergeContent() uses
// Sanity's sections whenever they're present, so these defaults never override
// live content (they only fill a truly empty project).
export const defaultContent: SiteContent = {
  siteConfig: {
    companyName: 'Your Company Name',
    tagline: 'Your Tagline Here',
    logo: null,
    contactEmail: 'contact@yourcompany.com',
    colors: {
      primary: '#1B2A4A',
      accent: '#C8963A',
      background: '#F8F7F4',
      text: '#1B2A4A',
    },
    fontPairing: 'professional',
    navCta: 'Check If You’re Owed Money',
    features: {
      stateKnowledgeBase: false,
      crmLite: false,
    },
  },
  sections: [
    {
      _type: 'heroSection',
      variant: 'hero-photo',
      // No backgroundImage → HeroPhoto falls back to the bundled placeholder.
      overlayOpacity: 60,
      headline: 'You May Be Owed Money From a Property Sale or Foreclosure',
      subheadline:
        'We identify unclaimed surplus funds and guide you through the claims process — nationwide, at no upfront cost.',
      ctaText: 'See If You Qualify',
    },
    {
      _type: 'impactNumbers',
      variant: 'numbers-dark',
      stats: [
        { value: '$2.3B+', label: 'Surplus Funds Available Nationwide' },
        { value: '45+', label: 'States We Operate In' },
        { value: '120', label: 'Average Days to Complete a Claim' },
        { value: '0', label: 'Upfront Cost to You' },
      ],
    },
    {
      _type: 'problemSection',
      variant: 'problem-simple',
      heading: 'What No One Tells You About Surplus Funds',
      body:
        'When a property sells at foreclosure or tax sale for more than what was owed, the difference — the surplus — legally belongs to the former owner or their heirs. Most people never find out.',
      bullets: [
        { point: 'Counties are not required to track you down.' },
        { point: 'Deadlines to claim vary by state and can pass quietly.' },
        { point: 'Third parties may try to claim funds that are rightfully yours.' },
      ],
    },
    {
      _type: 'serviceBlock',
      variant: 'service-cards',
      heading: 'Mortgage Foreclosure Surplus Recovery',
      body: 'If your home sold at a foreclosure auction for more than your mortgage balance, you may be entitled to the surplus.',
      bullets: [
        { point: 'Free case research at no cost to you' },
        { point: 'We prepare and file all documentation' },
        { point: 'Contingency-based — you pay nothing upfront' },
      ],
    },
    {
      _type: 'serviceBlock',
      variant: 'service-cards',
      heading: 'Tax Lien & Tax Deed Surplus Recovery',
      body: 'When a property is sold for unpaid taxes, any amount above the taxes owed may be recoverable by the prior owner.',
      bullets: [
        { point: 'Nationwide coverage across 45+ states' },
        { point: 'Clear communication at every step' },
        { point: 'Funds released directly to you' },
      ],
    },
    {
      _type: 'howItWorks',
      variant: 'steps-numbered',
      heading: 'A Simple, Guided Process',
      steps: [
        {
          title: 'We Identify Your Funds',
          description:
            'We research your foreclosure case at no cost to determine whether surplus funds may be available.',
        },
        {
          title: 'We Handle the Process',
          description:
            'If funds exist, we gather documentation and prepare all necessary filings on your behalf.',
        },
        {
          title: 'You Get Paid',
          description: 'Once the claim is approved, surplus funds are released directly to you.',
        },
      ],
    },
    {
      _type: 'whyChooseUs',
      variant: 'list-checks',
      heading: 'Why Work With Us',
      bullets: [
        { point: 'No upfront cost — we only get paid when you do' },
        { point: 'Experienced guidance through a complex process' },
        { point: 'Transparent, honest communication throughout' },
        { point: 'Nationwide reach with local knowledge' },
      ],
    },
    {
      _type: 'teamSection',
      variant: 'team-single',
      heading: 'A Trusted Guide',
      subheading: 'Real people, here to help you recover what’s yours.',
      members: [
        {
          name: 'Your Name',
          title: 'Founder',
          photo: null, // → bundled placeholder headshot until a real photo is added
          bio: 'Add a short bio here introducing yourself and your commitment to helping property owners recover their surplus funds.',
        },
      ],
    },
    {
      _type: 'statesServed',
      variant: 'states-pills',
      heading: 'Serving Claimants Across the Nation',
      states: ALL_STATES,
    },
    {
      _type: 'faqSection',
      variant: 'faq-accordion',
      items: [
        {
          question: 'What are surplus funds?',
          answer:
            'Surplus funds are money left over after a foreclosure sale pays off the mortgage and associated costs. If the property sold for more than what was owed, the previous owner may be entitled to that difference.',
        },
        {
          question: "How do I know if I'm owed money?",
          answer:
            'We research your foreclosure case at no cost. If surplus funds are on file with the court or county, we will find them and notify you immediately.',
        },
        {
          question: 'What does it cost me upfront?',
          answer:
            'Nothing. We work on a contingency basis, meaning we only get paid when you get paid. There are no upfront fees or out-of-pocket expenses.',
        },
        {
          question: 'How long does the process take?',
          answer:
            'On average, claims are resolved within 90–150 days. Timelines vary based on the court, jurisdiction, and completeness of documentation.',
        },
        {
          question: 'Do I need a lawyer?',
          answer:
            'In most states, you do not need an attorney to file a surplus funds claim. We guide you through every step of the process and coordinate with the relevant courts on your behalf.',
        },
        {
          question: 'Is this legitimate?',
          answer:
            'Yes. Surplus funds are legally owed to former property owners or their heirs. This is a recognized legal process governed by state statutes. We operate in full compliance with applicable laws.',
        },
        {
          question: 'What states do you operate in?',
          answer:
            'We currently operate in 45 states across the country. Contact us to confirm availability in your specific state.',
        },
      ],
    },
    {
      _type: 'contactForm',
      variant: 'contact-stacked',
      heading: 'Find Out If Money Is Owed to You',
      subheading: 'Complete the form below for a free, no-obligation review.',
      submitText: 'Submit for Free Review',
      successMessage: 'Thank you. We will be in touch within 1 business day.',
      fields: [
        { _type: 'textField', label: 'Full Name', required: true },
        { _type: 'emailField', label: 'Email Address', required: true },
        { _type: 'phoneField', label: 'Phone Number', required: false },
        { _type: 'textareaField', label: 'Message', required: false },
      ],
    },
    {
      _type: 'disclaimerSection',
      variant: 'disclaimer-simple',
      body:
        'This company is not a law firm and does not provide legal advice. Results vary based on individual circumstances and jurisdiction.',
    },
  ],
};
