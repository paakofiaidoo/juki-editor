export interface NextJSProjectConfig {
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
  name: string;
  description: string;
  framework: string;
  nextJSConfig: NextJSProjectConfig;
}

const ENGINE_URL = import.meta.env.VITE_ENGINE_URL || "http://localhost:8080";

export const checkServer = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${ENGINE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error("Error checking server health:", error);
    return false;
  }
};

export const getProject = async (): Promise<Project | null> => {
  try {
    const response = await fetch(`${ENGINE_URL}/project`);
    if (!response.ok) {
      return null;
    }
    const project: Project = await response.json();
    return project;
  } catch (error) {
    console.error("Error getting project:", error);
    return null;
  }
};

export const createProject = async (project: Project): Promise<Project | null> => {
  try {
    const response = await fetch(`${ENGINE_URL}/project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      return null;
    }

    const createdProject: Project = await response.json();
    return createdProject;
  } catch (error) {
    console.error("Error creating project:", error);
    return null;
  }
};