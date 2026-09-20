/**
 * OTT Mega 2.0 - MongoDB Mongoose Schemas
 * Can be used directly in Node.js / Express with mongoose
 */

export const MongoSchemaDefinitions = `
import mongoose, { Schema, Document } from 'mongoose';

// 1. OTT Plan / Product Schema with Variable Duration Pricing and Custom Images
export interface IPlanDurationOption {
  duration: string; // e.g. '1 Month', '2 Months', '3 Months', '6 Months', '1 Year'
  originalPrice: number;
  discountedPrice: number;
  badge?: string;
}

export interface IOTTPlan extends Document {
  title: string;
  slug: string; // e.g. 'netflix-premium-4k'
  platform: string;
  badge?: string;
  imageUrl?: string; // Uploaded custom product logo / image URL
  duration: string; // Default or primary duration
  originalPrice: number;
  discountedPrice: number;
  durationOptions: IPlanDurationOption[]; // Variable pricing options
  currency: string;
  features: string[];
  screens: number;
  resolution: string;
  deviceSupport: string;
  isPopular: boolean;
  inStock: boolean;
  description: string;
  iconColor: string;
  createdAt: Date;
  updatedAt: Date;
}

export const PlanDurationOptionSchema = new Schema<IPlanDurationOption>({
  duration: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  badge: { type: String }
}, { _id: false });

export const OTTPlanSchema = new Schema<IOTTPlan>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  platform: { type: String, required: true, index: true },
  badge: { type: String },
  imageUrl: { type: String },
  duration: { type: String, required: true, default: '1 Month' },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  durationOptions: [PlanDurationOptionSchema],
  currency: { type: String, default: 'INR' },
  features: [{ type: String }],
  screens: { type: Number, default: 1 },
  resolution: { type: String, default: '4K UHD' },
  deviceSupport: { type: String, default: 'TV, Laptop, Mobile' },
  isPopular: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  description: { type: String },
  iconColor: { type: String, default: '#ec4899' },
}, { timestamps: true });

export const OTTPlanModel = mongoose.model<IOTTPlan>('OTTPlan', OTTPlanSchema);


// 2. Order Schema with Razorpay Payment Integration
export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  planId: mongoose.Types.ObjectId;
  planTitle: string;
  platform: string;
  duration: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Completed' | 'Failed';
  paymentMethod: string;
  paymentRef?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  credentials?: {
    email: string;
    password?: string;
    profilePin?: string;
    screenNumber?: string;
    expiryDate?: string;
    notes?: string;
    assignedAt?: Date;
  };
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const OrderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true, index: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true, index: true },
  customerPhone: { type: String, required: true, index: true },
  planId: { type: Schema.Types.ObjectId, ref: 'OTTPlan' },
  planTitle: { type: String, required: true },
  platform: { type: String, required: true },
  duration: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending', index: true },
  paymentMethod: { type: String, default: 'Razorpay' },
  paymentRef: { type: String },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  credentials: {
    email: { type: String },
    password: { type: String },
    profilePin: { type: String },
    screenNumber: { type: String },
    expiryDate: { type: String },
    notes: { type: String },
    assignedAt: { type: Date }
  },
  adminNotes: { type: String }
}, { timestamps: true });

export const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);


// 3. Contact Inquiry Schema
export interface IContactInquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Replied' | 'Archived';
  createdAt: Date;
}

export const ContactInquirySchema = new Schema<IContactInquiry>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['Unread', 'Replied', 'Archived'], default: 'Unread' }
}, { timestamps: true });

export const ContactInquiryModel = mongoose.model<IContactInquiry>('ContactInquiry', ContactInquirySchema);
`;
