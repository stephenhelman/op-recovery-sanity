'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChatConfig, TemplateColors } from '@/lib/chat/types';
import { useChat } from '@/lib/chat/useChat';
import './chat.css';

function digitsToTel(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

export default function ChatWidget({
  config,
  colors,
}: {
  config: ChatConfig;
  colors: TemplateColors;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !config.enabled) return null;

  return createPortal(
    <div
      className="cw-root"
      style={
        {
          '--cw-primary': colors.primary,
          '--cw-accent': colors.accent,
          '--cw-surface': colors.background,
          '--cw-text': colors.text,
        } as React.CSSProperties
      }
    >
      {open ? (
        <ChatPanel config={config} onClose={() => setOpen(false)} />
      ) : (
        <button
          type="button"
          className="cw-launcher"
          aria-label={`Open ${config.brandName} chat`}
          onClick={() => setOpen(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>,
    document.body
  );
}

function ChatPanel({ config, onClose }: { config: ChatConfig; onClose: () => void }) {
  const chat = useChat(config);
  const [draft, setDraft] = useState('');

  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close = flush the lead first (covers partial conversations).
  const close = () => {
    chat.flush();
    onClose();
  };

  // Auto-scroll to the newest message.
  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat.messages]);

  // Move focus into the panel when it opens; focus the input when typing.
  const wantsInput = chat.awaiting === 'capture' || chat.composer;
  useEffect(() => {
    if (wantsInput) inputRef.current?.focus();
    else panelRef.current?.focus();
  }, [wantsInput, chat.messages.length]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chat.composer) chat.send(draft);
    else chat.submit(draft);
    setDraft('');
  };

  const inputType =
    chat.captureField === 'email' ? 'email' : chat.captureField === 'phone' ? 'tel' : 'text';

  return (
    <div
      className="cw-panel"
      role="dialog"
      aria-label={`${config.brandName} chat`}
      tabIndex={-1}
      ref={panelRef}
      onKeyDown={(e) => {
        if (e.key === 'Escape') close();
      }}
    >
      <div className="cw-header">
        <span className="cw-title">{config.brandName}</span>
        <button type="button" className="cw-close" aria-label="Close chat" onClick={close}>
          ×
        </button>
      </div>

      <div className="cw-messages" ref={messagesRef} aria-live="polite">
        {chat.messages.map((m) => (
          <div
            key={m.id}
            className={`cw-bubble ${m.role === 'bot' ? 'cw-bubble-bot' : 'cw-bubble-user'}`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {chat.sending && (
        <div className="cw-typing" aria-live="polite" aria-label="Assistant is typing">
          <span /><span /><span />
        </div>
      )}

      <div className="cw-controls">
        {chat.mode === 'tree' && chat.awaiting === 'options' &&
          chat.options.map((opt, i) => (
            <button
              key={opt.label}
              type="button"
              className="cw-option"
              onClick={() => chat.choose(i)}
            >
              {opt.label}
            </button>
          ))}

        {chat.mode === 'tree' && chat.awaiting === 'capture' && (
          <>
            <form className="cw-inputrow" onSubmit={onSubmit}>
              <input
                ref={inputRef}
                className="cw-input"
                type={inputType}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type your answer…"
                aria-label="Your answer"
                autoComplete={
                  chat.captureField === 'email'
                    ? 'email'
                    : chat.captureField === 'phone'
                      ? 'tel'
                      : chat.captureField === 'name'
                        ? 'name'
                        : 'off'
                }
              />
              <button type="submit" className="cw-send" disabled={!draft.trim()}>
                Send
              </button>
            </form>
            {chat.optionalCapture && (
              <button type="button" className="cw-skip" onClick={chat.skip}>
                {chat.skipLabel ?? 'Skip'}
              </button>
            )}
          </>
        )}

        {chat.composer && (
          <form className="cw-inputrow" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              className="cw-input"
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message…"
              aria-label="Your message"
              autoComplete="off"
            />
            <button type="submit" className="cw-send" disabled={!draft.trim() || chat.sending}>
              Send
            </button>
          </form>
        )}

        {chat.showCta && (
          <>
            {config.ctaPhone && (
              <a className="cw-cta cw-cta-primary" href={`tel:${digitsToTel(config.ctaPhone)}`}>
                Call {config.ctaPhone}
              </a>
            )}
            {config.ctaFormHref && (
              <a className="cw-cta cw-cta-secondary" href={config.ctaFormHref} onClick={close}>
                Open contact form
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}
