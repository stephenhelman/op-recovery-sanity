'use client';

/**
 * Sticky site nav. Standard on every client deployment — no Sanity toggle.
 *
 * Links are DERIVED from the sections actually present (in page order) via
 * buildNavLinks — a client that omits a section never gets a dead link. Nav
 * structure/anchors are owned by code (lib/navSections.ts); Sanity owns only
 * each section's optional `navLabel`.
 *
 * Brand-token portability: the nav mounts at the layout level, OUTSIDE the
 * page.tsx wrapper that defines `--color-*`. So — exactly like ChatWidget — it
 * receives colors/fonts as props and sets its OWN CSS variables on its root
 * rather than relying on inheritance. Nothing here hardcodes a palette.
 */

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Section, SiteConfig, TemplateColors } from '@/types/content';
import { buildNavLinks } from '@/lib/navSections';
import { isEnabled } from '@/lib/features';

type Fonts = { heading: string; body: string };

const DEFAULT_NAV_CTA = 'Check If You’re Owed Money';

export default function Header({
  siteConfig,
  sections,
  colors,
  fonts,
}: {
  siteConfig: SiteConfig;
  sections: Section[];
  colors: TemplateColors;
  fonts: Fonts;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Transparent-over-hero only makes sense where a full-bleed hero sits under
  // the nav — i.e. the homepage. On every other route (e.g. /states, which has
  // a light background), the nav renders solid from the start so its light text
  // is always visible.
  const overHero = pathname === '/';

  const links = buildNavLinks(sections, {
    stateKnowledgeBase: isEnabled(siteConfig.features, 'stateKnowledgeBase'),
  });
  const ctaText = siteConfig.navCta || DEFAULT_NAV_CTA;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile overlay is open.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const solid = !overHero || scrolled || menuOpen;

  const go = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith('#')) {
      // Same-page anchor. If we're not on the homepage, route there first.
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        router.push('/' + href);
        return;
      }
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(href);
    }
  };

  // The nav owns its own brand tokens so it re-skins from siteConfig on any page.
  const rootVars = {
    '--color-primary': colors.primary,
    '--color-accent': colors.accent,
    '--color-bg': colors.background,
    '--color-text': colors.text,
    '--font-heading': fonts.heading,
    '--font-body': fonts.body,
  } as React.CSSProperties;

  const Logo = (
    <button onClick={() => go('#home')} className="flex items-center" aria-label="Back to top">
      {siteConfig.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={siteConfig.logo} alt={siteConfig.companyName} className="h-9 w-auto object-contain" />
      ) : (
        <span
          className="text-lg font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-bg)' }}
        >
          {siteConfig.companyName}
        </span>
      )}
    </button>
  );

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-colors duration-300"
      style={{
        ...rootVars,
        backgroundColor: solid ? 'var(--color-primary)' : 'transparent',
        boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.12)' : 'none',
      }}
    >
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-6">
        {Logo}

        {/* Desktop links — hidden when there are none (graceful degrade). */}
        {links.length > 0 && (
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                className="text-sm font-medium transition-opacity hover:opacity-70"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-bg)' }}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}

        {/* Desktop CTA */}
        <button
          onClick={() => go('#contact')}
          className="hidden md:inline-flex px-5 py-2.5 text-sm font-semibold rounded-md transition-opacity hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-primary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {ctaText}
        </button>

        {/* Mobile hamburger — only when there are links to show. */}
        {links.length > 0 && (
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px]"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} className="block w-6 h-[2px] rounded-full" style={{ backgroundColor: 'var(--color-bg)' }} />
            ))}
          </button>
        )}
      </div>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden fixed inset-x-0 top-16 bottom-0 flex flex-col px-6 py-8 gap-2"
            style={{ ...rootVars, backgroundColor: 'var(--color-primary)' }}
          >
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                className="text-left py-4 text-lg font-medium border-b transition-opacity hover:opacity-70"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-bg)',
                  borderColor: 'var(--color-accent)',
                }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => go('#contact')}
              className="mt-6 px-5 py-4 text-base font-semibold rounded-md transition-opacity hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {ctaText}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
