import React from 'react';

interface EffectsSettingsProps {
    styles: React.CSSProperties;
    handleStyleChange: (key: keyof React.CSSProperties, value: any) => void;
}

export const EffectsSettings = ({ styles, handleStyleChange }: EffectsSettingsProps) => {
    // Opacity is a number between 0 and 1. For the UI, we'll use 0-100.
    const opacityValue = styles.opacity !== undefined ? Number(styles.opacity) * 100 : 100;

    const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const newOpacity = Math.max(0, Math.min(100, Number(value)));
        handleStyleChange('opacity', newOpacity / 100);
    };

    return (
        <div className="space-y-2">
            <div>
                <label className="text-xs text-gray-400 block mb-1">Opacity</label>
                <div className="flex items-center gap-2">
                     <input
                        type="range"
                        min="0"
                        max="100"
                        value={opacityValue}
                        onChange={handleOpacityChange}
                        className="w-full h-2 bg-juki-dark-3 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="relative w-20">
                        <input
                            type="number"
                            value={opacityValue.toFixed(0)}
                            onChange={handleOpacityChange}
                            className="w-full bg-juki-dark p-1 rounded text-sm text-white text-center"
                            min="0"
                            max="100"
                        />
                         <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};