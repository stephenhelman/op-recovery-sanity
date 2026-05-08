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
  contactEmail: string;
  colors: TemplateColors;
  fontPairing: FontPairing;
}

export interface HeroSection {
  _type: 'heroSection';
  headline: string;
  subheadline: string;
  ctaText: string;
}

export interface ProblemSection {
  _type: 'problemSection';
  heading: string;
  body: string;
  bullets: { point: string }[];
}

export interface ImpactNumbers {
  _type: 'impactNumbers';
  stats: { value: string; label: string }[];
}

export interface ServiceBlock {
  _type: 'serviceBlock';
  heading: string;
  body: string;
  bullets: { point: string }[];
}

export interface HowItWorks {
  _type: 'howItWorks';
  heading: string;
  steps: { title: string; description: string }[];
}

export interface WhyChooseUs {
  _type: 'whyChooseUs';
  heading: string;
  bullets: { point: string }[];
}

export interface StatesServed {
  _type: 'statesServed';
  heading: string;
  states: string[];
}

export interface AboutSection {
  _type: 'aboutSection';
  heading: string;
  body: string;
}

export interface FaqSection {
  _type: 'faqSection';
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
  heading: string;
  subheading: string;
  submitText: string;
  successMessage: string;
  fields: FormField[];
}

export interface DisclaimerSection {
  _type: 'disclaimerSection';
  body: string;
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
  | DisclaimerSection;

export interface SiteContent {
  siteConfig: SiteConfig;
  sections: Section[];
}
