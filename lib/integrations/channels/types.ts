/**
 * Uniform result every outbound channel returns. A channel can never fail
 * silently again: success or failure is always reported here, and the
 * orchestrator logs every `ok: false`.
 */
export type ChannelResult =
  | { channel: string; ok: true; id?: string }
  | { channel: string; ok: false; error: string };

export type LeadField = { label: string; value: string };

export interface EmailColors {
  primary: string;
  accent: string;
  background: string;
  text: string;
}

export interface FormSettings {
  replyToEmail?: string;
  fromName?: string;
  fromEmail?: string;
  formAction?: 'email' | 'email+sheets' | 'email+ghl' | 'email+sheets+ghl';
  googleWebhookUrl?: string;
  ghlApiKey?: string;
  ghlPipelineId?: string;
  ghlStageId?: string;
}

/** The normalized lead, shared by every channel. */
export interface LeadPayload {
  /** Clean field list — used as-is by sheets/GHL; email adds the transcript. */
  fields: LeadField[];
  companyName: string;
  colors: EmailColors;
  submittedAt: string;
  /** The lead's own email ('' if none) — recipient of the confirmation email. */
  submitterEmail: string;
  recipientName: string;
  /** Notification-email only. Never sent to sheets/GHL. */
  transcript?: string;
}

/** Config injected into each channel — no channel reads process.env itself. */
export interface ChannelConfig {
  formSettings: FormSettings;
  resendApiKey?: string;
  /** Inbox that receives lead notifications (drives the sender domain). */
  notifyEmail?: string;
  /** siteConfig.contactEmail — confirmation reply-to fallback. */
  contactEmail?: string;
}

/** A self-contained outbound channel. Add one by dropping a file + a registry line. */
export interface Channel {
  key: string;
  enabled: (cfg: ChannelConfig) => boolean;
  run: (payload: LeadPayload, cfg: ChannelConfig) => Promise<ChannelResult>;
}
