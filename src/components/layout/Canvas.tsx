import React, { CSSProperties } from 'react';
import { useApp } from '../../hooks/useApp';
import { CanvasItemRenderer } from './CanvasItemRenderer';

interface CanvasProps {
  canvasSize: string;
}

export const Canvas = ({ canvasSize }: CanvasProps) => {
  const { activePage, activeProject, clearSelection } = useApp();

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
  // FIX: Cast the object to CSSProperties to allow for custom CSS variables, resolving the type error.
  const themeStyles: CSSProperties = activeProject?.theme ? {
    '--juki-color-primary': activeProject.theme.colors.primary,
    '--juki-color-secondary': activeProject.theme.colors.secondary,
    '--juki-color-accent': activeProject.theme.colors.accent,
    '--juki-color-text': activeProject.theme.colors.text,
    '--juki-color-background': activeProject.theme.colors.background,
    '--juki-font-body': activeProject.theme.fonts.body,
    '--juki-font-heading': activeProject.theme.fonts.heading,
  } as CSSProperties : {};

  return (
    <div className="flex justify-center items-start w-full h-full p-8 bg-juki-dark-pattern">
      <div
        id="canvas-artboard"
        onClick={handleCanvasClick}
        className={`shadow-lg transition-all duration-300 outline outline-1 outline-juki-dark-3 ${canvasSize} ${activePage.props.className || ''}`}
        style={{ ...activePage.props.style, ...themeStyles }} // Apply page-level styles and theme variables
      >
        {activePage.children.map(item => (
          <CanvasItemRenderer key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};