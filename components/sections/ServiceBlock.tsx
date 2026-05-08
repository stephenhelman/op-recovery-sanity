import { ServiceBlock } from '@/types/content';

export default function ServiceBlockSection({ data }: { data: ServiceBlock }) {
  return (
    <div
      className="p-8 rounded-lg"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-primary)' }}
    >
      <h3
        className="text-2xl font-bold mb-4"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
      >
        {data.heading}
      </h3>
      {data.body && (
        <p className="mb-5 opacity-80 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
          {data.body}
        </p>
      )}
      {data.bullets?.length > 0 && (
        <ul className="space-y-2">
          {data.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3" style={{ fontFamily: 'var(--font-body)' }}>
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }} />
              <span className="opacity-90">{b.point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ServiceBlocksWrapper({ blocks }: { blocks: ServiceBlock[] }) {
  return (
    <section className="py-20 px-6" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {blocks.map((block, i) => (
          <ServiceBlockSection key={i} data={block} />
        ))}
      </div>
    </section>
  );
}
