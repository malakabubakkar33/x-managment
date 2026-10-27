import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'medical' | 'navy' | 'slate' | 'amber';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'brand',
  size = 'md',
  className,
  icon,
}) => {
  const variantClasses = {
    brand: 'bg-brand-50 text-brand-700 border-brand-200',
    medical: 'bg-medical-50 text-medical-700 border-medical-100',
    navy: 'bg-navy-900 text-white border-navy-800',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
};
