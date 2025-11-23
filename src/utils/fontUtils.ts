import { ImportedFont } from '../types';

export const parseGoogleFontsUrl = (url: string): Omit<ImportedFont, 'id'>[] => {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname !== 'fonts.googleapis.com') {
            throw new Error('Invalid Google Fonts URL');
        }

        const families = urlObj.searchParams.getAll('family');
        if (families.length === 0) {
            throw new Error('No font families found in URL');
        }

        return families.map(familyParam => {
            const fontFamily = familyParam.split(':')[0].replace(/\+/g, ' ');
            // Reconstruct a URL for just this family to keep it simple
            const individualUrl = `https://fonts.googleapis.com/css2?family=${familyParam.replace(/ /g, '+')}&display=swap`;
            return { fontFamily, url: individualUrl };
        });
    } catch (error) {
        console.error("Error parsing Google Fonts URL:", error);
        return [];
    }
};
