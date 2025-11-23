import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';

// NOTE: This component is now named AddComponentFromCodeModal conceptually.
export const AddComponentFromCodeModal = () => {
  const { modalState, closeModal, addComponentFromCode } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [parseMode, setParseMode] = useState<'jsx' | 'html'>('jsx');

  const isOpen = modalState?.type === 'ADD_COMPONENT_FROM_CODE';

  const jsxPlaceholder = '<div className="p-4 bg-blue-500 text-white">\n  <h1>My Component</h1>\n</div>';
  const htmlPlaceholder = '<div class="card">\n  <h2>Title</h2>\n  <p>Hello world</p>\n</div>';

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setCode(parseMode === 'jsx' ? jsxPlaceholder : htmlPlaceholder);
    }
  }, [isOpen]);
  
  useEffect(() => {
    setCode(parseMode === 'jsx' ? jsxPlaceholder : htmlPlaceholder);
  }, [parseMode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && code.trim()) {
      addComponentFromCode(name, description, code, parseMode);
      closeModal();
    }
  };

  const ModeButton = ({ mode, label }: { mode: 'jsx' | 'html', label: string }) => (
      <button
        type="button"
        onClick={() => setParseMode(mode)}
        className={`px-3 py-1 text-sm font-semibold rounded-md ${
            parseMode === mode ? 'bg-juki-green text-black' : 'bg-juki-dark text-gray-300 hover:bg-juki-dark/50'
        }`}
      >
          {label}
      </button>
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={closeModal}>
      <div className="bg-juki-dark-2 rounded-lg p-6 w-[500px] border border-juki-dark-3 flex flex-col" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-white mb-4">Add Component from Code</h2>
        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-xs text-gray-400 block mb-1">Component Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-juki-dark-3 p-2 rounded border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green text-white" />
            </div>
            <div>
                <label className="text-xs text-gray-400 block mb-1">Description</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-juki-dark-3 p-2 rounded border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green text-white" />
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-400 block">Code (must have a single root element)</label>
                <div className="flex gap-1 bg-juki-dark-3 p-0.5 rounded-lg">
                    <ModeButton mode="jsx" label="JSX" />
                    <ModeButton mode="html" label="HTML" />
                </div>
            </div>
            <textarea 
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full h-full flex-1 bg-juki-dark p-2 rounded border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green text-white font-mono text-sm resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={closeModal} className="bg-juki-dark-3 text-white font-bold py-2 px-4 rounded">Cancel</button>
            <button type="submit" className="bg-juki-green text-black font-bold py-2 px-4 rounded">Create Component</button>
          </div>
        </form>
      </div>
    </div>
  );
};
