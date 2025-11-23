import { AnyCanvasItem } from '../types';

export const findItemInTree = (
    itemId: string, 
    tree: AnyCanvasItem[],
    parentItem: AnyCanvasItem | null = null
): { item: AnyCanvasItem; parentArray: AnyCanvasItem[]; index: number; parentItem: AnyCanvasItem | null } | null => {
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i];
    if (item.id === itemId) {
      return { item, parentArray: tree, index: i, parentItem };
    }
    // FIX: Check if item is an ELEMENT and has array content before recursing.
    // This resolves the error where 'content' doesn't exist on all AnyCanvasItem types.
    if (item.type === 'ELEMENT' && Array.isArray(item.content)) {
      const found = findItemInTree(itemId, item.content, item);
      if (found) {
        return found;
      }
    }
  }
  return null;
};