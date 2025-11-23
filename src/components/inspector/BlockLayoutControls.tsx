import React from 'react';
import { DimensionInput } from '../ui/DimensionInput';

interface BlockLayoutControlsProps {
    styles: React.CSSProperties;
    handleStyleChange: (key: keyof React.CSSProperties, value: any) => void;
}

const SpacingInputGroup = ({ label, keys, styles, handleStyleChange }: { label: string, keys: (keyof React.CSSProperties)[], styles: React.CSSProperties, handleStyleChange: any }) => (
    <div>
        <h4 className="text-xs text-gray-400 font-semibold mb-1">{label}</h4>
        <div className="grid grid-cols-2 gap-2">
            <DimensionInput label="Top" value={styles[keys[0]]} onChange={v => handleStyleChange(keys[0], v)} />
            <DimensionInput label="Right" value={styles[keys[1]]} onChange={v => handleStyleChange(keys[1], v)} />
            <DimensionInput label="Bottom" value={styles[keys[2]]} onChange={v => handleStyleChange(keys[2], v)} />
            <DimensionInput label="Left" value={styles[keys[3]]} onChange={v => handleStyleChange(keys[3], v)} />
        </div>
    </div>
);

export const BlockLayoutControls = ({ styles, handleStyleChange }: BlockLayoutControlsProps) => {
    return (
        <div className="space-y-4">
             <div>
                <h4 className="text-xs text-gray-400 font-semibold mb-1">Size</h4>
                <div className="grid grid-cols-2 gap-2">
                    <DimensionInput label="Width" value={styles.width} onChange={v => handleStyleChange('width', v)} />
                    <DimensionInput label="Height" value={styles.height} onChange={v => handleStyleChange('height', v)} />
                </div>
            </div>
            <SpacingInputGroup label="Margin" keys={['marginTop', 'marginRight', 'marginBottom', 'marginLeft']} styles={styles} handleStyleChange={handleStyleChange} />
            <SpacingInputGroup label="Padding" keys={['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']} styles={styles} handleStyleChange={handleStyleChange} />
        </div>
    );
};