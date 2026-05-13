import { WhyChooseUs } from '@/types/content';

function ListBullets({ data }: { data: WhyChooseUs }) {
  return (
    <section className="py-16 md:py-24 px-6" style={{ color: 'var(--color-text)' }}>
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          {data.heading}
        </h2>
        <div className="mt-3 mb-10 w-12 h-[3px] mx-auto" style={{ backgroundColor: 'var(--color-accent)' }} />
        {data.listTitle && (
          <p
            className="font-semibold mb-4"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-accent)' }}
          >
            {data.listTitle}
          </p>
        )}
        <ul className="space-y-5">
          {data.bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-4 leading-relaxed"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
            >
              <span className="mt-1 flex-shrink-0 text-xs" style={{ color: 'var(--color-accent)' }}>◆</span>
              <span className="opacity-90">{b.point}</span>
            </li>
          ))}
        </ul>
        {data.summary && data.summary.length > 0 && (
          <div className="mt-6 space-y-3">
            {data.summary.map((block, i) => (
              <p
                key={i}
                className="text-base leading-relaxed opacity-80"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
              >
                {block.paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ListChecks({ data }: { data: WhyChooseUs }) {
  return (
    <section className="py-16 md:py-24 px-6" style={{ color: 'var(--color-text)' }}>
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          {data.heading}
        </h2>
        <div className="mt-3 mb-10 w-12 h-[3px] mx-auto" style={{ backgroundColor: 'var(--color-accent)' }} />
        {data.listTitle && (
          <p
            className="font-semibold mb-4"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-accent)' }}
          >
            {data.listTitle}
          </p>
        )}
        <ul className="space-y-5">
          {data.bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-4 leading-relaxed"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
            >
              <svg
                className="mt-1 w-5 h-5 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="none"
                style={{ color: 'var(--color-accent)' }}
              >
                <path
                  d="M4 10l4 4 8-8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="opacity-90">{b.point}</span>
            </li>
          ))}
        </ul>
        {data.summary && data.summary.length > 0 && (
          <div className="mt-6 space-y-3">
            {data.summary.map((block, i) => (
              <p
                key={i}
                className="text-base leading-relaxed opacity-80"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
              >
                {block.paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ListCards({ data }: { data: WhyChooseUs }) {
  return (
    <section className="py-16 md:py-24 px-6" style={{ color: 'var(--color-text)' }}>
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          {data.heading}
        </h2>
        <div className="mt-3 mb-10 w-12 h-[3px] mx-auto" style={{ backgroundColor: 'var(--color-accent)' }} />
        <div className="space-y-4">
          {data.bullets.map((b, i) => (
            <div
              key={i}
              className="px-5 py-4 rounded-md"
              style={{
                borderLeft: '4px solid var(--color-accent)',
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text)',
                backgroundColor: 'var(--color-primary)',
                opacity: 1,
              }}
            >
              <span className="text-sm" style={{ color: 'var(--color-bg)', opacity: 0.9 }}>{b.point}</span>
            </div>
          ))}
        </div>
        {data.summary && data.summary.length > 0 && (
          <div className="mt-6 space-y-3">
            {data.summary.map((block, i) => (
              <p
                key={i}
                className="text-base leading-relaxed opacity-80"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
              >
                {block.paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function WhyChooseUsSection({ data }: { data: WhyChooseUs }) {
  if (data.variant === 'list-checks') return <ListChecks data={data} />;
  if (data.variant === 'list-cards') return <ListCards data={data} />;
  return <ListBullets data={data} />;
}
