<<<<<<< HEAD
--- START OF FILE GEMINI.md ---

SYSTEM PROMPT: Juki Editor - Master Architecture & Build Plan (Next.js/WordPress Scale)

1. Project Goal & Core Identity

Your Task: Generate a complete, single-file React application (.jsx) for a web-based, WYSIWYG visual UI editor named "Juki Editor." This application must be entirely self-contained, using localStorage for persistence (for the MVP) and implementing all features as described. The goal is to create a developer-focused, component-tree manipulation tool with deep integration of AI and external services.

Core Identity:

Function: A comprehensive, full-stack visual editor for generating structured React/Next.js code. Users must be able to construct complex page layouts, manage reusable components, integrate APIs, and visually manipulate state and data bindings.

Scale: This is designed to handle an array of project artifacts (Pages, Components, Modules, Templates, Assets).

Core Pillars (System Behavior):

Visual-First: Intuitive drag-and-drop interface for rapid prototyping with zero-tolerance for visual/model divergence.

Code-Accurate: The underlying data model must always represent valid, clean JSX, ensuring every artifact is exportable.

Hierarchical Control: Implementation of complex tree-based Drag & Drop logic for seamless parent/child and sibling reordering.

Developer-Grade Polish: Dark, elegant, and professional environment.

Output: The application has three primary outputs:

Production-Quality React/JSX Code: A string of clean, human-readable JSX code representing the visual layout of the active page.

Portable JSON Project State: The complete application data model for all artifacts.

Image Assets: Generated images (Gemini) or sourced stock photos (Pixabay).

Aesthetic (Visual Style & Feel): Dark Mode is MANDATORY. The UI must be professional, modern, and developer-focused. All interactions must use the vivid, energetic green accent color for primary actions, active selections, and interactive highlights.

2. Core Data Model (THE SINGLE SOURCE OF TRUTH)

The entire application state MUST be driven by the following JSON-serializable structures. New structures are introduced to support Modules, Templates, Layouts, and Assets.

Project (The Root Data Structure)

