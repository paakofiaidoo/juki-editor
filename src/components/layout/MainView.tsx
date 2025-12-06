import React, { useState } from "react";
import { useToImage } from "@hcorta/react-to-image";
import { useApp } from "../../hooks/useApp";
import { MainViewToolbar } from "./MainViewToolbar";
import { Canvas } from "./Canvas";
import { EditableCodeView } from "./CodeView";
import { TerminalPanel } from "../panels/TerminalPanel";

interface MainViewProps {
    isTerminalOpen: boolean;
    toggleTerminal: () => void;
}

export const MainView = ({ isTerminalOpen, toggleTerminal }: MainViewProps) => {
    const { activeView } = useApp();
    const [canvasSize, setCanvasSize] = useState("w-full");
    const { ref, getPng, isLoading } = useToImage();

    return (
        <div className="flex-1 flex flex-col bg-juki-dark overflow-hidden p-4">
            <MainViewToolbar
                canvasSize={canvasSize}
                setCanvasSize={setCanvasSize}
                isTerminalOpen={isTerminalOpen}
                toggleTerminal={toggleTerminal}
                onScreenshot={getPng}
                isScreenshotLoading={isLoading}
            />
            <div className="flex-1 overflow-auto mt-4 flex flex-col">
                <div className="flex-1 relative">{activeView === "canvas" ? <Canvas canvasSize={canvasSize} screenshotRef={ref as React.RefObject<HTMLDivElement>} /> : <EditableCodeView />}</div>
            </div>
            <TerminalPanel isVisible={isTerminalOpen} onClose={() => toggleTerminal()} />
        </div>
    );
};
