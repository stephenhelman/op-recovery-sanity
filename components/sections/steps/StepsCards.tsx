'use client';

import { motion } from 'framer-motion';
import { StepsSection } from '@/types/content';

export default function StepsCards({ data }: { data: StepsSection }) {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 md:py-24 px-6" style={{ color: 'var(--color-text)' }}>
      <div className="max-w-5xl mx-auto">
        {(data.headline || data.headlineAccent) && (
          <h2
            className="text-3xl sm:text-4xl font-bold text-center mb-3"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
          >
            {data.headline}{' '}
            {data.headlineAccent && (
              <span style={{ color: 'var(--color-accent)' }}>{data.headlineAccent}</span>
            )}
          </h2>
        )}
        {(data.headline || data.headlineAccent) && (
          <div className="mb-12 w-12 h-[3px] mx-auto" style={{ backgroundColor: 'var(--color-accent)' }} />
        )}

        <div
          className={
            data.steps.length === 3
              ? 'grid grid-cols-1 sm:grid-cols-3 gap-8'
              : 'grid grid-cols-1 sm:grid-cols-2 gap-8'
          }
        >
          {data.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col gap-3 rounded-lg p-6"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <span
                className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {i + 1}
              </span>
              <div className="mt-10">
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-bg)' }}
                >
                  {step.title}
                </h3>
                <p
                  className="leading-relaxed opacity-85 text-sm"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--color-bg)' }}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {data.ctaType === 'phone' && data.ctaPhone && (
          <div className="mt-10 text-center">
            <a
              href={`tel:${data.ctaPhone}`}
              className="text-2xl font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}
            >
              {data.ctaPhone}
            </a>
          </div>
        )}
        {data.ctaType === 'button' && data.ctaText && (
          <div className="mt-10 text-center">
            <button
              onClick={scrollToContact}
              className="px-8 py-4 text-lg font-bold rounded-md transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {data.ctaText}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
