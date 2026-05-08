import { StatesServed } from '@/types/content';
import { ALL_STATES } from '@/lib/statesData';

export default function StatesServedSection({ data }: { data: StatesServed }) {
  const states = data.states?.length ? data.states : ALL_STATES;
  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{ color: 'var(--color-text)' }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          {data.heading}
        </h2>
        <div className="mt-3 mb-10 w-12 h-[3px] mx-auto" style={{ backgroundColor: 'var(--color-accent)' }} />
        <div className="flex flex-wrap gap-2 justify-center">
          {states.map((state, i) => (
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
