import { HowItWorks } from '@/types/content';

export default function HowItWorksSection({ data }: { data: HowItWorks }) {
  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{ color: 'var(--color-text)' }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          {data.heading}
        </h2>
        <div className="mt-3 mb-12 w-12 h-[3px] mx-auto" style={{ backgroundColor: 'var(--color-accent)' }} />
        <div className={
          data.steps.length === 3
            ? 'grid grid-cols-1 sm:grid-cols-3 gap-8'
            : 'grid grid-cols-1 sm:grid-cols-2 gap-8'
        }>
          {data.steps.map((step, i) => (
            <div key={i} className="flex flex-col items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {i + 1}
              </div>
              <h3
                className="text-xl font-semibold"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
              >
                {step.title}
              </h3>
              <p className="opacity-75 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
