// FIX: Add missing React import to resolve "Cannot find namespace 'React'" error.
import React from 'react';
import * as iconExports from 'lucide-react';

// Use a closure to store the loaded icons, so we only process them once.
let loadedIcons: {
    iconMap: Record<string, React.ComponentType<any>>;
    iconNames: string[];
} | null = null;

const initializeIcons = (): { iconMap: Record<string, React.ComponentType<any>>; iconNames: string[] } => {
    // If we've already loaded, return the cached version.
    if (loadedIcons) {
        return loadedIcons;
    }

    const map: Record<string, React.ComponentType<any>> = {};
    const names: string[] = [];

    // The CDN build might wrap everything in a 'default' export.
    const iconsObject = ((iconExports as any).default && typeof (iconExports as any).default === 'object' && (iconExports as any).default.Zap)
        ? (iconExports as any).default
        : iconExports;

    const excludedNames = ['createReactComponent', 'icons', 'LucideIcon', 'default'];

    if (iconsObject && typeof iconsObject === 'object') {
        for (const name in iconsObject) {
            if (Object.prototype.hasOwnProperty.call(iconsObject, name)) {
                const component = (iconsObject as any)[name];
                if (
                    !excludedNames.includes(name) &&
                    /^[A-Z]/.test(name) &&
                    (typeof component === 'function' || (typeof component === 'object' && component !== null))
                ) {
                    map[name] = component as React.ComponentType<any>;
                    names.push(name);
                }
            }
        }
    }
    
    // Heuristic check: if the module seems loaded but we got no icons, log a warning.
    // We only cache the result if it's successful (i.e., we found icons).
    // This allows subsequent calls to retry if the module was not ready on the first attempt.
    if (names.length > 0) {
        loadedIcons = { iconMap: map, iconNames: names };
    } else if (Object.keys(iconsObject).length > 10) {
        console.warn("Juki Editor: Could not load any icons from lucide-react. The Icons panel will be empty.");
        // Cache the empty result to prevent constant re-processing if the module is truly broken.
        loadedIcons = { iconMap: map, iconNames: names };
    }
    
    return { iconMap: map, iconNames: names };
};

// Export functions that will trigger initialization on their first call.
export const getIconMap = (): Record<string, React.ComponentType<any>> => {
    return initializeIcons().iconMap;
};

export const getIconNames = (): string[] => {
    return initializeIcons().iconNames;
};