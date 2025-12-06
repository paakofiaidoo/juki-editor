import { ProtoProject, ProtoPageType, ProtoAccessType, ProtoPage, ProtoLayout } from "../types/proto-mock";

const ROOT_LAYOUT_ID = "layout-root";
const DASHBOARD_LAYOUT_ID = "layout-dashboard";
const SETTINGS_LAYOUT_ID = "layout-settings";

const rootLayout: ProtoLayout = {
    id: ROOT_LAYOUT_ID,
    name: "RootLayout",
    route: "/",
    path: "app/layout.tsx",
    content: JSON.stringify([{ type: "ELEMENT", tag: "html", props: {}, content: [{ type: "ELEMENT", tag: "body", props: { className: "bg-background text-foreground" }, content: [] }] }]), // Simplified
    isRoot: true,
};

const dashboardLayout: ProtoLayout = {
    id: DASHBOARD_LAYOUT_ID,
    name: "DashboardLayout",
    route: "/dashboard",
    path: "app/dashboard/layout.tsx",
    content: JSON.stringify([{ type: "ELEMENT", tag: "div", props: { className: "flex h-screen" }, content: "Sidebar + Content" }]),
    parentLayoutId: ROOT_LAYOUT_ID,
    isRoot: false,
};

const pages: ProtoPage[] = [
    {
        id: "page-home",
        name: "Home",
        route: "/",
        type: ProtoPageType.STATIC,
        access: ProtoAccessType.PUBLIC,
        content: JSON.stringify([{ type: "ELEMENT", tag: "h1", props: {}, content: "Welcome to Juki" }]),
        projectId: "mock-project-1",
        layoutId: ROOT_LAYOUT_ID,
    },
    {
        id: "page-dashboard",
        name: "Dashboard",
        route: "/dashboard",
        type: ProtoPageType.STATIC,
        access: ProtoAccessType.PROTECTED,
        content: JSON.stringify([{ type: "ELEMENT", tag: "div", props: {}, content: "Dashboard Stats" }]),
        projectId: "mock-project-1",
        layoutId: DASHBOARD_LAYOUT_ID,
    },
    {
        id: "page-settings",
        name: "Settings",
        route: "/dashboard/settings",
        type: ProtoPageType.STATIC,
        access: ProtoAccessType.PROTECTED,
        content: JSON.stringify([{ type: "ELEMENT", tag: "form", props: {}, content: "Settings Form" }]),
        projectId: "mock-project-1",
        layoutId: DASHBOARD_LAYOUT_ID, // Inherits dashboard layout
    }
];

export const mockProject: ProtoProject = {
    id: "mock-project-1",
    name: "Mock Next.js App",
    description: "A simulated project with App Router structure.",
    settings: {
        useTypescript: true,
        framework: "NextJS",
    },
    pages: pages,
    layouts: [rootLayout, dashboardLayout],
    rootRoute: {
        id: "route-root",
        name: "Root",
        segment: "/",
        fullPath: "/",
        type: ProtoPageType.STATIC,
        layoutId: ROOT_LAYOUT_ID,
        pageId: "page-home",
        children: [
            {
                id: "route-dashboard",
                name: "Dashboard",
                segment: "dashboard",
                fullPath: "/dashboard",
                type: ProtoPageType.STATIC,
                layoutId: DASHBOARD_LAYOUT_ID,
                pageId: "page-dashboard",
                children: [
                    {
                        id: "route-settings",
                        name: "Settings",
                        segment: "settings",
                        fullPath: "/dashboard/settings",
                        type: ProtoPageType.STATIC,
                        pageId: "page-settings",
                        children: []
                    }
                ]
            }
        ]
    },
    userComponents: [],
};

// Simulated Engine Client
export const mockEngineClient = {
    getProject: async (id: string): Promise<ProtoProject> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockProject), 500); // Simulate network latency
        });
    },
    syncProject: async (id: string): Promise<ProtoProject> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockProject), 500);
        });
    }
};
