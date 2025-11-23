import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';

export const CreateComponentModal = () => {
  const { modalState, closeModal, createComponentFromSelection } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const isOpen = modalState?.type === 'CREATE_COMPONENT';

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createComponentFromSelection(name, description);
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={closeModal}>
      <div className="bg-juki-dark-2 rounded-lg p-6 w-96 border border-juki-dark-3" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-white mb-4">Create New Component</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Component Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-juki-dark-3 p-2 rounded border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green text-white" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Description</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-juki-dark-3 p-2 rounded border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green text-white" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={closeModal} className="bg-juki-dark-3 text-white font-bold py-2 px-4 rounded">Cancel</button>
            <button type="submit" className="bg-juki-green text-black font-bold py-2 px-4 rounded">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};