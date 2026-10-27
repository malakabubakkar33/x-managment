import React from 'react';
import { cn } from '../../../utils/cn';

interface StatusBadgeProps {
  status: 'active' | 'trial' | 'past_due' | 'expired' | 'suspended' | 'completed' | 'pending' | 'failed';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = {
    active: {
      label: 'Active',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    trial: {
      label: 'In Trial',
      classes: 'bg-blue-50 text-blue-700 border-blue-200',
      dotColor: 'bg-blue-500',
    },
    past_due: {
      label: 'Past Due',
      classes: 'bg-amber-50 text-amber-700 border-amber-200',
      dotColor: 'bg-amber-500',
    },
    expired: {
      label: 'Expired',
      classes: 'bg-rose-50 text-rose-700 border-rose-200',
      dotColor: 'bg-rose-500',
    },
    suspended: {
      label: 'Suspended',
      classes: 'bg-slate-100 text-slate-700 border-slate-300',
      dotColor: 'bg-slate-500',
    },
    completed: {
      label: 'Completed',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    pending: {
      label: 'Pending',
      classes: 'bg-amber-50 text-amber-700 border-amber-200',
      dotColor: 'bg-amber-500',
    },
    failed: {
      label: 'Failed',
      classes: 'bg-rose-50 text-rose-700 border-rose-200',
      dotColor: 'bg-rose-500',
    },
  }[status] || {
    label: status,
    classes: 'bg-slate-100 text-slate-700 border-slate-200',
    dotColor: 'bg-slate-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        config.classes,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dotColor)} />
      <span>{config.label}</span>
    </span>
  );
};
