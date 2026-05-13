import { Section } from '@/types/content';
import { defaultVariants } from '@/lib/variants';
import Hero from './Hero';
import Problem from './Problem';
import ImpactNumbers from './ImpactNumbers';
import HowItWorks from './HowItWorks';
import WhyChooseUs from './WhyChooseUs';
import StatesServed from './StatesServed';
import About from './About';
import FAQ from './FAQ';
import ContactForm from './ContactForm';
import Disclaimer from './Disclaimer';
import StepsCards from './steps/StepsCards';
import StepsCircles from './steps/StepsCircles';
import StepsNumbered from './steps/StepsNumbered';
import StepsTimeline from './steps/StepsTimeline';
import CtaPhone from './cta/CtaPhone';
import CtaButton from './cta/CtaButton';
import CtaBanner from './cta/CtaBanner';

function resolveVariant(section: Section): string {
  return (section as { variant?: string }).variant ?? defaultVariants[section._type] ?? '';
}

export default function SectionRenderer({
  section,
  altBg,
  logo,
  companyName,
}: {
  section: Section;
  altBg?: boolean;
  logo?: string | null;
  companyName?: string;
}) {
  const isFixed =
    section._type === 'heroSection' ||
    section._type === 'impactNumbers' ||
    section._type === 'ctaSection';

  const rendered = (() => {
    switch (section._type) {
      case 'heroSection':
        return <Hero data={section} logo={logo} companyName={companyName} />;

      case 'problemSection':
        return <Problem data={section} />;

      case 'impactNumbers':
        return <ImpactNumbers data={section} />;

      case 'howItWorks': {
        return <HowItWorks data={section} />;
      }

      case 'serviceBlock':
        return null; // handled by page-level grouping

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

      case 'stepsSection': {
        const v = resolveVariant(section);
        switch (v) {
          case 'steps-circles':  return <StepsCircles data={section} />;
          case 'steps-numbered': return <StepsNumbered data={section} />;
          case 'steps-timeline': return <StepsTimeline data={section} />;
          default:               return <StepsCards data={section} />;
        }
      }

      case 'ctaSection': {
        const v = resolveVariant(section);
        switch (v) {
          case 'cta-button': return <CtaButton data={section} />;
          case 'cta-banner': return <CtaBanner data={section} />;
          default:           return <CtaPhone data={section} />;
        }
      }

      default:
        return null;
    }
  })();

  if (!rendered) return null;

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
