import React, { useState, ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface StylePropertyGroupProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
}

export const StylePropertyGroup = ({ title, children, defaultOpen = false }: StylePropertyGroupProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-juki-dark-3">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-2 text-sm font-semibold text-gray-300 hover:bg-juki-dark-3"
            >
                <span>{title}</span>
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {isOpen && (
                <div className="p-2 space-y-2 bg-juki-dark">
                    {children}
                </div>
            )}
        </div>
    );
};
