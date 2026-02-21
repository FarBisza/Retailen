
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  colors: string[];
  style: string;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  basketItemId?: number; // ID of the basket item from backend
}

export type Category =
  | 'Living Room Furniture'
  | 'Sofas & Sectionals'
  | 'Coffee Tables & Side Tables'
  | 'Ottomans & Poufs'
  | 'Dressers & Chests'
  | 'Dining & Kitchen Furniture'
  | 'Sideboards & Buffets'
  | 'Kitchen Islands & Carts'
  | 'Bookcases & Bookshelves'
  | 'Credenzas & Hutches'
  | 'Patio Dining Sets';
