import { Tree } from '../types';
import { northstar } from './northstar';

/** Registry of code-defined trees, keyed by `treeId`. */
export const trees: Record<string, Tree> = {
  northstar,
};

export const DEFAULT_TREE_ID = 'northstar';

export function getTree(treeId?: string): Tree {
  return trees[treeId ?? DEFAULT_TREE_ID] ?? trees[DEFAULT_TREE_ID];
}
