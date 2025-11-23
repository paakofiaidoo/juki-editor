import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { MainViewToolbar } from './MainViewToolbar';
import { Canvas } from './Canvas';
import { EditableCodeView } from './CodeView';

export const MainView = () => {
    const { activeView } = useApp();
    const [canvasSize, setCanvasSize] = useState('w-full');
    
    return (
        <div className="flex-1 flex flex-col bg-juki-dark overflow-hidden p-4">
            <MainViewToolbar canvasSize={canvasSize} setCanvasSize={setCanvasSize} />
            <div className="flex-1 overflow-auto mt-4">
                 {activeView === 'canvas' ? <Canvas canvasSize={canvasSize} /> : <EditableCodeView />}
            </div>
        </div>
    );
};