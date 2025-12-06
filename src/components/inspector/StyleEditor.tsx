import React from "react";
import { AnyCanvasItem, ElementCanvasItem, Page } from "../../types";
import { StylePropertyGroup } from "./StylePropertyGroup";
import { LayoutSettings } from "./LayoutSettings";
import { TypographySettings } from "./TypographySettings";
import { BackgroundSettings } from "./BackgroundSettings";
import { useApp } from "../../hooks/useApp";
import { getElementStyles } from "../../utils/styleUtils";
import { BlockLayoutControls } from "./BlockLayoutControls";
import { AutocompleteInput } from "../ui/AutocompleteInput";
import { tailwindClasses } from "../../utils/tailwindUtils";
import { EffectsSettings } from "./EffectsSettings";

interface StyleEditorProps {
    item: AnyCanvasItem | Page;
    onPageUpdate?: (updates: Partial<Omit<Page, "id" | "children">>) => void;
}

export const StyleEditor = ({ item, onPageUpdate }: StyleEditorProps) => {
    const { updateItem } = useApp();

    const isPage = "route" in item;

    if (!isPage && (item.type === "COMPONENT" || item.type === "MODULE_INSTANCE")) {
        return <div className="p-4 text-center text-gray-500 text-sm">Styling for {item.type.toLowerCase()}s is not available yet.</div>;
    }

    const currentStyles = getElementStyles(item.props);

    const handleStyleChange = (key: keyof React.CSSProperties, value: any) => {
        const newStyle = { ...currentStyles };

        // When opacity is 1 (100%), remove the property to keep the style object clean.
        if (key === "opacity" && Number(value) === 1) {
            delete newStyle.opacity;
        } else {
            newStyle[key] = value;
        }

        if (isPage) {
            const pageItem = item as Page;
            const newProps = { ...pageItem.props, style: newStyle };
            if (onPageUpdate) {
                onPageUpdate({ props: newProps });
            }
        } else {
            const newProps = { ...item.props, style: newStyle };
            // FIX: The `AnyCanvasItem` union combined with the large `React.CSSProperties` type
            // can cause a "type is too complex" error. By creating a partial object and assigning
            // the complex 'props' property separately, we avoid forcing TypeScript to evaluate
            // the entire complex type at once.
            const updates: Partial<AnyCanvasItem> = {};
            updates.props = newProps;
            updateItem(item.id, updates);
        }
    };

    const handleClassNameChange = (value: string) => {
        if (isPage) {
            const pageItem = item as Page;
            const newProps = { ...pageItem.props, className: value };
            if (onPageUpdate) {
                onPageUpdate({ props: newProps });
            }
        } else {
            const newProps = { ...item.props, className: value };
            // FIX: The `AnyCanvasItem` union can cause a "type is too complex" error. By creating a partial object and assigning
            // the complex 'props' property separately, we avoid forcing TypeScript to evaluate
            // the entire complex type at once.
            const updates: Partial<AnyCanvasItem> = {};
            updates.props = newProps;
            updateItem(item.id, updates);
        }
    };

    const isTextElement = !isPage && item.type === "ELEMENT" && ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "a", "button"].includes((item as ElementCanvasItem).tag);
    const isIconElement = !isPage && item.type === "ICON";

    return (
        <div>
            <div className="p-2 space-y-1 border-b border-juki-dark-3">
                <label className="text-xs text-gray-400 block mb-1">Classes</label>
                <AutocompleteInput value={item.props.className || ""} onChange={handleClassNameChange} suggestions={tailwindClasses} placeholder="e.g. text-red-500 font-bold" />
            </div>
            {/* FIX: Added children to StylePropertyGroup to resolve missing children prop error. */}
            <StylePropertyGroup title="Layout" defaultOpen>
                <LayoutSettings styles={currentStyles} handleStyleChange={handleStyleChange} />
            </StylePropertyGroup>
            {(isTextElement || isIconElement) && (
                // FIX: Added children to StylePropertyGroup to resolve missing children prop error.
                <StylePropertyGroup title="Typography">
                    <TypographySettings styles={currentStyles} handleStyleChange={handleStyleChange} />
                </StylePropertyGroup>
            )}
            {/* FIX: Added children to StylePropertyGroup to resolve missing children prop error. */}
            <StylePropertyGroup title="Sizing & Spacing">
                <BlockLayoutControls styles={currentStyles} handleStyleChange={handleStyleChange} />
            </StylePropertyGroup>
            {/* FIX: Added children to StylePropertyGroup to resolve missing children prop error. */}
            <StylePropertyGroup title="Background">
                <BackgroundSettings styles={currentStyles} handleStyleChange={handleStyleChange} />
            </StylePropertyGroup>
            {/* FIX: Added children to StylePropertyGroup to resolve missing children prop error. */}
            <StylePropertyGroup title="Borders">
                <div className="p-2 text-center text-gray-500 text-xs">Border controls placeholder</div>
            </StylePropertyGroup>
            {/* FIX: Added children to StylePropertyGroup to resolve missing children prop error. */}
            <StylePropertyGroup title="Effects">
                <EffectsSettings styles={currentStyles} handleStyleChange={handleStyleChange} item={item} onUpdate={!isPage ? (updates) => updateItem(item.id, updates) : undefined} />
            </StylePropertyGroup>
        </div>
    );
};
