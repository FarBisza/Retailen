import React from 'react';
import { X } from 'lucide-react';

interface ActiveFiltersProps {
    searchQuery: string;
    selectedCategory: string | null;
    priceRange: [number, number];
    selectedColors: string[];
    selectedStyles: string[];
    inStockOnly: boolean;
    onClearSearch: () => void;
    onClearCategory: () => void;
    onClearPrice: () => void;
    onRemoveColor: (color: string) => void;
    onRemoveStyle: (style: string) => void;
    onClearStock: () => void;
    onClearAll: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
    searchQuery, selectedCategory, priceRange, selectedColors, selectedStyles, inStockOnly,
    onClearSearch, onClearCategory, onClearPrice, onRemoveColor, onRemoveStyle, onClearStock, onClearAll,
}) => {
    const filters: { type: string; value: string; onClear: () => void }[] = [];

    if (searchQuery) filters.push({ type: 'Search', value: `"${searchQuery}"`, onClear: onClearSearch });
    if (selectedCategory) filters.push({ type: 'Category', value: selectedCategory, onClear: onClearCategory });
    if (priceRange[1] < 2000) filters.push({ type: 'Price', value: `Under $${priceRange[1]}`, onClear: onClearPrice });
    selectedColors.forEach(c => filters.push({ type: 'Color', value: c, onClear: () => onRemoveColor(c) }));
    selectedStyles.forEach(s => filters.push({ type: 'Style', value: s, onClear: () => onRemoveStyle(s) }));
    if (inStockOnly) filters.push({ type: 'Availability', value: 'In Stock', onClear: onClearStock });

    if (filters.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mb-8 animate-in fade-in slide-in-from-top-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mr-2">Active:</span>
            {filters.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tighter">
                        {f.type === 'Color' ? (
                            <div className="w-2 h-2 rounded-full inline-block mr-1" style={{ backgroundColor: f.value }} />
                        ) : null}
                        {f.value}
                    </span>
                    <button onClick={f.onClear} className="text-gray-400 hover:text-black transition-colors">
                        <X size={12} />
                    </button>
                </div>
            ))}
            <button
                onClick={onClearAll}
                className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 ml-2"
            >
                Clear All
            </button>
        </div>
    );
};

export default ActiveFilters;
