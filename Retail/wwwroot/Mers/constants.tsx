
import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  'Living Room Furniture',
  'Sofas & Sectionals',
  'Coffee Tables & Side Tables',
  'Ottomans & Poufs',
  'Dressers & Chests',
  'Dining & Kitchen Furniture',
  'Sideboards & Buffets',
  'Kitchen Islands & Carts',
  'Bookcases & Bookshelves',
  'Credenzas & Hutches',
  'Patio Dining Sets'
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Rune 38" Bouclé Accent Chair',
    price: 449.95,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800',
    category: 'Living Room Furniture',
    colors: ['#F5E6D3', '#1A1A1A'],
    style: 'Modern',
    inStock: true
  },
  {
    id: '2',
    name: 'Aurelia Living Sofa',
    price: 699.95,
    originalPrice: 799.95,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800',
    category: 'Sofas & Sectionals',
    colors: ['#FFFFFF', '#9CA3AF'],
    style: 'Modern',
    inStock: true
  },
  {
    id: '3',
    name: 'Liliana Armrest Fur',
    price: 459.95,
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800',
    category: 'Living Room Furniture',
    colors: ['#F3F4F6'],
    style: 'Victorian',
    inStock: true
  },
  {
    id: '4',
    name: 'Petit 3 Table',
    price: 389.95,
    originalPrice: 689.95,
    image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=800',
    category: 'Coffee Tables & Side Tables',
    colors: ['#D2B48C', '#A07855'],
    style: 'Mid-Century Modern',
    inStock: true
  },
  {
    id: '5',
    name: 'Corduroy Upholstered Seat',
    price: 579.95,
    image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&q=80&w=800',
    category: 'Living Room Furniture',
    colors: ['#F5E6D3'],
    style: 'Mid-Century Modern',
    inStock: true
  },
  {
    id: '6',
    name: 'Juniper Velvet Seat',
    price: 489.95,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
    category: 'Living Room Furniture',
    colors: ['#A07855', '#4D7C0F'],
    style: 'Mid-Century Modern',
    inStock: true
  },
  {
    id: '7',
    name: 'Nordic Nightstand',
    price: 249.95,
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=800',
    category: 'Dressers & Chests',
    colors: ['#A07855', '#1A1A1A'],
    style: 'Urban',
    inStock: true
  },
  {
    id: '8',
    name: 'Minimalist Ottoman',
    price: 199.95,
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?auto=format&fit=crop&q=80&w=800',
    category: 'Ottomans & Poufs',
    colors: ['#9CA3AF', '#1A1A1A'],
    style: 'Modern',
    inStock: false
  },
  {
    id: '9',
    name: 'Lounge Seat v2',
    price: 329.95,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    category: 'Living Room Furniture',
    colors: ['#F3F4F6'],
    style: 'Mid-Century Modern',
    inStock: true
  },
  {
    id: '10',
    name: 'Emerald Kitchen Island',
    price: 1249.00,
    image: 'https://images.unsplash.com/photo-1556912173-3bb810e2f53f?auto=format&fit=crop&q=80&w=800',
    category: 'Kitchen Islands & Carts',
    colors: ['#1A1A1A', '#4D7C0F'],
    style: 'Modern',
    inStock: true
  },
  {
    id: '11',
    name: 'Oak Sideboard',
    price: 899.00,
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629275?auto=format&fit=crop&q=80&w=800',
    category: 'Sideboards & Buffets',
    colors: ['#A07855'],
    style: 'Mid-Century Modern',
    inStock: true
  },
  {
    id: '12',
    name: 'Industrial Bookshelf',
    price: 349.00,
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800',
    category: 'Bookcases & Bookshelves',
    colors: ['#1A1A1A', '#9CA3AF'],
    style: 'Urban',
    inStock: true
  },
  {
    id: '13',
    name: 'Patio Dining Set',
    price: 1599.00,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
    category: 'Patio Dining Sets',
    colors: ['#9CA3AF'],
    style: 'Modern',
    inStock: true
  }
];
