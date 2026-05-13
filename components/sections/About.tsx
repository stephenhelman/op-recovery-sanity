import { AboutSection } from '@/types/content';

function AboutCentered({ data }: { data: AboutSection }) {
  return (
    <section className="py-16 md:py-24 px-6" style={{ color: 'var(--color-text)' }}>
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="text-3xl sm:text-4xl font-bold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          {data.heading}
        </h2>
        <div className="mt-3 mb-8 w-12 h-[3px] mx-auto" style={{ backgroundColor: 'var(--color-accent)' }} />
        <p
          className="text-base sm:text-lg leading-relaxed opacity-80"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {data.body}
        </p>
      </div>
    </section>
  );
}

function AboutSplit({ data }: { data: AboutSection }) {
  return (
    <section className="py-16 md:py-24 px-6" style={{ color: 'var(--color-text)' }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left — heading and body */}
        <div>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
          >
            {data.heading}
          </h2>
          <div className="mt-3 mb-6 w-12 h-[3px]" style={{ backgroundColor: 'var(--color-accent)' }} />
          <p
            className="text-base sm:text-lg leading-relaxed opacity-80"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {data.body}
          </p>
        </div>

        {/* Right — accent stat block */}
        <div
          className="flex flex-col items-center justify-center rounded-lg p-8 text-center"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <span
            className="text-5xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}
          >
            100%
          </span>
          <span
            className="text-base"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-bg)', opacity: 0.85 }}
          >
            Contingency — No Upfront Cost
          </span>
        </div>
      </div>
    </section>
  );
}

export default function About({ data }: { data: AboutSection }) {
  if (data.variant === 'about-split') return <AboutSplit data={data} />;
  return <AboutCentered data={data} />;
}
