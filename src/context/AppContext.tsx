import React, { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Project, AnyCanvasItem, Page, AssetItem, DraggableItemSpec, DndInstruction, IAppContext, ModalState, ComponentCanvasItem, Theme, PackageManager, CMSCollection, JukiPlugin } from "../types";
import { LocalCMS } from "../plugins/cms/LocalCMS";
import { initialProject, defaultTheme } from "../data/initialData";
import { findItemInTree as findItemInTreeUtil } from "../utils/treeUtils";
import { deepClone } from "../utils/coreUtils";
import { parseCodeToCanvasItem, parseComponentFileToCanvasItems } from "../utils/jsxParser";
import { AddComponentFromCodeModal } from "../components/ui/AddComponentFromJsxModal";
import { CreateProjectModal } from "../components/ui/CreateProjectModal";
import { generateRandomTheme } from "../utils/colorUtils";
import { SetPackageManagerModal } from "../components/ui/SetPackageManagerModal";
import { SettingsModal } from "../components/ui/SettingsModal";
import { PluginsModal } from "../components/ui/PluginsModal";
import { exportProjectAsZip } from "../utils/buildUtils";
import { projectClient, pageClient } from "../lib/client";
import { parseNextJsProjectStructure } from "../utils/nextJsStructure";
import { FileEvent } from "../gen/protos/engine_pb";
import { mockEngineClient } from "../mocks/engine";
import { mapProtoToInternal } from "../utils/protoMapper";

