import { ProtoProject, ProtoPage, ProtoLayout, ProtoRouteNode } from "../types/proto-mock";
import { Project, Page, Layout, AnyCanvasItem, RouteNode } from "../types";

export const mapProtoToInternal = (proto: ProtoProject): Project => {
    return {
        id: proto.id,
        name: proto.name,
        description: proto.description || "",
        settings: {
            useTypescript: proto.settings.useTypescript,
            framework: proto.settings.framework as "NextJS" | "Vite" | "Remix" | "Astro" | "HTML",
        },
        rootRoute: mapProtoRouteNode(proto.rootRoute),
        pages: proto.pages.map(mapProtoPage),
        layouts: proto.layouts.map(mapProtoLayout),
        userComponents: [], // TODO: Map components if needed
        theme: {
            colors: {
                primary: "#3b82f6",
                secondary: "#10b981",
                accent: "#8b5cf6",
                background: "#0f172a",
                text: "#f8fafc",
            },
            fonts: {
                body: "Inter, sans-serif",
                heading: "Inter, sans-serif",
            },
            borderRadius: "0.5rem",
            spacing: "1rem",
            importedFonts: [],
        },
        packages: [],
        packageManager: null, // "npm", "pnpm", "yarn", "bun"
        assetLibrary: [],
        modules: [],
        templates: [],
        apiDefinitions: [],
        stateDefinitions: [],
    };
};

const mapProtoPage = (p: ProtoPage): Page => {
    let content: AnyCanvasItem[] = [];
    try {
        content = JSON.parse(p.content);
        if (!Array.isArray(content)) {
            // Handle single object vs array difference if any
            content = [content] as any;
        }
    } catch (e) {
        console.warn("Failed to parse page content", e);
    }

    return {
        id: p.id,
        name: p.name,
        description: "",
        route: p.route,
        path: `app${p.route === "/" ? "" : p.route}/page.tsx`,
        props: {},
        children: [], // Computed tree logic handles this later? Or is this the content?
        // In the new architecture, 'children' might be the Composition of Layout + Page.
        // For now, let's put the raw content here so it renders.
        content: content,
        layoutId: p.layoutId,
    };
};

const mapProtoLayout = (l: ProtoLayout): Layout => {
    let root: AnyCanvasItem | null = null;
    try {
        const parsed = JSON.parse(l.content);
        root = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch (e) {
        console.warn("Failed to parse layout content", e);
    }

    return {
        id: l.id,
        name: l.name,
        path: l.path,
        root: root as AnyCanvasItem,
        // Helper fields
        route: l.route,
    };
};

const mapProtoRouteNode = (node: ProtoRouteNode): RouteNode => {
    return {
        id: node.id,
        name: node.name,
        segment: node.segment,
        fullPath: node.fullPath,
        type: node.type === 1 ? 'STATIC' : node.type === 2 ? 'DYNAMIC' : node.type === 3 ? 'CATCH_ALL' : 'STATIC',
        pageId: node.pageId,
        layoutId: node.layoutId,
        children: node.children ? node.children.map(mapProtoRouteNode) : [],
    };
};
