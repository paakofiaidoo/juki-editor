import { AppProvider } from '@/context/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { useState } from 'react';
import { useApp } from '@/hooks/useApp';
import { CreateFirstProject } from '@/components/ui/CreateFirstProject';
import { FontManager } from '@/components/layout/FontManager';
import { PreviewMode } from '@/components/ui/PreviewMode';

const AppContent = () => {
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);
  const { projects, addProject, isPreviewMode } = useApp();

  if (projects.length === 0) {
    return <CreateFirstProject onCreateProject={addProject} />;
  }
  
  if (isPreviewMode) {
    return <PreviewMode />;
  }

  return (
    <MainLayout
      isLeftSidebarVisible={isLeftSidebarVisible}
      isRightSidebarVisible={isRightSidebarVisible}
      toggleLeftSidebar={() => setIsLeftSidebarVisible(v => !v)}
      toggleRightSidebar={() => setIsRightSidebarVisible(v => !v)}
    />
  );
}

export default function App() {
  return (
    <AppProvider>
      <FontManager />
      <AppContent />
    </AppProvider>
  );
}