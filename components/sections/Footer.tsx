import { SiteConfig } from '@/types/content';

export default function Footer({ config }: { config: SiteConfig }) {
  const year = new Date().getFullYear();

  return (
    <footer
      className="py-10 px-6 text-center"
      style={{ backgroundColor: 'var(--color-bg)', borderTop: '1px solid var(--color-primary)', color: 'var(--color-text)' }}
    >
      <p className="font-semibold text-lg mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
        {config.companyName}
      </p>
      {config.tagline && (
        <p className="text-sm mb-2 opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
          {config.tagline}
        </p>
      )}
      {config.contactEmail && (
        <p className="text-sm mb-4 opacity-70" style={{ fontFamily: 'var(--font-body)' }}>
          <a href={`mailto:${config.contactEmail}`} style={{ color: 'var(--color-primary)' }}>
            {config.contactEmail}
          </a>
        </p>
      )}
      <p className="text-xs opacity-40" style={{ fontFamily: 'var(--font-body)' }}>
        A division of Operation Profit LLC
      </p>
      <p className="text-xs opacity-40 mt-1" style={{ fontFamily: 'var(--font-body)' }}>
        &copy; {year} {config.companyName}. All rights reserved.
      </p>
    </footer>
  );
}
