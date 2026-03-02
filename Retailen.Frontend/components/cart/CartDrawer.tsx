import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { CartItem } from '../../api/types';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onRemoveItem: (id: string) => void;
    onGoToCart: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
    isOpen,
    onClose,
    items,
    onRemoveItem,
    onGoToCart,
}) => {
    const total = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[110] 
                    transition-opacity duration-500 
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div
                className={`fixed top-0 right-0 h-full w-full max-w-[450px] bg-white 
                    z-[120] shadow-2xl transition-transform duration-500 transform 
                    flex flex-col 
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Cart ({items.length})
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:text-gray-500 transition-colors"
                    >
                        <X size={24} strokeWidth={1.5} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 divide-y divide-gray-100">
                    {items.map((item) => (
                        <div key={item.id} className="py-6 flex gap-4">
                            <div className="w-24 h-24 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover mix-blend-multiply"
                                />
                            </div>

                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-sm font-bold text-slate-900">
                                        {item.name}
                                    </h3>
                                    <button
                                        onClick={() => onRemoveItem(item.id)}
                                        className="flex items-center gap-1 text-[10px] text-gray-400 
                                            hover:text-red-500 transition-colors font-bold 
                                            uppercase tracking-widest"
                                    >
                                        <Trash2 size={12} /> Remove
                                    </button>
                                </div>

                                <p className="text-[11px] text-slate-800 font-bold leading-tight mb-4">
                                    {item.name}
                                </p>
                                {/* 
                                  REMOVED hardcoded Polish product description:
                                  "Wysoki stołek z oparciem ze stali..."
                                  "Rozmiar: ↑65 cm, Metal Sklum: Cromado..."
                                  
                                  If you need variant details, pass them via CartItem props.
                                */}

                                <div className="flex justify-between items-end mt-auto">
                                    <span className="text-xs text-slate-900 font-medium">
                                        Qty {item.quantity}
                                    </span>
                                    <span className="text-sm font-bold text-slate-900">
                                        ${item.price.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t-[2px] border-slate-900 p-6 space-y-8">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-slate-900">
                            Total
                        </span>
                        <span className="text-lg font-bold text-slate-900">
                            ${total.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                            })}
                        </span>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={onClose}
                            className="w-full border border-slate-900 py-4 text-[11px] 
                                font-bold uppercase tracking-widest 
                                hover:bg-gray-50 transition-colors"
                        >
                            CONTINUE SHOPPING
                        </button>
                        <button
                            onClick={onGoToCart}
                            className="w-full bg-[#0c121e] text-white py-4 text-[11px] 
                                font-bold uppercase tracking-widest 
                                hover:bg-slate-800 transition-colors"
                        >
                            GO TO CART
                        </button>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[11px] text-gray-500 font-medium">
                            Quick checkout available — no registration required
                        </p>
                        <p className="text-[11px] text-gray-500 font-medium">
                            By proceeding, you accept our{' '}
                            <a
                                href="#"
                                className="underline text-slate-900 font-bold"
                            >
                                terms of purchase
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;