'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import statesTopo from 'us-atlas/states-10m.json';
import { US_STATES, US_STATES_LIST, findStateBySlug, type USState } from '@/lib/statesGeo';
import { FIPS_TO_STATE } from '@/lib/statesFips';
import {
  type KbSurplusInfo,
  type KbType,
  classifyForeclosure,
  classifyTax,
  foreclosureGuidance,
  foreclosureLabel,
  taxLabel,
  fieldOrCheck,
  CHECK_COUNTY,
} from '@/lib/stateKb';

type StateResponse = {
  name: string;
  slug: string;
  stateCode: string;
  records: KbSurplusInfo[];
};

const DISCLAIMER =
  'This is general information, not legal advice, and details vary by county. Confirm with your county or the team.';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 py-2 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
      <span className="text-sm opacity-60" style={{ fontFamily: 'var(--font-body)' }}>{label}</span>
      <span className="text-sm font-semibold text-right" style={{ fontFamily: 'var(--font-body)' }}>{value}</span>
    </div>
  );
}

/** Renders one KbSurplusInfo record — foreclosure and tax differ (see stateKb). */
function RecordView({ record }: { record: KbSurplusInfo }) {
  const isForeclosure = record.type === 'foreclosure';
  // System label: only shown when the classification is known; unknown routes to
  // the guidance/check line below rather than a blank or guessed cell.
  const systemLabel = isForeclosure
    ? foreclosureLabel(record.systemType)
    : taxLabel(record.systemType);
  const taxUnclear = !isForeclosure && classifyTax(record.systemType) === 'check';

  return (
    <div>
      {systemLabel && <Row label={isForeclosure ? 'Process' : 'Sale type'} value={systemLabel} />}
      {/* Only `null` falls back — a real "None" renders verbatim via fieldOrCheck. */}
      <Row label="Redemption period" value={fieldOrCheck(record.redemptionPeriod)} />
      <Row label="Estimated timeline" value={fieldOrCheck(record.estimatedTimeline)} />

      {/* Foreclosure-only derived attorney/process guidance (covers the null/
          dual → "check your county" case too). */}
      {isForeclosure && (
        <p className="mt-4 text-sm leading-relaxed opacity-80" style={{ fontFamily: 'var(--font-body)' }}>
          {foreclosureGuidance(record.systemType)}
        </p>
      )}
      {/* Tax with an unclear/"Lien & Deed"/null system → check-your-county (no
          attorney claim is ever derived for tax). */}
      {taxUnclear && (
        <p className="mt-4 text-sm leading-relaxed opacity-80" style={{ fontFamily: 'var(--font-body)' }}>
          {CHECK_COUNTY}
        </p>
      )}

      {record.notes && (
        <p className="mt-3 text-sm leading-relaxed opacity-80" style={{ fontFamily: 'var(--font-body)' }}>
          {record.notes}
        </p>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="px-4 py-2 text-sm font-semibold rounded-md transition-colors"
      style={{
        backgroundColor: active ? 'var(--color-primary)' : 'transparent',
        color: active ? 'var(--color-bg)' : 'var(--color-primary)',
        border: '1px solid var(--color-primary)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {children}
    </button>
  );
}

function ComingSoon({ name }: { name: string }) {
  return (
    <p className="text-sm leading-relaxed opacity-80" style={{ fontFamily: 'var(--font-body)' }}>
      Detailed information for {name} is coming soon — the team can answer questions about your area now.
    </p>
  );
}

function StateModal({
  state,
  loading,
  data,
  error,
  onClose,
}: {
  state: USState;
  loading: boolean;
  data: StateResponse | null;
  error: boolean;
  onClose: () => void;
}) {
  const prefersReduced = useReducedMotion();

  const records = data?.records ?? [];
  const hasForeclosure = records.some((r) => r.type === 'foreclosure');
  const hasTax = records.some((r) => r.type === 'tax');

  // Only offer tabs for types that actually came back; default to foreclosure.
  const [tab, setTab] = useState<KbType | null>(null);
  const effectiveTab: KbType | null =
    tab && records.some((r) => r.type === tab)
      ? tab
      : hasForeclosure
      ? 'foreclosure'
      : hasTax
      ? 'tax'
      : null;
  const record = records.find((r) => r.type === effectiveTab) ?? null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${state.name} surplus fund details`}
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-md rounded-2xl p-6 shadow-xl"
        style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {state.name}
          </h3>
          <button onClick={onClose} aria-label="Close" className="text-2xl leading-none opacity-50 hover:opacity-100">
            ×
          </button>
        </div>
        <div className="mt-2 w-12 h-[3px]" style={{ backgroundColor: 'var(--color-accent)' }} />

        <div className="mt-5">
          {loading ? (
            <p className="opacity-60 text-sm" style={{ fontFamily: 'var(--font-body)' }}>Loading…</p>
          ) : error ? (
            // Hub error — calm and opaque; never surfaces internals.
            <p className="text-sm leading-relaxed opacity-80" style={{ fontFamily: 'var(--font-body)' }}>
              State details are temporarily unavailable — the team can answer questions about your area now.
            </p>
          ) : records.length === 0 ? (
            <ComingSoon name={state.name} />
          ) : (
            <>
              {/* Toggle — only the types that came back. */}
              <div className="flex gap-2 mb-4">
                {hasForeclosure && (
                  <TabButton active={effectiveTab === 'foreclosure'} onClick={() => setTab('foreclosure')}>
                    Mortgage / Foreclosure
                  </TabButton>
                )}
                {hasTax && (
                  <TabButton active={effectiveTab === 'tax'} onClick={() => setTab('tax')}>
                    Tax Sale
                  </TabButton>
                )}
              </div>
              {record && <RecordView record={record} />}
            </>
          )}
        </div>

        <a
          href="/#contact"
          className="mt-6 inline-flex px-5 py-3 text-sm font-semibold rounded-md transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}
        >
          Check If You’re Owed Money in {state.name}
        </a>

        <p className="mt-4 text-xs leading-relaxed opacity-55" style={{ fontFamily: 'var(--font-body)' }}>
          {DISCLAIMER}
        </p>
      </motion.div>
    </motion.div>
  );
}

const UNSERVED_FILL = '#e5e7eb';
const DEFAULT_VIEW = { coordinates: [-97, 38] as [number, number], zoom: 1 };

function ZoomBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-8 h-8 flex items-center justify-center rounded-md text-lg font-bold leading-none shadow-sm"
      style={{
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-primary)',
        border: '1px solid var(--color-primary)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {children}
    </button>
  );
}

/**
 * Geographic US map (react-simple-maps + us-atlas). Each feature is keyed by
 * FIPS (geo.id); FIPS_TO_STATE → our canonical USState resolves served status +
 * the slug for the click. Territories/AK/HI/DC fall through to non-interactive
 * gray. Click/keyboard fire the SAME onSelect the tile grid used — the data flow
 * below is unchanged.
 */
function USMap({
  onSelect,
  selectedAbbr,
}: {
  onSelect: (s: USState) => void;
  selectedAbbr?: string;
}) {
  const prefersReduced = useReducedMotion();
  const [activeFips, setActiveFips] = useState<string | null>(null);
  const [view, setView] = useState(DEFAULT_VIEW);
  const clamp = (z: number) => Math.max(1, Math.min(8, z));

  return (
    <div>
      <div className="relative max-w-3xl mx-auto">
        <ComposableMap
          projection="geoAlbersUsa"
          width={800}
          height={500}
          projectionConfig={{ scale: 1000 }}
          style={{ width: '100%', height: 'auto' }}
          role="group"
          aria-label="Map of states we serve"
        >
          <ZoomableGroup
            zoom={view.zoom}
            center={view.coordinates}
            minZoom={1}
            maxZoom={8}
            onMoveEnd={(pos: { coordinates: [number, number]; zoom: number }) => setView(pos)}
          >
            <Geographies geography={statesTopo}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const fips = String(geo.id).padStart(2, '0');
                  const entry = FIPS_TO_STATE[fips];
                  const state = entry ? US_STATES[entry.abbr] : undefined;
                  const served = !!state?.served;
                  const highlighted =
                    served && (activeFips === fips || (!!entry && selectedAbbr === entry.abbr));
                  const fill = !served
                    ? UNSERVED_FILL
                    : highlighted
                    ? 'var(--color-accent)'
                    : 'var(--color-primary)';
                  const geoStyle = {
                    fill,
                    stroke: 'var(--color-bg)',
                    strokeWidth: highlighted ? 1.25 : 0.5,
                    outline: 'none',
                    cursor: served ? 'pointer' : 'default',
                    transition: prefersReduced ? undefined : 'fill 0.15s, stroke 0.15s',
                  };
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      tabIndex={served ? 0 : -1}
                      role={served ? 'button' : undefined}
                      aria-label={entry ? `${entry.name}${served ? '' : ' — not served'}` : undefined}
                      onClick={() => served && state && onSelect(state)}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (served && state && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          onSelect(state);
                        }
                      }}
                      onMouseEnter={() => served && setActiveFips(fips)}
                      onMouseLeave={() => setActiveFips((k) => (k === fips ? null : k))}
                      onFocus={() => served && setActiveFips(fips)}
                      onBlur={() => setActiveFips((k) => (k === fips ? null : k))}
                      style={{ default: geoStyle, hover: geoStyle, pressed: geoStyle }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Zoom / reset controls — small NE states are reachable on touch. */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <ZoomBtn label="Zoom in" onClick={() => setView((v) => ({ ...v, zoom: clamp(v.zoom * 1.5) }))}>+</ZoomBtn>
          <ZoomBtn label="Zoom out" onClick={() => setView((v) => ({ ...v, zoom: clamp(v.zoom / 1.5) }))}>−</ZoomBtn>
          <ZoomBtn label="Reset map" onClick={() => setView(DEFAULT_VIEW)}>⟳</ZoomBtn>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--color-primary)' }} /> Served
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded" style={{ backgroundColor: UNSERVED_FILL }} /> Not served
        </span>
      </div>
    </div>
  );
}

/**
 * Always-present served-states list — the reliable non-SVG path (keyboard /
 * assistive tech / anyone who can't tap a tiny state). Fires the SAME onSelect
 * as the map.
 */
function ServedList({ onSelect }: { onSelect: (s: USState) => void }) {
  const served = US_STATES_LIST.filter((s) => s.served).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="mt-10 max-w-3xl mx-auto">
      <h3
        className="text-center text-sm font-semibold mb-4 opacity-70"
        style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}
      >
        Or pick your state from the list
      </h3>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2" aria-label="States we serve">
        {served.map((s) => (
          <li key={s.abbr}>
            <button
              onClick={() => onSelect(s)}
              aria-label={`${s.name} — served`}
              className="w-full px-3 py-2 rounded-md text-sm font-medium text-left transition-opacity hover:opacity-80"
              style={{
                border: '1px solid var(--color-primary)',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {s.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function StateMap({ initialSlug }: { initialSlug?: string }) {
  // Preselect a state from the URL (?state=slug) — only if it's a served state,
  // since unserved states have no knowledge to open a modal for.
  const preselected = initialSlug ? findStateBySlug(initialSlug) : undefined;
  const initial = preselected && preselected.served ? preselected : null;

  const [selected, setSelected] = useState<USState | null>(initial);
  const [data, setData] = useState<StateResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(initial));
  const [error, setError] = useState(false);

  const onSelect = (state: USState) => {
    setSelected(state);
    setData(null);
    setError(false);
    setLoading(true);
  };

  useEffect(() => {
    if (!selected) return;
    let active = true;
    fetch(`/api/states/${selected.slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json) => {
        if (active) {
          setData(json as StateResponse);
          setError(false);
        }
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [selected]);

  return (
    <div>
      <USMap onSelect={onSelect} selectedAbbr={selected?.abbr} />
      <ServedList onSelect={onSelect} />

      <AnimatePresence>
        {selected && (
          <StateModal
            state={selected}
            loading={loading}
            data={data}
            error={error}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
