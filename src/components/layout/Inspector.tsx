import React from "react";
import { PanelHeader } from "../ui/PanelHeader";
import { useApp } from "../../hooks/useApp";
import { Settings, ToyBrick } from "lucide-react";
import { StyleEditor } from "../inspector/StyleEditor";
import { PropsEditor } from "../inspector/PropsEditor";
import { CustomCssPanel } from "../panels/CustomCssPanel";
import { AnyCanvasItem, Page } from "../../types";

export const Inspector = ({ isVisible }: { isVisible: boolean }) => {
    const { selectedItemIds, activePage, findItemInTree, updatePage } = useApp();
    const [activeTab, setActiveTab] = React.useState("Style");

    if (!isVisible) return null;

    const selectedItemId = selectedItemIds.length > 0 ? selectedItemIds[selectedItemIds.length - 1] : null;

    let selectedItem: AnyCanvasItem | Page | null = null;
    if (selectedItemId && activePage) {
        selectedItem = findItemInTree(selectedItemId, activePage.children)?.item || null;
    } else if (activePage) {
        selectedItem = activePage;
    }

    const renderInspectorContent = () => {
        if (!selectedItem) {
            return <div className="p-4 text-center text-gray-500 text-sm">Select an element on the canvas or a page in the Pages panel to inspect its properties.</div>;
        }

        const isPage = "route" in selectedItem;
        const pageToEdit = isPage ? selectedItem : activePage;

        return (
            <div className="flex flex-col h-full">
                <div className="p-2 border-b border-juki-dark-3 shrink-0">
                    <p className="text-sm font-bold text-white truncate">{selectedItem.name}</p>
                    {/* FIX: Use type assertion to help TypeScript narrow the type correctly. */}
                    <p className="text-xs text-gray-400">{isPage ? "Page" : (selectedItem as AnyCanvasItem).type}</p>
                </div>
                <div className="flex border-b border-juki-dark-3 shrink-0">
                    <button
                        onClick={() => setActiveTab("Style")}
                        className={`flex-1 flex items-center justify-center gap-2 p-2 text-sm ${activeTab === "Style" ? "bg-juki-dark-3 text-white" : "text-gray-400 hover:bg-juki-dark-3"}`}
                    >
                        <Settings size={14} /> Style
                    </button>
                    <button
                        onClick={() => setActiveTab("Props")}
                        className={`flex-1 flex items-center justify-center gap-2 p-2 text-sm ${activeTab === "Props" ? "bg-juki-dark-3 text-white" : "text-gray-400 hover:bg-juki-dark-3"}`}
                    >
                        <ToyBrick size={14} /> Props
                    </button>
                    <button
                        onClick={() => setActiveTab("CSS")}
                        className={`flex-1 flex items-center justify-center gap-2 p-2 text-sm ${activeTab === "CSS" ? "bg-juki-dark-3 text-white" : "text-gray-400 hover:bg-juki-dark-3"}`}
                    >
                        <span className="font-mono text-xs">CSS</span>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {activeTab === "Style" && <StyleEditor item={selectedItem} onPageUpdate={pageToEdit ? (updates) => updatePage(pageToEdit.id, updates) : undefined} />}
                    {activeTab === "Props" && <PropsEditor item={selectedItem} onPageUpdate={pageToEdit ? (updates) => updatePage(pageToEdit.id, updates) : undefined} />}
                    {activeTab === "CSS" && <CustomCssPanel />}
                </div>
            </div>
        );
    };

    return (
        <div className="w-[300px] bg-juki-dark-2 flex flex-col h-full shrink-0 border-l border-juki-dark-3">
            <PanelHeader icon={<></>} title="Inspector" />
            {renderInspectorContent()}
        </div>
    );
};
