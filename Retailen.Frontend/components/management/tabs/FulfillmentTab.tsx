import React, { useState, useEffect, useRef } from 'react';
import { Package, Truck, Clock } from 'lucide-react';

interface AdminOrder {
    id: number;
    status: string;
    totalAmount: number;
    orderDate: string;
    items: { quantity: number; productName: string }[];
    shippingAddress?: { city: string; country: string };
    delivery?: { carrier: string; trackingNumber: string };
}

interface AdminFulfillmentTabProps {
    simEnabled: boolean;
    simDays: number;
}

export const AdminFulfillmentTab: React.FC<AdminFulfillmentTabProps> = ({ simEnabled, simDays }) => {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [shippingModalOpen, setShippingModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
    const [carrier, setCarrier] = useState('DHL Express');
    const [tracking, setTracking] = useState('');
    const [visibleCount, setVisibleCount] = useState(20);
    const autoShippedRef = useRef<Set<number>>(new Set());
    const autoDeliveredRef = useRef<Set<number>>(new Set());

    useEffect(() => {
        loadOrders();

        const silentRefreshOrders = async () => {
            try {
                const { getAllOrders } = await import('../../../api/adminApi');
                const data = await getAllOrders();
                setOrders(
                    data
                        .filter((o: AdminOrder) => ['Paid', 'Processing', 'Shipped', 'Delivered'].includes(o.status))
                        .sort((a: AdminOrder, b: AdminOrder) => b.id - a.id)
                );
            } catch (err) {
                console.error('Silent refresh failed', err);
            }
        };

        const interval = setInterval(silentRefreshOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!simEnabled || simDays < 1) return;

        const autoProcessEligible = orders.filter(
            (o) => o.status === 'Paid' && !autoShippedRef.current.has(o.id)
        );

        autoProcessEligible.forEach(async (order) => {
            autoShippedRef.current.add(order.id);
            try {
                const { startProcessing } = await import('../../../api/adminApi');
                await startProcessing(order.id);
                loadOrders();
            } catch (err) {
                console.error(`Auto-process failed for order ${order.id}:`, err);
                autoShippedRef.current.delete(order.id);
            }
        });
    }, [simEnabled, simDays, orders]);

    useEffect(() => {
        if (!simEnabled || simDays < 2) return;

        const autoShipEligible = orders.filter(
            (o) => o.status === 'Processing'
        );

        autoShipEligible.forEach(async (order) => {
            try {
                const { shipOrder } = await import('../../../api/adminApi');
                const trk = `TRK-AUTO-${order.id}-${Date.now().toString(36).toUpperCase()}`;
                await shipOrder(order.id, 'DHL Express', trk);
                loadOrders();
            } catch (err) {
                console.error(`Auto-ship failed for order ${order.id}:`, err);
            }
        });
    }, [simEnabled, simDays, orders]);

    useEffect(() => {
        if (!simEnabled || simDays < 4) return;

        const autoDeliverEligible = orders.filter(
            (o) => o.status === 'Shipped' && !autoDeliveredRef.current.has(o.id)
        );

        autoDeliverEligible.forEach(async (order) => {
            if (simDays >= 4) {
                autoDeliveredRef.current.add(order.id);
                try {
                    const { deliverOrder } = await import('../../../api/adminApi');
                    await deliverOrder(order.id);
                    loadOrders();
                } catch (err) {
                    console.error(`Auto-deliver failed for order ${order.id}:`, err);
                    autoDeliveredRef.current.delete(order.id);
                }
            }
        });
    }, [simEnabled, simDays, orders]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const { getAllOrders } = await import('../../../api/adminApi');
            const data = await getAllOrders();
            setOrders(
                data
                    .filter((o: AdminOrder) => ['Paid', 'Processing', 'Shipped', 'Delivered'].includes(o.status))
                    .sort((a: AdminOrder, b: AdminOrder) => b.id - a.id)
            );
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartProcessing = async (order: AdminOrder) => {
        try {
            const { startProcessing } = await import('../../../api/adminApi');
            await startProcessing(order.id);
            loadOrders();
        } catch (err) {
            alert('Failed to start processing');
            console.error(err);
        }
    };

    const openShipModal = (order: AdminOrder) => {
        setSelectedOrder(order);
        setTracking(`TRK-${Math.floor(Math.random() * 1000000)}`);
        setShippingModalOpen(true);
    };

    const handleShipSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) return;
        try {
            const { shipOrder } = await import('../../../api/adminApi');
            await shipOrder(selectedOrder.id, carrier, tracking);
            setShippingModalOpen(false);
            loadOrders();
        } catch (err) {
            alert('Failed to ship order');
            console.error(err);
        }
    };

    const handleDeliverOrder = async (order: AdminOrder) => {
        try {
            const { deliverOrder } = await import('../../../api/adminApi');
            await deliverOrder(order.id);
            loadOrders();
        } catch (err) {
            alert('Failed to mark as delivered');
            console.error(err);
        }
    };

    if (loading) return <div>Loading orders...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center bg-gray-50 border border-gray-100 p-6 rounded-sm">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
                        Outbound Logistics
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">
                        Customer Order Fulfillment Center
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    {simEnabled && (
                        <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-[10px] font-black px-2.5 py-1 rounded-full animate-pulse">
                            <Clock size={10} /> Day {simDays} — Auto-ship active
                        </span>
                    )}
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-green-600">
                            Live Orders Stream
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {orders.slice(0, visibleCount).map((order) => (
                    <div
                        key={order.id}
                        className="bg-white border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group hover:border-slate-900 transition-all"
                    >
                        <div className="flex items-center gap-6">
                            <div
                                className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-black text-sm ${order.status === 'Processing'
                                    ? 'bg-indigo-500'
                                    : order.status === 'Shipped'
                                        ? 'bg-green-500'
                                        : order.status === 'Delivered'
                                            ? 'bg-emerald-600'
                                            : 'bg-gray-400'
                                    }`}
                            >
                                {order.status === 'Shipped' || order.status === 'Delivered' ? (
                                    <Truck size={20} />
                                ) : (
                                    <Package size={20} />
                                )}
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900">
                                    Order #{order.id}
                                </h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    {order.shippingAddress
                                        ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                                        : 'No Address'}
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 px-8">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-black uppercase text-gray-300">
                                    Items:
                                </span>
                                {order.items.map((p, i) => (
                                    <span
                                        key={i}
                                        className="text-[10px] font-bold text-slate-700 bg-gray-100 px-2 py-1 rounded-sm"
                                    >
                                        {p.quantity}x {p.productName}
                                    </span>
                                ))}
                            </div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Total Value:{' '}
                                <span className="text-slate-900">
                                    ${order.totalAmount}
                                </span>{' '}
                                • Date:{' '}
                                {new Date(order.orderDate).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {order.status === 'Paid' ? (
                                <div className="flex flex-col items-end gap-2">
                                    {simEnabled && (
                                        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-sm">
                                            Auto-ships in {Math.max(0, 2 - simDays)} day(s)
                                        </span>
                                    )}
                                    <button
                                        onClick={() => handleStartProcessing(order)}
                                        className="bg-indigo-600 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                    >
                                        Start Packing
                                    </button>
                                </div>
                            ) : order.status === 'Processing' ? (
                                <div className="flex flex-col items-end gap-2">
                                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-sm">
                                        Packing in progress
                                    </span>
                                    <button
                                        onClick={() => openShipModal(order)}
                                        className="bg-slate-900 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200"
                                    >
                                        Ship Order
                                    </button>
                                </div>
                            ) : order.status === 'Shipped' ? (
                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-right">
                                        <span className="block text-[9px] font-bold text-gray-400">
                                            {order.delivery?.carrier} — {order.delivery?.trackingNumber}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDeliverOrder(order)}
                                        className="bg-green-600 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                                    >
                                        Mark Delivered
                                    </button>
                                </div>
                            ) : order.status === 'Delivered' ? (
                                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest bg-emerald-50 px-3 py-2 rounded-sm border border-emerald-100">
                                    ✓ Delivered
                                </span>
                            ) : null}
                        </div>
                    </div>
                ))}
                {orders.length === 0 && (
                    <div className="text-center py-20 text-gray-400 uppercase font-black tracking-widest text-xs">
                        No orders pending fulfillment
                    </div>
                )}
            </div>

            {orders.length > 0 && (
                <div className="flex items-center justify-between mt-4 px-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Showing {Math.min(visibleCount, orders.length)} of {orders.length}
                    </span>
                    {visibleCount < orders.length && (
                        <button
                            onClick={() => setVisibleCount(prev => prev + 20)}
                            className="bg-gray-100 text-slate-700 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all rounded-sm"
                        >
                            Show More ({orders.length - visibleCount} remaining)
                        </button>
                    )}
                </div>
            )}

            {shippingModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-black uppercase tracking-tight mb-6">
                            Dispatch Inventory
                        </h3>
                        <form onSubmit={handleShipSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                    Carrier Service
                                </label>
                                <select
                                    value={carrier}
                                    onChange={(e) => setCarrier(e.target.value)}
                                    className="w-full border border-gray-200 p-3 text-sm font-bold bg-gray-50 outline-none focus:border-slate-900"
                                >
                                    <option>DHL Express</option>
                                    <option>FedEx Ground</option>
                                    <option>UPS Standard</option>
                                    <option>Private Fleet</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                    Tracking Number
                                </label>
                                <input
                                    value={tracking}
                                    onChange={(e) => setTracking(e.target.value)}
                                    className="w-full border border-gray-200 p-3 text-sm font-bold outline-none focus:border-slate-900"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShippingModalOpen(false)}
                                    className="flex-1 py-3 border border-gray-200 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black"
                                >
                                    Confirm Dispatch
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
