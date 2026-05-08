'use client';

import { motion } from 'framer-motion';
import { HeroSection } from '@/types/content';

interface HeroProps {
  data: HeroSection;
  logo?: string | null;
  companyName?: string;
}

export default function Hero({ data, logo, companyName }: HeroProps) {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-3xl mx-auto flex flex-col items-center"
      >
        {logo ? (
          <div className="mb-8" style={{ backgroundColor: 'transparent' }}>
            <img
              src={logo}
              alt={companyName ?? ''}
              className="w-auto object-contain"
              style={{ maxHeight: '80px', mixBlendMode: 'multiply' }}
            />
          </div>
        ) : companyName ? (
          <span
            className="text-2xl font-bold mb-8"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-bg)' }}
          >
            {companyName}
          </span>
        ) : null}

        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-bg)' }}
        >
          {data.headline}
        </h1>
        <p
          className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-bg)', opacity: 0.85 }}
        >
          {data.subheadline}
        </p>
        <button
          onClick={scrollToContact}
          className="px-8 py-4 text-lg font-bold rounded-md transition-opacity hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-primary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {data.ctaText}
        </button>
        {data.ctaNote && (
          <p
            className="mt-3 text-sm italic"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-bg)', opacity: 0.6 }}
          >
            {data.ctaNote}
          </p>
        )}
      </motion.div>
      <div
        className="absolute bottom-0 inset-x-0 h-[2px]"
        style={{ backgroundColor: 'var(--color-accent)' }}
      />
    </section>
  );
}
