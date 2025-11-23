import { Theme } from '../types';

/**
 * Converts an HSL color value to HEX. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 360], [0, 100], and [0, 100] and
 * returns a hex string.
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {string}          The HEX representation
 */
function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    const toHex = (c: number) => ('0' + c.toString(16)).slice(-2);
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}


export const generateRandomTheme = (currentTheme: Theme): Theme => {
    const hue = Math.floor(Math.random() * 360);

    const newColors = {
        primary: hslToHex(hue, 80, 60),
        secondary: hslToHex(hue, 15, 25),
        accent: hslToHex((hue + 150) % 360, 75, 65), // Triadic color for good contrast
        background: hslToHex(hue, 10, 12),
        text: hslToHex(hue, 15, 92),
    };

    return {
        ...currentTheme,
        colors: newColors,
    };
};

/**
 * Converts an HEX color value to HSL.
 * @param   {string}  hex       The hex color
 * @return  {object}            The HSL representation {h, s, l}
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt("0x" + hex[1] + hex[1]);
        g = parseInt("0x" + hex[2] + hex[2]);
        b = parseInt("0x" + hex[3] + hex[3]);
    } else if (hex.length === 7) {
        r = parseInt("0x" + hex[1] + hex[2]);
        g = parseInt("0x" + hex[3] + hex[4]);
        b = parseInt("0x" + hex[5] + hex[6]);
    }
    
    r /= 255; g /= 255; b /= 255;
    
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0, s = 0, l = 0;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
}

/**
 * Intelligently maps a 5-color palette to the theme's color roles.
 * @param colors An array of 5 hex color strings.
 * @returns A Theme['colors'] object, or null if input is invalid.
 */
export const mapPaletteToTheme = (colors: string[]): Theme['colors'] | null => {
    if (colors.length < 5) return null;

    const paletteWithHsl = colors.slice(0, 5).map(hex => ({
        hex,
        hsl: hexToHsl(hex)
    }));

    // Sort by lightness
    paletteWithHsl.sort((a, b) => a.hsl.l - b.hsl.l);
    
    const background = paletteWithHsl[4].hex; // Lightest
    const text = paletteWithHsl[0].hex; // Darkest

    const remaining = paletteWithHsl.slice(1, 4);
    
    // Sort remaining by saturation
    remaining.sort((a, b) => b.hsl.s - a.hsl.s);

    const primary = remaining[0].hex; // Most saturated
    const accent = remaining[1].hex; // Second most saturated
    const secondary = remaining[2].hex; // Least saturated
    
    return { background, text, primary, accent, secondary };
};
