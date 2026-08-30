export const LEAD_STATUSES = ['new', 'contacted', 'closed'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === 'string' && (LEAD_STATUSES as readonly string[]).includes(value);
}

/** Flat lead document as read from the `leads` Mongo collection (Sprint 1's shape + id). */
export interface CrmLead {
  id: string;
  fields: { label: string; value: string }[];
  companyName: string;
  submittedAt: string;
  status: LeadStatus;
  notes: string;
}

const NAME_LABELS = ['Full Name', 'Name'];
const EMAIL_LABELS = ['Email Address', 'Email'];
const PHONE_LABELS = ['Phone Number', 'Phone'];
const SOURCE_LABELS = ['Source'];

function byLabels(fields: CrmLead['fields'], labels: string[]): string {
  for (const label of labels) {
    const match = fields.find((f) => f.label === label);
    if (match?.value) return match.value;
  }
  return '';
}

/** Pulls the common list-view columns out of the flat `fields` array — no fixed schema, same convention as leadSink's `byLabel`. */
export function leadSummary(lead: CrmLead) {
  return {
    name: byLabels(lead.fields, NAME_LABELS) || '(no name)',
    email: byLabels(lead.fields, EMAIL_LABELS),
    phone: byLabels(lead.fields, PHONE_LABELS),
    source: byLabels(lead.fields, SOURCE_LABELS),
  };
}
