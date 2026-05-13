'use client';

import { StepsSection } from '@/types/content';

export default function StepsCircles({ data }: { data: StepsSection }) {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 md:py-24 px-6" style={{ color: 'var(--color-text)' }}>
      <div className="max-w-5xl mx-auto">
        {(data.headline || data.headlineAccent) && (
          <h2
            className="text-3xl sm:text-4xl font-bold text-center mb-3"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
          >
            {data.headline && (
              <span>{data.headline}{' '}</span>
            )}
            {data.headlineAccent && (
              <span style={{ color: 'var(--color-accent)' }}>{data.headlineAccent}</span>
            )}
          </h2>
        )}
        {(data.headline || data.headlineAccent) && (
          <div className="mb-12 w-12 h-[3px] mx-auto" style={{ backgroundColor: 'var(--color-accent)' }} />
        )}

        <div className="relative flex flex-col sm:flex-row items-start justify-between gap-8">
          {/* Connecting line on desktop */}
          <div
            className="hidden sm:block absolute top-8 left-0 right-0 h-px"
            style={{ backgroundColor: 'var(--color-accent)', opacity: 0.2 }}
          />

          {data.steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center flex-1 gap-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 z-10"
                style={{
                  border: '2px solid var(--color-primary)',
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {i + 1}
              </div>
              <h3
                className="text-lg font-semibold"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed opacity-75"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {data.ctaType === 'phone' && data.ctaPhone && (
          <div className="mt-10 text-center">
            <a
              href={`tel:${data.ctaPhone}`}
              className="text-2xl font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}
            >
              {data.ctaPhone}
            </a>
          </div>
        )}
        {data.ctaType === 'button' && (
          <div className="mt-10 text-center">
            <button
              onClick={scrollToContact}
              className="px-8 py-4 text-lg font-bold rounded-md transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {data.ctaText || 'Get Started'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
