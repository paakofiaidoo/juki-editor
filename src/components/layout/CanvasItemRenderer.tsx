import React, { useRef, useState, useEffect } from "react";
import { AnyCanvasItem, ComponentCanvasItem, IconCanvasItem } from "../../types";
import { useApp } from "../../hooks/useApp";
import { SelectionWrapper } from "../ui/SelectionWrapper";
import { getIconMap } from "../../utils/iconUtils";
import { AlertTriangle } from "lucide-react";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { attachClosestEdge, extractClosestEdge, Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "../ui/DropIndicator";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { motion } from "framer-motion";

interface CanvasItemRendererProps {
    item: AnyCanvasItem;
}

export const CanvasItemRenderer: React.FC<CanvasItemRendererProps> = ({ item }) => {
    const { activeProject, selectedItemIds, setSelectedItemId, addSelectedItem, highlightedParentId, cmsCollections } = useApp();
    const ref = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

    const resolveBinding = (value: any): any => {
        if (typeof value !== "string") return value;
        if (!value.startsWith("{{") || !value.endsWith("}}")) return value;

        const path = value.slice(2, -2).trim(); // Remove {{ and }}
        const parts = path.split(".");
        if (parts.length !== 3) return value; // Expect collection.item.field

        const [colId, itemId, fieldName] = parts;
        const collection = cmsCollections.find((c) => c.id === colId);
        if (!collection) return `[Collection '${colId}' not found]`;

        const item = collection.items.find((i) => i.id === itemId);
        if (!item) return `[Item '${itemId}' not found]`;

        const fieldValue = item.data[fieldName];
        if (fieldValue === undefined) return `[Field '${fieldName}' not found]`;

        return fieldValue;
    };

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        return combine(
            draggable({
                element: el,
                getInitialData: () => ({ type: "canvas-item", itemId: item.id, item }),
                onDragStart: () => setIsDragging(true),
                onDrop: () => setIsDragging(false),
            }),
            dropTargetForElements({
                element: el,
                getData: ({ input, element }) => {
                    const data = { type: "canvas-item", itemId: item.id, item };
                    return attachClosestEdge(data, { input, element, allowedEdges: ["top", "bottom", "left", "right"] });
                },
                onDragEnter: ({ self }) => {
                    setClosestEdge(extractClosestEdge(self.data));
                },
                onDrag: ({ self }) => {
                    setClosestEdge(extractClosestEdge(self.data));
                },
                onDragLeave: () => {
                    setClosestEdge(null);
                },
                onDrop: () => {
                    setClosestEdge(null);
                },
            })
        );
    }, [item]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (e.shiftKey) {
            addSelectedItem(item.id);
        } else {
            setSelectedItemId(item.id);
        }
    };

    const isSelected = selectedItemIds.includes(item.id);
    const isHighlightedParent = item.id === highlightedParentId && !isSelected;

    const renderContent = () => {
        if (item.type === "ELEMENT" && typeof item.content === "string") {
            return <div className="pointer-events-none">{resolveBinding(item.content)}</div>;
        }
        if (item.type === "ELEMENT" && Array.isArray(item.content)) {
            return item.content.filter((c) => c).map((child) => <CanvasItemRenderer key={child.id} item={child} />);
        }
        return null;
    };

    const renderItem = () => {
        const { style, ...restProps } = item.props;

        // Resolve bindings in props
        const resolvedProps: Record<string, any> = {};
        Object.entries(restProps).forEach(([key, value]) => {
            resolvedProps[key] = resolveBinding(value);
        });

        const props = { ...resolvedProps, id: item.id };

        // Animation props
        const animationProps = item.animation
            ? {
                  initial: item.animation.initial,
                  animate: item.animation.animate,
                  whileHover: item.animation.whileHover,
                  whileTap: item.animation.whileTap,
                  transition: item.animation.transition,
              }
            : {};

        if (item.type === "ELEMENT") {
            const Tag = item.tag as any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const MotionTag = (motion as any)[Tag];

            if (MotionTag) {
                return (
                    <MotionTag {...props} {...animationProps}>
                        {renderContent()}
                    </MotionTag>
                );
            }
            const FallbackTag = item.tag as React.ElementType;
            return <FallbackTag {...props}>{renderContent()}</FallbackTag>;
        }

        if (item.type === "ICON") {
            const icon = item as IconCanvasItem;
            const IconComponent = getIconMap()[icon.iconName];
            if (IconComponent) {
                return (
                    <motion.div {...props} {...animationProps} style={{ display: "inline-block" }}>
                        <IconComponent />
                    </motion.div>
                );
            }
            return (
                <div {...props} className="text-red-500 flex items-center gap-1">
                    <AlertTriangle size={16} /> Unknown Icon
                </div>
            );
        }

        if (item.type === "COMPONENT") {
            const componentDef = activeProject?.userComponents.find((c) => c.id === (item as ComponentCanvasItem).componentType);
            if (!componentDef) {
                return (
                    <div {...props} className={`p-2 border border-dashed border-red-500 text-red-500 text-sm flex items-center gap-1 ${item.props.className || ""}`}>
                        <AlertTriangle size={16} /> Component: {item.name} (Not Found)
                    </div>
                );
            }

            if (!componentDef.root) {
                return (
                    <div {...props} className={`p-2 border border-dashed border-yellow-500 text-yellow-500 text-sm flex items-center gap-1 ${item.props.className || ""}`}>
                        <AlertTriangle size={16} /> Component: {item.name} (has no root element)
                    </div>
                );
            }

            const root = componentDef.root;
            const mergedProps = { ...root.props, ...props };

            if (root.type === "ELEMENT") {
                const Tag = root.tag as any;
                const content = root.content;

                const renderRootContent = () => {
                    if (typeof content === "string") {
                        return <div className="pointer-events-none">{content}</div>;
                    }
                    if (Array.isArray(content)) {
                        return content.filter((c) => c).map((child) => <CanvasItemRenderer key={child.id} item={child} />);
                    }
                    return null;
                };

                const MotionTag = (motion as any)[Tag];
                if (MotionTag) {
                    return (
                        <MotionTag {...mergedProps} {...animationProps}>
                            {renderRootContent()}
                        </MotionTag>
                    );
                }
                const FallbackTag = root.tag as React.ElementType;
                return <FallbackTag {...mergedProps}>{renderRootContent()}</FallbackTag>;
            }

            return (
                <div {...props} className={`p-2 border border-dashed border-yellow-500 text-yellow-500 text-sm ${item.props.className || ""}`}>
                    Invalid Component Root for: {item.name}
                </div>
            );
        }
        return (
            <div {...props} className={`p-4 border border-dashed border-cyan-500 ${item.props.className || ""}`}>
                Module: {item.name}
            </div>
        );
    };

    return (
        <div ref={ref} className={`relative ${isDragging ? "opacity-50" : ""}`}>
            <DropIndicator edge={closestEdge} gap="2px" />
            <SelectionWrapper item={item} isSelected={isSelected} isHighlightedParent={isHighlightedParent} onClick={handleClick}>
                {renderItem()}
            </SelectionWrapper>
        </div>
    );
};
