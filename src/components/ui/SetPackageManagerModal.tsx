import React from 'react';
import { useApp } from '../../hooks/useApp';
import { PackageManager } from '../../types';

export const SetPackageManagerModal = () => {
    const { modalState, closeModal, setPackageManager } = useApp();
    const isOpen = modalState?.type === 'SET_PACKAGE_MANAGER';

    if (!isOpen) return null;

    const handleSelect = (manager: PackageManager) => {
        setPackageManager(manager);
        closeModal();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={closeModal}>
            <div className="bg-juki-dark-2 rounded-lg p-6 w-96 border border-juki-dark-3 text-center" onClick={e => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-white mb-2">Select Package Manager</h2>
                <p className="text-sm text-gray-400 mb-6">Choose the package manager you use for this project. This will help generate the correct commands.</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => handleSelect('npm')}
                        className="bg-juki-dark-3 text-white font-bold py-3 px-6 rounded hover:bg-red-600 transition-colors"
                    >
                        NPM
                    </button>
                    <button
                        onClick={() => handleSelect('yarn')}
                        className="bg-juki-dark-3 text-white font-bold py-3 px-6 rounded hover:bg-blue-600 transition-colors"
                    >
                        Yarn
                    </button>
                    <button
                        onClick={() => handleSelect('pnpm')}
                        className="bg-juki-dark-3 text-white font-bold py-3 px-6 rounded hover:bg-yellow-500 transition-colors"
                    >
                        PNPM
                    </button>
                </div>
            </div>
        </div>
    );
};