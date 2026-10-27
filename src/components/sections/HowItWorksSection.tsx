import React from 'react';
import { Layers, Sliders, CheckCircle2 } from 'lucide-react';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { siteConfig } from '../../config/site';

const stepIcons: Record<string, React.FC<{ className?: string }>> = {
  Layers,
  Sliders,
  CheckCircle2,
};

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-white border-t border-slate-200/80 scroll-mt-12">
      <Container size="lg">
        <SectionHeading
          badge="Implementation Roadmap"
          title="How X Management Works"
          subtitle="A clear, structured path to digitizing your pharmacy business — from initial plan selection to daily counter operations."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {siteConfig.workflowSteps.map((step, idx) => {
            const IconComponent = stepIcons[step.iconName] || Layers;
            return (
              <div
                key={step.step}
                className="relative flex flex-col p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-soft hover:shadow-card-hover hover:border-brand-200 transition-all duration-300"
              >
                {/* Step Number Indicator */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm shadow-brand-600/30">
                    0{step.step}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Technical Boundary Disclaimer */}
                <div className="mt-auto pt-4 border-t border-slate-200/60 text-[11px] text-slate-400">
                  {idx === 0 && 'Plan selection is in early-access preview mode.'}
                  {idx === 1 && 'Store onboarding will be activated with the tenant database.'}
                  {idx === 2 && 'Daily POS & inventory modules in active development.'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Phase 1 Status Banner */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-brand-50/70 border border-brand-200/80 text-center max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm text-brand-900 font-medium">
            <span className="font-bold">Phase 1 Architecture Notice:</span> Account creation, tenant provisioning, and automated payments will be integrated during Phase 2 backend development.
          </p>
        </div>
      </Container>
    </section>
  );
};
