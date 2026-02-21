
import React, { useState } from 'react';
import {
    Package,
    Layers,
    Users,
    Plus,
    Trash2,
    Edit3,
    Search,
    MoreVertical,
    ArrowUpRight,
    ShieldCheck,
    Briefcase
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../constants';

type AdminTab = 'products' | 'categories' | 'users' | 'employees';

const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('products');
    const [searchQuery, setSearchQuery] = useState('');

    const StatCard = ({ label, value, trend }: { label: string, value: string, trend?: string }) => (
        <div className="bg-gray-50/50 border border-gray-100 p-6 rounded-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{label}</p>
            <div className="flex items-baseline gap-3">
                <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
                {trend && <span className="text-[10px] font-bold text-green-500 flex items-center gap-0.5"><ArrowUpRight size={10} /> {trend}</span>}
            </div>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-10">
            {/* Admin Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Control Center</h1>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Management dashboard for Mers</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="bg-gray-50 border-none px-11 py-3 text-xs rounded-sm w-64 focus:ring-1 ring-slate-900 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="bg-[#0c121e] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-slate-800 transition-all flex items-center gap-2">
                        <Plus size={14} /> Add New
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                <StatCard label="Total Products" value="128" trend="+12%" />
                <StatCard label="Categories" value="11" />
                <StatCard label="Active Staff" value="24" trend="+2" />
                <StatCard label="Total Users" value="1.2k" trend="+18%" />
            </div>

            {/* Management Tabs */}
            <div className="flex border-b border-gray-100 mb-8">
                {[
                    { id: 'products', label: 'Products', icon: Package },
                    { id: 'categories', label: 'Categories', icon: Layers },
                    { id: 'users', label: 'Customers', icon: Users },
                    { id: 'employees', label: 'Employees', icon: Briefcase },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as AdminTab)}
                        className={`flex items-center gap-2 px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 -mb-[2px]
              ${activeTab === tab.id
                                ? 'border-slate-900 text-slate-900'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                            }
            `}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Table */}
            <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm">
                {activeTab === 'products' && (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {PRODUCTS.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                                                <img src={product.image} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-800">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">{product.category}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900">${product.price.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full ${product.inStock ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit3 size={16} /></button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'categories' && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {CATEGORIES.map((cat) => (
                                <div key={cat} className="group border border-gray-100 p-6 rounded-sm flex items-center justify-between hover:border-slate-900 transition-all bg-white">
                                    <div>
                                        <h5 className="text-sm font-bold text-slate-900">{cat}</h5>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">12 Products</p>
                                    </div>
                                    <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button className="border-2 border-dashed border-gray-100 p-6 rounded-sm flex flex-col items-center justify-center gap-2 hover:border-gray-200 transition-all text-gray-300 hover:text-gray-400">
                                <Plus size={24} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">New Category</span>
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Join Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Orders</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { name: 'Jonathon Alex', email: 'johnalex@gmail.com', date: 'Oct 12, 2024', orders: 12 },
                                { name: 'Sarah Wilson', email: 'sarah.w@outlook.com', date: 'Nov 02, 2024', orders: 5 },
                                { name: 'Marcus Chen', email: 'm.chen@gmail.com', date: 'Jan 15, 2025', orders: 24 },
                            ].map((user, i) => (
                                <tr key={i} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-800">{user.name}</span>
                                            <span className="text-[10px] text-gray-400 font-medium">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">{user.date}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-900">{user.orders}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-gray-300 hover:text-slate-900"><MoreVertical size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'employees' && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { name: 'Anna Novak', role: 'Store Manager', email: 'anna@mers.com' },
                            { name: 'Piotr Smith', role: 'Inventory Specialist', email: 'piotr@mers.com' },
                            { name: 'Elena Garcia', role: 'Customer Support', email: 'elena@mers.com' },
                        ].map((staff, i) => (
                            <div key={i} className="border border-gray-100 p-6 rounded-sm bg-gray-50/30">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-white border border-gray-100 rounded-full flex items-center justify-center font-bold text-slate-400">
                                        {staff.name.charAt(0)}
                                    </div>
                                    <span className="bg-[#0c121e] text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-sm">Staff</span>
                                </div>
                                <h5 className="text-sm font-bold text-slate-900">{staff.name}</h5>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 mb-4">{staff.role}</p>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium pb-4 border-b border-gray-100">
                                    <ShieldCheck size={12} className="text-green-500" /> Administrative Access
                                </div>
                                <div className="pt-4 flex justify-between items-center">
                                    <span className="text-[10px] text-gray-400 lowercase">{staff.email}</span>
                                    <button className="text-xs font-bold text-slate-900 hover:underline">Edit</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
