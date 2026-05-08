'use client';

import { motion } from 'framer-motion';
import { HeroSection } from '@/types/content';

export default function Hero({ data }: { data: HeroSection }) {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-24"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-3xl mx-auto"
      >
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          {data.headline}
        </h1>
        <p
          className="text-lg sm:text-xl mb-10 opacity-80 max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {data.subheadline}
        </p>
        <button
          onClick={scrollToContact}
          className="px-8 py-4 text-lg font-semibold rounded-md transition-opacity hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-bg)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {data.ctaText}
        </button>
      </motion.div>
    </section>
  );
}
