import { parseComponentFileToCanvasItems } from "./jsxParser";

export const mapProtoToInternal = (proto: ProtoProject): Project => {
    return {
        id: proto.id,
        name: proto.name,
        description: proto.description || "",
        settings: {
            useTypescript: proto.settings?.useTypescript || false,
            framework: (proto.settings?.framework || "NextJS") as "NextJS" | "Vite" | "Remix" | "Astro" | "HTML",
        },
        rootRoute: proto.rootRoute ? mapProtoRouteNode(proto.rootRoute) : { id: "root", name: "Root", segment: "/", fullPath: "/", type: "STATIC", children: [] },
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
        port: proto.port,
    };
};

const mapProtoPage = (p: ProtoPage): Page => {
    let content: AnyCanvasItem[] = [];
    try {
        const parsed = JSON.parse(p.content);
        if (Array.isArray(parsed) && parsed.length > 0) {
            content = parsed as any;
        } else if (!Array.isArray(parsed) && parsed) {
            content = [parsed] as any;
        } else {
            // Empty or invalid JSON content, try rawContent
            if (p.rawContent) {
                content = parseComponentFileToCanvasItems(p.rawContent);
            }
        }
    } catch (e) {
        // If JSON parse fails, also try rawContent
        if (p.rawContent) {
            try {
                content = parseComponentFileToCanvasItems(p.rawContent);
            } catch (parseErr) {
                console.warn("Failed to parse page raw content", parseErr);
            }
        } else {
            console.warn("Failed to parse page content", e);
        }
    }

    return {
        id: p.id,
        name: p.name,
        description: "",
        route: p.route,
        path: `app${p.route === "/" ? "" : p.route}/page.tsx`,
        props: {},
        children: [],
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
        path: "", // Proto doesn't have path for layout explicitly? It has Route.
        root: root as AnyCanvasItem,
        route: l.route,
    };
};

const mapProtoRouteNode = (node: ProtoRouteNode): RouteNode => {
    let type: "STATIC" | "DYNAMIC" | "CATCH_ALL" = "STATIC";
    switch (node.type) {
        case PageType.STATIC: type = "STATIC"; break;
        case PageType.DYNAMIC: type = "DYNAMIC"; break;
        case PageType.CATCH_ALL: type = "CATCH_ALL"; break;
        default: type = "STATIC";
    }

    return {
        id: node.id,
        name: node.name,
        segment: node.segment,
        fullPath: node.fullPath,
        type: type,
        pageId: node.pageId,
        layoutId: node.layoutId,
        children: node.children ? node.children.map(mapProtoRouteNode) : [],
    };
};
