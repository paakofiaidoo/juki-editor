import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { generatePageComponent, generateUserComponentFile } from '../../utils/jsxGenerator';
import Editor from '@monaco-editor/react';
import { RefreshCw } from 'lucide-react';

export const EditableCodeView = () => {
  const { activeProject, activePage, updatePageFromCode } = useApp();
  const [code, setCode] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const generatedCode = useMemo(() => {
    if (!activeProject || !activePage) return 'No page selected.';
    
    const pageCode = generatePageComponent(activePage, activeProject);
    const componentCode = activeProject.userComponents
      .map(comp => generateUserComponentFile(comp, activeProject))
      .join('\n\n// ----\n\n');
      
    return `// Page: ${activePage.name}\n${pageCode}\n\n// ---- User Components ----\n\n${componentCode}`;
    
  }, [activePage, activeProject]);
  
  useEffect(() => {
      setCode(generatedCode);
  }, [generatedCode]);

  const handleSync = () => {
    if (!activePage) return;
    setIsSyncing(true);
    // The parser only works on the main page component, so we extract it.
    const pageCodeBlock = code.split('// ---- User Components ----')[0];
    updatePageFromCode(pageCodeBlock);
    // A small delay to give feedback to the user
    setTimeout(() => setIsSyncing(false), 500);
  };
  
  if (!activeProject || !activePage) {
    return (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
            <p>Select a page to view and edit its code.</p>
        </div>
    );
  }

  return (
    <div className="bg-juki-dark-2 h-full text-white flex flex-col">
       <div className="flex items-center justify-between p-2 border-b border-juki-dark-3 shrink-0">
          <p className="text-sm font-semibold text-gray-300">Live Code Editor</p>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3 py-1 bg-juki-green/20 text-juki-green rounded-md text-sm font-semibold hover:bg-juki-green/30 transition-colors disabled:opacity-50"
          >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              Sync to Canvas
          </button>
       </div>
       <div className="flex-1">
        <Editor
            height="100%"
            language="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
            }}
        />
       </div>
    </div>
  );
};