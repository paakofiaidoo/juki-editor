import React from "react";
import { TerminalSquare, ChevronRight } from "lucide-react";
import { useApp } from "../../hooks/useApp";
import { AnyCanvasItem } from "../../types";

interface StatusBarProps {
    isTerminalOpen: boolean;
    toggleTerminal: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({ isTerminalOpen, toggleTerminal }) => {
    const { activePage, selectedItemIds, activeProject } = useApp();

    // Helper to find item path for breadcrumbs
    const getBreadcrumbs = (): { name: string; id: string }[] => {
        if (!activePage) return [];
        if (selectedItemIds.length === 0) return [{ name: activePage.name, id: activePage.id }];

        const selectedId = selectedItemIds[0];
        const breadcrumbs: { name: string; id: string }[] = [];

        // Simple recursive search to find path
        const findPath = (items: AnyCanvasItem[], targetId: string, currentPath: { name: string; id: string }[]): boolean => {
            for (const item of items) {
                if (item.id === targetId) {
                    breadcrumbs.push(...currentPath, { name: item.name, id: item.id });
                    return true;
                }
                if (item.type === "ELEMENT" && Array.isArray(item.content)) {
                    if (findPath(item.content as AnyCanvasItem[], targetId, [...currentPath, { name: item.name, id: item.id }])) {
                        return true;
                    }
                }
                // Handle Component/Icon children if necessary, but usually ELEMENTs nest.
            }
            return false;
        };

        findPath(activePage.children, selectedId, [{ name: activePage.name, id: activePage.id }]);
        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <div className="h-6 bg-juki-dark-2 border-t border-juki-dark-3 flex items-center px-2 justify-between shrink-0 select-none">
            <div className="flex items-center gap-4">
                <button onClick={toggleTerminal} className={`flex items-center gap-1 text-xs hover:text-white transition-colors ${isTerminalOpen ? "text-juki-green" : "text-gray-400"}`}>
                    <TerminalSquare size={12} />
                    <span>Terminal</span>
                </button>

                <div className="h-3 w-px bg-juki-dark-3" />

                <div className="flex items-center text-xs text-gray-500">
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb.id}>
                            {index > 0 && <ChevronRight size={10} className="mx-1" />}
                            <span className={index === breadcrumbs.length - 1 ? "text-gray-300" : ""}>{crumb.name}</span>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{activeProject?.name}</span>
            </div>
        </div>
    );
};
