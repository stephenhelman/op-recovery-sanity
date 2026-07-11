'use client';

/**
 * Site-wide scroll-reveal primitives.
 *
 * Calm, professional motion — this is a recovery firm, not a startup. Keep the
 * bounds subtle: y: 24 max, duration 0.5, stagger 0.08–0.15.
 *
 * Reduced-motion discipline (mirrors the chat widget's intent): when the user
 * has `prefers-reduced-motion: reduce`, every wrapper renders its final,
 * static state with no transform — see `useReducedMotion()` below.
 *
 * These are client components. A server section can wrap its (server-rendered)
 * children in <Reveal> without becoming a client component itself — children
 * pass straight through the client boundary.
 */

import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const DURATION = 0.5;
const IN_VIEW = { once: true, margin: '-100px' } as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Vertical travel in px. Keep ≤ 24 for a calm feel. */
  y?: number;
  /** Optional delay before this block animates. */
  delay?: number;
};

/** Single block fades up once when scrolled into view. */
export function Reveal({ children, className, y = 24, delay = 0 }: RevealProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, IN_VIEW);

  if (prefersReduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: DURATION, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  /** Delay between each child's entrance. */
  stagger?: number;
};

/**
 * Container that staggers its <RevealItem> children into view.
 * Use for grids of same-level cards (div children) — keeps HTML valid.
 */
export function RevealGroup({ children, className, stagger = 0.1 }: RevealGroupProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, IN_VIEW);

  if (prefersReduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** A staggered child of <RevealGroup>. Renders a div — use inside div grids. */
export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: DURATION, ease: 'easeOut' } },
      }}
    >
      {children}
    </motion.div>
  );
}
