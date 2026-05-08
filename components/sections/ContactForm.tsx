'use client';

import { useState } from 'react';
import { ContactForm, FormField } from '@/types/content';

function renderField(field: FormField, value: string, onChange: (v: string) => void) {
  const base =
    'w-full px-4 py-3 rounded-md outline-none transition-colors text-sm';
  const style = {
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-primary)',
    fontFamily: 'var(--font-body)',
  };

  const labelEl = (
    <label className="block text-sm font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
      {field.label}
      {field.required && <span style={{ color: 'var(--color-primary)' }}> *</span>}
    </label>
  );

  if (field._type === 'textField' || field._type === 'emailField' || field._type === 'phoneField') {
    return (
      <div key={field.label}>
        {labelEl}
        <input
          type={field._type === 'emailField' ? 'email' : field._type === 'phoneField' ? 'tel' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={'placeholder' in field ? field.placeholder : undefined}
          required={field.required}
          className={base}
          style={style}
        />
      </div>
    );
  }

  if (field._type === 'dropdownField') {
    return (
      <div key={field.label}>
        {labelEl}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          className={base}
          style={style}
        >
          <option value="">Select an option</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field._type === 'textareaField') {
    return (
      <div key={field.label}>
        {labelEl}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={'placeholder' in field ? field.placeholder : undefined}
          required={field.required}
          rows={4}
          className={base}
          style={style}
        />
      </div>
    );
  }

  return null;
}

export default function ContactFormSection({ data }: { data: ContactForm }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const setValue = (label: string, val: string) =>
    setValues((prev) => ({ ...prev, [label]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: values, honeypot }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus('success');
      } else {
        setErrorMsg(json.error || 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <section id="contact" className="py-20 px-6" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p
            className="text-xl font-semibold"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}
          >
            {data.successMessage}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 px-6" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold mb-3 text-center"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          {data.heading}
        </h2>
        {data.subheading && (
          <p
            className="text-center mb-8 opacity-75"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
          >
            {data.subheading}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Honeypot — hidden from real users */}
          <input
            type="text"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute opacity-0 w-0 h-0 pointer-events-none"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            autoComplete="off"
          />
          {data.fields.map((field) =>
            renderField(field, values[field.label] || '', (v) => setValue(field.label, v))
          )}
          {status === 'error' && (
            <p className="text-sm" style={{ color: 'var(--color-primary)' }}>{errorMsg}</p>
          )}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full py-4 font-semibold rounded-md transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-bg)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {status === 'submitting' ? 'Submitting…' : data.submitText}
          </button>
        </form>
      </div>
    </section>
  );
}
