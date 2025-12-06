import React from "react";
import { Menu, Eye, DownloadCloud, Settings, Hammer } from "lucide-react";
import { ProjectSwitcher } from "../ui/ProjectSwitcher";
import { useApp } from "../../hooks/useApp";
import { ModeToggle } from "../theme/ModeToggle";

interface HeaderProps {
    toggleLeftSidebar: () => void;
    toggleRightSidebar: () => void;
}

export const Header = ({ toggleLeftSidebar, toggleRightSidebar }: HeaderProps) => {
    const { enterPreviewMode, exportProject, activeProject, publishPage, buildProject, openModal } = useApp();

    return (
        <header className="flex items-center justify-between bg-background border-b border-border p-2 h-12 shrink-0 z-40">
            <div className="flex items-center gap-2">
                <button onClick={toggleLeftSidebar} className="text-muted-foreground hover:text-foreground">
                    <Menu size={20} />
                </button>
                <h1 className="text-lg font-bold text-foreground hidden sm:block">
<a href="/">  Juki Editor</a>
                  </h1>
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
                    <span className="hidden md:inline">Preview</span>
                </button>
                <button
                    onClick={publishPage}
                    disabled={!activeProject}
                    title="Publish (Save to Disk)"
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors flex items-center gap-2"
                >
                    <DownloadCloud size={16} />
                    <span className="hidden md:inline">Publish</span>
                </button>
                <button
                    onClick={buildProject}
                    disabled={!activeProject}
                    title="Build Project"
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors flex items-center gap-2"
                >
                    <Hammer size={16} />
                    <span className="hidden md:inline">Build</span>
                </button>
                <button onClick={() => openModal({ type: "SETTINGS" })} title="Settings" className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
                    <Settings size={16} />
                </button>
                <button
                    onClick={() => window.open("http://localhost:3000", "_blank")}
                    title="Live View"
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-600 rounded-md text-sm font-bold text-white hover:bg-green-700 transition-colors"
                >
                    <Eye size={16} />
                    <span className="hidden md:inline">Live</span>
                </button>
                <button onClick={toggleRightSidebar} className="text-muted-foreground hover:text-foreground">
                    <Menu size={20} />
                </button>
                <ModeToggle />
            </div>
        </header>
    );
};
