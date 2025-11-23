// FIX: Add missing React import.
import React from 'react';
import { AnyCanvasItem, ElementCanvasItem, IconCanvasItem } from '../types';
import { getIconNames } from './iconUtils';
import * as Acorn from 'acorn';
import acornJsx from 'acorn-jsx';

// --- Helper Functions ---

const toCamelCase = (str: string) => str.replace(/-(\w)/g, (_, c) => c.toUpperCase());

const parseStyleString = (styleStr: string): React.CSSProperties => {
    const style: { [key: string]: string } = {};
    styleStr.split(';').forEach(declaration => {
        const [property, value] = declaration.split(':');
        if (property && value) {
            style[toCamelCase(property.trim())] = value.trim();
        }
    });
    return style as React.CSSProperties;
};

const mapHtmlAttributesToProps = (attributes: NamedNodeMap): Record<string, any> => {
    const props: Record<string, any> = {};
    for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        switch (attr.name) {
            case 'class':
                props['className'] = attr.value;
                break;
            case 'style':
                props['style'] = parseStyleString(attr.value);
                break;
            case 'for':
                 props['htmlFor'] = attr.value;
                 break;
            // Add other HTML to React attribute mappings if needed
            default:
                props[attr.name] = attr.value;
        }
    }
    return props;
};


// --- HTML Parser (using DOMParser) ---

const domNodeToCanvasItem = (node: Element): ElementCanvasItem | null => {
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    
    const children: (AnyCanvasItem | string)[] = [];
    node.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
            children.push(child.textContent.trim());
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            const canvasItem = domNodeToCanvasItem(child as Element);
            if(canvasItem) children.push(canvasItem);
        }
    });

    let content: string | AnyCanvasItem[] | undefined;
    if (children.length === 1 && typeof children[0] === 'string') {
        content = children[0];
    } else if (children.length > 0) {
        content = children.filter((c): c is AnyCanvasItem => typeof c !== 'string');
    }
    
    return {
        id: crypto.randomUUID(),
        name: node.tagName.toLowerCase(),
        type: 'ELEMENT',
        tag: node.tagName.toLowerCase(),
        props: mapHtmlAttributesToProps(node.attributes),
        content,
    };
};

const parseHtmlToCanvasItem = (html: string): AnyCanvasItem => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html.trim(), 'text/html');
    const rootElement = doc.body.firstChild;

    if (!rootElement || !(rootElement instanceof Element)) {
        throw new Error('No valid root element found in HTML.');
    }
    const result = domNodeToCanvasItem(rootElement);
     if (!result) {
        throw new Error('Failed to parse HTML into a valid structure.');
    }
    return result;
}

// --- JSX Parser (using Acorn) ---

const JsxParser = (Acorn as any).Parser.extend(acornJsx());

const astNodeToValue = (node: any): any => {
    if (!node) return undefined;
    if (node.type === 'Literal') return node.value;
    if (node.type === 'JSXExpressionContainer') {
        const expr = node.expression;
        if (expr.type === 'ObjectExpression') {
            const obj: Record<string, any> = {};
            for (const prop of expr.properties) {
                if (prop.type === 'Property') {
                    const key = (prop.key as any).name || (prop.key as any).value;
                    const value = astNodeToValue(prop.value);
                    if (value !== undefined) obj[key] = value;
                }
            }
            return obj;
        }
         if (expr.type === 'Literal') return expr.value;
         return '{expression}';
    }
    return undefined;
};

