export interface NavItem {
  label: string;
  href: string;
  isButton?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  priceNote: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  targetRole: string;
}

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
  iconName: string;
}

export interface ContactFormData {
  fullName: string;
  pharmacyName: string;
  email: string;
  phone?: string;
  message: string;
}

export interface PreviewTab {
  id: string;
  label: string;
  title: string;
  description: string;
  badgeText: string;
}
