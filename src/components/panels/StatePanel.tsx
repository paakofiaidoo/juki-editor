import React, { useState } from "react";
import { useApp } from "../../hooks/useApp";
import { ChevronRight, ChevronDown, Database, Globe, Server } from "lucide-react";

type StateTab = "local" | "global" | "api";

export const StatePanel = () => {
    const [activeTab, setActiveTab] = useState<StateTab>("global");
    const { activeProject, activePage, selectedItemIds } = useApp();

    const renderJSON = (data: any, level = 0) => {
        if (typeof data !== "object" || data === null) {
            return <span className="text-juki-green">{JSON.stringify(data)}</span>;
        }

        return (
            <div className="pl-2 border-l border-white/10">
                {Object.entries(data).map(([key, value]) => (
                    <div key={key} className="py-0.5">
                        <span className="text-purple-400">{key}: </span>
                        {typeof value === "object" && value !== null ? (
                            <details open>
                                <summary className="cursor-pointer hover:text-white inline-flex items-center gap-1">
                                    <span className="text-gray-500 text-xs">{Array.isArray(value) ? `Array(${value.length})` : "Object"}</span>
                                </summary>
                                {renderJSON(value, level + 1)}
                            </details>
                        ) : (
                            <span className="text-gray-300">{JSON.stringify(value)}</span>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const getGlobalState = () => ({
        project: {
            id: activeProject?.id,
            name: activeProject?.name,
            theme: activeProject?.theme,
        },
        page: {
            id: activePage?.id,
            name: activePage?.name,
            route: activePage?.route,
        },
        selection: selectedItemIds,
    });

    const getLocalState = () => ({
        // Mock local state for selected item
        selectedItem:
            selectedItemIds.length > 0
                ? {
                      id: selectedItemIds[0],
                      props: {
                          visible: true,
                          counter: 0,
                      },
                      localVars: {
                          isLoading: false,
                      },
                  }
                : null,
    });

    const getApiState = () => ({
        queries: {
            getUsers: { status: "success", data: [{ id: 1, name: "John" }] },
            getPosts: { status: "loading" },
        },
        mutations: {},
    });

    const renderContent = () => {
        switch (activeTab) {
            case "global":
                return renderJSON(getGlobalState());
            case "local":
                return renderJSON(getLocalState());
            case "api":
                return renderJSON(getApiState());
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex border-b border-juki-dark-3">
                <button
                    onClick={() => setActiveTab("local")}
                    className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1 ${activeTab === "local" ? "text-white bg-juki-dark-3" : "text-gray-400 hover:text-white"}`}
                >
                    <Database size={12} /> Local
                </button>
                <button
                    onClick={() => setActiveTab("global")}
                    className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1 ${activeTab === "global" ? "text-white bg-juki-dark-3" : "text-gray-400 hover:text-white"}`}
                >
                    <Globe size={12} /> Global
                </button>
                <button
                    onClick={() => setActiveTab("api")}
                    className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1 ${activeTab === "api" ? "text-white bg-juki-dark-3" : "text-gray-400 hover:text-white"}`}
                >
                    <Server size={12} /> API
                </button>
            </div>
            <div className="flex-1 overflow-auto p-2 font-mono text-xs">{renderContent()}</div>
        </div>
    );
};
