import { API_URL, getHeaders } from './authApi';

export interface CategoryFromApi {
    id: number;
    parentId: number | null;
    name: string;
}

export const fetchCategories = async (): Promise<CategoryFromApi[]> => {
    const res = await fetch(`${API_URL}/category`, {
        headers: getHeaders(),
    });
    if (!res.ok) {
        console.error('Failed to fetch categories:', res.status);
        return [];
    }
    return res.json();
};

export const fetchCategoryById = async (
    id: number
): Promise<CategoryFromApi | null> => {
    const res = await fetch(`${API_URL}/category/${id}`, {
        headers: getHeaders(),
    });
    if (!res.ok) {
        console.error('Failed to fetch category:', res.status);
        return null;
    }
    return res.json();
};

export const createCategory = async (name: string, parentId?: number | null): Promise<CategoryFromApi> => {
    const res = await fetch(`${API_URL}/category`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, parentId: parentId || null }),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to create category: ${err}`);
    }
    return res.json();
};