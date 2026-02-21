import React from 'react';
import { X, CheckCircle2, Package, Truck, MapPin } from 'lucide-react';
import { Order } from '../../api/orderApi';
import { STATUS, getEstimatedDelivery } from './orderConstants';

interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
    const isShipped = order.statusId === STATUS.SHIPPED;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto animate-in zoom-in-95 duration-200">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tight">
                            Order #{order.id}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status Timeline */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <span
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isShipped
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-indigo-100 text-indigo-700'
                                    }`}
                            >
                                {order.status}
                            </span>
                            {isShipped && order.shipment && (
                                <span className="text-[10px] font-bold text-gray-500">
                                    {order.shipment.carrier}
                                </span>
                            )}
                        </div>

                        {/* Progress bar */}
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${order.statusId >= STATUS.PAID
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200'
                                    }`}
                            >
                                <CheckCircle2 size={16} />
                            </div>
                            <div
                                className={`flex-1 h-1 rounded ${order.statusId >= STATUS.PROCESSING
                                    ? 'bg-green-500'
                                    : 'bg-gray-200'
                                    }`}
                            />
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${order.statusId >= STATUS.PROCESSING
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200'
                                    }`}
                            >
                                <Package size={16} />
                            </div>
                            <div
                                className={`flex-1 h-1 rounded ${order.statusId >= STATUS.SHIPPED
                                    ? 'bg-green-500'
                                    : 'bg-gray-200'
                                    }`}
                            />
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${order.statusId >= STATUS.SHIPPED
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200'
                                    }`}
                            >
                                <Truck size={16} />
                            </div>
                        </div>
                        <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-gray-400">
                            <span>Paid</span>
                            <span>Processing</span>
                            <span>Shipped</span>
                        </div>
                    </div>

                    {/* Tracking Info (if shipped) */}
                    {isShipped && order.shipment && (
                        <div className="border border-blue-100 bg-blue-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Truck size={16} className="text-blue-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                                    Tracking Information
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[9px] text-gray-400 uppercase">Tracking #</p>
                                    <p className="text-sm font-bold">{order.shipment.trackingNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-400 uppercase">Carrier</p>
                                    <p className="text-sm font-bold">{order.shipment.carrier || 'Standard'}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-400 uppercase">Shipped On</p>
                                    <p className="text-sm font-bold">
                                        {order.shipment.shippedDate
                                            ? new Date(order.shipment.shippedDate).toLocaleDateString()
                                            : 'Processing'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-400 uppercase">Est. Delivery</p>
                                    <p className="text-sm font-bold text-green-600">
                                        {getEstimatedDelivery(order)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delivery Address */}
                    {order.shippingAddress && (
                        <div className="border border-gray-100 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin size={16} className="text-gray-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Shipping To
                                </span>
                            </div>
                            <p className="text-sm font-bold text-slate-900">{order.shippingAddress.fullName}</p>
                            <p className="text-xs text-gray-500">{order.shippingAddress.streetAddress}</p>
                            <p className="text-xs text-gray-500">
                                {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                            </p>
                            <p className="text-xs text-gray-500">{order.shippingAddress.country}</p>
                        </div>
                    )}

                    {/* Order Items */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                            Items in Order
                        </h4>
                        <div className="space-y-3">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-16 h-16 bg-white rounded-lg border border-gray-100 p-2 flex-shrink-0">
                                        <img
                                            src={item.imageUrl || 'https://via.placeholder.com/100?text=No+Image'}
                                            alt={item.productName}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-900">{item.productName}</p>
                                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-black">${item.unitPrice.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Total */}
                    <div className="border-t border-gray-100 pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Order Total
                            </span>
                            <span className="text-xl font-black text-slate-900">
                                ${order.total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
