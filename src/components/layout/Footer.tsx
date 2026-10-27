import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from './Container';
import { Logo } from './Logo';
import { siteConfig } from '../../config/site';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <Container size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              X Management delivers cloud ERP and modern point-of-sale software engineered specifically for community, retail, and hospital pharmacies.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <span className="flex h-2 w-2 rounded-full bg-medical-500 animate-pulse"></span>
              <span>Platform Development Phase 1 • Public Showcase</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="hover:text-white transition-colors duration-150"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Planned ERP Capabilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Future Modules
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <span className="hover:text-slate-300">Pharmacy POS & Billing</span>
              </li>
              <li>
                <span className="hover:text-slate-300">FEFO Expiry Tracking</span>
              </li>
              <li>
                <span className="hover:text-slate-300">Batch Inventory Control</span>
              </li>
              <li>
                <span className="hover:text-slate-300">Customer & Supplier Khata</span>
              </li>
              <li>
                <span className="hover:text-slate-300">Multi-Shop SaaS Admin</span>
              </li>
            </ul>
          </div>

          {/* Contact / Portal Access */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Portals & Inquiries
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/login"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>Pharmacy Staff Login</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/get-started"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>Request Pilot Onboarding</span>
                </Link>
              </li>
              <li className="pt-2">
                <span className="text-xs text-slate-500 block">General Inquiries:</span>
                <span className="text-xs text-brand-300 font-mono">
                  {siteConfig.contactEmailPlaceholder}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} X Management. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="hover:text-slate-200 transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy (Draft)
            </Link>
            <Link
              to="/terms"
              className="hover:text-slate-200 transition-colors underline-offset-4 hover:underline"
            >
              Terms of Service (Draft)
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
