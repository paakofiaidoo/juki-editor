import React, { createContext, useContext, useState, ReactNode } from "react";
import featureFlags from "../data/features.json";

export type FeatureFlags = typeof featureFlags;

interface FeatureContextType {
    flags: FeatureFlags;
    setFlag: (key: keyof FeatureFlags, value: boolean) => void;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export const FeatureProvider = ({ children }: { children: ReactNode }) => {
    const [flags, setFlags] = useState<FeatureFlags>(featureFlags);

    const setFlag = (key: keyof FeatureFlags, value: boolean) => {
        setFlags((prev) => ({ ...prev, [key]: value }));
    };

    return <FeatureContext.Provider value={{ flags, setFlag }}>{children}</FeatureContext.Provider>;
};

export const useFeatures = () => {
    const context = useContext(FeatureContext);
    if (!context) {
        throw new Error("useFeatures must be used within a FeatureProvider");
    }
    return context;
};

export const useFeature = (key: keyof FeatureFlags) => {
    const { flags } = useFeatures();
    return flags[key];
};
