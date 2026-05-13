import { HowItWorks } from '@/types/content';
import { StepsSection } from '@/types/content';
import StepsNumbered from './steps/StepsNumbered';
import StepsTimeline from './steps/StepsTimeline';

function howItWorksToSteps(data: HowItWorks): StepsSection {
  return {
    _type: 'stepsSection',
    _key: 'howitworks',
    variant: data.variant === 'steps-timeline' ? 'steps-timeline' : 'steps-numbered',
    headline: data.heading,
    steps: data.steps.map((s, i) => ({
      stepNumber: `Step ${i + 1}`,
      title: s.title,
      description: s.description,
    })),
  };
}

export default function HowItWorksSection({ data }: { data: HowItWorks }) {
  const stepsData = howItWorksToSteps(data);

  if (data.variant === 'steps-timeline') {
    return <StepsTimeline data={stepsData} />;
  }
  return <StepsNumbered data={stepsData} />;
}
