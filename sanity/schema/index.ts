import siteConfig from './siteConfig';
import hero from './sections/hero';
import problem from './sections/problem';
import impactNumbers from './sections/impactNumbers';
import serviceBlock from './sections/serviceBlock';
import howItWorks from './sections/howItWorks';
import whyChooseUs from './sections/whyChooseUs';
import statesServed from './sections/statesServed';
import about from './sections/about';
import faq from './sections/faq';
import contactForm, { textField, emailField, phoneField, dropdownField, textareaField } from './sections/contactForm';
import disclaimer from './sections/disclaimer';

export const schemaTypes = [
  siteConfig,
  hero,
  problem,
  impactNumbers,
  serviceBlock,
  howItWorks,
  whyChooseUs,
  statesServed,
  about,
  faq,
  contactForm,
  textField,
  emailField,
  phoneField,
  dropdownField,
  textareaField,
  disclaimer,
];
