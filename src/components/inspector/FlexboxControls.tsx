import React from 'react';
import { AnyCanvasItem } from '../../types';

interface FlexboxControlsProps {
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

export const FlexboxControls = ({ styles, handleStyleChange }: FlexboxControlsProps) => {
    return (
        <div className="grid grid-cols-2 gap-2">
            <SelectControl 
                label="Direction"
                value={styles.flexDirection || 'row'}
                onChange={e => handleStyleChange('flexDirection', e.target.value)}
                options={[
                    { value: 'row', label: 'Row' },
                    { value: 'row-reverse', label: 'Row Reverse' },
                    { value: 'column', label: 'Column' },
                    { value: 'column-reverse', label: 'Column Reverse' },
                ]}
            />
             <SelectControl 
                label="Wrap"
                value={styles.flexWrap || 'nowrap'}
                onChange={e => handleStyleChange('flexWrap', e.target.value)}
                options={[
                    { value: 'nowrap', label: 'No Wrap' },
                    { value: 'wrap', label: 'Wrap' },
                    { value: 'wrap-reverse', label: 'Wrap Reverse' },
                ]}
            />
             <SelectControl 
                label="Justify Content"
                value={styles.justifyContent || 'flex-start'}
                onChange={e => handleStyleChange('justifyContent', e.target.value)}
                options={[
                    { value: 'flex-start', label: 'Start' },
                    { value: 'flex-end', label: 'End' },
                    { value: 'center', label: 'Center' },
                    { value: 'space-between', label: 'Between' },
                    { value: 'space-around', label: 'Around' },
                    { value: 'space-evenly', label: 'Evenly' },
                ]}
            />
             <SelectControl 
                label="Align Items"
                value={styles.alignItems || 'stretch'}
                onChange={e => handleStyleChange('alignItems', e.target.value)}
                options={[
                     { value: 'stretch', label: 'Stretch' },
                     { value: 'flex-start', label: 'Start' },
                     { value: 'flex-end', label: 'End' },
                     { value: 'center', label: 'Center' },
                     { value: 'baseline', label: 'Baseline' },
                ]}
            />
        </div>
    );
};