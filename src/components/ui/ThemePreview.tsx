import React from 'react';
import { Theme } from '../../types';

export const ThemePreview = ({ theme }: { theme: Theme }) => {
    return (
        <div className="p-4 rounded-lg border border-juki-dark-3" style={{ backgroundColor: theme.colors.background }}>
            <h3 
                className="text-xl font-bold mb-2 truncate"
                style={{ color: theme.colors.text, fontFamily: theme.fonts.heading }}
            >
                Aa - Heading
            </h3>
            <p 
                className="text-sm mb-4"
                style={{ color: theme.colors.text, fontFamily: theme.fonts.body }}
            >
                The quick brown fox jumps over the lazy dog.
            </p>
            <div className="flex items-center gap-2">
                <button 
                    className="flex-1 py-1 text-sm rounded"
                    style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}
                >
                    Primary
                </button>
                 <button 
                    className="flex-1 py-1 text-sm rounded border"
                    style={{ backgroundColor: theme.colors.secondary, color: theme.colors.text, borderColor: theme.colors.accent }}
                >
                    Secondary
                </button>
                <div 
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: theme.colors.accent }}
                />
            </div>
        </div>
    );
};
