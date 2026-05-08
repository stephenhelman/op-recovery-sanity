import { Section } from '@/types/content';
import Problem from './Problem';
import ImpactNumbers from './ImpactNumbers';
import HowItWorks from './HowItWorks';
import WhyChooseUs from './WhyChooseUs';
import StatesServed from './StatesServed';
import About from './About';
import FAQ from './FAQ';
import ContactForm from './ContactForm';
import Disclaimer from './Disclaimer';

export default function SectionRenderer({ section, altBg }: { section: Section; altBg?: boolean }) {
  const isFixed = section._type === 'heroSection' || section._type === 'impactNumbers';

  const rendered = (() => {
    switch (section._type) {
      case 'problemSection':
        return <Problem data={section} />;
      case 'impactNumbers':
        return <ImpactNumbers data={section} />;
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
  })();

  if (!rendered) return null;

  // Hero and ImpactNumbers manage their own backgrounds
  if (isFixed) return rendered;

  const showDivider = section._type !== 'disclaimerSection';

  return (
    <>
      <div className={altBg ? 'bg-black/[0.03]' : ''}>{rendered}</div>
      {showDivider && (
        <div className="mx-8 h-px" style={{ backgroundColor: 'var(--color-accent)', opacity: 0.12 }} />
      )}
    </>
  );
}
