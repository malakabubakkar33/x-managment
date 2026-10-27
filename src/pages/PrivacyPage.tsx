import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';

export const PrivacyPage: React.FC = () => {
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
            <Shield className="w-3.5 h-3.5 text-brand-600" />
            <span>Draft Document • For Review Only</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6">
            Privacy Policy (Draft)
          </h1>

          <div className="space-y-6 text-sm sm:text-base text-slate-600 leading-relaxed">
            <p>
              This draft Privacy Policy outlines how <strong>X Management</strong> intends to handle information collected through our public website and future pharmacy software platform. This document is provided for review during Phase 1 development and does not constitute finalized legal counsel.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">
              1. Information Collected on the Public Website
            </h2>
            <p>
              During Phase 1, our website operates primarily as an informational showcase. Any contact or inquiry details voluntarily submitted via our website form (such as your name, pharmacy business name, email address, and operational inquiries) are collected solely to respond to your questions and discuss prospective pilot implementations.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">
              2. Pharmacy Operational &amp; Patient Data Architecture
            </h2>
            <p>
              When the operational ERP platform is launched in subsequent phases, pharmacy data (including medicine stock counts, supplier accounts, and transaction records) will be stored in isolated tenant databases with strict logical separation. Protected patient dispensing records will comply with applicable local healthcare data privacy standards.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">
              3. Data Security Measures
            </h2>
            <p>
              We implement industry-standard encryption protocols (HTTPS/TLS) for data in transit. Future backend services will enforce encrypted data at rest, role-based access restrictions, and administrative action auditing.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">
              4. Contact for Privacy Matters
            </h2>
            <p>
              For questions concerning this draft document, please reach out via our contact channels or email <code className="bg-slate-100 px-2 py-0.5 rounded text-brand-700 font-mono text-xs">sales@xmanagement.example.com</code>.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};
