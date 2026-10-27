import React from 'react';
import {
  Receipt,
  Pill,
  CalendarClock,
  ShoppingBag,
  Truck,
  Users,
  BookOpenCheck,
  Wallet,
  TrendingUp,
  ShieldCheck,
  Store,
  CreditCard,
  ClipboardCheck,
  Boxes,
  Zap,
  BarChart3,
  Layers,
  Sliders,
  CheckCircle2,
  Check,
  ArrowRight,
  Shield,
  Activity,
  AlertTriangle,
  Search,
  Package,
  LucideProps,
} from 'lucide-react';

const iconMap: Record<string, React.FC<LucideProps>> = {
  Receipt,
  Pill,
  CalendarClock,
  ShoppingBag,
  Truck,
  Users,
  BookOpenCheck,
  Wallet,
  TrendingUp,
  ShieldCheck,
  Store,
  CreditCard,
  ClipboardCheck,
  Boxes,
  Zap,
  BarChart3,
  Layers,
  Sliders,
  CheckCircle2,
  Check,
  ArrowRight,
  Shield,
  Activity,
  AlertTriangle,
  Search,
  Package,
};

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name] || Package;
  return <IconComponent {...props} />;
};
