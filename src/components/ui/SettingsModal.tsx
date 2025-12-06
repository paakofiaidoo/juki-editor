import React from "react";
import { X } from "lucide-react";
import { useFeatures, FeatureFlags } from "../../context/FeatureContext";
import { useApp } from "../../hooks/useApp";

export const SettingsModal = () => {
    const { modalState, closeModal } = useApp();
    const { flags, setFlag } = useFeatures();

    if (modalState?.type !== "SETTINGS") return null;

    const features: { key: keyof FeatureFlags; label: string; description: string }[] = [
        {
            key: "enableMultiAgent",
            label: "Multi-Agent System (Swarm)",
            description: "Enable the experimental multi-agent chat interface and orchestration.",
        },
        {
            key: "enableCMS",
            label: "CMS Integration",
            description: "Enable Content Management System plugins and data binding.",
        },
        {
            key: "enableRealTimeSync",
            label: "Real-time File Sync",
            description: "Automatically sync changes from the filesystem to the editor.",
        },
        {
            key: "enableAnimations",
            label: "Advanced Animations",
            description: "Enable Framer Motion presets and timeline controls.",
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-background border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold">Settings</h2>
                    <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">General</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg border border-border bg-card space-y-3">
                                    <label htmlFor="apiKey" className="block font-medium">
                                        Gemini API Key
                                    </label>
                                    <p className="text-sm text-muted-foreground">Required for AI features (Swarm, Code Pilot, etc).</p>
                                    <input
                                        id="apiKey"
                                        type="password"
                                        placeholder="AIzaSy..."
                                        className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        defaultValue={useApp().activeProject?.apiKey || ""}
                                        onBlur={(e) => {
                                            const val = e.target.value;
                                            const { activeProject, updateProject } = useApp();
                                            if (activeProject && val !== activeProject.apiKey) {
                                                updateProject({ ...activeProject, apiKey: val });
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Experimental Features</h3>
                            <div className="space-y-4">
                                {features.map((feature) => (
                                    <div key={feature.key} className="flex items-start justify-between p-4 rounded-lg border border-border bg-card">
                                        <div className="space-y-1">
                                            <label htmlFor={feature.key} className="font-medium cursor-pointer">
                                                {feature.label}
                                            </label>
                                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                                        </div>
                                        <div className="flex items-center h-6">
                                            <input
                                                id={feature.key}
                                                type="checkbox"
                                                checked={flags[feature.key]}
                                                onChange={(e) => setFlag(feature.key, e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-border bg-muted/50 flex justify-end">
                    <button onClick={closeModal} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:brightness-110 transition-colors">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};
