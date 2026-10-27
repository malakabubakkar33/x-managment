import React from 'react';
import { cn } from '../../utils/cn';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  variant?: 'light' | 'dark';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  variant = 'dark',
  className,
}) => {
  const isLight = variant === 'light';
  const isCenter = align === 'center';

  return (
    <div
      className={cn(
        'max-w-3xl mb-12 lg:mb-16',
        isCenter ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {badge && (
        <div className={cn('mb-3.5 inline-block')}>
          <span
            className={cn(
              'inline-flex items-center text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border',
              isLight
                ? 'bg-white/10 text-brand-200 border-white/20'
                : 'bg-brand-50 text-brand-700 border-brand-200'
            )}
          >
            {badge}
          </span>
        </div>
      )}
      <h2
        className={cn(
          'text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight',
          isLight ? 'text-white' : 'text-slate-900'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-4 text-base sm:text-lg leading-relaxed',
            isLight ? 'text-slate-300' : 'text-slate-600'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
