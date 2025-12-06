import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { IAppContext } from "../../types";

export const CustomCssPanel = () => {
    const context = useContext(AppContext);
    const { activePage, updatePage } = context as IAppContext;
    const [css, setCss] = useState(activePage?.customCss || "");

    useEffect(() => {
        setCss(activePage?.customCss || "");
    }, [activePage?.id, activePage?.customCss]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newCss = e.target.value;
        setCss(newCss);
        if (activePage) {
            updatePage(activePage.id, { customCss: newCss });
        }
    };

    if (!activePage) return <div className="p-4 text-gray-400">No page selected</div>;

    return (
        <div className="flex flex-col h-full bg-gray-900 text-white p-4">
            <h2 className="text-sm font-bold mb-2 uppercase tracking-wider text-gray-400">Page Custom CSS</h2>
            <p className="text-xs text-gray-500 mb-4">Add custom CSS classes here. They will be scoped to this page (conceptually) and injected into the canvas.</p>
            <textarea
                className="flex-1 bg-gray-800 border border-gray-700 rounded p-2 font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
                value={css}
                onChange={handleChange}
                placeholder=".my-custom-class { color: red; }"
                spellCheck={false}
            />
        </div>
    );
};
