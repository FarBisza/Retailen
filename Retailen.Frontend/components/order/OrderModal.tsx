import React from 'react';
import {
    X, ArrowLeft, CreditCard, Box, Truck, Star, RefreshCcw,
    MapPin
} from 'lucide-react';
import { getMyOrders, Order, getInvoice } from '../../api/orderApi';
import { getMyReturns, cancelReturn, ReturnDTO, RETURN_STATUS } from '../../api/returnApi';

import PaymentModal from './PaymentModal';
import OrderDetailsModal from './OrderDetailsModal';
import ReviewModal from './ReviewModal';
import ReturnRequestModal from './ReturnRequestModal';
import OrderItemCard from './OrderItemCard';

export type OrderTab = 'to-pay' | 'to-ship' | 'shipped' | 'to-review' | 'returns';

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab: OrderTab;
    onBackToAccount: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({
    isOpen,
    onClose,
    initialTab,
    onBackToAccount,
}) => {
    const [activeTab, setActiveTab] = React.useState<OrderTab>(initialTab);
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [loading, setLoading] = React.useState(false);

    const [showPaymentModal, setShowPaymentModal] = React.useState(false);
    const [selectedOrderForPayment, setSelectedOrderForPayment] = React.useState<Order | null>(null);
    const [showDetailsModal, setShowDetailsModal] = React.useState(false);
    const [selectedOrderForDetails, setSelectedOrderForDetails] = React.useState<Order | null>(null);
    const [showReviewModal, setShowReviewModal] = React.useState(false);
    const [selectedOrderForReview, setSelectedOrderForReview] = React.useState<Order | null>(null);
    const [showReturnRequestModal, setShowReturnRequestModal] = React.useState(false);
    const [selectedOrderForReturn, setSelectedOrderForReturn] = React.useState<Order | null>(null);

    const [returnsList, setReturnsList] = React.useState<ReturnDTO[]>([]);

    const loadOrders = React.useCallback(() => {
        setLoading(true);
        getMyOrders()
            .then(setOrders)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const refreshOrders = React.useCallback(() => {
        getMyOrders().then(setOrders).catch(console.error);
    }, []);

    React.useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
            loadOrders();
            const pollInterval = setInterval(refreshOrders, 5000);
            return () => clearInterval(pollInterval);
        }
    }, [isOpen, initialTab]);

    const loadReturns = React.useCallback(async () => {
        const data = await getMyReturns();
        setReturnsList(data);
    }, []);

    React.useEffect(() => {
        if (isOpen && activeTab === 'returns') {
            loadReturns();
        }
    }, [isOpen, activeTab, loadReturns]);

    if (!isOpen) return null;

    const toPay = orders.filter(o => o.status === 'AwaitingPayment');
    const toShip = orders.filter(o => o.status === 'Paid' || o.status === 'Processing');
    const shipped = orders.filter(o => o.status === 'Shipped');
    const toReview = orders.filter(o => o.status === 'Delivered');
    const returnsOrders: Order[] = [];

    const tabs = [
        { id: 'to-pay', label: 'To Pay', icon: CreditCard, count: toPay.length },
        { id: 'to-ship', label: 'To Ship', icon: Box, count: toShip.length },
        { id: 'shipped', label: 'Shipped', icon: Truck, count: shipped.length },
        { id: 'to-review', label: 'To Review', icon: Star, count: toReview.length },
        { id: 'returns', label: 'Returns', icon: RefreshCcw, count: returnsList.length },
    ];

    const getOrdersForTab = () => {
        switch (activeTab) {
            case 'to-pay': return toPay;
            case 'to-ship': return toShip;
            case 'shipped': return shipped;
            case 'to-review': return toReview;
            case 'returns': return returnsOrders;
            default: return [];
        }
    };

    const handleActionClick = (order: Order) => {
        switch (activeTab) {
            case 'to-pay':
                setSelectedOrderForPayment(order);
                setShowPaymentModal(true);
                break;
            case 'to-ship':
            case 'shipped':
                setSelectedOrderForDetails(order);
                setShowDetailsModal(true);
                break;
            case 'to-review':
                setSelectedOrderForReview(order);
                setShowReviewModal(true);
                break;
        }
    };

    const openReturnRequest = (order: Order) => {
        setSelectedOrderForReturn(order);
        setShowReturnRequestModal(true);
    };

    const handleCancelReturn = async (returnId: number) => {
        if (!confirm('Are you sure you want to cancel this return?')) return;
        const ok = await cancelReturn(returnId);
        if (ok) loadReturns();
        else alert('Failed to cancel return.');
    };

    const getActionLabel = () => {
        switch (activeTab) {
            case 'to-pay': return 'Complete Payment';
            case 'to-ship': return 'View Details';
            case 'shipped': return 'Track Order';
            case 'to-review': return 'Write Review';
            case 'returns': return 'View Return';
            default: return 'View';
        }
    };

    const currentOrders = getOrdersForTab();

    return (
        <>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
                <div
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-500"
                    onClick={onClose}
                />

                <div className="relative w-full max-w-5xl bg-gray-50/80 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-300 max-h-[90vh]">
                    <div className="px-8 py-6 bg-white border-b border-gray-100 flex items-center justify-between">
                        <button
                            onClick={onBackToAccount}
                            className="min-w-[160px] flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
                        >
                            <ArrowLeft size={16} /> Back to Account
                        </button>
                        <h2 className="text-xl font-black tracking-tighter uppercase text-center">
                            My Purchases
                        </h2>
                        <div className="min-w-[160px] flex justify-end">
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-8 py-4 bg-white/50 border-b border-gray-100 overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as OrderTab)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                    : 'bg-white text-gray-400 hover:text-slate-900 border border-gray-100'
                                    }`}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                                {tab.count > 0 && (
                                    <span
                                        className={`ml-1 w-5 h-5 flex items-center justify-center rounded-full text-[8px] ${activeTab === tab.id
                                            ? 'bg-white text-black'
                                            : 'bg-slate-900 text-white'
                                            }`}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
                            </div>
                        ) : activeTab === 'returns' ? (
                            returnsList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6">
                                        <RefreshCcw size={32} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-2">
                                        No Returns
                                    </h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                        Return requests will appear here
                                    </p>
                                </div>
                            ) : (
                                <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-4">
                                    {returnsList.map((ret) => {
                                        const statusInfo = RETURN_STATUS[ret.returnStatusId as keyof typeof RETURN_STATUS] || { name: 'Unknown', color: 'gray' };
                                        const colorMap: Record<string, string> = {
                                            yellow: 'bg-yellow-100 text-yellow-700',
                                            green: 'bg-green-100 text-green-700',
                                            red: 'bg-red-100 text-red-700',
                                            blue: 'bg-blue-100 text-blue-700',
                                            gray: 'bg-gray-100 text-gray-500',
                                        };
                                        return (
                                            <div key={ret.returnId} className="bg-white border border-gray-100 p-6 rounded-lg hover:shadow-md transition-all">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                                                            <RefreshCcw size={18} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                                                Return #{ret.returnId}
                                                            </h4>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                                Order #{ret.orderId} · {new Date(ret.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${colorMap[statusInfo.color] || colorMap.gray}`}>
                                                        {statusInfo.name}
                                                    </span>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                                                    <p className="text-sm font-bold text-slate-800">{ret.productName || 'Product'}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Qty: {ret.quantity} · Reason: {ret.reason}</p>
                                                    {ret.description && <p className="text-xs text-gray-400 mt-1 italic">{ret.description}</p>}
                                                </div>
                                                {ret.adminNote && (
                                                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Admin Note</p>
                                                        <p className="text-xs text-blue-800">{ret.adminNote}</p>
                                                    </div>
                                                )}
                                                {ret.refundAmount > 0 && (
                                                    <p className="text-xs font-bold text-green-600 mb-3">Refund: ${ret.refundAmount.toFixed(2)}</p>
                                                )}
                                                {ret.returnStatusId === 1 && (
                                                    <button
                                                        onClick={() => handleCancelReturn(ret.returnId)}
                                                        className="text-[10px] font-black text-red-500 uppercase tracking-widest border border-red-200 px-4 py-2 rounded-full hover:bg-red-50 transition-all"
                                                    >
                                                        Cancel Return
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        ) : currentOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6">
                                    {activeTab === 'to-pay' && <CreditCard size={32} />}
                                    {activeTab === 'to-ship' && <Box size={32} />}
                                    {activeTab === 'shipped' && <Truck size={32} />}
                                    {activeTab === 'to-review' && <Star size={32} />}
                                </div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-2">
                                    No Orders
                                </h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                    Items in this category will appear here
                                </p>
                            </div>
                        ) : (
                            <div className="animate-in slide-in-from-bottom-4 duration-500">
                                {currentOrders.map((order) => (
                                    <OrderItemCard
                                        key={order.id}
                                        order={order}
                                        activeTab={activeTab}
                                        onAction={handleActionClick}
                                        onReturnRequest={openReturnRequest}
                                        getActionLabel={getActionLabel}
                                        onViewInvoice={async (o) => {
                                            try {
                                                const invoice = await getInvoice(o.id);
                                                const w = window.open('', '_blank', 'width=800,height=600');
                                                if (!w) { alert('Please allow popups to view invoices.'); return; }
                                                const addr = o.shippingAddress;
                                                w.document.write(`
                                                    <!DOCTYPE html>
                                                    <html><head><title>Invoice #${invoice.id}</title>
                                                    <style>
                                                        body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 700px; margin: 40px auto; color: #1a1a2e; padding: 20px; }
                                                        h1 { font-size: 28px; letter-spacing: 2px; margin-bottom: 4px; }
                                                        .subtitle { color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 40px; }
                                                        .header-row { display: flex; justify-content: space-between; margin-bottom: 30px; }
                                                        .info-block { font-size: 13px; line-height: 1.8; }
                                                        .info-block strong { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 4px; }
                                                        .billing-section { display: flex; gap: 40px; margin-bottom: 30px; }
                                                        .billing-section .info-block { flex: 1; }
                                                        table { width: 100%; border-collapse: collapse; margin: 30px 0; }
                                                        th { background: #f5f5f5; text-align: left; padding: 12px 16px; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #666; }
                                                        td { padding: 14px 16px; border-bottom: 1px solid #eee; font-size: 13px; }
                                                        .total-row td { font-weight: 700; font-size: 16px; border-top: 2px solid #1a1a2e; border-bottom: none; }
                                                        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center; }
                                                        .print-btn { background: #1a1a2e; color: white; padding: 12px 32px; border: none; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; margin-bottom: 30px; }
                                                        @media print { .print-btn { display: none; } }
                                                    </style></head><body>
                                                    <button class="print-btn" onclick="window.print()">🖨 Print / Save as PDF</button>
                                                    <h1>INVOICE</h1>
                                                    <p class="subtitle">Retailen — Premium Furniture</p>
                                                    <div class="header-row">
                                                        <div class="info-block">
                                                            <strong>Invoice Details</strong>
                                                            Invoice #: ${invoice.id}<br/>
                                                            Order #: ${invoice.orderId}<br/>
                                                            Date: ${invoice.issuedDate ? new Date(invoice.issuedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Pending'}
                                                        </div>
                                                        <div class="info-block" style="text-align:right">
                                                            <strong>Ship To</strong>
                                                            ${addr ? `${addr.fullName || ''}<br/>${addr.streetAddress || ''}<br/>${addr.city || ''}, ${(addr as any).state || ''} ${addr.zipCode || ''}<br/>${addr.country || ''}` : 'N/A'}
                                                        </div>
                                                    </div>
                                                    ${(invoice as any).buyerName ? `
                                                    <div class="billing-section">
                                                        <div class="info-block">
                                                            <strong>Bill To (Tax Invoice)</strong>
                                                            ${(invoice as any).buyerName || ''}<br/>
                                                            Tax ID: ${(invoice as any).taxId || 'N/A'}<br/>
                                                            ${(invoice as any).billingAddress ? `${(invoice as any).billingAddress}<br/>` : ''}
                                                            ${(invoice as any).billingCity ? `${(invoice as any).billingCity}, ${(invoice as any).billingZipCode || ''}<br/>` : ''}
                                                            ${(invoice as any).billingCountry || ''}
                                                        </div>
                                                        ${(invoice as any).billingEmail ? `
                                                        <div class="info-block">
                                                            <strong>Billing Email</strong>
                                                            ${(invoice as any).billingEmail}
                                                        </div>` : ''}
                                                    </div>` : ''}
                                                    <table>
                                                        <tr><th>Item</th><th>Qty</th><th>Unit Price</th><th style="text-align:right">Total</th></tr>
                                                        ${o.items.map((it: any) => `
                                                            <tr>
                                                                <td>${it.productName || 'Product #' + it.productId}</td>
                                                                <td>${it.quantity}</td>
                                                                <td>$${(it.unitPrice || 0).toFixed(2)}</td>
                                                                <td style="text-align:right">$${((it.quantity || 0) * (it.unitPrice || 0)).toFixed(2)}</td>
                                                            </tr>
                                                        `).join('')}
                                                        <tr class="total-row">
                                                            <td colspan="3">Total</td>
                                                            <td style="text-align:right">$${(invoice.amount || o.total || 0).toFixed(2)}</td>
                                                        </tr>
                                                    </table>
                                                    <div class="footer">
                                                        Thank you for your purchase!<br/>
                                                        This invoice was generated electronically and is valid without a signature.
                                                    </div>
                                                    </body></html>
                                                `);
                                                w.document.close();
                                            } catch {
                                                alert('No invoice found for this order. Invoices are generated after payment or when requested during checkout.');
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="px-8 py-6 bg-white border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                            <MapPin size={12} /> Shipping to: {(() => {
                                const addr = orders.find(o => o.shippingAddress)?.shippingAddress;
                                return addr ? `${addr.streetAddress}, ${addr.city}, ${addr.country}` : 'No address on file';
                            })()}
                        </div>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                            Invoice available per order
                        </span>
                    </div>
                </div>
            </div>

            {showPaymentModal && selectedOrderForPayment && (
                <PaymentModal
                    order={selectedOrderForPayment}
                    onClose={() => { setShowPaymentModal(false); setSelectedOrderForPayment(null); }}
                    onPaymentSuccess={() => { setShowPaymentModal(false); setSelectedOrderForPayment(null); loadOrders(); }}
                />
            )}

            {showDetailsModal && selectedOrderForDetails && (
                <OrderDetailsModal
                    order={selectedOrderForDetails}
                    onClose={() => { setShowDetailsModal(false); setSelectedOrderForDetails(null); }}
                />
            )}

            {showReviewModal && selectedOrderForReview && (
                <ReviewModal
                    order={selectedOrderForReview}
                    onClose={() => { setShowReviewModal(false); setSelectedOrderForReview(null); }}
                    onReviewSuccess={() => { setShowReviewModal(false); setSelectedOrderForReview(null); loadOrders(); window.dispatchEvent(new Event('product-data-changed')); }}
                />
            )}

            {showReturnRequestModal && selectedOrderForReturn && (
                <ReturnRequestModal
                    order={selectedOrderForReturn}
                    onClose={() => { setShowReturnRequestModal(false); setSelectedOrderForReturn(null); }}
                    onReturnSuccess={() => { setShowReturnRequestModal(false); setSelectedOrderForReturn(null); loadReturns(); }}
                />
            )}
        </>
    );
};

export default OrderModal;