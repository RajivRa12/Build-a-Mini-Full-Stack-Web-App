/**
 * Shared code between client and server
 * Types for the Rural Community Platform
 */

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  inStock: boolean;
  brand?: string;
  weight?: string;
  dimensions?: string;
  tags?: string[];
  averageRating?: number;
  reviewCount?: number;
  discountPrice?: number;
  images?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  products: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: string;
  notes?: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  createdAt: string;
}

// API Response Types
export interface ServicesResponse {
  services: Service[];
}

export interface ProductsResponse {
  products: Product[];
}

export interface NewsResponse {
  news: NewsItem[];
}

export interface ReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export interface WeatherResponse {
  weather: Weather;
}

export interface MarketPricesResponse {
  prices: MarketPrice[];
}

export interface WishlistResponse {
  wishlist: Wishlist[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}

export interface Weather {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
  }[];
}

export interface MarketPrice {
  id: string;
  productName: string;
  category: string;
  currentPrice: number;
  previousPrice: number;
  changePercent: number;
  unit: string;
  market: string;
  lastUpdated: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export interface ContactRequest {
  name: string;
  email?: string;
  phone?: string;
  message: string;
}

export interface BookingRequest {
  products: CartItem[];
  notes?: string;
}

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}
