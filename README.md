# Juki Editor

**Juki Editor** is the visual frontend for the Juki Builder platform. It provides a comprehensive WYSIWYG environment for creating React and Next.js applications.

## Overview

The editor is a single-page React application built with Vite. It allows developers to:
- **Visually construct UIs**: Drag and drop elements to build pages.
- **Manage State**: Define and bind global state variables.
- **Generate Components**: Use Gemini AI to generate React components from text descriptions.
- **Export Code**: Get clean, production-ready JSX code.

## Technology Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: `@atlaskit/pragmatic-drag-and-drop`
- **AI**: Google Gemini API (`@google/genai`)
- **Code Editor**: Monaco Editor

## Setup & Development

To run the editor independently:

1.  Navigate to the editor directory:
    ```bash
    cd .juki/editor
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

3.  Start the development server:
    ```bash
    pnpm dev
    ```
    The editor will be available at `http://localhost:8889`.

## Architecture Highlights

- **Data Model**: The entire application state is driven by a normalized JSON structure (Project, PageItem, AnyCanvasItem).
- **Rendering**: A recursive rendering pipeline converts the JSON state into live React components on the canvas.
- **Persistence**: Projects are currently persisted to `localStorage` (MVP) but are designed to sync with the Juki Engine.
