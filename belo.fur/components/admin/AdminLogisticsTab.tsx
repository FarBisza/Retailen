import React, { useState, useEffect } from 'react';
import {
    ShoppingCart, FileCheck, PlusCircle, PackageCheck, Clock,
    Truck, CheckCircle, XCircle, Package, ArrowDownToLine, X, Trash2,
} from 'lucide-react';
import * as logisticsApi from '../../api/logisticsApi';
import { Product } from '../../api/types';
import { fetchProducts } from '../../api/productApi';

interface AdminLogisticsTabProps {
    products: Product[];
    simEnabled?: boolean;
    simDays?: number;
    initialPoProduct?: { productId: number; quantity: number } | null;
    onInitialPoConsumed?: () => void;
}

const statusColorMap: Record<string, string> = {
    'Draft': 'bg-gray-100 text-gray-400 border-gray-200',
    'SentToSupplier': 'bg-blue-50 text-blue-600 border-blue-100',
    'Confirmed': 'bg-green-50 text-green-600 border-green-100',
    'InDelivery': 'bg-indigo-50 text-indigo-600 border-indigo-100',
    'FullyReceived': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'PartiallyReceived': 'bg-amber-50 text-amber-600 border-amber-100',
    'Cancelled': 'bg-red-50 text-red-600 border-red-100',
};

const formatStatus = (name: string) => name.replace(/([A-Z])/g, ' $1').trim();

const getStatusBadge = (statusName: string) => {
    const cls = statusColorMap[statusName] || 'bg-gray-50 text-gray-400 border-gray-200';
    return (
        <span className={`px-2.5 py-1 rounded-sm border text-[8px] font-black uppercase tracking-widest ${cls}`}>
            {formatStatus(statusName)}
        </span>
    );
};

