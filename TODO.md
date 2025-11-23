# Juki Editor - Project TODO List

This document tracks the major features, enhancements, and bugs that need to be addressed to move the Juki Editor project forward.

## 🚧 High Priority / Core Functionality

-   **[ ] Two-Way Code Sync**: Implement the "Sync Changes" button in the Code view. Use the existing Babel JSX parser (`src/utils/jsxParser.ts`) to parse modified JSX and update the `activePage` state, enabling a true code-to-canvas workflow.
-   **[ ] Multi-Select Component Creation**: The app state supports multi-select (`selectedItemIds`), but the `createComponentFromSelection` logic currently only works for a single item. This needs to be updated to:
    -   Find the common ancestor of all selected items.
    -   Create a new component with the selected items as its children.
    -   Replace the selected items on the canvas with a single instance of the new component.
-   **[ ] Inspector: Border Controls**: The "Borders" section in the Style Editor is currently a placeholder. Implement UI controls for `border-width`, `border-style`, `border-color`, and `border-radius`.

## ✨ Medium Priority / Feature Expansion

-   **[ ] Modules System**:
    -   Build the UI for the "Modules" panel to allow creating, renaming, and deleting modules.
    -   Modules should be complex, reusable components that might eventually have their own internal state.
    -   Update the canvas D&D to support dragging and dropping module instances.
-   **[ ] Layouts & Templates System**:
    -   Implement the "Layouts" panel to allow users to create and save structural wrappers (e.g., a Header/Sidebar/Footer combo).
    -   Implement the "Templates" panel for saving and reusing entire page layouts.
    -   Update the "Add Page" modal to allow creating a new page from a template.
-   **[ ] Inspector: Effects Controls**: Expand the "Effects" section in the Style Editor beyond Opacity to include controls for `box-shadow` and CSS `transform` (scale, rotate, translate).
-   **[ ] Advanced D&D UX**: Implement the "hover parenting logic" on the canvas. When a user drags an item and hovers over a container for a short duration, the container should be clearly highlighted to indicate that dropping will nest the item as a child.
-   **[ ] Component Prop Management**: Allow users to define props for their User Components (e.g., a "Card" component could have a `title` and `imageUrl` prop). The Inspector should then show fields to edit these props on a component *instance*.

## 🔗 Low Priority / Integrations & Long-Term

-   **[ ] State Management System**:
    -   Implement the UI for the "State" panel to define global state variables (e.g., `isLoggedIn`, `userName`).
    -   Implement the "Bindings" tab in the Inspector to connect element properties (like content or visibility) to these state variables.
-   **[ ] API Integration System**:
    -   Implement the UI for the "APIs" panel to define external API endpoints (`GET`, `POST`, etc.).
    -   Implement the "Bindings" tab in the Inspector to connect UI elements to API data sources.
-   **[ ] GitHub Integration**: Flesh out the GitHub connection feature. This could involve authenticating with GitHub, pulling repository contents, and syncing component code.
-   **[ ] Additional Asset Sources**: Integrate with a stock photo service like Pexels or Unsplash in the "Assets" panel to provide another source for images besides local uploads and AI generation.
-   **[ ] AI Agent Enhancements**: Improve the "AI Agent" panel to support a wider range of commands, such as converting pasted JSX into a new component or modifying the styles of the selected element via a text prompt.

## 🐞 Bugs & Refinements

-   **[ ] Performance Optimization**: For pages with a very large number of nested elements, the canvas and layer tree rendering could slow down. Investigate performance bottlenecks and consider optimizations like virtualization for the Layers panel.
-   **[ ] Undo/Redo**: Implement a history stack to allow users to undo and redo actions. This is a critical feature for any editor.
-   **[ ] Accessibility**: Add ARIA attributes to UI controls and ensure keyboard navigability throughout the application.
-   **[ ] Testing**: Introduce a testing framework (like Vitest or Jest) and write unit/integration tests for critical utilities (`treeUtils`, `jsxParser`, etc.) and components.
