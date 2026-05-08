'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ImpactNumbers } from '@/types/content';

function StatTile({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center p-6"
    >
      <span
        className="text-4xl sm:text-5xl font-bold mb-2"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
      >
        {value}
      </span>
      <span
        className="text-sm sm:text-base opacity-70"
        style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export default function ImpactNumbersSection({ data }: { data: ImpactNumbers }) {
  return (
    <section
      className="py-16 px-6"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-b"
        style={{ borderColor: 'var(--color-primary)', opacity: 1 }}
      >
        {data.stats.map((stat, i) => (
          <StatTile key={i} value={stat.value} label={stat.label} />
        ))}
      </div>
    </section>
  );
}
