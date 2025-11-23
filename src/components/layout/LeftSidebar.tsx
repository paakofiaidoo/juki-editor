import React, { useState } from 'react';
import { Layers, Component, Image, Wand2, Layout, GalleryHorizontal, Package, Zap, Cloud, Files, Palette,LayoutListIcon } from 'lucide-react';
import { PanelHeader } from '../ui/PanelHeader';
import { SidebarTab } from '../ui/SidebarTab';
import { TooltipProvider } from '../ui/tooltip';
import { LayersPanel } from '../panels/LayersPanel';
import { ComponentsPanel } from '../panels/ComponentsPanel';
import { AssetsPanel } from '../panels/AssetsPanel';
import { AiAgentPanel } from '../panels/AiAgentPanel';
import { PlaceholderPanel } from '../panels/PlaceholderPanel';
import { PagesPanel } from '../panels/PagesPanel';
import { IconsPanel } from '../panels/IconsPanel';
import { ThemePanel } from '../panels/ThemePanel';


export const LeftSidebar = ({ isVisible }: { isVisible: boolean }) => {
  const [activeTab, setActiveTab] = useState('Pages');

  const tabs = [
    { name: 'Theme and Packages', icon: <Palette size={20} />, component: <ThemePanel /> },
    { name: 'Pages', icon: <Files size={20} />, component: <PagesPanel /> },
    { name: 'Layers', icon: <Layers size={20} />, component: <LayersPanel /> },
    { name: 'Components', icon: <Component size={20} />, component: <ComponentsPanel /> },
    { name: 'Icons', icon: <LayoutListIcon size={20} />, component: <IconsPanel /> },
    { name: 'Assets', icon: <Image size={20} />, component: <AssetsPanel /> },
    { name: 'AI Agent', icon: <Wand2 size={20} />, component: <AiAgentPanel /> },
    { name: 'Layouts', icon: <Layout size={20} />, component: <PlaceholderPanel title="Layouts" /> },
    { name: 'Templates', icon: <GalleryHorizontal size={20} />, component: <PlaceholderPanel title="Templates" /> },
    { name: 'Modules', icon: <Package size={20} />, component: <PlaceholderPanel title="Modules" /> },
    { name: 'State', icon: <Zap size={20} />, component: <PlaceholderPanel title="State" /> },
    { name: 'APIs', icon: <Cloud size={20} />, component: <PlaceholderPanel title="APIs" /> },
  ];

  const activeComponent = tabs.find(t => t.name === activeTab)?.component;

  if (!isVisible) return null;

  return (
    <div className="w-[300px] bg-background flex h-full shrink-0 border-r border-border">
      <div className="w-14 bg-muted/20 border-r border-border flex flex-col items-center py-2">
        <TooltipProvider delayDuration={0}>
            {tabs.map(tab => (
            <SidebarTab
                key={tab.name}
                icon={tab.icon}
                label={tab.name}
                active={activeTab === tab.name}
                onClick={() => setActiveTab(tab.name)}
            />
            ))}
        </TooltipProvider>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden bg-card">
        <PanelHeader icon={<></>} title={activeTab} />
        <div className="flex-1 overflow-y-auto">{activeComponent}</div>
      </div>
    </div>
  );
};