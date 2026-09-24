'use client';

import { TrustBar as TrustBarData } from '@/types/content';
import { Reveal } from '@/components/motion/Reveal';

export default function TrustBar({ data }: { data: TrustBarData }) {
  const items = (data.items ?? []).filter(Boolean);
  if (items.length === 0 && !data.subline) return null;

  return (
    <section className="py-8 md:py-10 px-6" style={{ backgroundColor: 'var(--color-primary)' }}>
      <Reveal className="max-w-5xl mx-auto text-center">
        {items.length > 0 && (
          <ul className="flex flex-wrap items-center justify-center gap-y-2">
            {items.map((item, i) => (
              <li
                key={i}
                className={`px-4 sm:px-6 text-sm sm:text-base font-semibold tracking-wide ${
                  i > 0 ? 'sm:border-l' : ''
                }`}
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-bg)',
                  borderColor: 'color-mix(in srgb, var(--color-bg) 30%, transparent)',
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
        {data.subline && (
          <p
            className="mt-4 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-accent)' }}
          >
            {data.subline}
          </p>
        )}
      </Reveal>
    </section>
  );
}
