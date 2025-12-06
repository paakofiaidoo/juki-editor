import React, { useState } from "react";
import { useApp } from "../../hooks/useApp";
import { parseComponentFileToCanvasItems } from "../../utils/jsxParser";
import { FileCode, Upload, AlertCircle, RefreshCw } from "lucide-react";

export const ImportPanel = () => {
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { activePage, updatePageFromCode, syncProject } = useApp();
    const [isSyncing, setIsSyncing] = useState(false);

    const handleImport = () => {
        setError(null);
        if (!code.trim()) return;

        try {
            // Validate locally first to show error before calling context
            const items = parseComponentFileToCanvasItems(code);
            if (items.length === 0) {
                setError("No valid JSX found in the provided code.");
                return;
            }

            if (activePage) {
                updatePageFromCode(code);
                alert("Page updated successfully!");
            } else {
                setError("No active page to update.");
            }
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await syncProject();
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="flex flex-col h-full p-4 space-y-4">
            <div className="flex items-center gap-2 text-gray-400 border-b border-juki-dark-3 pb-2">
                <FileCode size={16} />
                <span className="font-semibold text-sm">Import Code</span>
            </div>

            <div className="bg-juki-dark-2 p-3 rounded border border-juki-dark-3 space-y-2">
                <div className="text-xs text-gray-400 font-semibold">Project Sync</div>
                <div className="text-xs text-gray-500">Scan the project directory and update the editor with the latest code from disk.</div>
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="w-full bg-juki-dark-3 hover:bg-juki-dark-1 text-white text-xs py-2 px-3 rounded flex items-center justify-center gap-2 transition-colors border border-white/10"
                >
                    <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
                    {isSyncing ? "Syncing..." : "Sync with Codebase"}
                </button>
            </div>

            <div className="border-t border-juki-dark-3 my-2" />

            <div className="text-xs text-gray-500">Paste your React component code below. The JSX returned by the component will replace the current page content.</div>

            <textarea
                className="flex-1 bg-juki-dark-3 border border-juki-dark-2 rounded p-2 text-xs font-mono text-gray-300 focus:outline-none focus:border-juki-primary resize-none"
                placeholder="export default function Home() { return <div>...</div> }"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded p-2 flex items-start gap-2 text-red-400 text-xs">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <button
                onClick={handleImport}
                disabled={!code.trim() || !activePage}
                className="bg-juki-primary text-black font-semibold py-2 px-4 rounded hover:bg-juki-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
                <Upload size={16} />
                Import to Canvas
            </button>
        </div>
    );
};
