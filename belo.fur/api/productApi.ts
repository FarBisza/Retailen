import { API_URL, getHeaders } from './authApi';
import { Product, ProductAttributeValue } from './types';

export interface ProductFromApi {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    description?: string;
    imageUrl?: string;
    category?: string;
    style?: string;
    colors?: string[];
    inStock: boolean;
    stockLevel?: number;
    reviews?: {
        id: string;
        userId: string;
        userName: string;
        rating: number;
        comment: string;
        date: string;
    }[];
    attributes?: {
        id: number;
        productId: number;
        attributeId: number;
        attributeName: string;
        value: string;
        unit?: string;
    }[];
}

const mapProduct = (apiProd: ProductFromApi): Product => {
    return {
        id: apiProd.id.toString(),
        name: apiProd.name,
        price: Number(apiProd.price),
        originalPrice: apiProd.originalPrice,
        image: apiProd.imageUrl || 'https://placehold.co/800',
        category: apiProd.category || 'Uncategorized',
        style: apiProd.style || 'Modern',
        colors: apiProd.colors || [],
        inStock: apiProd.inStock,
        stockLevel: apiProd.stockLevel || 0,
        shortDescription: apiProd.description,
        reviews: apiProd.reviews || [],
        attributes: apiProd.attributes || [],
    };
};

export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const res = await fetch(`${API_URL}/product`, {
            headers: getHeaders(),
        });
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(
                `Failed to fetch products: ${res.status} ${errorText}`
            );
        }
        const data: ProductFromApi[] = await res.json();
        return data.map(mapProduct);
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const fetchProductById = async (
    id: string
): Promise<Product | null> => {
    try {
        const res = await fetch(`${API_URL}/product/${id}`, {
            headers: getHeaders(),
        });
        if (!res.ok) {
            if (res.status === 404) return null;
            const errorText = await res.text();
            throw new Error(
                `Failed to fetch product: ${res.status} ${errorText}`
            );
        }
        const data: ProductFromApi = await res.json();
        return mapProduct(data);
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

export interface CreateProductRequest {
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
    active?: boolean;
    categoryId?: number;
    attributes?: {
        attributeId: number;
        value: string;
    }[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> { }

const parseErrorResponse = async (res: Response): Promise<string> => {
    try {
        const text = await res.text();
        if (!text) return `HTTP ${res.status} ${res.statusText}`;

        try {
            const json = JSON.parse(text);
            if (json.errors) {
                return Object.entries(json.errors)
                    .map(
                        ([field, msgs]) =>
                            `${field}: ${(msgs as string[]).join(', ')}`
                    )
                    .join('\n');
            }
            if (json.message) return json.message;
            if (json.title) return json.title;
            return text;
        } catch {
            return text;
        }
    } catch {
        return `HTTP ${res.status} ${res.statusText}`;
    }
};

export const createProduct = async (
    data: CreateProductRequest
): Promise<ProductFromApi> => {
    const res = await fetch(`${API_URL}/product`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const detail = await parseErrorResponse(res);
        throw new Error(`Product creation failed (${res.status}): ${detail}`);
    }

    return await res.json();
};

export const updateProduct = async (
    id: string,
    data: UpdateProductRequest
): Promise<ProductFromApi> => {
    const res = await fetch(`${API_URL}/product/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const detail = await parseErrorResponse(res);
        throw new Error(`Product update failed (${res.status}): ${detail}`);
    }

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return await res.json();
    }
    return { id: parseInt(id), ...data } as unknown as ProductFromApi;
};

export const deleteProduct = async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/product/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });

    if (!res.ok) {
        const detail = await parseErrorResponse(res);
        throw new Error(`Product deletion failed (${res.status}): ${detail}`);
    }
};