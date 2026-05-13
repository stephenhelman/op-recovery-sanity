'use client';

import { motion } from 'framer-motion';
import { HeroSection } from '@/types/content';

interface HeroProps {
  data: HeroSection;
  logo?: string | null;
  companyName?: string;
  logoHeight?: number;
  logoWidth?: number;
}

function LogoOrName({
  logo,
  companyName,
  logoHeight,
  logoWidth,
}: {
  logo?: string | null;
  companyName?: string;
  logoHeight?: number;
  logoWidth?: number;
}) {
  if (logo) {
    return (
      <img
        src={logo}
        alt={companyName ?? ''}
        className="w-auto object-contain mb-8"
        style={{
          maxHeight: logoHeight ? `${logoHeight}px` : '80px',
          maxWidth: logoWidth ? `${logoWidth}px` : undefined,
        }}
      />
    );
  }
  if (companyName) {
    return (
      <span
        className="text-2xl font-bold mb-8"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-bg)' }}
      >
        {companyName}
      </span>
    );
  }
  return null;
}

function HeroCentered({ data, logo, companyName, logoHeight, logoWidth }: HeroProps) {
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
        <LogoOrName logo={logo} companyName={companyName} logoHeight={logoHeight} logoWidth={logoWidth} />
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
        {data.ctaText && (
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
        )}
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

function HeroSplit({ data, logo, companyName, logoHeight, logoWidth }: HeroProps) {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative min-h-screen flex flex-col md:flex-row"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      {/* Left — text */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex-1 flex flex-col justify-center px-8 py-24 md:px-16"
      >
        <LogoOrName logo={logo} companyName={companyName} logoHeight={logoHeight} logoWidth={logoWidth} />
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-bg)' }}
        >
          {data.headline}
        </h1>
        <p
          className="text-lg sm:text-xl mb-10 leading-relaxed max-w-lg"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-bg)', opacity: 0.85 }}
        >
          {data.subheadline}
        </p>
        {data.ctaText && (
          <div>
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
          </div>
        )}
        {data.ctaNote && (
          <p
            className="mt-3 text-sm italic"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-bg)', opacity: 0.6 }}
          >
            {data.ctaNote}
          </p>
        )}
      </motion.div>

      {/* Right — accent graphic */}
      <div
        className="hidden md:flex flex-1 items-center justify-center"
        style={{ backgroundColor: 'var(--color-accent)', opacity: 0.08 }}
      >
        <div
          className="w-32 h-32 rounded-full"
          style={{ backgroundColor: 'var(--color-accent)', opacity: 0.4 }}
        />
      </div>

      <div
        className="absolute bottom-0 inset-x-0 h-[2px]"
        style={{ backgroundColor: 'var(--color-accent)' }}
      />
    </section>
  );
}

export default function Hero({ data, logo, companyName, logoHeight, logoWidth }: HeroProps) {
  if (data.variant === 'hero-split') {
    return <HeroSplit data={data} logo={logo} companyName={companyName} logoHeight={logoHeight} logoWidth={logoWidth} />;
  }
  return <HeroCentered data={data} logo={logo} companyName={companyName} logoHeight={logoHeight} logoWidth={logoWidth} />;
}
