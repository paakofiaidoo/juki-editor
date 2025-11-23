import React from 'react';
import { Menu, Eye, DownloadCloud } from 'lucide-react';
import { ProjectSwitcher } from '../ui/ProjectSwitcher';
import { useApp } from '../../hooks/useApp';
import { ModeToggle } from '../theme/ModeToggle';

interface HeaderProps {
    toggleLeftSidebar: () => void;
    toggleRightSidebar: () => void;
}

export const Header = ({ toggleLeftSidebar, toggleRightSidebar }: HeaderProps) => {
    const { enterPreviewMode, exportProject, activeProject } = useApp();

    return (
        <header className="flex items-center justify-between bg-background border-b border-border p-2 h-12 shrink-0 z-40">
            <div className="flex items-center gap-2">
                <button onClick={toggleLeftSidebar} className="text-muted-foreground hover:text-foreground">
                    <Menu size={20} />
                </button>
                <h1 className="text-lg font-bold text-foreground hidden sm:block">Juki Editor</h1>
            </div>

            <ProjectSwitcher />

            <div className="flex items-center gap-2">
                 <button
                    onClick={enterPreviewMode}
                    disabled={!activeProject}
                    title="Preview"
                    className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-md text-sm font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50"
                 >
                    <Eye size={16} />
                </button>
                 <button
                    onClick={exportProject}
                    disabled={!activeProject}
                    title="Build & Download Project"
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary rounded-md text-sm font-bold text-primary-foreground hover:brightness-110 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    <DownloadCloud size={16} />
                    <span className="hidden md:inline">Build</span>
                </button>
                <button onClick={toggleRightSidebar} className="text-muted-foreground hover:text-foreground">
                    <Menu size={20} />
                </button>
                <ModeToggle />
            </div>
        </header>
    );
};