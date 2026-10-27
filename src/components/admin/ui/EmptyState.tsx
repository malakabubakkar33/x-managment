import React from 'react';
import { LucideIcon, Layers } from 'lucide-react';
import { Button } from '../../ui/Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionTo?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Layers,
  title,
  description,
  actionText,
  onAction,
  actionTo,
}) => {
  return (
    <div className="p-8 sm:p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-soft">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4 border border-slate-200">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
        {description}
      </p>

      {actionText && (
        <div>
          {actionTo ? (
            <Button to={actionTo} variant="primary" size="sm">
              {actionText}
            </Button>
          ) : (
            <Button onClick={onAction} variant="primary" size="sm">
              {actionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
