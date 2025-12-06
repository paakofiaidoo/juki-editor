import React, { createContext, useContext, useState, ReactNode } from "react";
import featureFlags from "../data/features.json";

export type FeatureFlags = typeof featureFlags;

const FeatureContext = createContext<FeatureFlags>(featureFlags);

export const FeatureProvider = ({ children }: { children: ReactNode }) => {
    // We can just use the imported JSON directly as the value since we don't need runtime toggling anymore
    return <FeatureContext.Provider value={featureFlags}>{children}</FeatureContext.Provider>;
};

export const useFeatures = () => {
    const context = useContext(FeatureContext);
    if (!context) {
        throw new Error("useFeatures must be used within a FeatureProvider");
    }
    return context;
};

export const useFeature = (key: keyof FeatureFlags) => {
    const flags = useFeatures();
    return flags[key];
};
