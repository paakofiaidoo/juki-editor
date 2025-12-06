import { ProtoProject, ProtoPageType, ProtoAccessType, ProtoPage, ProtoLayout } from "../types/proto-mock";

const ROOT_LAYOUT_ID = "layout-root";
const BLOG_LAYOUT_ID = "layout-blog";

const rootLayout: ProtoLayout = {
    id: ROOT_LAYOUT_ID,
    name: "RootLayout",
    route: "/",
    path: "app/layout.tsx",
    content: JSON.stringify([{ type: "ELEMENT", tag: "div", props: { className: "min-h-screen bg-background font-sans antialiased" }, content: [{ type: "ELEMENT", tag: "header", props: { className: "border-b p-4" }, content: "Navbar" }, { type: "ELEMENT", tag: "main", props: { className: "container mx-auto p-4" }, content: [] }] }]),
    isRoot: true,
};

const blogLayout: ProtoLayout = {
    id: BLOG_LAYOUT_ID,
    name: "BlogLayout",
    route: "/blog",
    path: "app/blog/layout.tsx",
    content: JSON.stringify([{ type: "ELEMENT", tag: "div", props: { className: "flex gap-8" }, content: [{ type: "ELEMENT", tag: "aside", props: { className: "w-64 border-r pr-4" }, content: "Blog Sidebar" }, { type: "ELEMENT", tag: "div", props: { className: "flex-1" }, content: [] }] }]),
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
        content: JSON.stringify([{ type: "ELEMENT", tag: "div", props: { className: "space-y-8" }, content: [{ type: "ELEMENT", tag: "h1", props: { className: "text-4xl font-bold tracking-tight" }, content: "Welcome to Example Corp" }, { type: "ELEMENT", tag: "p", props: { className: "text-xl text-muted-foreground" }, content: "Building the future, today." }] }]),
        projectId: "example-project",
        layoutId: ROOT_LAYOUT_ID,
    },
    {
        id: "page-about",
        name: "About",
        route: "/about",
        type: ProtoPageType.STATIC,
        access: ProtoAccessType.PUBLIC,
        content: JSON.stringify([{ type: "ELEMENT", tag: "h1", props: { className: "text-3xl font-bold" }, content: "About Us" }]),
        projectId: "example-project",
        layoutId: ROOT_LAYOUT_ID,
    },
    {
        id: "page-contact",
        name: "Contact",
        route: "/contact",
        type: ProtoPageType.STATIC,
        access: ProtoAccessType.PUBLIC,
        content: JSON.stringify([{ type: "ELEMENT", tag: "h1", props: { className: "text-3xl font-bold" }, content: "Contact Us" }]),
        projectId: "example-project",
        layoutId: ROOT_LAYOUT_ID,
    },
    {
        id: "page-blog-index",
        name: "Blog Index",
        route: "/blog",
        type: ProtoPageType.STATIC,
        access: ProtoAccessType.PUBLIC,
        content: JSON.stringify([{ type: "ELEMENT", tag: "h1", props: { className: "text-3xl font-bold" }, content: "Latest Posts" }]),
        projectId: "example-project",
        layoutId: BLOG_LAYOUT_ID,
    },
    {
        id: "page-blog-post",
        name: "Blog Post",
        route: "/blog/[slug]",
        type: ProtoPageType.DYNAMIC,
        access: ProtoAccessType.PUBLIC,
        content: JSON.stringify([{ type: "ELEMENT", tag: "article", props: { className: "prose lg:prose-xl" }, content: "Dynamic Blog Content" }]),
        projectId: "example-project",
        layoutId: BLOG_LAYOUT_ID,
    }
];

export const mockProject: ProtoProject = {
    id: "example-project",
    name: "Example Static Site",
    description: "MVP Example Project with Home, About, Contact, Blog.",
    settings: {
        useTypescript: true,
        framework: "NextJS",
    },
    pages: pages,
    layouts: [rootLayout, blogLayout],
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
                id: "route-about",
                name: "About",
                segment: "about",
                fullPath: "/about",
                type: ProtoPageType.STATIC,
                layoutId: ROOT_LAYOUT_ID,
                pageId: "page-about",
                children: []
            },
            {
                id: "route-contact",
                name: "Contact",
                segment: "contact",
                fullPath: "/contact",
                type: ProtoPageType.STATIC,
                layoutId: ROOT_LAYOUT_ID,
                pageId: "page-contact",
                children: []
            },
            {
                id: "route-blog",
                name: "Blog",
                segment: "blog",
                fullPath: "/blog",
                type: ProtoPageType.STATIC,
                layoutId: BLOG_LAYOUT_ID,
                pageId: "page-blog-index",
                children: [
                    {
                        id: "route-blog-slug",
                        name: "Post",
                        segment: "[slug]",
                        fullPath: "/blog/[slug]",
                        type: ProtoPageType.DYNAMIC,
                        layoutId: BLOG_LAYOUT_ID,
                        pageId: "page-blog-post",
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
    },
    listProjects: async (): Promise<{ projects: ProtoProject[], total_count: number }> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ projects: [mockProject], total_count: 1 }), 500);
        });
    }
};
