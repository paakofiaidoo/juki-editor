import React, { useContext, useState, useRef, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { ChevronRight, ChevronDown, Database, FileText, Image as ImageIcon, Type, Hash, ToggleLeft } from "lucide-react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { CMSCollection, CMSItem, CMSFieldType, DraggableItemSpec } from "../../types";

const FieldIcon = ({ type }: { type: CMSFieldType }) => {
    switch (type) {
        case "text":
        case "rich-text":
            return <Type size={14} />;
        case "image":
            return <ImageIcon size={14} />;
        case "number":
            return <Hash size={14} />;
        default:
            return <ToggleLeft size={14} />;
    }
};

const DraggableField = ({ collectionId, itemId, field }: { collectionId: string; itemId: string; field: { name: string; type: CMSFieldType; value: any } }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const bindingPath = `{{${collectionId}.${itemId}.${field.name}}}`;

        let itemSpec: DraggableItemSpec;

        if (field.type === "image") {
            itemSpec = {
                id: `cms-${bindingPath}`,
                name: field.name,
                description: `Bound to ${field.name}`,
                item: {
                    type: "ELEMENT",
                    tag: "img",
                    props: {
                        src: bindingPath,
                        alt: field.name,
                        className: "w-full h-auto object-cover rounded",
                    },
                } as any, // Cast to any to avoid "tag does not exist" on Omit<AnyCanvasItem> union issue
            };
        } else {
            // Default to text
            itemSpec = {
                id: `cms-${bindingPath}`,
                name: field.name,
                description: `Bound to ${field.name}`,
                item: {
                    type: "ELEMENT",
                    tag: "p",
                    content: bindingPath,
                    props: {
                        className: "text-base text-gray-800",
                    },
                } as any,
            };
        }

        return draggable({
            element: el,
            getInitialData: () => ({ type: "new-item", itemId: itemSpec.id, itemSpec } as unknown as Record<string, unknown>),
            onDragStart: () => setIsDragging(true),
            onDrop: () => setIsDragging(false),
        });
    }, [collectionId, itemId, field]);

    return (
        <div ref={ref} className={`flex items-center gap-2 p-1 pl-6 hover:bg-[#2a2a2a] cursor-grab rounded ${isDragging ? "opacity-50" : ""}`}>
            <FieldIcon type={field.type} />
            <span className="text-sm text-gray-300">{field.name}</span>
            <span className="text-xs text-gray-500 ml-auto">{typeof field.value === "string" && field.value.length > 15 ? field.value.substring(0, 12) + "..." : String(field.value)}</span>
        </div>
    );
};

const CollectionItem = ({ collection, item }: { collection: CMSCollection; item: CMSItem }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div>
            <div className="flex items-center gap-2 p-1 pl-4 hover:bg-[#2a2a2a] cursor-pointer select-none" onClick={() => setExpanded(!expanded)}>
                {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <FileText size={14} className="text-blue-400" />
                <span className="text-sm truncate">{item.data.title || item.data.name || item.id}</span>
            </div>
            {expanded && (
                <div className="flex flex-col">
                    {collection.fields.map((f) => (
                        <DraggableField key={f.name} collectionId={collection.id} itemId={item.id} field={{ ...f, value: item.data[f.name] }} />
                    ))}
                </div>
            )}
        </div>
    );
};

const CollectionGroup = ({ collection }: { collection: CMSCollection }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="mb-2">
            <div className="flex items-center gap-2 p-2 hover:bg-[#2a2a2a] cursor-pointer rounded select-none" onClick={() => setExpanded(!expanded)}>
                {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <Database size={14} className="text-green-400" />
                <span className="font-semibold">{collection.name}</span>
            </div>
            {expanded && (
                <div className="flex flex-col ml-2 border-l border-[#333]">
                    {collection.items.map((item) => (
                        <CollectionItem key={item.id} collection={collection} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export const CMSPanel = () => {
    const context = useContext(AppContext);

    // Fail safe
    if (!context) return null;

    const { cmsCollections } = context;

    return (
        <div className="h-full flex flex-col p-2 text-white overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Database className="text-green-500" />
                CMS Content
            </h2>

            {cmsCollections.length === 0 ? (
                <div className="text-gray-500 text-sm text-center mt-10">No CMS connected.</div>
            ) : (
                cmsCollections.map((col) => <CollectionGroup key={col.id} collection={col} />)
            )}
        </div>
    );
};
