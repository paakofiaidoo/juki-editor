import React, { useState, useEffect } from 'react';
import { ImportedFont } from '../../types';
import { parseGoogleFontsUrl } from '../../utils/fontUtils';
import { Trash2 } from 'lucide-react';

interface ManageFontsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFonts: ImportedFont[];
  onSave: (fonts: ImportedFont[]) => void;
}

export const ManageFontsModal = ({ isOpen, onClose, currentFonts, onSave }: ManageFontsModalProps) => {
  const [fonts, setFonts] = useState<ImportedFont[]>([]);
  const [newFontUrl, setNewFontUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFonts(currentFonts);
      setNewFontUrl('');
    }
  }, [isOpen, currentFonts]);

  if (!isOpen) return null;
  
  const handleAddFont = () => {
      const parsedFonts = parseGoogleFontsUrl(newFontUrl);
      if (parsedFonts.length > 0) {
          const newFontsToAdd = parsedFonts
              .filter(pf => !fonts.some(f => f.fontFamily === pf.fontFamily))
              .map(pf => ({ ...pf, id: crypto.randomUUID() }));
          setFonts(prev => [...prev, ...newFontsToAdd]);
          setNewFontUrl('');
      } else {
          alert("Could not parse a valid font from the provided URL. Please use a URL from fonts.google.com.");
      }
  };
  
  const handleRemoveFont = (fontId: string) => {
      setFonts(prev => prev.filter(f => f.id !== fontId));
  };

  const handleSave = () => {
    onSave(fonts);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-juki-dark-2 rounded-lg p-6 w-[500px] border border-juki-dark-3 flex flex-col" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-white mb-4">Manage Imported Fonts</h2>
        <div className="space-y-2 mb-4">
            <label className="text-xs text-gray-400 block mb-1">Google Fonts URL</label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newFontUrl}
                    onChange={e => setNewFontUrl(e.target.value)}
                    placeholder="Paste URL from fonts.google.com"
                    className="flex-1 bg-juki-dark p-2 rounded border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green text-white text-sm"
                />
                <button onClick={handleAddFont} className="bg-juki-dark-3 text-white font-bold py-2 px-4 rounded">Add</button>
            </div>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto max-h-60 pr-2">
            {fonts.length > 0 ? fonts.map(font => (
                <div key={font.id} className="flex items-center justify-between p-2 bg-juki-dark rounded">
                    <span className="text-white font-semibold">{font.fontFamily}</span>
                    <button onClick={() => handleRemoveFont(font.id)} className="text-gray-500 hover:text-red-500">
                        <Trash2 size={16} />
                    </button>
                </div>
            )) : <p className="text-sm text-gray-500 text-center py-4">No fonts imported yet.</p>}
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t border-juki-dark-3 mt-4">
          <button type="button" onClick={onClose} className="bg-juki-dark-3 text-white font-bold py-2 px-4 rounded">Cancel</button>
          <button type="button" onClick={handleSave} className="bg-juki-green text-black font-bold py-2 px-4 rounded">Save Changes</button>
        </div>
      </div>
    </div>
  );
};