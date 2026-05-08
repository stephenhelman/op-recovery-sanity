'use client';

import { SiteConfig } from '@/types/content';

export default function Header({ siteConfig, ctaText }: { siteConfig: SiteConfig; ctaText: string }) {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className="sticky top-0 z-50 w-full flex items-center justify-between px-6 py-4"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      <div className="flex items-center">
        {siteConfig.logo ? (
          <img
            src={siteConfig.logo}
            alt={siteConfig.companyName}
            className="h-10 w-auto object-contain"
          />
        ) : (
          <span
            className="text-xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-bg)' }}
          >
            {siteConfig.companyName}
          </span>
        )}
      </div>
      <button
        onClick={scrollToContact}
        className="px-5 py-2.5 text-sm font-semibold rounded-md transition-opacity hover:opacity-90 active:scale-95"
        style={{
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-bg)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {ctaText}
      </button>
    </header>
  );
}
