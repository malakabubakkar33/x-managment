import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <Container size="md">
        <div className="mb-6">
          <Button
            to="/"
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="text-slate-600 hover:text-slate-900"
          >
            Back to Home
          </Button>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-soft">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-4 border border-slate-200">
            <FileText className="w-3.5 h-3.5 text-brand-600" />
            <span>Draft Terms • Subject to Commercial Finalization</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6">
            Terms of Service (Draft)
          </h1>

          <div className="space-y-6 text-sm sm:text-base text-slate-600 leading-relaxed">
            <p>
              Welcome to <strong>X Management</strong>. These draft Terms of Service govern your access to the public marketing site and preview showcases of our pharmacy management ERP platform.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">
              1. Platform Development Phase
            </h2>
            <p>
              The current deployment represents Phase 1 of our product roadmap. All interactive dashboard previews, POS counters, and feature listings are demonstrations intended for technical evaluation and market review. No commercial ERP licenses are bound until formal subscription agreements are executed.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">
              2. Intellectual Property
            </h2>
            <p>
              The X Management trademark, product naming, user interface designs, custom graphics, and software source code are the intellectual property of X Management.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">
              3. Disclaimer of Operational Reliance
            </h2>
            <p>
              Simulated medication records, pricing figures, and batch numbers displayed on the public landing page are purely illustrative and must not be used for actual patient medical care, clinical dispensing, or financial audits.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">
              4. Inquiries &amp; Modifications
            </h2>
            <p>
              Terms will be revised upon commercial release of the Super Admin and Pharmacy Management modules. For terms inquiries, contact <code className="bg-slate-100 px-2 py-0.5 rounded text-brand-700 font-mono text-xs">sales@xmanagement.example.com</code>.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};
