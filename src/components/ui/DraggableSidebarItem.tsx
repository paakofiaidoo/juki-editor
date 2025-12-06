import React, { useRef, useEffect, useState } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DraggableItemSpec, DndSourceData } from "../../types";

export const DraggableSidebarItem = ({ itemSpec }: { itemSpec: DraggableItemSpec }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        return draggable({
            element: el,
            getInitialData: () => ({ type: "new-item", itemId: itemSpec.id, itemSpec } as unknown as Record<string, unknown>),
            onDragStart: () => setIsDragging(true),
            onDrop: () => setIsDragging(false),
        });
    }, [itemSpec]);

    return (
        <div ref={ref} className={`bg-juki-dark-2 p-2 rounded border border-juki-dark-3 cursor-grab ${isDragging ? "opacity-50" : ""}`}>
            <p className="font-semibold text-white">{itemSpec.name}</p>
            <p className="text-xs text-gray-400">{itemSpec.description}</p>
        </div>
    );
};
