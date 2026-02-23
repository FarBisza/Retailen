import React, { useMemo, useState, useEffect } from 'react';
import { Edit3, Trash2, Plus, X } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { Product, Attribute } from '../../../api/types';
import { createProduct, updateProduct, deleteProduct, CreateProductRequest } from '../../../api/productApi';
import { fetchCategories, CategoryFromApi } from '../../../api/categoryApi';
import { getAllAttributes } from '../../../api/attributeApi';
import { logisticsApi, ProductInventory } from '../../../api/logisticsApi';
import { DataGrid } from '../../shared/DataGrid';

interface AdminProductsTabProps {
    products: Product[];
    loading: boolean;
    onRefresh: () => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({ products, loading, onRefresh }) => {
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productFormData, setProductFormData] = useState<CreateProductRequest>({
        name: '',
        price: 0,
        description: '',
        imageUrl: '',
        active: true,
        categoryId: undefined,
        attributes: [],
    });
    const [productSaving, setProductSaving] = useState(false);

    const [categories, setCategories] = useState<CategoryFromApi[]>([]);
    const [allAttributes, setAllAttributes] = useState<Attribute[]>([]);

    const [showThresholdModal, setShowThresholdModal] = useState(false);
    const [thresholdProduct, setThresholdProduct] = useState<Product | null>(null);
    const [inventoryThresholds, setInventoryThresholds] = useState<ProductInventory[]>([]);
    const [thresholdValues, setThresholdValues] = useState<{ [warehouseId: number]: number }>({});
    const [thresholdSaving, setThresholdSaving] = useState(false);

    useEffect(() => {
        if (showProductModal) {
            fetchCategories().then(setCategories).catch(console.error);
            getAllAttributes().then(setAllAttributes).catch(console.error);
        }
    }, [showProductModal]);

