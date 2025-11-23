import React, { useState, useRef } from 'react';
import { useApp } from '../../hooks/useApp';
import { geminiService } from '../../lib/gemini';
import { AssetItem } from '../../types';

export const AssetsPanel = () => {
    const { activeProject, addAsset } = useApp();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const assetLibrary = activeProject?.assetLibrary || [];

    const generateImage = async () => {
        if(!prompt.trim() || isGenerating) return;
        setIsGenerating(true);
        const imageUrl = await geminiService.generateImage(prompt);
        if(!imageUrl.startsWith('Error:')) {
            const newAsset: AssetItem = {
                id: crypto.randomUUID(),
                name: prompt.substring(0, 30),
                type: 'IMAGE',
                url: imageUrl,
                metadata: { prompt }
            };
            addAsset(newAsset);
        } else {
            alert(imageUrl); // Simple error display
        }
        setIsGenerating(false);
        setPrompt('');
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const name = window.prompt("Enter a name for this asset:", file.name);
        if (name === null) {
             event.target.value = ''; 
             return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const url = e.target?.result as string;
            if (url) {
                const newAsset: AssetItem = {
                    id: crypto.randomUUID(),
                    name: name || file.name,
                    type: 'IMAGE',
                    url: url,
                    metadata: { originalFilename: file.name, size: file.size }
                };
                addAsset(newAsset);
            }
        };
        reader.readAsDataURL(file);
        event.target.value = ''; 
    };

    return (
        <div className="p-2 space-y-4">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
             <div className="space-y-2">
                <h3 className="font-bold text-white">Add Asset</h3>
                <button 
                    onClick={handleUploadClick} 
                    className="w-full bg-juki-dark-3 text-white font-bold p-2 rounded hover:bg-juki-dark-3/80 transition-colors disabled:opacity-50"
                    disabled={!activeProject}
                >
                    Upload from Computer
                </button>
            </div>
            <div>
                <h3 className="font-bold text-white mb-2">Generate Image with Gemini</h3>
                <div className="flex">
                    <input 
                        type="text"
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="e.g., a cat wearing a space helmet"
                        className="flex-grow bg-juki-dark-3 border border-juki-dark-3 text-white rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-juki-green"
                        disabled={isGenerating || !activeProject}
                    />
                    <button onClick={generateImage} disabled={isGenerating || !prompt.trim() || !activeProject} className="bg-juki-green text-black font-bold p-2 rounded-r-md disabled:bg-gray-500">
                        {isGenerating ? '...' : 'Go'}
                    </button>
                </div>
            </div>
            <div>
                 <h3 className="font-bold text-white mb-2">Asset Library</h3>
                 <div className="grid grid-cols-3 gap-2">
                    {assetLibrary.filter(a => a.type === 'IMAGE').map(asset => (
                        <div key={asset.id} className="relative group aspect-square">
                            <img src={asset.url} alt={asset.name} title={asset.name} className="w-full h-full object-cover rounded" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-center text-white text-[10px] truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {asset.name}
                            </div>
                        </div>
                    ))}
                 </div>
                 {assetLibrary.length === 0 && (
                    <p className="text-xs text-center text-gray-500 py-4">Your asset library is empty.</p>
                 )}
            </div>
        </div>
    );
};