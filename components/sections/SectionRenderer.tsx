import { Section } from '@/types/content';
import Hero from './Hero';
import Problem from './Problem';
import ImpactNumbers from './ImpactNumbers';
import ServiceBlockSection from './ServiceBlock';
import HowItWorks from './HowItWorks';
import WhyChooseUs from './WhyChooseUs';
import StatesServed from './StatesServed';
import About from './About';
import FAQ from './FAQ';
import ContactForm from './ContactForm';
import Disclaimer from './Disclaimer';

export default function SectionRenderer({ section }: { section: Section }) {
  switch (section._type) {
    case 'heroSection':
      return <Hero data={section} />;
    case 'problemSection':
      return <Problem data={section} />;
    case 'impactNumbers':
      return <ImpactNumbers data={section} />;
    case 'serviceBlock':
      return <ServiceBlockSection data={section} />;
    case 'howItWorks':
      return <HowItWorks data={section} />;
    case 'whyChooseUs':
      return <WhyChooseUs data={section} />;
    case 'statesServed':
      return <StatesServed data={section} />;
    case 'aboutSection':
      return <About data={section} />;
    case 'faqSection':
      return <FAQ data={section} />;
    case 'contactForm':
      return <ContactForm data={section} />;
    case 'disclaimerSection':
      return <Disclaimer data={section} />;
    default:
      return null;
  }
}
