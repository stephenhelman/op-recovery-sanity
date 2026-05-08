import { WhyChooseUs } from '@/types/content';

export default function WhyChooseUsSection({ data }: { data: WhyChooseUs }) {
  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold mb-10 text-center"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          {data.heading}
        </h2>
        <ul className="space-y-5">
          {data.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-4" style={{ fontFamily: 'var(--font-body)' }}>
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                viewBox="0 0 20 20"
                fill="none"
                style={{ color: 'var(--color-primary)' }}
              >
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="opacity-90 leading-relaxed">{b.point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
