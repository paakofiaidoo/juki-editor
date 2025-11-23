import React from 'react';
import { useApp } from '../../hooks/useApp';

interface FontFamilySelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const webSafeFonts = [
    'Arial, sans-serif',
    'Verdana, sans-serif',
    'Tahoma, sans-serif',
    'Trebuchet MS, sans-serif',
    'Times New Roman, serif',
    'Georgia, serif',
    'Garamond, serif',
    'Courier New, monospace',
    'Brush Script MT, cursive'
];

export const FontFamilySelect = ({ label, value, onChange }: FontFamilySelectProps) => {
    const { activeProject } = useApp();
    const importedFonts = activeProject?.theme.importedFonts || [];

    return (
         <div>
            <label className="text-xs text-gray-400 block mb-1">{label}</label>
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full bg-juki-dark-3 p-1 rounded text-sm text-white border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green"
            >
                <optgroup label="Imported Fonts">
                    {importedFonts.map(font => (
                        <option key={font.id} value={font.fontFamily}>{font.fontFamily}</option>
                    ))}
                </optgroup>
                <optgroup label="Web Safe Fonts">
                    {webSafeFonts.map(fontStack => (
                        <option key={fontStack} value={fontStack}>{fontStack.split(',')[0]}</option>
                    ))}
                </optgroup>
            </select>
        </div>
    );
};
