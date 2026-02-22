import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, MapPin } from 'lucide-react';
import { Order, payOrder } from '../../api/orderApi';
import { PAYMENT_METHODS } from './orderConstants';

interface PaymentModalProps {
    order: Order;
    onClose: () => void;
    onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ order, onClose, onPaymentSuccess }) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [paypalEmail, setPaypalEmail] = useState('');
    const [paypalPassword, setPaypalPassword] = useState('');
    const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});

    const formatCardNumber = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    const formatExpiry = (v: string) => {
        const d = v.replace(/\D/g, '').slice(0, 4);
        return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
    };

    const clearError = (field: string) => {
        setPaymentErrors(prev => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const validatePaymentForm = (): boolean => {
        const errs: Record<string, string> = {};
        if (selectedPaymentMethod === 1) {
            const raw = cardNumber.replace(/\s/g, '');
            if (!raw) errs.cardNumber = 'Card number is required';
            else if (raw.length < 13 || raw.length > 16) errs.cardNumber = 'Enter 13-16 digits';
            else if (!/^\d+$/.test(raw)) errs.cardNumber = 'Only digits allowed';

            if (!cardExpiry) {
                errs.cardExpiry = 'Expiry is required';
            } else if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
                errs.cardExpiry = 'Use MM/YY format';
            } else {
                const [monthStr, yearStr] = cardExpiry.split('/');
                const month = parseInt(monthStr, 10);
                const year = parseInt('20' + yearStr, 10);
                if (month < 1 || month > 12) {
                    errs.cardExpiry = 'Month must be 01-12';
                } else {
                    const now = new Date();
                    const expiryDate = new Date(year, month);
                    if (expiryDate <= now) {
                        errs.cardExpiry = 'Card has expired';
                    }
                }
            }

            if (!cardCvc) errs.cardCvc = 'CVC is required';
            else if (!/^\d{3,4}$/.test(cardCvc)) errs.cardCvc = '3-4 digits required';
        } else if (selectedPaymentMethod === 4) {
            if (!paypalEmail) errs.paypalEmail = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(paypalEmail)) errs.paypalEmail = 'Invalid email';
            if (!paypalPassword) errs.paypalPassword = 'Password is required';
        }
        setPaymentErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handlePaymentSubmit = async () => {
        if (!validatePaymentForm()) return;

        setPaymentLoading(true);
        try {
            await payOrder(order.id, {
                paymentTypeId: selectedPaymentMethod,
                amount: order.total,
            });
            onPaymentSuccess();
        } catch (err) {
            console.error('Payment failed:', err);
            alert('Payment failed. Please try again.');
        } finally {
            setPaymentLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard size={32} className="text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight">
                        Complete Payment
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                        Order #{order.id}
                    </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Order Total
                        </span>
                        <span className="text-2xl font-black text-slate-900">
                            ${order.total.toFixed(2)}
                        </span>
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest">
                        {order.items.length} item(s) • Free Shipping
                    </div>
                </div>

                {order.shippingAddress && (
                    <div className="border border-gray-100 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin size={14} className="text-gray-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Delivery Address
                            </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900">
                            {order.shippingAddress.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                            {order.shippingAddress.streetAddress},{' '}
                            {order.shippingAddress.city}
                        </p>
                        <p className="text-xs text-gray-500">
                            {order.shippingAddress.zipCode},{' '}
                            {order.shippingAddress.country}
                        </p>
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                        Select Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {PAYMENT_METHODS.map((method) => (
                            <button
                                key={method.id}
                                onClick={() => setSelectedPaymentMethod(method.id)}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${selectedPaymentMethod === method.id
                                    ? 'border-slate-900 bg-slate-50'
                                    : 'border-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                <span className="text-2xl">{method.icon}</span>
                                <p className="text-xs font-bold mt-2">{method.name}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {selectedPaymentMethod === 1 && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl space-y-3">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                            Card Details
                        </label>
                        <div>
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => { setCardNumber(formatCardNumber(e.target.value)); clearError('cardNumber'); }}
                                placeholder="Card Number (e.g., 4242 4242 4242 4242)"
                                className={`w-full border px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-slate-900 ${paymentErrors.cardNumber ? 'border-red-400' : 'border-gray-200'}`}
                            />
                            {paymentErrors.cardNumber && <p className="text-[9px] text-red-500 mt-1">{paymentErrors.cardNumber}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <input
                                    type="text"
                                    value={cardExpiry}
                                    onChange={(e) => { setCardExpiry(formatExpiry(e.target.value)); clearError('cardExpiry'); }}
                                    placeholder="MM/YY"
                                    className={`w-full border px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-slate-900 ${paymentErrors.cardExpiry ? 'border-red-400' : 'border-gray-200'}`}
                                />
                                {paymentErrors.cardExpiry && <p className="text-[9px] text-red-500 mt-1">{paymentErrors.cardExpiry}</p>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={cardCvc}
                                    onChange={(e) => { setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4)); clearError('cardCvc'); }}
                                    placeholder="CVC"
                                    className={`w-full border px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-slate-900 ${paymentErrors.cardCvc ? 'border-red-400' : 'border-gray-200'}`}
                                />
                                {paymentErrors.cardCvc && <p className="text-[9px] text-red-500 mt-1">{paymentErrors.cardCvc}</p>}
                            </div>
                        </div>
                        <p className="text-[9px] text-gray-400">
                            Your card details are securely encrypted.
                        </p>
                    </div>
                )}

                {selectedPaymentMethod === 3 && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl text-center">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-600 mb-3">
                            Apple Pay
                        </label>
                        <p className="text-4xl mb-4"></p>
                        <p className="text-[9px] text-gray-400">
                            Confirm payment using Face ID or Touch ID on your device
                        </p>
                    </div>
                )}

                {selectedPaymentMethod === 2 && (
                    <div className="mb-6 p-4 bg-green-50 rounded-xl space-y-3">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-green-600 mb-3">
                            Bank Transfer Details
                        </label>
                        <div className="bg-white p-3 rounded-lg border border-green-200">
                            <p className="text-[9px] text-gray-400 uppercase">Routing Number</p>
                            <p className="text-sm font-bold text-slate-900 font-mono">021000021</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-green-200">
                            <p className="text-[9px] text-gray-400 uppercase">Account Number</p>
                            <p className="text-sm font-bold text-slate-900 font-mono">1234567890</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-green-200">
                            <p className="text-[9px] text-gray-400 uppercase">Reference / Memo</p>
                            <p className="text-sm font-bold text-slate-900">Order #{order.id}</p>
                        </div>
                        <p className="text-[9px] text-gray-400 text-center">
                            Transfer will be verified within 1-2 business days
                        </p>
                    </div>
                )}

                {selectedPaymentMethod === 4 && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl space-y-3">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">
                            PayPal Login
                        </label>
                        <div>
                            <input
                                type="email"
                                value={paypalEmail}
                                onChange={(e) => { setPaypalEmail(e.target.value); clearError('paypalEmail'); }}
                                placeholder="PayPal Email"
                                className={`w-full border px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-blue-500 ${paymentErrors.paypalEmail ? 'border-red-400' : 'border-blue-200'}`}
                            />
                            {paymentErrors.paypalEmail && <p className="text-[9px] text-red-500 mt-1">{paymentErrors.paypalEmail}</p>}
                        </div>
                        <div>
                            <input
                                type="password"
                                value={paypalPassword}
                                onChange={(e) => { setPaypalPassword(e.target.value); clearError('paypalPassword'); }}
                                placeholder="PayPal Password"
                                className={`w-full border px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-blue-500 ${paymentErrors.paypalPassword ? 'border-red-400' : 'border-blue-200'}`}
                            />
                            {paymentErrors.paypalPassword && <p className="text-[9px] text-red-500 mt-1">{paymentErrors.paypalPassword}</p>}
                        </div>
                        <p className="text-[9px] text-gray-400 text-center">
                            You'll be redirected to PayPal for secure payment
                        </p>
                    </div>
                )}

                <button
                    onClick={handlePaymentSubmit}
                    disabled={paymentLoading}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {paymentLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                        <>
                            <CheckCircle2 size={18} />
                            Pay ${order.total.toFixed(2)}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PaymentModal;
