import React, { ReactNode, useRef, useEffect } from 'react';
import { AnyCanvasItem, DndSourceData } from '../../types';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Trash2, Box, Lock, Unlock } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

interface SelectionWrapperProps {
  children: ReactNode;
  item: AnyCanvasItem;
  isSelected: boolean;
  isHighlightedParent: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const ResizeHandle = ({ onMouseDown, className, cursor, children }: { onMouseDown: (e: React.MouseEvent) => void, className: string, cursor: string, children: React.ReactNode }) => (
    <div
        onMouseDown={onMouseDown}
        // This is the hitbox, larger and transparent
        className={`absolute z-20 ${className} ${cursor} flex items-center justify-center`}
    >
        {/* This is the visual indicator */}
        {children}
    </div>
);


export const SelectionWrapper = ({ children, item, isSelected, isHighlightedParent, onClick }: SelectionWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { deleteItem, openModal, updateItem, toggleItemLock } = useApp();
  const isLocked = !!item.locked;

  useEffect(() => {
    const el = ref.current;
    if (!el || isLocked) return;

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({ type: 'canvas-item', itemId: item.id } as DndSourceData),
      }),
      dropTargetForElements({
        element: el,
        getData: () => ({ id: item.id }),
      })
    );
  }, [item.id, isLocked]);

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    if (isLocked) return;
    e.preventDefault();
    e.stopPropagation();
    const el = ref.current;
    if (!el) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = el.offsetWidth;
    const startH = el.offsetHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        let newWidth = startW;
        let newHeight = startH;

        if (handle.includes('right')) newWidth = startW + dx;
        if (handle.includes('left')) newWidth = startW - dx;
        if (handle.includes('bottom')) newHeight = startH + dy;
        if (handle.includes('top')) newHeight = startH - dy;
        
        const newProps = {
            ...item.props,
            style: {
                ...(item.props.style || {}),
                width: `${Math.max(20, newWidth)}px`,
                height: `${Math.max(20, newHeight)}px`,
            }
        };
        updateItem(item.id, { props: newProps });
    };

    const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  
  const highlightClasses = isSelected
    ? 'selection-highlight-animated'
    : isHighlightedParent
    ? 'parent-highlight'
    : 'hover:outline hover:outline-1 hover:outline-juki-green/50';

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`relative ${highlightClasses} transition-all duration-75`}
      style={item.props.style} // Apply inline styles for resizing to work
    >
      {isSelected && (
        <>
            <div className="absolute -top-6 left-0 flex items-center gap-1 z-30">
                <div className="bg-juki-green text-black text-xs font-bold px-2 py-0.5 rounded-t-md pointer-events-none">
                    {item.name}
                </div>
                <div className="flex items-center bg-juki-green rounded-t-md">
                    {/* FIX: Removed stray '_' character that was causing a syntax error. */}
                    <button onClick={(e) => { e.stopPropagation(); toggleItemLock(item.id) }} title={isLocked ? "Unlock" : "Lock"} className="p-1 text-black hover:bg-black/20">
                        {isLocked ? <Lock size={14}/> : <Unlock size={14}/>}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); openModal({ type: 'CREATE_COMPONENT', sourceItemIds: [item.id] }); }} title="Save as Component" className="p-1 text-black hover:bg-black/20 disabled:text-black/50 disabled:cursor-not-allowed" disabled={isLocked}><Box size={14}/></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} title="Delete" className="p-1 text-black hover:bg-black/20 disabled:text-black/50 disabled:cursor-not-allowed" disabled={isLocked}><Trash2 size={14}/></button>
                </div>
            </div>
            {isLocked && (
              <div className="absolute top-1 right-1 z-20 p-1 bg-black/60 rounded-full pointer-events-none">
                  <Lock size={12} className="text-white"/>
              </div>
            )}
            {!isLocked && (
                <>
                    {/* Corner Handles */}
                    {/* FIX: Added children to ResizeHandle components to provide visual indicators and fix missing 'children' prop error. */}
                    <ResizeHandle onMouseDown={(e) => handleResizeStart(e, 'top-left')} className="w-5 h-5 -top-2.5 -left-2.5" cursor="cursor-nwse-resize">
                        <div className="absolute w-3 h-3 top-0 left-0">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-juki-green border border-black"></div>
                            <div className="absolute top-0 left-0 w-[3px] h-full bg-juki-green border border-black"></div>
                        </div>
                    </ResizeHandle>
                    {/* FIX: Added children to ResizeHandle components to provide visual indicators and fix missing 'children' prop error. */}
                    <ResizeHandle onMouseDown={(e) => handleResizeStart(e, 'top-right')} className="w-5 h-5 -top-2.5 -right-2.5" cursor="cursor-nesw-resize">
                        <div className="absolute w-3 h-3 top-0 right-0">
                            <div className="absolute top-0 right-0 w-full h-[3px] bg-juki-green border border-black"></div>
                            <div className="absolute top-0 right-0 w-[3px] h-full bg-juki-green border border-black"></div>
                        </div>
                    </ResizeHandle>
                    {/* FIX: Added children to ResizeHandle components to provide visual indicators and fix missing 'children' prop error. */}
                    <ResizeHandle onMouseDown={(e) => handleResizeStart(e, 'bottom-left')} className="w-5 h-5 -bottom-2.5 -left-2.5" cursor="cursor-nesw-resize">
                         <div className="absolute w-3 h-3 bottom-0 left-0">
                            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-juki-green border border-black"></div>
                            <div className="absolute bottom-0 left-0 w-[3px] h-full bg-juki-green border border-black"></div>
                        </div>
                    </ResizeHandle>
                    {/* FIX: Added children to ResizeHandle components to provide visual indicators and fix missing 'children' prop error. */}
                    <ResizeHandle onMouseDown={(e) => handleResizeStart(e, 'bottom-right')} className="w-5 h-5 -bottom-2.5 -right-2.5" cursor="cursor-nwse-resize">
                        <div className="absolute w-3 h-3 bottom-0 right-0">
                            <div className="absolute bottom-0 right-0 w-full h-[3px] bg-juki-green border border-black"></div>
                            <div className="absolute bottom-0 right-0 w-[3px] h-full bg-juki-green border border-black"></div>
                        </div>
                    </ResizeHandle>

                    {/* Side Handles */}
                    {/* FIX: Added children to ResizeHandle components to provide visual indicators and fix missing 'children' prop error. */}
                    <ResizeHandle onMouseDown={(e) => handleResizeStart(e, 'top')} className="h-4 w-8 -top-2 left-1/2 -translate-x-1/2" cursor="cursor-ns-resize">
                        <div className="absolute top-0 h-[5px] w-6 bg-juki-green border border-black rounded"></div>
                    </ResizeHandle>
                    {/* FIX: Added children to ResizeHandle components to provide visual indicators and fix missing 'children' prop error. */}
                    <ResizeHandle onMouseDown={(e) => handleResizeStart(e, 'bottom')} className="h-4 w-8 -bottom-2 left-1/2 -translate-x-1/2" cursor="cursor-ns-resize">
                         <div className="absolute bottom-0 h-[5px] w-6 bg-juki-green border border-black rounded"></div>
                    </ResizeHandle>
                    {/* FIX: Added children to ResizeHandle components to provide visual indicators and fix missing 'children' prop error. */}
                     <ResizeHandle onMouseDown={(e) => handleResizeStart(e, 'left')} className="w-4 h-8 -left-2 top-1/2 -translate-y-1/2" cursor="cursor-ew-resize">
                        <div className="absolute left-0 w-[5px] h-6 bg-juki-green border border-black rounded"></div>
                    </ResizeHandle>
                    {/* FIX: Added children to ResizeHandle components to provide visual indicators and fix missing 'children' prop error. */}
                     <ResizeHandle onMouseDown={(e) => handleResizeStart(e, 'right')} className="w-4 h-8 -right-2 top-1/2 -translate-y-1/2" cursor="cursor-ew-resize">
                        <div className="absolute right-0 w-[5px] h-6 bg-juki-green border border-black rounded"></div>
                    </ResizeHandle>
                </>
            )}
        </>
      )}
      {children}
    </div>
  );
};