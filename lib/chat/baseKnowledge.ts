/**
 * Shared, vertical-scoped domain layer for surplus-recovery clients. Composed
 * between the persona and the client's Sanity differentiators inside
 * buildSystemPrompt — the same for every recovery client, like the persona and
 * guardrails.
 *
 * It states ONLY what is true and safe for EVERY surplus-recovery firm, and is
 * deliberately SILENT on anything that varies per firm or carries a claim —
 * fees, exact process steps, states served, timelines, guarantees. Those live in
 * the per-client differentiator layer (Sanity `knowledge`).
 *
 * COMPLIANCE: this ships to every client in the vertical — treat it like the
 * guardrails. An error here propagates to all clients; review before changing.
 * Keep it a named constant so a different vertical can swap in its own base later.
 */
export const SURPLUS_RECOVERY_BASE = `*General background about surplus recovery. The specifics of this firm — its fees, process, the states it works in, and timelines — are provided in the client-specific section that follows, which takes precedence over anything here.*

**What surplus (or "excess") funds are.** When a property is sold at a foreclosure sale or a tax sale for more than the amount owed, the leftover money — the surplus — does not belong to the buyer or the lender. It is typically held by a government office (such as a county, court, or tax authority) until the rightful party claims it. Many people never learn the money exists.

**Who they may belong to.** The surplus generally belongs to the former property owner, or — if that person has passed away — to their heirs. Establishing who is entitled, and proving it, is part of the claim process and is reviewed individually; it is not something that can be confirmed in a chat.

**How claims generally work.** Recovering surplus funds usually means filing a claim with the office holding the money and providing documentation — proof of identity and of one's connection to the property or the former owner. The exact requirements, forms, and process differ by jurisdiction. A recovery firm's role is to research where surplus may exist and to guide people through that process.

**Why wariness is understandable.** This is an area where some less scrupulous operators have contacted people with high-pressure tactics, so caution is reasonable and healthy. A legitimate firm is transparent about who it is, explains its process and any fees in writing before anything is signed, and never pressures anyone. It is completely fine for someone to take their time and ask questions.

**What the assistant does with this.** Use this background to explain the general picture in plain, reassuring language and to help people understand their situation. For anything specific to this firm — what it charges, exactly how it works, where it operates, how long things take — rely on the client-specific section below, and for anything about a person's individual case, eligibility, or amounts, route them to the team (per the rules that follow).`;
