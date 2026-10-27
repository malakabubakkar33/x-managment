import React from 'react';
import { Check } from 'lucide-react';
import { PricingPlan } from '../../types';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface PricingCardProps {
  plan: PricingPlan;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  const isHighlighted = plan.isPopular;

  return (
    <div
      className={cn(
        'relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl transition-all duration-300',
        isHighlighted
          ? 'bg-white border-2 border-brand-500 shadow-elevated lg:-translate-y-2 ring-1 ring-brand-500/20'
          : 'bg-white border border-slate-200 shadow-soft hover:shadow-card-hover'
      )}
    >
      {/* Top Banner for Standard Plan */}
      {isHighlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-brand-600 text-white shadow-sm">
            Recommended Tier
          </span>
        </div>
      )}

      <div>
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            {plan.targetRole}
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
            {plan.name}
          </h3>
          <p className="text-sm text-slate-600 mt-2 min-h-[40px] leading-relaxed">
            {plan.tagline}
          </p>
        </div>

        {/* Pricing Indicator */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
          <div className="text-sm font-semibold text-slate-900">
            {plan.priceNote}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Phase 1 Early Access Preview
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-3 mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            What's included:
          </p>
          <ul className="space-y-2.5">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-medical-50 text-medical-600 flex items-center justify-center mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <Button
          to={`/get-started?plan=${plan.id}`}
          variant={isHighlighted ? 'primary' : 'secondary'}
          fullWidth
          size="md"
        >
          {plan.buttonText}
        </Button>
        <p className="text-[11px] text-center text-slate-400 mt-2.5">
          No credit card required • Inquire for early pilot
        </p>
      </div>
    </div>
  );
};
