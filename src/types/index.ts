import React from 'react';

// Core Canvas Item Types
// ----------------------

export interface AnimationProps {
    initial?: any;
    animate?: any;
    whileHover?: any;
    whileTap?: any;
    transition?: any;
}

export interface BaseCanvasItem {
    id: string;
    name: string;
    props: Record<string, any> & { className?: string; style?: React.CSSProperties };
    locked?: boolean;
    animation?: AnimationProps;
}

export interface ElementCanvasItem extends BaseCanvasItem {
    type: 'ELEMENT';
    // FIX: Changed type to string to resolve the "Can not find namespace 'JSX'" error.
    tag: string;
    content?: string | AnyCanvasItem[];
}

export interface ComponentCanvasItem extends BaseCanvasItem {
    type: 'COMPONENT';
    componentType: string; // The ID of the UserComponent
}

export interface ModuleInstanceCanvasItem extends BaseCanvasItem {
    type: 'MODULE_INSTANCE';
    moduleId: string;
}

export interface IconCanvasItem extends BaseCanvasItem {
    type: 'ICON';
    iconName: string;
}

export type AnyCanvasItem = ElementCanvasItem | ComponentCanvasItem | ModuleInstanceCanvasItem | IconCanvasItem;

// Project Structure Types
// -----------------------

export interface ImportedFont {
    id: string;
    fontFamily: string;
    url: string;
}

export interface Theme {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        text: string;
        background: string;
    };
    fonts: {
        body: string;
        heading: string;
    };
    borderRadius?: string;
    spacing?: string;
    importedFonts: ImportedFont[];
}

export interface Layout {
    id: string;
    name: string;
    root: AnyCanvasItem; // The visual tree of the layout
    path: string; // File path (e.g. app/layout.tsx)
    route: string;
}

export interface Page {
    id: string;
    name: string;
    description: string;
    route: string;
    path?: string; // e.g. app/page.tsx
    props: Record<string, any>;
    children: AnyCanvasItem[]; // The computed tree (Layout + Page or just Page)
    content?: AnyCanvasItem[]; // The specific page content (isolated)
    layoutId?: string; // ID of the parent layout
    customCss?: string;
}

export interface RouteNode {
    id: string;
    name: string;
    segment: string;
    fullPath: string;
    type: 'STATIC' | 'DYNAMIC' | 'CATCH_ALL' | 'GROUP';
    pageId?: string;
    layoutId?: string;
    children: RouteNode[];
}

export interface UserComponent {
    id: string;
    name: string;
    description: string;
    root: AnyCanvasItem;
}

export interface AssetItem {
    id: string;
    name: string;
    type: 'IMAGE' | 'VIDEO' | 'FONT' | 'AUDIO';
    url: string;
    metadata?: Record<string, any>;
}

export interface PackageDependency {
    name: string;
    version: string;
}

export type PackageManager = 'npm' | 'yarn' | 'pnpm';

export interface Project {
    id: string;
    name: string;
    description: string;
    path?: string;
    apiKey?: string;
    settings: { useTypescript: boolean; framework: string; };
    rootRoute: RouteNode; // New field for tree navigation
    pages: Page[];
    userComponents: UserComponent[];
    modules: any[]; // Define later
    templates: any[]; // Define later
    layouts: Layout[];
    assetLibrary: AssetItem[];
    apiDefinitions: any[]; // Define later
    stateDefinitions: any[]; // Define later
    theme: Theme;
    packages: PackageDependency[];
    packageManager: PackageManager | null;
    port?: number;
}

// Drag and Drop Types
// -------------------

export interface DraggableItemSpec {
    id: string;
    name: string;
    description: string;
    item: Omit<AnyCanvasItem, 'id' | 'name'>;
}

export type DraggableElementSpec = DraggableItemSpec & { item: Omit<ElementCanvasItem, 'id' | 'name'> };
export type DraggableComponentSpec = DraggableItemSpec & { item: Omit<ComponentCanvasItem, 'id' | 'name'> };
export type DraggableIconSpec = DraggableItemSpec & { item: Omit<IconCanvasItem, 'id' | 'name'> };

export interface DndSourceData {
    type: 'new-item' | 'canvas-item';
    itemId: string;
    itemSpec?: DraggableItemSpec;
}

export type DndInstruction =
    | { type: 'reorder-before' }
    | { type: 'reorder-after' }
    | { type: 'make-child' };

// Component Library Structure
// ---------------------------

export interface ComponentCategory {
    name: string;
    items: DraggableElementSpec[];
}

export interface ComponentLibrary {
    name: string;
    categories: ComponentCategory[];
}


