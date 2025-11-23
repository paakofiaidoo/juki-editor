import React from 'react';
import { Menu, Eye, DownloadCloud } from 'lucide-react';
import { ProjectSwitcher } from '../ui/ProjectSwitcher';
import { useApp } from '../../hooks/useApp';

interface HeaderProps {
    toggleLeftSidebar: () => void;
    toggleRightSidebar: () => void;
}

export const Header = ({ toggleLeftSidebar, toggleRightSidebar }: HeaderProps) => {
    const { enterPreviewMode, exportProject, activeProject } = useApp();
    
    return (
        <header className="flex items-center justify-between bg-juki-dark-2 border-b border-juki-dark-3 p-2 h-12 shrink-0 z-40">
            <div className="flex items-center gap-2">
                <button onClick={toggleLeftSidebar} className="text-gray-400 hover:text-white">
                    <Menu size={20} />
                </button>
                <h1 className="text-lg font-bold text-white hidden sm:block">Juki Editor</h1>
            </div>
            
            <ProjectSwitcher />

            <div className="flex items-center gap-2">
                 <button 
                    onClick={enterPreviewMode}
                    disabled={!activeProject}
                    title="Preview" 
                    className="flex items-center gap-2 px-3 py-1.5 bg-juki-dark-3 rounded-md text-sm font-semibold text-white hover:bg-juki-dark-3/80 transition-colors disabled:opacity-50"
                 >
                    <Eye size={16} />
                </button>
                 <button 
                    onClick={exportProject}
                    disabled={!activeProject}
                    title="Build & Download Project" 
                    className="flex items-center gap-2 px-3 py-1.5 bg-juki-green rounded-md text-sm font-bold text-black hover:brightness-110 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    <DownloadCloud size={16} />
                    <span className="hidden md:inline">Build</span>
                </button>
                <button onClick={toggleRightSidebar} className="text-gray-400 hover:text-white">
                    <Menu size={20} />
                </button>
            </div>
        </header>
    );
};