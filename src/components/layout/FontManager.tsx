import React, { useEffect } from 'react';
import { useApp } from '../../hooks/useApp';

export const FontManager = () => {
    const { activeProject } = useApp();
    const importedFonts = activeProject?.theme.importedFonts || [];

    useEffect(() => {
        const head = document.head;
        const currentFontIds = importedFonts.map(font => font.id);
        const linkElements = head.querySelectorAll<HTMLLinkElement>('link[data-juki-font]');

        // Remove fonts that are no longer in the project
        linkElements.forEach(link => {
            const fontId = link.dataset.jukiFont;
            if (fontId && !currentFontIds.includes(fontId)) {
                head.removeChild(link);
            }
        });

        // Add new fonts
        importedFonts.forEach(font => {
            if (!head.querySelector(`link[data-juki-font="${font.id}"]`)) {
                const link = document.createElement('link');
                link.href = font.url;
                link.rel = 'stylesheet';
                link.dataset.jukiFont = font.id;
                head.appendChild(link);
            }
        });
        
    }, [importedFonts]);

    return null; // This component doesn't render anything
};
