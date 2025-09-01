import React from 'react';
import type { AdFormat } from '../types';

interface AdFormatSelectorProps {
  formats: AdFormat[];
  selectedFormatId: string | null;
  onSelect: (format: AdFormat) => void;
}

const AdFormatSelector: React.FC<AdFormatSelectorProps> = ({ formats, selectedFormatId, onSelect }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
      {formats.map((format) => {
        // FIX: The icon is now a component reference, so we assign it to a capitalized variable and render it as a component.
        const Icon = format.icon;
        return (
          <button
            key={format.id}
            onClick={() => onSelect(format)}
            className={`flex flex-col items-center justify-center text-center p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:-translate-y-1
            ${selectedFormatId === format.id 
              ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400' 
              : 'bg-slate-700/50 hover:bg-slate-600/50'}`
            }
          >
            <div className="text-3xl mb-2"><Icon /></div>
            <span className="text-xs font-semibold">{format.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default AdFormatSelector;