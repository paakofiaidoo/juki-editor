import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { Theme, ImportedFont } from '../../types';
import { geminiService } from '../../lib/gemini';
import { Wand2, RefreshCw, Search } from 'lucide-react';
import { ThemePreview } from '../ui/ThemePreview';
import { ManageFontsModal } from '../ui/ManageFontsModal';
import { FontFamilySelect } from '../ui/FontFamilySelect';
import { generateRandomTheme } from '../../utils/colorUtils';
import { PackagesPanel } from './PackagesPanel';
import { PaletteSuggestions } from '../ui/PaletteSuggestions';

const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
    <div className="flex items-center justify-between">
        <label className="text-sm text-gray-300">{label}</label>
        <div className="flex items-center gap-2">
            <input
                type="color"
                value={value || '#000000'}
                onChange={e => onChange(e.target.value)}
                className="w-6 h-6 p-0 border-none rounded cursor-pointer bg-juki-dark-3"
            />
            <input
                type="text"
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                className="w-24 bg-juki-dark-3 p-1 rounded text-sm text-white text-center font-mono"
                placeholder="#RRGGBB"
            />
        </div>
    </div>
);

const ThemeEditor = () => {
    const { activeProject, updateProjectTheme } = useApp();
    const [isGenerating, setIsGenerating] = useState(false);
    const [isFontModalOpen, setIsFontModalOpen] = useState(false);
    const [paletteSearchQuery, setPaletteSearchQuery] = useState('');
    
    if (!activeProject) return null;
    const theme = activeProject.theme;

    const handleThemeChange = (updates: Partial<Theme>) => {
        updateProjectTheme({ ...theme, ...updates });
    };

    const handleColorChange = (colorName: keyof Theme['colors'], value: string) => {
        handleThemeChange({ colors: { ...theme.colors, [colorName]: value } });
    };
    
    const handleFontChange = (fontType: keyof Theme['fonts'], value: string) => {
        handleThemeChange({ fonts: { ...theme.fonts, [fontType]: value } });
    }
    
    const handleSaveFonts = (fonts: ImportedFont[]) => {
        handleThemeChange({ importedFonts: fonts });
    };

    const handleAiGenerate = async () => {
        if (!activeProject) return;
        setIsGenerating(true);
        try {
            const newTheme = await geminiService.generateTheme(activeProject.name, activeProject.description);
            updateProjectTheme({ ...newTheme, importedFonts: theme.importedFonts || [] });
        } catch (error) {
            console.error(error);
            alert(`Failed to generate theme: ${(error as Error).message}`);
        }
        setIsGenerating(false);
    };

    const handleRandomize = () => {
        const newTheme = generateRandomTheme(theme);
        updateProjectTheme(newTheme);
    };
    
    const handlePaletteSelect = (colors: Theme['colors']) => {
        handleThemeChange({ colors });
    };

    return (
        <>
            <ManageFontsModal 
                isOpen={isFontModalOpen}
                onClose={() => setIsFontModalOpen(false)}
                currentFonts={theme.importedFonts || []}
                onSave={handleSaveFonts}
            />
            <div className="p-2 space-y-4 overflow-y-auto">
                <ThemePreview theme={theme} />
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={handleAiGenerate}
                        disabled={isGenerating || !geminiService.isConfigured()}
                        title={!geminiService.isConfigured() ? "Gemini API key not configured" : "Generate with AI"}
                        className="flex items-center justify-center gap-2 w-full bg-juki-dark-3 text-white text-sm font-bold p-2 rounded hover:bg-juki-dark-3/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Wand2 size={14} /> {isGenerating ? 'Generating...' : 'AI Generate'}
                    </button>
                    <button
                        onClick={handleRandomize}
                        className="flex items-center justify-center gap-2 w-full bg-juki-dark-3 text-white text-sm font-bold p-2 rounded hover:bg-juki-dark-3/80 transition-colors"
                    >
                        <RefreshCw size={14} /> Randomize
                    </button>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Search Palettes</h3>
                     <div className="space-y-2 p-2 bg-juki-dark rounded-md">
                         <div className="relative">
                            <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <input
                                type="text"
                                value={paletteSearchQuery}
                                onChange={e => setPaletteSearchQuery(e.target.value)}
                                placeholder="e.g. nature, dark blue, retro"
                                className="w-full bg-juki-dark-3 p-1.5 pl-8 rounded text-sm text-white border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green"
                            />
                        </div>
                        <PaletteSuggestions 
                            searchQuery={paletteSearchQuery} 
                            onSelectPalette={handlePaletteSelect} 
                        />
                    </div>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Colors</h3>
                    <div className="space-y-2 p-2 bg-juki-dark rounded-md">
                        <ColorInput label="Primary" value={theme.colors.primary} onChange={v => handleColorChange('primary', v)} />
                        <ColorInput label="Secondary" value={theme.colors.secondary} onChange={v => handleColorChange('secondary', v)} />
                        <ColorInput label="Accent" value={theme.colors.accent} onChange={v => handleColorChange('accent', v)} />
                        <ColorInput label="Text" value={theme.colors.text} onChange={v => handleColorChange('text', v)} />
                        <ColorInput label="Background" value={theme.colors.background} onChange={v => handleColorChange('background', v)} />
                    </div>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Fonts</h3>
                    <div className="space-y-2 p-2 bg-juki-dark rounded-md">
                        <FontFamilySelect label="Heading Font" value={theme.fonts.heading} onChange={v => handleFontChange('heading', v)} />
                        <FontFamilySelect label="Body Font" value={theme.fonts.body} onChange={v => handleFontChange('body', v)} />
                         <button onClick={() => setIsFontModalOpen(true)} className="w-full text-center text-sm p-2 mt-2 bg-juki-dark-3 rounded hover:bg-juki-dark-3/80">
                            Manage Imported Fonts
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export const ThemePanel = () => {
    const { activeProject } = useApp();
    const [activeTab, setActiveTab] = useState('Theme');

    if (!activeProject) {
        return <p className="p-4 text-xs text-center text-gray-500">No active project.</p>;
    }
    
    return (
        <div className="flex flex-col h-full">
            <div className="flex border-b border-juki-dark-3 shrink-0">
                <button 
                    onClick={() => setActiveTab('Theme')}
                    className={`flex-1 p-2 text-sm font-semibold ${activeTab === 'Theme' ? 'bg-juki-dark-3 text-white' : 'text-gray-400 hover:bg-juki-dark-3'}`}
                >
                    Theme
                </button>
                 <button 
                    onClick={() => setActiveTab('Packages')}
                    className={`flex-1 p-2 text-sm font-semibold ${activeTab === 'Packages' ? 'bg-juki-dark-3 text-white' : 'text-gray-400 hover:bg-juki-dark-3'}`}
                >
                    Packages
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'Theme' && <ThemeEditor />}
                {activeTab === 'Packages' && <PackagesPanel />}
            </div>
        </div>
    );
};