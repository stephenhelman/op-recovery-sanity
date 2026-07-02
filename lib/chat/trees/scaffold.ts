import { Tree, TreeNode, TreeOption } from '../types';

/**
 * Fixed decision-tree scaffold — the house-style shell every surplus-recovery
 * client shares. It owns the parts that must never be client-authored:
 *   greeting → menu shell → escalate-and-capture flow (name → email → phone →
 *   confirm) → graceful end, plus the shared base content node `@about`.
 *
 * The compiler (`compile.ts`) fills the menu shell from a client's generated
 * treeJson and merges in their content nodes. On its own — with no treeJson —
 * the scaffold is already a valid, compliant, runnable tree.
 *
 * SAFETY: capture / escalation / end / cta live ONLY here. Generated content
 * nodes can express `say` + `options` and route via reserved targets, and
 * nothing else — so a generated node is structurally unable to bypass the
 * capture flow or dead-end a visitor.
 *
 * Reserved-target ids use the `__` prefix so they can never collide with a
 * generated content-node id (the schema forbids `__`-prefixed ids).
 */

export const SCAFFOLD_MENU_ID = '__menu';
export const SCAFFOLD_ABOUT_ID = '__about';
export const SCAFFOLD_CAPTURE_ID = '__capture';
export const SCAFFOLD_END_ID = '__end';

/** Maps the four reserved targets to their concrete scaffold node ids. */
export const RESERVED_TARGETS: Record<string, string> = {
  '@menu': SCAFFOLD_MENU_ID,
  '@about': SCAFFOLD_ABOUT_ID,
  '@capture': SCAFFOLD_CAPTURE_ID,
  '@end': SCAFFOLD_END_ID,
};

/** Greeting + menu-shell prompt shown by the scaffold's menu node. */
const MENU_GREETING = [
  'Hi! I can help answer a few common questions and connect you with the team.',
  'What would you like to know?',
];

/**
 * The scaffold-only menu, used when a client has no (or invalid) treeJson.
 * Minimal and compliant: learn what surplus funds are, or talk to someone.
 */
const DEFAULT_MENU: TreeOption[] = [
  { label: 'What are surplus funds?', next: '@about' },
  { label: 'I’d like to talk to someone', next: '@capture' },
];

/**
 * The fixed base nodes (everything except the menu node, which the compiler
 * builds from the resolved menu entries). These are merged in as-is.
 */
function scaffoldBaseNodes(): Record<string, TreeNode> {
  return {
    // Shared base content: the generic "what are surplus funds" explanation.
    // The generator links to this via `@about` instead of regenerating it.
    [SCAFFOLD_ABOUT_ID]: {
      id: SCAFFOLD_ABOUT_ID,
      say: [
        'Surplus funds are money left over when a property is sold at a foreclosure or tax sale for more than what was owed. That extra money doesn’t belong to the lender or the buyer.',
        'It’s usually held by a government office until the rightful party claims it, and many people never realize it exists. Who’s entitled is reviewed individually — it isn’t something I can determine here.',
      ],
      options: [
        { label: 'Start my free review', next: SCAFFOLD_CAPTURE_ID },
        { label: 'Back to menu', next: SCAFFOLD_MENU_ID },
      ],
    },

    // --- Escalate-and-capture flow: name → email → phone → confirm ---
    [SCAFFOLD_CAPTURE_ID]: {
      id: SCAFFOLD_CAPTURE_ID,
      say: [
        'Great — let’s get you connected with the team.',
        'First, what’s your name?',
      ],
      capture: {
        field: 'name',
        invalid: 'Sorry, I didn’t catch that — could you type your name?',
        next: '__capture_email',
      },
    },
    __capture_email: {
      id: '__capture_email',
      say: ['Thanks! What’s the best email address to reach you?'],
      capture: {
        field: 'email',
        invalid: 'That doesn’t look like a valid email — could you double-check and re-enter it?',
        next: '__capture_phone',
      },
    },
    __capture_phone: {
      id: '__capture_phone',
      say: ['And a phone number, in case a specialist would like to call? (Optional.)'],
      capture: {
        field: 'phone',
        invalid: 'That doesn’t look like a valid phone number — please use a 10-digit format, or skip.',
        optional: true,
        skipLabel: 'Skip for now',
        next: '__done',
      },
    },
    __done: {
      id: '__done',
      say: [
        'Perfect — you’re all set. A specialist will review your information and reach out, typically within one business day.',
        'If you’d like to connect sooner, you can reach out directly below.',
      ],
      end: true,
      cta: true,
    },

    // Graceful sign-off for the "just looking" path (@end).
    [SCAFFOLD_END_ID]: {
      id: SCAFFOLD_END_ID,
      say: [
        'No problem at all. Whenever you’re ready, the team is here to help — feel free to reach out anytime.',
      ],
      end: true,
      cta: true,
    },
  };
}

export interface Scaffold {
  /** Runtime tree id (used in engine error messages). */
  id: string;
  /** Start node — the menu shell. */
  start: string;
  /** Id of the menu node whose options the compiler fills. */
  menuNodeId: string;
  /** Greeting + prompt the menu node says. */
  menuGreeting: string[];
  /** Fixed base nodes (excludes the menu node). */
  nodes: Record<string, TreeNode>;
  /** Reserved target → scaffold node id. */
  reserved: Record<string, string>;
  /** Menu used when there is no valid treeJson. */
  defaultMenu: TreeOption[];
}

/** Build a fresh scaffold for a client (id defaults to a neutral value). */
export function buildScaffold(id: string = 'client'): Scaffold {
  return {
    id,
    start: SCAFFOLD_MENU_ID,
    menuNodeId: SCAFFOLD_MENU_ID,
    menuGreeting: MENU_GREETING,
    nodes: scaffoldBaseNodes(),
    reserved: { ...RESERVED_TARGETS },
    defaultMenu: DEFAULT_MENU.map((o) => ({ ...o })),
  };
}

/** Resolve a reserved target (`@x`) or content-node id to a runtime node id. */
export function resolveTarget(next: string, scaffold: Scaffold): string {
  return next.startsWith('@') ? scaffold.reserved[next] ?? next : next;
}

/**
 * The scaffold on its own as a runnable tree: greeting → default menu →
 * `@about` / capture. This is the safe fallback the compiler returns on any
 * validation failure, and the default flow for a client with no treeJson.
 */
export function scaffoldOnlyTree(scaffold: Scaffold): Tree {
  const menuNode: TreeNode = {
    id: scaffold.menuNodeId,
    say: scaffold.menuGreeting,
    options: scaffold.defaultMenu.map((o) => ({
      label: o.label,
      next: resolveTarget(o.next, scaffold),
    })),
  };
  return {
    id: scaffold.id,
    start: scaffold.start,
    nodes: { [menuNode.id]: menuNode, ...scaffold.nodes },
  };
}