export const AppContext = createContext<IAppContext | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [_activeProjectId, _setActiveProjectId] = useState<string | null>(null); // Rename to avoid conflict
    const [activePageId, _setActivePageId] = useState<string | null>(null);
    const [activeLayoutId, _setActiveLayoutId] = useState<string | null>(null);
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
    const [highlightedParentId, setHighlightedParentId] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<"canvas" | "code">("canvas");
    const [modalState, setModalState] = useState<ModalState>(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [cmsCollections, setCmsCollections] = useState<CMSCollection[]>([]);
    const [projectError, setProjectError] = useState<string | null>(null);

    // Plugin State
    const [plugins, setPlugins] = useState<JukiPlugin[]>([]);
    const [availablePlugins] = useState<JukiPlugin[]>([LocalCMS]);

    const installPlugin = async (plugin: JukiPlugin) => {
        if (plugins.find((p) => p.id === plugin.id)) return;
        setPlugins((prev) => [...prev, plugin]);
        // Initialization handled in useEffect
    };

    const uninstallPlugin = (pluginId: string) => {
        setPlugins((prev) => prev.filter((p) => p.id !== pluginId));
        // If it was a CMS, we crude clear for now.
        const plugin = plugins.find((p) => p.id === pluginId);
        if (plugin?.type === "cms") {
            setCmsCollections([]);
        }
    };

    // Handle Plugin Initialization
    useEffect(() => {
        // We need to detect newly added plugins.
        // For simplicity, we can just check if any plugin needs init and hasn't been handled,
        // but since we don't track "inited" state, we might rely on the fact that installPlugin
        // adds it.
        // A better way is: installPlugin sets state, and we perform side effects that don't depend on full 'value' context immediately,
        // OR we just assume onInit doesn't need the FULL context immediately.
        // Given 'value' is constructed every render, this is tricky.

        // Let's defer onInit to when the plugin is actually *used* or rendered?
        // No, onInit might register things.

        // Alternative: Pass a *subset* of capabilities to onInit, or pass a reference to the context.
        // Ideally, plugins shouldn't need the context *root* to init, but maybe access to specific APIs.

        // For now, let's handle the CMS loading here directly as it only depends on the plugin itself.
        plugins.forEach(async (p) => {
            // If it's a CMS and we haven't loaded data (simplified check: empty collections?)
            if (p.type === "cms" && p.getCollections && cmsCollections.length === 0) {
                const collections = await p.getCollections();
                setCmsCollections((prev) => {
                    // Avoid duplicates
                    if (prev.length > 0) return prev;
                    return collections;
                });
            }
        });
    }, [plugins]);

    // CMS Initialization (Legacy removed)
    // useEffect(() => { ... }, []);

    // Load projects from API on initial mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = (await projectClient.listProjects({})) as any;
                // ... (rest of mapping logic is fine, assuming it uses setProjects)
                const mappedProjects: Project[] = (response.projects || []).map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    apiKey: p.apiKey,
                    settings: p.settings,
                    pages: (p.pages || []).map((page: any) => ({
                        ...page,
                        props: {},
                        children: page.content ? JSON.parse(page.content) : [],
                    })),
                    userComponents: (p.userComponents || []).map((c: any) => ({
                        id: c.id,
                        name: c.name,
                        root: c.content ? JSON.parse(c.content) : null,
                    })),
                    theme: defaultTheme,
                    packages: [],
                    packageManager: null,
                    modules: [],
                    templates: [],
                    layouts: [],
                    assetLibrary: [],
                    apiDefinitions: [],
                    stateDefinitions: [],
                }));

                setProjects(mappedProjects);

                if (mappedProjects.length > 0) {
                    const lastActiveProjectId = localStorage.getItem("juki-active-project-id");
                    const projectToActivate = mappedProjects.find((p) => p.id === lastActiveProjectId) || mappedProjects[0];
                    _setActiveProjectId(projectToActivate.id);

                    const lastActivePageId = localStorage.getItem("juki-active-page-id");
                    const pageToActivate = projectToActivate.pages.find((p) => p.id === lastActivePageId) || projectToActivate.pages[0];
                    setActivePageId(pageToActivate?.id || null);
                }
            } catch (error) {
                console.error("Failed to load projects from API", error);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (_activeProjectId) {
            localStorage.setItem("juki-active-project-id", _activeProjectId);
        }
        if (activePageId) {
            localStorage.setItem("juki-active-page-id", activePageId);
        }
    }, [_activeProjectId, activePageId]);

    const activeProjectId = _activeProjectId; // Alias for easier usage

    const activeProject = projects.find((p) => p.id === activeProjectId);

    // Logic to select either the Active Page or the Active Layout (proxied as a page)
    const realActivePage = activeProject?.pages.find((p) => p.id === activePageId);
    const activeLayout = activeProject?.layouts?.find((l) => l.id === activeLayoutId);

    const activePage =
        realActivePage ||
        (activeLayout
            ? ({
                  id: activeLayout.id,
                  name: activeLayout.name,
                  description: "Layout",
                  route: "",
                  props: { className: "min-h-screen bg-transparent" }, // Layout wrapper styling
                  children: [activeLayout.root], // Wrap root in array
                  content: undefined,
              } as Page)
            : undefined);

    const setActivePageId = (id: string | null) => {
        _setActivePageId(id);
        if (id) _setActiveLayoutId(null);
    };

    const setActiveLayoutId = (id: string | null) => {
        _setActiveLayoutId(id);
        if (id) _setActivePageId(null);
    };

    const findItemInTree = useCallback((itemId: string, tree: AnyCanvasItem[]) => {
        return findItemInTreeUtil(itemId, tree);
    }, []);

    // Effect to update the highlighted parent when selection changes
    useEffect(() => {
        if (selectedItemIds.length > 0 && activePage) {
            const lastSelectedId = selectedItemIds[selectedItemIds.length - 1];
            const result = findItemInTree(lastSelectedId, activePage.children);
            const parentId = result?.parentItem?.id || null;
            setHighlightedParentId(parentId);
        } else {
            setHighlightedParentId(null);
        }
    }, [selectedItemIds, activePage, findItemInTree]);

    const refreshProjects = async () => {
        try {
            if (true) {
                const response = await mockEngineClient.listProjects();
                const mappedProjects = response.projects.map(mapProtoToInternal);
                setProjects(mappedProjects);
                return;
            }

            const response = (await projectClient.listProjects({ page: 1, pageSize: 10 })) as any;
            const mappedProjects: Project[] = (response.projects || []).map((p: any) => ({
                id: p.id,
                name: p.name,
                description: p.description,
                settings: { useTypescript: true, framework: p.framework || "NextJS" }, // Default settings for now
                rootRoute: { id: "root", name: "Root", segment: "/", fullPath: "/", type: "STATIC", children: [] },
                pages: [],
                userComponents: [],
                assetLibrary: [],
                theme: defaultTheme,
                packages: [],
                packageManager: "npm",
                modules: [],
                templates: [],
                layouts: [],
                apiDefinitions: [],
                stateDefinitions: [],
            }));
            setProjects(mappedProjects);
        } catch (e) {
            console.error("Failed to list projects", e);
        }
    };

    const modifyProject = (projectId: string, updateFn: (project: Project) => Project) => {
        setProjects((prevProjects) => prevProjects.map((p) => (p.id === projectId ? updateFn(p) : p)));
    };

    const setActiveProjectId = async (id: string | null) => {
        _setActiveProjectId(id);
        if (id) {
            try {
                // MOCK MODE: Intercept specific ID or all calls for now
                if (true) {
                    // TODO: Check feature flag or ID convention
                    const protoProject = await mockEngineClient.getProject(id!);
                    const project = mapProtoToInternal(protoProject);

                    setProjects((prev) => {
                        const exists = prev.some((p) => p.id === project.id);
                        if (exists) {
                            return prev.map((p) => (p.id === project.id ? project : p));
                        }
                        return [...prev, project];
                    });
                    return;
                }

                const response = (await projectClient.getProject({ id: id! })) as any;
                if (!response.project) throw new Error("No project returned from API");

                // Map protobuf project to our internal Project type
                const project: Project = {
                    id: response.project.id,
                    name: response.project.name,
                    description: response.project.description,
                    apiKey: response.project.apiKey,
                    settings: { useTypescript: true, framework: response.project.framework || "NextJS" },
                    rootRoute: { id: "root", name: "Root", segment: "/", fullPath: "/", type: "STATIC", children: [] }, // Fallback for list
                    pages: [], // Pages are loaded separately or need to be mapped if returned
                    userComponents: [],
                    assetLibrary: [],
                    theme: defaultTheme,
                    packages: [],
                    packageManager: "npm",
                    modules: [],
                    templates: [],
                    layouts: [],
                    apiDefinitions: [],
                    stateDefinitions: [],
                };

                setProjects((prev) => {
                    const exists = prev.some((p) => p.id === project.id);
                    if (exists) {
                        return prev.map((p) => (p.id === project.id ? project : p));
                    }
                    return [...prev, project];
                });
            } catch (e: any) {
                console.error("Failed to get project details", e);
                if (e.message && (e.message.includes("not found") || e.message.includes("no such file"))) {
                    setProjectError("Project not found in database or disk.");
                } else {
                    setProjectError(`Failed to load project: ${e.message}`);
                }
            }
        }
    };

    const syncProject = async () => {
        if (activeProjectId) {
            try {
                const response = (await projectClient.syncProject({ id: activeProjectId })) as any;
                if (response.project) {
                    setProjectError(null); // Clear error on success
                    const syncedProject = response.project;

                    // Prepare input for the parser
                    const rawInputs = (syncedProject.pages || []).map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        route: p.route,
                        // Proto might name it rawContent or content depending on version. We handle both.
                        content: p.content,
                        rawContent: p.rawContent,
                        path: p.path || p.name, // Fallback to name if path missing
                    }));

                    const { pages, layouts } = parseNextJsProjectStructure(rawInputs);

                    // Update the projects list and active project
                    setProjects((prev) =>
                        prev.map((p) =>
                            p.id === activeProjectId
                                ? {
                                      ...p,
                                      name: syncedProject.name,
                                      description: syncedProject.description,
                                      apiKey: syncedProject.apiKey,
                                      settings: { ...p.settings, framework: syncedProject.framework || "NextJS" },
                                      pages: pages,
                                      layouts: layouts,
                                  }
                                : p
                        )
                    );

                    console.log("Project synced successfully via file watcher");
                }
            } catch (e: any) {
                console.error("Failed to sync project", e);
                // Detect missing directory error or generic sync failure
                // gRPC errors often have messages like "project path is empty" or file system errors
                if (e.message && (e.message.includes("no such file") || e.message.includes("does not exist") || e.message.includes("project path is empty"))) {
                    setProjectError("Project directory not found on disk. It may have been deleted.");
                } else if (e.message && e.message.includes("path")) {
                    // Fallback for path related errors
                    setProjectError("Project path invalid or inaccessible.");
                }
            }
        }
    };

    // File Watcher Subscription
    useEffect(() => {
        if (!activeProjectId) return;

        const abortController = new AbortController();

        const subscribe = async () => {
            try {
                console.log("Subscribing to file events for project:", activeProjectId);
                const stream = (await projectClient.subscribeToFileEvents({ projectId: activeProjectId }, { signal: abortController.signal })) as AsyncIterable<FileEvent>;

                for await (const event of stream) {
                    console.log("File Event Received:", event);
                    // Trigger sync
                    // We could be smarter and only sync if the file is relevant (e.g. page.tsx)
                    // But syncProject is relatively cheap for now.
                    // Ideally we debounce this.
                    syncProject();
                }
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error("File subscription error:", err);
                }
            }
        };

        subscribe();

        return () => {
            abortController.abort();
        };
    }, [activeProjectId]); // syncProject is stable enough or captured?
    // Actually syncProject depends on activeProjectId, so it changes when activeProjectId changes.
    // But we are re-subscribing when activeProjectId changes anyway.
    // So capturing the current syncProject closure is fine.

    const addProject = async (name: string, description: string, githubUrl?: string, initialData?: { theme?: Theme; pages?: Page[] }) => {
        try {
            const response = (await projectClient.createProject({
                name,
                description,
                // settings: ... // Not in proto
                framework: "NextJS", // Proto has framework
            })) as any;

            if (!response.project) throw new Error("No project returned from API");

            const newProject: Project = {
                id: response.project.id,
                name: response.project.name,
                description: "", // Proto Project has no description
                settings: { useTypescript: true, framework: response.project.framework || "NextJS" },
                rootRoute: { id: "root", name: "Root", segment: "/", fullPath: "/", type: "STATIC", children: [] },
                pages: initialData?.pages || [], // Use initial pages if provided
                userComponents: [],
                theme: initialData?.theme || defaultTheme, // Use initial theme if provided
                packages: [],
                packageManager: null,
                modules: [],
                templates: [],
                layouts: [],
                assetLibrary: [],
                apiDefinitions: [],
                stateDefinitions: [],
            };

            // If no pages provided, maybe create a default one?
            // The engine might have created files, but we are managing state here.
            // If initialData.pages is empty, we might want a default page.
            if (newProject.pages.length === 0) {
                // Optional: Add default page
            }

            setProjects((prev) => [...prev, newProject]);
            setActiveProjectId(newProject.id);
            return newProject.id;
        } catch (error) {
            console.error("Failed to create project", error);
            alert("Failed to create project");
            return null;
        }
    };

    const updateProject = async (project: Project) => {
        try {
            await projectClient.updateProject({
                project: {
                    id: project.id,
                    name: project.name,
                    description: project.description,
                    path: project.path || "",
                    framework: project.settings.framework,
                    apiKey: project.apiKey,
                },
            });

            // Update local state
            setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));
        } catch (e) {
            console.error("Failed to update project", e);
            alert("Failed to update project settings");
        }
    };

    const exportProject = () => {
        if (activeProject) {
            exportProjectAsZip(activeProject);
        } else {
            alert("No active project to export.");
        }
    };

    const addPage = async (name: string, description: string, route: string) => {
        if (!activeProjectId) return;
        try {
            // We need to pass project_id to createPage, but the proto CreatePageRequest doesn't have it?
            // Wait, I checked page.proto, CreatePageRequest has name, type, access.
            // It DOES NOT have project_id. This is a flaw in my design.
            // I should have added project_id to CreatePageRequest.
            // For now, I can't implement this correctly without updating the backend.
            // I'll stick to local update for now and mark this as a TODO/Blocker.

            // FALLBACK: Local update for now until API is fixed
            const newPage: Page = {
                id: crypto.randomUUID(),
                name,
                description,
                route,
                props: { className: "min-h-screen bg-[var(--juki-color-background)]" },
                children: [],
            };
            modifyProject(activeProjectId, (project) => ({
                ...project,
                pages: [...project.pages, newPage],
            }));
            setActivePageId(newPage.id);
        } catch (e) {
            console.error(e);
        }
    };

    const updatePage = (pageId: string, updates: Partial<Omit<Page, "id" | "children" | "customCss">> & { customCss?: string }) => {
        if (!activeProjectId) return;
        modifyProject(activeProjectId, (project) => ({
            ...project,
            pages: project.pages.map((p) => (p.id === pageId ? { ...p, ...updates } : p)),
        }));
    };

    const updatePageFromCode = (code: string) => {
        if (!activePageId) return;
        try {
            const newChildren = parseComponentFileToCanvasItems(code);
            modifyActivePage((page) => ({
                ...page,
                children: newChildren,
            }));
        } catch (e) {
            alert(`Failed to sync from code: ${(e as Error).message}`);
        }
    };

    const deletePage = (pageId: string) => {
        if (!activeProjectId) return;
        modifyProject(activeProjectId, (project) => {
            const newPages = project.pages.filter((p) => p.id !== pageId);
            if (activePageId === pageId) {
                setActivePageId(newPages[0]?.id || null);
            }
            return { ...project, pages: newPages };
        });
    };

    const modifyActivePage = (updateFn: (page: Page) => Page) => {
        if (!activeProjectId || !activePageId) return;
        modifyProject(activeProjectId, (project) => ({
            ...project,
            pages: project.pages.map((p) => (p.id === activePageId ? updateFn(p) : p)),
        }));
    };

    const addItem = (parentId: string | null, itemSpec: DraggableItemSpec, index: number = -1) => {
        const newItem: AnyCanvasItem = {
            ...itemSpec.item,
            id: crypto.randomUUID(),
            name: itemSpec.name,
        } as AnyCanvasItem;

        modifyActivePage((page) => {
            const newPage = deepClone(page);
            if (!parentId) {
                if (index === -1) newPage.children.push(newItem);
                else newPage.children.splice(index, 0, newItem);
                return newPage;
            }

            const result = findItemInTree(parentId, newPage.children);
            if (result && result.item.type === "ELEMENT" && !result.item.locked) {
                if (!Array.isArray(result.item.content)) {
                    result.item.content = [];
                }
                if (index === -1) result.item.content.push(newItem);
                else result.item.content.splice(index, 0, newItem);
            }
            return newPage;
        });
    };

    const addItemsToPage = (items: AnyCanvasItem[]) => {
        if (!activePageId) return;
        modifyActivePage((page) => ({
            ...page,
            children: [...page.children, ...items],
        }));
    };

    const updateItem = (itemId: string, updates: Partial<AnyCanvasItem>) => {
        modifyActivePage((page) => {
            const newPage = deepClone(page);
            const result = findItemInTree(itemId, newPage.children);
            if (result && !result.item.locked) {
                Object.assign(result.item, updates);
            }
            return newPage;
        });
    };

    const toggleItemLock = (itemId: string) => {
        modifyActivePage((page) => {
            const newPage = deepClone(page);
            const result = findItemInTree(itemId, newPage.children);
            if (result) {
                result.item.locked = !result.item.locked;
            }
            return newPage;
        });
    };

    const deleteItem = (itemId: string) => {
        setSelectedItemIds((prev) => prev.filter((id) => id !== itemId));
        modifyActivePage((page) => {
            const newPage = deepClone(page);
            const result = findItemInTree(itemId, newPage.children);
            if (result && !result.item.locked) {
                result.parentArray.splice(result.index, 1);
            }
            return newPage;
        });
    };

    const moveItem = (itemId: string, destId: string | null, instruction: DndInstruction) => {
        modifyActivePage((page) => {
            const newPage = deepClone(page);
            const sourceResult = findItemInTree(itemId, newPage.children);
            if (!sourceResult || sourceResult.item.locked) return page;

            const [itemToMove] = sourceResult.parentArray.splice(sourceResult.index, 1);
            if (!itemToMove) return page;

            if (!destId) {
                // Dropped on canvas root
                newPage.children.push(itemToMove);
                return newPage;
            }

            const destResult = findItemInTree(destId, newPage.children);
            if (!destResult) {
                sourceResult.parentArray.splice(sourceResult.index, 0, itemToMove);
                return page;
            }

            if (instruction.type === "make-child") {
                if (destResult.item.type === "ELEMENT" && !destResult.item.locked) {
                    if (!Array.isArray(destResult.item.content)) destResult.item.content = [];
                    destResult.item.content.push(itemToMove);
                } else {
                    // Invalid drop target (e.g. locked or not a container), put it back
                    sourceResult.parentArray.splice(sourceResult.index, 0, itemToMove);
                }
            } else if (instruction.type === "reorder-before") {
                destResult.parentArray.splice(destResult.index, 0, itemToMove);
            } else if (instruction.type === "reorder-after") {
                destResult.parentArray.splice(destResult.index + 1, 0, itemToMove);
            }
            return newPage;
        });
    };

    const setSelectedItemId = (itemId: string) => setSelectedItemIds([itemId]);
    const addSelectedItem = (itemId: string) => setSelectedItemIds((prev) => [...prev, itemId]);
    const clearSelection = () => setSelectedItemIds([]);

    const addComponentFromCode = (name: string, description: string, code: string, type: "jsx" | "html") => {
        if (!activeProjectId) return;
        try {
            const root = parseCodeToCanvasItem(code, type);
            if (root) {
                const newComponent = { id: crypto.randomUUID(), name, description, root };
                modifyProject(activeProjectId, (project) => ({
                    ...project,
                    userComponents: [...project.userComponents, newComponent],
                }));
            }
        } catch (e) {
            alert(`Failed to add component: ${(e as Error).message}`);
        }
    };

    const createComponentFromSelection = (name: string, description: string) => {
        if (!activeProjectId || !activePage || selectedItemIds.length !== 1) return;
        const sourceId = selectedItemIds[0];
        const result = findItemInTree(sourceId, activePage.children);
        if (!result) return;

        const newComponent = {
            id: crypto.randomUUID(),
            name,
            description,
            root: deepClone(result.item),
        };

        modifyProject(activeProjectId, (project) => ({
            ...project,
            userComponents: [...project.userComponents, newComponent],
        }));

        const newInstance: ComponentCanvasItem = {
            id: crypto.randomUUID(),
            name: newComponent.name,
            type: "COMPONENT",
            componentType: newComponent.id,
            props: {},
        };

        modifyActivePage((page) => {
            const newPage = deepClone(page);
            const resultToReplace = findItemInTree(sourceId, newPage.children);
            if (resultToReplace) {
                resultToReplace.parentArray[resultToReplace.index] = newInstance;
            }
            return newPage;
        });
        setSelectedItemIds([newInstance.id]);
    };

    const addAsset = (asset: AssetItem) => {
        if (!activeProjectId) return;
        modifyProject(activeProjectId, (project) => ({
            ...project,
            assetLibrary: [...project.assetLibrary, asset],
        }));
    };

    const updateProjectTheme = (theme: Theme) => {
        if (!activeProjectId) return;
        modifyProject(activeProjectId, (project) => ({
            ...project,
            theme,
        }));
    };

    const setPackageManager = (manager: PackageManager) => {
        if (!activeProjectId) return;
        modifyProject(activeProjectId, (project) => ({
            ...project,
            packageManager: manager,
        }));
    };

    const addPackage = (packageName: string) => {
        if (!activeProjectId) return;
        modifyProject(activeProjectId, (project) => {
            if (project.packages.some((p) => p.name === packageName)) {
                return project; // Avoid duplicates
            }
            const newPackage = { name: packageName, version: "latest" };
            return {
                ...project,
                packages: [...project.packages, newPackage],
            };
        });
    };

    const removePackage = (packageName: string) => {
        if (!activeProjectId) return;
        modifyProject(activeProjectId, (project) => ({
            ...project,
            packages: project.packages.filter((p) => p.name !== packageName),
        }));
    };

    const deleteProject = async (projectId: string) => {
        try {
            await projectClient.deleteProject({ id: projectId });
        } catch (e: any) {
            console.error("Failed to delete project from backend", e);
            // If the error is "not found" or file system error, we should still remove it from the UI
            const isMissing = e.message && (e.message.includes("not found") || e.message.includes("no such file") || e.message.includes("does not exist"));

            if (!isMissing) {
                alert("Failed to delete project: " + e.message);
                return; // Don't remove from UI if it was a genuine other error
            }
        }

        // Remove from local state regardless if it succeeded or failed due to being missing
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        if (activeProjectId === projectId) {
            _setActiveProjectId(null);
            setProjectError(null);
            localStorage.removeItem("juki-active-project-id");
        }
    };

    const openModal = (state: NonNullable<ModalState>) => setModalState(state);
    const closeModal = () => setModalState(null);

    const value: IAppContext = {
        projects,
        activeProjectId,
        activePageId,
        activeLayoutId,
        selectedItemIds,
        highlightedParentId,
        activeView,
        modalState,
        isPreviewMode,
        cmsCollections,
        projectError,

        plugins,
        availablePlugins,
        installPlugin,
        uninstallPlugin,

        activeProject,
        activePage,
        selectedItems: [], // This could be derived if needed
        addProject,
        updateProject,
        deleteProject,
        setActiveProjectId,
        exportProject,
        addPage,
        updatePage,
        updatePageFromCode,
        deletePage,
        setActivePageId,
        setActiveLayoutId,
        addItem,
        addItemsToPage,
        updateItem,
        deleteItem,
        toggleItemLock,
        moveItem,
        findItemInTree,
        setSelectedItemId,
        addSelectedItem,
        clearSelection,
        addComponentFromCode,
        createComponentFromSelection,
        addAsset,
        updateProjectTheme,
        setPackageManager,
        addPackage,
        removePackage,
        setActiveView,
        enterPreviewMode: () => setIsPreviewMode(true),
        exitPreviewMode: () => setIsPreviewMode(false),
        openModal,
        closeModal,
        syncProject,
        publishPage: async () => {
            if (!activeProjectId || !activePageId || !activePage || !activeProject) return;
            try {
                const { generatePageComponent } = await import("../utils/jsxGenerator");

                const code = generatePageComponent(activePage, activeProject);

                const response = (await projectClient.savePage({
                    projectId: activeProjectId,
                    pageId: activePageId,
                    content: code,
                })) as any;

                if (response.success) {
                    alert("Page published successfully!");
                } else {
                    alert(`Failed to publish page: ${response.message}`);
                }
            } catch (e) {
                console.error("Publish failed", e);
                alert("Publish failed: " + (e as Error).message);
            }
        },
        buildProject: async () => {
            if (!activeProjectId) return;
            try {
                const response = (await projectClient.buildProject({ projectId: activeProjectId })) as any;
                if (response.success) {
                    alert("Build successful!\n\n" + response.output);
                } else {
                    alert("Build failed!\n\n" + response.output);
                }
            } catch (e) {
                console.error("Build failed", e);
                alert("Build failed: " + (e as Error).message);
            }
        },
    };

    return (
        <AppContext.Provider value={value}>
            {children}
            {/* Render modals globally here */}
            <AddComponentFromCodeModal />
            <CreateProjectModal />
            <SetPackageManagerModal />
            <SettingsModal />
            <PluginsModal />
        </AppContext.Provider>
    );
};
