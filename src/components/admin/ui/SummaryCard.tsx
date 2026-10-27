import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'blue' | 'emerald' | 'amber' | 'rose' | 'navy';
  trendText?: string;
  trendPositive?: boolean;
  isIllustrative?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'blue',
  trendText,
  trendPositive = true,
  isIllustrative = true,
}) => {
  const iconTheme = {
    blue: 'bg-brand-50 text-brand-600 border-brand-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
    navy: 'bg-navy-900 text-white border-navy-800',
  }[variant];

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft hover:shadow-card-hover transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center border', iconTheme)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
          {value}
        </div>
        {isIllustrative && (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
            Preview State
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {trendText ? (
          <span
            className={cn(
              'font-semibold flex items-center gap-1',
              trendPositive ? 'text-emerald-600' : 'text-rose-600'
            )}
          >
            {trendPositive ? '↑' : '↓'} {trendText}
          </span>
        ) : (
          <span className="text-slate-400">Current month</span>
        )}

        {subtitle && <span className="text-slate-500 text-[11px]">{subtitle}</span>}
      </div>
    </div>
  );
};
