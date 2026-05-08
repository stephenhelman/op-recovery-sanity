import { StatesServed } from '@/types/content';

export default function StatesServedSection({ data }: { data: StatesServed }) {
  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center mb-10"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          {data.heading}
        </h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {data.states.map((state, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                border: '1px solid var(--color-primary)',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {state}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
