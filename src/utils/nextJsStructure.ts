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
    rawContent?: string;
    path?: string; // We hope to get this from the API
}

export const parseNextJsProjectStructure = (rawInputs: RawPageInput[]): { pages: Page[]; layouts: Layout[] } => {
    const pages: Page[] = [];
    const layouts: Layout[] = [];

    // 1. Separate Layouts and Pages
    rawInputs.forEach(input => {
        let content: AnyCanvasItem[] = [];
        try {
            if (input.rawContent) {
                content = parseComponentFileToCanvasItems(input.rawContent);
            } else if (input.content) {
                // Fallback for legacy JSON content
                // If content is stringified JSON
                if (input.content.trim().startsWith('[')) {
                    content = JSON.parse(input.content);
                } else if (input.content.trim().startsWith('{')) {
                    content = [JSON.parse(input.content)];
                }
            }
        } catch (e) {
            console.error(`Failed to parse content for ${input.name}`, e);
            // Push an error placeholder?
        }

        if (isLayoutFile(input.path, input.name)) {
            // It's a layout
            layouts.push({
                id: input.id,
                name: input.name,
                path: input.path || "",
                root: content[0] || null, // Layout usually has one root
            });
        } else {
            // It's a page (or assume page)
            pages.push({
                id: input.id,
                name: input.name,
                description: "",
                route: input.route,
                path: input.path,
                props: {},
                children: [], // Computed later
                content: content,
            });
        }
    });

    // 2. Link Pages to Layouts
    // Simple logic: Find the "root" layout (shortest path?) or exact match?
    // In Next.js, app/page.tsx uses app/layout.tsx.
    // app/about/page.tsx uses app/about/layout.tsx (if exists) OR app/layout.tsx.

    // For MVP: We assume ONE Root Layout for everyone if no specific layout found.
    const rootLayout = layouts.find(l => l.name === 'RootLayout' || (l.path && l.path.includes('app/layout.tsx')));
    // Note: Layouts don't strict have 'route', but they reside in a folder that defines scope.
    // Since we don't have perfect path info from the proto yet (maybe), we heuristic.

    // Better heuristic:
    // If we only have ONE layout, use it for everything.
    const mainLayout = rootLayout || layouts[0];

    pages.forEach(page => {
        // Link to main layout for now
        if (mainLayout) {
            page.layoutId = mainLayout.id;
        }

        // Compute 'children' (The Combined Tree)
        // If we have a layout, we need to "Inject" the page content into the layout's `{children}` or `<Outlet />`.
        // Since our Canvas is JSON data, we can't just "render".
        // We need to structurally replace the "Children Placeholder" in the Layout with the Page Content.

        // However, visualizing "Whole Page" means:
        // Root = LayoutRoot
        // Find where 'children' prop is used? OR look for a special placeholder?
        // In our `jsxParser`, `{children}` might be parsed as an identifier or something.

        // MVP: Just Append Page Content to Layout? No, that's wrong.
        // MVP: Wrap Page Content in a Div?

        // Let's implement a 'injectPageIntoLayout' helper later.
        // For now, if layout exists, we set children = [LayoutInstance].
        // But LayoutInstance is a Component...

        if (mainLayout && mainLayout.root && page.content) {
            // We create a composite.
            // But modifying the 'children' permanently is tricky.
            // We'll store the RAW 'content' separately (we did above).
            // And 'children' will be the display tree.

            // Construct the Display Tree:
            // Clone Layout
            // Find insertion point (hard without specific marker)
            // Just putting page content INSIDE the layout root for now (as last child?).

            const layoutClone = JSON.parse(JSON.stringify(mainLayout.root));

            // Very naive injection: If layout root has valid content array, push page content.
            if (layoutClone.content && Array.isArray(layoutClone.content)) {
                // Try to find where {children} would be?
                // Too complex for step 1.
                // Just append.
                layoutClone.content.push(...page.content);
            } else {
                if (!layoutClone.content) layoutClone.content = [];
                if (Array.isArray(layoutClone.content)) layoutClone.content.push(...page.content);
            }

            page.children = [layoutClone];
        } else {
            page.children = page.content || [];
        }
    });

    return { pages, layouts };
};
