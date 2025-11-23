import React from 'react';
import { AnyCanvasItem, ComponentCanvasItem, ElementCanvasItem, IconCanvasItem, UserComponent } from '../../types';
// FIX: Changed import from `iconMap` to the exported function `getIconMap`.
import { getIconMap } from '../../utils/iconUtils';
import { AlertTriangle } from 'lucide-react';

interface PreviewRendererProps {
  item: AnyCanvasItem;
  userComponents: UserComponent[];
}

// FIX: Changed component to React.FC to resolve issues with the 'key' prop in maps.
export const PreviewRenderer: React.FC<PreviewRendererProps> = ({ item, userComponents }) => {
  // FIX: The original destructuring caused a TypeScript type inference issue.
  // Using item.props directly preserves the `Record<string, any>` type and
  // ensures properties like `className` are accessible.
  const props = item.props;

  if (item.type === 'ELEMENT') {
    const element = item as ElementCanvasItem;
    const Tag = element.tag as React.ElementType;

    const renderContent = () => {
      if (typeof element.content === 'string') {
        return element.content;
      }
      if (Array.isArray(element.content)) {
        return element.content.filter(c => c).map(child => <PreviewRenderer key={child.id} item={child} userComponents={userComponents} />);
      }
      return null;
    };
    return <Tag {...props}>{renderContent()}</Tag>;
  }

  if (item.type === 'ICON') {
    // FIX: Called `getIconMap()` to retrieve the map of icon components.
    const iconMap = getIconMap();
    const icon = item as IconCanvasItem;
    const IconComponent = iconMap[icon.iconName];
    if (IconComponent) {
      return <IconComponent {...props} />;
    }
    return <div {...props} title="Unknown Icon" className="w-4 h-4 bg-red-500" />;
  }

  if (item.type === 'COMPONENT') {
    const componentInstance = item as ComponentCanvasItem;
    const componentDef = userComponents.find(c => c.id === componentInstance.componentType);

    if (!componentDef || !componentDef.root) {
      return (
        <div {...props} className="p-1 border border-dashed border-red-500 text-red-500 text-[8px] flex items-center gap-1">
          <AlertTriangle size={10} /> Comp?
        </div>
      );
    }

    const root = componentDef.root;
    // Merging instance props with definition's root props
    const mergedProps = {
      ...root.props,
      ...props,
      className: `${root.props.className || ''} ${props.className || ''}`.trim(),
      style: { ...root.props.style, ...props.style }
    };

    // Render the component's root element, passing down the merged props
    return <PreviewRenderer item={{ ...root, props: mergedProps }} userComponents={userComponents} />;
  }

  // Fallback for other types like MODULE_INSTANCE
  return (
    <div {...props} className="p-1 border border-dashed border-cyan-500 text-cyan-500 text-[8px]">
      {item.name}
    </div>
  );
};