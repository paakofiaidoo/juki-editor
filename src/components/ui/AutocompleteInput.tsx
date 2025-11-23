import React, { useState, useEffect, useRef } from 'react';

interface AutocompleteInputProps {
    value: string;
    onChange: (value: string) => void;
    suggestions: string[];
    placeholder?: string;
}

export const AutocompleteInput = ({ value, onChange, suggestions, placeholder }: AutocompleteInputProps) => {
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [currentWord, setCurrentWord] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value;
        onChange(inputValue);

        const cursorPosition = e.target.selectionStart;
        const textBeforeCursor = inputValue.substring(0, cursorPosition);
        const lastSpaceIndex = textBeforeCursor.lastIndexOf(' ');
        const word = textBeforeCursor.substring(lastSpaceIndex + 1);
        setCurrentWord(word);

        if (word) {
            const filtered = suggestions
                .filter(suggestion => suggestion.toLowerCase().startsWith(word.toLowerCase()))
                .slice(0, 10); // Limit suggestions
            setFilteredSuggestions(filtered);
            setShowSuggestions(true);
            setActiveSuggestionIndex(0);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!showSuggestions || filteredSuggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestionIndex(prev => (prev + 1) % filteredSuggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestionIndex(prev => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleClick(activeSuggestionIndex);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const handleClick = (index: number) => {
        const suggestion = filteredSuggestions[index];
        const lastSpaceIndex = value.lastIndexOf(' ', value.length - currentWord.length - 1);
        const newValue = value.substring(0, lastSpaceIndex + 1) + suggestion + ' ';
        
        onChange(newValue);
        setShowSuggestions(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <textarea
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={3}
                className="w-full bg-juki-dark-3 p-2 rounded border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green text-white font-mono text-xs resize-y"
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-juki-dark-2 border border-juki-dark-3 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                    {filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={suggestion}
                            onClick={() => handleClick(index)}
                            className={`p-2 text-xs font-mono cursor-pointer ${
                                index === activeSuggestionIndex ? 'bg-juki-green text-black' : 'text-gray-300 hover:bg-juki-dark-3'
                            }`}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
