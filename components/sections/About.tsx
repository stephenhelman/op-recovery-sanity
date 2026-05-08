import { AboutSection } from '@/types/content';

export default function About({ data }: { data: AboutSection }) {
  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="text-3xl sm:text-4xl font-bold mb-6"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          {data.heading}
        </h2>
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
