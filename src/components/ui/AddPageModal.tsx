import React, { useState } from "react";

interface AddPageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, description: string, route: string) => void;
}

export const AddPageModal = ({ isOpen, onClose, onCreate }: AddPageModalProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [route, setRoute] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && route.trim()) {
            onCreate(name, description, route);
            // Reset fields and close
            setName("");
            setDescription("");
            setRoute("");
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={onClose}>
            <div className="bg-[#111] rounded-lg p-6 w-96 border border-[#333] shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-white mb-4">Create New Page</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Page Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="e.g. About Us"
                            className="w-full bg-[#2a2a2a] p-2 rounded border border-[#333] focus:outline-none focus:ring-1 focus:ring-green-500 text-white placeholder-gray-600"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional description"
                            className="w-full bg-[#2a2a2a] p-2 rounded border border-[#333] focus:outline-none focus:ring-1 focus:ring-green-500 text-white placeholder-gray-600"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Route (e.g., /about)</label>
                        <input
                            type="text"
                            value={route}
                            onChange={(e) => setRoute(e.target.value)}
                            required
                            placeholder="/path"
                            className="w-full bg-[#2a2a2a] p-2 rounded border border-[#333] focus:outline-none focus:ring-1 focus:ring-green-500 text-white placeholder-gray-600"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="bg-[#333] text-white font-bold py-2 px-4 rounded hover:bg-[#444] transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition-colors shadow-lg shadow-green-900/20">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
