import { ServiceBlock } from '@/types/content';

export default function ServiceBlockSection({ data }: { data: ServiceBlock }) {
  return (
    <div
      className="p-8 rounded-lg shadow-sm"
      style={{
        color: 'var(--color-text)',
        borderLeft: '3px solid var(--color-accent)',
      }}
    >
      <h3
        className="text-2xl font-bold mb-4"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
      >
        {data.heading}
      </h3>
      <div className="mb-6 w-10 h-[3px]" style={{ backgroundColor: 'var(--color-accent)' }} />
      {data.body && (
        <p className="mb-6 opacity-80 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
          {data.body}
        </p>
      )}
      {data.bullets?.length > 0 && (
        <>
          {data.listTitle && (
            <p
              className="font-semibold mb-3"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-accent)' }}
            >
              {data.listTitle}
            </p>
          )}
          <ul className="space-y-4">
            {data.bullets.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-3 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
              >
                <span className="mt-1 flex-shrink-0 text-xs" style={{ color: 'var(--color-accent)' }}>◆</span>
                <span className="opacity-90">{b.point}</span>
              </li>
            ))}
          </ul>
          {data.summary && (
            <p
              className="mt-4 text-sm leading-relaxed opacity-75"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
            >
              {data.summary}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export function ServiceBlocksWrapper({ blocks }: { blocks: ServiceBlock[] }) {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {blocks.map((block, i) => (
          <ServiceBlockSection key={i} data={block} />
        ))}
      </div>
    </section>
  );
}
