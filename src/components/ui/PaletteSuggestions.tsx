import React, { useState, useEffect } from 'react';
import { ColorMagicPalette, Theme } from '../../types';
import { mapPaletteToTheme } from '../../utils/colorUtils';
import { useDebounce } from '../../hooks/useDebounce';

interface PaletteSuggestionsProps {
    searchQuery: string;
    onSelectPalette: (colors: Theme['colors']) => void;
}

// FIX: Changed component to React.FC to resolve issues with the 'key' prop in maps.
const PalettePreview: React.FC<{ palette: ColorMagicPalette, onSelect: () => void }> = ({ palette, onSelect }) => (
    <button onClick={onSelect} className="w-full rounded-md overflow-hidden transition-transform hover:scale-105" title={palette.text}>
        <div className="flex h-12">
            {palette.colors.map(color => (
                <div key={color} style={{ backgroundColor: color }} className="flex-1" />
            ))}
        </div>
    </button>
);


export const PaletteSuggestions = ({ searchQuery, onSelectPalette }: PaletteSuggestionsProps) => {
    const [palettes, setPalettes] = useState<ColorMagicPalette[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    useEffect(() => {
        if (!debouncedSearchQuery.trim()) {
            setPalettes([]);
            return;
        }

        const fetchPalettes = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // The browser's CORS policy blocks direct client-side requests to the ColorMagic API.
                // We route the request through a public CORS proxy to bypass this restriction.
                const targetUrl = `https://colormagic.app/api/palette/search?q=${encodeURIComponent(debouncedSearchQuery)}`;
                const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
                const response = await fetch(proxyUrl);

                if (!response.ok) {
                    throw new Error(`API error: ${response.statusText}`);
                }
                const data: ColorMagicPalette[] = await response.json();
                setPalettes(data.filter(p => p.colors.length >= 5)); // Only use palettes with enough colors
            } catch (e) {
                console.error("Failed to fetch palettes:", e);
                setError((e as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPalettes();

    }, [debouncedSearchQuery]);
    
    const handleSelect = (palette: ColorMagicPalette) => {
        const themeColors = mapPaletteToTheme(palette.colors);
        if (themeColors) {
            onSelectPalette(themeColors);
        }
    };

    return (
        <div className="space-y-2">
            {isLoading && <p className="text-xs text-center text-gray-400">Searching...</p>}
            {error && <p className="text-xs text-center text-red-500">Error: {error}</p>}
            {!isLoading && !error && palettes.length > 0 && (
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {palettes.map(p => (
                        <PalettePreview key={p.id} palette={p} onSelect={() => handleSelect(p)} />
                    ))}
                </div>
            )}
            {!isLoading && !error && debouncedSearchQuery.trim() && palettes.length === 0 && (
                <p className="text-xs text-center text-gray-500">No results found for "{debouncedSearchQuery}".</p>
            )}
        </div>
    );
};