import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Logo } from '../components/layout/Logo';

export const LoginPlaceholderPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 flex flex-col justify-center">
      <Container size="md">
        <div className="text-center mb-8">
          <Logo className="justify-center mb-4" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            X Management Portal Sign In
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Select your portal to access operational pharmacy tools or platform administration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Pharmacy Tenant Portal Card */}
          <Link
            to="/shop/login"
            className="group bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 hover:border-emerald-500 shadow-soft hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-600 group-hover:text-white flex items-center justify-center transition-colors mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 font-mono">
                Dispensary Tenants
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                Pharmacy Staff & Owner Portal
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Log in to your pharmacy branch to manage medicine catalog, FEFO batch expirations, purchase orders, and goods receiving.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
              <span>Sign In to Pharmacy &rarr;</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Super Admin Platform Portal Card */}
          <Link
            to="/admin/login"
            className="group bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 hover:border-blue-600 shadow-soft hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-navy-900 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 font-mono">
                SaaS Headquarters
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                Super Admin Console
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Platform control panel to register pharmacy tenants, manage subscription billing plans, and review platform audits.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-800">
              <span>Sign In as Platform Admin &rarr;</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Marketing Home</span>
          </Link>
        </div>
      </Container>
    </div>
  );
};
