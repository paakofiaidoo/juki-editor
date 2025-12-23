import React, { useState } from "react";
import { Layers, Component, Image, Wand2, Layout, GalleryHorizontal, Package, Zap, Cloud, Files, Palette, LayoutListIcon, FileCode, Bot, Database } from "lucide-react";
import { PanelHeader } from "../ui/PanelHeader";
import { SidebarTab } from "../ui/SidebarTab";
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
import { useFeature } from "../../context/FeatureContext";

import { ImportPanel } from "../panels/ImportPanel";
import { useApp } from "../../hooks/useApp";
import { Puzzle } from "lucide-react";

export const LeftSidebar = ({ isVisible }: { isVisible: boolean }) => {
    const { plugins, openModal } = useApp();
    const [activeTab, setActiveTab] = useState("Pages");
    const enableMultiAgent = useFeature("enableMultiAgent");

    const coreTabs = [
        { name: "Theme and Packages", icon: <Palette size={20} />, component: <ThemePanel /> },
        { name: "Pages", icon: <Files size={20} />, component: <PagesPanel /> },
        { name: "Layers", icon: <Layers size={20} />, component: <LayersPanel /> },
        { name: "Components", icon: <Component size={20} />, component: <ComponentsPanel /> },
        { name: "Icons", icon: <LayoutListIcon size={20} />, component: <IconsPanel /> },
        { name: "Assets", icon: <Image size={20} />, component: <AssetsPanel /> },
        { name: "AI Agent", icon: <Wand2 size={20} />, component: <AiAgentPanel /> },
        ...(enableMultiAgent ? [{ name: "Swarm", icon: <Bot size={20} />, component: <SwarmPanel /> }] : []),
        { name: "Import", icon: <FileCode size={20} />, component: <ImportPanel /> },
        { name: "Layouts", icon: <Layout size={20} />, component: <PlaceholderPanel title="Layouts" /> },
        { name: "Templates", icon: <GalleryHorizontal size={20} />, component: <PlaceholderPanel title="Templates" /> },
        { name: "Modules", icon: <Package size={20} />, component: <PlaceholderPanel title="Modules" /> },
        { name: "State", icon: <Zap size={20} />, component: <StatePanel /> },
        // CMS Removed from hardcoded list
        { name: "APIs", icon: <Cloud size={20} />, component: <PlaceholderPanel title="APIs" /> },
    ];

    const pluginTabs = plugins
        .filter((p) => p.sidebarPanel && p.sidebarIcon)
        .map((p) => {
            const Icon = p.sidebarIcon;
            const Panel = p.sidebarPanel!;
            return {
                name: p.name,
                icon: <Icon size={20} />,
                component: <Panel context={{} as any} />, // Pass dummy context or fix type
            };
        });

    const tabs = [...coreTabs, ...pluginTabs];

    const activeComponent = tabs.find((t) => t.name === activeTab)?.component;

    if (!isVisible) return null;

    return (
        <div className="w-[300px] bg-background flex h-full shrink-0 border-r border-border">
            <div className="w-14 bg-muted/20 border-r border-border flex flex-col items-center py-2 h-full justify-between">
                <div className="flex flex-col items-center w-full">
                    <TooltipProvider delayDuration={0}>
                        {tabs.map((tab) => (
                            <SidebarTab key={tab.name} icon={tab.icon} label={tab.name} active={activeTab === tab.name} onClick={() => setActiveTab(tab.name)} />
                        ))}
                    </TooltipProvider>
                </div>

                <div className="flex flex-col items-center w-full mb-2">
                    <TooltipProvider delayDuration={0}>
                        <SidebarTab icon={<Puzzle size={20} />} label="Plugins" active={false} onClick={() => openModal({ type: "PLUGINS" })} />
                    </TooltipProvider>
                </div>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden bg-card">
                <PanelHeader icon={<></>} title={activeTab} />
                <div className="flex-1 overflow-y-auto">{activeComponent}</div>
            </div>
        </div>
    );
};
