import React, { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { useApp } from "../../hooks/useApp";
import { AddPageModal } from "../ui/AddPageModal";

export const PagesPanel = () => {
    const { activeProject, activePageId, setActivePageId, addPage, deletePage, activeLayoutId, setActiveLayoutId } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreatePage = (name: string, description: string, route: string) => {
        addPage(name, description, route);
    };

    const pages = activeProject?.pages || [];

    return (
        <>
            <AddPageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreatePage} />
            <div className="flex flex-col h-full p-2">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase">Pages</h3>
                    <button onClick={() => setIsModalOpen(true)} className="text-gray-400 hover:text-white disabled:text-gray-700" disabled={!activeProject}>
                        <PlusCircle size={16} />
                    </button>
                </div>
                <div className="space-y-1 flex-1 overflow-y-auto">
                    {/* Pages List */}
                    {pages.map((page) => (
                        <div
                            key={page.id}
                            onClick={() => setActivePageId(page.id)}
                            className={`flex justify-between items-center rounded text-sm p-1.5 cursor-pointer ${
                                page.id === activePageId ? "bg-green-500/20 text-green-500" : "text-gray-300 hover:bg-[#2a2a2a]"
                            }`}
                        >
                            <div>
                                <span className="truncate font-semibold">{page.name}</span>
                                <span className="truncate text-xs text-gray-500 block">{page.route}</span>
                            </div>
                            {pages.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePage(page.id);
                                    }}
                                    className="text-gray-500 hover:text-red-500 shrink-0 ml-2"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                    {pages.length === 0 && activeProject && <p className="text-xs text-center text-gray-500 py-4">This project has no pages.</p>}

                    {/* Layouts List */}
                    <div className="mt-4 mb-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase">Layouts</h3>
                    </div>
                    {/* Check if layouts exist before mapping */}
                    {(activeProject?.layouts || []).map((layout) => (
                        <div
                            key={layout.id}
                            onClick={() => setActiveLayoutId(layout.id)}
                            className={`flex justify-between items-center rounded text-sm p-1.5 cursor-pointer ${
                                layout.id === activeLayoutId ? "bg-purple-500/20 text-purple-500" : "text-gray-300 hover:bg-[#2a2a2a]"
                            }`}
                        >
                            <div>
                                <span className="truncate font-semibold">{layout.name}</span>
                                <span className="truncate text-xs text-gray-500 block">{layout.path}</span>
                            </div>
                        </div>
                    ))}
                    {(activeProject?.layouts || []).length === 0 && <p className="text-xs text-center text-gray-500 py-2">No layouts found.</p>}
                </div>
            </div>
        </>
    );
};
