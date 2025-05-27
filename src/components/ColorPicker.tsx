import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Check } from 'lucide-react';

export const ColorPicker: React.FC = () => {
  const { infographicOptions, setInfographicOptions } = useAppContext();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('#2563EB');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const predefinedPalettes = [
    ['#2563EB', '#7C3AED', '#0D9488', '#16A34A', '#F59E0B', '#DC2626'],
    ['#0284C7', '#4F46E5', '#7E22CE', '#BE185D', '#EA580C', '#16A34A'],
    ['#475569', '#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0', '#F1F5F9'],
    ['#881337', '#9F1239', '#BE123C', '#E11D48', '#F43F5E', '#FB7185'],
    ['#134E4A', '#115E59', '#0F766E', '#0D9488', '#14B8A6', '#2DD4BF'],
  ];

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(e.target.value);
    
    if (editingIndex !== null) {
      const newColors = [...infographicOptions.colors];
      newColors[editingIndex] = e.target.value;
      setInfographicOptions({
        ...infographicOptions,
        colors: newColors,
      });
    }
  };

  const handleColorClick = (index: number) => {
    setEditingIndex(index);
    setCurrentColor(infographicOptions.colors[index]);
    setShowColorPicker(true);
  };

  const handleAddColor = () => {
    if (infographicOptions.colors.length < 10) {
      setInfographicOptions({
        ...infographicOptions,
        colors: [...infographicOptions.colors, currentColor],
      });
    }
  };

  const handlePaletteSelect = (palette: string[]) => {
    setInfographicOptions({
      ...infographicOptions,
      colors: [...palette],
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {infographicOptions.colors.map((color, index) => (
          <button
            key={index}
            onClick={() => handleColorClick(index)}
            className="w-8 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            style={{ backgroundColor: color }}
            title={`Color ${index + 1}`}
          >
            {editingIndex === index && (
              <Check className="w-4 h-4 text-white mx-auto" />
            )}
          </button>
        ))}
        
        {infographicOptions.colors.length < 10 && (
          <button
            onClick={handleAddColor}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50"
            title="Add color"
          >
            <Plus className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
      
      {showColorPicker && (
        <div className="mt-2">
          <input
            type="color"
            value={currentColor}
            onChange={handleColorChange}
            className="w-full h-10 cursor-pointer rounded border border-gray-300"
          />
        </div>
      )}
      
      <div>
        <p className="text-xs text-gray-500 mb-1">Predefined palettes</p>
        <div className="space-y-2">
          {predefinedPalettes.map((palette, idx) => (
            <button
              key={idx}
              onClick={() => handlePaletteSelect(palette)}
              className="w-full flex space-x-1 p-1 border border-gray-200 rounded hover:bg-gray-50"
            >
              {palette.map((color, colorIdx) => (
                <div
                  key={colorIdx}
                  className="h-4 flex-1 first:rounded-l last:rounded-r"
                  style={{ backgroundColor: color }}
                />
              ))}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};