export const AdminLogisticsTab: React.FC<AdminLogisticsTabProps> = ({
    products,
    initialPoProduct,
    onInitialPoConsumed,
}) => {
    const [activeLogisticsTab, setActiveLogisticsTab] = useState<'po' | 'gr'>('po');
    const [totalPoCount, setTotalPoCount] = useState(0);

    // Data loaded internally
    const [purchaseOrders, setPurchaseOrders] = useState<logisticsApi.SupplyOrder[]>([]);
    const [poLoading, setPoLoading] = useState(false);
    const [suppliers, setSuppliers] = useState<logisticsApi.Supplier[]>([]);
    const [warehouses, setWarehouses] = useState<logisticsApi.Warehouse[]>([]);

    // GR State
    const [selectedPo, setSelectedPo] = useState<logisticsApi.SupplyOrder | null>(null);
    const [grItems, setGrItems] = useState<
        { productId: number; quantityReceived: number; quantityDamaged: number }[]
    >([]);
    const [grDocumentNumber, setGrDocumentNumber] = useState('');
    const [grShippingCost, setGrShippingCost] = useState<number>(0);
    const [grComment, setGrComment] = useState('');
    const [grLoading, setGrLoading] = useState(false);

    // Create PO Modal State
    const [showCreatePoModal, setShowCreatePoModal] = useState(false);
    const [createPoData, setCreatePoData] = useState<{
        supplierId: number;
        warehouseId?: number;
        expectedDate?: string;
        comment: string;
        items: { productId: number; quantityOrdered: number; purchasePrice: number }[];
    }>({
        supplierId: 0,
        warehouseId: 0,
        expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        comment: '',
        items: [],
    });
    const [createPoLoading, setCreatePoLoading] = useState(false);

    // Load POs and suppliers on mount
    useEffect(() => {
        const loadData = async () => {
            setPoLoading(true);
            try {
                const [posResult, suppData, whData] = await Promise.all([
                    logisticsApi.getSupplyOrdersPaged(0, 20),
                    logisticsApi.getSuppliers(),
                    logisticsApi.getWarehouses(),
                ]);
                setPurchaseOrders(posResult.items);
                setTotalPoCount(posResult.totalCount);
                setSuppliers(suppData);
                setWarehouses(whData);
                setCreatePoData(prev => ({
                    ...prev,
                    supplierId: suppData.length > 0 ? suppData[0].supplierId : 0,
                    warehouseId: whData.length > 0 ? whData[0].warehouseId : 0,
                }));
            } catch (err) {
                console.error('Failed to load logistics data:', err);
            } finally {
                setPoLoading(false);
            }
        };
        loadData();
    }, []);

    // Auto-open Create PO modal when coming from Inventory tab
    useEffect(() => {
        if (initialPoProduct && suppliers.length > 0) {
            setCreatePoData(prev => ({
                ...prev,
                supplierId: prev.supplierId || (suppliers.length > 0 ? suppliers[0].supplierId : 0),
                items: [{ productId: initialPoProduct.productId, quantityOrdered: initialPoProduct.quantity, purchasePrice: 0 }],
            }));
            setShowCreatePoModal(true);
            onInitialPoConsumed?.();
        }
    }, [initialPoProduct, suppliers]);

    // Open GR form for specific PO
    const openGrForPo = (po: logisticsApi.SupplyOrder) => {
        setSelectedPo(po);
        setGrItems(
            po.items.map((p) => ({
                productId: p.productId,
                quantityReceived: p.quantityOrdered,
                quantityDamaged: 0,
            }))
        );
        setGrDocumentNumber(
            `GR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
        );
        setActiveLogisticsTab('gr');
    };

    // Submit Goods Receipt
    const handleGrSubmit = async () => {
        if (!selectedPo) return;

        if (grItems.some((i) => i.quantityReceived < 0 || i.quantityDamaged < 0)) {
            alert('Quantities cannot be negative');
            return;
        }
        // Validate: Received ≤ Ordered
        for (let i = 0; i < grItems.length; i++) {
            const ordered = selectedPo.items[i]?.quantityOrdered ?? 0;
            if (grItems[i].quantityReceived > ordered) {
                alert(`Received (${grItems[i].quantityReceived}) cannot exceed Ordered (${ordered}) for ${selectedPo.items[i]?.productName}`);
                return;
            }
        }
        // Validate: Damaged ≤ Received
        if (grItems.some((i) => i.quantityDamaged > i.quantityReceived)) {
            alert('Damaged quantity cannot exceed Received quantity');
            return;
        }

        setGrLoading(true);
        try {
            const requestData: logisticsApi.ReceiveGoodsRequest = {
                warehouseId: selectedPo.warehouseId || 1,
                documentNumber: grDocumentNumber || undefined,
                shippingCost: grShippingCost || undefined,
                comment: grComment || undefined,
                items: grItems.map((p) => ({
                    productId: p.productId,
                    quantityReceived: p.quantityReceived,
                    quantityDamaged: p.quantityDamaged,
                })),
            };

            await logisticsApi.createGoodsReceipt(selectedPo.purchaseOrderId, requestData);

            alert('Goods Receipt processed successfully!');

            setSelectedPo(null);
            setGrItems([]);
            setGrDocumentNumber('');
            setGrShippingCost(0);
            setGrComment('');
            setActiveLogisticsTab('po');

            const data = await logisticsApi.getSupplyOrders();
            setPurchaseOrders(data);

            // Refresh product data so stock levels update across the app
            window.dispatchEvent(new Event('product-data-changed'));

        } catch (err) {
            console.error('Goods Receipt Failed:', err);
            alert('Failed to process Goods Receipt');
        } finally {
            setGrLoading(false);
        }
    };

    // Handle Create PO submission
    const handleCreatePo = async () => {
        if (!createPoData.supplierId || createPoData.items.length === 0) {
            alert('Please select a supplier and add at least one product.');
            return;
        }

        setCreatePoLoading(true);
        try {
            await logisticsApi.createSupplyOrder({
                supplierId: createPoData.supplierId,
                warehouseId: createPoData.warehouseId,
                expectedDate: createPoData.expectedDate,
                comment: createPoData.comment || '',
                items: createPoData.items,
            });
            alert('Purchase Order created successfully!');
            setShowCreatePoModal(false);
            setCreatePoData({
                supplierId: suppliers[0]?.supplierId || 0,
                warehouseId: warehouses[0]?.warehouseId || 0,
                expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                comment: '',
                items: [],
            });
            const data = await logisticsApi.getSupplyOrders();
            setPurchaseOrders(data);
        } catch (err) {
            console.error('Create PO failed:', err);
            alert('Failed to create PO. Please try again.');
        } finally {
            setCreatePoLoading(false);
        }
    };

    // Force Confirm (Staff Override)
    const handleForceConfirm = async (po: logisticsApi.SupplyOrder) => {
        if (!confirm('Confirm and Ship this order on behalf of the supplier?')) return;
        try {
            await logisticsApi.confirmSupplierOrder(po.supplierId, po.purchaseOrderId);
            const data = await logisticsApi.getSupplyOrders();
            setPurchaseOrders(data);
            alert('Order confirmed and shipped (Staff Override).');
        } catch (err) {
            console.error('Force confirm failed:', err);
            alert('Failed to confirm order.');
        }
    };

    // Add product to Create PO form
    const addProductToPo = (productId: number) => {
        const prod = products.find((p) => parseInt(p.id) === productId);
        if (!prod) return;
        if (createPoData.items.some((p) => p.productId === productId)) return;
        setCreatePoData((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    productId: productId,
                    quantityOrdered: 10,
                    purchasePrice: prod.price || 0,
                },
            ],
        }));
    };

    // Remove product from Create PO form
    const removeProductFromPo = (productId: number) => {
        setCreatePoData((prev) => ({
            ...prev,
            items: prev.items.filter((p) => p.productId !== productId),
        }));
    };

    return (
        <>
            <div className="space-y-8">
                <div className="flex gap-4 border-b border-gray-100">
                    <button
                        onClick={() => setActiveLogisticsTab('po')}
                        className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeLogisticsTab === 'po'
                            ? 'text-slate-900 border-b-2 border-slate-900'
                            : 'text-gray-400 hover:text-slate-600'
                            }`}
                    >
                        <ShoppingCart size={14} /> Purchase Orders (PO)
                    </button>
                    <button
                        onClick={() => setActiveLogisticsTab('gr')}
                        className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeLogisticsTab === 'gr'
                            ? 'text-slate-900 border-b-2 border-slate-900'
                            : 'text-gray-400 hover:text-slate-600'
                            }`}
                    >
                        <FileCheck size={14} /> Goods Receipt (GR)
                    </button>
                </div>

                {/* PO Sub-Tab */}
                {activeLogisticsTab === 'po' && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">
                                    Purchase Order Management
                                </h4>
                            </div>
                            <button
                                onClick={() => setShowCreatePoModal(true)}
                                className="bg-slate-900 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all"
                            >
                                <PlusCircle size={14} /> Generate New PO
                            </button>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-[9px] font-black uppercase text-gray-400">
                                    <tr>
                                        <th className="px-8 py-4">PO Identifier</th>
                                        <th className="px-8 py-4">Supplier</th>
                                        <th className="px-8 py-4">Expected Date</th>
                                        <th className="px-8 py-4">Products</th>
                                        <th className="px-8 py-4">Asset Value</th>
                                        <th className="px-8 py-4">Status</th>
                                        <th className="px-8 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {poLoading ? (
                                        <tr>
                                            <td colSpan={7} className="px-8 py-10 text-center text-gray-400">
                                                Loading purchase orders...
                                            </td>
                                        </tr>
                                    ) : purchaseOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-8 py-10 text-center text-gray-400">
                                                No purchase orders found
                                            </td>
                                        </tr>
                                    ) : (
                                        purchaseOrders.map((po) => {
                                            const totalValue = po.items.reduce(
                                                (sum, p) => sum + (p.purchasePrice || 0) * p.quantityOrdered,
                                                0
                                            );
                                            return (
                                                <tr key={po.purchaseOrderId} className="text-xs hover:bg-gray-50/20 transition-colors">
                                                    <td className="px-8 py-5 font-black text-slate-900 underline decoration-slate-200">
                                                        PO-{po.purchaseOrderId}
                                                    </td>
                                                    <td className="px-8 py-5 font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                                                        {po.supplierName}
                                                    </td>
                                                    <td className="px-8 py-5 text-gray-400 font-bold">
                                                        {po.expectedDate
                                                            ? new Date(po.expectedDate).toLocaleDateString()
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex flex-col gap-1">
                                                            {po.items.slice(0, 2).map((pItem, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="text-[9px] font-bold text-slate-700 bg-gray-100 px-2 py-0.5 rounded-sm w-fit"
                                                                >
                                                                    {pItem.productName} x{pItem.quantityOrdered}
                                                                </span>
                                                            ))}
                                                            {po.items.length > 2 && (
                                                                <span className="text-[8px] text-gray-400 font-bold">
                                                                    +{po.items.length - 2} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 font-bold text-slate-900">
                                                        ${totalValue.toLocaleString()}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        {getStatusBadge(po.statusName)}
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        {po.statusName === 'SentToSupplier' ? (
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 border border-blue-100 px-3 py-2 flex items-center gap-2 justify-center">
                                                                <Clock size={12} /> Awaiting Supplier
                                                            </span>
                                                        ) : po.statusName === 'Confirmed' ? (
                                                            <div className="flex items-center gap-2 justify-end">
                                                                <button
                                                                    onClick={() => openGrForPo(po)}
                                                                    className="bg-indigo-600 text-white border border-indigo-600 px-4 py-2 text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center gap-2"
                                                                >
                                                                    <PackageCheck size={12} /> Process Goods Receipt
                                                                </button>
                                                            </div>
                                                        ) : po.statusName === 'InDelivery' ? (
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 border border-indigo-100 px-3 py-2 flex items-center gap-2 justify-center">
                                                                <Truck size={12} /> In Transit
                                                            </span>
                                                        ) : po.statusName === 'FullyReceived' || po.statusName === 'PartiallyReceived' ? (
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 flex items-center gap-2 justify-center">
                                                                <CheckCircle size={12} /> {formatStatus(po.statusName)}
                                                            </span>
                                                        ) : po.statusName === 'Cancelled' ? (
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-50 border border-red-100 px-3 py-2 flex items-center gap-2 justify-center">
                                                                <XCircle size={12} /> Cancelled
                                                            </span>
                                                        ) : (
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">
                                                                {formatStatus(po.statusName)}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Show More / Counter */}
                        {purchaseOrders.length > 0 && (
                            <div className="flex items-center justify-between mt-4 px-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Showing {purchaseOrders.length} of {totalPoCount}
                                </span>
                                {purchaseOrders.length < totalPoCount && (
                                    <button
                                        onClick={async () => {
                                            try {
                                                const result = await logisticsApi.getSupplyOrdersPaged(purchaseOrders.length, 20);
                                                setPurchaseOrders(prev => [...prev, ...result.items]);
                                                setTotalPoCount(result.totalCount);
                                            } catch (err) {
                                                console.error('Failed to load more POs:', err);
                                            }
                                        }}
                                        className="bg-gray-100 text-slate-700 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all rounded-sm"
                                    >
                                        Show More ({totalPoCount - purchaseOrders.length} remaining)
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* GR Sub-Tab */}
                {activeLogisticsTab === 'gr' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-2">
                        <div className="lg:col-span-2">
                            <div className="bg-white border border-gray-100 rounded-sm p-8 shadow-sm">
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">
                                            Goods Receipt Processing
                                        </h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                            Based on PO: {selectedPo ? `PO-${selectedPo.purchaseOrderId}` : 'Select a PO'}
                                        </p>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <div>
                                            <span className="text-[8px] font-black uppercase text-gray-300 block mb-1">
                                                Receipt Ref #
                                            </span>
                                            <input
                                                value={grDocumentNumber}
                                                onChange={(e) => setGrDocumentNumber(e.target.value)}
                                                className="bg-gray-50 border border-gray-100 px-3 py-1 text-[10px] font-black outline-none text-right"
                                            />
                                        </div>
                                        <div>
                                            <span className="text-[8px] font-black uppercase text-gray-300 block mb-1">
                                                Delivery Cost ($)
                                            </span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={grShippingCost}
                                                onChange={(e) => setGrShippingCost(parseFloat(e.target.value) || 0)}
                                                className="bg-gray-50 border border-gray-100 px-3 py-1 text-[10px] font-black outline-none text-right"
                                            />
                                        </div>
                                        <div>
                                            <span className="text-[8px] font-black uppercase text-gray-300 block mb-1">
                                                Comment
                                            </span>
                                            <input
                                                value={grComment}
                                                onChange={(e) => setGrComment(e.target.value)}
                                                placeholder="Optional note"
                                                className="bg-gray-50 border border-gray-100 px-3 py-1 text-[10px] font-black outline-none text-right"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {selectedPo ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-12 text-[9px] font-black uppercase text-gray-400 px-4 mb-2">
                                            <div className="col-span-4">Asset Item</div>
                                            <div className="col-span-2 text-center">Ordered</div>
                                            <div className="col-span-2 text-center">Received</div>
                                            <div className="col-span-2 text-center">Damaged</div>
                                            <div className="col-span-2 text-center">Shortage</div>
                                        </div>
                                        {selectedPo.items.map((item, idx) => {
                                            const received = grItems[idx]?.quantityReceived ?? 0;
                                            const damaged = grItems[idx]?.quantityDamaged ?? 0;
                                            const shortage = item.quantityOrdered - received;
                                            const good = received - damaged;
                                            return (
                                                <div
                                                    key={item.productId}
                                                    className="grid grid-cols-12 items-center bg-gray-50/50 border border-gray-100 p-4 rounded-sm"
                                                >
                                                    <div className="col-span-4 flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-white border border-gray-100 p-1 flex items-center justify-center">
                                                            <Package size={20} className="text-gray-300" />
                                                        </div>
                                                        <span className="text-xs font-black text-slate-900">
                                                            {item.productName}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-2 text-center font-bold text-gray-400">
                                                        {item.quantityOrdered}
                                                    </div>
                                                    <div className="col-span-2 px-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={item.quantityOrdered}
                                                            value={received}
                                                            onChange={(e) => {
                                                                const val = Math.min(
                                                                    item.quantityOrdered,
                                                                    Math.max(0, parseInt(e.target.value) || 0)
                                                                );
                                                                const newItems = [...grItems];
                                                                // Clamp damaged to new received if needed
                                                                const clampedDamaged = Math.min(newItems[idx]?.quantityDamaged || 0, val);
                                                                newItems[idx] = { ...newItems[idx], quantityReceived: val, quantityDamaged: clampedDamaged };
                                                                setGrItems(newItems);
                                                            }}
                                                            className="w-full bg-white border border-slate-900 p-2 text-center text-xs font-black outline-none"
                                                        />
                                                    </div>
                                                    <div className="col-span-2 px-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={received}
                                                            value={damaged}
                                                            onChange={(e) => {
                                                                const val = Math.min(
                                                                    received,
                                                                    Math.max(0, parseInt(e.target.value) || 0)
                                                                );
                                                                const newItems = [...grItems];
                                                                newItems[idx] = { ...newItems[idx], quantityDamaged: val };
                                                                setGrItems(newItems);
                                                            }}
                                                            className="w-full bg-white border border-red-200 p-2 text-center text-xs font-black text-red-500 outline-none"
                                                        />
                                                    </div>
                                                    <div className="col-span-2 text-center">
                                                        <span className={`text-xs font-black ${shortage > 0 ? 'text-amber-600' : 'text-gray-300'}`}>
                                                            {shortage > 0 ? shortage : '—'}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-gray-400">
                                        <Package size={40} className="mx-auto mb-4 opacity-30" />
                                        <p className="text-xs font-bold">
                                            Select a Purchase Order from the PO tab to receive goods
                                        </p>
                                    </div>
                                )}

                                <div className="mt-10 pt-8 border-t border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setActiveLogisticsTab('po')}
                                            className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 px-3 py-2 transition-all"
                                        >
                                            ← Back to POs
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleGrSubmit}
                                        disabled={!selectedPo || grLoading}
                                        className="bg-green-600 text-white px-10 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all flex items-center gap-3 shadow-xl shadow-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {grLoading ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                        ) : (
                                            <ArrowDownToLine size={16} />
                                        )}
                                        Post to Inventory (Process GR)
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-[#0c121e] text-white p-8 rounded-sm">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">
                                    Ledger Impact (Preview)
                                </h5>
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-gray-800 pb-3">
                                        <span className="text-[11px] font-bold opacity-60">
                                            Total Ordered
                                        </span>
                                        <span className="text-xs font-black">
                                            {selectedPo
                                                ? selectedPo.items.reduce((s, p) => s + p.quantityOrdered, 0)
                                                : 0}{' '}
                                            Units
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-800 pb-3">
                                        <span className="text-[11px] font-bold opacity-60">
                                            Good (Sellable)
                                        </span>
                                        <span className="text-xs font-black text-green-400">
                                            +{selectedPo
                                                ? grItems.reduce((s, p) => s + (p.quantityReceived - p.quantityDamaged), 0)
                                                : 0}{' '}
                                            Units
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-800 pb-3">
                                        <span className="text-[11px] font-bold opacity-60">
                                            Damaged
                                        </span>
                                        <span className="text-xs font-black text-red-400">
                                            {selectedPo
                                                ? grItems.reduce((s, p) => s + p.quantityDamaged, 0)
                                                : 0}{' '}
                                            Units
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-800 pb-3">
                                        <span className="text-[11px] font-bold opacity-60">
                                            Shortage
                                        </span>
                                        <span className="text-xs font-black text-amber-400">
                                            {selectedPo
                                                ? selectedPo.items.reduce((s, p) => s + p.quantityOrdered, 0) -
                                                grItems.reduce((s, p) => s + p.quantityReceived, 0)
                                                : 0}{' '}
                                            Units
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-800 pb-3">
                                        <span className="text-[11px] font-bold opacity-60">
                                            Inbound Value
                                        </span>
                                        <span className="text-xs font-black">
                                            ${selectedPo
                                                ? selectedPo.items
                                                    .reduce((s, p) => s + (p.purchasePrice || 0) * p.quantityOrdered, 0)
                                                    .toLocaleString()
                                                : '0.00'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <span className="text-[11px] font-bold opacity-60">
                                            Warehouse Node
                                        </span>
                                        <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400">
                                            {selectedPo?.warehouseName || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* CREATE PO MODAL */}
            {showCreatePoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-sm shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-sm font-black uppercase tracking-widest">
                                Create Purchase Order
                            </h3>
                            <button
                                onClick={() => setShowCreatePoModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Supplier Selection */}
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                    Supplier
                                </label>
                                <select
                                    value={createPoData.supplierId}
                                    onChange={(e) =>
                                        setCreatePoData((prev) => ({
                                            ...prev,
                                            supplierId: parseInt(e.target.value),
                                        }))
                                    }
                                    className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                >
                                    {suppliers.map((s) => (
                                        <option key={s.supplierId} value={s.supplierId}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Warehouse (Destination) Selection */}
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                    Destination Warehouse
                                </label>
                                <select
                                    value={createPoData.warehouseId}
                                    onChange={(e) =>
                                        setCreatePoData((prev) => ({
                                            ...prev,
                                            warehouseId: parseInt(e.target.value),
                                        }))
                                    }
                                    className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                >
                                    {warehouses.map((w) => (
                                        <option key={w.warehouseId} value={w.warehouseId}>
                                            {w.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Expected Date */}
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                    Expected Delivery Date
                                </label>
                                <input
                                    type="date"
                                    value={createPoData.expectedDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) =>
                                        setCreatePoData((prev) => ({
                                            ...prev,
                                            expectedDate: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                    Comment (Optional)
                                </label>
                                <textarea
                                    value={createPoData.comment || ''}
                                    onChange={(e) =>
                                        setCreatePoData((prev) => ({
                                            ...prev,
                                            comment: e.target.value,
                                        }))
                                    }
                                    placeholder="Add notes about this order..."
                                    className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                                    rows={3}
                                />
                            </div>

                            {/* Product Selection */}
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                    Add Products
                                </label>
                                <select
                                    onChange={(e) => addProductToPo(parseInt(e.target.value))}
                                    className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Select a product to add...
                                    </option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} - ${p.price}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Selected Products */}
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                    Order Items ({createPoData.items.length})
                                </label>
                                {createPoData.items.length === 0 ? (
                                    <p className="text-sm text-gray-400">
                                        No products added yet
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {createPoData.items.map((item, idx) => {
                                            const prod = products.find(
                                                (p) => parseInt(p.id) === item.productId
                                            );
                                            return (
                                                <div
                                                    key={item.productId}
                                                    className="flex items-center justify-between bg-gray-50 p-3 rounded-sm"
                                                >
                                                    <span className="text-sm font-bold">
                                                        {prod?.name}
                                                    </span>
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantityOrdered}
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value) || 1;
                                                                setCreatePoData((prev) => ({
                                                                    ...prev,
                                                                    items: prev.items.map((p, i) =>
                                                                        i === idx
                                                                            ? { ...p, quantityOrdered: val }
                                                                            : p
                                                                    ),
                                                                }));
                                                            }}
                                                            className="w-20 border border-gray-200 rounded-sm px-2 py-1 text-sm text-center"
                                                        />
                                                        <button
                                                            onClick={() => removeProductFromPo(item.productId)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowCreatePoModal(false)}
                                className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePo}
                                disabled={createPoLoading || createPoData.items.length === 0}
                                className="bg-slate-900 text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                            >
                                {createPoLoading ? 'Creating...' : 'Create PO'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
