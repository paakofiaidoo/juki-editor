declare module '@hcorta/react-to-image' {
    import React from 'react';

    export interface UseToImageOptions {
        width?: number;
        height?: number;
        backgroundColor?: string;
        style?: React.CSSProperties;
        quality?: number;
        cacheBust?: boolean;
        imagePlaceholder?: string;
        pixelRatio?: number;
        filter?: (node: HTMLElement) => boolean;
    }

    export interface UseToImageReturn {
        ref: React.RefObject<any>;
        isLoading: boolean;
        error: any;
        dataURL: string;
        getSvg: () => void;
        getPng: () => void;
        getJpeg: () => void;
        getBlob: () => void;
        getPixelData: () => void;
        getCanvas: () => void;
    }

    export function useToImage(options?: UseToImageOptions, callback?: (data: any) => void): UseToImageReturn;
}
