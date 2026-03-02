import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Truck, Box, CreditCard, ChevronDown, MapPin,
    ShieldCheck, Wallet, Info, Edit2, Lock
} from 'lucide-react';
import { CartItem } from '../../api/types';

interface CheckoutPageProps {
    items: CartItem[];
    onBackToCart: () => void;
    onGoHome?: () => void;
    onViewOrders?: () => void;
    onOrderSuccess?: () => void;
    currentUser?: any;
    onLoginClick?: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
    items,
    onBackToCart,
    onGoHome,
    onViewOrders,
    onOrderSuccess,
    currentUser,
    onLoginClick,
}) => {
    const [step, setStep] = useState<'shipping' | 'delivery' | 'payment'>(
        'shipping'
    );
    const [paymentMethod, setPaymentMethod] = useState<string>('card');

    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState<number | null>(null);
    const [orderPaid, setOrderPaid] = useState(false);

    const [checkoutCardNumber, setCheckoutCardNumber] = useState('');
    const [checkoutExpiry, setCheckoutExpiry] = useState('');
    const [checkoutCvc, setCheckoutCvc] = useState('');
    const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
    const [cardTouched, setCardTouched] = useState<Record<string, boolean>>({});

    // ─── React Hook Form for shipping/billing ───
    interface ShippingFormData {
        email: string;
        newsOffers: boolean;
        fullName: string;
        phone: string;
        address: string;
        apartment: string;
        city: string;
        state: string;
        zip: string;
        requestInvoice: boolean;
        companyName: string;
        taxId: string;
        invoiceAddress: string;
    }

    const {
        register,
        handleSubmit,
        getValues,
        watch,
        formState: { errors },
    } = useForm<ShippingFormData>({
        defaultValues: {
            email: '',
            newsOffers: false,
            fullName: '',
            phone: '',
            address: '',
            apartment: '',
            city: '',
            state: '',
            zip: '',
            requestInvoice: false,
            companyName: '',
            taxId: '',
            invoiceAddress: '',
        },
        mode: 'onBlur',
    });

    const formData = watch();

    const getDefaultDeliveryDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 14);
        return date.toISOString().split('T')[0];
    };
    const getMinDeliveryDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        return date.toISOString().split('T')[0];
    };
    const getMaxDeliveryDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date.toISOString().split('T')[0];
    };
    const [deliveryDate, setDeliveryDate] = useState(getDefaultDeliveryDate());

    const handleContinueToDelivery = handleSubmit(() => {
        setStep('delivery');
    });

    const validateCardNumber = (val: string): string => {
        const raw = val.replace(/\s/g, '');
        if (!raw) return '';
        if (!/^\d+$/.test(raw)) return 'Numbers only';
        if (raw.length < 13) return 'Card number too short';
        if (raw.length > 19) return 'Card number too long';
        return '';
    };

    const validateExpiry = (val: string): string => {
        if (!val) return '';
        if (!/^\d{2}\/\d{2}$/.test(val)) return 'Use MM/YY format';
        const [mm, yy] = val.split('/').map(Number);
        if (mm < 1 || mm > 12) return 'Invalid month';
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
            return 'Card has expired';
        }
        return '';
    };

    const validateCvc = (val: string): string => {
        if (!val) return '';
        if (!/^\d{3,4}$/.test(val)) return '3 or 4 digits required';
        return '';
    };

    const handleCardBlur = (field: string) => {
        setCardTouched(prev => ({ ...prev, [field]: true }));
        const newErrors = { ...cardErrors };
        if (field === 'number') newErrors.number = validateCardNumber(checkoutCardNumber);
        if (field === 'expiry') newErrors.expiry = validateExpiry(checkoutExpiry);
        if (field === 'cvc') newErrors.cvc = validateCvc(checkoutCvc);
        setCardErrors(newErrors);
    };

    const isCardPartiallyFilled = (): boolean => {
        const raw = checkoutCardNumber.replace(/\s/g, '');
        return raw.length > 0 || checkoutExpiry.length > 0 || checkoutCvc.length > 0;
    };

    const validateAllCardFields = (): boolean => {
        const numErr = validateCardNumber(checkoutCardNumber);
        const expErr = validateExpiry(checkoutExpiry);
        const cvcErr = validateCvc(checkoutCvc);
        setCardErrors({ number: numErr, expiry: expErr, cvc: cvcErr });
        setCardTouched({ number: true, expiry: true, cvc: true });
        return !numErr && !expErr && !cvcErr;
    };

    const subtotal = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const discount = 0;
    const grandTotal = subtotal - discount;

    const Stepper = () => (
        <div className="flex flex-col items-center w-full mb-12">
            <div className="flex items-center justify-between w-full max-w-md relative">
                <div className="absolute top-[14px] left-[5%] w-[90%] h-[2px] bg-gray-100 z-0" />
                <div
                    className="absolute top-[14px] left-[5%] h-[2px] bg-slate-900 z-0 transition-all duration-500"
                    style={{
                        width:
                            step === 'shipping'
                                ? '0%'
                                : step === 'delivery'
                                    ? '45%'
                                    : '90%',
                    }}
                />

                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div
                        className={`w-3 h-3 rounded-full border-2 ${step === 'shipping' ||
                            step === 'delivery' ||
                            step === 'payment'
                            ? 'bg-slate-900 border-slate-900'
                            : 'bg-white border-gray-200'
                            }`}
                    />
                    <Box
                        size={18}
                        className={
                            step === 'shipping'
                                ? 'text-slate-900'
                                : 'text-slate-400'
                        }
                    />
                    <span
                        className={`text-[10px] font-bold uppercase tracking-widest ${step === 'shipping'
                            ? 'text-slate-900'
                            : 'text-slate-400'
                            }`}
                    >
                        Shipping
                    </span>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div
                        className={`w-3 h-3 rounded-full border-2 ${step === 'delivery' || step === 'payment'
                            ? 'bg-slate-900 border-slate-900'
                            : 'bg-white border-gray-200'
                            }`}
                    />
                    <Truck
                        size={18}
                        className={
                            step === 'delivery'
                                ? 'text-slate-900'
                                : 'text-slate-400'
                        }
                    />
                    <span
                        className={`text-[10px] font-bold uppercase tracking-widest ${step === 'delivery'
                            ? 'text-slate-900'
                            : 'text-slate-400'
                            }`}
                    >
                        Delivery
                    </span>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div
                        className={`w-3 h-3 rounded-full border-2 ${step === 'payment'
                            ? 'bg-slate-900 border-slate-900'
                            : 'bg-white border-gray-200'
                            }`}
                    />
                    <Wallet
                        size={18}
                        className={
                            step === 'payment'
                                ? 'text-slate-900'
                                : 'text-slate-400'
                        }
                    />
                    <span
                        className={`text-[10px] font-bold uppercase tracking-widest ${step === 'payment'
                            ? 'text-slate-900'
                            : 'text-slate-400'
                            }`}
                    >
                        Payment
                    </span>
                </div>
            </div>
        </div>
    );

    const PaymentMethodButton = ({
        id,
        label,
        icon,
    }: {
        id: string;
        label: string;
        icon?: React.ReactNode;
    }) => (
        <button
            onClick={() => setPaymentMethod(id)}
            className={`flex items-center gap-3 p-3 border rounded-sm transition-all text-xs font-semibold ${paymentMethod === id
                ? 'border-slate-900 bg-white ring-1 ring-slate-900'
                : 'border-gray-100 bg-white hover:border-gray-300'
                }`}
        >
            <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === id
                    ? 'border-slate-900 bg-slate-900'
                    : 'border-gray-300'
                    }`}
            >
                {paymentMethod === id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
            </div>
            {icon ? icon : <span>{label}</span>}
        </button>
    );

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
                <div className="flex-[1.5]">
                    <Stepper />

                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Shipping Address</h3>
                            {step !== 'shipping' && (
                                <button
                                    onClick={() => setStep('shipping')}
                                    className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest"
                                >
                                    <Edit2 size={12} /> Edit Info
                                </button>
                            )}
                        </div>

                        {step === 'shipping' ? (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold mb-4">Contact</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <input
                                                {...register('email', {
                                                    required: 'Email is required',
                                                    pattern: {
                                                        value: /\S+@\S+\.\S+/,
                                                        message: 'Email is invalid',
                                                    },
                                                })}
                                                type="email"
                                                placeholder="Enter Your Email *"
                                                className={`w-full border px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900 ${errors.email
                                                    ? 'border-red-500'
                                                    : 'border-gray-200'
                                                    }`}
                                            />
                                            {errors.email && (
                                                <span className="text-xs text-red-500 mt-1">
                                                    {errors.email.message}
                                                </span>
                                            )}
                                        </div>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                {...register('newsOffers')}
                                                type="checkbox"
                                                className="w-4 h-4 border-gray-300 rounded focus:ring-slate-900"
                                            />
                                            <span className="text-xs text-gray-500 font-medium">
                                                Email me news and offers
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            {...register('fullName', { required: 'Full Name is required' })}
                                            placeholder="Your Full Name *"
                                            className={`w-full border px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900 ${errors.fullName
                                                ? 'border-red-500'
                                                : 'border-gray-200'
                                                }`}
                                        />
                                        {errors.fullName && (
                                            <span className="text-xs text-red-500 mt-1">
                                                {errors.fullName.message}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            {...register('phone', { required: 'Phone Number is required' })}
                                            placeholder="Phone Number *"
                                            className={`w-full border px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900 ${errors.phone
                                                ? 'border-red-500'
                                                : 'border-gray-200'
                                                }`}
                                        />
                                        {errors.phone && (
                                            <span className="text-xs text-red-500 mt-1">
                                                {errors.phone.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-2 relative">
                                        <input
                                            {...register('address', { required: 'Street Address is required' })}
                                            placeholder="Enter Your Street Address *"
                                            className={`w-full border px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900 ${errors.address
                                                ? 'border-red-500'
                                                : 'border-gray-200'
                                                }`}
                                        />
                                        <MapPin
                                            size={16}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />
                                        {errors.address && (
                                            <span className="text-xs text-red-500 mt-1">
                                                {errors.address.message}
                                            </span>
                                        )}
                                    </div>
                                    <input
                                        {...register('apartment')}
                                        placeholder="Apartment, suite, etc (optional)"
                                        className="col-span-2 border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900"
                                    />
                                    <div>
                                        <input
                                            {...register('city', { required: 'City is required' })}
                                            placeholder="Enter City *"
                                            className={`w-full border px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900 ${errors.city
                                                ? 'border-red-500'
                                                : 'border-gray-200'
                                                }`}
                                        />
                                        {errors.city && (
                                            <span className="text-xs text-red-500 mt-1">
                                                {errors.city.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="relative flex-1">
                                            <select
                                                {...register('state', { required: 'State is required' })}
                                                className={`w-full appearance-none border px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900 bg-white ${errors.state
                                                    ? 'border-red-500'
                                                    : 'border-gray-200'
                                                    }`}
                                            >
                                                <option value="">Your State *</option>
                                                <option value="MA">Massachusetts</option>
                                                <option value="NY">New York</option>
                                                <option value="CA">California</option>
                                                <option value="TX">Texas</option>
                                                <option value="IL">Illinois</option>
                                                <option value="FL">Florida</option>
                                            </select>
                                            <ChevronDown
                                                size={14}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                            />
                                            {errors.state && (
                                                <span className="text-xs text-red-500 mt-1 absolute -bottom-5 left-0">
                                                    {errors.state.message}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                {...register('zip', { required: 'ZIP Code is required' })}
                                                placeholder="ZIP Code *"
                                                className={`w-32 border px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900 ${errors.zip
                                                    ? 'border-red-500'
                                                    : 'border-gray-200'
                                                    }`}
                                            />
                                            {errors.zip && (
                                                <span className="text-xs text-red-500 mt-1 block">
                                                    {errors.zip.message}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleContinueToDelivery}
                                    className="w-full bg-[#0c121e] text-white py-4 font-bold text-sm rounded-sm hover:bg-slate-800 transition-all uppercase tracking-widest"
                                >
                                    Save & Continue
                                </button>
                            </div>
                        ) : (
                            <div className="border border-gray-100 rounded-sm p-6 space-y-3 bg-gray-50/30">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Box size={16} className="text-gray-400" />
                                    <span>{formData.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Box size={16} className="text-gray-400" />
                                    <span>{formData.fullName}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Box size={16} className="text-gray-400" />
                                    <span>{formData.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Box size={16} className="text-gray-400" />
                                    <span>
                                        {formData.address}
                                        {formData.apartment
                                            ? `, ${formData.apartment}`
                                            : ''}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Box size={16} className="text-gray-400" />
                                    <span>
                                        {formData.city}, {formData.state},{' '}
                                        {formData.zip}
                                    </span>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="mb-8 border-t border-gray-100 pt-8">
                        <h3 className="text-lg font-bold mb-4">Delivery Option</h3>
                        {step === 'delivery' ? (
                            <div className="space-y-6">
                                <div className="border border-slate-900 rounded-sm p-6 bg-white">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h5 className="text-sm font-bold text-slate-900">
                                                Free Delivery
                                            </h5>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Delivered to the front door of your
                                                home or building.
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-black uppercase tracking-widest rounded-full">
                                            Free
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 mt-4">
                                        <label className="block text-xs font-bold text-gray-700 mb-2">
                                            Expected Delivery Date
                                        </label>
                                        <input
                                            type="date"
                                            value={deliveryDate}
                                            onChange={(e) =>
                                                setDeliveryDate(e.target.value)
                                            }
                                            min={getMinDeliveryDate()}
                                            max={getMaxDeliveryDate()}
                                            className="w-full border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900 bg-gray-50"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                                            📅 Estimated arrival:{' '}
                                            {new Date(
                                                deliveryDate
                                            ).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
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
                                    <h5 className="text-sm font-bold text-slate-900">
                                        Free Delivery
                                    </h5>
                                    <p className="text-xs text-gray-400">
                                        Standard Ground Shipping
                                    </p>
                                </div>
                                <span className="text-sm font-bold text-slate-900">
                                    Free
                                </span>
                            </div>
                        ) : null}
                    </section>

                    <section className="mb-10 border-t border-gray-100 pt-8">
                        <h3 className="text-lg font-bold mb-6">Payment Method</h3>
                        {step === 'payment' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <PaymentMethodButton
                                        id="card"
                                        label="Credit/Debit Card"
                                    />
                                    <PaymentMethodButton
                                        id="apple-pay"
                                        label="Apple Pay"
                                        icon={
                                            <span className="font-black text-gray-800">
                                                Pay
                                            </span>
                                        }
                                    />
                                    <PaymentMethodButton
                                        id="transfer"
                                        label="Bank Transfer"
                                        icon={
                                            <span className="font-bold text-green-700">
                                                Transfer
                                            </span>
                                        }
                                    />
                                    <PaymentMethodButton
                                        id="paypal"
                                        label="PayPal"
                                        icon={
                                            <div className="flex items-center gap-1 italic font-black text-blue-800">
                                                <span className="text-blue-500">
                                                    Pay
                                                </span>
                                                Pal
                                            </div>
                                        }
                                    />
                                </div>

                                <div className="border border-gray-100 rounded-sm p-8 bg-white shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-sm font-bold">
                                            Credit/Debit Card
                                        </h4>
                                        <div className="flex gap-1">
                                            <div className="h-4 w-6 bg-gray-100 rounded text-[6px] flex items-center justify-center font-bold text-blue-800 italic">
                                                VISA
                                            </div>
                                            <div className="h-4 w-6 bg-gray-100 rounded flex items-center justify-center gap-[1px]">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full -ml-1" />
                                            </div>
                                            <div className="h-4 w-6 bg-gray-100 rounded text-[6px] flex items-center justify-center font-bold text-blue-400">
                                                AMEX
                                            </div>
                                            <div className="h-4 w-6 bg-gray-100 rounded text-[6px] flex items-center justify-center font-bold text-orange-500">
                                                DISC
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <input
                                                value={checkoutCardNumber}
                                                onChange={(e) => {
                                                    const v = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
                                                    setCheckoutCardNumber(v);
                                                    if (cardTouched.number) {
                                                        setCardErrors(prev => ({ ...prev, number: validateCardNumber(v) }));
                                                    }
                                                }}
                                                onBlur={() => handleCardBlur('number')}
                                                placeholder="Card Number"
                                                className={`w-full border px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900 ${cardTouched.number && cardErrors.number ? 'border-red-500 bg-red-50/30' : 'border-gray-200'
                                                    }`}
                                            />
                                            {cardTouched.number && cardErrors.number && (
                                                <span className="text-xs text-red-500 mt-1 block">{cardErrors.number}</span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <input
                                                    value={checkoutExpiry}
                                                    onChange={(e) => {
                                                        const d = e.target.value.replace(/\D/g, '').slice(0, 4);
                                                        const formatted = d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
                                                        setCheckoutExpiry(formatted);
                                                        if (cardTouched.expiry) {
                                                            setCardErrors(prev => ({ ...prev, expiry: validateExpiry(formatted) }));
                                                        }
                                                    }}
                                                    onBlur={() => handleCardBlur('expiry')}
                                                    placeholder="Expiration (MM / YY)"
                                                    className={`w-full border px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900 ${cardTouched.expiry && cardErrors.expiry ? 'border-red-500 bg-red-50/30' : 'border-gray-200'
                                                        }`}
                                                />
                                                {cardTouched.expiry && cardErrors.expiry && (
                                                    <span className="text-xs text-red-500 mt-1 block">{cardErrors.expiry}</span>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <input
                                                    value={checkoutCvc}
                                                    onChange={(e) => {
                                                        const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                                                        setCheckoutCvc(v);
                                                        if (cardTouched.cvc) {
                                                            setCardErrors(prev => ({ ...prev, cvc: validateCvc(v) }));
                                                        }
                                                    }}
                                                    onBlur={() => handleCardBlur('cvc')}
                                                    placeholder="CVV"
                                                    className={`w-full border px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900 ${cardTouched.cvc && cardErrors.cvc ? 'border-red-500 bg-red-50/30' : 'border-gray-200'
                                                        }`}
                                                />
                                                <Info
                                                    size={14}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                                                />
                                                {cardTouched.cvc && cardErrors.cvc && (
                                                    <span className="text-xs text-red-500 mt-1 block">{cardErrors.cvc}</span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 italic">
                                            Leave card fields empty to pay later from My Purchases → To Pay
                                        </p>
                                    </div>

                                    {paymentMethod === 'transfer' && (
                                        <div className="mt-4 p-4 bg-green-50 rounded-sm space-y-3">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-green-600 mb-3">
                                                Bank Transfer Details
                                            </label>
                                            <div className="bg-white p-3 rounded-sm border border-green-200">
                                                <p className="text-[9px] text-gray-400 uppercase">Routing Number</p>
                                                <p className="text-sm font-bold text-slate-900 font-mono">021000021</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-sm border border-green-200">
                                                <p className="text-[9px] text-gray-400 uppercase">Account Number</p>
                                                <p className="text-sm font-bold text-slate-900 font-mono">1234567890</p>
                                            </div>
                                            <p className="text-[9px] text-gray-400 text-center">
                                                Transfer will be verified within 1-2 business days
                                            </p>
                                        </div>
                                    )}

                                    {paymentMethod === 'apple-pay' && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-sm text-center">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-600 mb-3">
                                                Apple Pay
                                            </label>
                                            <p className="text-4xl mb-4"></p>
                                            <p className="text-[9px] text-gray-400">
                                                Confirm payment using Face ID or Touch ID on your device
                                            </p>
                                        </div>
                                    )}

                                    {paymentMethod === 'paypal' && (
                                        <div className="mt-4 p-4 bg-blue-50 rounded-sm space-y-3">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">
                                                PayPal Login
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="PayPal Email"
                                                className="w-full border border-blue-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-blue-500"
                                            />
                                            <input
                                                type="password"
                                                placeholder="PayPal Password"
                                                className="w-full border border-blue-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-blue-500"
                                            />
                                            <p className="text-[9px] text-gray-400 text-center">
                                                You'll be redirected to PayPal for secure payment
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-6 border border-gray-100 rounded-sm p-4 bg-gray-50/30">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                {...register('requestInvoice')}
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900"
                                            />
                                            <div>
                                                <span className="text-sm font-bold text-slate-900">
                                                    Request Invoice
                                                </span>
                                                <p className="text-[10px] text-gray-400">
                                                    I need a tax invoice for this purchase
                                                </p>
                                            </div>
                                        </label>

                                        {formData.requestInvoice && (
                                            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                                                <input
                                                    {...register('companyName')}
                                                    placeholder="Company / Buyer Name (optional)"
                                                    className="w-full border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900"
                                                />
                                                <div>
                                                    <input
                                                        {...register('taxId', {
                                                            required: formData.requestInvoice ? 'Tax ID is required for invoice' : false
                                                        })}
                                                        placeholder="Tax ID (NIP) *"
                                                        className={`w-full border px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900 ${formData.requestInvoice && !formData.taxId?.trim()
                                                            ? 'border-red-400 bg-red-50/30'
                                                            : 'border-gray-200'
                                                            }`}
                                                    />
                                                    {formData.requestInvoice && !formData.taxId?.trim() && (
                                                        <span className="text-xs text-red-500 mt-1 block">Tax ID (NIP) is required for invoice</span>
                                                    )}
                                                </div>
                                                <input
                                                    {...register('invoiceAddress')}
                                                    placeholder="Company Address (optional)"
                                                    className="w-full border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-slate-900"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={async () => {
                                            if (!currentUser) {
                                                if (onLoginClick) onLoginClick();
                                                return;
                                            }
                                            try {
                                                if (formData.requestInvoice && !formData.taxId?.trim()) {
                                                    alert('Tax ID (NIP) is required when requesting an invoice.');
                                                    return;
                                                }
                                                if (paymentMethod === 'card' && isCardPartiallyFilled()) {
                                                    if (!validateAllCardFields()) {
                                                        alert('Please complete or clear the card details. Red highlighted fields need attention.');
                                                        return;
                                                    }
                                                }

                                                const { checkout, requestInvoice } = await import(
                                                    '../../api/orderApi'
                                                );

                                                const addressData = {
                                                    email: formData.email,
                                                    fullName: formData.fullName,
                                                    phoneNumber: formData.phone,
                                                    streetAddress: formData.address,
                                                    apartment: formData.apartment,
                                                    city: formData.city,
                                                    state: formData.state,
                                                    zipCode: formData.zip,
                                                    country: 'US',
                                                };

                                                const orderRes =
                                                    await checkout(addressData);
                                                console.log(
                                                    'Order created:',
                                                    orderRes
                                                );

                                                if (formData.requestInvoice) {
                                                    try {
                                                        await requestInvoice(orderRes.orderId, {
                                                            buyerName: formData.companyName,
                                                            taxId: formData.taxId,
                                                            address: formData.invoiceAddress,
                                                            city: formData.city,
                                                            zipCode: formData.zip,
                                                            country: 'US',
                                                            email: formData.email
                                                        });
                                                    } catch (invErr) {
                                                        console.error('Failed to request invoice:', invErr);
                                                    }
                                                }

                                                setOrderId(orderRes.orderId);

                                                const paymentTypeMap: Record<string, number> = {
                                                    'card': 1,
                                                    'transfer': 2,
                                                    'apple-pay': 3,
                                                    'paypal': 4,
                                                };
                                                const paymentTypeId = paymentTypeMap[paymentMethod] || 1;

                                                const cardRaw = checkoutCardNumber.replace(/\s/g, '');
                                                const hasCardDetails = cardRaw.length >= 13 && /^\d{2}\/\d{2}$/.test(checkoutExpiry) && /^\d{3,4}$/.test(checkoutCvc);

                                                const shouldPayNow = paymentMethod !== 'card' || hasCardDetails;

                                                if (shouldPayNow) {
                                                    try {
                                                        const { payOrder } = await import('../../api/orderApi');
                                                        await payOrder(orderRes.orderId, {
                                                            paymentTypeId,
                                                            amount: orderRes.total,
                                                        });
                                                        setOrderPaid(true);
                                                    } catch (payErr: any) {
                                                        console.error('Payment failed after order created:', payErr);
                                                        setOrderPaid(false);
                                                        alert(`Order #${orderRes.orderId} was created, but payment failed: ${payErr?.message || 'Unknown error'}. You can pay later from My Purchases → To Pay.`);
                                                    }
                                                } else {
                                                    setOrderPaid(false);
                                                }

                                                setOrderSuccess(true);
                                                if (onOrderSuccess) onOrderSuccess();
                                            } catch (err: any) {
                                                console.error(err);
                                                let msg = 'Something went wrong. Please try again.';
                                                if (err instanceof Error) {
                                                    try {
                                                        const jsonMatch = err.message.match(/\{.*\}/);
                                                        if (jsonMatch) {
                                                            const parsed = JSON.parse(jsonMatch[0]);
                                                            msg = parsed.message || err.message;
                                                        } else {
                                                            msg = err.message;
                                                        }
                                                    } catch {
                                                        msg = err.message;
                                                    }
                                                }
                                                alert(msg);
                                            }
                                        }}
                                        className="w-full bg-[#0c121e] text-white py-4 mt-8 font-bold text-sm rounded-sm hover:bg-slate-800 transition-all uppercase tracking-widest"
                                    >
                                        Place Order
                                    </button>
                                    <p className="text-center text-[10px] text-gray-400 mt-4 font-medium italic">
                                        * By clicking Place Order, you agree to our
                                        Terms and Privacy Policy.
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                <div className="flex-1">
                    <div className="sticky top-8 border-l border-gray-100 pl-10">
                        <h2 className="text-xl font-bold mb-8">Order Summary</h2>

                        <div className="space-y-6 mb-10">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover mix-blend-multiply"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h4 className="text-xs font-bold text-slate-900">
                                            {item.name}
                                        </h4>
                                        <span className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">
                                            Qty: {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-xs font-bold text-slate-900">
                                            $
                                            {(
                                                item.price * item.quantity
                                            ).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-8 border-t border-gray-100">
                            <div className="flex justify-between text-xs text-gray-400 font-medium">
                                <span>Sub Total</span>
                                <span className="text-slate-900 font-bold">
                                    $
                                    {subtotal.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-xs text-gray-400 font-medium">
                                    <span>Discount</span>
                                    <span className="text-slate-900 font-bold">
                                        - $
                                        {discount.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-xs text-gray-400 font-medium">
                                <span>Shipping</span>
                                <span className="text-slate-900 font-bold">
                                    Free
                                </span>
                            </div>
                            <div className="flex justify-between items-end pt-6 border-t border-gray-100">
                                <span className="text-sm font-bold text-slate-900">
                                    Grand Total
                                </span>
                                <span className="text-xl font-bold text-slate-900">
                                    $
                                    {grandTotal.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                            <ShieldCheck size={14} />
                            Secure Checkout
                        </div>
                    </div>
                </div>
            </div>

            {orderSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-sm shadow-2xl w-full max-w-md p-10 text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-50 flex items-center justify-center">
                            <ShieldCheck size={40} className="text-yellow-500" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-3">
                            {orderPaid ? 'Order Placed & Paid!' : 'Order Created!'}
                        </h2>
                        <p className="text-gray-500 text-sm mb-2">
                            Your order{' '}
                            <span className="font-bold text-slate-900">
                                #{orderId}
                            </span>{' '}
                            {orderPaid
                                ? 'has been confirmed and is being processed.'
                                : 'is awaiting payment.'}
                        </p>
                        <p className="text-gray-400 text-xs mb-8">
                            {orderPaid
                                ? 'You can track your order from the "To Ship" tab in My Orders.'
                                : 'Complete your payment from the "To Pay" tab in My Orders to confirm your purchase.'}
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    setOrderSuccess(false);
                                    if (onViewOrders) onViewOrders();
                                }}
                                className="w-full bg-slate-900 text-white py-4 font-bold text-sm rounded-sm hover:bg-black transition-all uppercase tracking-widest"
                            >
                                {orderPaid ? 'View My Orders' : 'Pay Now'}
                            </button>
                            <button
                                onClick={() => {
                                    setOrderSuccess(false);
                                    if (onGoHome) onGoHome();
                                }}
                                className="w-full border-2 border-slate-900 text-slate-900 py-4 font-bold text-sm rounded-sm hover:bg-slate-50 transition-all uppercase tracking-widest"
                            >
                                {orderPaid ? 'Continue Shopping' : 'Pay Later'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;