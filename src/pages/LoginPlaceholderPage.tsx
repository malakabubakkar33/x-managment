import React from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/layout/Logo';

export const LoginPlaceholderPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 flex flex-col justify-center">
      <Container size="sm">
        <div className="text-center mb-8">
          <Logo className="justify-center mb-4" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Pharmacy Staff Portal
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Secure Authentication &amp; Cashier Shift Login
          </p>
        </div>

        <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-soft">
          {/* Phase 1 Boundary Alert */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <span className="font-bold">Phase 1 Development Boundary: </span>
              The public marketing website does not include live authentication or database credentials. The JWT-secured Pharmacy Staff &amp; Super Admin authentication systems will be implemented in subsequent phases.
            </div>
          </div>

          {/* Planned Roles Preview */}
          <div className="space-y-3 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Planned Authentication Roles:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <span className="font-bold text-slate-900 block">Pharmacist / Cashier</span>
                <span className="text-[11px] text-slate-500">POS register &amp; stock dispensing</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <span className="font-bold text-slate-900 block">Pharmacy Owner</span>
                <span className="text-[11px] text-slate-500">Full branch reports &amp; khata ledgers</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <span className="font-bold text-slate-900 block">Inventory Clerk</span>
                <span className="text-[11px] text-slate-500">Purchase orders &amp; batch intake</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <span className="font-bold text-slate-900 block">SaaS Super Admin</span>
                <span className="text-[11px] text-slate-500">Multi-tenant subscription manager</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <Button to="/#contact" variant="primary" fullWidth size="md">
              Inquire About Early Pilot Access
            </Button>
            <Button
              to="/"
              variant="secondary"
              fullWidth
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Return to Website Home
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};
