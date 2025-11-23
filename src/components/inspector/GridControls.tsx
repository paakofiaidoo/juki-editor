import React from 'react';

interface GridControlsProps {
    styles: React.CSSProperties;
    handleStyleChange: (key: keyof React.CSSProperties, value: any) => void;
}

const TextInput = ({ label, value, onChange }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div>
        <label className="text-xs text-gray-400 block mb-1">{label}</label>
        <input type="text" value={value} onChange={onChange} className="w-full bg-juki-dark-3 p-1 rounded text-sm text-white" />
    </div>
);

export const GridControls = ({ styles, handleStyleChange }: GridControlsProps) => {
    return (
        <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
                {/* FIX: Cast style property to string to satisfy TextInput's 'value' prop type. */}
                <TextInput label="Columns" value={String(styles.gridTemplateColumns || '')} onChange={e => handleStyleChange('gridTemplateColumns', e.target.value)} />
                {/* FIX: Cast style property to string to satisfy TextInput's 'value' prop type. */}
                <TextInput label="Rows" value={String(styles.gridTemplateRows || '')} onChange={e => handleStyleChange('gridTemplateRows', e.target.value)} />
                {/* FIX: Cast style property to string to satisfy TextInput's 'value' prop type. */}
                <TextInput label="Col Gap" value={String(styles.columnGap || '')} onChange={e => handleStyleChange('columnGap', e.target.value)} />
                {/* FIX: Cast style property to string to satisfy TextInput's 'value' prop type. */}
                <TextInput label="Row Gap" value={String(styles.rowGap || '')} onChange={e => handleStyleChange('rowGap', e.target.value)} />
            </div>
        </div>
    );
};