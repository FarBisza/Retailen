import { Order } from '../../api/orderApi';

export const STATUS = {
    AWAITING_PAYMENT: 1,
    PAID: 2,
    PROCESSING: 3,
    SHIPPED: 4,
    DELIVERED: 5,
};

export const PAYMENT_METHODS = [
    { id: 1, name: 'Credit Card', icon: '💳' },
    { id: 3, name: 'Apple Pay', icon: '' },
    { id: 4, name: 'PayPal', icon: '🅿️' },
    { id: 2, name: 'Bank Transfer', icon: '🏦' },
];

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
