import React, { useState, useMemo, useRef, useEffect } from "react";
import { getIconMap, getIconNames } from "../../utils/iconUtils";
import { DndSourceData, DraggableIconSpec } from "../../types";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

// FIX: Changed component to React.FC to resolve issues with the 'key' prop in maps.
const DraggableIconItem: React.FC<{ iconName: string }> = ({ iconName }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const IconComponent = getIconMap()[iconName];

    const itemSpec: DraggableIconSpec = {
        id: `icon-${iconName}`,
        name: iconName,
        description: `A ${iconName} icon.`,
        item: {
            type: "ICON",
            iconName: iconName,
            props: { className: "w-8 h-8 text-white" },
        },
    };

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        return draggable({
            element: el,
            getInitialData: () => ({ type: "new-item", itemId: itemSpec.id, itemSpec } as unknown as Record<string, unknown>),
            onDragStart: () => setIsDragging(true),
            onDrop: () => setIsDragging(false),
        });
    }, [iconName]);

    if (!IconComponent) return null;

    return (
        <div
            ref={ref}
            title={iconName}
            className={`flex items-center justify-center p-2 rounded-md aspect-square bg-juki-dark-2 hover:bg-juki-dark-3 cursor-grab transition-colors ${isDragging ? "opacity-50" : ""}`}
        >
            <IconComponent className="w-6 h-6 text-gray-300" />
        </div>
    );
};

export const IconsPanel = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [allIconNames, setAllIconNames] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 10; // ~3 seconds
        let timer: number;

        const loadIcons = () => {
            attempts++;
            const names = getIconNames();
            if (names.length > 0) {
                setAllIconNames(names);
                setIsLoading(false);
            } else if (attempts < maxAttempts) {
                timer = window.setTimeout(loadIcons, 300);
            } else {
                setIsLoading(false);
                console.error("Juki Editor: Failed to load icons from lucide-react after several attempts.");
            }
        };

        loadIcons();

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const displayedIcons = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (query) {
            // When searching, filter from all available icons and limit results for performance
            return allIconNames.filter((name) => name.toLowerCase().includes(query)).slice(0, 100); // Show max 100 results
        }
        // When not searching, show the initial subset of 50 icons
        return allIconNames.slice(0, 100);
    }, [searchQuery, allIconNames]);

    return (
        <div className="flex flex-col h-full">
            <div className="p-2 border-b border-juki-dark-3">
                <input
                    type="text"
                    placeholder={isLoading ? "Loading..." : `Search ${allIconNames.length} icons...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-juki-dark-3 p-2 rounded border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green text-white text-sm"
                />
            </div>
            <div className="flex-1 p-2 overflow-y-auto">
                <div className="grid grid-cols-5 gap-1">
                    {isLoading ? (
                        <p className="col-span-5 text-center text-gray-500 text-sm mt-4">Loading icons...</p>
                    ) : (
                        displayedIcons.map((iconName) => <DraggableIconItem key={iconName} iconName={iconName} />)
                    )}
                </div>
                {!isLoading && displayedIcons.length === 0 && <div className="text-center text-gray-500 text-sm mt-4">{searchQuery ? "No icons found." : "Could not load icons."}</div>}
            </div>
        </div>
    );
};
