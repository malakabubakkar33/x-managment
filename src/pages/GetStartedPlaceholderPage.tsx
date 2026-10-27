import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/layout/Logo';
import { pricingPlans } from '../config/pricing';

export const GetStartedPlaceholderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedPlanId = searchParams.get('plan') || 'standard';

  const selectedPlan =
    pricingPlans.find((p) => p.id === selectedPlanId) || pricingPlans[1];

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 flex flex-col justify-center">
      <Container size="sm">
        <div className="text-center mb-8">
          <Logo className="justify-center mb-4" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Pharmacy Onboarding Setup
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Configuring Tier: <span className="font-bold text-brand-600">{selectedPlan.name} Plan</span>
          </p>
        </div>

        <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-soft">
          {/* Phase 1 Boundary Alert */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <span className="font-bold">Phase 1 Architecture Notice: </span>
              Automated credit card billing, payment gateway processing, and instant tenant database provisioning are planned for future development phases. No financial transactions take place in this phase.
            </div>
          </div>

          {/* Selected Plan Summary */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  Target Configuration
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedPlan.name} Tier
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                {selectedPlan.targetRole}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedPlan.tagline}
            </p>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Included Capabilities:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedPlan.features.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-medical-600 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <Button to="/#contact" variant="primary" fullWidth size="md">
              Submit Direct Pharmacy Pilot Request
            </Button>
            <Button
              to="/#pricing"
              variant="secondary"
              fullWidth
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Pricing Table
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};
