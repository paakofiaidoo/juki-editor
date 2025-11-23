import React from 'react';
import { AnyCanvasItem, ComponentCanvasItem, IconCanvasItem } from '../../types';
import { useApp } from '../../hooks/useApp';
import { SelectionWrapper } from '../ui/SelectionWrapper';
import { getIconMap } from '../../utils/iconUtils';
import { AlertTriangle } from 'lucide-react';

interface CanvasItemRendererProps {
  item: AnyCanvasItem;
}

// FIX: Changed component to React.FC to resolve issues with 'key' and 'children' props.
export const CanvasItemRenderer: React.FC<CanvasItemRendererProps> = ({ item }) => {
  const { activeProject, selectedItemIds, setSelectedItemId, addSelectedItem, highlightedParentId } = useApp();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.shiftKey) {
        addSelectedItem(item.id);
    } else {
        setSelectedItemId(item.id);
    }
  };
  
  const isSelected = selectedItemIds.includes(item.id);
  const isHighlightedParent = item.id === highlightedParentId && !isSelected;

  const renderContent = () => {
    if (item.type === 'ELEMENT' && typeof item.content === 'string') {
      return <div className="pointer-events-none">{item.content}</div>;
    }
    if (item.type === 'ELEMENT' && Array.isArray(item.content)) {
      return item.content.filter(c => c).map(child => <CanvasItemRenderer key={child.id} item={child} />);
    }
    return null;
  };
  
  const renderItem = () => {
    const { style, ...restProps } = item.props;
    const props = { ...restProps, id: item.id };

    if (item.type === 'ELEMENT') {
      const Tag = item.tag as React.ElementType;
      return <Tag {...props}>{renderContent()}</Tag>;
    }

    if (item.type === 'ICON') {
        const icon = item as IconCanvasItem;
        const IconComponent = getIconMap()[icon.iconName];
        if (IconComponent) {
            return <IconComponent {...props} />;
        }
        return <div {...props} className="text-red-500 flex items-center gap-1"><AlertTriangle size={16} /> Unknown Icon</div>;
    }

    if (item.type === 'COMPONENT') {
       const componentDef = activeProject?.userComponents.find(c => c.id === (item as ComponentCanvasItem).componentType);
        if (!componentDef) {
            return (
                <div {...props} className={`p-2 border border-dashed border-red-500 text-red-500 text-sm flex items-center gap-1 ${item.props.className || ''}`}>
                    <AlertTriangle size={16} /> Component: {item.name} (Not Found)
                </div>
            );
        }
        
        if (!componentDef.root) {
            return (
                <div {...props} className={`p-2 border border-dashed border-yellow-500 text-yellow-500 text-sm flex items-center gap-1 ${item.props.className || ''}`}>
                    <AlertTriangle size={16} /> Component: {item.name} (has no root element)
                </div>
            );
        }

        const root = componentDef.root;
        const mergedProps = { ...root.props, ...props };
        
        if (root.type === 'ELEMENT') {
            const Tag = root.tag as React.ElementType;
            const content = root.content;

            const renderRootContent = () => {
                if (typeof content === 'string') {
                    return <div className="pointer-events-none">{content}</div>;
                }
                if (Array.isArray(content)) {
                    return content.filter(c => c).map(child => <CanvasItemRenderer key={child.id} item={child} />);
                }
                return null;
            };

            return <Tag {...mergedProps}>{renderRootContent()}</Tag>;
        }
        
        return (
            <div {...props} className={`p-2 border border-dashed border-yellow-500 text-yellow-500 text-sm ${item.props.className || ''}`}>
                Invalid Component Root for: {item.name}
            </div>
        );
    }
    return (
       <div {...props} className={`p-4 border border-dashed border-cyan-500 ${item.props.className || ''}`}>
          Module: {item.name}
       </div>
    );
  };

  return (
    <SelectionWrapper item={item} isSelected={isSelected} isHighlightedParent={isHighlightedParent} onClick={handleClick}>
      {renderItem()}
    </SelectionWrapper>
  );
};