import React from 'react';
import { ShieldCheck, Code2, Sparkles } from 'lucide-react';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white border-t border-slate-200/80 scroll-mt-12">
      <Container size="lg">
        <SectionHeading
          badge="About X Management"
          title="Software Engineered for Pharmacy Excellence"
          subtitle="We build purpose-driven digital infrastructure to help community pharmacies, dispensaries, and retail drugstores eliminate manual errors and optimize clinical commerce."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Purpose & Mission */}
          <div className="space-y-6 text-slate-600 leading-relaxed text-base sm:text-lg">
            <p>
              <strong className="text-slate-900 font-semibold">X Management</strong> is a specialized software technology company founded to solve the distinct operational bottlenecks faced by modern retail and clinical pharmacies.
            </p>
            <p className="text-base text-slate-600">
              Unlike generic retail point-of-sale systems, pharmaceutical commerce requires strict batch tracking, expiry date auditing (FEFO), supplier invoice reconciliation, chronic customer prescription records, and tight credit khata management.
            </p>
            <p className="text-base text-slate-600">
              Our engineering roadmap combines robust cloud ERP architecture with intuitive, keyboard-optimized checkout screens so pharmacy teams can serve patients faster while maintaining rigorous stock accountability.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm mb-1">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  <span>Clinical Integrity</span>
                </div>
                <p className="text-xs text-slate-500">
                  Built to prevent dispensing expired batches and maintain patient dosage history.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm mb-1">
                  <Code2 className="w-4 h-4 text-brand-600" />
                  <span>Modern Cloud Tech</span>
                </div>
                <p className="text-xs text-slate-500">
                  Engineered with scalable React, TypeScript, and high-performance database design.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Core Architectural Principles */}
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 shadow-soft space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <span>Our Product Principles</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Zero Counter Queue Delay</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Every milliseconds matters when dispensing prescriptions. Our interfaces prioritize rapid barcode lookups and single-key transactions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Prevent Inventory Losses</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Near-expiry alerts and automated stock level warnings ensure you never discover expired medicines sitting on back shelves.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Accurate Financial Ledgers</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Integrated customer credit books and distributor payable ledgers give store owners daily transparency into cash flow and margins.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
              Phase 1 Public Overview • Corporate details and headquarters information will be updated upon commercial registration completion.
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
