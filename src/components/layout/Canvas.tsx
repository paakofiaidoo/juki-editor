import React, { CSSProperties, useRef, useState, useEffect } from "react";
import { useApp } from "../../hooks/useApp";
import { CanvasItemRenderer } from "./CanvasItemRenderer";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

interface CanvasProps {
    canvasSize: string;
    screenshotRef?: React.RefObject<HTMLDivElement | null>;
}

export const Canvas = ({ canvasSize, screenshotRef }: CanvasProps) => {
    const { activePage, activeProject, clearSelection } = useApp();
    const localRef = useRef<HTMLDivElement>(null);
    const ref = screenshotRef || localRef;
    const [isDraggedOver, setIsDraggedOver] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        return dropTargetForElements({
            element: el,
            getData: () => ({ type: "canvas-root" }),
            onDragEnter: () => setIsDraggedOver(true),
            onDragLeave: () => setIsDraggedOver(false),
            onDrop: () => setIsDraggedOver(false),
        });
    }, [ref]);

    const handleCanvasClick = (e: React.MouseEvent) => {
        // Check if the click is on the canvas background itself
        if (e.target === e.currentTarget) {
            clearSelection();
        }
    };

    if (!activePage) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
                <p>No page selected. Please select a page from the 'Pages' panel.</p>
            </div>
        );
    }

    // Create CSS custom properties from the project's theme
    const themeStyles: CSSProperties = activeProject?.theme
        ? ({
              "--juki-color-primary": activeProject.theme.colors.primary,
              "--juki-color-secondary": activeProject.theme.colors.secondary,
              "--juki-color-accent": activeProject.theme.colors.accent,
              "--juki-color-text": activeProject.theme.colors.text,
              "--juki-color-background": activeProject.theme.colors.background,
              "--juki-font-body": activeProject.theme.fonts.body,
              "--juki-font-heading": activeProject.theme.fonts.heading,
          } as CSSProperties)
        : {};

    return (
        <div className="flex justify-center items-start w-full h-full p-8 bg-juki-dark-pattern">
            <div
                id="canvas-artboard"
                ref={ref}
                onClick={handleCanvasClick}
                className={`shadow-lg transition-all duration-300 outline outline-1 outline-juki-dark-3 ${canvasSize} ${isDraggedOver ? "bg-juki-dark-2/50 ring-2 ring-juki-primary" : ""}`}
                style={themeStyles} // Apply theme variables
            >
                {/* Canvas Content */}
                <div
                    id="canvas-content"
                    className={`min-h-full w-full bg-white shadow-sm relative ${activePage.props.className || ""}`}
                    style={{
                        width: "100%",
                        height: "100%",
                        ...activePage.props.style, // Apply page-level styles
                    }}
                >
                    {/* Inject Page Custom CSS */}
                    {activePage?.customCss && <style>{activePage.customCss}</style>}

                    {activePage.children.map((item) => (
                        <CanvasItemRenderer key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};
