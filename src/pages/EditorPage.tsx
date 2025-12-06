import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../hooks/useApp";
import { MainLayout } from "../components/layout/MainLayout";
import { PreviewMode } from "../components/ui/PreviewMode";
import { ProjectErrorOverlay } from "../components/ui/ProjectErrorOverlay";
import { AlertTriangle, Trash2 } from "lucide-react";

export const EditorPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { setActiveProjectId, projects, activeProject, isPreviewMode, projectError, deleteProject } = useApp();
    const navigate = useNavigate();

    const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);
    const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);

    useEffect(() => {
        if (projectId) {
            setActiveProjectId(projectId);
        }
    }, [projectId, setActiveProjectId]);

    // Redirect if project not found (optional, requires projects to be loaded)
    useEffect(() => {
        if (projects.length > 0 && projectId && !projects.find((p) => p.id === projectId)) {
            console.warn(`Project ${projectId} not found in loaded projects.`);
            // navigate('/');
        }
    }, [projects, projectId, navigate]);

    if (projectError) {
        return (
            <ProjectErrorOverlay
                error={projectError}
                onDelete={() => {
                    if (activeProject) deleteProject(activeProject.id);
                    navigate("/");
                }}
                onDismiss={() => navigate("/")}
            />
        );
    }

    if (!activeProject) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground">
                <p>Loading Project...</p>
            </div>
        );
    }

    if (isPreviewMode) {
        return <PreviewMode />;
    }

    return (
        <MainLayout
            isLeftSidebarVisible={isLeftSidebarVisible}
            isRightSidebarVisible={isRightSidebarVisible}
            toggleLeftSidebar={() => setIsLeftSidebarVisible((v) => !v)}
            toggleRightSidebar={() => setIsRightSidebarVisible((v) => !v)}
        />
    );
};
