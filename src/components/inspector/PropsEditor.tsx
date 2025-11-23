import React, { useState } from 'react';
import { AnyCanvasItem, ElementCanvasItem, AssetItem, Page } from '../../types';
import { useApp } from '../../hooks/useApp';
import { Trash2, Plus } from 'lucide-react';

interface PropsEditorProps {
    item: AnyCanvasItem | Page;
    onPageUpdate?: (updates: Partial<Omit<Page, 'id' | 'children'>>) => void;
}

export const PropsEditor = ({ item, onPageUpdate }: PropsEditorProps) => {
    const { activeProject, updateItem } = useApp();
    const [newPropKey, setNewPropKey] = useState('');
    const [newPropValue, setNewPropValue] = useState('');
    const [showSrcPicker, setShowSrcPicker] = useState(false);

    const isPage = 'route' in item;

    if (!isPage && item.type !== 'ELEMENT' && item.type !== 'ICON') {
        return <div className="p-4 text-gray-500 text-center text-sm">Props can only be edited for standard elements and icons.</div>;
    }

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateItem(item.id, { content: e.target.value });
    };

    const handlePropChange = (key: string, value: string) => {
        const newProps = { ...item.props, [key]: value };
        if (isPage && onPageUpdate) {
            onPageUpdate({ props: newProps });
        } else if (!isPage) {
            updateItem(item.id, { props: newProps });
        }
    };
    
    const handlePageDetailChange = (key: 'name' | 'description' | 'route', value: string) => {
        if (isPage && onPageUpdate) {
            onPageUpdate({ [key]: value });
        }
    }

    const handleRemoveProp = (key: string) => {
        const newProps = { ...item.props };
        delete newProps[key];
        if (isPage && onPageUpdate) {
            onPageUpdate({ props: newProps });
        } else if (!isPage) {
            updateItem(item.id, { props: newProps });
        }
    };

    const handleAddProp = () => {
        if (newPropKey.trim()) {
            handlePropChange(newPropKey.trim(), newPropValue);
            setNewPropKey('');
            setNewPropValue('');
        }
    };
    
    const handleSrcSelect = (asset: AssetItem) => {
        handlePropChange('src', asset.url);
        setShowSrcPicker(false);
    }

    const isImageElement = !isPage && item.type === 'ELEMENT' && (item as ElementCanvasItem).tag === 'img';
    const speciallyHandledProps = ['className', 'style'];
    if (isImageElement) {
        speciallyHandledProps.push('src');
    }

    const editableProps = Object.entries(item.props).filter(
        ([key]) => !speciallyHandledProps.includes(key)
    );

    return (
        <div className="p-3 space-y-4">
            {isPage && (
                <div>
                     <h3 className="text-xs text-gray-400 font-semibold mb-2">Page Details</h3>
                     <div className="space-y-2">
                         <div>
                            <label className="text-xs text-gray-400 block mb-1">Name</label>
                            <input type="text" value={item.name} onChange={e => handlePageDetailChange('name', e.target.value)} className="w-full bg-juki-dark p-1 rounded text-sm text-white border border-juki-dark-3" />
                         </div>
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Description</label>
                            <input type="text" value={item.description} onChange={e => handlePageDetailChange('description', e.target.value)} className="w-full bg-juki-dark p-1 rounded text-sm text-white border border-juki-dark-3" />
                         </div>
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Route</label>
                            <input type="text" value={item.route} onChange={e => handlePageDetailChange('route', e.target.value)} className="w-full bg-juki-dark p-1 rounded text-sm text-white border border-juki-dark-3" />
                         </div>
                     </div>
                </div>
            )}
            {!isPage && item.type === 'ELEMENT' && typeof (item as ElementCanvasItem).content === 'string' && (
                <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Content</label>
                    <textarea 
                        value={(item as ElementCanvasItem).content as string}
                        onChange={handleContentChange}
                        rows={3}
                        className="w-full bg-juki-dark p-2 rounded border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green text-white text-sm"
                    />
                </div>
            )}
            
            {isImageElement && activeProject && (
                <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-semibold block">Image Source (src)</label>
                    <div className="flex items-center gap-2">
                        <img src={item.props.src || ''} alt="current" className="w-10 h-10 rounded bg-juki-dark-3 object-cover" />
                        <div className="flex-1 flex gap-1">
                            <button onClick={() => setShowSrcPicker(!showSrcPicker)} className="text-xs bg-juki-dark-3 w-full text-center p-2 rounded hover:bg-juki-dark-3/80">
                                {showSrcPicker ? 'Close' : 'Select from Library'}
                            </button>
                        </div>
                    </div>
                    {showSrcPicker && (
                        <div className="grid grid-cols-4 gap-2 mt-2 max-h-48 overflow-y-auto p-1 bg-juki-dark rounded">
                            {activeProject.assetLibrary.length > 0 ? activeProject.assetLibrary.map(asset => (
                                <button key={asset.id} onClick={() => handleSrcSelect(asset)} className="aspect-square rounded overflow-hidden hover:ring-2 ring-juki-green ring-offset-2 ring-offset-juki-dark transition-all">
                                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                                </button>
                            )) : <p className="col-span-4 text-xs text-gray-500 text-center p-4">No assets in library.</p>}
                        </div>
                    )}
                </div>
            )}
            
            <div>
                <h3 className="text-xs text-gray-400 font-semibold mb-2">Custom HTML Attributes</h3>
                <div className="space-y-2">
                    {editableProps.map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                           <input
                                type="text"
                                value={key}
                                readOnly
                                className="w-1/3 bg-juki-dark p-1 rounded text-xs text-gray-400 border border-juki-dark-3"
                            />
                            <input 
                                type="text"
                                value={String(value)}
                                onChange={(e) => handlePropChange(key, e.target.value)}
                                className="flex-1 bg-juki-dark p-1 rounded text-sm text-white border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green"
                            />
                            <button onClick={() => handleRemoveProp(key)} className="text-gray-500 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                    ))}
                     {editableProps.length === 0 && !isImageElement && (
                        <p className="text-xs text-gray-500 text-center p-2">No other attributes.</p>
                    )}
                    <div className="flex items-center gap-2 pt-2 border-t border-juki-dark-3">
                        <input
                            type="text"
                            placeholder="key"
                            value={newPropKey}
                            onChange={e => setNewPropKey(e.target.value)}
                            className="w-1/3 bg-juki-dark p-1 rounded text-sm text-white border border-juki-dark-3"
                        />
                        <input
                            type="text"
                            placeholder="value"
                            value={newPropValue}
                            onChange={e => setNewPropValue(e.target.value)}
                            className="flex-1 bg-juki-dark p-1 rounded text-sm text-white border border-juki-dark-3"
                        />
                        <button onClick={handleAddProp} className="text-gray-400 hover:text-juki-green p-1"><Plus size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};