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

  // The `#process` nav anchor. The real <section> is rendered by the steps
  // child; those components are shared with the standalone `stepsSection` type,
  // so the id lives on this wrapper rather than inside them (avoids a duplicate
  // #process anchor when a page uses both). scroll-mt clears the fixed nav.
  return (
    <div id="process" className="scroll-mt-20">
      {data.variant === 'steps-timeline' ? (
        <StepsTimeline data={stepsData} />
      ) : (
        <StepsNumbered data={stepsData} />
      )}
    </div>
  );
}
