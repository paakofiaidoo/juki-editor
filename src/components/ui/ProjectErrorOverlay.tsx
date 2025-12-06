import React from "react";
import { AlertCircle, Trash2, Home } from "lucide-react";

interface ProjectErrorOverlayProps {
    error: string;
    onDelete: () => void;
    onDismiss: () => void;
}

export const ProjectErrorOverlay: React.FC<ProjectErrorOverlayProps> = ({ error, onDelete, onDismiss }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-[500px] bg-[#1e1e1e] border border-red-900/50 rounded-lg shadow-2xl p-6">
                <div className="flex items-center gap-3 mb-4 text-red-500">
                    <AlertCircle size={32} />
                    <h2 className="text-xl font-bold text-white">Project Error</h2>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">{error}</p>

                <div className="bg-red-900/20 border border-red-900/30 rounded p-4 mb-6">
                    <p className="text-sm text-red-200">
                        The project directory cannot be found. It may have been moved or deleted externally. Deleting the reference will verify the database entry is removed.
                    </p>
                </div>

                <div className="flex justify-end gap-3">
                    <button onClick={onDismiss} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center gap-2 transition-colors">
                        <Home size={16} />
                        Return to Home
                    </button>
                    <button onClick={onDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-2 transition-colors">
                        <Trash2 size={16} />
                        Delete Project Reference
                    </button>
                </div>
            </div>
        </div>
    );
};
