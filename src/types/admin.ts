export type AdminRole = 'super_admin' | 'platform_auditor';

export interface SuperAdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  lastLogin?: string;
  isVerifiedSuperAdmin: boolean;
}

export type SubscriptionStatus = 'active' | 'trial' | 'past_due' | 'expired' | 'suspended';

export interface PharmacyTenant {
  id: string;
  name: string;
  licenseNumber: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  planId: 'basic' | 'standard' | 'premium';
  subscriptionStatus: SubscriptionStatus;
  registersCount: number;
  joinedAt: string;
  expiresAt: string;
}

export interface SubscriptionRecord {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  planName: string;
  billingCycle: 'monthly' | 'annual';
  amount: number;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  autoRenew: boolean;
}

export interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  pharmacyName: string;
  amount: number;
  paymentMethod: 'Credit Card' | 'Direct Transfer' | 'Bank Wire';
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

export interface DashboardKPIs {
  totalPharmacies: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  monthlyRevenue: number;
  trialSubscriptions: number;
}
