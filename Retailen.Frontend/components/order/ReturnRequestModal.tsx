import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Order } from '../../api/orderApi';
import { createReturn } from '../../api/returnApi';

interface ReturnRequestModalProps {
    order: Order;
    onClose: () => void;
    onReturnSuccess: () => void;
}

const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({ order, onClose, onReturnSuccess }) => {
    const [returnSelectedItemId, setReturnSelectedItemId] = useState<number | null>(
        order.items.length > 0 ? order.items[0].id : null
    );
    const [returnQuantity, setReturnQuantity] = useState(1);
    const [returnReason, setReturnReason] = useState('Defective');
    const [returnDescription, setReturnDescription] = useState('');
    const [returnLoading, setReturnLoading] = useState(false);

    const handleReturnSubmit = async () => {
        if (!returnSelectedItemId) return;
        setReturnLoading(true);
        try {
            await createReturn({
                orderId: order.id,
                orderItemId: returnSelectedItemId,
                quantity: returnQuantity,
                reason: returnReason,
                description: returnDescription || undefined,
            });
            onReturnSuccess();
        } catch (err) {
            console.error('Return request failed:', err);
            alert('Failed to submit return request.');
        } finally {
            setReturnLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[300] animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md mx-4 rounded-sm shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                        Request Return
                    </h3>
                    <button onClick={onClose} className="text-gray-300 hover:text-gray-500">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-8 space-y-5">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Order #{order.id} — Select Item</label>
                        <select
                            value={returnSelectedItemId || ''}
                            onChange={(e) => setReturnSelectedItemId(Number(e.target.value))}
                            className="w-full border border-gray-200 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-slate-900"
                        >
                            {order.items.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.productName} (x{item.quantity})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Quantity</label>
                        <input
                            type="number"
                            min={1}
                            max={order.items.find(i => i.id === returnSelectedItemId)?.quantity || 1}
                            value={returnQuantity}
                            onChange={(e) => setReturnQuantity(Math.max(1, Number(e.target.value)))}
                            className="w-full border border-gray-200 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-slate-900"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Reason</label>
                        <select
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
                            className="w-full border border-gray-200 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-slate-900"
                        >
                            <option value="Defective">Defective Product</option>
                            <option value="Wrong Item">Wrong Item Received</option>
                            <option value="Changed Mind">Changed My Mind</option>
                            <option value="Damaged">Damaged in Transit</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Description (Optional)</label>
                        <textarea
                            value={returnDescription}
                            onChange={(e) => setReturnDescription(e.target.value)}
                            placeholder="Tell us more about the issue..."
                            rows={3}
                            className="w-full border border-gray-200 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-slate-900 resize-none"
                        />
                    </div>
                    <button
                        onClick={handleReturnSubmit}
                        disabled={returnLoading || !returnSelectedItemId}
                        className="w-full bg-amber-500 text-white py-4 font-black text-[10px] uppercase tracking-widest rounded-sm hover:bg-amber-600 transition-all disabled:opacity-50"
                    >
                        {returnLoading ? 'Submitting...' : 'Submit Return Request'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReturnRequestModal;
