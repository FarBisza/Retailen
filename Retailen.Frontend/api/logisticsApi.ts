import { API_URL, getHeaders } from './authApi';
import type { PagedResponse } from './adminApi';

const BASE = `${API_URL}/logistics`;

export interface Supplier {
    supplierId: number;
    name: string;
    email?: string;
    phone?: string;
    isActive: boolean;
}

export interface LowStockProduct {
    productId: number;
    productName: string;
    warehouseId: number;
    warehouseName: string;
    currentStock: number;
    threshold: number;
    suggestedOrderQuantity: number;
}

export interface SetThresholdRequest {
    productId: number;
    warehouseId: number;
    lowStockThreshold: number;
}

export interface ProductInventory {
    warehouseId: number;
    warehouseName: string;
    stock: number;
    threshold: number;
}

export interface Warehouse {
    warehouseId: number;
    name: string;
    isActive: boolean;
}

export interface SupplyOrder {
    purchaseOrderId: number;
    supplierId: number;
    supplierName: string;
    warehouseId?: number;
    warehouseName?: string;
    statusId: number;
    statusName: string;
    createdAt: string;
    expectedDate?: string;
    comment?: string;
    items: SupplyOrderItem[];
}

export interface SupplyOrderItem {
    purchaseOrderItemId: number;
    productId: number;
    productName: string;
    quantityOrdered: number;
    purchasePrice?: number;
}

export interface GoodsReceiptDTO {
    goodsReceiptId: number;
    purchaseOrderId: number;
    warehouseId?: number;
    warehouseName?: string;
    documentNumber?: string;
    receivedDate: string;
    shippingCost?: number;
    comment?: string;
    items: GoodsReceiptItemDTO[];
}

export interface GoodsReceiptItemDTO {
    goodsReceiptItemId: number;
    productId: number;
    productName: string;
    quantityReceived: number;
    quantityDamaged: number;
}

export interface ShipmentDTO {
    shipmentId: number;
    orderId: number;
    warehouseId: number;
    warehouseName?: string;
    carrier?: string;
    serviceLevel?: string;
    trackingNumber?: string;
    shippedDate?: string;
    deliveredDate?: string;
    shipmentStatusId?: number;
    statusName?: string;
    createdAt: string;
    items: ShipmentLineDTO[];
}

export interface ShipmentLineDTO {
    orderItemId: number;
    productId: number;
    productName: string;
    quantity: number;
}

export interface CreateSupplierRequest {
    name: string;
    email?: string;
    phone?: string;
}

export interface CreateSupplyOrderRequest {
    supplierId: number;
    warehouseId?: number;
    expectedDate?: string;
    comment?: string;
    items: {
        productId: number;
        quantityOrdered: number;
        purchasePrice?: number;
    }[];
}

export interface ReceiveGoodsRequest {
    warehouseId?: number;
    documentNumber?: string;
    shippingCost?: number;
    comment?: string;
    items: {
        productId: number;
        quantityReceived: number;
        quantityDamaged: number;
    }[];
}

export interface CreateShipmentRequest {
    carrier?: string;
    serviceLevel?: string;
    trackingNumber?: string;
    items: {
        orderItemId: number;
        quantity: number;
    }[];
}

