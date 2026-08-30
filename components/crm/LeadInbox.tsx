'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import type { TemplateColors } from '@/types/content';
import { LEAD_STATUSES, leadSummary, type CrmLead, type LeadStatus } from '@/lib/crm/types';

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  closed: 'Closed',
};

type Filter = LeadStatus | 'all';
const FILTERS: Filter[] = ['all', ...LEAD_STATUSES];
const FILTER_LABEL: Record<Filter, string> = { all: 'All', ...STATUS_LABEL };

type LoadState = 'loading' | 'ready' | 'error';

function StatusBadge({ status, colors }: { status: LeadStatus; colors: TemplateColors }) {
  const bg = status === 'new' ? colors.accent : status === 'contacted' ? colors.primary : '#6b7280';
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
      style={{ backgroundColor: bg }}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export default function LeadInbox({
  colors,
  ownerEmail,
}: {
  colors: TemplateColors;
  ownerEmail?: string | null;
}) {
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ status: LeadStatus; notes: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const prefersReduced = useReducedMotion();

  const load = useCallback(async (f: Filter) => {
    setLoadState('loading');
    try {
      const res = await fetch(`/api/crm/leads${f !== 'all' ? `?status=${f}` : ''}`);
      if (!res.ok) throw new Error('request failed');
      const data = await res.json();
      setLeads(data.leads ?? []);
      setLoadState('ready');
    } catch {
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  const selected = leads.find((l) => l.id === selectedId) ?? null;

  function openLead(lead: CrmLead) {
    setSelectedId(lead.id);
    setDraft({ status: lead.status, notes: lead.notes });
    setSaveError(null);
  }

  function closeLead() {
    setSelectedId(null);
    setDraft(null);
    setSaveError(null);
  }

  async function saveDraft() {
    if (!selected || !draft) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/crm/leads/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error('save failed');
      setLeads((prev) =>
        prev.map((l) => (l.id === selected.id ? { ...l, status: draft.status, notes: draft.notes } : l))
      );
    } catch {
      setSaveError("Couldn't save — try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={
        {
          backgroundColor: colors.background,
          color: colors.text,
          minHeight: '100vh',
          fontFamily: 'var(--font-body)',
        } as React.CSSProperties
      }
      className="px-4 py-8 sm:px-8"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1
              className="text-xl font-bold sm:text-2xl"
              style={{ fontFamily: 'var(--font-heading)', color: colors.primary }}
            >
              Lead Inbox
            </h1>
            {ownerEmail && <p className="text-xs opacity-60 mt-1">Signed in as {ownerEmail}</p>}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/app/sign-in' })}
            className="text-xs font-medium underline underline-offset-2 opacity-70 hover:opacity-100"
          >
            Sign out
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: active ? colors.primary : 'rgba(0,0,0,0.06)',
                  color: active ? '#fff' : colors.text,
                }}
              >
                {FILTER_LABEL[f]}
              </button>
            );
          })}
        </div>

        {loadState === 'loading' && (
          <p className="py-16 text-center text-sm opacity-60">Loading leads…</p>
        )}

        {loadState === 'error' && (
          <div className="py-16 text-center">
            <p className="text-sm opacity-70 mb-3">Couldn&apos;t load leads.</p>
            <button
              onClick={() => load(filter)}
              className="rounded-md px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: colors.primary }}
            >
              Try again
            </button>
          </div>
        )}

        {loadState === 'ready' && leads.length === 0 && (
          <p className="py-16 text-center text-sm opacity-60">
            {filter === 'all' ? 'No leads yet — new submissions will appear here.' : 'No leads match this status.'}
          </p>
        )}

        {loadState === 'ready' && leads.length > 0 && (
          <ul className="flex flex-col gap-2">
            {leads.map((lead) => {
              const s = leadSummary(lead);
              return (
                <li key={lead.id}>
                  <button
                    onClick={() => openLead(lead)}
                    className="w-full rounded-lg border p-4 text-left transition-colors hover:opacity-90"
                    style={{ borderColor: 'rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.5)' }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{s.name}</span>
                      <StatusBadge status={lead.status} colors={colors} />
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs opacity-70">
                      {s.email && <span>{s.email}</span>}
                      {s.phone && <span>{s.phone}</span>}
                      {s.source && <span>Source: {s.source}</span>}
                      {lead.submittedAt && <span>{lead.submittedAt}</span>}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <AnimatePresence>
        {selected && draft && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 sm:items-center"
            initial={prefersReduced ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReduced ? undefined : { opacity: 0 }}
            onClick={closeLead}
          >
            <motion.div
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl p-6"
              style={{ backgroundColor: colors.background, color: colors.text }}
              initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: colors.primary }}>
                  {leadSummary(selected).name}
                </h2>
                <button onClick={closeLead} className="text-sm opacity-60 hover:opacity-100">
                  Close
                </button>
              </div>

              <dl className="mb-6 flex flex-col gap-2 text-sm">
                {selected.fields.map((f, i) => (
                  <div key={i} className="flex justify-between gap-4 border-b py-1.5" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                    <dt className="opacity-60">{f.label}</dt>
                    <dd className="text-right font-medium">{f.value || '—'}</dd>
                  </div>
                ))}
                {selected.submittedAt && (
                  <div className="flex justify-between gap-4 py-1.5">
                    <dt className="opacity-60">Submitted</dt>
                    <dd className="text-right font-medium">{selected.submittedAt}</dd>
                  </div>
                )}
              </dl>

              <label className="mb-4 flex flex-col gap-2 text-sm">
                Status
                <select
                  value={draft.status}
                  onChange={(e) => setDraft({ ...draft, status: e.target.value as LeadStatus })}
                  className="rounded-md border px-3 py-2 text-sm"
                  style={{ borderColor: 'rgba(0,0,0,0.15)' }}
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mb-4 flex flex-col gap-2 text-sm">
                Notes
                <textarea
                  value={draft.notes}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                  rows={4}
                  className="rounded-md border px-3 py-2 text-sm"
                  style={{ borderColor: 'rgba(0,0,0,0.15)' }}
                  placeholder="Internal notes…"
                />
              </label>

              {saveError && <p className="mb-3 text-sm" style={{ color: '#b91c1c' }}>{saveError}</p>}

              <button
                onClick={saveDraft}
                disabled={saving}
                className="w-full rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: colors.primary }}
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
