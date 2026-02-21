
import React, { useState } from 'react';
import { Truck, Box, CreditCard, ChevronDown, MapPin, ShieldCheck, Wallet, Info, Edit2 } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutPageProps {
    items: CartItem[];
    onBackToCart: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ items, onBackToCart }) => {
    const [step, setStep] = useState<'shipping' | 'delivery' | 'payment'>('shipping');
    const [paymentMethod, setPaymentMethod] = useState<string>('card');

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = 130.00; // Matching the screenshot value
    const grandTotal = subtotal - discount;

    const Stepper = () => (
        <div className="flex flex-col items-center w-full mb-12">
            <div className="flex items-center justify-between w-full max-w-md relative">
                <div className="absolute top-[14px] left-[5%] w-[90%] h-[2px] bg-gray-100 z-0"></div>
                <div
                    className="absolute top-[14px] left-[5%] h-[2px] bg-slate-900 z-0 transition-all duration-500"
                    style={{ width: step === 'shipping' ? '0%' : step === 'delivery' ? '45%' : '90%' }}
                ></div>

                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-3 h-3 rounded-full border-2 ${step === 'shipping' || step === 'delivery' || step === 'payment' ? 'bg-slate-900 border-slate-900' : 'bg-white border-gray-200'}`}></div>
                    <Box size={18} className={step === 'shipping' ? 'text-slate-900' : 'text-slate-400'} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${step === 'shipping' ? 'text-slate-900' : 'text-slate-400'}`}>Shipping</span>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-3 h-3 rounded-full border-2 ${step === 'delivery' || step === 'payment' ? 'bg-slate-900 border-slate-900' : 'bg-white border-gray-200'}`}></div>
                    <Truck size={18} className={step === 'delivery' ? 'text-slate-900' : 'text-slate-400'} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${step === 'delivery' ? 'text-slate-900' : 'text-slate-400'}`}>Delivery</span>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-3 h-3 rounded-full border-2 ${step === 'payment' ? 'bg-slate-900 border-slate-900' : 'bg-white border-gray-200'}`}></div>
                    <Wallet size={18} className={step === 'payment' ? 'text-slate-900' : 'text-slate-400'} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${step === 'payment' ? 'text-slate-900' : 'text-slate-400'}`}>Payment</span>
                </div>
            </div>
        </div>
    );

    const PaymentMethodButton = ({ id, label, icon }: { id: string, label: string, icon?: React.ReactNode }) => (
        <button
            onClick={() => setPaymentMethod(id)}
            className={`flex items-center gap-3 p-3 border rounded-sm transition-all text-xs font-semibold ${paymentMethod === id ? 'border-slate-900 bg-white ring-1 ring-slate-900' : 'border-gray-100 bg-white hover:border-gray-300'}`}
        >
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === id ? 'border-slate-900 bg-slate-900' : 'border-gray-300'}`}>
                {paymentMethod === id && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
            </div>
            {icon ? icon : <span>{label}</span>}
        </button>
    );

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row gap-20">

                {/* Left Form Section */}
                <div className="flex-[1.5]">
                    <Stepper />

                    {/* Section 1: Shipping Address (Form or Summary) */}
                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Shipping Address</h3>
                            {step !== 'shipping' && (
                                <button onClick={() => setStep('shipping')} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest">
                                    <Edit2 size={12} /> Edit Info
                                </button>
                            )}
                        </div>

                        {step === 'shipping' ? (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold mb-4">Contact</h4>
                                    <div className="space-y-4">
                                        <input type="email" placeholder="Enter Your Email *" className="w-full border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900" />
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 border-gray-300 rounded focus:ring-slate-900" />
                                            <span className="text-xs text-gray-500 font-medium">Email me news and offers</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="Your Full Name *" className="border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900" />
                                    <input placeholder="Phone Number *" className="border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900" />
                                    <div className="col-span-2 relative">
                                        <input placeholder="Enter Your street Address *" className="w-full border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900" />
                                        <MapPin size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                    <input placeholder="Apartment, suite, etc (optional)" className="col-span-2 border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900" />
                                    <input placeholder="Enter City *" className="border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900" />
                                    <div className="flex gap-4">
                                        <div className="relative flex-1">
                                            <select className="w-full appearance-none border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900 bg-white">
                                                <option>Your State *</option>
                                            </select>
                                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                        <input placeholder="ZIP Code *" className="w-32 border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900" />
                                    </div>
                                </div>
                                <button
                                    onClick={() => setStep('delivery')}
                                    className="w-full bg-[#0c121e] text-white py-4 font-bold text-sm rounded-sm hover:bg-slate-800 transition-all uppercase tracking-widest"
                                >
                                    Save & Continue
                                </button>
                            </div>
                        ) : (
                            <div className="border border-gray-100 rounded-sm p-6 space-y-3 bg-gray-50/30">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Box size={16} className="text-gray-400" /> <span>johnalex@gmail.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Box size={16} className="text-gray-400" /> <span>Jonathon Alex</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Box size={16} className="text-gray-400" /> <span>230 958 4320</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Box size={16} className="text-gray-400" /> <span>01752, A4</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Box size={16} className="text-gray-400" /> <span>Marlborough, Massachusetts, 01752</span>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Section 2: Delivery Option */}
                    <section className="mb-8 border-t border-gray-100 pt-8">
                        <h3 className="text-lg font-bold mb-4">Delivery Option</h3>
                        {step === 'delivery' ? (
                            <div className="space-y-6">
                                <div className="border border-slate-900 rounded-sm p-6 flex justify-between items-center bg-white">
                                    <div>
                                        <h5 className="text-sm font-bold text-slate-900">Free Delivery</h5>
                                        <p className="text-xs text-gray-400 mt-1">Delivered to the front door of your home or building.</p>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900">Free</span>
                                </div>
                                <button
                                    onClick={() => setStep('payment')}
                                    className="w-full bg-[#0c121e] text-white py-4 font-bold text-sm rounded-sm hover:bg-slate-800 transition-all uppercase tracking-widest"
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        ) : step === 'payment' ? (
                            <div className="border border-gray-100 rounded-sm p-6 flex justify-between items-center bg-gray-50/30">
                                <div>
                                    <h5 className="text-sm font-bold text-slate-900">Free Delivery</h5>
                                    <p className="text-xs text-gray-400">Standard Ground Shipping</p>
                                </div>
                                <span className="text-sm font-bold text-slate-900">Free</span>
                            </div>
                        ) : null}
                    </section>

                    {/* Section 3: Payment Method */}
                    <section className="mb-10 border-t border-gray-100 pt-8">
                        <h3 className="text-lg font-bold mb-6">Payment Method</h3>
                        {step === 'payment' && (
                            <div className="space-y-8">
                                {/* Payment Grid Selection */}
                                <div className="grid grid-cols-3 gap-4">
                                    <PaymentMethodButton id="card" label="Credit/Debit Card" />
                                    <PaymentMethodButton id="klarna" label="Klarna" icon={<span className="text-[#ffb3c7] font-black italic">Klarna.</span>} />
                                    <PaymentMethodButton id="apple" label="Apple Pay" icon={<div className="flex items-center gap-1 font-bold"><span className="text-[10px] mt-0.5">Pay</span></div>} />
                                    <PaymentMethodButton id="google" label="Google Pay" icon={<div className="flex items-center gap-1"><span className="text-blue-500 font-bold">G</span><span className="text-gray-500 font-bold text-[10px]">Pay</span></div>} />
                                    <PaymentMethodButton id="paypal" label="PayPal" icon={<div className="flex items-center gap-1 italic font-black text-blue-800"><span className="text-blue-500">Pay</span>Pal</div>} />
                                </div>

                                {/* Credit Card Detail Form */}
                                <div className="border border-gray-100 rounded-sm p-8 bg-white shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-sm font-bold">Credit/Debit Card</h4>
                                        <div className="flex gap-1">
                                            <div className="h-4 w-6 bg-gray-100 rounded text-[6px] flex items-center justify-center font-bold text-blue-800 italic">VISA</div>
                                            <div className="h-4 w-6 bg-gray-100 rounded flex items-center justify-center gap-[1px]">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full -ml-1"></div>
                                            </div>
                                            <div className="h-4 w-6 bg-gray-100 rounded text-[6px] flex items-center justify-center font-bold text-blue-400">AMEX</div>
                                            <div className="h-4 w-6 bg-gray-100 rounded text-[6px] flex items-center justify-center font-bold text-orange-500">DISC</div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <input placeholder="Card Number" className="w-full border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input placeholder="Expiration date (MM / YY)" className="border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900" />
                                            <div className="relative">
                                                <input placeholder="CCV" className="w-full border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900" />
                                                <Info size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className="w-full bg-[#0c121e] text-white py-4 mt-8 font-bold text-sm rounded-sm hover:bg-slate-800 transition-all uppercase tracking-widest"
                                    >
                                        Place Order
                                    </button>
                                    <p className="text-center text-[10px] text-gray-400 mt-4 font-medium italic">
                                        * By clicking Pay, you agree to the Link Terms and Privacy Policy.
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* Right Order Summary */}
                <div className="flex-1">
                    <div className="sticky top-8 border-l border-gray-100 pl-10">
                        <h2 className="text-xl font-bold mb-8">Order Summary</h2>

                        <div className="space-y-6 mb-10">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                                        <span className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">Qty: {item.quantity}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-xs font-bold text-slate-900">${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-8 border-t border-gray-100">
                            <div className="flex justify-between text-xs text-gray-400 font-medium">
                                <span>Sub Total</span>
                                <span className="text-slate-900 font-bold">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>

                            <div className="flex justify-between text-xs text-gray-400 font-medium">
                                <span>Discount</span>
                                <span className="text-slate-900 font-bold">- ${discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>

                            <div className="flex justify-between text-xs text-gray-400 font-medium">
                                <span>Shipping</span>
                                <span className="text-slate-900 font-bold">Free</span>
                            </div>

                            <div className="flex justify-between items-end pt-6 border-t border-gray-100">
                                <span className="text-sm font-bold text-slate-900">Grand Total</span>
                                <span className="text-xl font-bold text-slate-900">${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                            <ShieldCheck size={14} />
                            Secure Checkout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
