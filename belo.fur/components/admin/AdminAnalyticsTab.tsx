import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, FileText, CheckCircle2, BarChart3 } from 'lucide-react';
import { Product } from '../../api/types';
import { User, getAllUsers } from '../../api/adminApi';
import * as logisticsApi from '../../api/logisticsApi';
import { fetchProducts } from '../../api/productApi';
import PowerBIReport from '../PowerBIReport';

const statusColorMap: Record<string, string> = {
    'Draft': 'bg-gray-200 text-gray-600',
    'Submitted': 'bg-yellow-200 text-yellow-700',
    'Confirmed': 'bg-green-200 text-green-700',
    'PartiallyReceived': 'bg-orange-200 text-orange-700',
    'FullyReceived': 'bg-emerald-200 text-emerald-700',
    'InDelivery': 'bg-blue-200 text-blue-700',
    'Cancelled': 'bg-red-200 text-red-600',
};

const formatStatus = (name: string): string =>
    name.replace(/([A-Z])/g, ' $1').trim();

export const AdminAnalyticsTab: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [purchaseOrders, setPurchaseOrders] = useState<logisticsApi.SupplyOrder[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [showPowerBI, setShowPowerBI] = useState(true); // Default to Power BI, can toggle back

    useEffect(() => {
        const loadData = async () => {
            try {
                const [prodsData, posData, usersData] = await Promise.all([
                    fetchProducts(),
                    logisticsApi.getSupplyOrders(),
                    getAllUsers(),
                ]);
                setProducts(prodsData);
                setPurchaseOrders(posData);
                setUsers(usersData);
            } catch (err) {
                console.error('Failed to load analytics data:', err);
            }
        };
        loadData();
    }, []);

    // Compute real analytics from loaded data
    const inventoryValue = products.reduce((s, p) => s + (p.price || 0) * (p.stockLevel || 0), 0);
    const activeProducts = products.filter(p => p.isActive).length;
    const lowStockCount = products.filter(p => (p.stockLevel || 0) <= (p.stockThreshold || 5)).length;
    const totalPOs = purchaseOrders.length;

    // PO status breakdown
    const poStatusCounts: Record<string, number> = {};
    purchaseOrders.forEach(po => {
        const label = po.statusName || 'Unknown';
        poStatusCounts[label] = (poStatusCounts[label] || 0) + 1;
    });

    // User role breakdown
    const userRoleCounts: Record<string, number> = {};
    users.forEach(u => {
        userRoleCounts[u.role] = (userRoleCounts[u.role] || 0) + 1;
    });

    const fulfillmentRate = totalPOs > 0
        ? Math.round(((poStatusCounts['FullyReceived'] || 0) / totalPOs) * 100)
        : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setShowPowerBI(!showPowerBI)}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 border border-gray-200 px-3 py-1.5 rounded-sm transition-all"
                >
                    {showPowerBI ? 'Switch to Legacy Analytics' : 'Switch to Power BI'}
                </button>
            </div>

            {showPowerBI ? (
                <PowerBIReport
                    reportId="YOUR_REPORT_ID"
                    embedUrl="https://app.powerbi.com/reportEmbed?reportId=YOUR_REPORT_ID"
                    accessToken="YOUR_ACCESS_TOKEN"
                />
            ) : (
                <div className="space-y-8">
                    {/* OLD ANALYTICS CODE PRESERVED BELOW */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            {
                                label: 'Inventory Value',
                                val: `$${inventoryValue.toLocaleString()}`,
                                sub: `${activeProducts} active products`,
                                icon: TrendingUp,
                                color: 'text-slate-900',
                            },
                            {
                                label: 'Total Products',
                                val: `${products.length}`,
                                sub: `${lowStockCount} low stock`,
                                icon: Package,
                                color: lowStockCount > 0 ? 'text-amber-600' : 'text-green-600',
                            },
                            {
                                label: 'Purchase Orders',
                                val: `${totalPOs}`,
                                sub: `${poStatusCounts['Confirmed'] || 0} confirmed`,
                                icon: FileText,
                                color: 'text-blue-600',
                            },
                            {
                                label: 'Fulfillment Rate',
                                val: `${fulfillmentRate}%`,
                                sub: `${poStatusCounts['FullyReceived'] || 0} completed`,
                                icon: CheckCircle2,
                                color: fulfillmentRate >= 80 ? 'text-green-600' : 'text-amber-600',
                            },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm flex flex-col justify-between group hover:border-slate-900 transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <stat.icon
                                        size={20}
                                        className="text-slate-900 group-hover:scale-110 transition-transform"
                                    />
                                    <span className={`text-[10px] font-black ${stat.color}`}>
                                        {stat.sub}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-slate-900">
                                        {stat.val}
                                    </h4>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* PO Status Breakdown */}
                        <div className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6">
                                Purchase Order Status Breakdown
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(poStatusCounts).map(([status, count]) => {
                                    const pct = totalPOs > 0 ? Math.round((count / totalPOs) * 100) : 0;
                                    const barColor = statusColorMap[status]?.split(' ')[0] || 'bg-gray-200';
                                    return (
                                        <div key={status}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                                                    {formatStatus(status)}
                                                </span>
                                                <span className="text-[9px] font-black text-slate-900">
                                                    {count} ({pct}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-sm h-2">
                                                <div className={`h-2 rounded-sm transition-all duration-700 ${barColor}`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                                {totalPOs === 0 && (
                                    <p className="text-[10px] text-gray-400 text-center py-4">No purchase orders yet</p>
                                )}
                            </div>
                        </div>

                        {/* User Role Breakdown */}
                        <div className="bg-[#0c121e] text-white p-8 rounded-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <BarChart3 size={150} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest opacity-60 mb-6">
                                User Role Distribution
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(userRoleCounts).map(([role, count]) => (
                                    <div key={role} className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                                            {role}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 bg-white/10 rounded-sm h-2">
                                                <div
                                                    className="h-2 rounded-sm bg-indigo-500 transition-all duration-700"
                                                    style={{ width: `${users.length > 0 ? Math.round((count / users.length) * 100) : 0}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-black">{count}</span>
                                        </div>
                                    </div>
                                ))}
                                {users.length === 0 && (
                                    <p className="text-[10px] opacity-40 text-center py-4">No users loaded</p>
                                )}
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">
                                    Total Users
                                </span>
                                <span className="text-3xl font-black tracking-tighter">
                                    {users.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
