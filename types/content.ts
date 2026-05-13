export interface TemplateColors {
  primary: string;
  accent: string;
  background: string;
  text: string;
}

export type FontPairing = 'authority' | 'professional' | 'modern' | 'clean';

export interface SiteConfig {
  companyName: string;
  tagline: string;
  logo: string | null;
  logoHeight?: number;
  logoWidth?: number;
  contactEmail: string;
  colors: TemplateColors;
  fontPairing: FontPairing;
}

export interface HeroSection {
  _type: 'heroSection';
  variant?: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaNote?: string;
}

export interface ProblemSection {
  _type: 'problemSection';
  variant?: string;
  heading: string;
  body: string;
  listTitle?: string;
  bullets: { point: string }[];
  summary?: string;
}

export interface ImpactNumbers {
  _type: 'impactNumbers';
  variant?: string;
  stats: { value: string; label: string }[];
}

export interface ServiceBlock {
  _type: 'serviceBlock';
  variant?: string;
  heading: string;
  body: string;
  listTitle?: string;
  bullets: { point: string }[];
  summary?: string;
}

export interface HowItWorks {
  _type: 'howItWorks';
  variant?: string;
  heading: string;
  steps: { title: string; description: string }[];
}

export interface WhyChooseUs {
  _type: 'whyChooseUs';
  variant?: string;
  heading: string;
  listTitle?: string;
  bullets: { point: string }[];
  summary?: { paragraph: string }[];
}

export interface StatesServed {
  _type: 'statesServed';
  variant?: string;
  heading: string;
  states: string[];
}

export interface AboutSection {
  _type: 'aboutSection';
  variant?: string;
  heading: string;
  body: string;
}

export interface FaqSection {
  _type: 'faqSection';
  variant?: string;
  items: { question: string; answer: string }[];
}

export type TextField = { _type: 'textField'; label: string; placeholder?: string; required: boolean };
export type EmailField = { _type: 'emailField'; label: string; required: boolean };
export type PhoneField = { _type: 'phoneField'; label: string; required: boolean };
export type DropdownField = { _type: 'dropdownField'; label: string; required: boolean; options: string[] };
export type TextareaField = { _type: 'textareaField'; label: string; placeholder?: string; required: boolean };

export type FormField = TextField | EmailField | PhoneField | DropdownField | TextareaField;

export interface ContactForm {
  _type: 'contactForm';
  variant?: string;
  heading: string;
  subheading: string;
  submitText: string;
  successMessage: string;
  footerNote?: string;
  fields: FormField[];
}

export interface DisclaimerSection {
  _type: 'disclaimerSection';
  variant?: string;
  body: string;
}

export interface StepsSection {
  _type: 'stepsSection';
  _key: string;
  variant: 'steps-cards' | 'steps-circles' | 'steps-numbered' | 'steps-timeline';
  headline?: string;
  headlineAccent?: string;
  steps: {
    stepNumber: string;
    title: string;
    description: string;
  }[];
  ctaType?: 'phone' | 'button' | 'none';
  ctaText?: string;
  ctaPhone?: string;
}

export interface CtaSection {
  _type: 'ctaSection';
  _key: string;
  variant: 'cta-phone' | 'cta-button' | 'cta-banner';
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaPhone?: string;
}

export type Section =
  | HeroSection
  | ProblemSection
  | ImpactNumbers
  | ServiceBlock
  | HowItWorks
  | WhyChooseUs
  | StatesServed
  | AboutSection
  | FaqSection
  | ContactForm
  | DisclaimerSection
  | StepsSection
  | CtaSection;

export interface SiteContent {
  siteConfig: SiteConfig;
  sections: Section[];
}
