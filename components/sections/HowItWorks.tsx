import { HowItWorks } from '@/types/content';

export default function HowItWorksSection({ data }: { data: HowItWorks }) {
  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center mb-12"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          {data.heading}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.steps.map((step, i) => (
            <div key={i} className="flex flex-col items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)', fontFamily: 'var(--font-heading)' }}
              >
                {i + 1}
              </div>
              <h3 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
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
