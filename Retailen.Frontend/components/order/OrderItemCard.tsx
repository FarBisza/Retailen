import React from 'react';
import { Box, Truck, FileText } from 'lucide-react';
import { Order } from '../../api/orderApi';
import { OrderTab } from './OrderModal';
import { getEstimatedDelivery } from './orderConstants';

interface OrderItemCardProps {
    order: Order;
    activeTab: OrderTab;
    onAction: (order: Order) => void;
    onReturnRequest: (order: Order) => void;
    getActionLabel: () => string;
    onViewInvoice?: (order: Order) => void;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({ order, activeTab, onAction, onReturnRequest, getActionLabel, onViewInvoice }) => (
    <div className="bg-white border border-gray-100 p-6 rounded-lg mb-4 hover:shadow-md transition-all group">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-900/10 flex items-center justify-center text-slate-900">
                    <Box size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                        Order #{order.id}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-lg font-black text-slate-900">
                    ${order.total.toFixed(2)}
                </span>
                {order.hasInvoice && onViewInvoice && (
                    <button
                        onClick={() => onViewInvoice(order)}
                        className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-full hover:bg-indigo-100 transition-all"
                    >
                        <FileText size={14} />
                        Invoice
                    </button>
                )}
                {(activeTab === 'to-review' || activeTab === 'shipped') && (
                    <button
                        onClick={() => onReturnRequest(order)}
                        className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-full hover:bg-amber-200 transition-all"
                    >
                        Request Return
                    </button>
                )}
                <button
                    onClick={() => onAction(order)}
                    className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full hover:bg-black transition-all"
                >
                    {getActionLabel()}
                </button>
            </div>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {order.items.map((item, i) => (
                <div
                    key={i}
                    className="flex-shrink-0 w-20 h-20 bg-gray-50 rounded-md border border-gray-100 p-2"
                >
                    <img
                        src={item.imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
                        alt={item.productName}
                        className="w-full h-full object-contain mix-blend-multiply"
                    />
                </div>
            ))}
        </div>

        <div className="mt-3 space-y-1">
            {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-medium truncate max-w-[70%]">
                        {item.productName || `Product #${item.productId}`}
                    </span>
                    <span className="text-gray-400 font-bold">
                        ×{item.quantity} · ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                </div>
            ))}
        </div>

        {activeTab === 'shipped' && order.shipment && (
            <div className="mt-6 pt-6 border-t border-gray-50">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                    <span>
                        Tracking: {order.shipment.trackingNumber || 'N/A'}
                    </span>
                    <span className="text-blue-600">
                        {order.shipment.carrier || 'Standard Shipping'}
                    </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] text-gray-400 uppercase">Est. Delivery</span>
                    <span className="text-xs font-bold text-green-600">
                        {getEstimatedDelivery(order)}
                    </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-blue-600 rounded-full" />
                </div>
            </div>
        )}
    </div>
);

export default OrderItemCard;

