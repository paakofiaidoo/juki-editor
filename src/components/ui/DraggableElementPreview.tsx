import React, { useRef, useEffect, useState } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DndSourceData, DraggableElementSpec, AnyCanvasItem } from "../../types";
import { PreviewRenderer } from "./PreviewRenderer";

interface DraggableElementPreviewProps {
    elementSpec: DraggableElementSpec;
}

// FIX: Changed component to React.FC to resolve issues with the 'key' prop in maps.
export const DraggableElementPreview: React.FC<DraggableElementPreviewProps> = ({ elementSpec }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        return draggable({
            element: el,
            getInitialData: () => ({ type: "new-item", itemId: elementSpec.id, itemSpec: elementSpec } as unknown as Record<string, unknown>),
            onDragStart: () => setIsDragging(true),
            onDrop: () => setIsDragging(false),
        });
    }, [elementSpec]);

    // Create a renderable item from the spec for the previewer
    const previewItem: AnyCanvasItem = {
        ...elementSpec.item,
        id: "preview",
        name: elementSpec.name,
    } as AnyCanvasItem;

    return (
        <div ref={ref} className={`p-2 rounded border bg-juki-dark-2 border-juki-dark-3 cursor-grab ${isDragging ? "opacity-50" : ""}`}>
            <div className="relative group">
                <p className="font-semibold text-white truncate text-sm mb-1">{elementSpec.name}</p>

                <div className="h-20 w-full bg-white text-black relative overflow-hidden pointer-events-none rounded flex items-center justify-center p-2">
                    <PreviewRenderer item={previewItem} userComponents={[]} />
                </div>
                <p className="text-xs text-gray-400 truncate mt-1 h-4">{elementSpec.description}</p>
            </div>
        </div>
    );
};