interface Project {
  id: string;
  name: string;
  settings: ProjectSettings;
=======
SYSTEM PROMPT: Juki Editor - Master Architecture & Build Plan (Next.js/WordPress Scale)

1. Project Goal & Core Identity

Your Task: Generate a complete, single-file React application (.jsx) for a web-based, WYSIWYG visual UI editor named "Juki Editor." This application must be entirely self-contained, using localStorage for persistence (for the MVP) and implementing all features as described. The goal is to create a developer-focused, component-tree manipulation tool with deep integration of AI and external services.

Core Identity:

Function: A comprehensive, full-stack visual editor for generating structured React/Next.js code. Users must be able to construct complex page layouts, manage reusable components, integrate APIs, and visually manipulate state and data bindings.

Scale: This is designed to handle an array of project artifacts (Pages, Components, Modules, Templates, Assets).

Core Pillars (System Behavior):

Visual-First: Intuitive drag-and-drop interface for rapid prototyping with zero-tolerance for visual/model divergence.

Code-Accurate: The underlying data model must always represent valid, clean JSX, ensuring every artifact is exportable.

Hierarchical Control: Implementation of complex tree-based Drag & Drop logic for seamless parent/child and sibling reordering.

Developer-Grade Polish: Dark, elegant, and professional environment.

Output: The application has three primary outputs:

Production-Quality React/JSX Code: A string of clean, human-readable JSX code representing the visual layout of the active page.

Portable JSON Project State: The complete application data model for all artifacts.

Image Assets: Generated images (Gemini) or sourced stock photos (Pixabay).

Aesthetic (Visual Style & Feel): Dark Mode is MANDATORY. The UI must be professional, modern, and developer-focused. All interactions must use the vivid, energetic green accent color for primary actions, active selections, and interactive highlights.

2. Core Data Model (THE SINGLE SOURCE OF TRUTH)

The entire application state MUST be driven by the following JSON-serializable structures. New structures are introduced to support Modules, Templates, Layouts, and Assets.

Project (The Root Data Structure)

interface Project {
id: string;
name: string;
settings: ProjectSettings;

// Primary Content Collections (Visible in Project Explorer)
pages: PageItem[];             // The main views/routes
userComponents: DraggableItemSpec[]; // Simple, reusable components
modules: ModuleItem[];         // Complex, self-contained, linked component packages
templates: DraggableItemSpec[]; // Full-page initial layouts
layouts: DraggableItemSpec[];   // Reusable structural wrappers (Header/Footer/Sidebar)

// Asset/Utility Collections
assetLibrary: AssetItem[];      // Stores metadata for all external assets (Images/APIs/Icons)
apiDefinitions: APIDefinition[]; // Stores definitions of external endpoints
stateDefinitions: StateDefinition[]; // Stores global state/context variables
}



Artifact Definition Structures (New Collections)

// Modules: A reusable block that can include internal state or logic (complex components)
interface ModuleItem {
id: string;
name: string;
description: string;
children: AnyCanvasItem[]; // The structure of the module itself
// Future: Bindings for module-specific state
}

// Assets: Metadata for images, icons, and API resources
type AssetType = 'IMAGE' | 'ICON' | 'API_RESOURCE';
interface AssetItem {
id: string;
type: AssetType;
name: string;
url: string; // URL for images/icons
metadata: Record<string, any>; // e.g., prompt for AI image, Pixabay license info
}

// API Definitions: Endpoint configuration for API integration
interface APIDefinition {
id: string;
name: string;
endpoint: string;
method: 'GET' | 'POST' | 'PUT' | 'DELETE';
headers: Record<string, string>;
// Future: schema definition
}

// State Definitions: Global state/context variables
interface StateDefinition {
id: string;
name: string;
initialValue: any;
type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'ARRAY' | 'OBJECT';
}



PageItem (Unchanged)

interface PageItem {
<<<<<<< HEAD
  id: string;
  name: string;
  props: Record<string, any>;
  children: AnyCanvasItem[]; // The list of root-level items on this page
=======
id: string;
name: string;
props: Record<string, any>;
children: AnyCanvasItem[]; // The list of root-level items on this page
}



AnyCanvasItem (The Core UI Tree Node - Unchanged, but used for all content)

This is the recursive, discriminated union for everything that can be rendered on the canvas.

type ItemType = 'ELEMENT' | 'COMPONENT' | 'MODULE_INSTANCE';

interface BaseCanvasItem {
id: string;        // Unique UUID for this specific instance
name: string;
type: ItemType;
props: Record<string, any>; // HTML attributes (className, src) or React props.
content?: string | AnyCanvasItem[]; // The item's children.
// Future: dataBinding: { source: 'STATE_ID' | 'API_CALL_ID', field: string }
}

interface ElementCanvasItem extends BaseCanvasItem {
type: 'ELEMENT';
tag: string; // e.g., 'div', 'p', 'h1'
}

interface ComponentCanvasItem extends BaseCanvasItem {
type: 'COMPONENT';
componentType: string; // Maps to a key in the componentRegistry or userComponents
}

interface ModuleCanvasItem extends BaseCanvasItem {
type: 'MODULE_INSTANCE';
moduleId: string; // Maps to a Project.modules.id
// Module instances are visually represented by their ModuleItem.children, but are treated as a single, linked unit on the canvas.
}

type AnyCanvasItem = ElementCanvasItem | ComponentCanvasItem | ModuleCanvasItem;



DraggableItemSpec (Unchanged)

The template used to create a new AnyCanvasItem.

3. Application Layout (Visual Blueprint)

The application utilizes a three-column layout with collapsible sidebars.

3.1. Left Sidebar (Project Explorer)

Role: This panel is the central control hub, functioning as a multi-pane VS Code-style File Explorer, categorized by artifact type.

Header: "Juki Editor" logo/title in a large, bold font.

Main Menu Tabs (Top Vertical Bar - High-Fidelity File Explorer): This bar is the core navigational feature. The current selection must be highly visible with the green accent color background and text.

Icon

Name

Role/Content

Data Source

Layers

🌳 Layers

Component Tree View (Structural Navigator): This panel serves as the primary structural navigator for the currently active page. It displays a draggable and collapsible hierarchy of all items (activePage.children), visually representing the exact parent-child nesting and sibling order of your JSX tree. Users can precisely reorder elements, nest items into containers, or pull children out of parents, mirroring the complex D&D tree logic implemented in Section 7. This view is essential for deep inspection, selection, and manipulation of items that may be too small or obscured on the main Canvas. Every selection made here must instantly synchronize with the Canvas and the Right Inspector panel.

activePage.children

Component

🧩 Editor

Primitives & Components: Pre-built HTML Elements, Basic Components (Button, Card), and userComponents.

userComponents, Elements

Layout

📐 Layouts

Structural Wrappers: Draggable, pre-configured Header, Footer, and Sidebar layouts.

project.layouts

GalleryHrizontal

🖼️ Templates

Full Page Blueprints: Starting points for new pages.

project.templates

Package

📦 Modules

Linked Components: Management and instantiation of complex ModuleItem packages (e.g., a "Product Carousel Module").

project.modules

Image

📸 Assets

Image Management: Gemini Image Generation UI and Pixabay Stock Photo search integration.

project.assetLibrary + API

Smile

✨ Icons

Icon Library: Drag-and-drop source for all available icons (Lucide/FontAwesome).

Pre-defined

Zap

⚛️ State

State Management: CRUD interface for defining and editing StateDefinition objects (Global Context).

project.stateDefinitions

Cloud

🌐 APIs

API Integrations: CRUD interface for defining and managing APIDefinition endpoints.

project.apiDefinitions

Code

💻 Code

JSX Export: Displays the formatted, exportable JSX of the active page.

Derived (activePage)

Wand2

🤖 AI Agent

Conversational Agent: Chat interface for text-to-code, code-to-JSON, and image generation prompting.

Gemini API

The Layers Tab UI (Crucial):

Must display the name of the item, an icon based on its type (e.g., Square for 'div', Bot for 'MODULE_INSTANCE').

Must implement collapsible/expandable nodes for parent items.

The entire item row must be a Drag Source and Drop Target, capable of triggering the full tree manipulation logic (see Section 7).

3.2. Canvas (Central Area)

Responsiveness: The canvas must simulate various screen sizes (Mobile, Tablet, Desktop) via a size selector/dropdown in its header.

Interaction: Clicking any item must set selectedItemId and immediately update the Inspector. The selection border must be the vivid green accent.

3.3. Right Inspector Panel

Header: "Inspector" (with contextually changing name, e.g., "Inspect: Header Section").

Tabs:

Props: Dynamic key-value editor for non-style attributes.

Styles: Dedicated textarea for editing the essential Tailwind class string (className prop). Must feature a real-time Tailwind class linter/autocomplete (even if visual feedback is static).

Bindings (Future/Placeholder): UI for connecting selectedItem.props or selectedItem.content to StateDefinition or APIDefinition results.

4. Functional Architecture

4.1. The Artifact Finder (Tree Traversal Utility)

A recursive utility function (findItemById(id, childrenArray)) is essential.

It must locate an item anywhere in the tree and return not only the item itself but also its parent array reference and its index within that array. This is critical for immutable move operations.

4.2. Event-driven Model Updates

Every change triggers a cascade: User Action → Model Sync (updates internal JSON immutably via path tracking) → Visual Re-render & Code Output Rebuild.

4.3. Hover Parenting Logic (Advanced D&D UX)

The canvas must support this: when hovering over a container element for >300ms, a thick, pulsating green border appears on the container's interior, indicating the dragged item will be nested as a child, overriding sibling reorder instructions.

5. Core Architecture & State Management

Monolithic Context: Use AppContext to hold all Project state.

Immutability: All tree mutations MUST be immutable. Helper functions for moveItem and deleteItem must clone the necessary parts of the tree before modification.

UUID: Use crypto.randomUUID() to generate unique IDs for every new AnyCanvasItem instance.

6. Rendering Pipeline

The Canvas and the Layers Tab must use the exact same recursive logic to render the tree, ensuring they always mirror the project structure.

6.1. JSX Generation

A recursive function (generateJSX(item)) is required to traverse the AnyCanvasItem tree and produce a formatted JSX string with correct indentation and prop handling.

7. Key Feature: Advanced Drag & Drop System (The Tree Logic)

You MUST use the @atlaskit/pragmatic-drag-and-drop suite. The primary challenge is implementing the moveItem operation which involves two steps: Removal and Insertion across potentially different tree depths.

7.1. D&D Data Payload and Drop Targets

Source Data (draggable data attribute):

{
<<<<<<< HEAD
  type: 'canvas-item',
  itemId: item.id,
  itemType: item.type,
  // CRITICAL: A flat array of IDs representing the path from the page root to the immediate parent.
  // e.g., ['page-root', 'section-1', 'card-container']
  parentPath: getParentPath(item.id, activePage.children),
=======
type: 'canvas-item',
itemId: item.id,
itemType: item.type,
// CRITICAL: A flat array of IDs representing the path from the page root to the immediate parent.
// e.g., ['page-root', 'section-1', 'card-container']
parentPath: getParentPath(item.id, activePage.children),
}



Target Data (dropTarget data attribute): Must include targetId, targetPath, and the element reference for hitbox calculations.

7.2. Core Mutation Logic: moveItem(source, target, instruction)

This function, executed within the global onDrop handler, is the most complex part and must adhere to this logic:

Locate the Item to Move (Removal):

Find the sourceItem and the sourceParentArray using the source.parentPath and the findItemById utility.

Immutably remove the item from sourceParentArray using slice() or a deep clone/splice approach.

Determine Insertion Point (Insertion):

Analyze the target and instruction (from @atlaskit/pragmatic-drag-and-drop-hitbox).

Case A: Sibling Move (Before/After): The insertion occurs in the same parent array as the target. The destArray is the target's parent's content array.

Case B: Parent Nesting (Inside): The insertion occurs within the target's content array. The destArray is the targetItem.content array.

Perform Insertion:

Immutably insert the modified sourceItem (with a potentially new parentPath) into the destArray at the calculated index.

Update State: Call setProject with the new, immutably updated Project object.

8. Key Feature: AI & External Services

The 📸 Assets and 🤖 AI Agent tabs require specialized API integration.

8.1. Conversational AI Agent (🤖 AI Agent Tab)

Functions: Provides a chat interface that supports all Gemini functions.

Text-to-JSON: Uses the system prompt from the original plan to strictly enforce AnyCanvasItem JSON output from a descriptive prompt. The output is saved to project.userComponents.

JSX-to-JSON: Converts user-pasted JSX into the internal JSON model for immediate rendering.

Image Generation: If the prompt is descriptive of an image, the Agent seamlessly switches to the imagen-3.0-generate-002 API.

8.2. Image Management (📸 Assets Tab)

Gemini Image Generation:

A dedicated input field for image generation prompts.

Uses the imagen-3.0-generate-002:predict endpoint.

Generated images are displayed and automatically saved to project.assetLibrary with their prompt and base64 data URL.

Pixabay Integration (Mock):

Simulate integration by displaying a set of fixed placeholder images/URLs labeled "Pixabay Stock Photos." When selected, the asset is saved to project.assetLibrary.

9. Dependencies (MANDATORY)

The final code must be a single .jsx file importing and using these libraries.

react (standard hooks)

lucide-react (for all icons: Plus, Layers, Wand2, Trash, X, Code, Settings, Cloud, Component, Layout, GalleryHorizontal, Package, Image, Smile, Zap)

@atlaskit/pragmatic-drag-and-drop

@atlaskit/pragmatic-drag-and-drop-hitbox

@atlaskit/pragmatic-drag-and-drop-react-drop-indicator

@google/genai

@monaco-editor/react (MANDATORY for Code tab display)

<<<<<<< HEAD
tailwindcss (via CDN - all styling MUST use Tailwind classes)

---
### Appendix: Juki Editor Feature Evolution & Implementation Details

This section documents the major architectural and feature updates implemented in the Juki Editor, evolving it from its initial concept into a more robust and interactive application.

#### 1. Modular Architecture Refactor

- **From Monolith to Modules:** The application was initially a single `App.tsx` file. It has been completely refactored into a modular structure with distinct folders for `components`, `context`, `hooks`, `utils`, `types`, and `lib`. This separation of concerns is a best practice for scalability and maintainability.
- **Centralized State Management:** All global state and business logic have been encapsulated within `src/context/AppContext.tsx`, providing a single source of truth and a clean API for components to interact with the application's data.

#### 2. Page Management System

- **Dedicated Pages Panel:** The ability to manage pages was moved from a subsection of the "Layers" panel to its own dedicated, top-level "Pages" tab in the left sidebar.
- **Modal-Driven Creation:** A professional modal (`AddPageModal`) was created for adding new pages. This allows users to specify not just a name, but also a **description** and a **route**, making the system more powerful for multi-page projects.
- **UI/UX Enhancements:** The pages list now displays the route alongside the name for better project visibility.

#### 3. Component Creation from Selection

- **Multi-Select Functionality:** The canvas was upgraded to support multi-element selection by holding the `Shift` key. The application state was refactored from tracking a single `selectedItemId` to an array of `selectedItemIds`.
- **Contextual UI in Inspector:** The Inspector panel was made context-aware. It now displays a "Create Component" button when multiple items are selected, providing a clear, contextual action.
- **Intelligent Component Generation:** The core logic (`createComponentFromSelection`) was implemented to find the common parent of the selected elements, create a new `UserComponent` definition from them, and seamlessly replace the original elements on the canvas with an instance of the newly created component.

#### 4. On-Canvas Manipulation & Resizing

- **Selection Wrapper UI:** A new `SelectionWrapper` component was introduced. When an element is selected, this wrapper provides a sophisticated UI for direct manipulation.
- **8-Point Resizing:** The wrapper includes eight resize handles on its corners and sides, allowing for intuitive, live resizing of the element's width and height by updating its inline styles.
- **Quick-Action Toolbar:** A floating toolbar was added to the selection wrapper, featuring instant-access buttons for the two most common actions: **Delete** and **Save as Component**.
- **Global Modal System:** To support triggering the "Create Component" modal from both the Inspector and the on-canvas toolbar, a global modal state was added to the `AppContext`.

#### 5. Local JSX Parser (Babel Integration)

- **Shift from AI to Deterministic Parsing:** The reliance on the Gemini API for converting JSX to the application's internal JSON model was replaced. The `@babel/standalone` library was integrated to provide reliable, fast, and offline-capable JSX parsing.
- **Code-to-Canvas Sync:** The "Code" view was enhanced with a "Sync Changes" button. This feature uses the new Babel parser to apply any edits made in the code editor back to the visual canvas, creating the foundation for a true two-way data binding experience.

#### 6. Advanced Interactive Styling Inspector

- **From Placeholders to Production:** The entire Inspector panel was rebuilt, replacing all static placeholders with a fully interactive, two-way bound styling system.
- **Robust Style Engine:** A new `styleUtils.ts` utility was created. Its functions can parse an element's current styles from *both* its inline `style` prop and its Tailwind `className` string. It can also intelligently merge new style changes back into the element's props.
- **Comprehensive Layout Controls:** Full UI controls were implemented for **Flexbox**, **Grid**, and **Block** layouts. This includes granular controls for sizing, spacing, positioning, alignment, and templates, making the Inspector a professional-grade tool for crafting precise layouts.
- **Context-Aware UI:** The Inspector is now context-aware, for example, only showing the "Typography" section for text-based elements, keeping the UI clean and relevant.
=======
tailwindcss (via CDN - all styling MUST use Tailwind classes)
>>>>>>> 9ce6fc7 (Expand `GEMINI.md` with additional details for Juki Editor's architecture, core features, and implementation requirements.)