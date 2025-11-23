import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Project, AnyCanvasItem, Page, AssetItem, DraggableItemSpec, DndInstruction, IAppContext, ModalState, ComponentCanvasItem, Theme, PackageManager } from '../types';
import { initialProject, defaultTheme } from '../data/initialData';
import { findItemInTree as findItemInTreeUtil } from '../utils/treeUtils';
import { deepClone } from '../utils/coreUtils';
import { parseCodeToCanvasItem, parseComponentFileToCanvasItems } from '../utils/jsxParser';
import { AddComponentFromCodeModal } from '../components/ui/AddComponentFromJsxModal';
import { CreateProjectModal } from '../components/ui/CreateProjectModal';
import { generateRandomTheme } from '../utils/colorUtils';
import { SetPackageManagerModal } from '../components/ui/SetPackageManagerModal';
import { exportProjectAsZip } from '../utils/buildUtils';

export const AppContext = createContext<IAppContext | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [activePageId, setActivePageId] = useState<string | null>(null);
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
    const [highlightedParentId, setHighlightedParentId] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<'canvas' | 'code'>('canvas');
    const [modalState, setModalState] = useState<ModalState>(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    // Load projects from localStorage on initial mount
    useEffect(() => {
        try {
            const savedProjects = localStorage.getItem('juki-projects');
            if (savedProjects) {
                let parsedProjects: Project[] = JSON.parse(savedProjects);
                
                // Migration steps for older project structures
                parsedProjects = parsedProjects.map(p => {
                    if (!p.theme) p.theme = generateRandomTheme(defaultTheme);
                    if (!p.theme.importedFonts) p.theme.importedFonts = [];
                    if (!p.packages) p.packages = [];
                    if (!p.packageManager) p.packageManager = null;
                    return p;
                });

                if (parsedProjects.length > 0) {
                    setProjects(parsedProjects);
                    const lastActiveProjectId = localStorage.getItem('juki-active-project-id');
                    const lastActivePageId = localStorage.getItem('juki-active-page-id');
                    
                    const projectToActivate = parsedProjects.find(p => p.id === lastActiveProjectId) || parsedProjects[0];
                    setActiveProjectId(projectToActivate.id);
                    
                    const pageToActivate = projectToActivate.pages.find(p => p.id === lastActivePageId) || projectToActivate.pages[0];
                    setActivePageId(pageToActivate?.id || null);
                }
            }
        } catch (error) {
            console.error("Failed to load projects from localStorage", error);
        }
    }, []);

    // Save projects to localStorage whenever they change
    useEffect(() => {
        if (projects.length > 0) {
            localStorage.setItem('juki-projects', JSON.stringify(projects));
        } else {
            localStorage.removeItem('juki-projects');
        }
    }, [projects]);

    useEffect(() => {
        if (activeProjectId) {
            localStorage.setItem('juki-active-project-id', activeProjectId);
        }
        if (activePageId) {
             localStorage.setItem('juki-active-page-id', activePageId);
        }
    }, [activeProjectId, activePageId]);

    const activeProject = projects.find(p => p.id === activeProjectId);
    const activePage = activeProject?.pages.find(p => p.id === activePageId);
    
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

    const modifyProject = (projectId: string, updateFn: (project: Project) => Project) => {
        setProjects(prevProjects =>
            prevProjects.map(p => (p.id === projectId ? updateFn(p) : p))
        );
    };

    const addProject = (name: string, description: string, githubUrl?: string) => {
        const newProject: Project = {
            ...deepClone(initialProject),
            id: crypto.randomUUID(),
            name,
            description,
            theme: generateRandomTheme(defaultTheme),
            // You can store githubUrl somewhere if needed
        };
        newProject.pages[0].id = crypto.randomUUID();
        setProjects(prev => [...prev, newProject]);
        setActiveProjectId(newProject.id);
        setActivePageId(newProject.pages[0].id);
    };
    
    const exportProject = () => {
        if (activeProject) {
            exportProjectAsZip(activeProject);
        } else {
            alert("No active project to export.");
        }
    };

    const addPage = (name: string, description: string, route: string) => {
        if (!activeProjectId) return;
        const newPage: Page = {
            id: crypto.randomUUID(),
            name,
            description,
            route,
            props: { className: "min-h-screen bg-[var(--juki-color-background)]" },
            children: [],
        };
        modifyProject(activeProjectId, project => ({
            ...project,
            pages: [...project.pages, newPage],
        }));
        setActivePageId(newPage.id);
    };

    const updatePage = (pageId: string, updates: Partial<Omit<Page, 'id' | 'children'>>) => {
        if (!activeProjectId) return;
        modifyProject(activeProjectId, project => ({
            ...project,
            pages: project.pages.map(p => p.id === pageId ? { ...p, ...updates } : p)
        }));
    };
    
    const updatePageFromCode = (code: string) => {
        if (!activePageId) return;
        try {
            const newChildren = parseComponentFileToCanvasItems(code);
            modifyActivePage(page => ({
                ...page,
                children: newChildren
            }));
        } catch (e) {
            alert(`Failed to sync from code: ${(e as Error).message}`);
        }
    };

    const deletePage = (pageId: string) => {
        if (!activeProjectId) return;
        modifyProject(activeProjectId, project => {
            const newPages = project.pages.filter(p => p.id !== pageId);
            if (activePageId === pageId) {
                setActivePageId(newPages[0]?.id || null);
            }
            return { ...project, pages: newPages };
        });
    };
    
    const modifyActivePage = (updateFn: (page: Page) => Page) => {
        if (!activeProjectId || !activePageId) return;
        modifyProject(activeProjectId, project => ({
            ...project,
            pages: project.pages.map(p => (p.id === activePageId ? updateFn(p) : p))
        }));
    };
    
    const addItem = (parentId: string | null, itemSpec: DraggableItemSpec, index: number = -1) => {
        const newItem: AnyCanvasItem = {
            ...itemSpec.item,
            id: crypto.randomUUID(),
            name: itemSpec.name,
        } as AnyCanvasItem;

        modifyActivePage(page => {
            const newPage = deepClone(page);
            if (!parentId) {
                if (index === -1) newPage.children.push(newItem);
                else newPage.children.splice(index, 0, newItem);
                return newPage;
            }
            
            const result = findItemInTree(parentId, newPage.children);
            if (result && result.item.type === 'ELEMENT' && !result.item.locked) {
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
        modifyActivePage(page => ({
            ...page,
            children: [...page.children, ...items],
        }));
    };

    const updateItem = (itemId: string, updates: Partial<AnyCanvasItem>) => {
        modifyActivePage(page => {
            const newPage = deepClone(page);
            const result = findItemInTree(itemId, newPage.children);
            if (result && !result.item.locked) {
                Object.assign(result.item, updates);
            }
            return newPage;
        });
    };
    
    const toggleItemLock = (itemId: string) => {
        modifyActivePage(page => {
            const newPage = deepClone(page);
            const result = findItemInTree(itemId, newPage.children);
            if (result) {
                result.item.locked = !result.item.locked;
            }
            return newPage;
        });
    };

    const deleteItem = (itemId: string) => {
        setSelectedItemIds(prev => prev.filter(id => id !== itemId));
        modifyActivePage(page => {
            const newPage = deepClone(page);
            const result = findItemInTree(itemId, newPage.children);
            if (result && !result.item.locked) {
                result.parentArray.splice(result.index, 1);
            }
            return newPage;
        });
    };
    
    const moveItem = (itemId: string, destId: string | null, instruction: DndInstruction) => {
        modifyActivePage(page => {
            const newPage = deepClone(page);
            const sourceResult = findItemInTree(itemId, newPage.children);
            if (!sourceResult || sourceResult.item.locked) return page;

            const [itemToMove] = sourceResult.parentArray.splice(sourceResult.index, 1);
            if (!itemToMove) return page;
            
            if (!destId) { // Dropped on canvas root
                newPage.children.push(itemToMove);
                return newPage;
            }
            
            const destResult = findItemInTree(destId, newPage.children);
            if (!destResult) {
                 sourceResult.parentArray.splice(sourceResult.index, 0, itemToMove);
                 return page;
            };

            if (instruction.type === 'make-child') {
                if (destResult.item.type === 'ELEMENT' && !destResult.item.locked) {
                    if (!Array.isArray(destResult.item.content)) destResult.item.content = [];
                    destResult.item.content.push(itemToMove);
                } else {
                    // Invalid drop target (e.g. locked or not a container), put it back
                    sourceResult.parentArray.splice(sourceResult.index, 0, itemToMove);
                }
            } else if (instruction.type === 'reorder-before') {
                destResult.parentArray.splice(destResult.index, 0, itemToMove);
            } else if (instruction.type === 'reorder-after') {
                destResult.parentArray.splice(destResult.index + 1, 0, itemToMove);
            }
            return newPage;
        });
    };

    const setSelectedItemId = (itemId: string) => setSelectedItemIds([itemId]);
    const addSelectedItem = (itemId: string) => setSelectedItemIds(prev => [...prev, itemId]);
    const clearSelection = () => setSelectedItemIds([]);

    const addComponentFromCode = (name: string, description: string, code: string, type: 'jsx' | 'html') => {
        if (!activeProjectId) return;
        try {
            const root = parseCodeToCanvasItem(code, type);
            if (root) {
                const newComponent = { id: crypto.randomUUID(), name, description, root };
                modifyProject(activeProjectId, project => ({
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
            root: deepClone(result.item)
        };

        modifyProject(activeProjectId, project => ({
            ...project,
            userComponents: [...project.userComponents, newComponent],
        }));
        
        const newInstance: ComponentCanvasItem = {
            id: crypto.randomUUID(),
            name: newComponent.name,
            type: 'COMPONENT',
            componentType: newComponent.id,
            props: {}
        };

        modifyActivePage(page => {
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
        modifyProject(activeProjectId, project => ({
            ...project,
            assetLibrary: [...project.assetLibrary, asset]
        }));
    };
    
    const updateProjectTheme = (theme: Theme) => {
        if (!activeProjectId) return;
        modifyProject(activeProjectId, project => ({
            ...project,
            theme,
        }));
    };

    const setPackageManager = (manager: PackageManager) => {
        if (!activeProjectId) return;
        modifyProject(activeProjectId, project => ({
            ...project,
            packageManager: manager,
        }));
    };

    const addPackage = (packageName: string) => {
        if (!activeProjectId) return;
        modifyProject(activeProjectId, project => {
            if (project.packages.some(p => p.name === packageName)) {
                return project; // Avoid duplicates
            }
            const newPackage = { name: packageName, version: 'latest' };
            return {
                ...project,
                packages: [...project.packages, newPackage],
            };
        });
    };

    const removePackage = (packageName: string) => {
        if (!activeProjectId) return;
        modifyProject(activeProjectId, project => ({
            ...project,
            packages: project.packages.filter(p => p.name !== packageName),
        }));
    };

    const openModal = (state: NonNullable<ModalState>) => setModalState(state);
    const closeModal = () => setModalState(null);

    const value: IAppContext = {
        projects,
        activeProjectId,
        activePageId,
        selectedItemIds,
        highlightedParentId,
        activeView,
        modalState,
        isPreviewMode,
        activeProject,
        activePage,
        selectedItems: [], // This could be derived if needed
        addProject,
        setActiveProjectId,
        exportProject,
        addPage,
        updatePage,
        updatePageFromCode,
        deletePage,
        setActivePageId,
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
    };

    return (
        <AppContext.Provider value={value}>
            {children}
            {/* Render modals globally here */}
            <AddComponentFromCodeModal />
            <CreateProjectModal />
            <SetPackageManagerModal />
        </AppContext.Provider>
    );
};