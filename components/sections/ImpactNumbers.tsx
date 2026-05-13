'use client';

import { motion } from 'framer-motion';
import { ImpactNumbers } from '@/types/content';

function StatTileDark({ value, label, index }: { value: string; label: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center text-center p-6"
    >
      <span
        className="text-4xl sm:text-5xl font-bold mb-2"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}
      >
        {value}
      </span>
      <span
        className="text-sm sm:text-base"
        style={{ fontFamily: 'var(--font-body)', color: 'var(--color-bg)', opacity: 0.85 }}
      >
        {label}
      </span>
    </motion.div>
  );
}

function StatTileLight({ value, label, index }: { value: string; label: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center text-center p-6"
    >
      <span
        className="text-4xl sm:text-5xl font-bold mb-2"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
      >
        {value}
      </span>
      <span
        className="text-sm sm:text-base"
        style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', opacity: 0.75 }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export default function ImpactNumbersSection({ data }: { data: ImpactNumbers }) {
  const isLight = data.variant === 'numbers-light';

  return (
    <section
      className="py-16 px-6"
      style={{ backgroundColor: isLight ? 'var(--color-bg)' : 'var(--color-primary)' }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
        {data.stats.map((stat, i) =>
          isLight ? (
            <StatTileLight key={i} index={i} value={stat.value} label={stat.label} />
          ) : (
            <StatTileDark key={i} index={i} value={stat.value} label={stat.label} />
          )
        )}
      </div>
    </section>
  );
}
