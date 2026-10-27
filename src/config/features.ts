import { FeatureItem } from '../types';

export const featuresList: FeatureItem[] = [
  {
    id: 'pos-billing',
    title: 'Pharmacy POS & Billing',
    description:
      'High-speed retail counter checkout with instant barcode scanning, discount calculations, multiple payment methods, and thermal receipt printing.',
    iconName: 'Receipt',
    badge: 'Core POS',
  },
  {
    id: 'medicine-inventory',
    title: 'Medicine Inventory',
    description:
      'Comprehensive pharmaceutical catalog with generic compositions, brand names, dosage formulations, unit conversions, and reorder thresholds.',
    iconName: 'Pill',
    badge: 'Catalog',
  },
  {
    id: 'batch-expiry',
    title: 'Batch & Expiry Tracking',
    description:
      'First-Expire, First-Out (FEFO) dispensing logic with automated alerts for near-expiry medicines to prevent stock wastage and protect patient safety.',
    iconName: 'CalendarClock',
    badge: 'Compliance',
  },
  {
    id: 'purchase-management',
    title: 'Purchase Management',
    description:
      'Streamline supplier purchase orders, goods receipt notes (GRN), invoice matching, batch intake, and direct stock adjustment upon arrival.',
    iconName: 'ShoppingBag',
    badge: 'Procurement',
  },
  {
    id: 'supplier-management',
    title: 'Supplier Management',
    description:
      'Maintain an organized directory of pharmaceutical distributors, representatives, payment terms, contact information, and delivery histories.',
    iconName: 'Truck',
    badge: 'Vendors',
  },
  {
    id: 'customer-management',
    title: 'Customer Management',
    description:
      'Record customer contact details, chronic medication history, refill reminders, and loyalty purchase records for recurring community care.',
    iconName: 'Users',
    badge: 'Patients',
  },
  {
    id: 'khata-ledger',
    title: 'Customer & Supplier Khata',
    description:
      'Integrated digital ledger for tracking credit sales, pending customer balances, and distributor payables with complete transaction audit trails.',
    iconName: 'BookOpenCheck',
    badge: 'Ledger',
  },
  {
    id: 'expenses-management',
    title: 'Expenses Management',
    description:
      'Categorize operating costs including store rent, utility bills, staff lunches, transport, and equipment maintenance to capture true overhead.',
    iconName: 'Wallet',
    badge: 'Overheads',
  },
  {
    id: 'sales-profit-reports',
    title: 'Sales & Profit Reports',
    description:
      'Real-time financial analytics detailing gross margins, net profit, top-selling medications, slow-moving items, and shift-wise cashier reconciliation.',
    iconName: 'TrendingUp',
    badge: 'Analytics',
  },
  {
    id: 'employee-roles',
    title: 'Employee & Role Management',
    description:
      'Granular role-based access control (RBAC) separating Pharmacists, Cashiers, Inventory Clerks, and Store Managers to maintain operational security.',
    iconName: 'ShieldCheck',
    badge: 'Security',
  },
  {
    id: 'multi-shop-admin',
    title: 'Multi-Shop SaaS Administration',
    description:
      'Centralized control for pharmacy owners operating multiple branches or franchise chains with cross-store inventory lookups and consolidated reporting.',
    iconName: 'Store',
    badge: 'Enterprise',
  },
  {
    id: 'subscription-management',
    title: 'Subscription Management',
    description:
      'Self-service tenant billing, plan tier upgrades, automated invoices, and active user seat management designed for frictionless SaaS scaling.',
    iconName: 'CreditCard',
    badge: 'SaaS Platform',
  },
];
