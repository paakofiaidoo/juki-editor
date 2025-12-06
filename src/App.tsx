import React from "react";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { EditorPage } from "./pages/EditorPage";
import { FontManager } from "./components/layout/FontManager";
import { DragMonitor } from "./components/layout/DragMonitor";
import { FeatureProvider } from "./context/FeatureContext";

import { initLogInterceptor } from "./utils/log-interceptor";

// Initialize log interceptor
initLogInterceptor();

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <FeatureProvider>
                <AppProvider>
                    <DragMonitor />
                    <FontManager />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/editor/:projectId" element={<EditorPage />} />
                        </Routes>
                    </BrowserRouter>
                </AppProvider>
            </FeatureProvider>
        </ThemeProvider>
    );
}

export default App;
