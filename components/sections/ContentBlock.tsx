'use client';

import { ContentBlock as ContentBlockData, ContentItem } from '@/types/content';
import { Reveal } from '@/components/motion/Reveal';

function scrollToContact() {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
}

function renderItem(item: ContentItem, i: number, primaryCtaText?: string) {
  const key = item._key ?? i;
  switch (item._type) {
    case 'subheading':
      return item.text ? (
        <h3
          key={key}
          className="mt-8 mb-3 text-xl sm:text-2xl font-semibold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          {item.text}
        </h3>
      ) : null;

    case 'paragraph':
      return item.text ? (
        <p
          key={key}
          className="mb-6 text-base sm:text-lg leading-relaxed opacity-80 whitespace-pre-line"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {item.text}
        </p>
      ) : null;

    case 'bullets':
      if (!item.items?.length) return null;
      return (
        <div key={key} className="mb-6">
          {item.listTitle && (
            <p
              className="font-semibold mb-3"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-accent)' }}
            >
              {item.listTitle}
            </p>
          )}
          <ul className="space-y-4">
            {item.items.map((b, j) => (
              <li
                key={j}
                className="flex items-start gap-3 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
              >
                <span className="mt-1 flex-shrink-0 text-xs" style={{ color: 'var(--color-accent)' }}>◆</span>
                <span className="opacity-90">{b.point}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'image':
      if (!item.url) return null;
      return (
        <figure key={key} className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.url} alt={item.alt ?? ''} className="w-full h-auto rounded-md" />
          {item.caption && (
            <figcaption
              className="mt-2 text-sm opacity-70 text-center"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {item.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'cta': {
      const text = item.ctaText || primaryCtaText;
      if (!text) return null;
      return (
        <button
          key={key}
          onClick={scrollToContact}
          className="mt-4 mb-2 px-8 py-4 text-lg font-bold rounded-md transition-opacity hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-primary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {text}
        </button>
      );
    }

    default:
      return null;
  }
}

export default function ContentBlock({
  data,
  primaryCtaText,
}: {
  data: ContentBlockData;
  primaryCtaText?: string;
}) {
  return (
    <section className="py-16 md:py-24 px-6" style={{ color: 'var(--color-text)' }}>
      <Reveal className="max-w-3xl mx-auto">
        {data.heading && (
          <>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
            >
              {data.heading}
            </h2>
            <div className="mt-3 mb-8 w-12 h-[3px]" style={{ backgroundColor: 'var(--color-accent)' }} />
          </>
        )}
        {(data.content ?? []).map((item, i) => renderItem(item, i, primaryCtaText))}
      </Reveal>
    </section>
  );
}
