export interface TemplateColors {
  primary: string;
  accent: string;
  background: string;
  text: string;
}

export type FontPairing = 'authority' | 'professional' | 'modern' | 'clean';

/**
 * A "feature" is anything that changes the STRUCTURE of the site — adds a page
 * or splits sections into their own routes.
 *   stateKnowledgeBase → adds /states
 *   crmLite            → adds the lead dashboard
 *   (multipage, when built, splits sections into pages → a feature)
 * Content toggles (chat section `enabled`) and lead-delivery channels
 * (Sheets/GHL, via formAction) are NOT features — they live on their section.
 */
export interface SiteFeatures {
  stateKnowledgeBase?: boolean;
  crmLite?: boolean;
}

export interface SiteConfig {
  companyName: string;
  tagline: string;
  logo: string | null;
  logoHeight?: number;
  logoWidth?: number;
  headerLogo?: string | null;
  headerLogoHeight?: number;
  headerLogoBackground?: string;
  primaryCtaText?: string;
  contactEmail: string;
  colors: TemplateColors;
  fontPairing: FontPairing;
  navCta?: string;
  // Nav link labels are per-section (`navLabel`), not on siteConfig — single
  // source of truth. Nav anchors live in code (lib/navSections.ts).
  features?: SiteFeatures;
}

export interface HeroSection {
  _type: 'heroSection';
  variant?: string;
  headline: string;
  headlineAccent?: string;
  subheadline: string;
  ctaText: string;
  ctaNote?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
  logoChipEnabled?: boolean;
  logoChipColor?: string;
  logoChipPadding?: number;
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

export type ContentItem =
  | { _type: 'subheading'; _key?: string; text: string }
  | { _type: 'paragraph'; _key?: string; text: string }
  | { _type: 'bullets'; _key?: string; listTitle?: string; items?: { point: string }[] }
  | { _type: 'image'; _key?: string; url?: string; alt?: string; caption?: string }
  | { _type: 'cta'; _key?: string; ctaText?: string };

export interface ContentBlock {
  _type: 'contentBlock';
  variant?: string;
  heading?: string;
  content?: ContentItem[];
  navLabel?: string;
}

export interface TrustBar {
  _type: 'trustBar';
  variant?: string;
  items: string[];
  subline?: string;
}

export interface ImpactNumbers {
  _type: 'impactNumbers';
  variant?: string;
  stats: { value: string; label: string }[];
}

export interface ServiceBlock {
  _type: 'serviceBlock';
  variant?: string;
  navLabel?: string;
  heading: string;
  body: string;
  listTitle?: string;
  bullets: { point: string }[];
  summary?: string;
}

export interface HowItWorks {
  _type: 'howItWorks';
  variant?: string;
  navLabel?: string;
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
  navLabel?: string;
  heading: string;
  states: string[];
}

export interface AboutSection {
  _type: 'aboutSection';
  variant?: string;
  navLabel?: string;
  heading: string;
  body: string;
}

export interface FaqSection {
  _type: 'faqSection';
  variant?: string;
  navLabel?: string;
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
  navLabel?: string;
  heading: string;
  subheading: string;
  submitText: string;
  successMessage: string;
  footerNote?: string;
  fields: FormField[];
  formSettings?: {
    replyToEmail?: string;
    fromName?: string;
    fromEmail?: string;
    // Multi-select lead-delivery channels. `string` is tolerated for legacy
    // content that stored the old '+'-joined value (e.g. 'email+sheets').
    formAction?: ('email' | 'sheets' | 'crm-lite' | 'ghl')[] | string;
    googleWebhookUrl?: string;
    ghlApiKey?: string;
    ghlPipelineId?: string;
    ghlStageId?: string;
  };
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

export interface ChatWidget {
  _type: 'chatWidget';
  enabled?: boolean;
  mode?: 'tree' | 'ai';
  brandName?: string;
  ownerName?: string;
  assistantName?: string;
  statusText?: string;
  avatarInitials?: string;
  nudgeMessage?: string;
  welcomeMessage?: string;
  captureEmail?: boolean;
  ctaPhone?: string;
  ctaFormHref?: string;
  treeId?: string;
  treeJson?: string;
  knowledge?: string;
  // Phase 2 (Meta) — present but unused by the widget
  facebookEnabled?: boolean;
  whatsappEnabled?: boolean;
  whatsappNumber?: string;
}

export interface TeamMember {
  name: string;
  title: string;
  photo?: string | null;
  bio: string;
  bilingualNote?: string;
  phone?: string;
  email?: string;
}

export interface TeamSection {
  _type: 'teamSection';
  variant?: 'team-single' | 'team-grid' | 'team-feature';
  heading: string;
  subheading?: string;
  members: TeamMember[];
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
  | CtaSection
  | ChatWidget
  | TeamSection
  | ContentBlock
  | TrustBar;

export interface SiteContent {
  siteConfig: SiteConfig;
  sections: Section[];
}
