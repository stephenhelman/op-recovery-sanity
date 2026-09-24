'use client';

import { ContentBlock as ContentBlockData } from '@/types/content';
import { Reveal } from '@/components/motion/Reveal';

function scrollToContact() {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
}

export default function ContentBlock({
  data,
  primaryCtaText,
}: {
  data: ContentBlockData;
  primaryCtaText?: string;
}) {
  const ctaText = data.ctaText || primaryCtaText;
  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{ color: 'var(--color-text)' }}
    >
      <Reveal className="max-w-3xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          {data.heading}
        </h2>
        <div className="mt-3 mb-8 w-12 h-[3px]" style={{ backgroundColor: 'var(--color-accent)' }} />
        {data.body && (
          <p
            className="text-base sm:text-lg leading-relaxed mb-8 opacity-80 whitespace-pre-line"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {data.body}
          </p>
        )}
        {data.bullets && data.bullets.length > 0 && (
          <>
            {data.listTitle && (
              <p
                className="font-semibold mb-3"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-accent)' }}
              >
                {data.listTitle}
              </p>
            )}
            <ul className="space-y-4">
              {data.bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
                >
                  <span className="mt-1 flex-shrink-0 text-xs" style={{ color: 'var(--color-accent)' }}>◆</span>
                  <span className="opacity-90">{b.point}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        {data.summary && (
          <p
            className="mt-6 text-base leading-relaxed opacity-80 whitespace-pre-line"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
          >
            {data.summary}
          </p>
        )}
        {ctaText && (
          <button
            onClick={scrollToContact}
            className="mt-8 px-8 py-4 text-lg font-bold rounded-md transition-opacity hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {ctaText}
          </button>
        )}
      </Reveal>
    </section>
  );
}
