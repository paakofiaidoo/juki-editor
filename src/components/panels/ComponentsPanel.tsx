import React, { useMemo, FC } from 'react';
import { useApp } from '../../hooks/useApp';
import { DraggableComponentPreview } from '../ui/DraggableComponentPreview';
import { DraggableElementPreview } from '../ui/DraggableElementPreview';
import { Plus } from 'lucide-react';
import { componentLibraries } from '../../data/componentLibraries';
import { ChevronDown } from 'lucide-react';

export const ComponentsPanel = () => {
    const { activeProject, openModal } = useApp();
    const userComponents = activeProject?.userComponents || [];

    const userComponentLibrary = useMemo(() => {
        if (userComponents.length === 0) return null;
        return {
            name: 'User Components',
            components: userComponents,
        };
    }, [userComponents]);

    return (
        <div className="p-2 space-y-1 overflow-y-auto">
            {componentLibraries.map(lib => (
                <details key={lib.name} open className="group">
                    <summary className="flex items-center justify-between p-1.5 list-none cursor-pointer hover:bg-juki-dark-3 rounded">
                        <h3 className="text-xs font-bold text-gray-400 uppercase">{lib.name}</h3>
                        <ChevronDown size={14} className="text-gray-400 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="pt-2 space-y-3">
                        {lib.categories.map(cat => (
                            <div key={cat.name} className="pl-2">
                                <h4 className="text-xs font-semibold text-gray-300 mb-2">{cat.name}</h4>
                                <div className="space-y-2">
                                    {cat.items.map(el => <DraggableElementPreview key={el.id} elementSpec={el} />)}
                                </div>
                            </div>
                        ))}
                    </div>
                </details>
            ))}
            
            {userComponentLibrary && (
                 <details open className="group">
                    <summary className="flex items-center justify-between p-1.5 list-none cursor-pointer hover:bg-juki-dark-3 rounded">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-gray-400 uppercase">User Components</h3>
                            <button 
                                title="Add Component from Code"
                                onClick={(e) => { e.preventDefault(); openModal({ type: 'ADD_COMPONENT_FROM_CODE' }); }}
                                className="text-gray-400 hover:text-juki-green"
                            >
                                <Plus size={16}/>
                            </button>
                        </div>
                        <ChevronDown size={14} className="text-gray-400 transition-transform group-open:rotate-180" />
                    </summary>
                     <div className="pt-2 pl-2 space-y-2">
                        {userComponentLibrary.components.map(c => (
                            <DraggableComponentPreview 
                                key={c.id} 
                                component={c} 
                                allUserComponents={userComponents} 
                            />
                        ))}
                    </div>
                </details>
            )}
            
            {userComponents.length === 0 && (
                <div className="p-2 text-center">
                    <button 
                        onClick={() => openModal({ type: 'ADD_COMPONENT_FROM_CODE' })}
                        className="w-full text-sm p-2 text-gray-400 border-2 border-dashed border-juki-dark-3 rounded hover:bg-juki-dark-3 hover:text-juki-green hover:border-juki-green/50 transition-colors"
                    >
                        + Add Component from Code
                    </button>
                </div>
            )}
        </div>
    );
};