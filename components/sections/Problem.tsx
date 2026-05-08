import { ProblemSection } from '@/types/content';

export default function Problem({ data }: { data: ProblemSection }) {
  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold mb-6"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          {data.heading}
        </h2>
        {data.body && (
          <p
            className="text-base sm:text-lg leading-relaxed mb-8 opacity-80"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {data.body}
          </p>
        )}
        {data.bullets?.length > 0 && (
          <ul className="space-y-3">
            {data.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3" style={{ fontFamily: 'var(--font-body)' }}>
                <span className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }} />
                <span className="opacity-90">{b.point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
