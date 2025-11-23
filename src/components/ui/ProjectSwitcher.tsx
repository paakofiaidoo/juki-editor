import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { ChevronDown, PlusCircle, Folder } from 'lucide-react';

export const ProjectSwitcher = () => {
    const { projects, activeProjectId, setActiveProjectId, activeProject, openModal } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);
    
    if (!activeProject) {
        return null;
    }

    const handleSelectProject = (id: string) => {
        setActiveProjectId(id);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-juki-dark-3 rounded-md text-sm font-semibold text-white hover:bg-juki-dark-3/80 transition-colors"
            >
                <Folder size={16} />
                <span className="truncate max-w-[150px]">{activeProject.name}</span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 w-64 bg-juki-dark-2 border border-juki-dark-3 rounded-md shadow-lg z-50 right-1/2 translate-x-1/2">
                    <div className="p-2 border-b border-juki-dark-3">
                        <p className="text-xs text-gray-400">Projects</p>
                    </div>
                    <div className="py-1 max-h-60 overflow-y-auto">
                        {projects.map(p => (
                            <button
                                key={p.id}
                                onClick={() => handleSelectProject(p.id)}
                                className={`w-full text-left px-3 py-1.5 text-sm ${
                                    p.id === activeProjectId ? 'bg-juki-green/20 text-juki-green' : 'text-gray-300 hover:bg-juki-dark-3'
                                }`}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                    <div className="p-1 border-t border-juki-dark-3">
                        <button 
                            onClick={() => { openModal({ type: 'CREATE_PROJECT' }); setIsOpen(false); }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:bg-juki-dark-3 rounded"
                        >
                            <PlusCircle size={14} /> Create New Project
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};