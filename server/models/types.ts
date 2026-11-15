export interface ProductDeliverable {
  title: string;
  type: 'video' | 'kit' | 'project' | 'certificate' | 'ebook';
  url?: string;
}

export interface BackendProduct {
  id: string;
  slug: string;
  title: string;
  category: 'Courses' | 'E-Books' | 'Graphics';
  price: number; // in INR (paise not needed, Cashfree takes float or int in INR)
  formattedPrice: string;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  level: string;
  modules: string[];
  deliverables: string[];
}

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface CustomerInput {
  name: string;
  email: string;
  phone: string;
  customerId?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export type OrderPaymentStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'PAID'
  | 'FAILED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderRecord {
  orderId: string;
  cfOrderId?: string;
  paymentSessionId?: string;
  amount: number;
  currency: 'INR';
  status: OrderPaymentStatus;
  customer: {
    customerId: string;
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  orderNote?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  paymentMethod?: string;
  cfPaymentId?: string;
  bankReference?: string;
  deliverablesAvailable: boolean;
  accessLinks?: {
    courseTitle: string;
    accessPortalUrl: string;
    licenseKey: string;
  }[];
}

// Cashfree PG API V3 (2023-08-01) Request/Response Types
export interface CashfreeCustomerDetails {
  customer_id: string;
  customer_name?: string;
  customer_email: string;
  customer_phone: string;
}

export interface CashfreeOrderMeta {
  return_url?: string;
  notify_url?: string;
  payment_methods?: string;
}

export interface CashfreeCreateOrderPayload {
  order_id: string;
  order_amount: number;
  order_currency: string;
  customer_details: CashfreeCustomerDetails;
  order_meta?: CashfreeOrderMeta;
  order_note?: string;
  order_tags?: Record<string, string>;
}

export interface CashfreeOrderResponse {
  cf_order_id: string | number;
  order_id: string;
  entity: string;
  order_currency: string;
  order_amount: number;
  order_status: 'ACTIVE' | 'PAID' | 'EXPIRED' | 'TERMINATED';
  payment_session_id: string;
  order_expiry_time?: string;
  order_note?: string;
  customer_details: CashfreeCustomerDetails;
  order_meta?: CashfreeOrderMeta;
  terminal_data?: unknown;
}

export interface CashfreePaymentEntity {
  cf_payment_id: number | string;
  order_id: string;
  entity: string;
  payment_currency: string;
  payment_amount: number;
  payment_time: string;
  payment_status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'USER_DROPPED' | 'CANCELLED';
  payment_message?: string;
  bank_reference?: string;
  auth_id?: string | null;
  payment_method?: Record<string, unknown>;
  payment_group?: string;
}

export interface CashfreeWebhookPayload {
  data: {
    order: {
      order_id: string;
      order_amount: number;
      order_currency: string;
      order_tags?: Record<string, string> | null;
    };
    payment: CashfreePaymentEntity;
    customer_details: CashfreeCustomerDetails;
  };
  event_time: string;
  type: string;
}
