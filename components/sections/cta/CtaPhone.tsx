import { CtaSection } from '@/types/content';

export default function CtaPhone({ data }: { data: CtaSection }) {
  return (
    <section
      className="py-10 px-6"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-center sm:text-left">
        {data.headline && (
          <p
            className="text-lg font-semibold"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-bg)' }}
          >
            {data.headline}
          </p>
        )}
        {data.subheadline && (
          <p
            className="text-base"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-bg)', opacity: 0.8 }}
          >
            {data.subheadline}
          </p>
        )}
        {data.ctaPhone && (
          <a
            href={`tel:${data.ctaPhone}`}
            className="text-3xl font-bold tracking-wide"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)', textDecoration: 'none' }}
          >
            {data.ctaPhone}
          </a>
        )}
        {data.ctaText && (
          <p
            className="text-sm"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-bg)' }}
          >
            {data.ctaText}
          </p>
        )}
      </div>
    </section>
  );
}
