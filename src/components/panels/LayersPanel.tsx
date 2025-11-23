import React from 'react';
import { useApp } from '../../hooks/useApp';
import { LayerTreeItem } from './LayerTreeItem';

export const LayersPanel = () => {
  const { activePage } = useApp();

  return (
    <div className="p-2 space-y-1 overflow-y-auto">
      {activePage && activePage.children.length > 0 ? (
        activePage.children.map(item => (
          <LayerTreeItem key={item.id} item={item} level={0} />
        ))
      ) : (
        <p className="p-4 text-xs text-center text-gray-500">
          This page is empty. Drag elements from the Components panel to the canvas to start.
        </p>
      )}
    </div>
  );
};
