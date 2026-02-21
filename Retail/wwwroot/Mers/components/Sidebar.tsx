
import React from 'react';
import { ChevronRight, Settings2, Check } from 'lucide-react';
import { CATEGORIES } from '../constants';

interface SidebarProps {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  selectedStyles: string[];
  setSelectedStyles: (styles: string[]) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  selectedColors,
  setSelectedColors,
  selectedStyles,
  setSelectedStyles,
  inStockOnly,
  setInStockOnly
}) => {
  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const colors = [
    { hex: '#F5E6D3', name: 'Beige' },
    { hex: '#1A1A1A', name: 'Black' },
    { hex: '#A07855', name: 'Brown' },
    { hex: '#9CA3AF', name: 'Gray' },
    { hex: '#4D7C0F', name: 'Green' },
    { hex: '#F59E0B', name: 'Orange' }
  ];

  return (
    <aside className="w-full lg:w-[280px] flex-shrink-0 px-6 lg:border-r border-gray-100 min-h-screen py-4">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-semibold">Filter</h2>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setPriceRange([0, 2000]);
            setSelectedColors([]);
            setSelectedStyles([]);
            setInStockOnly(false);
          }}
          className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Category Section */}
      <div className="mb-10">
        <h3 className="text-base font-semibold mb-5">Category</h3>
        <ul className="space-y-4">
          <li
            onClick={() => setSelectedCategory(null)}
            className={`group flex items-center justify-between cursor-pointer transition-colors text-sm font-medium
              ${selectedCategory === null ? 'text-black' : 'text-gray-600 hover:text-black'}
            `}
          >
            <span>All Categories</span>
            {selectedCategory === null && <div className="w-1 h-1 bg-black rounded-full" />}
          </li>
          {CATEGORIES.map((cat) => (
            <li
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`group flex items-center justify-between cursor-pointer transition-colors text-sm font-medium
                ${selectedCategory === cat ? 'text-black font-bold' : 'text-gray-600 hover:text-black'}
              `}
            >
              <span>{cat}</span>
              <ChevronRight size={16} className={`text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all ${selectedCategory === cat ? 'text-black translate-x-1' : ''}`} />
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="mb-10">
        <h3 className="text-base font-semibold mb-6">Price Range :</h3>
        <div className="space-y-4">
          <div className="relative px-1">
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 border border-gray-200 px-3 py-2 text-sm text-gray-900 rounded font-medium bg-gray-50/50">
              Min: ${priceRange[0]}
            </div>
            <div className="flex-1 border border-gray-200 px-3 py-2 text-sm text-gray-900 rounded font-medium bg-gray-50/50">
              Max: ${priceRange[1]}
            </div>
          </div>
        </div>
      </div>

      {/* Colors Available */}
      <div className="mb-10">
        <h3 className="text-base font-semibold mb-4">Colors Available</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color, idx) => (
            <button
              key={idx}
              onClick={() => toggleColor(color.hex)}
              className={`w-6 h-6 rounded-full border border-gray-200 shadow-sm flex items-center justify-center transition-all
                ${selectedColors.includes(color.hex) ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'hover:scale-105'}
              `}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {selectedColors.includes(color.hex) && <Check size={12} className={color.hex === '#1A1A1A' ? 'text-white' : 'text-black'} />}
            </button>
          ))}
        </div>
      </div>

      {/* Furniture Style */}
      <div className="mb-10">
        <h3 className="text-base font-semibold mb-4">Furniture Style</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Victorian', 'Rococo', 'Modern', 'Mid-Century Modern', 'Urban'].map((style) => {
            const isSelected = selectedStyles.includes(style);
            return (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest border rounded text-center transition-all
                  ${isSelected ? 'bg-[#0c121e] text-white border-transparent' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}
                `}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="mb-10">
        <h3 className="text-base font-semibold mb-4">Availability</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`w-5 h-5 border rounded flex items-center justify-center transition-all
                ${inStockOnly ? 'bg-slate-900 border-slate-900' : 'bg-white border-gray-300 group-hover:border-gray-400'}
              `}
            >
              {inStockOnly && <Check size={12} className="text-white" />}
            </div>
            <span className={`text-sm font-medium transition-colors ${inStockOnly ? 'text-black' : 'text-gray-600'}`}>In Stock</span>
          </label>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
