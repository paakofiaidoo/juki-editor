import React from 'react';
import { DimensionInput } from '../ui/DimensionInput';
import { FontFamilySelect } from '../ui/FontFamilySelect';

interface TypographySettingsProps {
    styles: React.CSSProperties;
    handleStyleChange: (key: keyof React.CSSProperties, value: any) => void;
}

const SelectControl = ({ label, value, options, onChange }: { label: string, value: string, options: {value: string, label: string}[], onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => (
    <div>
        <label className="text-xs text-gray-400 block mb-1">{label}</label>
        <select value={value} onChange={onChange} className="w-full bg-juki-dark-3 p-1 rounded text-sm text-white border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green">
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

export const TypographySettings = ({ styles, handleStyleChange }: TypographySettingsProps) => {
    return (
        <div className="space-y-2">
            <FontFamilySelect 
                label="Font Family"
                value={String(styles.fontFamily || '')}
                onChange={v => handleStyleChange('fontFamily', v)}
            />
            <div className="grid grid-cols-2 gap-2">
                <DimensionInput label="Size" value={styles.fontSize} onChange={v => handleStyleChange('fontSize', v)} />
                <SelectControl 
                    label="Weight"
                    value={String(styles.fontWeight || 'normal')}
                    onChange={e => handleStyleChange('fontWeight', e.target.value)}
                    options={[
                        { value: '100', label: 'Thin' },
                        { value: '200', label: 'Extra-Light' },
                        { value: '300', label: 'Light' },
                        { value: '400', label: 'Normal' },
                        { value: '500', label: 'Medium' },
                        { value: '600', label: 'Semi-Bold' },
                        { value: '700', label: 'Bold' },
                        { value: '800', label: 'Extra-Bold' },
                        { value: '900', label: 'Black' },
                    ]}
                />
            </div>
            <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">Color</label>
                <input
                    type="color"
                    value={String(styles.color || '#ffffff')}
                    onChange={e => handleStyleChange('color', e.target.value)}
                    className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-juki-dark-3"
                />
            </div>
             <SelectControl 
                label="Align"
                value={styles.textAlign || 'left'}
                onChange={e => handleStyleChange('textAlign', e.target.value)}
                options={[
                    { value: 'left', label: 'Left' },
                    { value: 'center', label: 'Center' },
                    { value: 'right', label: 'Right' },
                    { value: 'justify', label: 'Justify' },
                ]}
            />
        </div>
    );
};