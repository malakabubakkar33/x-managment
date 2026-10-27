import { PricingPlan } from '../types';

export const pricingNotice =
  'Commercial pricing tiers are indicative placeholders for preview purposes. Final subscription packages will be announced upon production availability.';

export const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Ideal for single independent community pharmacies getting started with digital records.',
    priceNote: 'Tier In Review • Coming Soon',
    targetRole: 'Single Pharmacy Counter',
    features: [
      'Single store location & 1 active cashier register',
      'Barcode POS billing & thermal receipt printing',
      'Standard medicine inventory management',
      'Batch number & expiration date tracking',
      'Basic customer ledger (Khata)',
      'Daily end-of-day sales summary report',
      'Standard email assistance & user guides',
    ],
    isPopular: false,
    buttonText: 'Request Basic Access',
  },
  {
    id: 'standard',
    name: 'Standard',
    tagline: 'Engineered for growing retail pharmacies requiring advanced procurement and batch alerts.',
    priceNote: 'Most Popular Choice • Coming Soon',
    targetRole: 'Growing Retail Pharmacy',
    features: [
      'Single store location with up to 3 simultaneous registers',
      'Full FEFO (First-Expire, First-Out) automated alerts',
      'Supplier purchase orders & invoice reconciliation',
      'Customer credit khata & supplier payable ledger',
      'Daily profit & margin calculation reports',
      'Role-based permissions (Cashier, Pharmacist, Manager)',
      'Expense categorisation & operating overhead records',
      'Priority ticket & WhatsApp support channel',
    ],
    isPopular: true,
    buttonText: 'Request Standard Access',
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Designed for high-volume pharmacies and multi-branch chains requiring consolidated analytics.',
    priceNote: 'Enterprise Scale • Coming Soon',
    targetRole: 'Multi-Branch & High-Volume Chains',
    features: [
      'Multi-branch administration with central owner dashboard',
      'Unlimited cashier registers & employee accounts',
      'Cross-branch medicine stock search & internal transfers',
      'Comprehensive supplier khata & automated balance reminders',
      'Multi-shop consolidated profit and loss reporting',
      'Custom user roles with fine-grained action auditing',
      'Dedicated account manager & guided staff onboarding',
      'Early access to API integrations & future mobile POS',
    ],
    isPopular: false,
    buttonText: 'Request Premium Access',
  },
];
