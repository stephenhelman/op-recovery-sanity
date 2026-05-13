'use client';

import { CtaSection } from '@/types/content';

export default function CtaButton({ data }: { data: CtaSection }) {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="py-12 px-6 text-center"
      style={{ backgroundColor: 'var(--color-accent)' }}
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
        {data.headline && (
          <h2
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
          >
            {data.headline}
          </h2>
        )}
        <button
          onClick={scrollToContact}
          className="px-10 py-4 text-lg font-bold rounded-md transition-opacity hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-bg)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {data.ctaText || 'Get Started'}
        </button>
      </div>
    </section>
  );
}
