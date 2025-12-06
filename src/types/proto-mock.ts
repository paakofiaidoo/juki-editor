export interface ProtoMetadata {
    id: string;
    createdAt?: string;
    updatedAt?: string;
}

export const ProtoPageType = {
    PAGE_TYPE_UNSPECIFIED: 0,
    STATIC: 1,
    DYNAMIC: 2,
    CATCH_ALL: 3,
} as const;
export type ProtoPageType = typeof ProtoPageType[keyof typeof ProtoPageType];

export const ProtoAccessType = {
    ACCESS_TYPE_UNSPECIFIED: 0,
    PUBLIC: 1,
    PROTECTED: 2,
} as const;
export type ProtoAccessType = typeof ProtoAccessType[keyof typeof ProtoAccessType];

export interface ProtoLayout {
    id: string;
    name: string;
    route: string; // e.g., "app/dashboard"
    path: string; // File path "app/dashboard/layout.tsx"
    content: string; // JSON stringified layout content
    parentLayoutId?: string;
    isRoot: boolean;
    meta?: ProtoMetadata;
}

export interface ProtoPage {
    id: string;
    name: string;
    route: string;
    type: ProtoPageType;
    access: ProtoAccessType;
    content: string; // JSON stringified page content
    projectId: string;
    layoutId?: string; // Link to parent layout
    meta?: ProtoMetadata;
}

export interface ProtoUserComponent {
    id: string;
    projectId: string;
    name: string;
    content: string; // JSON stringified component
    meta?: ProtoMetadata;
}

export interface ProtoProjectSettings {
    useTypescript: boolean;
    framework: string;
}

export interface ProtoRouteNode {
    id: string;
    name: string;
    segment: string;
    fullPath: string; // "/dashboard/settings"
    type: ProtoPageType;
    pageId?: string;
    layoutId?: string;
    children: ProtoRouteNode[];
    meta?: ProtoMetadata;
}

export interface ProtoProject {
    id: string;
    name: string;
    description: string;
    settings: ProtoProjectSettings;
    pages: ProtoPage[];
    layouts: ProtoLayout[];
    rootRoute: ProtoRouteNode; // New field
    userComponents: ProtoUserComponent[];
    meta?: ProtoMetadata;
}
