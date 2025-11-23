import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { Github } from 'lucide-react';

export const CreateProjectModal = () => {
  const { modalState, closeModal, addProject } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [connectToGithub, setConnectToGithub] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');

  const isOpen = modalState?.type === 'CREATE_PROJECT';

  useEffect(() => {
    if (isOpen) {
        setName('');
        setDescription('');
        setConnectToGithub(false);
        setGithubUrl('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addProject(name.trim(), description, connectToGithub ? githubUrl : undefined);
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={closeModal}>
      <div className="bg-juki-dark-2 rounded-lg p-6 w-96 border border-juki-dark-3" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-white mb-4">Create New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Project Name</label>
            <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                className="w-full bg-juki-dark-3 p-2 rounded border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green text-white"
                placeholder="My Awesome Website"
            />
          </div>
           <div>
            <label className="text-xs text-gray-400 block mb-1">Description (for &lt;head&gt; tag)</label>
            <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                className="w-full bg-juki-dark-3 p-2 rounded border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green text-white"
                placeholder="A short description of your project."
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
             <input
                type="checkbox"
                id="connect-github-modal"
                checked={connectToGithub}
                onChange={(e) => setConnectToGithub(e.target.checked)}
                className="w-4 h-4 rounded bg-juki-dark-3 border-juki-dark-3 text-juki-green focus:ring-juki-green"
              />
              <label htmlFor="connect-github-modal">Connect to GitHub</label>
          </div>
          {connectToGithub && (
              <div>
                <label className="text-xs text-gray-400 block mb-1">GitHub Repository URL</label>
                 <div className="relative">
                    <Github size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="url" 
                        value={githubUrl} 
                        onChange={e => setGithubUrl(e.target.value)}
                        className="w-full bg-juki-dark-3 p-2 pl-8 rounded border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green text-white"
                        placeholder="https://github.com/user/repo"
                    />
                </div>
              </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={closeModal} className="bg-juki-dark-3 text-white font-bold py-2 px-4 rounded">Cancel</button>
            <button type="submit" className="bg-juki-green text-black font-bold py-2 px-4 rounded">Create Project</button>
          </div>
        </form>
      </div>
    </div>
  );
};