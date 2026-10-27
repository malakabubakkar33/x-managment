import React from 'react';
import { AlertCircle, Shield } from 'lucide-react';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { PricingCard } from '../ui/PricingCard';
import { pricingPlans, pricingNotice } from '../../config/pricing';

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200/80 scroll-mt-12">
      <Container size="lg">
        <SectionHeading
          badge="Predictable SaaS Subscriptions"
          title="Transparent Plans for Every Pharmacy Scale"
          subtitle="Explore tiered capabilities tailored for single dispensaries, busy community pharmacies, and growing retail networks."
        />

        {/* Commercial Disclaimer Notice Banner */}
        <div className="max-w-3xl mx-auto mb-12 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-3 text-xs sm:text-sm text-amber-900 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Phase 1 Preview Notice: </span>
            {pricingNotice}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Trust & Guarantee Indicator */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4 text-brand-600" />
            <span>Enterprise Data Integrity &amp; Strict Tenant Separation</span>
          </div>
          <p className="text-xs text-slate-500">
            Dedicated database architecture with automated daily backups and full audit logs will be configured upon tenant account provisioning in Phase 2.
          </p>
        </div>
      </Container>
    </section>
  );
};
