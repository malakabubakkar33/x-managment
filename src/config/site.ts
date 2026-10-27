import { NavItem } from '../types';

export const siteConfig = {
  name: 'X Management',
  descriptor: 'Pharmacy Management Solutions',
  title: 'X Management — Smart Pharmacy Management & ERP Platform',
  tagline: 'Smart Pharmacy Management. Simplified Business.',
  description:
    'Manage medicine inventory, sales, purchases, customer accounts, and business reports from one organized pharmacy management platform.',
  contactEmailPlaceholder: 'sales@xmanagement.example.com',
  links: {
    github: 'https://github.com',
  },
  navItems: [
    { label: 'Home', href: '/#hero' },
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Previews', href: '/#preview' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ] as NavItem[],
  trustItems: [
    {
      title: 'Organized Pharmacy Operations',
      description:
        'Standardize dispensing workflows, role permissions, and store records across your daily shifts.',
      iconName: 'ClipboardCheck',
    },
    {
      title: 'Inventory & Batch Visibility',
      description:
        'Track medicines down to the batch level with expiry alerts, shelf locations, and low-stock triggers.',
      iconName: 'Boxes',
    },
    {
      title: 'Faster Billing Workflow',
      description:
        'Rapid barcode POS and item lookup designed to accelerate counter customer checkouts without delays.',
      iconName: 'Zap',
    },
    {
      title: 'Actionable Business Reporting',
      description:
        'Clear daily sales summaries, gross profit calculations, and supplier balance ledgers in one view.',
      iconName: 'BarChart3',
    },
  ],
  workflowSteps: [
    {
      step: 1,
      title: 'Choose a Plan',
      description:
        'Select the tier that matches your pharmacy scale — from single independent stores to multi-counter retail setups.',
      iconName: 'Layers',
    },
    {
      step: 2,
      title: 'Set Up Your Pharmacy',
      description:
        'Configure your medicine catalog, tax rates, staff roles, and initial supplier khata balances.',
      iconName: 'Sliders',
    },
    {
      step: 3,
      title: 'Manage Your Daily Operations',
      description:
        'Dispense prescriptions, process counter sales, track batch expiries, and review end-of-day revenue reports.',
      iconName: 'CheckCircle2',
    },
  ],
};
