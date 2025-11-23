import React, { useState, useRef, useEffect, FC } from 'react';
import { ChevronDown, ChevronRight, GripVertical, Trash2, Box, Sparkles, Component as ComponentIcon, Lock } from 'lucide-react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { DndSourceData, AnyCanvasItem, ComponentCanvasItem } from '../../types';
import { useApp } from '../../hooks/useApp';

interface LayerTreeItemProps {
  item: AnyCanvasItem;
  level: number;
}

// FIX: Changed component to React.FC to resolve issues with the 'key' prop in maps.
export const LayerTreeItem: React.FC<LayerTreeItemProps> = ({ item, level }) => {
  const { activeProject, selectedItemIds, setSelectedItemId, deleteItem, highlightedParentId } = useApp();
  const [isOpen, setIsOpen] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const isSelected = selectedItemIds.includes(item.id);
  const isHighlightedParent = item.id === highlightedParentId;
  const isLocked = !!item.locked;

  const getChildren = (currentItem: AnyCanvasItem): AnyCanvasItem[] => {
      if (currentItem.type === 'ELEMENT' && Array.isArray(currentItem.content)) {
          return currentItem.content;
      }
      if (currentItem.type === 'COMPONENT') {
          const componentDef = activeProject?.userComponents.find(c => c.id === (currentItem as ComponentCanvasItem).componentType);
          const root = componentDef?.root;
          if (root && root.type === 'ELEMENT' && Array.isArray(root.content)) {
              return root.content;
          }
      }
      return [];
  };

  const children = getChildren(item);
  const hasChildren = children.length > 0;
  const isContainer = item.type === 'ELEMENT' || (item.type === 'COMPONENT' && hasChildren);

  useEffect(() => {
    const el = ref.current;
    if (!el || isLocked) return;

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({ type: 'canvas-item', itemId: item.id } as DndSourceData),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element: el,
        getData: () => ({ id: item.id }),
      })
    );
  }, [item.id, isLocked]);
  
  const getIcon = () => {
      if (item.type === 'COMPONENT') return <ComponentIcon size={14} className="text-purple-400 mx-0.5" />;
      if (item.type === 'ICON') return <Sparkles size={14} className="text-yellow-400 mx-0.5" />;
      if (isContainer) return hasChildren ? null : <div className="w-[18px]" />;
      return <div className="w-[18px]" />;
  }

  const getBackgroundColor = () => {
    if (isSelected) return 'bg-juki-green/20';
    if (isHighlightedParent) return 'bg-blue-500/10';
    return 'hover:bg-juki-dark-3';
  }

  return (
    <div
      id={`layer-${item.id}`}
      className={`rounded-sm ${isDragging ? 'opacity-40' : ''}`}
    >
      <div
        ref={ref}
        onClick={() => setSelectedItemId(item.id)}
        className={`flex items-center text-sm rounded transition-colors group ${getBackgroundColor()}`}
        style={{ paddingLeft: `${level * 16}px` }}
      >
        <div className="flex items-center gap-1 flex-1 p-1 cursor-pointer">
          <GripVertical size={14} className={`text-gray-500 ${isLocked ? '' : 'cursor-grab'}`} />
          {isContainer && hasChildren ? (
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="p-0.5 rounded hover:bg-juki-dark-3">
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : getIcon()}
          <span className={`truncate ${isSelected ? 'text-juki-green' : 'text-gray-300'}`}>{item.name}</span>
          {isLocked && <Lock size={12} className="text-gray-500 ml-1 shrink-0" />}
        </div>
        <div className="hidden group-hover:flex items-center pr-1">
            <button
                onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                className="text-gray-500 hover:text-red-500 p-1 disabled:text-gray-700 disabled:cursor-not-allowed"
                disabled={isLocked}
                title={isLocked ? "Unlock to delete" : "Delete"}
            >
                <Trash2 size={14} />
            </button>
             <button
                title={isLocked ? "Unlock to create component" : "Create Component"}
                className="text-gray-500 hover:text-juki-green p-1 disabled:text-gray-700 disabled:cursor-not-allowed"
                disabled={isLocked}
                // onClick={() => openCreateComponentModal(item.id)}
             >
                <Box size={14} />
             </button>
        </div>
      </div>
      {isOpen && hasChildren && (
        <div>
          {children.filter(c => c).map(child => (
            <LayerTreeItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};