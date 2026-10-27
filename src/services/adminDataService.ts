import {
  DashboardKPIs,
  PharmacyTenant,
  PaymentRecord,
  SubscriptionRecord,
} from '../types/admin';
import { adminAuthService } from './adminAuthService';

export interface DataResponse<T> {
  data: T;
  isBackendConnected: boolean;
  isIllustrative: boolean;
  fetchedAt: string;
}

// Explicit illustrative data for development preview when database is unconfigured
const illustrativeKPIs: DashboardKPIs = {
  totalPharmacies: 18,
  activeSubscriptions: 14,
  expiredSubscriptions: 2,
  trialSubscriptions: 2,
  monthlyRevenue: 4850,
};

const illustrativePharmacies: PharmacyTenant[] = [
  {
    id: 'pharma-101',
    name: 'Apex Central Care Pharmacy',
    licenseNumber: 'PHA-TX-84920',
    ownerName: 'Dr. Tariq Mahmood, RPh',
    email: 'admin@apexcentralcare.com',
    phone: '+1 (555) 234-5678',
    city: 'Houston, TX',
    planId: 'standard',
    subscriptionStatus: 'active',
    registersCount: 2,
    joinedAt: '2026-08-15',
    expiresAt: '2026-11-15',
  },
  {
    id: 'pharma-102',
    name: 'Metropolitan Community Dispensary',
    licenseNumber: 'PHA-IL-33901',
    ownerName: 'Dr. Linda Vance, PharmD',
    email: 'contact@metrodispensary.org',
    phone: '+1 (555) 876-5432',
    city: 'Chicago, IL',
    planId: 'premium',
    subscriptionStatus: 'active',
    registersCount: 5,
    joinedAt: '2026-06-01',
    expiresAt: '2026-12-01',
  },
  {
    id: 'pharma-103',
    name: 'Blue Crest Family Chemists',
    licenseNumber: 'PHA-FL-19044',
    ownerName: 'Sarah Jenkins, RPh',
    email: 'sarah@bluecrestchemists.com',
    phone: '+1 (555) 432-1098',
    city: 'Orlando, FL',
    planId: 'basic',
    subscriptionStatus: 'trial',
    registersCount: 1,
    joinedAt: '2026-10-18',
    expiresAt: '2026-11-01',
  },
  {
    id: 'pharma-104',
    name: 'Valley Care Hospital Outpatient Rx',
    licenseNumber: 'PHA-CA-92811',
    ownerName: 'Robert Sterling, Director of Pharmacy',
    email: 'rx@valleycarehealth.org',
    phone: '+1 (555) 901-2345',
    city: 'Sacramento, CA',
    planId: 'premium',
    subscriptionStatus: 'active',
    registersCount: 4,
    joinedAt: '2026-05-10',
    expiresAt: '2026-11-10',
  },
  {
    id: 'pharma-105',
    name: 'Cornerstone Community Drugstore',
    licenseNumber: 'PHA-OH-77123',
    ownerName: 'Michael Chang, Pharmacist',
    email: 'm.chang@cornerstonedrugs.com',
    phone: '+1 (555) 654-3210',
    city: 'Columbus, OH',
    planId: 'standard',
    subscriptionStatus: 'past_due',
    registersCount: 2,
    joinedAt: '2026-07-20',
    expiresAt: '2026-10-20',
  },
];