const astNodeToCanvasItem = (node: any): AnyCanvasItem | string | null => {
    if (node.type === 'JSXText') {
        const text = node.value.trim();
        return text.length > 0 ? text : null;
    }
    
    if (node.type === 'JSXElement' || node.type === 'JSXFragment') {
        const openingElement = node.openingElement;
        const children = node.children;
        const tagName = openingElement?.name.name || 'fragment';

        if(tagName === 'fragment') {
            // This is a fragment, its children are the real items
            const childItems = children
                .map((child: any) => astNodeToCanvasItem(child))
                .filter((c: any): c is AnyCanvasItem => c !== null && typeof c !== 'string');
            return childItems.length > 0 ? childItems[0] : null; // Hack: returning first item for now
        }

        const props: Record<string, any> = {};
        for (const attr of openingElement.attributes) {
            if (attr.type === 'JSXAttribute') {
                const name = attr.name.name;
                const value = astNodeToValue(attr.value);
                if (value !== undefined) {
                    props[name] = value;
                } else if (attr.value === null) { // Boolean prop
                    props[name] = true;
                }
            }
        }

        const childItems = children
            .map((child: any) => astNodeToCanvasItem(child))
            .filter((c: any): c is AnyCanvasItem | string => c !== null);

        if (/^[A-Z]/.test(tagName)) { // Is a component (like an Icon)
            if (getIconNames().includes(tagName)) {
                 const iconElement: IconCanvasItem = {
                    id: crypto.randomUUID(), name: tagName, type: 'ICON', iconName: tagName, props,
                };
                return iconElement;
            }
             // It's another component, render as a placeholder
            return {
                id: crypto.randomUUID(), name: tagName, type: 'ELEMENT', tag: 'div',
                props: { ...props, className: `${props.className || ''} p-2 border-dashed border-purple-500 text-purple-300 text-xs`.trim() },
                content: `Component<${tagName}>`,
            };
        }

        let content: string | AnyCanvasItem[] | undefined;
        if (childItems.length === 1 && typeof childItems[0] === 'string') {
            content = childItems[0];
        } else if (childItems.length > 0) {
            content = childItems.filter((c): c is AnyCanvasItem => typeof c !== 'string');
        }

        return {
            id: crypto.randomUUID(), name: tagName, type: 'ELEMENT', tag: tagName, props, content
        };
    }
    return null;
}

export const parseJsxToCanvasItem = (jsx: string): AnyCanvasItem => {
    try {
        const ast = JsxParser.parse(jsx.trim(), { ecmaVersion: 'latest', sourceType: 'module' });
        const jsxRoot = (ast as any).body.find((node: any) => node.type === 'ExpressionStatement' && (node.expression.type === 'JSXElement' || node.expression.type === 'JSXFragment'));
        
        if (!jsxRoot) {
             throw new Error('Could not find a root JSX element.');
        }

        const result = astNodeToCanvasItem(jsxRoot.expression);
        if (result && typeof result !== 'string') {
            return result;
        }
        throw new Error('Failed to parse JSX into a valid structure.');
    } catch (error) {
        console.error("Acorn parsing error:", (error as Error).message);
        throw new Error(`JSX Parsing failed: ${(error as Error).message}`);
    }
};

export const parseComponentFileToCanvasItems = (code: string): AnyCanvasItem[] => {
    let returnStatementNode: any = null;

    try {
        const ast = JsxParser.parse(code.trim(), { ecmaVersion: 'latest', sourceType: 'module' });

        // Simple walk function to find the first return statement in a function body
        const findReturn = (node: any) => {
            if (returnStatementNode) return;
            if (node.type === 'ReturnStatement') {
                returnStatementNode = node;
                return;
            }
            for (const key in node) {
                if (node[key] && typeof node[key] === 'object') {
                    if (Array.isArray(node[key])) {
                        node[key].forEach(findReturn);
                    } else {
                        findReturn(node[key]);
                    }
                }
            }
        };

        findReturn(ast);

        if (!returnStatementNode || !returnStatementNode.argument) {
            throw new Error("Could not find a return statement with JSX.");
        }
        
        const rootJsxNode = returnStatementNode.argument;
        if (rootJsxNode.type !== 'JSXElement' && rootJsxNode.type !== 'JSXFragment') {
            throw new Error("The return statement does not contain a valid JSX element or fragment.");
        }

        // The top level is usually a fragment like <>...</>
        if (rootJsxNode.type === 'JSXFragment') {
             return rootJsxNode.children
                .map((child: any) => astNodeToCanvasItem(child))
                .filter((item: any): item is AnyCanvasItem => !!item && typeof item !== 'string');
        } else {
            const singleItem = astNodeToCanvasItem(rootJsxNode);
            if (singleItem && typeof singleItem !== 'string') {
                return [singleItem];
            }
        }
        
        throw new Error("Failed to parse component file into a valid structure.");

    } catch(error) {
        console.error("Acorn parsing error:", (error as Error).message);
        throw new Error(`Code Parsing failed: ${(error as Error).message}`);
    }
}

// --- Main Export ---

export const parseCodeToCanvasItem = (code: string, type: 'jsx' | 'html'): AnyCanvasItem => {
    if (type === 'html') {
        return parseHtmlToCanvasItem(code);
    }
    return parseJsxToCanvasItem(code);
};