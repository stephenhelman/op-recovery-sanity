import { Tree, ChatConfig } from '../types';
import { northstar } from './northstar';
import { buildScaffold, scaffoldOnlyTree } from './scaffold';
import { compileTree } from './compile';

/** Registry of code-defined trees, keyed by `treeId` (fallback defaults). */
export const trees: Record<string, Tree> = {
  northstar,
};

export const DEFAULT_TREE_ID = 'northstar';

export function getTree(treeId?: string): Tree {
  return trees[treeId ?? DEFAULT_TREE_ID] ?? trees[DEFAULT_TREE_ID];
}

/**
 * Resolve the runtime tree for a widget config. This is where the widget goes
 * data-defined:
 *   1. `treeJson` present → compile it onto the scaffold. The compiler validates
 *      and, on any failure, falls back to the scaffold-only tree internally.
 *   2. no `treeJson` but a known code tree → the existing code default (e.g.
 *      `northstar`), so live configs keep working unchanged.
 *   3. otherwise (brand-new client) → the scaffold-only tree.
 *
 * Both the website tree mode and the future Meta channels call this same
 * compiled tree.
 */
export function resolveTree(config: Pick<ChatConfig, 'treeId' | 'treeJson'>): Tree {
  const scaffold = buildScaffold(config.treeId || 'client');

  if (config.treeJson && config.treeJson.trim()) {
    return compileTree(scaffold, config.treeJson);
  }

  if (config.treeId && trees[config.treeId]) {
    return trees[config.treeId];
  }

  return scaffoldOnlyTree(scaffold);
}
