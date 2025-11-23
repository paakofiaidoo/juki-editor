import { AnyCanvasItem } from '../types';

export const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const cloneTreeWithNewIds = (items: AnyCanvasItem[]): AnyCanvasItem[] => {
  const clonedItems: AnyCanvasItem[] = JSON.parse(JSON.stringify(items));
  
  const assignNewIds = (arr: AnyCanvasItem[]) => {
    for (const item of arr) {
      item.id = crypto.randomUUID();
      // FIX: Check if item is an ELEMENT and has array content before recursing.
      // This resolves the error where 'content' doesn't exist on all AnyCanvasItem types.
      if (item.type === 'ELEMENT' && Array.isArray(item.content)) {
        assignNewIds(item.content);
      }
    }
  };
  
  assignNewIds(clonedItems);
  return clonedItems;
};