import React, { useEffect, useRef } from "react";
import { X, Trash2, Terminal as TerminalIcon } from "lucide-react";
import { useLogStore } from "../../utils/log-interceptor";

interface LogEntry {
    id: string;
    timestamp: Date;
    level: "info" | "warn" | "error" | "success";
    message: string;
}

interface TerminalPanelProps {
    isVisible: boolean;
    onClose: () => void;
}

export const TerminalPanel = ({ isVisible, onClose }: TerminalPanelProps) => {
    const { logs, clearLogs } = useLogStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-64 bg-black/90 text-green-400 font-mono text-xs border-t border-gray-800 z-50 flex flex-col shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <TerminalIcon size={14} />
                    <span className="font-bold">TERMINAL</span>
                    <span className="text-gray-500 text-[10px] ml-2">Listening to Console...</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={clearLogs} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors" title="Clear Console">
                        <Trash2 size={14} />
                    </button>
                    <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors">
                        <X size={14} />
                    </button>
                </div>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1">
                {logs.length === 0 && <div className="text-gray-600 italic">No logs captured yet...</div>}
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-2 hover:bg-white/5 p-0.5 rounded">
                        <span className="text-gray-500 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <span
                            className={`uppercase font-bold shrink-0 w-12 ${
                                log.level === "error" ? "text-red-500" : log.level === "warn" ? "text-yellow-500" : log.level === "info" ? "text-blue-400" : "text-green-400"
                            }`}
                        >
                            {log.level}
                        </span>
                        <span className="break-all whitespace-pre-wrap">{log.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
