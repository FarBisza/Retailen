export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DictionaryItem {
  id: number;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  categories?: string[];
  colors: string[];
  style: string;
  inStock: boolean;
  stockLevel?: number;
  stockThreshold?: number;
  shortDescription?: string;
  longDescription?: string;

  type?: 'furniture' | 'electronics' | 'clothing';
  material?: string;
  gender?: 'men' | 'women' | 'unisex';
  sizes?: string[];
  dimensions?: {
    width_cm: number;
    height_cm: number;
    depth_cm: number;
  };
  specs?: Record<string, string>;

  reviews?: Review[];
  attributes?: ProductAttributeValue[];
}

export interface CartItem extends Product {
  quantity: number;
  cartId: number;
  cartItemId: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'employee' | 'shipper' | 'supplier';
}

export interface CategoryData {
  id: number;
  parentId: number | null;
  name: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
}

export interface Attribute {
  id: number;
  name: string;
  dataType: string;
  unit?: string;
}

export interface CategoryAttribute extends Attribute {
  isRequired: boolean;
  sortOrder: number;
}

export interface ProductAttributeValue {
  id: number;
  productId: number;
  attributeId: number;
  attributeName: string;
  value: string;
  unit?: string;
}

export interface CreateAttributeDTO {
  name: string;
  dataType: string;
  unit?: string;
}

export interface SetProductAttributeDTO {
  attributeId: number;
  value: string;
}

export type RequestStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'in_transit'
  | 'received'
  | 'completed';

export type TransferStatus = 'created' | 'in_transit' | 'delivered';

export interface ReplenishmentRequest {
  id: string;
  staffId: string;
  staffName: string;
  storeId: string;
  status: RequestStatus;
  priority: 'normal' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    requestedQty: number;
    approvedQty?: number;
  }[];
}

export interface StockTransfer {
  id: string;
  requestId: string;
  sourceDCId: string;
  targetStoreId: string;
  status: TransferStatus;
  dispatchedAt?: string;
  estimatedArrival?: string;
  items: { productId: string; qty: number }[];
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  status: 'draft' | 'submitted' | 'approved' | 'sent' | 'received' | 'cancelled';
  createdAt: string;
  expectedDate: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    orderedQty: number;
    receivedQty: number;
    price: number;
  }[];
}

export interface GoodsReceipt {
  id: string;
  poId: string;
  warehouseId: string;
  receivedAt: string;
  status: 'completed' | 'discrepancy';
  items: {
    productId: string;
    orderedQty: number;
    receivedQty: number;
    damagedQty: number;
  }[];
}