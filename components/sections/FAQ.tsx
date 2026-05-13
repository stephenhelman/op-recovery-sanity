'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaqSection } from '@/types/content';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b transition-[border-left-color] duration-200"
      style={{
        borderBottomColor: 'var(--color-primary)',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderLeft: open ? '3px solid var(--color-accent)' : '3px solid transparent',
        paddingLeft: '1rem',
      }}
    >
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span
          className="font-semibold text-base sm:text-lg"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
        >
          {question}
        </span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="w-5 h-5 flex-shrink-0"
          viewBox="0 0 20 20"
          fill="none"
          style={{ color: 'var(--color-accent)' }}
        >
          <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p
              className="pb-5 opacity-75 leading-relaxed"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FaqAccordion({ data }: { data: FaqSection }) {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          Frequently Asked Questions
        </h2>
        <div className="mt-3 mb-10 w-12 h-[3px] mx-auto" style={{ backgroundColor: 'var(--color-accent)' }} />
        <div className="border-t" style={{ borderColor: 'var(--color-primary)', opacity: 0.3 }}>
          {data.items.map((item, i) => (
            <FAQItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqGrid({ data }: { data: FaqSection }) {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          Frequently Asked Questions
        </h2>
        <div className="mt-3 mb-10 w-12 h-[3px] mx-auto" style={{ backgroundColor: 'var(--color-accent)' }} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.items.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-lg"
              style={{ border: '1px solid var(--color-primary)' }}
            >
              <h3
                className="font-semibold text-base mb-3"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}
              >
                {item.question}
              </h3>
              <p
                className="text-sm leading-relaxed opacity-75"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
              >
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function FAQ({ data }: { data: FaqSection }) {
  if (data.variant === 'faq-grid') return <FaqGrid data={data} />;
  return <FaqAccordion data={data} />;
}
