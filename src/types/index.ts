export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  secondaryImage?: string;
  description: string;
  sizes: string[];
  inStock: boolean;
  stockCount: number;
  isBestSeller?: boolean;
  isFestiveEdit?: boolean;
  tags?: string[];
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  kicker?: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  image: string;
  active: boolean;
  order: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount?: number;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface Order {
  id: string;
  trackingNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  pincode: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: 'COD' | 'UPI' | 'Card';
  paymentStatus?: 'Pending' | 'Verified' | 'Unpaid';
  transactionRef?: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  isRead: boolean;
}

export interface PaymentConfig {
  acceptPaymentsOnline: boolean;
  upiId: string;
  payeeName: string;
  upiNumber: string;
  qrCodeImage: string;
  enableUPI: boolean;
  enableCOD: boolean;
  enableCard: boolean;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankName?: string;
  instructions?: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  createdAt: string;
  category?: string;
}