    const openProductModal = async (product?: Product) => {
        try {
            const [cats, attrs] = await Promise.all([
                fetchCategories(),
                getAllAttributes(),
            ]);
            setCategories(cats);
            setAllAttributes(attrs);

            if (product) {
                const matchedCat = cats.find(
                    (c) => c.name.toLowerCase() === (product.category || '').toLowerCase()
                );

                setEditingProduct(product);
                setProductFormData({
                    name: product.name,
                    price: product.price,
                    description: product.shortDescription || product.longDescription || '',
                    imageUrl: product.image,
                    active: product.inStock ?? true,
                    categoryId: matchedCat?.id,
                    attributes: (product.attributes || []).map((pa) => ({
                        attributeId: pa.attributeId,
                        value: pa.value,
                    })),
                });
            } else {
                setEditingProduct(null);
                setProductFormData({
                    name: '',
                    price: 0,
                    description: '',
                    imageUrl: '',
                    active: true,
                    categoryId: undefined,
                    attributes: [],
                });
            }
        } catch (err) {
            console.error('Failed to load form data:', err);
        }
        setShowProductModal(true);
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (productFormData.attributes?.some(attr => !attr.value || attr.value.trim() === '')) {
            alert('Attribute values cannot be empty. Please fill in all attributes or remove them.');
            return;
        }

        setProductSaving(true);
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, productFormData);
            } else {
                await createProduct(productFormData);
            }
            setShowProductModal(false);
            onRefresh();
            window.dispatchEvent(new Event('product-data-changed'));
            alert(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        } catch (err: any) {
            console.error('Save product failed:', err);
            alert(err.message || 'Failed to save product');
        } finally {
            setProductSaving(false);
        }
    };

    const handleDeleteProduct = async (product: Product) => {
        if (!confirm(`Delete "${product.name}"?`)) return;
        try {
            await deleteProduct(product.id);
            onRefresh();
            window.dispatchEvent(new Event('product-data-changed'));
        } catch (err: any) {
            console.error('Delete product failed:', err);
            alert(err.message || 'Failed to delete product');
        }
    };

    const openThresholdModal = async (product: Product) => {
        setThresholdProduct(product);
        setThresholdValues({});
        setShowThresholdModal(true);
        try {
            const productInventories = await logisticsApi.getProductInventory(Number(product.id));
            setInventoryThresholds(productInventories);

            const initialValues: { [key: number]: number } = {};
            productInventories.forEach(inv => {
                initialValues[inv.warehouseId] = inv.threshold;
            });
            setThresholdValues(initialValues);
        } catch (err) {
            console.error('Failed to load threshold data:', err);
        }
    };

    const handleSaveThresholds = async () => {
        if (!thresholdProduct) return;
        setThresholdSaving(true);
        try {
            // Save each modified threshold sequentially
            for (const inv of inventoryThresholds) {
                const newValue = thresholdValues[inv.warehouseId];
                if (newValue !== undefined) {
                    await logisticsApi.setProductThreshold({
                        productId: Number(thresholdProduct.id),
                        warehouseId: inv.warehouseId,
                        lowStockThreshold: newValue
                    });
                }
            }
            setShowThresholdModal(false);
            onRefresh();
            alert('Thresholds updated successfully');
        } catch (err: any) {
            console.error('Failed to save thresholds:', err);
            alert(err.message || 'Failed to save thresholds');
        } finally {
            setThresholdSaving(false);
        }
    };

    const columns = useMemo<ColumnDef<Product, any>[]>(
        () => [
            {
                id: 'preview',
                header: 'Preview',
                enableSorting: false,
                cell: ({ row }) => (
                    <div className="w-12 h-12 bg-gray-50 rounded-sm p-1 border border-gray-100 overflow-hidden">
                        <img
                            src={row.original.image}
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                    </div>
                ),
            },
            {
                accessorKey: 'name',
                header: 'Name',
                cell: ({ getValue }) => (
                    <span className="font-black text-slate-900 text-xs">
                        {getValue() as string}
                    </span>
                ),
            },
            {
                accessorKey: 'price',
                header: 'Price',
                cell: ({ getValue }) => (
                    <span className="font-bold text-gray-400 text-xs">
                        ${getValue() as number}
                    </span>
                ),
            },
            {
                id: 'status',
                header: 'Status',
                accessorFn: (row) => (row.stockLevel || 0) > 0 ? 'In Stock' : 'Out',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <div
                            className={`w-1.5 h-1.5 rounded-full ${(row.original.stockLevel || 0) > 0
                                ? 'bg-green-500'
                                : 'bg-red-500'
                                }`}
                        />
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                            {(row.original.stockLevel || 0) > 0 ? 'In Stock' : 'Out'}
                        </span>
                    </div>
                ),
            },
            {
                id: 'actions',
                header: () => <span className="text-right w-full block">Actions</span>,
                enableSorting: false,
                cell: ({ row }) => (
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => openThresholdModal(row.original)}
                            className="p-2 text-gray-300 hover:text-blue-500 transition-colors"
                            title="Set Inventory Thresholds"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="m3 15 2 2 4-4" /></svg>
                        </button>
                        <button
                            onClick={() => openProductModal(row.original)}
                            className="p-2 text-gray-300 hover:text-slate-900 transition-colors"
                        >
                            <Edit3 size={16} />
                        </button>
                        <button
                            onClick={() => handleDeleteProduct(row.original)}
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                    Live Inventory Catalog
                </h3>
                <button
                    onClick={() => openProductModal()}
                    className="bg-slate-900 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all"
                >
                    <Plus size={14} /> New Product
                </button>
            </div>
            <DataGrid<Product>
                data={products}
                columns={columns}
                loading={loading}
                emptyMessage="No products found"
                loadingMessage="Loading products..."
            />

            {showProductModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-sm shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                                {editingProduct ? 'Edit Product' : 'New Product'}
                            </h3>
                            <button
                                onClick={() => setShowProductModal(false)}
                                className="text-gray-400 hover:text-slate-900"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleProductSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                                        Product Reference
                                    </label>
                                    <input
                                        type="text"
                                        value={productFormData.name}
                                        onChange={(e) =>
                                            setProductFormData({
                                                ...productFormData,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-xs font-bold text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                                            Base Price
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                value={productFormData.price}
                                                onChange={(e) =>
                                                    setProductFormData({
                                                        ...productFormData,
                                                        price: parseFloat(e.target.value),
                                                    })
                                                }
                                                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-xs font-bold text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                                            Image URL
                                        </label>
                                        <input
                                            type="url"
                                            value={productFormData.imageUrl}
                                            onChange={(e) =>
                                                setProductFormData({
                                                    ...productFormData,
                                                    imageUrl: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-xs font-bold text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                                        Description
                                    </label>
                                    <textarea
                                        value={productFormData.description}
                                        onChange={(e) =>
                                            setProductFormData({
                                                ...productFormData,
                                                description: e.target.value,
                                            })
                                        }
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-xs font-bold text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                                        Category
                                    </label>
                                    <select
                                        value={productFormData.categoryId ?? ''}
                                        onChange={(e) =>
                                            setProductFormData({
                                                ...productFormData,
                                                categoryId: e.target.value ? Number(e.target.value) : undefined,
                                            })
                                        }
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-xs font-bold text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                                    >
                                        <option value="">— No Category —</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.parentId
                                                    ? `  └ ${cat.name}`
                                                    : cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            Attributes
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setProductFormData({
                                                    ...productFormData,
                                                    attributes: [
                                                        ...(productFormData.attributes || []),
                                                        { attributeId: allAttributes[0]?.id || 0, value: '' },
                                                    ],
                                                })
                                            }
                                            className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                                        >
                                            <Plus size={10} /> Add Attribute
                                        </button>
                                    </div>
                                    {(productFormData.attributes || []).map((attr, idx) => (
                                        <div key={idx} className="flex gap-2 mb-2 items-center">
                                            <select
                                                value={attr.attributeId}
                                                onChange={(e) => {
                                                    const updated = [...(productFormData.attributes || [])];
                                                    updated[idx] = { ...updated[idx], attributeId: Number(e.target.value) };
                                                    setProductFormData({ ...productFormData, attributes: updated });
                                                }}
                                                className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-sm text-xs font-bold text-slate-900 outline-none"
                                            >
                                                {allAttributes.map((a) => (
                                                    <option key={a.id} value={a.id}>
                                                        {a.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                value={attr.value}
                                                onChange={(e) => {
                                                    const updated = [...(productFormData.attributes || [])];
                                                    updated[idx] = { ...updated[idx], value: e.target.value };
                                                    setProductFormData({ ...productFormData, attributes: updated });
                                                }}
                                                placeholder="Value"
                                                className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-sm text-xs font-bold text-slate-900 outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = (productFormData.attributes || []).filter((_, i) => i !== idx);
                                                    setProductFormData({ ...productFormData, attributes: updated });
                                                }}
                                                className="text-red-400 hover:text-red-600 p-1"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {(productFormData.attributes || []).length === 0 && (
                                        <p className="text-[9px] text-gray-400 italic">No attributes added</p>
                                    )}
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowProductModal(false)}
                                    className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-slate-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={productSaving}
                                    className="bg-slate-900 text-white px-8 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                                >
                                    {productSaving
                                        ? (editingProduct ? 'Saving...' : 'Creating...')
                                        : (editingProduct ? 'Save Product' : 'Create Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showThresholdModal && thresholdProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">Set Thresholds</h2>
                                <p className="text-sm font-medium text-gray-400 mt-1">{thresholdProduct.name}</p>
                            </div>
                            <button
                                onClick={() => setShowThresholdModal(false)}
                                className="p-2 text-gray-400 hover:text-slate-900 transition-colors rounded-full hover:bg-white"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            <p className="text-xs text-gray-500 mb-6 font-medium leading-relaxed">
                                Define the minimum stock level for each warehouse. When the inventory drops below this number, the product will appear in the Replenishment tab. Set to 0 to disable alerting.
                            </p>

                            {inventoryThresholds.length === 0 ? (
                                <div className="text-center py-4 rounded-lg bg-gray-50 border border-dashed border-gray-200 text-sm font-medium text-gray-500">
                                    Loading warehouses...
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {inventoryThresholds.map(inv => (
                                        <div key={inv.warehouseId} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{inv.warehouseName}</div>
                                                <div className={`text-xs font-medium mt-0.5 ${inv.stock > 0 ? 'text-gray-400' : 'text-red-400'}`}>
                                                    Current Stock: {inv.stock}
                                                </div>
                                            </div>
                                            <div className="w-24">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="0"
                                                    value={thresholdValues[inv.warehouseId] ?? ''}
                                                    onChange={e => setThresholdValues({
                                                        ...thresholdValues,
                                                        [inv.warehouseId]: parseInt(e.target.value) || 0
                                                    })}
                                                    className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-center"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
                            <button
                                type="button"
                                onClick={() => setShowThresholdModal(false)}
                                className="h-11 px-6 text-sm font-bold text-gray-500 hover:text-slate-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveThresholds}
                                disabled={thresholdSaving}
                                className="h-11 px-8 bg-slate-900 hover:bg-slate-800 text-white text-sm font-black tracking-wide flex items-center gap-2 transition-all disabled:opacity-50"
                            >
                                {thresholdSaving ? 'SAVING...' : 'SAVE THRESHOLDS'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
