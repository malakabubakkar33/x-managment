import React from 'react';
import { DynamicIcon } from './DynamicIcon';
import { FeatureItem } from '../../types';

interface FeatureCardProps {
  feature: FeatureItem;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  return (
    <div className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-soft hover:shadow-card-hover hover:border-brand-200 hover:-translate-y-1 transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
            <DynamicIcon name={feature.iconName} className="w-6 h-6" />
          </div>
          {feature.badge && (
            <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {feature.badge}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors duration-200 mb-2.5">
          {feature.title}
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed">
          {feature.description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-brand-600 group-hover:text-brand-700">
        <span>Pharmacy ERP Module</span>
      </div>
    </div>
  );
};
