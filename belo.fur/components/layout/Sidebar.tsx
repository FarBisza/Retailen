import React from 'react';
import { ChevronRight, Check, X, Sofa, Smartphone, Shirt, Filter, RotateCcw } from 'lucide-react';
import { UserProfile } from '../../api/types';
import { COLOR_MAP, DISPLAY_COLORS } from '../../constants';

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
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: string[];
  currentUser: UserProfile | null;
  onGoToAdmin?: () => void;
  availableColors?: string[];
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
  setInStockOnly,
  searchQuery,
  setSearchQuery,
  categories,
  currentUser,
  onGoToAdmin,
  availableColors = []
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

  // Use availableColors from API if present, otherwise default to all in COLOR_MAP
  const activeColorNames = availableColors.length > 0
    ? availableColors
    : COLOR_MAP.map(c => c.name);

  // Filter COLOR_MAP to only include available colors matching the Curated Display List
  const colors = COLOR_MAP.filter(c =>
    activeColorNames.includes(c.name) && DISPLAY_COLORS.includes(c.name)
  );

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setPriceRange([0, 2000]);
    setSelectedColors([]);
    setSelectedStyles([]);
    setInStockOnly(false);
  };

  // Grouping categories dynamically based on category names
  const furnitureCats = categories.filter(c =>
    c.includes('Furniture') || c.includes('Sofa') || c.includes('Table') ||
    c.includes('Ottoman') || c.includes('Dresser') || c.includes('Sideboard') ||
    c.includes('Kitchen') || c.includes('Bookcase') || c.includes('Credenza') ||
    c.includes('Patio')
  );
  const techCats = categories.filter(c =>
    c.includes('Smartphone') || c.includes('Audio') || c.includes('Laptop') ||
    c.includes('Smart Home') || c.includes('Wearable')
  );
  const apparelCats = categories.filter(c =>
    c.includes('Apparel') || c.includes('Essential') || c.includes('Accessor')
  );

  const CategoryGroup = ({ title, icon: Icon, items, colorClass }: { title: string, icon: any, items: string[], colorClass: string }) => (
    <div className="mb-8">
      <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 ${colorClass}`}>
        <Icon size={14} /> {title}
      </h4>
      <ul className="space-y-2.5">
        {items.map((cat) => (
          <li
            key={cat}
            onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
            className={`group flex items-center justify-between cursor-pointer transition-all text-xs font-bold py-1 px-2 rounded-sm
              ${selectedCategory === cat ? 'bg-slate-900 text-white' : 'text-gray-500 hover:text-slate-900 hover:bg-gray-50'}
            `}
          >
            <span>{cat}</span>
            <ChevronRight size={12} className={`transition-transform ${selectedCategory === cat ? 'rotate-90 text-white' : 'text-gray-200 group-hover:translate-x-1'}`} />
          </li>
        ))}
      </ul>
    </div>
  );

  const hasFilters = selectedCategory || selectedColors.length > 0 || selectedStyles.length > 0 || inStockOnly || priceRange[1] < 2000;

  return (
    <aside className="w-full lg:w-[300px] flex-shrink-0 px-6 lg:border-r border-gray-100 min-h-screen py-8">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-900" />
          <h2 className="text-lg font-black tracking-tighter uppercase">Filters</h2>
        </div>
        {hasFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
          >
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* Active Tags Section */}
      {hasFilters && (
        <div className="mb-10 animate-in fade-in slide-in-from-top-2 duration-300">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 text-[10px] font-bold rounded-full text-slate-900 uppercase">
                {selectedCategory} <X size={10} className="cursor-pointer" onClick={() => setSelectedCategory(null)} />
              </span>
            )}
            {selectedColors.map(c => (
              <span key={c} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 text-[10px] font-bold rounded-full text-slate-900 uppercase">
                Color <div className="w-2 h-2 rounded-full border border-gray-200" style={{ backgroundColor: c }} /> <X size={10} className="cursor-pointer" onClick={() => toggleColor(c)} />
              </span>
            ))}
            {selectedStyles.map(s => (
              <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 text-[10px] font-bold rounded-full text-slate-900 uppercase">
                {s} <X size={10} className="cursor-pointer" onClick={() => toggleStyle(s)} />
              </span>
            ))}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-green-100 text-[10px] font-bold rounded-full text-green-700 uppercase">
                In Stock <X size={10} className="cursor-pointer" onClick={() => setInStockOnly(false)} />
              </span>
            )}
            {priceRange[1] < 2000 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 text-[10px] font-bold rounded-full text-slate-900 uppercase">
                Under ${priceRange[1]} <X size={10} className="cursor-pointer" onClick={() => setPriceRange([0, 2000])} />
              </span>
            )}
          </div>
        </div>
      )}

      {/* Categories Grouped */}
      <div className="mb-12">
        <h3 className="text-sm font-black mb-6 border-b border-gray-50 pb-2">Collections</h3>
        <CategoryGroup title="Furniture" icon={Sofa} items={furnitureCats} colorClass="text-amber-600" />
        <CategoryGroup title="Technology" icon={Smartphone} items={techCats} colorClass="text-blue-600" />
        <CategoryGroup title="Fashion" icon={Shirt} items={apparelCats} colorClass="text-slate-500" />
      </div>

      {/* Price Range */}
      <div className="mb-12">
        <h3 className="text-sm font-black mb-6">Price Range</h3>
        <div className="space-y-5">
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
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[9px] font-black text-gray-400 uppercase">Min</span>
              <div className="border border-gray-100 px-3 py-2 text-xs font-bold text-slate-900 rounded-sm bg-gray-50/50">
                ${priceRange[0]}
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[9px] font-black text-gray-400 uppercase">Max</span>
              <div className="border border-gray-100 px-3 py-2 text-xs font-bold text-slate-900 rounded-sm bg-gray-50/50">
                ${priceRange[1]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="mb-12">
        <h3 className="text-sm font-black mb-5">Palette</h3>
        <div className="flex flex-wrap gap-2.5">
          {colors.map((color, idx) => (
            <button
              key={idx}
              onClick={() => toggleColor(color.hex)}
              className={`w-8 h-8 rounded-full border border-gray-100 shadow-sm flex items-center justify-center transition-all relative
                ${selectedColors.includes(color.hex) ? 'ring-2 ring-slate-900 ring-offset-2 scale-110' : 'hover:scale-110'}
              `}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {selectedColors.includes(color.hex) && (
                <Check size={14} className={['#1A1A1A', '#A07855'].includes(color.hex) ? 'text-white' : 'text-black'} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Styles */}
      <div className="mb-12">
        <h3 className="text-sm font-black mb-5">Vibe & Style</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Modern', 'Urban', 'Minimalist', 'Classic', 'Industrial'].map((style) => {
            const isSelected = selectedStyles.includes(style);
            return (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className={`px-3 py-2.5 text-[9px] font-black uppercase tracking-widest border transition-all rounded-sm
                  ${isSelected ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-slate-900'}
                `}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>



      {/* Availability Toggle */}
      <div
        onClick={() => setInStockOnly(!inStockOnly)}
        className="flex items-center justify-between p-4 bg-gray-50 rounded-sm cursor-pointer hover:bg-gray-100 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all ${inStockOnly ? 'bg-slate-900 border-slate-900' : 'bg-white border-gray-300 group-hover:border-gray-400'}`}>
            {inStockOnly && <Check size={12} className="text-white" />}
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">In Stock Only</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${inStockOnly ? 'bg-green-500 animate-pulse' : 'bg-gray-200'}`} />
      </div>
    </aside>
  );
};

export default Sidebar;
