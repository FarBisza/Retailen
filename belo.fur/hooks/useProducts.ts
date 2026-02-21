import { useState, useEffect } from 'react';
import { Product } from '../api/types';
import { CategoryFromApi } from '../api/categoryApi';

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [availableColors, setAvailableColors] = useState<string[]>([]);

    // Load products, categories, and colors from backend with retry
    useEffect(() => {
        let isMounted = true;
        let retryTimeout: NodeJS.Timeout;

        const loadData = async (retryCount = 0) => {
            if (!isMounted) return;

            try {
                setProductsLoading(true);
                setCategoriesLoading(true);

                const { fetchProducts } = await import('../api/productApi');
                const productData = await fetchProducts();
                if (isMounted) setProducts(productData);

                const { getColors } = await import('../api/attributeApi');
                const colorData = await getColors();
                if (isMounted) {
                    setAvailableColors(colorData.map(c => c.name));
                }

                const { fetchCategories } = await import('../api/categoryApi');
                const categoryData = await fetchCategories();
                if (isMounted) {
                    const categoryNames = categoryData.map((cat: CategoryFromApi) => cat.name);
                    setCategories(categoryNames);
                }

                if (isMounted) {
                    setProductsLoading(false);
                    setCategoriesLoading(false);
                }
            } catch (error) {
                console.error('Failed to load data:', error);
                if (isMounted) {
                    setProductsLoading(false);
                    setCategoriesLoading(false);
                }

                if (retryCount < 5 && isMounted) {
                    const delay = 2000 * Math.pow(2, retryCount);
                    console.log(`Retrying in ${delay / 1000}s... (attempt ${retryCount + 1}/5)`);
                    retryTimeout = setTimeout(() => loadData(retryCount + 1), delay);
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
            if (retryTimeout) clearTimeout(retryTimeout);
        };
    }, []);

    // Re-fetch products when admin panel makes CRUD changes
    useEffect(() => {
        const handleProductChange = async () => {
            try {
                const { fetchProducts } = await import('../api/productApi');
                const productData = await fetchProducts();
                setProducts(productData);
            } catch (err) {
                console.error('Failed to refresh products:', err);
            }
        };
        window.addEventListener('product-data-changed', handleProductChange);
        return () => window.removeEventListener('product-data-changed', handleProductChange);
    }, []);

    return { products, productsLoading, categories, categoriesLoading, availableColors };
}
