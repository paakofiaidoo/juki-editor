'use client';

import React, { useState } from 'react';
import { EditorLayout } from './EditorLayout';
import { LeftSideBar } from './LeftSideBar';
import { Canvas } from './Canvas';
import { RightPanel } from './RightPanel';

export function EditorPage() {
  const [selectedTab, setSelectedTab] = useState('Page Management');

  return (
    <EditorLayout
      leftPanel={<LeftSideBar selectedTab={selectedTab} onTabChange={setSelectedTab} />}
      canvasPanel={<Canvas />}
      codePreviewPanel={<div>Code Preview Panel</div>}
      rightPanel={<RightPanel selectedTab={selectedTab} />}
    />
  );
}