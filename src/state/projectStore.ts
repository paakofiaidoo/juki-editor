import { create } from 'zustand';

interface NextJSProjectConfig {
  UseTypeScript: boolean;
  UseESLint: boolean;
  UseTailwindCSS: boolean;
  UseSrcDirectory: boolean;
  UseAppRouter: boolean;
  UseTurbopack: boolean;
  CustomizeImportAlias: boolean;
  ImportAlias: string;
}

export interface Project {
  Name: string;
  Description: string;
  Framework: string;
  NextJSConfig: NextJSProjectConfig;
}

interface ProjectState {
  project: Project | null;
  getProject: (projectName: string) => Promise<void>;
  createProject: (project: Project) => Promise<void>;
}

// @ts-ignore
const ENGINE_API_URL = import.meta.env.VITE_ENGINE_API_URL;

const defaultProject: Project = {
  Name: '',
  Description: '',
  Framework: 'nextjs',
  NextJSConfig: {
    UseTypeScript: true,
    UseESLint: true,
    UseTailwindCSS: true,
    UseSrcDirectory: true,
    UseAppRouter: true,
    UseTurbopack: false,
    CustomizeImportAlias: false,
    ImportAlias: '@',
  },
};

export const useProjectStore = create<ProjectState>((set) => ({
  project: defaultProject,
  getProject: async (projectName: string) => {
    try {
      const response = await fetch(`${ENGINE_API_URL}/projects/${projectName}`);
      if (!response.ok) {
        throw new Error('Failed to get project');
      }
      const data: Project = await response.json();
      set({ project: data });
    } catch (error) {
      console.error('Error fetching project:', error);
      set({ project: null });
    }
  },
  createProject: async (project: Project) => {
    try {
      const response = await fetch(`${ENGINE_API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      const data: Project = await response.json();
      set({ project: data });
    } catch (error) {
      console.error('Error creating project:', error);
      set({ project: null });
    }
  },
}));