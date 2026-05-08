import { AboutSection } from '@/types/content';

export default function About({ data }: { data: AboutSection }) {
  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{ color: 'var(--color-text)' }}
    >
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
