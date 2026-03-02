import React, { useState, useEffect } from 'react';
import {
    Inbox, Truck, Box, CheckCircle2, Clock, History,
    MoreVertical, Search, Download, Package, MapPin,
    ChevronRight, ArrowUpRight, Filter, AlertCircle, PlusCircle,
    FileText, Send, CheckCircle, PackageSearch, Calendar, X
} from 'lucide-react';
import * as logisticsApi from '../api/logisticsApi';

const SupplierPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'incoming' | 'fulfillment'>('incoming');

    const [orders, setOrders] = useState<logisticsApi.SupplyOrder[]>([]);
    const [shipments, setShipments] = useState<logisticsApi.ShipmentDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [visibleOrderCount, setVisibleOrderCount] = useState(20);
    const [visibleShipCount, setVisibleShipCount] = useState(20);

    const [simEnabled, setSimEnabled] = useState(() => {
        const stored = localStorage.getItem('retailen_sim_enabled');
        return stored ? JSON.parse(stored) : false;
    });
    const [simDays, setSimDays] = useState(() => {
        const stored = localStorage.getItem('retailen_sim_days');
        return stored ? parseInt(stored, 10) : 0;
    });
    const simIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

    const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; orderId: number; supplierId: number } | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'retailen_sim_enabled') {
                setSimEnabled(e.newValue ? JSON.parse(e.newValue) : false);
            }
            if (e.key === 'retailen_sim_days') {
                setSimDays(e.newValue ? parseInt(e.newValue, 10) : 0);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        if (simEnabled) {
            if (!localStorage.getItem('retailen_sim_days')) {
                setSimDays(0);
                localStorage.setItem('retailen_sim_days', '0');
            }
            if (simIntervalRef.current) clearInterval(simIntervalRef.current);
            simIntervalRef.current = setInterval(() => {
                setSimDays((d) => {
                    const newDays = d + 1;
                    localStorage.setItem('retailen_sim_days', newDays.toString());
                    return newDays;
                });
            }, 1000);
        } else {
            if (simIntervalRef.current) clearInterval(simIntervalRef.current);
            simIntervalRef.current = null;
        }
        return () => {
            if (simIntervalRef.current) clearInterval(simIntervalRef.current);
        };
    }, [simEnabled]);

    const handleSimToggle = () => {
        const newEnabled = !simEnabled;
        setSimEnabled(newEnabled);
        localStorage.setItem('retailen_sim_enabled', JSON.stringify(newEnabled));
        if (!newEnabled) {
            setSimDays(0);
            localStorage.setItem('retailen_sim_days', '0');
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const poData = await logisticsApi.getSupplierSupplyOrders();
                setOrders(poData.sort((a, b) => b.purchaseOrderId - a.purchaseOrderId));

                const shipData = await logisticsApi.getSupplierShipments();
                setShipments(shipData.sort((a, b) => b.shipmentId - a.shipmentId));
            } catch (err) {
                console.error('Failed to load supplier data:', err);
            } finally {
                setLoading(false);
            }
        };

        const silentRefresh = async () => {
            try {
                const poData = await logisticsApi.getSupplierSupplyOrders();
                setOrders(poData.sort((a, b) => b.purchaseOrderId - a.purchaseOrderId));
                const shipData = await logisticsApi.getSupplierShipments();
                setShipments(shipData.sort((a, b) => b.shipmentId - a.shipmentId));
            } catch (err) {
                console.error('Silent refresh failed:', err);
            }
        };

        loadData();

        const interval = setInterval(silentRefresh, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleConfirmOrder = async (orderId: number, supplierId: number) => {
        try {
            await logisticsApi.confirmSupplierOrder(supplierId, orderId);
            const poData = await logisticsApi.getSupplierSupplyOrders();
            setOrders(poData.sort((a, b) => b.purchaseOrderId - a.purchaseOrderId));
            alert('Order confirmed successfully!');
        } catch (err) {
            console.error('Failed to confirm order:', err);
            alert('Failed to confirm order. Please try again.');
        }
    };

    const handleRejectOrder = async () => {
        if (!rejectModal) return;
        const { orderId, supplierId } = rejectModal;

        if (!rejectReason.trim()) {
            alert('Please enter a rejection reason.');
            return;
        }

        try {
            await logisticsApi.rejectSupplierOrder(supplierId, orderId, rejectReason);
            const poData = await logisticsApi.getSupplierSupplyOrders();
            setOrders(poData.sort((a, b) => b.purchaseOrderId - a.purchaseOrderId));
            setRejectModal(null);
            setRejectReason('');
            alert('Order rejected.');
        } catch (err) {
            console.error('Failed to reject order:', err);
            alert('Failed to reject order. Please try again.');
        }
    };

    const handleDispatch = async (shipmentId: number) => {
        const trackingNumber = `TRK-${Date.now().toString(36).toUpperCase()}`;
        try {
            await logisticsApi.markShipped(shipmentId, trackingNumber, new Date().toISOString());
            const shipData = await logisticsApi.getSupplierShipments();
            setShipments(shipData.sort((a, b) => b.shipmentId - a.shipmentId));
            alert(`Shipment dispatched! Tracking: ${trackingNumber}`);
        } catch (err) {
            console.error('Failed to dispatch:', err);
            alert('Failed to dispatch. Please try again.');
        }
    };

    const calculateTotal = (order: logisticsApi.SupplyOrder) => {
        return order.items.reduce(
            (acc, item) => acc + (item.purchasePrice || 0) * item.quantityOrdered,
            0
        );
    };

    const generateManifest = () => {
        alert('Custom manifest generation coming soon!');
    };

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-gray-100 pb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                        Supplier Command
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Partner ID: SUP-GLOBAL-77
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                            Global Inventory Sync Active
                        </span>
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSimToggle}
                            className={`relative w-10 h-5 rounded-full transition-colors ${simEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${simEnabled ? 'translate-x-5' : ''}`} />
                        </button>
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                            Demo
                        </span>
                        {simEnabled && (
                            <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-[10px] font-black px-2.5 py-1 rounded-full animate-pulse">
                                <Calendar size={10} /> Day {simDays}
                            </span>
                        )}
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                        <Download size={14} /> Catalog Sync
                    </button>
                    <div className="relative">
                        <Search
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                        />
                        <input
                            type="text"
                            placeholder="Search logistics..."
                            className="bg-white border border-gray-100 px-11 py-3 text-xs rounded-sm w-64 focus:ring-1 ring-slate-900 outline-none shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-4 border-b border-gray-100 mb-10 overflow-x-auto scrollbar-hide">
                <button
                    onClick={() => setActiveTab('incoming')}
                    className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 shrink-0 ${activeTab === 'incoming'
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-gray-400 hover:text-slate-600'
                        }`}
                >
                    <Inbox size={14} /> Incoming Orders (PO)
                </button>
                <button
                    onClick={() => setActiveTab('fulfillment')}
                    className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 shrink-0 ${activeTab === 'fulfillment'
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-gray-400 hover:text-slate-600'
                        }`}
                >
                    <Truck size={14} /> Logistics Fulfillment
                </button>
            </div>

            <div className="animate-in fade-in duration-500">
                {activeTab === 'incoming' && (
                    <div className="space-y-8">
                        <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                            <div className="p-6 bg-indigo-50/30 border-b border-indigo-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <AlertCircle size={18} className="text-indigo-600" />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-900">
                                        Purchase Orders Awaiting Confirmation
                                    </h3>
                                </div>
                                <span className="text-[9px] font-black uppercase text-indigo-400">
                                    Total Pipeline Value: $
                                    {orders
                                        .reduce((sum, o) => sum + calculateTotal(o), 0)
                                        .toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                        })}
                                </span>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-white border-b border-gray-50 text-[9px] font-black uppercase text-gray-400">
                                    <tr>
                                        <th className="px-8 py-5">Order Reference</th>
                                        <th className="px-8 py-5">Products</th>
                                        <th className="px-8 py-5">Expected Date</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5 text-center">
                                            Financial Value
                                        </th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-8 py-10 text-center text-gray-400"
                                            >
                                                Loading orders...
                                            </td>
                                        </tr>
                                    ) : orders.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-8 py-10 text-center text-gray-400"
                                            >
                                                No orders awaiting confirmation
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.slice(0, visibleOrderCount).map((order) => {
                                            const totalUnits = order.items.reduce(
                                                (acc, p) => acc + p.quantityOrdered,
                                                0
                                            );
                                            return (
                                                <tr
                                                    key={order.purchaseOrderId}
                                                    className="hover:bg-gray-50/30 transition-colors text-xs"
                                                >
                                                    <td className="px-8 py-5 font-black text-slate-900">
                                                        PO-{order.purchaseOrderId}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex flex-col gap-1">
                                                            {order.items.slice(0, 2).map((p, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="text-[9px] font-bold text-slate-700 bg-gray-100 px-2 py-0.5 rounded-sm w-fit"
                                                                >
                                                                    {p.productName} x{p.quantityOrdered}
                                                                </span>
                                                            ))}
                                                            {order.items.length > 2 && (
                                                                <span className="text-[8px] text-gray-400 font-bold">
                                                                    +{order.items.length - 2} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-gray-400 font-bold">
                                                        <div className="flex flex-col gap-1">
                                                            <span>
                                                                {order.expectedDate
                                                                    ? new Date(
                                                                        order.expectedDate
                                                                    ).toLocaleDateString()
                                                                    : 'ASAP'}
                                                            </span>
                                                            {simEnabled && order.createdAt && (
                                                                <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-sm w-fit">
                                                                    +{simDays}d since created
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        {(() => {
                                                            const colorMap: Record<string, string> = {
                                                                'Draft': 'bg-gray-100 text-gray-500',
                                                                'SentToSupplier': 'bg-blue-50 text-blue-600',
                                                                'Confirmed': 'bg-green-50 text-green-600',
                                                                'InDelivery': 'bg-indigo-50 text-indigo-600',
                                                                'FullyReceived': 'bg-emerald-50 text-emerald-600',
                                                                'PartiallyReceived': 'bg-amber-50 text-amber-600',
                                                                'Cancelled': 'bg-red-50 text-red-600',
                                                            };
                                                            const cls = colorMap[order.statusName] || 'bg-gray-50 text-gray-500';
                                                            const label = order.statusName.replace(/([A-Z])/g, ' $1').trim();
                                                            return (
                                                                <span className={`px-2 py-1 rounded-sm text-[8px] font-black uppercase tracking-widest ${cls}`}>
                                                                    {label}
                                                                </span>
                                                            );
                                                        })()}
                                                    </td>
                                                    <td className="px-8 py-5 text-center font-black text-slate-900 text-sm">
                                                        $
                                                        {calculateTotal(order).toLocaleString(
                                                            undefined,
                                                            { minimumFractionDigits: 2 }
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {order.statusName === 'SentToSupplier' ? (
                                                                <>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleConfirmOrder(
                                                                                order.purchaseOrderId,
                                                                                order.supplierId
                                                                            )
                                                                        }
                                                                        className="bg-slate-900 text-white px-5 py-2.5 text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-sm"
                                                                    >
                                                                        <Truck size={12} /> Accept & Ship
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            setRejectModal({
                                                                                isOpen: true,
                                                                                orderId: order.purchaseOrderId,
                                                                                supplierId: order.supplierId
                                                                            })
                                                                        }
                                                                        className="border border-gray-100 text-gray-400 px-5 py-2.5 text-[9px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all"
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </>
                                                            ) : order.statusName === 'Confirmed' || order.statusName === 'InDelivery' ? (
                                                                <span className="text-[9px] font-black uppercase text-green-600 flex items-center gap-2 border border-green-100 px-3 py-1.5 rounded-sm bg-green-50">
                                                                    <CheckCircle size={12} /> {order.statusName.replace(/([A-Z])/g, ' $1').trim()}
                                                                </span>
                                                            ) : order.statusName === 'FullyReceived' || order.statusName === 'PartiallyReceived' ? (
                                                                <span className="text-[9px] font-black uppercase text-emerald-600 flex items-center gap-2 border border-emerald-100 px-3 py-1.5 rounded-sm bg-emerald-50">
                                                                    <CheckCircle size={12} /> {order.statusName.replace(/([A-Z])/g, ' $1').trim()}
                                                                </span>
                                                            ) : order.statusName === 'Cancelled' ? (
                                                                <span className="text-[9px] font-black uppercase text-red-500 flex items-center gap-2 border border-red-100 px-3 py-1.5 rounded-sm bg-red-50">
                                                                    Rejected
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400 text-[9px] font-black uppercase">
                                                                    {order.statusName.replace(/([A-Z])/g, ' $1').trim()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {orders.length > 0 && (
                            <div className="flex items-center justify-between mt-4 px-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Showing {Math.min(visibleOrderCount, orders.length)} of {orders.length}
                                </span>
                                {visibleOrderCount < orders.length && (
                                    <button
                                        onClick={() => setVisibleOrderCount(prev => prev + 20)}
                                        className="bg-gray-100 text-slate-700 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all rounded-sm"
                                    >
                                        Show More ({orders.length - visibleOrderCount} remaining)
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'fulfillment' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {shipments.slice(0, visibleShipCount).map((ship) => {
                                const isDispatched = ship.shipmentStatusId === 4;
                                const isShipped = ship.shipmentStatusId === 2 || ship.shipmentStatusId === 3;
                                const statusLabel =
                                    ship.shipmentStatusId === 1
                                        ? 'Ready to Ship'
                                        : ship.shipmentStatusId === 2
                                            ? 'Dispatched'
                                            : ship.shipmentStatusId === 3
                                                ? 'In Transit'
                                                : ship.shipmentStatusId === 4
                                                    ? 'Delivered'
                                                    : ship.statusName || 'Unknown';

                                const totalUnits = ship.items.reduce(
                                    (sum, item) => sum + item.quantity,
                                    0
                                );

                                return (
                                    <div
                                        key={ship.shipmentId}
                                        className={`bg-white border rounded-sm p-8 shadow-sm flex flex-col transition-all group ${isDispatched || isShipped
                                            ? 'border-green-100 opacity-90'
                                            : 'border-gray-100 hover:border-indigo-500'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-10">
                                            <div
                                                className={`p-4 rounded-sm transition-all ${isDispatched || isShipped
                                                    ? 'bg-green-50 text-green-600'
                                                    : 'bg-gray-50 group-hover:bg-indigo-600 group-hover:text-white'
                                                    }`}
                                            >
                                                <FileText size={20} />
                                            </div>
                                            <span
                                                className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm border ${isDispatched || isShipped
                                                    ? 'bg-green-600 text-white border-transparent'
                                                    : 'bg-amber-50 text-amber-600 border-amber-100'
                                                    }`}
                                            >
                                                {statusLabel}
                                            </span>
                                        </div>

                                        <h4 className="text-xs font-black text-slate-900 mb-1 uppercase tracking-tight">
                                            SHP-{ship.shipmentId}
                                        </h4>
                                        <div className="flex items-center gap-2 mb-8">
                                            <MapPin size={12} className="text-gray-300" />
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {ship.warehouseName || `Warehouse #${ship.warehouseId}`}
                                            </span>
                                        </div>

                                        <div className="space-y-4 mb-10 border-t border-gray-50 pt-6">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-300">
                                                <span>Asset Volume</span>
                                                <span className="text-slate-900 font-black">
                                                    {totalUnits} Units
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-300">
                                                <span>Logistics Partner</span>
                                                <span className="text-slate-900 font-bold">
                                                    {ship.carrier || 'Not assigned'}
                                                </span>
                                            </div>
                                            {ship.items.length > 0 && (
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-300">
                                                    <span>Order</span>
                                                    <span className="text-slate-900 font-bold">
                                                        #{ship.orderId}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-auto">
                                            {isDispatched || isShipped ? (
                                                <div className="flex items-center justify-center gap-2 py-4 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-sm border border-green-100">
                                                    <CheckCircle2 size={14} /> Tracking:{' '}
                                                    {ship.trackingNumber || `BLF-${ship.shipmentId}-99`}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleDispatch(ship.shipmentId)}
                                                    className="w-full bg-indigo-600 text-white py-4 text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-100"
                                                >
                                                    <Send size={14} /> Dispatch Inventory Now
                                                </button>
                                            )}
                                            <p className="text-center text-[9px] font-bold text-gray-300 uppercase mt-4 tracking-widest">
                                                {ship.shippedDate
                                                    ? `Shipped: ${new Date(ship.shippedDate).toLocaleDateString()}`
                                                    : ship.createdAt
                                                        ? `Created: ${new Date(ship.createdAt).toLocaleDateString()}`
                                                        : ''}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            <div
                                onClick={generateManifest}
                                className="border-2 border-dashed border-gray-100 rounded-sm flex flex-col items-center justify-center p-8 hover:bg-gray-50 transition-all cursor-pointer text-gray-300 hover:text-slate-900 group min-h-[400px]"
                            >
                                <PlusCircle
                                    size={32}
                                    className="mb-3 group-hover:scale-110 transition-transform"
                                />
                                <span className="text-[10px] font-black uppercase tracking-widest text-center">
                                    Generate New Custom Manifest
                                </span>
                                <p className="text-[8px] font-bold uppercase tracking-widest mt-2 text-gray-200">
                                    Manual Asset Allocation
                                </p>
                            </div>
                        </div>
                        {shipments.length > 0 && (
                            <div className="flex items-center justify-between mt-4 px-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Showing {Math.min(visibleShipCount, shipments.length)} of {shipments.length}
                                </span>
                                {visibleShipCount < shipments.length && (
                                    <button
                                        onClick={() => setVisibleShipCount(prev => prev + 20)}
                                        className="bg-gray-100 text-slate-700 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all rounded-sm"
                                    >
                                        Show More ({shipments.length - visibleShipCount} remaining)
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="mt-20 pt-10 border-t border-gray-100 flex justify-between items-center">
                <div className="flex gap-8">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-300">
                        <PackageSearch size={14} /> Total SKUs: 142
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-300">
                        <Clock size={14} /> Fulfillment Speed: 1.2d
                    </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Supplier Ledger Ver. 4.0.1
                </span>
            </div>

            {rejectModal?.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-sm shadow-xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                <AlertCircle size={16} className="text-red-500" />
                                Reject Order PO-{rejectModal.orderId}
                            </h2>
                            <button
                                onClick={() => {
                                    setRejectModal(null);
                                    setRejectReason('');
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    Reason for Rejection
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Please provide a clear reason for rejecting this purchase order..."
                                    className="w-full bg-gray-50 border border-gray-100 p-4 text-xs text-slate-700 outline-none focus:border-red-300 focus:bg-white transition-all min-h-[120px] resize-none"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-sm">
                            <button
                                onClick={() => {
                                    setRejectModal(null);
                                    setRejectReason('');
                                }}
                                className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-200 bg-white border border-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectOrder}
                                className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-100 transition-all"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplierPage;