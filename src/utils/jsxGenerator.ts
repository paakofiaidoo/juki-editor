import { AnyCanvasItem, Project, ElementCanvasItem, IconCanvasItem, Page, UserComponent } from '../types';

const getUsedComponentsAndIcons = (tree: AnyCanvasItem[], project: Project): { components: Set<string>, icons: Set<string> } => {
    const components = new Set<string>();
    const icons = new Set<string>();

    const traverse = (items: AnyCanvasItem[]) => {
        for (const item of items) {
            if (item.type === 'COMPONENT') {
                const component = project.userComponents.find(c => c.id === item.componentType);
                if (component) {
                    components.add(component.name.replace(/[^a-zA-Z0-9]/g, ''));
                }
            } else if (item.type === 'ICON') {
                icons.add(item.iconName.charAt(0).toUpperCase() + item.iconName.slice(1));
            }

            if (item.type === 'ELEMENT' && Array.isArray(item.content)) {
                traverse(item.content);
            }
        }
    };
    traverse(tree);
    return { components, icons };
};


const generateJSX = (item: AnyCanvasItem, project: Project, indentLevel = 0): string => {
  const indent = '  '.repeat(indentLevel);
  
  const propsToString = (props: Record<string, any>): string => {
    return Object.entries(props)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`;
        }
        if (key === 'style' && typeof value === 'object' && value !== null && Object.keys(value).length === 0) {
            return ''; // Don't render empty style objects
        }
        return `${key}={${JSON.stringify(value)}}`;
      })
      .filter(Boolean)
      .join(' ');
  };
  
  const propsString = propsToString(item.props);

  if (item.type === 'COMPONENT') {
      const spec = project.userComponents.find(c => c.id === item.componentType);
      const componentName = spec ? spec.name.replace(/[^a-zA-Z0-9]/g, '') : 'UnknownComponent';
      return `${indent}<${componentName} ${propsString} />`;
  }
  
  if (item.type === 'MODULE_INSTANCE') {
      return `${indent}<ModuleInstance moduleId="${item.moduleId}" ${propsString} />`;
  }

  if (item.type === 'ICON') {
    const icon = item as IconCanvasItem;
    const componentName = icon.iconName.charAt(0).toUpperCase() + icon.iconName.slice(1);
    return `${indent}<${componentName} ${propsString} />`;
  }

  const { tag } = item as ElementCanvasItem;
  if (Array.isArray(item.content) && item.content.length > 0) {
    const childrenJSX = item.content.map(child => generateJSX(child, project, indentLevel + 1)).join('\n');
    return `${indent}<${String(tag)} ${propsString}>\n${childrenJSX}\n${indent}</${String(tag)}>`;
  } else if (typeof item.content === 'string' && item.content) {
    return `${indent}<${String(tag)} ${propsString}>${item.content}</${String(tag)}>`;
  } else {
    return `${indent}<${String(tag)} ${propsString} />`;
  }
};


export const generatePageComponent = (page: Page, project: Project): string => {
    const { components, icons } = getUsedComponentsAndIcons(page.children, project);
    
    let imports = `import React from 'react';\n`;
    if (icons.size > 0) {
        imports += `import { ${[...icons].join(', ')} } from 'lucide-react';\n`;
    }
    if (components.size > 0) {
        components.forEach(compName => {
            imports += `import ${compName} from '@/components/${compName}';\n`;
        });
    }

    const pageContent = page.children.map(item => generateJSX(item, project, 2)).join('\n');
    const componentName = page.name.replace(/[^a-zA-Z0-9]/g, '') || 'Page';

    return `${imports}\nexport default function ${componentName}() {\n  return (\n    <>\n${pageContent}\n    </>\n  );\n}\n`;
};

export const generateUserComponentFile = (component: UserComponent, project: Project): string => {
    const { components, icons } = getUsedComponentsAndIcons([component.root], project);
    
    let imports = `import React from 'react';\n`;
     if (icons.size > 0) {
        imports += `import { ${[...icons].join(', ')} } from 'lucide-react';\n`;
    }
    if (components.size > 0) {
        components.forEach(compName => {
            imports += `import ${compName} from '@/components/${compName}';\n`;
        });
    }

    const componentContent = generateJSX(component.root, project, 2);
    const componentName = component.name.replace(/[^a-zA-Z0-9]/g, '');

    return `${imports}\nconst ${componentName} = (props) => {\n  return (\n${componentContent}\n  );\n};\n\nexport default ${componentName};\n`;
};