'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaqSection } from '@/types/content';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b"
      style={{ borderColor: 'var(--color-primary)', opacity: 0.9 }}
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
          style={{ color: 'var(--color-primary)' }}
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

export default function FAQ({ data }: { data: FaqSection }) {
  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center mb-10"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          Frequently Asked Questions
        </h2>
        <div className="border-t" style={{ borderColor: 'var(--color-primary)' }}>
          {data.items.map((item, i) => (
            <FAQItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
