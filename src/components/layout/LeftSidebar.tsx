import React, { useState } from "react";
import { Layers, Component, Image, Wand2, Layout, GalleryHorizontal, Package, Zap, Cloud, Files, Palette, LayoutListIcon, FileCode, Bot, Code, Settings2, Puzzle } from "lucide-react";
import { PanelHeader } from "../ui/PanelHeader";
import { SidebarSection } from "../ui/SidebarSection";
import { TooltipProvider } from "../ui/tooltip";
import { LayersPanel } from "../panels/LayersPanel";
import { ComponentsPanel } from "../panels/ComponentsPanel";
import { AssetsPanel } from "../panels/AssetsPanel";
import { AiAgentPanel } from "../panels/AiAgentPanel";
import { PlaceholderPanel } from "../panels/PlaceholderPanel";
import { StatePanel } from "../panels/StatePanel";
import { PagesPanel } from "../panels/PagesPanel";
import { IconsPanel } from "../panels/IconsPanel";
import { ThemePanel } from "../panels/ThemePanel";
import { SwarmPanel } from "../panels/SwarmPanel";
import { ImportPanel } from "../panels/ImportPanel";
import { useFeature } from "../../context/FeatureContext";
import { useApp } from "../../hooks/useApp";
import { cn } from "@/lib/utils";

export const LeftSidebar = ({ isVisible }: { isVisible: boolean }) => {
    const { plugins, openModal, activeView, setActiveView } = useApp();
    const [activeTopTab, setActiveTopTab] = useState("Editor");
    const enableMultiAgent = useFeature("enableMultiAgent");

    if (!isVisible) return null;

    // Define the Top Navigation Tabs
    const topTabs = [
        { id: "Editor", label: "Editor", icon: <LayoutListIcon size={16} /> },
        { id: "Code", label: "Code", icon: <Code size={16} /> },
        { id: "Pilot", label: "Pilot", icon: <Wand2 size={16} /> },
        { id: "States", label: "States", icon: <Zap size={16} /> },
        { id: "API", label: "API", icon: <Cloud size={16} /> },
    ];

    // Define Content for "Editor" Tab (Accordions)
    const editorSections = [
        { title: "Pages", icon: <Files size={16} />, component: <PagesPanel />, defaultOpen: true },
        { title: "Layers", icon: <Layers size={16} />, component: <LayersPanel />, defaultOpen: false },
        { title: "Components", icon: <Component size={16} />, component: <ComponentsPanel />, defaultOpen: false },
        { title: "Elements", icon: <Layout size={16} />, component: <PlaceholderPanel title="Elements Library" />, defaultOpen: false },
        { title: "Icons", icon: <LayoutListIcon size={16} />, component: <IconsPanel />, defaultOpen: false },
        { title: "Assets", icon: <Image size={16} />, component: <AssetsPanel />, defaultOpen: false },
        { title: "Theme", icon: <Palette size={16} />, component: <ThemePanel />, defaultOpen: false },
        { title: "Import", icon: <FileCode size={16} />, component: <ImportPanel />, defaultOpen: false },
    ];

    // Plugin Sections (Appended to Editor for now, or separate tab?)
    // Let's put them in Editor for visibility
    const pluginSections = plugins
        .filter((p) => p.sidebarPanel && p.sidebarIcon)
        .map((p) => {
            const Icon = p.sidebarIcon;
            const Panel = p.sidebarPanel!;
            return {
                title: p.name,
                icon: <Icon size={16} />,
                component: <Panel context={{} as any} />,
                defaultOpen: false,
            };
        });

    // Combine Editor Sections
    const allEditorSections = [...editorSections, ...pluginSections];

    const handleTabChange = (tabId: string) => {
        setActiveTopTab(tabId);
        // Optional: Link "Code" tab to global ActiveView if desired
        // if (tabId === "Code") setActiveView("code");
        // else setActiveView("canvas");
    };

    return (
        <div className="w-[300px] bg-background flex flex-col h-full shrink-0 border-r border-border font-sans">
            {/* Top Navigation Bar */}
            <div className="flex items-center px-1 border-b border-border bg-muted/30">
                {topTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={cn(
                            "flex flex-col items-center justify-center flex-1 py-3 text-[10px] font-medium transition-all gap-1 border-b-2",
                            activeTopTab === tab.id ? "text-primary border-primary bg-background" : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50"
                        )}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
                {/* EDITOR TAB CONTENT */}
                {activeTopTab === "Editor" && (
                    <div className="flex flex-col">
                        {allEditorSections.map((section, idx) => (
                            <SidebarSection key={idx} title={section.title} icon={section.icon} defaultOpen={section.defaultOpen}>
                                {section.component}
                            </SidebarSection>
                        ))}
                    </div>
                )}

                {/* CODE TAB CONTENT */}
                {activeTopTab === "Code" && (
                    <div className="p-4 text-center text-muted-foreground">
                        <Code className="mx-auto mb-2 opacity-50" size={32} />
                        <p className="text-sm">Code View Integration coming soon...</p>
                        <p className="text-xs mt-2">Use the "Code" toggle in toolbar for now.</p>
                    </div>
                )}

                {/* PILOT TAB CONTENT */}
                {activeTopTab === "Pilot" && <AiAgentPanel />}
                {enableMultiAgent && activeTopTab === "Pilot" && <SwarmPanel />}
                {/* Note: Swarm might need its own tab or sub-tab in Pilot */}

                {/* STATES TAB CONTENT */}
                {activeTopTab === "States" && <StatePanel />}

                {/* API TAB CONTENT */}
                {activeTopTab === "API" && <PlaceholderPanel title="API Configuration" />}
            </div>

            {/* Sidebar Footer / Plugins Trigger */}
            <div className="p-2 border-t border-border bg-muted/10">
                <button
                    onClick={() => openModal({ type: "PLUGINS" })}
                    className="flex items-center justify-center w-full px-3 py-2 text-xs font-medium transition-colors border rounded-md text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                >
                    <Puzzle size={14} className="mr-2" />
                    Manage Plugins
                </button>
            </div>
        </div>
    );
};
