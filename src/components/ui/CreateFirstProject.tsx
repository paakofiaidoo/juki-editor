import React, { useState } from 'react';
import { Github } from 'lucide-react';

interface CreateFirstProjectProps {
    onCreateProject: (name: string, description: string, githubUrl?: string) => void;
}

export const CreateFirstProject = ({ onCreateProject }: CreateFirstProjectProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [connectToGithub, setConnectToGithub] = useState(false);
    const [githubUrl, setGithubUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(name.trim()){
            onCreateProject(name.trim(), description, connectToGithub ? githubUrl : undefined);
        }
    };

    return (
        <div className="h-screen w-screen bg-juki-dark text-juki-light flex items-center justify-center p-4">
            <div className="text-center p-8 bg-juki-dark-2 rounded-lg border border-juki-dark-3 shadow-2xl max-w-md w-full">
                <h1 className="text-4xl font-black text-white mb-2">Welcome to Juki</h1>
                <p className="text-gray-400 mb-6">Let's start by creating your first project.</p>
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                     <div>
                        <label className="text-sm font-semibold text-gray-300 block mb-1">Project Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            required 
                            className="w-full bg-juki-dark-3 p-3 rounded border border-juki-dark-3 focus:outline-none focus:ring-2 focus:ring-juki-green text-white"
                            placeholder="My Awesome Website"
                        />
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-gray-300 block mb-1">Description (for &lt;head&gt; tag)</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={2}
                            className="w-full bg-juki-dark-3 p-3 rounded border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green text-white"
                            placeholder="A short description of your project for search engines."
                        />
                    </div>
                     <div className="flex items-center gap-2 text-sm text-gray-300 pt-2">
                        <input
                            type="checkbox"
                            id="connect-github-first"
                            checked={connectToGithub}
                            onChange={(e) => setConnectToGithub(e.target.checked)}
                            className="w-4 h-4 rounded bg-juki-dark-3 border-juki-dark-3 text-juki-green focus:ring-juki-green"
                        />
                        <label htmlFor="connect-github-first">Connect to GitHub</label>
                    </div>
                     {connectToGithub && (
                          <div>
                            <label className="text-sm font-semibold text-gray-300 block mb-1">GitHub Repository URL</label>
                             <div className="relative">
                                <Github size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="url" 
                                    value={githubUrl} 
                                    onChange={e => setGithubUrl(e.target.value)}
                                    className="w-full bg-juki-dark-3 p-3 pl-10 rounded border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green text-white"
                                    placeholder="https://github.com/user/repo"
                                />
                            </div>
                          </div>
                      )}

                     <button 
                        type="submit" 
                        className="w-full bg-juki-green text-black font-bold py-3 px-4 rounded text-lg hover:brightness-110 transition-all mt-4"
                    >
                        Create Project
                    </button>
                </form>
            </div>
        </div>
    );
};