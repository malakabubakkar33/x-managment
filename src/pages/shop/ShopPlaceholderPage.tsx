import React from 'react';
import { Link } from 'react-router-dom';
import { Construction, ArrowLeft, Sparkles } from 'lucide-react';
import { ShopLayout } from '../../components/shop/layout/ShopLayout';

interface ShopPlaceholderProps {
  title: string;
  description: string;
  phase: string;
  features: string[];
}

export const ShopPlaceholderPage: React.FC<ShopPlaceholderProps> = ({
  title,
  description,
  phase,
  features,
}) => {
  return (
    <ShopLayout title={title}>
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-xs mb-2">
          <Construction className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider font-mono">
            {phase} Roadmap Module
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            {description}
          </p>
        </div>

        {/* Planned Features Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-left shadow-xs max-w-lg mx-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Planned Capabilities:</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            {features.map((feat, i) => (
              <li key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dispensary Overview</span>
          </Link>
        </div>
      </div>
    </ShopLayout>
  );
};