const illustrativePayments: PaymentRecord[] = [
  {
    id: 'pay-801',
    invoiceNumber: 'INV-2026-0982',
    pharmacyName: 'Metropolitan Community Dispensary',
    amount: 350.0,
    paymentMethod: 'Credit Card',
    status: 'completed',
    date: '2026-10-25',
  },
  {
    id: 'pay-802',
    invoiceNumber: 'INV-2026-0981',
    pharmacyName: 'Apex Central Care Pharmacy',
    amount: 220.0,
    paymentMethod: 'Credit Card',
    status: 'completed',
    date: '2026-10-22',
  },
  {
    id: 'pay-803',
    invoiceNumber: 'INV-2026-0980',
    pharmacyName: 'Valley Care Hospital Outpatient Rx',
    amount: 350.0,
    paymentMethod: 'Direct Transfer',
    status: 'completed',
    date: '2026-10-19',
  },
  {
    id: 'pay-804',
    invoiceNumber: 'INV-2026-0979',
    pharmacyName: 'Cornerstone Community Drugstore',
    amount: 220.0,
    paymentMethod: 'Credit Card',
    status: 'failed',
    date: '2026-10-15',
  },
  {
    id: 'pay-805',
    invoiceNumber: 'INV-2026-0978',
    pharmacyName: 'St. Jude Clinical Pharmacy',
    amount: 150.0,
    paymentMethod: 'Bank Wire',
    status: 'completed',
    date: '2026-10-12',
  },
];

const illustrativeSubscriptions: SubscriptionRecord[] = [
  {
    id: 'sub-301',
    pharmacyId: 'pharma-101',
    pharmacyName: 'Apex Central Care Pharmacy',
    planName: 'Standard Tier',
    billingCycle: 'monthly',
    amount: 220,
    status: 'active',
    currentPeriodStart: '2026-10-15',
    currentPeriodEnd: '2026-11-15',
    autoRenew: true,
  },
  {
    id: 'sub-302',
    pharmacyId: 'pharma-102',
    pharmacyName: 'Metropolitan Community Dispensary',
    planName: 'Premium Enterprise',
    billingCycle: 'monthly',
    amount: 350,
    status: 'active',
    currentPeriodStart: '2026-10-01',
    currentPeriodEnd: '2026-11-01',
    autoRenew: true,
  },
  {
    id: 'sub-303',
    pharmacyId: 'pharma-105',
    pharmacyName: 'Cornerstone Community Drugstore',
    planName: 'Standard Tier',
    billingCycle: 'monthly',
    amount: 220,
    status: 'past_due',
    currentPeriodStart: '2026-09-20',
    currentPeriodEnd: '2026-10-20',
    autoRenew: false,
  },
];

class AdminDataService {
  public async getDashboardKPIs(): Promise<DataResponse<DashboardKPIs>> {
    const isConnected = adminAuthService.isBackendConfigured();
    // Simulate brief network delay
    await new Promise((r) => setTimeout(r, 200));

    return {
      data: isConnected ? { totalPharmacies: 0, activeSubscriptions: 0, expiredSubscriptions: 0, trialSubscriptions: 0, monthlyRevenue: 0 } : illustrativeKPIs,
      isBackendConnected: isConnected,
      isIllustrative: !isConnected,
      fetchedAt: new Date().toISOString(),
    };
  }

  public async getPharmacies(): Promise<DataResponse<PharmacyTenant[]>> {
    const isConnected = adminAuthService.isBackendConfigured();
    await new Promise((r) => setTimeout(r, 250));

    return {
      data: isConnected ? [] : illustrativePharmacies,
      isBackendConnected: isConnected,
      isIllustrative: !isConnected,
      fetchedAt: new Date().toISOString(),
    };
  }

  public async getRecentPayments(): Promise<DataResponse<PaymentRecord[]>> {
    const isConnected = adminAuthService.isBackendConfigured();
    await new Promise((r) => setTimeout(r, 200));

    return {
      data: isConnected ? [] : illustrativePayments,
      isBackendConnected: isConnected,
      isIllustrative: !isConnected,
      fetchedAt: new Date().toISOString(),
    };
  }

  public async getSubscriptions(): Promise<DataResponse<SubscriptionRecord[]>> {
    const isConnected = adminAuthService.isBackendConfigured();
    await new Promise((r) => setTimeout(r, 200));

    return {
      data: isConnected ? [] : illustrativeSubscriptions,
      isBackendConnected: isConnected,
      isIllustrative: !isConnected,
      fetchedAt: new Date().toISOString(),
    };
  }
}

export const adminDataService = new AdminDataService();
