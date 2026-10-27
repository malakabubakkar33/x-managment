import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'navy' | 'outline-light' | 'ghost' | 'medical';
  size?: 'sm' | 'md' | 'lg';
  to?: string;
  href?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  to,
  href,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100';

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm shadow-brand-600/30 focus-visible:ring-brand-500',
    secondary:
      'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm focus-visible:ring-slate-400',
    navy:
      'bg-navy-900 text-white hover:bg-navy-800 shadow-sm shadow-navy-900/30 focus-visible:ring-navy-800',
    'outline-light':
      'bg-transparent text-white border border-white/30 hover:bg-white/10 hover:border-white/50 focus-visible:ring-white',
    ghost:
      'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-400',
    medical:
      'bg-medical-600 text-white hover:bg-medical-700 active:bg-medical-800 shadow-sm shadow-medical-600/25 focus-visible:ring-medical-500',
  };

  const combinedClasses = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    fullWidth ? 'w-full' : '',
    className
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} aria-disabled={disabled}>
        {leftIcon}
        <span>{children}</span>
        {rightIcon}
      </Link>
    );
  }

  if (href) {
    const isExternal = href.startsWith('http');
    return (
      <a
        href={href}
        className={combinedClasses}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        aria-disabled={disabled}
      >
        {leftIcon}
        <span>{children}</span>
        {rightIcon}
      </a>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
};
