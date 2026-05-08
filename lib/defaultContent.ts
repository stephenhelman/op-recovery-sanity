import { SiteContent } from '@/types/content';
import { ALL_STATES } from './statesData';

export const defaultContent: SiteContent = {
  siteConfig: {
    companyName: 'Your Company Name',
    tagline: 'Your Tagline Here',
    logo: null,
    contactEmail: 'contact@yourcompany.com',
    colors: {
      primary: '#DABD59',
      accent: '#FFFFFF',
      background: '#0A0A0A',
      text: '#FFFFFF',
    },
    fontPairing: 'authority',
  },
  sections: [
    {
      _type: 'heroSection',
      headline: 'You May Be Owed Money From a Property Sale or Foreclosure',
      subheadline:
        'We identify unclaimed surplus funds and guide you through the claims process — nationwide, at no upfront cost.',
      ctaText: 'See If You Qualify',
    },
    {
      _type: 'impactNumbers',
      stats: [
        { value: '$2.3B+', label: 'Surplus Funds Available Nationwide' },
        { value: '45+', label: 'States We Operate In' },
        { value: '120', label: 'Average Days to Complete a Claim' },
        { value: '0', label: 'Upfront Cost to You' },
      ],
    },
    {
      _type: 'howItWorks',
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
          description:
            'Once the claim is approved, surplus funds are released directly to you.',
        },
      ],
    },
    {
      _type: 'statesServed',
      heading: 'Serving Claimants Across the Nation',
      states: ALL_STATES,
    },
    {
      _type: 'faqSection',
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
      _type: 'aboutSection',
      heading: 'A Trusted Guide Through a Complex Process',
      body: 'We are a nationwide asset recovery firm helping property owners and heirs claim funds they are legally owed from foreclosure and tax deed proceedings. We work on a contingency basis — you pay nothing until we recover your funds.',
    },
    {
      _type: 'contactForm',
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
  ],
};
