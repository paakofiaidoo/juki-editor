import React from 'react';
import { EditableCodeView } from '../layout/CodeView';

export const CodePanel = () => {
    return (
        <div className="h-full overflow-hidden">
            <EditableCodeView />
        </div>
    );
};