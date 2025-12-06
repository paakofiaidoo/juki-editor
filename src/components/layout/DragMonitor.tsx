import React, { useEffect } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { useApp } from "../../hooks/useApp";
import { DndInstruction, DraggableItemSpec } from "../../types";

export const DragMonitor = () => {
    const { addItem, moveItem } = useApp();

    useEffect(() => {
        return monitorForElements({
            onDrop({ source, location }) {
                const destination = location.current.dropTargets[0];
                if (!destination) return;

                const destData = destination.data;
                const sourceData = source.data;

                // Handle Sidebar Item Drop
                if (sourceData.type === "new-item") {
                    const itemSpec = sourceData.itemSpec as DraggableItemSpec;
                    const destId = destData.itemId as string | undefined;

                    if (destData.type === "canvas-root") {
                        addItem(null, itemSpec);
                    } else if (destData.type === "canvas-item" && destId) {
                        const edge = extractClosestEdge(destination.data);

                        // Determine index based on edge (simplified for now)
                        // Ideally we need to find the index of the target item
                        // For now, let's just use the edge to decide if we nest or sibling

                        // Logic:
                        // If edge is null (center) -> Nest
                        // If edge is top/bottom/left/right -> Sibling

                        // But addItem takes parentId and index.
                        // We need to find the parent of destId to add as sibling.
                        // Or pass destId and let context handle it?
                        // Context `addItem` signature: (parentId: string | null, itemSpec: DraggableItemSpec, index?: number)

                        // Let's update `addItem` to handle "relative to" logic or do it here?
                        // Doing it here requires tree traversal which is expensive.
                        // Let's assume for now we only support appending to root or nesting if dropped ON an item.

                        // Wait, `CanvasItemRenderer` uses `attachClosestEdge`.
                        // So we know if it's top/bottom/inside.

                        if (!edge) {
                            // Dropped inside
                            addItem(destId, itemSpec);
                        } else {
                            // Dropped relative to item (sibling)
                            // We need to find the parent of destId.
                            // This is hard without tree traversal.
                            // Let's defer "insert between" logic for sidebar items for a moment
                            // and just support "append to container" (nesting).
                            addItem(destId, itemSpec);
                        }
                    }
                }

                // Handle Canvas Item Move (Reordering)
                if (sourceData.type === "canvas-item") {
                    const itemId = sourceData.itemId as string;
                    const destId = destData.itemId as string | undefined;

                    if (destData.type === "canvas-root") {
                        moveItem(itemId, null, { type: "reorder-after" }); // Move to root end
                    } else if (destData.type === "canvas-item" && destId) {
                        const edge = extractClosestEdge(destination.data);
                        let instruction: DndInstruction = { type: "make-child" };

                        if (edge === "top" || edge === "left") instruction = { type: "reorder-before" };
                        if (edge === "bottom" || edge === "right") instruction = { type: "reorder-after" };

                        moveItem(itemId, destId, instruction);
                    }
                }
            },
        });
    }, [addItem, moveItem]);

    return null;
};
