import React, { useEffect, useRef } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { useApp } from "../../hooks/useApp";
import { type DndInstruction, type DndSourceData } from "../../types";
import { Header } from "./Header";
import { LeftSidebar } from "./LeftSidebar";
import { Inspector } from "./Inspector";
import { MainView } from "./MainView";
import { CreateComponentModal } from "../ui/CreateComponentModal";
import { StatusBar } from "./StatusBar";

// ... existing imports

interface MainLayoutProps {
    isLeftSidebarVisible: boolean;
    isRightSidebarVisible: boolean;
    toggleLeftSidebar: () => void;
    toggleRightSidebar: () => void;
}

export const MainLayout = ({ isLeftSidebarVisible, isRightSidebarVisible, toggleLeftSidebar, toggleRightSidebar }: MainLayoutProps) => {
    const { moveItem, addItem, activeProject, activePageId, findItemInTree } = useApp();
    const ref = useRef<HTMLDivElement>(null);
    const [isTerminalOpen, setIsTerminalOpen] = React.useState(false);

    // ... existing useEffects ...

    useEffect(() => {
        if (activeProject) {
            document.title = `${activeProject.name} - Juki Editor`;
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                metaDescription = document.createElement("meta");
                metaDescription.setAttribute("name", "description");
                document.head.appendChild(metaDescription);
            }
            metaDescription.setAttribute("content", activeProject.description || "A project built with Juki Editor.");
        } else {
            document.title = "Juki Editor";
        }
    }, [activeProject]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        return dropTargetForElements({
            element: el,
            onDrop: ({ source, location }) => {
                const destination = location.current.dropTargets[0];
                const destData = destination?.data as { id: string | null };

                const sourceData = source.data as unknown as DndSourceData;

                const activePage = activeProject?.pages.find((p) => p.id === activePageId);
                if (!activePage) return;

                const closestEdge = extractClosestEdge(destination.data);
                const instruction: DndInstruction = closestEdge ? { type: closestEdge === "top" ? "reorder-before" : "reorder-after" } : { type: "make-child" };

                const destId = destData?.id ?? null;

                if (sourceData.type === "canvas-item") {
                    if (sourceData.itemId !== destId) {
                        moveItem(sourceData.itemId, destId, instruction);
                        const movedEl = document.getElementById(sourceData.itemId);
                        if (movedEl) triggerPostMoveFlash(movedEl);
                    }
                } else if (sourceData.type === "new-item" && sourceData.itemSpec) {
                    if (!destId) {
                        addItem(null, sourceData.itemSpec, -1);
                        return;
                    }
                    const targetResult = findItemInTree(destId, activePage.children);
                    if (!targetResult) {
                        addItem(null, sourceData.itemSpec, -1);
                        return;
                    }

                    let parentId: string | null = null;
                    let dropIndex: number = -1;

                    if (instruction.type === "make-child") {
                        parentId = destId;
                    } else {
                        parentId = targetResult.parentItem ? targetResult.parentItem.id : null;
                        dropIndex = instruction.type === "reorder-before" ? targetResult.index : targetResult.index + 1;
                    }
                    addItem(parentId, sourceData.itemSpec, dropIndex);
                }
            },
        });
    }, [moveItem, addItem, activeProject, activePageId, findItemInTree]);

    return (
        <div ref={ref} className="h-screen w-screen bg-background text-foreground flex flex-col font-sans overflow-hidden">
            <Header toggleLeftSidebar={toggleLeftSidebar} toggleRightSidebar={toggleRightSidebar} />
            <main className="flex flex-1 overflow-hidden">
                <LeftSidebar isVisible={isLeftSidebarVisible} />
                <MainView isTerminalOpen={isTerminalOpen} toggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)} />
                <Inspector isVisible={isRightSidebarVisible} />
            </main>
            <StatusBar isTerminalOpen={isTerminalOpen} toggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)} />
            <CreateComponentModal />
        </div>
    );
};
