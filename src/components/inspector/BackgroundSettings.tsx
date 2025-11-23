import React, { useState, useMemo } from 'react';
import { useApp } from '../../hooks/useApp';
import { AssetItem } from '../../types';
import { Image as ImageIcon } from 'lucide-react';

interface BackgroundSettingsProps {
    styles: React.CSSProperties;
    handleStyleChange: (key: keyof React.CSSProperties, value: any) => void;
}

const ControlButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`flex-1 p-1 text-xs rounded-sm transition-colors ${active ? 'bg-juki-green text-black font-bold' : 'bg-juki-dark-3 text-gray-300 hover:bg-juki-dark-3/50'}`}
    >
        {label}
    </button>
);

export const BackgroundSettings = ({ styles, handleStyleChange }: BackgroundSettingsProps) => {
    const { activeProject } = useApp();
    const assetLibrary = activeProject?.assetLibrary || [];
    const initialMode = useMemo(() => (styles.backgroundImage && styles.backgroundImage !== 'none' ? 'image' : 'color'), [styles.backgroundImage]);
    const [mode, setMode] = useState<'color' | 'image'>(initialMode);
    const [showAssetPicker, setShowAssetPicker] = useState(false);

    const handleModeChange = (newMode: 'color' | 'image') => {
        setMode(newMode);
        setShowAssetPicker(false);
        if (newMode === 'color') {
            handleStyleChange('backgroundImage', 'none');
        } else {
            handleStyleChange('backgroundColor', 'transparent');
            if (!styles.backgroundImage || styles.backgroundImage === 'none') {
                setShowAssetPicker(true);
            }
        }
    };

    const handleAssetSelect = (asset: AssetItem) => {
        handleStyleChange('backgroundImage', `url(${asset.url})`);
        setShowAssetPicker(false);
    };
    
    const clearImage = () => {
        handleStyleChange('backgroundImage', 'none');
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-1 bg-juki-dark p-0.5 rounded-md">
                <ControlButton label="Color" active={mode === 'color'} onClick={() => handleModeChange('color')} />
                <ControlButton label="Image" active={mode === 'image'} onClick={() => handleModeChange('image')} />
            </div>
            {mode === 'color' && (
                 <div className="flex items-center gap-2">
                    <label htmlFor="bg-color-picker" className="text-sm text-gray-300">Color</label>
                    <input
                        id="bg-color-picker"
                        type="color"
                        value={styles.backgroundColor || '#000000'}
                        onChange={e => handleStyleChange('backgroundColor', e.target.value)}
                        className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-juki-dark-3"
                    />
                    <input
                        type="text"
                        value={styles.backgroundColor || ''}
                        onChange={e => handleStyleChange('backgroundColor', e.target.value)}
                        placeholder="#RRGGBB"
                        className="flex-1 bg-juki-dark-3 p-1 rounded text-sm text-white w-full"
                    />
                </div>
            )}
            {mode === 'image' && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded bg-juki-dark-3 flex items-center justify-center shrink-0" style={{ backgroundImage: styles.backgroundImage, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                            {(!styles.backgroundImage || styles.backgroundImage === 'none') && <ImageIcon size={16} className="text-gray-500" />}
                        </div>
                        <div className="flex-1 flex gap-1">
                            <button onClick={() => setShowAssetPicker(!showAssetPicker)} className="text-xs bg-juki-dark-3 w-full text-center p-2 rounded hover:bg-juki-dark-3/80">
                                {showAssetPicker ? 'Close' : 'Select'}
                            </button>
                            <button onClick={clearImage} title="Clear Image" className="text-xs bg-juki-dark-3 p-2 rounded hover:bg-juki-dark-3/80">
                                Clear
                            </button>
                        </div>
                    </div>
                     {showAssetPicker && (
                        <div className="grid grid-cols-3 gap-2 mt-2 max-h-48 overflow-y-auto p-1 bg-juki-dark rounded">
                            {assetLibrary.length > 0 ? assetLibrary.map(asset => (
                                <button key={asset.id} onClick={() => handleAssetSelect(asset)} className="aspect-square rounded overflow-hidden hover:ring-2 ring-juki-green ring-offset-2 ring-offset-juki-dark transition-all">
                                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                                </button>
                            )) : <p className="col-span-3 text-xs text-gray-500 text-center p-4">No assets in library. Generate one in the Assets panel.</p>}
                        </div>
                     )}
                     <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-juki-dark-3">
                        <div>
                            <label className="block mb-1 text-gray-400">Size</label>
                            <select value={String(styles.backgroundSize || 'cover')} onChange={e => handleStyleChange('backgroundSize', e.target.value)} className="w-full bg-juki-dark-3 p-1 rounded">
                                <option value="cover">Cover</option>
                                <option value="contain">Contain</option>
                                <option value="auto">Auto</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 text-gray-400">Repeat</label>
                            <select value={String(styles.backgroundRepeat || 'no-repeat')} onChange={e => handleStyleChange('backgroundRepeat', e.target.value)} className="w-full bg-juki-dark-3 p-1 rounded">
                                <option value="no-repeat">No Repeat</option>
                                <option value="repeat">Repeat</option>
                                <option value="repeat-x">Repeat X</option>
                                <option value="repeat-y">Repeat Y</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block mb-1 text-gray-400">Position</label>
                            <input type="text" value={String(styles.backgroundPosition || 'center')} onChange={e => handleStyleChange('backgroundPosition', e.target.value)} placeholder="e.g. center, top right" className="w-full bg-juki-dark-3 p-1 rounded"/>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};