import React from "react";
import { useApp } from "../../hooks/useApp";
import { X, Check, Download, Trash2, Box } from "lucide-react";

export const PluginsModal = () => {
    const { modalState, closeModal, plugins, availablePlugins, installPlugin, uninstallPlugin } = useApp();

    if (modalState?.type !== "PLUGINS") return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[800px] h-[600px] bg-[#1e1e1e] border border-[#333] rounded-lg shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="h-16 border-b border-[#333] flex items-center justify-between px-6 bg-[#252526]">
                    <div className="flex items-center gap-3">
                        <Box className="text-blue-400" size={24} />
                        <h2 className="text-xl font-semibold text-white">Plugin Marketplace</h2>
                    </div>
                    <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 gap-4">
                        {availablePlugins.map((plugin) => {
                            const isInstalled = plugins.some((p) => p.id === plugin.id);
                            const Icon = plugin.icon || Box;

                            return (
                                <div key={plugin.id} className="bg-[#2a2a2a] border border-[#333] rounded-lg p-4 flex items-center justify-between hover:border-gray-500 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#333] rounded flex items-center justify-center text-blue-400">
                                            {typeof Icon === "function" ? <Icon size={24} /> : <Box size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                                {plugin.name}
                                                <span className="text-xs text-gray-400 bg-[#333] px-2 py-0.5 rounded">v{plugin.version}</span>
                                            </h3>
                                            <p className="text-sm text-gray-400">{plugin.description}</p>
                                            <p className="text-xs text-gray-500 mt-1">By {plugin.author}</p>
                                        </div>
                                    </div>

                                    <div>
                                        {isInstalled ? (
                                            <button
                                                onClick={() => uninstallPlugin(plugin.id)}
                                                className="px-4 py-2 bg-red-900/20 text-red-400 hover:bg-red-900/40 rounded flex items-center gap-2 transition-colors border border-red-900/50"
                                            >
                                                <Trash2 size={16} />
                                                Uninstall
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => installPlugin(plugin)}
                                                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded flex items-center gap-2 transition-colors font-medium"
                                            >
                                                <Download size={16} />
                                                Install
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Placeholder for future plugins */}
                        <div className="bg-[#2a2a2a]/50 border border-[#333] border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center opacity-70">
                            <Box className="text-gray-500 mb-2" size={32} />
                            <h3 className="text-lg font-medium text-gray-400">More Plugins Coming Soon</h3>
                            <p className="text-sm text-gray-500">Payload CMS, Figma Sync, and more...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
