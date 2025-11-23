import React, { useState, useMemo } from 'react';
import { useApp } from '../../hooks/useApp';
import { Settings, Trash2 } from 'lucide-react';

export const PackagesPanel = () => {
    const { activeProject, openModal, addPackage, removePackage } = useApp();
    const [newPackageName, setNewPackageName] = useState('');

    if (!activeProject) {
        return <p className="p-4 text-xs text-center text-gray-500">No active project.</p>;
    }

    const { packageManager, packages } = activeProject;

    const handleAddPackage = () => {
        if (newPackageName.trim()) {
            addPackage(newPackageName.trim());
            setNewPackageName('');
        }
    };

    const installCommand = useMemo(() => {
        if (!packageManager || packages.length === 0) return '';
        const packageNames = packages.map(p => p.name).join(' ');
        switch (packageManager) {
            case 'npm':
                return `npm install ${packageNames}`;
            case 'yarn':
                return `yarn add ${packageNames}`;
            case 'pnpm':
                return `pnpm add ${packageNames}`;
            default:
                return '';
        }
    }, [packageManager, packages]);

    if (!packageManager) {
        return (
            <div className="p-4 text-center">
                <p className="text-sm text-gray-400 mb-4">Please select a package manager for this project.</p>
                <button
                    onClick={() => openModal({ type: 'SET_PACKAGE_MANAGER' })}
                    className="flex items-center justify-center gap-2 w-full bg-juki-dark-3 text-white text-sm font-bold p-2 rounded hover:bg-juki-dark-3/80 transition-colors"
                >
                    <Settings size={14} /> Set Package Manager
                </button>
            </div>
        );
    }

    return (
        <div className="p-2 space-y-4">
            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Add Package</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newPackageName}
                        onChange={e => setNewPackageName(e.target.value)}
                        placeholder="e.g., react-hot-toast"
                        onKeyDown={e => e.key === 'Enter' && handleAddPackage()}
                        className="flex-1 bg-juki-dark p-2 rounded border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green text-white text-sm"
                    />
                    <button
                        onClick={handleAddPackage}
                        className="bg-juki-green text-black font-bold py-2 px-4 rounded"
                    >
                        Add
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Dependencies ({packages.length})</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    {packages.map(pkg => (
                        <div key={pkg.name} className="flex items-center justify-between p-2 bg-juki-dark rounded">
                            <span className="text-white font-mono text-sm">{pkg.name}</span>
                            <button onClick={() => removePackage(pkg.name)} className="text-gray-500 hover:text-red-500">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {packages.length === 0 && (
                        <p className="text-center text-xs text-gray-500 py-4">No packages added yet.</p>
                    )}
                </div>
            </div>
            
            {installCommand && (
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Install Command</h3>
                    <div className="p-2 bg-juki-dark rounded font-mono text-sm text-juki-green break-all">
                        <code>{installCommand}</code>
                    </div>
                </div>
            )}
        </div>
    );
};