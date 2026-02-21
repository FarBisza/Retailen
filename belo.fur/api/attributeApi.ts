// ============================================================
// attributeApi.ts — EAV Attribute operations (English)
// ============================================================

import { API_URL, getHeaders } from './authApi';
import {
    Attribute,
    CategoryAttribute,
    ProductAttributeValue,
    CreateAttributeDTO,
    SetProductAttributeDTO,
    DictionaryItem
} from './types';

// Get all attributes
export const getAllAttributes = async (): Promise<Attribute[]> => {
    const res = await fetch(`${API_URL}/attribute`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch attributes');
    return res.json();
};

// ============================================================
// Dictionary Tables
// ============================================================

export const getColors = async (): Promise<DictionaryItem[]> => {
    const res = await fetch(`${API_URL}/attribute/colors`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch colors');
    return res.json();
};

export const getMaterials = async (): Promise<DictionaryItem[]> => {
    const res = await fetch(`${API_URL}/attribute/materials`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch materials');
    return res.json();
};

export const getSizes = async (): Promise<DictionaryItem[]> => {
    const res = await fetch(`${API_URL}/attribute/sizes`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch sizes');
    return res.json();
};

// Get attribute by ID
export const getAttributeById = async (id: number): Promise<Attribute> => {
    const res = await fetch(`${API_URL}/attribute/${id}`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch attribute');
    return res.json();
};

// Create new attribute
export const createAttribute = async (
    data: CreateAttributeDTO
): Promise<Attribute> => {
    const res = await fetch(`${API_URL}/attribute`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create attribute');
    return res.json();
};

// Get attributes for a category
export const getAttributesByCategory = async (
    categoryId: number
): Promise<CategoryAttribute[]> => {
    const res = await fetch(`${API_URL}/attribute/category/${categoryId}`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch category attributes');
    return res.json();
};

// Get attributes for a product
export const getProductAttributes = async (
    productId: number
): Promise<ProductAttributeValue[]> => {
    const res = await fetch(`${API_URL}/attribute/product/${productId}`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch product attributes');
    return res.json();
};

// Set attribute for a product
export const setProductAttribute = async (
    productId: number,
    data: SetProductAttributeDTO
): Promise<void> => {
    const res = await fetch(`${API_URL}/attribute/product/${productId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to set product attribute');
};

// Remove attribute from product
export const removeProductAttribute = async (
    productId: number,
    attributeId: number
): Promise<void> => {
    const res = await fetch(
        `${API_URL}/attribute/product/${productId}/${attributeId}`,
        {
            method: 'DELETE',
            headers: getHeaders(),
        }
    );
    if (!res.ok) throw new Error('Failed to remove product attribute');
};