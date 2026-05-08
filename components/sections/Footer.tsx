import { SiteConfig } from '@/types/content';

export default function Footer({ config }: { config: SiteConfig }) {
  const year = new Date().getFullYear();

  return (
    <footer
      className="py-10 px-6 text-center"
      style={{
        backgroundColor: 'var(--color-primary)',
        borderTop: '1px solid var(--color-accent)',
        color: 'var(--color-bg)',
      }}
    >
      <p
        className="font-semibold text-lg mb-1"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-bg)' }}
      >
        {config.companyName}
      </p>
      {config.tagline && (
        <p
          className="text-sm mb-2 opacity-70"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-bg)' }}
        >
          {config.tagline}
        </p>
      )}
      {config.contactEmail && (
        <p className="text-sm mb-4" style={{ fontFamily: 'var(--font-body)' }}>
          <a href={`mailto:${config.contactEmail}`} style={{ color: 'var(--color-accent)' }}>
            {config.contactEmail}
          </a>
        </p>
      )}
      <p
        className="text-xs opacity-50 mt-1"
        style={{ fontFamily: 'var(--font-body)', color: 'var(--color-bg)' }}
      >
        &copy; {year} {config.companyName}. All rights reserved.
      </p>
    </footer>
  );
}
