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
      {field.required && <span style={{ color: 'var(--color-accent)' }}> *</span>}
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

function FormCore({
  data,
  fields,
}: {
  data: ContactForm;
  fields: FormField[];
}) {
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
      <p
        className="text-xl font-semibold text-center"
        style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}
      >
        {data.successMessage}
      </p>
    );
  }

  return (
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
      {fields.map((field) =>
        renderField(field, values[field.label] || '', (v) => setValue(field.label, v))
      )}
      {status === 'error' && (
        <p className="text-sm" style={{ color: 'var(--color-accent)' }}>{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-4 font-bold rounded-md transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-primary)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {status === 'submitting' ? 'Submitting…' : data.submitText}
      </button>
      {data.footerNote && (
        <p
          className="mt-3 text-sm italic text-center"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', opacity: 0.6 }}
        >
          {data.footerNote}
        </p>
      )}
    </form>
  );
}

function ContactStacked({ data }: { data: ContactForm }) {
  return (
    <section id="contact" className="py-16 md:py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          {data.heading}
        </h2>
        <div className="mt-3 mb-8 w-12 h-[3px] mx-auto" style={{ backgroundColor: 'var(--color-accent)' }} />
        {data.subheading && (
          <p
            className="text-center mb-8 opacity-75"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
          >
            {data.subheading}
          </p>
        )}
        <FormCore data={data} fields={data.fields} />
      </div>
    </section>
  );
}

function ContactSplit({ data }: { data: ContactForm }) {
  return (
    <section id="contact" className="py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left — company info */}
        <div>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
          >
            {data.heading}
          </h2>
          <div className="mb-6 w-12 h-[3px]" style={{ backgroundColor: 'var(--color-accent)' }} />
          {data.subheading && (
            <p
              className="mb-6 opacity-75 leading-relaxed"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
            >
              {data.subheading}
            </p>
          )}
        </div>

        {/* Right — form */}
        <div>
          <FormCore data={data} fields={data.fields} />
        </div>
      </div>
    </section>
  );
}

function ContactMinimal({ data }: { data: ContactForm }) {
  const minimalFields = data.fields.filter(
    (f) => f._type === 'textField' || f._type === 'emailField' || f._type === 'phoneField'
  );

  return (
    <section id="contact" className="py-16 md:py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          {data.heading}
        </h2>
        <div className="mt-3 mb-8 w-12 h-[3px] mx-auto" style={{ backgroundColor: 'var(--color-accent)' }} />
        <FormCore data={data} fields={minimalFields} />
      </div>
    </section>
  );
}

export default function ContactFormSection({ data }: { data: ContactForm }) {
  if (data.variant === 'contact-split') return <ContactSplit data={data} />;
  if (data.variant === 'contact-minimal') return <ContactMinimal data={data} />;
  return <ContactStacked data={data} />;
}
