// Zmienione EN
import React, { useState, useEffect } from 'react';
import {
    Package, Layers, Users, Plus, Search,
    ShieldCheck, Truck,
    BarChart3, PackageCheck, ClipboardList,
    ArrowRightLeft,
    Download, AlertTriangle,
    BoxSelect, ShoppingCart, X
} from 'lucide-react';
import { fetchCategories, createCategory, CategoryFromApi } from '../api/categoryApi';
import { Product } from '../api/types';
import { User } from '../api/adminApi';
import {
    fetchProducts,
} from '../api/productApi';
import * as attributeApi from '../api/attributeApi';
import { AdminProductsTab } from './admin/AdminProductsTab';
import { AdminUsersTab } from './admin/AdminUsersTab';
import { AdminLogisticsTab } from './admin/AdminLogisticsTab';
import { AdminReturnsTab } from './admin/AdminReturnsTab';
import { AdminAttributesTab } from './admin/AdminAttributesTab';
import { AdminAnalyticsTab } from './admin/AdminAnalyticsTab';
import { AdminFulfillmentTab } from './admin/AdminFulfillmentTab';

const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('products');

    // Products from API (shared: ProductsTab, Inventory tab, LogisticsTab)
    const [products, setProducts] = useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = useState(false);

    // Users State (for AdminUsersTab + User Edit Modal)
    const [users, setUsers] = useState<User[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);

    // User Edit Modal State
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userSaving, setUserSaving] = useState(false);
    const originalUserRef = React.useRef<User | null>(null);

    // Create Attribute Modal State
    const [showCreateAttributeModal, setShowCreateAttributeModal] = useState(false);
    const [createAttributeData, setCreateAttributeData] = useState({
        name: '',
        dataType: 'string',
        unit: '',
    });
    const [createAttributeLoading, setCreateAttributeLoading] = useState(false);

    // Categories State (inline tab)
    const [categoriesList, setCategoriesList] = useState<CategoryFromApi[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryParentId, setNewCategoryParentId] = useState<number | null>(null);
    const [createCategoryLoading, setCreateCategoryLoading] = useState(false);

    // Time Simulation State
    const [simEnabled, setSimEnabled] = useState(false);
    const [simDays, setSimDays] = useState(0);
    const simIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
    const [initialPoProduct, setInitialPoProduct] = useState<{ productId: number; quantity: number } | null>(null);

    useEffect(() => {
        if (simEnabled) {
            setSimDays(0);
            simIntervalRef.current = setInterval(() => {
                setSimDays((d) => d + 1);
            }, 1000);
        } else {
            if (simIntervalRef.current) clearInterval(simIntervalRef.current);
            simIntervalRef.current = null;
        }
        return () => {
            if (simIntervalRef.current) clearInterval(simIntervalRef.current);
        };
    }, [simEnabled]);

    // Load products on mount
    const loadProducts = async () => {
        setProductsLoading(true);
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (err) {
            console.error('Failed to load products:', err);
        } finally {
            setProductsLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Load users when customers/employees tab is active
    useEffect(() => {
        if (activeTab === 'customers' || activeTab === 'employees') {
            const loadUsers = async () => {
                setUsersLoading(true);
                try {
                    const { getAllUsers } = await import('../api/adminApi');
                    const data = await getAllUsers();
                    setUsers(data);
                } catch (err) {
                    console.error('Failed to load users:', err);
                } finally {
                    setUsersLoading(false);
                }
            };
            loadUsers();
        }

        if (activeTab === 'categories') {
            const loadCats = async () => {
                setCategoriesLoading(true);
                try {
                    const data = await fetchCategories();
                    setCategoriesList(data);
                } catch (err) {
                    console.error('Failed to load categories:', err);
                } finally {
                    setCategoriesLoading(false);
                }
            };
            loadCats();
        }
    }, [activeTab]);

    // ================================================================
    // HANDLERS
    // ================================================================

    // Handle Create Attribute
    const handleCreateAttribute = async () => {
        if (!createAttributeData.name) return;
        setCreateAttributeLoading(true);
        try {
            await attributeApi.createAttribute(createAttributeData);
            setShowCreateAttributeModal(false);
            setCreateAttributeData({ name: '', dataType: 'string', unit: '' });
        } catch (err) {
            console.error('Create attribute failed:', err);
            alert('Failed to create attribute');
        } finally {
            setCreateAttributeLoading(false);
        }
    };

    // Handle User Save
    const handleSaveUser = async (updatedUser: User) => {
        const original = originalUserRef.current;
        if (!original) return;
        setUserSaving(true);
        try {
            const { updateUser, setUserRole, setUserActive, getAllUsers } = await import('../api/adminApi');

            // Always update name fields
            await updateUser(updatedUser.id, {
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
            });

            // Compare against the ORIGINAL user (before edits), not current state
            if (updatedUser.role !== original.role) {
                const roleIdMap: Record<string, number> = { 'Admin': 1, 'Customer': 2, 'Employee': 3, 'Supplier': 4 };
                const newRoleId = roleIdMap[updatedUser.role];
                if (newRoleId) {
                    await setUserRole(updatedUser.id, newRoleId);
                }
            }

            if (updatedUser.isActive !== original.isActive) {
                await setUserActive(updatedUser.id, updatedUser.isActive);
            }

            alert('User updated successfully');
            setShowUserModal(false);
            setEditingUser(null);
            originalUserRef.current = null;

            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error('Failed to update user:', err);
            alert('Failed to update user');
        } finally {
            setUserSaving(false);
        }
    };

    // Open Create PO with pre-selected product (from Inventory tab)
    const openCreatePoWithProduct = (productId: number, requiredQty: number) => {
        setInitialPoProduct({ productId, quantity: requiredQty });
        setActiveTab('logistics');
    };

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-10">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-gray-100 pb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                        System Command
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Node ID: NYC-BELO-01
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-600">
                            Secure Protocol Active
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                        <Download size={14} /> System Logs
                    </button>
                    <div className="relative">
                        <Search
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                        />
                        <input
                            type="text"
                            placeholder="Query database..."
                            className="bg-white border border-gray-100 px-11 py-3 text-xs rounded-sm w-64 focus:ring-1 ring-slate-900 outline-none shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* NAVIGATION TABS */}
            <div className="flex flex-wrap gap-1 border-b border-gray-100 mb-10">
                {[
                    { id: 'products', label: 'Products', icon: Package },
                    { id: 'categories', label: 'Categories', icon: Layers },
                    { id: 'customers', label: 'Customers', icon: Users },
                    { id: 'employees', label: 'Employees', icon: ShieldCheck },
                    { id: 'inventory', label: 'Asset Stock', icon: BoxSelect },
                    { id: 'logistics', label: 'Logistics Hub', icon: Truck },
                    { id: 'fulfillment', label: 'Order Fulfillment', icon: PackageCheck },
                    { id: 'attributes', label: 'Attributes', icon: ClipboardList },
                    { id: 'returns', label: 'Returns', icon: ArrowRightLeft },
                    { id: 'analytics', label: 'BI Analytics', icon: BarChart3 },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 shrink-0 ${activeTab === tab.id
                            ? 'border-slate-900 text-slate-900'
                            : 'border-transparent text-gray-400 hover:text-slate-600'
                            }`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="animate-in fade-in duration-500">
                {/* ============================================ */}
                {/* PRODUCTS TAB */}
                {/* ============================================ */}
                {/* ============================================ */}
                {/* PRODUCTS TAB */}
                {/* ============================================ */}
                {activeTab === 'products' && (
                    <AdminProductsTab
                        products={products}
                        loading={productsLoading}
                        onRefresh={loadProducts}
                    />
                )}

                {/* ============================================ */}
                {/* CATEGORIES TAB */}
                {/* ============================================ */}
                {activeTab === 'categories' && (
                    <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                                Category Catalog
                            </h3>
                            <button
                                onClick={() => setShowCreateCategoryModal(true)}
                                className="bg-slate-900 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all"
                            >
                                <Plus size={14} /> New Category
                            </button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-white border-b border-gray-50 text-[9px] font-black uppercase text-gray-400">
                                <tr>
                                    <th className="px-8 py-4">ID</th>
                                    <th className="px-8 py-4">Name</th>
                                    <th className="px-8 py-4">Parent</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {categoriesLoading ? (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-10 text-center text-gray-400">
                                            Loading categories...
                                        </td>
                                    </tr>
                                ) : categoriesList.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-10 text-center text-gray-400">
                                            No categories found
                                        </td>
                                    </tr>
                                ) : (
                                    categoriesList.map((cat) => (
                                        <tr key={cat.id} className="hover:bg-gray-50/20 transition-colors text-xs">
                                            <td className="px-8 py-4 font-bold text-gray-400">#{cat.id}</td>
                                            <td className="px-8 py-4 font-black text-slate-900">{cat.name}</td>
                                            <td className="px-8 py-4 text-gray-400">
                                                {cat.parentId
                                                    ? categoriesList.find((c) => c.id === cat.parentId)?.name || `#${cat.parentId}`
                                                    : <span className="text-[8px] font-black uppercase tracking-widest text-green-600">Root</span>
                                                }
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ============================================ */}
                {/* CUSTOMERS + EMPLOYEES TABS */}
                {/* ============================================ */}
                {(activeTab === 'customers' || activeTab === 'employees') && (
                    <AdminUsersTab
                        users={users}
                        loading={usersLoading}
                        isAdmin={true}
                        activeTab={activeTab as 'customers' | 'employees'}
                        onRefresh={(data) => setUsers(data)}
                        onEditUser={(u) => {
                            originalUserRef.current = { ...u }; // Save original before editing
                            setEditingUser({ ...u });
                            setShowUserModal(true);
                        }}
                    />
                )}

                {/* ============================================ */}
                {/* ASSET STOCK TAB */}
                {/* ============================================ */}
                {activeTab === 'inventory' && (
                    <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                        <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                            {(() => {
                                const criticalCount = products.filter(
                                    (p) =>
                                        (p.stockLevel || 0) <= (p.stockThreshold || 5)
                                ).length;
                                return criticalCount > 0 ? (
                                    <div className="px-3 py-1.5 bg-red-50 border border-red-100 rounded-sm flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-red-600">
                                            Replenishment Alert: {criticalCount} Asset
                                            {criticalCount !== 1 ? 's' : ''} Critical
                                        </span>
                                    </div>
                                ) : (
                                    <div className="px-3 py-1.5 bg-green-50 border border-green-100 rounded-sm flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-green-600">
                                            All Stock Levels Healthy
                                        </span>
                                    </div>
                                );
                            })()}
                            <button className="text-[10px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-0.5">
                                Export Inventory Ledger
                            </button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-white text-[9px] font-black uppercase text-gray-400 border-b border-gray-50">
                                <tr>
                                    <th className="px-8 py-5">Asset Descriptor</th>
                                    <th className="px-8 py-5 text-center">Current</th>
                                    <th className="px-8 py-5 text-center">Target Min</th>
                                    <th className="px-8 py-5">Health Status</th>
                                    <th className="px-8 py-5 text-right">Supply Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {productsLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-10 text-center text-gray-400">
                                            Loading inventory...
                                        </td>
                                    </tr>
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-10 text-center text-gray-400">
                                            No inventory data
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((p) => {
                                        const isLow = (p.stockLevel || 0) <= (p.stockThreshold || 5);
                                        const needToOrder = Math.max(0, (p.stockThreshold || 5) - (p.stockLevel || 0));
                                        return (
                                            <tr key={p.id} className="hover:bg-gray-50/20 text-xs transition-colors">
                                                <td className="px-8 py-5 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-sm bg-gray-50 p-1">
                                                        <img src={p.image} className="w-full h-full object-contain" />
                                                    </div>
                                                    <span className="font-black text-slate-900">{p.name}</span>
                                                </td>
                                                <td className="px-8 py-5 text-center font-bold">
                                                    {p.stockLevel || 0}{' '}
                                                    <span className="text-[9px] text-gray-400 uppercase">Qty</span>
                                                </td>
                                                <td className="px-8 py-5 text-center text-gray-400 font-bold">
                                                    {p.stockThreshold || 10}
                                                </td>
                                                <td className="px-8 py-5">
                                                    {(() => {
                                                        const stock = p.stockLevel || 0;
                                                        const threshold = p.stockThreshold || 5;
                                                        const maxDisplay = Math.max(threshold * 3, stock, 50);
                                                        const pct = Math.min(Math.round((stock / maxDisplay) * 100), 100);
                                                        const ratio = stock / threshold;
                                                        let barColor = 'bg-red-500';
                                                        let label = 'Critical';
                                                        let textColor = 'text-red-600';
                                                        if (ratio >= 2) { barColor = 'bg-green-500'; label = 'Optimal'; textColor = 'text-green-600'; }
                                                        else if (ratio >= 1) { barColor = 'bg-emerald-400'; label = 'Good'; textColor = 'text-emerald-600'; }
                                                        else if (ratio >= 0.5) { barColor = 'bg-yellow-400'; label = 'Low'; textColor = 'text-yellow-600'; }
                                                        return (
                                                            <div className="flex flex-col gap-2">
                                                                <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div className={`h-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
                                                                </div>
                                                                <span className={`text-[8px] font-black uppercase tracking-tighter ${textColor}`}>
                                                                    {label}
                                                                </span>
                                                            </div>
                                                        );
                                                    })()}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    {needToOrder > 0 ? (
                                                        <button
                                                            onClick={() => openCreatePoWithProduct(parseInt(p.id), needToOrder)}
                                                            className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-900 transition-all underline flex items-center gap-2 justify-end"
                                                        >
                                                            <ShoppingCart size={12} /> Create PO ({needToOrder} Units)
                                                        </button>
                                                    ) : (
                                                        <span className="text-[9px] font-black uppercase text-gray-300">Monitored</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ============================================ */}
                {/* LOGISTICS HUB (PO / GR) */}
                {/* ============================================ */}
                {activeTab === 'logistics' && (
                    <AdminLogisticsTab
                        products={products}
                        simEnabled={simEnabled}
                        simDays={simDays}
                        initialPoProduct={initialPoProduct}
                        onInitialPoConsumed={() => setInitialPoProduct(null)}
                    />
                )}

                {/* ============================================ */}
                {/* RETURNS TAB */}
                {/* ============================================ */}
                {activeTab === 'returns' && <AdminReturnsTab />}

                {/* ============================================ */}
                {/* BI ANALYTICS */}
                {/* ============================================ */}
                {activeTab === 'analytics' && (
                    <AdminAnalyticsTab />
                )}

                {/* ============================================ */}
                {/* ORDER FULFILLMENT TAB */}
                {/* ============================================ */}
                {activeTab === 'fulfillment' && (
                    <AdminFulfillmentTab simEnabled={simEnabled} simDays={simDays} />
                )}

                {/* ============================================ */}
                {/* ATTRIBUTES TAB */}
                {/* ============================================ */}
                {activeTab === 'attributes' && (
                    <AdminAttributesTab onCreateAttribute={() => setShowCreateAttributeModal(true)} />
                )}

            </div>

            {/* ============================================ */}
            {/* USER EDIT MODAL */}
            {/* ============================================ */}
            {showUserModal && editingUser && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-black uppercase tracking-tight mb-6">
                            Edit User
                        </h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveUser(editingUser);
                            }}
                            className="space-y-6"
                        >
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        value={editingUser.firstName}
                                        onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                                        required
                                        className="w-full border border-gray-200 p-3 text-sm font-bold outline-none focus:border-slate-900"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        value={editingUser.lastName}
                                        onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                                        required
                                        className="w-full border border-gray-200 p-3 text-sm font-bold outline-none focus:border-slate-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                    Email
                                </label>
                                <input
                                    value={editingUser.email}
                                    disabled
                                    className="w-full border border-gray-100 bg-gray-50 p-3 text-sm font-bold text-gray-400 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                    Role
                                </label>
                                <select
                                    value={editingUser.role}
                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                    className="w-full border border-gray-200 p-3 text-sm font-bold outline-none focus:border-slate-900 bg-white"
                                >
                                    {['Admin', 'Customer', 'Employee', 'Supplier'].map((r) => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={editingUser.isActive}
                                    onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="isActive" className="text-[10px] font-black uppercase tracking-widest text-slate-900 select-none cursor-pointer">
                                    User Active
                                </label>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowUserModal(false)}
                                    className="flex-1 py-3 border border-gray-200 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50"
                                    disabled={userSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black disabled:opacity-50"
                                    disabled={userSaving}
                                >
                                    {userSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================ */}
            {/* CREATE ATTRIBUTE MODAL */}
            {/* ============================================ */}
            {showCreateAttributeModal && (
                <div className="fixed inset-0 z-[200] bg-black/30 flex items-center justify-center">
                    <div className="bg-white w-full max-w-md p-8 shadow-xl">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6">
                            New Attribute
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[8px] font-black uppercase text-gray-400 block mb-1">Name *</label>
                                <input
                                    value={createAttributeData.name}
                                    onChange={(e) => setCreateAttributeData({ ...createAttributeData, name: e.target.value })}
                                    placeholder="e.g. Weight, Material"
                                    className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-slate-900"
                                />
                            </div>
                            <div>
                                <label className="text-[8px] font-black uppercase text-gray-400 block mb-1">Data Type</label>
                                <select
                                    value={createAttributeData.dataType}
                                    onChange={(e) => setCreateAttributeData({ ...createAttributeData, dataType: e.target.value })}
                                    className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-slate-900 bg-white"
                                >
                                    <option value="string">String</option>
                                    <option value="number">Number</option>
                                    <option value="boolean">Boolean</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[8px] font-black uppercase text-gray-400 block mb-1">Unit (optional)</label>
                                <input
                                    value={createAttributeData.unit}
                                    onChange={(e) => setCreateAttributeData({ ...createAttributeData, unit: e.target.value })}
                                    placeholder="e.g. kg, cm, pcs"
                                    className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-slate-900"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 pt-6">
                            <button
                                onClick={() => { setShowCreateAttributeModal(false); setCreateAttributeData({ name: '', dataType: 'string', unit: '' }); }}
                                className="flex-1 py-3 border border-gray-200 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateAttribute}
                                disabled={createAttributeLoading || !createAttributeData.name}
                                className="flex-1 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black disabled:opacity-50"
                            >
                                {createAttributeLoading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================ */}
            {/* CREATE CATEGORY MODAL */}
            {/* ============================================ */}
            {showCreateCategoryModal && (
                <div className="fixed inset-0 z-[200] bg-black/30 flex items-center justify-center">
                    <div className="bg-white w-full max-w-md p-8 shadow-xl">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6">
                            New Category
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[8px] font-black uppercase text-gray-400 block mb-1">Name *</label>
                                <input
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="e.g. Coffee Tables, Sofas"
                                    className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-slate-900"
                                />
                            </div>
                            <div>
                                <label className="text-[8px] font-black uppercase text-gray-400 block mb-1">Parent Category (optional)</label>
                                <select
                                    value={newCategoryParentId ?? ''}
                                    onChange={(e) => setNewCategoryParentId(e.target.value ? parseInt(e.target.value) : null)}
                                    className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-slate-900 bg-white"
                                >
                                    <option value=""> Root Category </option>
                                    {categoriesList.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4 pt-6">
                            <button
                                onClick={() => { setShowCreateCategoryModal(false); setNewCategoryName(''); setNewCategoryParentId(null); }}
                                className="flex-1 py-3 border border-gray-200 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (!newCategoryName) return;
                                    setCreateCategoryLoading(true);
                                    try {
                                        await createCategory(newCategoryName, newCategoryParentId);
                                        const data = await fetchCategories();
                                        setCategoriesList(data);
                                        setShowCreateCategoryModal(false);
                                        setNewCategoryName('');
                                        setNewCategoryParentId(null);
                                    } catch (err) {
                                        console.error('Create category failed:', err);
                                        alert('Failed to create category');
                                    } finally {
                                        setCreateCategoryLoading(false);
                                    }
                                }}
                                disabled={createCategoryLoading || !newCategoryName}
                                className="flex-1 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black disabled:opacity-50"
                            >
                                {createCategoryLoading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminPage;
