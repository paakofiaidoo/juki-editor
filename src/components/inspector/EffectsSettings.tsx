import React from "react";
import { Sparkles } from "lucide-react";

interface EffectsSettingsProps {
    styles: React.CSSProperties;
    handleStyleChange: (key: keyof React.CSSProperties, value: any) => void;
    item?: any;
    onUpdate?: (updates: any) => void;
}

const ANIMATION_PRESETS = {
    none: { name: "None", values: {} },
    fadeIn: {
        name: "Fade In",
        values: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.4 },
        },
    },
    fadeInUp: {
        name: "Fade In Up",
        values: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, ease: "easeOut" },
        },
    },
    fadeInDown: {
        name: "Fade In Down",
        values: {
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, ease: "easeOut" },
        },
    },
    slideInLeft: {
        name: "Slide In Left",
        values: {
            initial: { opacity: 0, x: -50 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.4, ease: "easeOut" },
        },
    },
    pop: {
        name: "Pop",
        values: {
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            transition: { type: "spring", damping: 15 },
        },
    },
    hoverLift: {
        name: "Hover: Lift",
        values: {
            whileHover: { y: -5 },
            transition: { duration: 0.2 },
        },
    },
    hoverScale: {
        name: "Hover: Scale",
        values: {
            whileHover: { scale: 1.05 },
            transition: { duration: 0.2 },
        },
    },
    hoverGlow: {
        name: "Hover: Glow",
        values: {
            whileHover: { boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" },
            transition: { duration: 0.2 },
        },
    },
};

export const EffectsSettings = ({ styles, handleStyleChange, item, onUpdate }: EffectsSettingsProps) => {
    // Opacity is a number between 0 and 1. For the UI, we'll use 0-100.
    const opacityValue = styles.opacity !== undefined ? Number(styles.opacity) * 100 : 100;

    const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const newOpacity = Math.max(0, Math.min(100, Number(value)));
        handleStyleChange("opacity", newOpacity / 100);
    };

    const handleAnimationChange = (type: "initial" | "animate" | "whileHover" | "transition", key: string, value: any) => {
        if (!onUpdate || !item) return;

        const currentAnimation = item.animation || {};
        const currentTypeObj = currentAnimation[type] || {};

        onUpdate({
            animation: {
                ...currentAnimation,
                [type]: {
                    ...currentTypeObj,
                    [key]: value,
                },
            },
        });
    };

    const applyPreset = (presetKey: string) => {
        if (!onUpdate || !item) return;

        if (presetKey === "none") {
            // retain styles but clear animation
            onUpdate({ animation: undefined });
            return;
        }

        const preset = ANIMATION_PRESETS[presetKey as keyof typeof ANIMATION_PRESETS];
        if (preset) {
            // Merge with existing animation or replace? Replacing is usually what "Preset" implies.
            // But we might want to keep some manual overrides. For now, let's replace for simplicity/clarity.
            onUpdate({
                animation: {
                    ...preset.values,
                },
            });
        }
    };

    const getAnimationValue = (type: "initial" | "animate" | "whileHover", key: string, defaultValue: any) => {
        return item?.animation?.[type]?.[key] ?? defaultValue;
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="text-xs text-gray-400 block mb-1">Opacity</label>
                <div className="flex items-center gap-2">
                    <input type="range" min="0" max="100" value={opacityValue} onChange={handleOpacityChange} className="w-full h-2 bg-juki-dark-3 rounded-lg appearance-none cursor-pointer" />
                    <div className="relative w-20">
                        <input
                            type="number"
                            value={opacityValue.toFixed(0)}
                            onChange={handleOpacityChange}
                            className="w-full bg-juki-dark p-1 rounded text-sm text-white text-center"
                            min="0"
                            max="100"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">%</span>
                    </div>
                </div>
            </div>

            {onUpdate && (
                <>
                    <div className="border-t border-juki-dark-3 pt-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={14} className="text-yellow-500" />
                            <p className="text-sm font-bold text-white">Animations</p>
                        </div>

                        <div className="space-y-4">
                            {/* PRESETS DROPDOWN */}
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Quick Preset</label>
                                <select
                                    onChange={(e) => applyPreset(e.target.value)}
                                    className="w-full bg-juki-dark border border-gray-700 rounded p-1.5 text-sm text-white focus:border-blue-500 outline-none"
                                    defaultValue="none"
                                >
                                    <option value="none">Select a preset...</option>
                                    {Object.entries(ANIMATION_PRESETS).map(
                                        ([key, preset]) =>
                                            key !== "none" && (
                                                <option key={key} value={key}>
                                                    {preset.name}
                                                </option>
                                            )
                                    )}
                                </select>
                            </div>

                            <div className="h-px bg-gray-800 my-2" />

                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Initial Opacity</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={getAnimationValue("initial", "opacity", 0)}
                                    onChange={(e) => handleAnimationChange("initial", "opacity", parseFloat(e.target.value))}
                                    className="w-full bg-juki-dark p-1 rounded text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Animate Opacity</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={getAnimationValue("animate", "opacity", 1)}
                                    onChange={(e) => handleAnimationChange("animate", "opacity", parseFloat(e.target.value))}
                                    className="w-full bg-juki-dark p-1 rounded text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Hover Scale</label>
                                <input
                                    type="number"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={getAnimationValue("whileHover", "scale", 1)}
                                    onChange={(e) => handleAnimationChange("whileHover", "scale", parseFloat(e.target.value))}
                                    className="w-full bg-juki-dark p-1 rounded text-sm text-white"
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
