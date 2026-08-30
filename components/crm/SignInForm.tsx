'use client';

import { useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import type { TemplateColors } from '@/types/content';

type Status = 'idle' | 'sending' | 'sent';

export default function SignInForm({ colors }: { colors: TemplateColors }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || status === 'sending') return;
    setStatus('sending');
    // redirect:false — we show our own calm confirmation regardless of
    // whether the email was actually the configured owner (never leak that).
    await signIn('email', { email, redirect: false });
    setStatus('sent');
  }

  if (status === 'sent') {
    return (
      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)', opacity: 0.8 }}>
        If that email is registered for this dashboard, a sign-in link is on its way. Check your
        inbox — the link is valid for 24 hours and works once.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-sm" style={{ color: 'var(--color-text)' }}>
        Email address
        <input
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm outline-none transition-colors focus:ring-2"
          style={
            {
              borderColor: 'rgba(0,0,0,0.15)',
              color: 'var(--color-text)',
              '--tw-ring-color': colors.accent,
            } as React.CSSProperties
          }
          placeholder="you@company.com"
        />
      </label>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="rounded-md px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
        style={{ backgroundColor: colors.primary }}
      >
        {status === 'sending' ? 'Sending…' : 'Send sign-in link'}
      </button>
    </form>
  );
}
