import React from "react";
import { Monitor, Tablet, Smartphone, Code, Eye, TerminalSquare, Camera, ExternalLink } from "lucide-react";
import { useApp } from "../../hooks/useApp";

interface MainViewToolbarProps {
    canvasSize: string;
    setCanvasSize: (size: string) => void;
    isTerminalOpen: boolean;
    toggleTerminal: () => void;
    onScreenshot: () => void;
    isScreenshotLoading: boolean;
}

// FIX: Changed component to React.FC to resolve issues with the 'children' prop.
const ToolbarButton: React.FC<{ children: React.ReactNode; onClick: () => void; active: boolean; title: string; disabled?: boolean }> = ({ children, onClick, active, title, disabled }) => (
    <button
        onClick={onClick}
        title={title}
        disabled={disabled}
        className={`p-2 rounded transition-colors ${active ? "bg-juki-green text-black" : "text-gray-400 hover:bg-juki-dark-3"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
        {children}
    </button>
);

export const MainViewToolbar = ({ canvasSize, setCanvasSize, isTerminalOpen, toggleTerminal, onScreenshot, isScreenshotLoading }: MainViewToolbarProps) => {
    const { activeView, setActiveView, activePage } = useApp();

    return (
        <div className="h-10 bg-juki-dark-2 rounded-lg flex items-center justify-between px-2 border border-juki-dark-3 shrink-0">
            <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white">{activePage?.name || "No Page"}</p>
                <span className="text-xs text-gray-500">{activePage?.route}</span>
            </div>

            <div className="flex items-center gap-2">
                <ToolbarButton title="Desktop" onClick={() => setCanvasSize("w-full")} active={canvasSize === "w-full"}>
                    <Monitor size={16} />
                </ToolbarButton>
                <ToolbarButton title="Tablet" onClick={() => setCanvasSize("w-[768px]")} active={canvasSize === "w-[768px]"}>
                    <Tablet size={16} />
                </ToolbarButton>
                <ToolbarButton title="Mobile" onClick={() => setCanvasSize("w-[375px]")} active={canvasSize === "w-[375px]"}>
                    <Smartphone size={16} />
                </ToolbarButton>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-juki-dark p-1 rounded-md">
                    <ToolbarButton title="Canvas View" onClick={() => setActiveView("canvas")} active={activeView === "canvas"}>
                        <Eye size={16} />
                    </ToolbarButton>
                    <ToolbarButton title="Code View" onClick={() => setActiveView("code")} active={activeView === "code"}>
                        <Code size={16} />
                    </ToolbarButton>
                </div>
                <div className="w-px h-6 bg-juki-dark-3 mx-1" />
                <ToolbarButton title="Take Screenshot" onClick={onScreenshot} active={false} disabled={isScreenshotLoading}>
                    <Camera size={16} />
                </ToolbarButton>
                <div className="w-px h-6 bg-juki-dark-3 mx-1" />
                <ToolbarButton title="Open Live Preview (localhost:3000)" onClick={() => window.open("http://localhost:3000", "_blank")} active={false}>
                    <ExternalLink size={16} className="text-juki-green" />
                </ToolbarButton>
            </div>
        </div>
    );
};
