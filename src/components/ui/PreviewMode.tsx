import React, { CSSProperties } from 'react';
import { useApp } from '../../hooks/useApp';
import { CanvasItemRenderer } from '../layout/CanvasItemRenderer';
import { X } from 'lucide-react';

export const PreviewMode = () => {
    const { activePage, activeProject, exitPreviewMode } = useApp();

    if (!activePage || !activeProject) {
        return (
            <div className="w-screen h-screen flex flex-col items-center justify-center bg-juki-dark text-white">
                <p className="mb-4">No active page to preview.</p>
                <button
                    onClick={exitPreviewMode}
                    className="flex items-center gap-2 px-4 py-2 bg-juki-dark-3 rounded-md text-sm font-semibold text-white hover:bg-juki-dark-3/80"
                >
                    Return to Editor
                </button>
            </div>
        );
    }
    
    const themeStyles: CSSProperties = {
        '--juki-color-primary': activeProject.theme.colors.primary,
        '--juki-color-secondary': activeProject.theme.colors.secondary,
        '--juki-color-accent': activeProject.theme.colors.accent,
        '--juki-color-text': activeProject.theme.colors.text,
        '--juki-color-background': activeProject.theme.colors.background,
        '--juki-font-body': activeProject.theme.fonts.body,
        '--juki-font-heading': activeProject.theme.fonts.heading,
    } as CSSProperties;

    return (
        <div className="relative w-screen h-screen overflow-auto">
            <div
                className={`w-full ${activePage.props.className || ''}`}
                style={{ ...activePage.props.style, ...themeStyles }}
            >
                {activePage.children.map(item => (
                    <CanvasItemRenderer key={item.id} item={item} />
                ))}
            </div>

            <button
                onClick={exitPreviewMode}
                title="Exit Preview"
                className="fixed top-4 right-4 flex items-center justify-center w-10 h-10 bg-black/50 text-white rounded-full hover:bg-black/80 backdrop-blur-sm transition-colors"
            >
                <X size={20} />
            </button>
        </div>
    );
};