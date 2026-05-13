export const sectionVariants: Record<string, { value: string; label: string }[]> = {
  heroSection: [
    { value: 'hero-centered', label: 'Centered' },
    { value: 'hero-split', label: 'Split' },
  ],
  stepsSection: [
    { value: 'steps-cards', label: 'Cards' },
    { value: 'steps-circles', label: 'Circles' },
    { value: 'steps-numbered', label: 'Numbered' },
    { value: 'steps-timeline', label: 'Timeline' },
  ],
  ctaSection: [
    { value: 'cta-phone', label: 'Phone Bar' },
    { value: 'cta-button', label: 'Button' },
    { value: 'cta-banner', label: 'Banner' },
  ],
  serviceBlock: [
    { value: 'service-cards', label: 'Cards' },
    { value: 'service-list', label: 'List' },
  ],
  whyChooseUs: [
    { value: 'list-bullets', label: 'Bullets' },
    { value: 'list-checks', label: 'Checks' },
    { value: 'list-cards', label: 'Cards' },
  ],
  faqSection: [
    { value: 'faq-accordion', label: 'Accordion' },
    { value: 'faq-grid', label: 'Grid' },
  ],
  contactForm: [
    { value: 'contact-stacked', label: 'Stacked' },
    { value: 'contact-split', label: 'Split' },
    { value: 'contact-minimal', label: 'Minimal' },
  ],
  impactNumbers: [
    { value: 'numbers-dark', label: 'Dark' },
    { value: 'numbers-light', label: 'Light' },
  ],
  aboutSection: [
    { value: 'about-centered', label: 'Centered' },
    { value: 'about-split', label: 'Split' },
  ],
  howItWorks: [
    { value: 'steps-numbered', label: 'Numbered' },
    { value: 'steps-timeline', label: 'Timeline' },
  ],
};

export const defaultVariants: Record<string, string> = {
  heroSection: 'hero-centered',
  stepsSection: 'steps-cards',
  ctaSection: 'cta-phone',
  serviceBlock: 'service-cards',
  whyChooseUs: 'list-bullets',
  faqSection: 'faq-accordion',
  contactForm: 'contact-stacked',
  impactNumbers: 'numbers-dark',
  aboutSection: 'about-centered',
  howItWorks: 'steps-numbered',
  problemSection: 'problem-simple',
  statesServed: 'states-pills',
  disclaimerSection: 'disclaimer-simple',
};