export async function getSuppliers(): Promise<Supplier[]> {
    const res = await fetch(`${BASE}/suppliers`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch suppliers');
    return res.json();
}

export async function createSupplier(
    data: CreateSupplierRequest
): Promise<Supplier> {
    const res = await fetch(`${BASE}/suppliers`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create supplier');
    return res.json();
}

export async function getWarehouses(): Promise<Warehouse[]> {
    const res = await fetch(`${BASE}/warehouses`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch warehouses');
    return res.json();
}

export async function getSupplyOrders(): Promise<SupplyOrder[]> {
    const res = await fetch(`${BASE}/supply-orders`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch purchase orders');
    return res.json();
}

export async function getSupplyOrdersPaged(skip: number, take: number): Promise<PagedResponse<SupplyOrder>> {
    const page = Math.floor(skip / take) + 1;
    const pageSize = take;
    const res = await fetch(`${BASE}/supply-orders?page=${page}&pageSize=${pageSize}`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch purchase orders');
    return res.json();
}

export async function getSupplyOrder(id: number): Promise<SupplyOrder> {
    const res = await fetch(`${BASE}/supply-orders/${id}`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch purchase order');
    return res.json();
}

export async function createSupplyOrder(
    data: CreateSupplyOrderRequest
): Promise<{ supplyOrderId: number }> {
    const res = await fetch(`${BASE}/supply-orders`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create purchase order');
    return res.json();
}

export async function cancelSupplyOrder(id: number): Promise<void> {
    const res = await fetch(`${BASE}/supply-orders/${id}/cancel`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to cancel PO');
}

export async function getSupplierSupplyOrders(): Promise<SupplyOrder[]> {
    const res = await fetch(`${BASE}/supplier/supply-orders`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch supplier supply orders');
    return res.json();
}

export async function getSupplierShipments(): Promise<ShipmentDTO[]> {
    const res = await fetch(`${BASE}/supplier/shipments`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch supplier shipments');
    return res.json();
}

export async function getShipmentsPaged(skip: number, take: number): Promise<PagedResponse<ShipmentDTO>> {
    const res = await fetch(`${BASE}/shipments?skip=${skip}&take=${take}`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch shipments');
    return res.json();
}

export async function getOrdersForSupplier(
    supplierId: number
): Promise<SupplyOrder[]> {
    const res = await fetch(`${BASE}/supplier/${supplierId}/orders`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch supplier orders');
    return res.json();
}

export async function confirmSupplierOrder(
    supplierId: number,
    orderId: number
): Promise<void> {
    const res = await fetch(
        `${BASE}/supplier/${supplierId}/orders/${orderId}/confirm`,
        {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
        }
    );
    if (!res.ok) throw new Error('Failed to confirm order');
}

export async function rejectSupplierOrder(
    supplierId: number,
    orderId: number,
    reason?: string
): Promise<void> {
    const res = await fetch(
        `${BASE}/supplier/${supplierId}/orders/${orderId}/reject`,
        {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify({ reason }),
        }
    );
    if (!res.ok) throw new Error('Failed to reject order');
}

export async function getGoodsReceipts(): Promise<GoodsReceiptDTO[]> {
    const res = await fetch(`${BASE}/goods-receipts`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch goods receipts');
    return res.json();
}

export async function createGoodsReceipt(
    poId: number,
    data: ReceiveGoodsRequest
): Promise<{ goodsReceiptId: number; message: string }> {
    const res = await fetch(`${BASE}/supply-orders/${poId}/receive`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create goods receipt');
    return res.json();
}

export async function getShipments(): Promise<ShipmentDTO[]> {
    const res = await fetch(`${BASE}/shipments`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch shipments');
    return res.json();
}

export async function getShipmentsForOrder(
    orderId: number
): Promise<ShipmentDTO[]> {
    const res = await fetch(`${BASE}/orders/${orderId}/shipments`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch order shipments');
    return res.json();
}

export async function createShipment(
    orderId: number,
    warehouseId: number,
    data: CreateShipmentRequest
): Promise<{ shipmentId: number }> {
    const res = await fetch(
        `${BASE}/orders/${orderId}/shipments?warehouseId=${warehouseId}`,
        {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify(data),
        }
    );
    if (!res.ok) throw new Error('Failed to create shipment');
    return res.json();
}

export async function markShipped(
    shipmentId: number,
    trackingNumber?: string,
    shippedDate?: string
): Promise<void> {
    const res = await fetch(`${BASE}/shipments/${shipmentId}/ship`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ trackingNumber, shippedDate }),
    });
    if (!res.ok) throw new Error('Failed to mark shipped');
}

export async function markDelivered(
    shipmentId: number,
    deliveredDate?: string
): Promise<void> {
    const res = await fetch(`${BASE}/shipments/${shipmentId}/deliver`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ deliveredDate }),
    });
    if (!res.ok) throw new Error('Failed to mark delivered');
}

export async function getLowStockProducts(): Promise<LowStockProduct[]> {
    const res = await fetch(`${BASE}/low-stock`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch low stock products');
    return res.json();
}

export async function setProductThreshold(
    data: SetThresholdRequest
): Promise<{ message: string }> {
    const res = await fetch(`${BASE}/thresholds`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update inventory threshold');
    return res.json();
}

export async function getProductInventory(productId: number): Promise<ProductInventory[]> {
    const res = await fetch(`${BASE}/product-inventory/${productId}`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch product inventory');
    return res.json();
}

export const logisticsApi = {
    getSuppliers,
    createSupplier,
    getWarehouses,
    getSupplyOrders,
    getSupplyOrder,
    getSupplyOrdersPaged,
    createSupplyOrder,
    cancelSupplyOrder,
    getOrdersForSupplier,
    confirmSupplierOrder,
    rejectSupplierOrder,
    getGoodsReceipts,
    createGoodsReceipt,
    getShipments,
    getShipmentsForOrder,
    createShipment,
    markShipped,
    markDelivered,
    getLowStockProducts,
    setProductThreshold,
    getProductInventory,
};

export default logisticsApi;