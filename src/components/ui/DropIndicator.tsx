import React from "react";
import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

interface DropIndicatorProps {
    edge: Edge | null;
    gap?: string;
}

export const DropIndicator: React.FC<DropIndicatorProps> = ({ edge, gap = "0px" }) => {
    if (!edge) return null;

    const lineStyles: React.CSSProperties = {
        position: "absolute",
        zIndex: 10,
        backgroundColor: "#00E0FF", // Juki Cyan
        pointerEvents: "none",
    };

    const circleStyles: React.CSSProperties = {
        position: "absolute",
        zIndex: 10,
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        border: "2px solid #00E0FF",
        backgroundColor: "#000",
    };

    switch (edge) {
        case "top":
            return (
                <>
                    <div style={{ ...lineStyles, top: `-${gap}`, left: 0, right: 0, height: "2px" }} />
                    <div style={{ ...circleStyles, top: `calc(-${gap} - 3px)`, left: "-4px" }} />
                </>
            );
        case "bottom":
            return (
                <>
                    <div style={{ ...lineStyles, bottom: `-${gap}`, left: 0, right: 0, height: "2px" }} />
                    <div style={{ ...circleStyles, bottom: `calc(-${gap} - 3px)`, left: "-4px" }} />
                </>
            );
        case "left":
            return (
                <>
                    <div style={{ ...lineStyles, top: 0, bottom: 0, left: `-${gap}`, width: "2px" }} />
                    <div style={{ ...circleStyles, top: "-4px", left: `calc(-${gap} - 3px)` }} />
                </>
            );
        case "right":
            return (
                <>
                    <div style={{ ...lineStyles, top: 0, bottom: 0, right: `-${gap}`, width: "2px" }} />
                    <div style={{ ...circleStyles, top: "-4px", right: `calc(-${gap} - 3px)` }} />
                </>
            );
        default:
            return null;
    }
};