// Modal State Types
// -----------------
export type ModalState =
    | { type: 'CREATE_COMPONENT'; sourceItemIds: string[] }
    | { type: 'CREATE_PROJECT' }
    | { type: 'ADD_COMPONENT_FROM_CODE' }
    | { type: 'SET_PACKAGE_MANAGER' }
    | { type: 'SETTINGS' }
    | { type: 'PLUGINS' }
    | null;

// CMS Types
// ---------

export type CMSFieldType = 'text' | 'image' | 'rich-text' | 'number' | 'boolean';

export interface CMSField {
    id: string;
    name: string;
    type: CMSFieldType;
    value: any;
}

export interface CMSItem {
    id: string;
    data: Record<string, any>; // The raw key-value pairs
}

export interface CMSCollection {
    id: string;
    name: string;
    fields: { name: string; type: CMSFieldType }[]; // Schema definition
    items: CMSItem[];
}

export interface CMSPlugin {
    id: string;
    name: string;
    getCollections: () => Promise<CMSCollection[]>;
}

// Plugin System
// -------------

export interface PluginManifest {
    id: string;
    name: string;
    description: string;
    version: string;
    icon: any; // React.ReactNode or Lucide Icon
    author: string;
}

export interface JukiPlugin extends PluginManifest {
    type: 'cms' | 'tool' | 'integration';

    // UI Capabilities
    sidebarIcon?: any;
    sidebarPanel?: React.ComponentType<{ context: IAppContext }>; // The component to render in sidebar

    // Lifecycle
    onInit?: (context: IAppContext) => void;

    // CMS Capabilities (optional subset)
    getCollections?: () => Promise<CMSCollection[]>;
}

// App Context Type
// ----------------

export interface IAppContext {
    // State
    projects: Project[];
    activeProjectId: string | null;
    activePageId: string | null;
    activeLayoutId: string | null;
    selectedItemIds: string[];
    highlightedParentId: string | null;
    activeView: 'canvas' | 'code';
    modalState: ModalState;
    isPreviewMode: boolean;

    // CMS State
    cmsCollections: CMSCollection[];
    projectError: string | null;

    // Plugin State
    plugins: JukiPlugin[];
    availablePlugins: JukiPlugin[]; // Marketplace
    installPlugin: (plugin: JukiPlugin) => void;
    uninstallPlugin: (pluginId: string) => void;

    // Derived State
    activeProject: Project | undefined;
    activePage: Page | undefined;
    selectedItems: AnyCanvasItem[];

    // Actions
    addProject: (name: string, description: string, githubUrl?: string, initialData?: { theme?: Theme; pages?: Page[] }) => Promise<string | null>;
    updateProject: (project: Project) => Promise<void>;
    setActiveProjectId: (id: string) => void;
    exportProject: () => void;

    addPage: (name: string, description: string, route: string) => void;
    updatePage: (pageId: string, updates: Partial<Omit<Page, 'id' | 'children'>>) => void;
    updatePageFromCode: (code: string) => void;
    deletePage: (pageId: string) => void;
    setActivePageId: (id: string) => void;
    setActiveLayoutId: (id: string) => void;

    addItem: (parentId: string | null, itemSpec: DraggableItemSpec, index?: number) => void;
    addItemsToPage: (items: AnyCanvasItem[]) => void;
    updateItem: (itemId: string, updates: Partial<AnyCanvasItem>) => void;
    deleteItem: (itemId: string) => void;
    toggleItemLock: (itemId: string) => void;
    moveItem: (itemId: string, destId: string | null, instruction: DndInstruction) => void;
    findItemInTree: (itemId: string, tree: AnyCanvasItem[]) => { item: AnyCanvasItem; parentArray: AnyCanvasItem[]; index: number; parentItem: AnyCanvasItem | null } | null;

    setSelectedItemId: (itemId: string) => void;
    addSelectedItem: (itemId: string) => void;
    clearSelection: () => void;

    addComponentFromCode: (name: string, description: string, code: string, type: 'jsx' | 'html') => void;
    createComponentFromSelection: (name: string, description: string) => void;
    addAsset: (asset: AssetItem) => void;
    updateProjectTheme: (theme: Theme) => void;

    setPackageManager: (manager: PackageManager) => void;
    addPackage: (packageName: string) => void;
    removePackage: (packageName: string) => void;

    setActiveView: (view: 'canvas' | 'code') => void;
    enterPreviewMode: () => void;
    exitPreviewMode: () => void;

    openModal: (state: NonNullable<ModalState>) => void;
    closeModal: () => void;
    syncProject: () => Promise<void>;
    publishPage: () => Promise<void>;
    buildProject: () => Promise<void>;
    deleteProject: (projectId: string) => Promise<void>;
}

// Color Magic API
// ---------------

export interface ColorMagicPalette {
    id: string;
    colors: string[];
    tags: string[];
    text: string;
    likesCount: number;
}