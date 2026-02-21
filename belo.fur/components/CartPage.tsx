import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem } from '../api/types';

interface CartPageProps {
    items: CartItem[];
    onContinueShopping: () => void;
    onCheckout: () => void;
    onUpdateQuantity: (id: string, qty: number) => void;
    onRemoveItem: (id: string) => void;
}

const CartPage: React.FC<CartPageProps> = ({ items, onContinueShopping, onCheckout, onUpdateQuantity, onRemoveItem }) => {
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const grandTotal = subtotal;

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold mb-8 text-slate-900">Your Cart ({items.length} items)</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items Table */}
                <div className="flex-[2]">
                    <div className="w-full">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 border-b border-gray-200 pb-4 text-[13px] font-semibold text-slate-800 uppercase tracking-wider">
                            <div className="col-span-6">Product</div>
                            <div className="col-span-2 text-center">Unit Price</div>
                            <div className="col-span-2 text-center">Quantity</div>
                            <div className="col-span-2 text-right">Subtotal</div>
                        </div>

                        {/* Items */}
                        <div className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <div key={item.id} className="grid grid-cols-12 py-6 items-center">
                                    <div className="col-span-6 flex items-center gap-6">
                                        <div className="w-24 h-24 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                        </div>
                                        <span className="text-lg font-medium text-slate-900">{item.name}</span>
                                    </div>
                                    <div className="col-span-2 text-center font-medium text-slate-700">
                                        ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                    <div className="col-span-2 flex justify-center items-center">
                                        <div className="flex items-center border border-gray-200 rounded px-2 py-1 gap-3">
                                            <button
                                                onClick={() => onRemoveItem(item.id)}
                                                className="text-gray-400 hover:text-black mr-2"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                className={`text-gray-400 hover:text-black ${item.quantity <= 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                className="text-gray-400 hover:text-black"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-right font-bold text-slate-900 text-lg">
                                        ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cart Summary */}
                <div className="flex-1">
                    <div className="bg-white lg:border-l lg:border-gray-100 lg:pl-10">
                        <h2 className="text-xl font-bold mb-8 text-slate-900">Cart Summary</h2>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Sub Total</span>
                                <span className="font-bold text-slate-900">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm group cursor-pointer border-b border-gray-100 pb-4">
                                <span className="text-slate-700 font-medium">Coupon Code</span>
                                <span className="text-lg font-light text-gray-300">+</span>
                            </div>

                            <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-4">
                                <span className="text-slate-700 font-medium">Shipping</span>
                                <span className="text-slate-900 font-bold uppercase tracking-tighter">Free</span>
                            </div>

                            <div className="flex justify-between items-end pt-4">
                                <span className="text-lg font-bold text-slate-900">Grand Total</span>
                                <span className="text-2xl font-bold text-slate-900">${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>

                            <div className="flex flex-col gap-3 pt-6">
                                <button
                                    onClick={onCheckout}
                                    className="w-full bg-[#0c121e] text-white py-4 font-semibold text-sm rounded-sm hover:bg-slate-800 transition-colors uppercase tracking-wider"
                                >
                                    Proceed to checkout
                                </button>
                                <button
                                    onClick={onContinueShopping}
                                    className="w-full bg-white border border-slate-900 text-slate-900 py-4 font-semibold text-sm rounded-sm hover:bg-slate-50 transition-colors uppercase tracking-wider"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
