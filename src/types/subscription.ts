export type BillingInterval = 'monthly' | 'annual';

export type SubscriptionStatus =
  | 'pending'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'expired'
  | 'suspended'
  | 'cancelled';

export type InvoiceStatus = 'issued' | 'paid' | 'overdue' | 'void';

export type PaymentMethod = 'Bank Transfer' | 'Cash' | 'Credit Card' | 'Online';

export interface SubscriptionPlan {
  id: string;
  code: string; // 'basic' | 'standard' | 'premium'
  name: string;
  description: string;
  billingInterval: BillingInterval;
  price: number; // in PKR
  currency: string;
  features: string[];
  limits: {
    maxRegisters?: number;
    maxStaffAccounts?: number;
    allowMultiBranch?: boolean;
    fefoAlerts?: boolean;
  };
  isActive: boolean;
  subscriberCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PharmacySubscription {
  id: string;
  pharmacyId: string;
  planId: string;
  plan?: SubscriptionPlan;
  status: SubscriptionStatus;
  startAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndAt?: string;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionInvoice {
  id: string;
  pharmacyId: string;
  subscriptionId: string;
  invoiceNumber: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  pharmacyId: string;
  invoiceId?: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: 'completed' | 'pending' | 'failed';
  transactionReference?: string;
  receivedAt: string;
  recordedBy?: string;
  notes?: string;
  createdAt: string;
}
