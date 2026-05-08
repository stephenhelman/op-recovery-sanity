import { WhyChooseUs } from '@/types/content';

export default function WhyChooseUsSection({ data }: { data: WhyChooseUs }) {
  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{ color: 'var(--color-text)' }}
    >
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
