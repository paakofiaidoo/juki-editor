import React from 'react';
import { FlexboxControls } from './FlexboxControls';
import { GridControls } from './GridControls';
import { BlockLayoutControls } from './BlockLayoutControls';

interface LayoutSettingsProps {
    styles: React.CSSProperties;
    handleStyleChange: (key: keyof React.CSSProperties, value: any) => void;
}

export const LayoutSettings = ({ styles, handleStyleChange }: LayoutSettingsProps) => {
    const display = styles.display || 'block';
    
    return (
        <div className="space-y-4">
             <div>
                <label className="text-xs text-gray-400 block mb-1">Display</label>
                <select 
                    value={display} 
                    onChange={e => handleStyleChange('display', e.target.value)} 
                    className="w-full bg-juki-dark-3 p-1 rounded text-sm text-white border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green"
                >
                    <option value="block">Block</option>
                    <option value="flex">Flex</option>
                    <option value="grid">Grid</option>
                    <option value="inline-block">Inline Block</option>
                    <option value="none">None</option>
                </select>
            </div>
            
            {display === 'block' && <BlockLayoutControls styles={styles} handleStyleChange={handleStyleChange} />}
            {display === 'flex' && <FlexboxControls styles={styles} handleStyleChange={handleStyleChange} />}
            {display === 'grid' && <GridControls styles={styles} handleStyleChange={handleStyleChange} />}
        </div>
    );
};