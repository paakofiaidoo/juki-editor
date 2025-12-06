import React, { useRef, useEffect, useState } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DndSourceData, UserComponent, DraggableComponentSpec } from "../../types";
import { PreviewRenderer } from "./PreviewRenderer";

interface DraggableComponentPreviewProps {
    component: UserComponent;
    allUserComponents: UserComponent[];
}

// FIX: Changed component to React.FC to resolve issues with the 'key' prop in maps.
export const DraggableComponentPreview: React.FC<DraggableComponentPreviewProps> = ({ component, allUserComponents }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const itemSpec: DraggableComponentSpec = {
            id: `comp-${component.id}`,
            name: component.name,
            description: component.description,
            item: {
                type: "COMPONENT",
                componentType: component.id,
                props: {},
            },
        };

        const el = ref.current;
        if (!el) return;

        return draggable({
            element: el,
            getInitialData: () => ({ type: "new-item", itemId: itemSpec.id, itemSpec } as unknown as Record<string, unknown>),
            onDragStart: () => setIsDragging(true),
            onDrop: () => setIsDragging(false),
        });
    }, [component]);

    return (
        <div ref={ref} className={`p-2 rounded border bg-juki-dark-2 border-juki-dark-3 cursor-grab ${isDragging ? "opacity-50" : ""}`}>
            <div className="relative group">
                <p className="font-semibold text-white truncate text-sm mb-1">{component.name}</p>

                <div className="h-20 w-full bg-white text-black relative overflow-hidden pointer-events-none rounded flex items-center justify-center p-2">
                    {component.root ? <PreviewRenderer item={component.root} userComponents={allUserComponents} /> : <div className="text-xs text-red-500">No root</div>}
                </div>
                <p className="text-xs text-gray-400 truncate mt-1 h-4">{component.description}</p>
            </div>
        </div>
    );
};
