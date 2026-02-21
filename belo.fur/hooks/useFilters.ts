import { useState, useMemo, useEffect } from 'react';
import { Product } from '../api/types';
import { COLOR_MAP } from '../constants';

const ITEMS_PER_PAGE = 12;

export function useFilters(products: Product[]) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Reset page to 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, priceRange, selectedColors, selectedStyles, inStockOnly]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // When searching, only filter by name — skip all sidebar filters
            if (searchQuery) {
                return product.name.toLowerCase().includes(searchQuery.toLowerCase());
            }

            if (selectedCategory) {
                const hasCategory = product.categories?.includes(selectedCategory) || product.category === selectedCategory;
                if (!hasCategory) return false;
            }

            const pPrice = Number(product.price);
            if (pPrice < priceRange[0] || pPrice > priceRange[1]) return false;

            if (selectedColors.length > 0) {
                const selectedColorNames = selectedColors.map(hex => COLOR_MAP.find(c => c.hex === hex)?.name).filter(Boolean);
                const hasColor = product.colors.some(c => selectedColorNames.includes(c));
                if (!hasColor) return false;
            }

            if (selectedStyles.length > 0 && !selectedStyles.includes(product.style)) return false;
            if (inStockOnly && !product.inStock) return false;

            return true;
        });
    }, [products, selectedCategory, priceRange, selectedColors, selectedStyles, inStockOnly, searchQuery]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const displayedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedCategory(null);
        setPriceRange([0, 2000]);
        setSelectedColors([]);
        setSelectedStyles([]);
        setInStockOnly(false);
    };

    return {
        searchQuery, setSearchQuery,
        selectedCategory, setSelectedCategory,
        priceRange, setPriceRange,
        selectedColors, setSelectedColors,
        selectedStyles, setSelectedStyles,
        inStockOnly, setInStockOnly,
        currentPage, setCurrentPage,
        filteredProducts, displayedProducts, totalPages,
        clearAllFilters,
    };
}
