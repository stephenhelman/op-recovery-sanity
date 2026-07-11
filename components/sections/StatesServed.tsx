import { StatesServed } from '@/types/content';
import { ALL_STATES } from '@/lib/statesData';
import { slugify } from '@/lib/statesGeo';
import { Reveal } from '@/components/motion/Reveal';

export default function StatesServedSection({
  data,
  stateKnowledgeBase = false,
}: {
  data: StatesServed;
  stateKnowledgeBase?: boolean;
}) {
  const states = data.states?.length ? data.states : ALL_STATES;

  return (
    <section
      id="states"
      className="py-16 md:py-24 px-6 scroll-mt-20"
      style={{ color: 'var(--color-text)' }}
    >
      <Reveal className="max-w-5xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          {data.heading}
        </h2>
        <div className="mt-3 w-12 h-[3px] mx-auto" style={{ backgroundColor: 'var(--color-accent)' }} />

        {stateKnowledgeBase ? (
          <>
            {/* Knowledge base ON: a selectable grid. Each state links to the
                /states page with itself preloaded (map highlighted + modal open). */}
            <p
              className="mt-4 mb-10 text-center text-base opacity-70"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Select your state to see filing deadlines and recovery details.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {states.map((state, i) => (
                <a
                  key={i}
                  href={`/states?state=${slugify(state)}`}
                  className="group px-3 py-3 rounded-md text-sm font-medium text-center transition-colors"
                  style={{
                    border: '1px solid var(--color-primary)',
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <span className="group-hover:opacity-70 transition-opacity">{state} →</span>
                </a>
              ))}
            </div>
          </>
        ) : (
          // Knowledge base OFF (default): non-selectable pills.
          <div className="mt-10 flex flex-wrap gap-2 justify-center">
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
        )}
      </Reveal>
    </section>
  );
}
