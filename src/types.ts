export type OTTPlatform = 
  | 'Netflix'
  | 'Amazon Prime'
  | 'Disney+ Hotstar'
  | 'SonyLIV'
  | 'Zee5'
  | 'JioCinema'
  | 'Crunchyroll'
  | 'Apple TV+'
  | 'YouTube Premium'
  | 'Combo Pack';

export type PlanDuration = '1 Month' | '2 Months' | '3 Months' | '6 Months' | '1 Year' | string;

export type OrderStatus = 'Pending' | 'Completed' | 'Failed';

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PlanDurationOption {
  duration: string; // e.g. '1 Month', '2 Months', '3 Months', '6 Months', '1 Year'
  originalPrice: number;
  discountedPrice: number;
  badge?: string;
}

export interface OTTPlan {
  id: string;
  slug: string; // URL-friendly slug, e.g., 'netflix-premium-4k'
  title: string;
  platform: OTTPlatform;
  badge?: string;
  imageUrl?: string; // Custom uploaded product logo or image
  duration: PlanDuration;
  originalPrice: number;
  discountedPrice: number;
  durationOptions?: PlanDurationOption[]; // Variable pricing per duration
  currency: string;
  features: string[];
  screens: number;
  resolution: string; // e.g., '4K UHD', '1080p FHD'
  deviceSupport: string; // e.g., 'TV, Mobile, Laptop'
  isPopular?: boolean;
  inStock: boolean;
  description: string;
  iconColor: string; // tailwind color or hex
  selectedDuration?: string;
}

export interface OrderCredentials {
  email: string;
  password?: string;
  profilePin?: string;
  screenNumber?: string;
  expiryDate?: string;
  notes?: string;
  assignedAt?: string;
}

export interface PaymentSettings {
  upiId: string;
  payeeName: string;
  upiQrImage?: string; // Custom uploaded QR code image URL
  whatsappNumber: string; // e.g. "8967624619"
  useCustomQr: boolean; // if true, display uploaded image, otherwise auto-generate standard QR
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g., "OTT-49201"
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  planId: string;
  planTitle: string;
  platform: OTTPlatform;
  duration: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentRef?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  credentials?: OrderCredentials;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'Unread' | 'Replied' | 'Archived';
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  failedOrders: number;
  activePlansCount: number;
  recentOrders: Order[];
  salesByPlatform: { platform: string; count: number; revenue: number }[];
}
