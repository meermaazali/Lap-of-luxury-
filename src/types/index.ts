export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  department?: string;
  brand?: string;
  color?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  secondaryImage?: string;
  description: string;
  sizes: string[];
  colors?: string[];
  images?: string[];
  slug?: string;
  subcategory?: string;
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
  parentCategory?: string;
  department?: string;
  subcategories?: string[];
  brands?: string[];
  order?: number;
  active?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  size?: string;
  color?: string;
  quantity: number;
}

export interface OrderCustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
  houseNo?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  address?: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  houseNo?: string;
  street?: string;
  city: string;
  state?: string;
  pincode: string;
  address: string;
  customer?: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: 'Cash on Delivery' | 'Pay on Delivery' | 'UPI' | 'Card' | 'PhonePe' | 'Google Pay' | 'Paytm' | 'Other UPI Apps' | 'UPI QR' | string;
  paymentStatus?: 'Payment Pending' | 'Paid' | 'Verified' | 'Pending' | 'Failed' | 'Refunded' | string;
  transactionRef?: string;
  paymentScreenshot?: string;
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
  // PhonePe Payment Gateway Integration
  phonepeEnabled?: boolean;
  phonepeMerchantId?: string;
  phonepeSaltKey?: string;
  phonepeSaltIndex?: string;
  phonepeEnv?: 'SANDBOX' | 'PRODUCTION';
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

export interface BoutiqueHeroConfig {
  kicker: string;
  titleLine1: string;
  titleLine2: string;
  subtitleItems: string[];
  ctaText: string;
  image: string;
}

export interface CustomerEnquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  categoryInterest?: string;
  status: 'new' | 'contacted' | 'resolved';
  isRead: boolean;
  createdAt: string;
  source?: string;
}
