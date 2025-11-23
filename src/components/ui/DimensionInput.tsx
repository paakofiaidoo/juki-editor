import React from 'react';

interface DimensionInputProps {
    label: string;
    value: string | number | undefined;
    onChange: (value: string) => void;
    units?: string[];
}

const DEFAULT_UNITS = ['px', '%', 'em', 'rem', 'vw', 'vh'];

export const DimensionInput = ({ label, value, onChange, units = DEFAULT_UNITS }: DimensionInputProps) => {
    const stringValue = String(value || '');
    const number = parseFloat(stringValue) || 0;
    const unit = stringValue.replace(String(number), '') || 'px';

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(`${e.target.value}${unit}`);
    };

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(`${number}${e.target.value}`);
    };

    return (
        <div>
            <label className="text-xs text-gray-400 block mb-1">{label}</label>
            <div className="flex">
                <input
                    type="number"
                    value={number}
                    onChange={handleValueChange}
                    className="w-full bg-juki-dark-3 p-1 rounded-l text-sm text-white focus:outline-none"
                />
                <select 
                    value={unit}
                    onChange={handleUnitChange}
                    className="bg-juki-dark-3 p-1 rounded-r text-sm text-white border-l border-juki-dark-2 focus:outline-none"
                >
                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
            </div>
        </div>
    );
};