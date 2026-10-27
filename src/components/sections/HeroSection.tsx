import React from 'react';
import { ArrowRight, Sparkles, TrendingUp, AlertTriangle, Package, CheckCircle, ShieldCheck } from 'lucide-react';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-brand-50/60 via-slate-50 to-white"
    >
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-brand-200/20 via-brand-100/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <Container size="lg">
        {/* Hero Top Copy */}
        <div className="text-center max-w-4xl mx-auto mb-14 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-medical-500 animate-pulse"></span>
            <span>Cloud-Based Pharmacy Management &amp; ERP</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Run Your Pharmacy <span className="text-brand-600">Smarter.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Manage medicine inventory, sales, purchases, customer accounts, and business reports from one organized pharmacy management platform.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href="#pricing"
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto shadow-md"
            >
              Explore Plans
            </Button>
            <Button
              href="#features"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Explore Features
            </Button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-600" /> Multi-Shop Ready
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-medical-600" /> FEFO Expiry Logic
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> Rapid POS Billing
            </span>
          </div>
        </div>

        {/* Dashboard Preview Component */}
        <div className="relative mx-auto max-w-5xl rounded-2xl lg:rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-slate-200/80 via-slate-100/40 to-slate-200/80 border border-slate-300/80 shadow-elevated">
          {/* Top Preview Banner */}
          <div className="bg-navy-950 text-slate-200 rounded-xl lg:rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            {/* Window Top Controls */}
            <div className="px-4 py-3 bg-navy-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                </div>
                <span className="ml-2 font-mono text-[11px] text-slate-400 hidden sm:inline">
                  x-management-portal.local/app/dashboard
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full bg-medical-500/20 text-medical-400 font-medium text-[11px] border border-medical-500/30">
                  Live Shift Active
                </span>
                <span className="text-slate-400 text-[11px] hidden md:inline">
                  Dr. Sarah K. (Pharmacist)
                </span>
              </div>
            </div>

            {/* Dashboard Inner Layout */}
            <div className="p-4 sm:p-6 lg:p-7 bg-slate-900/95 space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Daily Sales</span>
                    <TrendingUp className="w-3.5 h-3.5 text-medical-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white">
                    $3,480.50
                  </div>
                  <div className="text-[11px] text-medical-400 mt-1 font-medium">
                    +14.2% vs yesterday
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Invoices Issued</span>
                    <Package className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white">
                    184 Bills
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-medium">
                    Avg $18.90 / ticket
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Near Expiry</span>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-amber-300">
                    4 Batches
                  </div>
                  <div className="text-[11px] text-amber-400/90 mt-1 font-medium">
                    Expiring &lt; 60 days
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Low Stock Items</span>
                    <Package className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-rose-300">
                    7 Items
                  </div>
                  <div className="text-[11px] text-rose-400/90 mt-1 font-medium">
                    Below reorder point
                  </div>
                </div>
              </div>

              {/* Two-Column Detail View: Recent Prescriptions / POS Preview + Hourly Activity Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* POS Activity Table */}
                <div className="lg:col-span-7 p-4 sm:p-5 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-300">
                    <span>Recent Counter Checkouts</span>
                    <span className="text-brand-400 font-mono text-[11px]">Register #01</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400">
                          <th className="pb-2 font-medium">Item &amp; Formulation</th>
                          <th className="pb-2 font-medium">Batch</th>
                          <th className="pb-2 font-medium text-center">Qty</th>
                          <th className="pb-2 font-medium text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 text-slate-300">
                        <tr>
                          <td className="py-2.5">
                            <div className="font-semibold text-white">Amoxicillin 500mg</div>
                            <div className="text-[10px] text-slate-400">Capsules • 20 count</div>
                          </td>
                          <td className="py-2.5 font-mono text-[11px] text-brand-300">AMX-2025-08</td>
                          <td className="py-2.5 text-center">2 pk</td>
                          <td className="py-2.5 text-right font-semibold text-white">$14.50</td>
                        </tr>
                        <tr>
                          <td className="py-2.5">
                            <div className="font-semibold text-white">Paracetamol 500mg</div>
                            <div className="text-[10px] text-slate-400">Oral Tablets • 50 count</div>
                          </td>
                          <td className="py-2.5 font-mono text-[11px] text-brand-300">PCT-2026-11</td>
                          <td className="py-2.5 text-center">1 pk</td>
                          <td className="py-2.5 text-right font-semibold text-white">$4.80</td>
                        </tr>
                        <tr>
                          <td className="py-2.5">
                            <div className="font-semibold text-white">Metformin 850mg</div>
                            <div className="text-[10px] text-slate-400">Film-coated • 30 count</div>
                          </td>
                          <td className="py-2.5 font-mono text-[11px] text-brand-300">MTF-2026-03</td>
                          <td className="py-2.5 text-center">3 pk</td>
                          <td className="py-2.5 text-right font-semibold text-white">$21.60</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sales Hourly Distribution Mockup */}
                <div className="lg:col-span-5 p-4 sm:p-5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-3">
                      <span>Hourly Counter Volume</span>
                      <span className="text-medical-400 font-mono text-[11px]">Peak 14:00 - 18:00</span>
                    </div>
                    {/* Simulated Bar Chart */}
                    <div className="h-32 flex items-end gap-2 pt-4 px-1">
                      {[35, 52, 70, 85, 95, 80, 60, 45].map((height, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <div
                            className="w-full rounded-t bg-gradient-to-t from-brand-600 to-brand-400 hover:from-brand-500 hover:to-medical-400 transition-colors"
                            style={{ height: `${height}%` }}
                          />
                          <span className="text-[9px] text-slate-500 font-mono">
                            {9 + i * 1}h
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Payment Split:</span>
                    <span className="text-white font-medium">Cash 68% • Card 24% • Khata 8%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="px-4 py-2 bg-navy-950/80 border-t border-slate-800 text-center text-[11px] text-slate-400">
              Illustrative Dashboard Preview — Live operational modules will be enabled in subsequent platform phases.
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
