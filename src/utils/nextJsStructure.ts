import { Page, Layout, AnyCanvasItem } from "../types";
import { parseComponentFileToCanvasItems } from "./jsxParser";

// Helper to check if an item is a layout file
const isLayoutFile = (path: string | undefined, name: string) => {
    return (path && path.includes("layout.tsx")) || name.toLowerCase() === "layout";
};

// Helper to check if an item is a page file
const isPageFile = (path: string | undefined, name: string) => {
    return (path && path.includes("page.tsx")) || name.toLowerCase() === "page" || name.toLowerCase() === "home"; // Fallback
};

interface RawPageInput {
    id: string;
    name: string;
    route: string;
    content?: string;
    composedContent?: string;
    rawContent?: string;
    path?: string; // We hope to get this from the API
}

export const parseNextJsProjectStructure = (rawInputs: RawPageInput[]): { pages: Page[]; layouts: Layout[] } => {
    const pages: Page[] = [];
    const layouts: Layout[] = [];

    // 1. Separate Layouts and Pages
    rawInputs.forEach(input => {
        let content: AnyCanvasItem[] = [];
        let composedChildren: AnyCanvasItem[] = [];

        // Parse individual component content
        try {
            if (input.content) {
                const parsed = JSON.parse(input.content);
                content = Array.isArray(parsed) ? parsed : [parsed];
            } else if (input.rawContent) {
                content = parseComponentFileToCanvasItems(input.rawContent);
            }
        } catch (e) {
            console.error(`Failed to parse content for ${input.name}`, e);
        }

        // Parse pre-composed children (layout + page) from engine
        try {
            if (input.composedContent) {
                const parsed = JSON.parse(input.composedContent);
                composedChildren = Array.isArray(parsed) ? parsed : [parsed];
            }
        } catch (e) {
            console.error(`Failed to parse composedContent for ${input.name}`, e);
        }

        if (isLayoutFile(input.path, input.name)) {
            layouts.push({
                id: input.id,
                name: input.name,
                path: input.path || "",
                root: content[0] || null,
                route: input.route || "",
            });
        } else {
            pages.push({
                id: input.id,
                name: input.name,
                description: "",
                route: input.route,
                path: input.path,
                props: {},
                children: composedChildren, // Use engine-composed children
                content: content,
            });
        }
    });

    // 2. Link Pages to Layouts and Fallback Injection
    const rootLayout = layouts.find(l => l.name === 'RootLayout' || (l.path && l.path.includes('app/layout.tsx')));
    const mainLayout = rootLayout || layouts[0];

    pages.forEach(page => {
        if (mainLayout) {
            page.layoutId = mainLayout.id;
        }

        // If engine didn't provide composed children, perform manual fallback injection
        if (page.children.length === 0) {
            const pageContent = page.content || [];
            if (mainLayout && mainLayout.root && pageContent.length > 0) {
                const layoutClone = JSON.parse(JSON.stringify(mainLayout.root));
                if (!Array.isArray(layoutClone.content)) {
                    layoutClone.content = [];
                }
                layoutClone.content.push(...pageContent);
                page.children = [layoutClone];
            } else {
                page.children = pageContent;
            }
        }
    });

    return { pages, layouts };
};

