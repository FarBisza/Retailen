import { Order } from '../../api/orderApi';

// Status ID mapping from backend OrderStatus table
// 1=AwaitingPayment, 2=Paid, 3=Processing, 4=Shipped, 5=Delivered, 6=Cancelled
export const STATUS = {
    AWAITING_PAYMENT: 1,
    PAID: 2,
    PROCESSING: 3,
    SHIPPED: 4,
    DELIVERED: 5,
};

// Payment methods — matches DB PaymentType table
// 1=Credit Card, 2=Bank Transfer, 3=Apple Pay, 4=PayPal
export const PAYMENT_METHODS = [
    { id: 1, name: 'Credit Card', icon: '💳' },
    { id: 3, name: 'Apple Pay', icon: '' },
    { id: 4, name: 'PayPal', icon: '🅿️' },
    { id: 2, name: 'Bank Transfer', icon: '🏦' },
];

// Estimate delivery date (14 days from ship date or order date)
export const getEstimatedDelivery = (order: Order) => {
    const baseDate = order.shipment?.shippedDate
        ? new Date(order.shipment.shippedDate)
        : new Date(order.orderDate);
    const estimatedDate = new Date(baseDate);
    estimatedDate.setDate(estimatedDate.getDate() + 14);
    return estimatedDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
};
