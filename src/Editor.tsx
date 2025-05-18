import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, Separator } from '@/components/ui/resizable';
import { LeftSideBar } from './LeftSideBar';
import { RightPanel } from './RightPanel';
import { Canvas } from './Canvas';

const Editor: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('Page Management'); // State for the selected tab

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
        <LeftSideBar selectedTab={selectedTab} onTabChange={setSelectedTab} />
      </ResizablePanel>
      <Separator />
      <ResizablePanel defaultSize={60} minSize={30}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={75} minSize={40}>
            <Canvas />
          </ResizablePanel>
          <Separator />
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="flex h-full items-center justify-center p-6">Code Preview</div> {/* Placeholder */}
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <Separator />
      <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
        <RightPanel selectedTab={selectedTab} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Editor;