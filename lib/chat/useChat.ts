'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatConfig, ChatMessage, Lead, LeadFieldName, TreeOption } from './types';
import {
  EngineState,
  Step,
  startTree,
  chooseOption,
  submitCapture,
  skipCapture,
} from './tree';
import { getTree } from './trees';
import { extractLead } from './extract';

const AI_FALLBACK =
  'Sorry — I’m having trouble responding right now. A specialist would be glad to help; please use the options below.';

export interface UseChat {
  mode: 'tree' | 'ai';
  messages: ChatMessage[];
  // tree mode
  options: TreeOption[];
  awaiting: 'options' | 'capture' | 'none';
  captureField: LeadFieldName | null;
  optionalCapture: boolean;
  skipLabel: string | null;
  choose: (index: number) => void;
  submit: (value: string) => void;
  skip: () => void;
  // ai mode
  composer: boolean;
  sending: boolean;
  send: (value: string) => void;
  // shared
  ended: boolean;
  showCta: boolean;
  /** Best-effort one-shot lead log; call on close/unload. */
  flush: () => void;
}

function transcriptOf(messages: ChatMessage[]): string {
  return messages.map((m) => `${m.role === 'bot' ? 'Assistant' : 'You'}: ${m.text}`).join('\n');
}

export function useChat(config: ChatConfig): UseChat {
  const isTree = config.mode === 'tree';

  const idRef = useRef(0);
  const nextId = () => `m${idRef.current++}`;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [engine, setEngine] = useState<EngineState | null>(null);
  const [sending, setSending] = useState(false);

  // Refs mirror the latest values for unload-time flushing and async sends.
  const leadRef = useRef<Lead>({});
  const messagesRef = useRef<ChatMessage[]>([]);
  const loggedRef = useRef(false);
  messagesRef.current = messages;

  const botLines = useCallback(
    (lines: string[]): ChatMessage[] => lines.map((text) => ({ id: nextId(), role: 'bot', text })),
    []
  );

  const logLead = useCallback(() => {
    if (loggedRef.current) return;
    const lead = leadRef.current;
    if (!lead.email && !lead.phone) return;
    loggedRef.current = true;
    try {
      fetch('/api/chat/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead, transcript: transcriptOf(messagesRef.current) }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* best effort */
    }
  }, []);

  // Initialize once on mount.
  useEffect(() => {
    const intro: ChatMessage[] = config.welcomeMessage
      ? [{ id: nextId(), role: 'bot', text: config.welcomeMessage }]
      : [];

    if (!isTree) {
      // AI mode opens with the welcome message (no scripted greeting).
      setMessages(
        intro.length
          ? intro
          : [{ id: nextId(), role: 'bot', text: `Hi! How can I help you today?` }]
      );
      return;
    }

    const tree = getTree(config.treeId);
    const step = startTree(tree);
    setEngine(step.state);
    setMessages([...intro, ...botLines(step.say)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Tree-mode transitions ----------------------------------------------

  const apply = useCallback(
    (step: Step) => {
      setMessages((prev) => {
        const added: ChatMessage[] = [];
        if (step.userText) added.push({ id: nextId(), role: 'user', text: step.userText });
        for (const line of step.say) added.push({ id: nextId(), role: 'bot', text: line });
        return [...prev, ...added];
      });
      if (step.accepted) {
        setEngine(step.state);
        leadRef.current = step.state.lead;
        if (step.state.done) logLead();
      }
    },
    [logLead]
  );

  const choose = useCallback(
    (index: number) => {
      if (!engine) return;
      apply(chooseOption(engine, index));
    },
    [engine, apply]
  );

  const submit = useCallback(
    (value: string) => {
      if (!engine) return;
      const v = value.trim();
      if (!v) return;
      apply(submitCapture(engine, v));
    },
    [engine, apply]
  );

  const skip = useCallback(() => {
    if (!engine) return;
    apply(skipCapture(engine));
  }, [engine, apply]);

  // --- AI-mode send -------------------------------------------------------

  const send = useCallback(
    async (value: string) => {
      const v = value.trim();
      if (!v || sending) return;

      const userMsg: ChatMessage = { id: nextId(), role: 'user', text: v };
      const next = [...messagesRef.current, userMsg];
      messagesRef.current = next;
      setMessages(next);

      // Opportunistic lead capture (email/phone). Logs once when known.
      const found = extractLead(v);
      if (found.email || found.phone) {
        leadRef.current = { ...leadRef.current, ...found };
        logLead();
      }

      setSending(true);
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: next.map((m) => ({ role: m.role, text: m.text })),
            knowledge: config.knowledge,
            brandName: config.brandName,
            captureEmail: config.captureEmail,
            ctaPhone: config.ctaPhone,
            ctaFormHref: config.ctaFormHref,
          }),
        });
        const data = await res.json().catch(() => ({}));
        const reply = (res.ok && data.reply) || data.error || AI_FALLBACK;
        setMessages((prev) => [...prev, { id: nextId(), role: 'bot', text: reply }]);
      } catch {
        setMessages((prev) => [...prev, { id: nextId(), role: 'bot', text: AI_FALLBACK }]);
      } finally {
        setSending(false);
      }
    },
    [sending, config, logLead]
  );

  // Flush the lead on tab hide / page unload (covers partial conversations).
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') logLead();
    };
    window.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', logLead);
    return () => {
      window.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', logLead);
      logLead(); // unmount = closed
    };
  }, [logLead]);

  const node = engine ? engine.tree.nodes[engine.currentId] : null;

  return {
    mode: isTree ? 'tree' : 'ai',
    messages,
    options: node?.options ?? [],
    awaiting: engine?.awaiting ?? 'none',
    captureField: node?.capture?.field ?? null,
    optionalCapture: Boolean(node?.capture?.optional),
    skipLabel: node?.capture?.skipLabel ?? null,
    choose,
    submit,
    skip,
    composer: !isTree,
    sending,
    send,
    // Tree: CTA only on a terminal node. AI: escalation is always available.
    ended: isTree ? (engine?.done ?? false) : false,
    showCta: isTree ? Boolean(node?.cta) : true,
    flush: logLead,
  };
}
