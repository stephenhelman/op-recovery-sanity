'use client';

import { CtaSection } from '@/types/content';

export default function CtaBanner({ data }: { data: CtaSection }) {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="py-16 px-6 text-center"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
        {data.headline && (
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-bg)' }}
          >
            {data.headline}
          </h2>
        )}
        {data.subheadline && (
          <p
            className="text-lg"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-bg)', opacity: 0.8 }}
          >
            {data.subheadline}
          </p>
        )}
        <button
          onClick={scrollToContact}
          className="mt-4 px-10 py-4 text-lg font-bold rounded-md transition-opacity hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-primary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {data.ctaText || 'Get Started'}
        </button>
      </div>
    </section>
  );
}
