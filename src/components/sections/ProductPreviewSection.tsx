import React, { useState } from 'react';
import {
  LayoutDashboard,
  Receipt,
  Boxes,
  BarChart3,
  Search,
  AlertCircle,
  Printer,
  CreditCard,
  Banknote,
} from 'lucide-react';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { cn } from '../../utils/cn';

type PreviewTabId = 'dashboard' | 'pos' | 'inventory' | 'reports';

interface TabItem {
  id: PreviewTabId;
  label: string;
  icon: React.FC<{ className?: string }>;
  description: string;
}

const tabs: TabItem[] = [
  {
    id: 'dashboard',
    label: 'Overview Dashboard',
    icon: LayoutDashboard,
    description: 'Real-time daily KPI indicators, expiring batch summaries, and store traffic trends.',
  },
  {
    id: 'pos',
    label: 'POS & Billing Counter',
    icon: Receipt,
    description: 'High-speed dispensing interface with instant barcode scanner and receipt generation.',
  },
  {
    id: 'inventory',
    label: 'FEFO Medicine Inventory',
    icon: Boxes,
    description: 'First-Expire, First-Out batch control with shelf locations and reorder level alerts.',
  },
  {
    id: 'reports',
    label: 'Sales & Profit Reports',
    icon: BarChart3,
    description: 'Gross margin breakdowns, daily cashier reconciliation, and supplier credit balance ledgers.',
  },
];

export const ProductPreviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PreviewTabId>('dashboard');

  return (
    <section id="preview" className="py-20 lg:py-28 bg-slate-900 text-white scroll-mt-12 overflow-hidden">
      <Container size="lg">
        <SectionHeading
          badge="Interactive System Preview"
          title="Designed for Fast-Paced Pharmacy Workflows"
          subtitle="Explore the intuitive interfaces planned for store owners, pharmacists, and cashiers. Built to reduce counter queues and eliminate expired stock."
          variant="light"
        />

        {/* Tab Selection Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 max-w-4xl mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border',
                  isActive
                    ? 'bg-brand-600 text-white border-brand-500 shadow-lg shadow-brand-600/30 ring-2 ring-brand-400/20'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
                )}
                aria-pressed={isActive}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Description */}
        <p className="text-center text-xs sm:text-sm text-slate-400 max-w-xl mx-auto -mt-4 mb-8">
          {tabs.find((t) => t.id === activeTab)?.description}
        </p>

        {/* Screen Showcase Container */}
        <div className="rounded-2xl lg:rounded-3xl bg-navy-950 border border-slate-800 p-3 sm:p-5 shadow-2xl overflow-hidden">
          {/* Mock Browser / Window Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="font-mono text-[11px] ml-2 text-slate-500 hidden sm:inline">
                x-management-erp.com/terminal/{activeTab}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-medical-400 bg-medical-500/10 px-2.5 py-0.5 rounded border border-medical-500/20">
                Mode: UI Specification
              </span>
              <span className="text-slate-400 text-[11px] hidden md:inline">
                Branch: Central Main 01
              </span>
            </div>
          </div>

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* KPI Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase font-medium">Shift Revenue</div>
                  <div className="text-2xl font-bold text-white mt-1">$4,120.00</div>
                  <div className="text-[11px] text-medical-400 mt-1">↑ +18.4% vs last week</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase font-medium">Customer Transactions</div>
                  <div className="text-2xl font-bold text-white mt-1">216 Bills</div>
                  <div className="text-[11px] text-slate-400 mt-1">Avg turnaround 1.8 min</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase font-medium">FEFO Alerts</div>
                  <div className="text-2xl font-bold text-amber-400 mt-1">3 Batches</div>
                  <div className="text-[11px] text-amber-300/80 mt-1">Expires within 45 days</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase font-medium">Supplier Payables</div>
                  <div className="text-2xl font-bold text-slate-200 mt-1">$1,850.00</div>
                  <div className="text-[11px] text-slate-400 mt-1">Due next Tuesday</div>
                </div>
              </div>

              {/* Graphical Overview & Expiry List */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-white">Daily Revenue Progression</h4>
                    <span className="text-xs text-brand-400 font-mono">Today: Oct 27</span>
                  </div>
                  <div className="h-44 flex items-end gap-2.5 px-2 pb-2">
                    {[22, 38, 45, 62, 85, 94, 82, 70, 58, 40].map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <div
                          className="w-full rounded bg-brand-500 hover:bg-brand-400 transition-colors"
                          style={{ height: `${val}%` }}
                        />
                        <span className="text-[10px] text-slate-500 font-mono">
                          {8 + i}:00
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Priority Batch Expiry</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                      <div className="font-semibold text-white">Cefixime 400mg</div>
                      <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                        <span>Batch #CF-882</span>
                        <span className="text-amber-400 font-semibold">18 Days Left</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                      <div className="font-semibold text-white">Azithromycin 500mg</div>
                      <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                        <span>Batch #AZ-401</span>
                        <span className="text-amber-400 font-semibold">32 Days Left</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                      <div className="font-semibold text-white">Omeprazole 20mg</div>
                      <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                        <span>Batch #OM-119</span>
                        <span className="text-amber-400 font-semibold">41 Days Left</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: POS & BILLING COUNTER */}
          {activeTab === 'pos' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: Barcode Search & Cart */}
                <div className="lg:col-span-8 p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800">
                  {/* Search Bar Simulation */}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 border border-slate-700 mb-4 text-xs">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      readOnly
                      value="Scan barcode or type medicine name... (e.g. Augmentin 625mg)"
                      className="bg-transparent text-slate-300 w-full focus:outline-none cursor-default text-xs"
                    />
                    <span className="px-2 py-0.5 rounded bg-brand-600 text-white font-mono text-[10px]">
                      F2 Scan
                    </span>
                  </div>

                  {/* Cart Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 pb-2">
                          <th className="pb-2 font-medium">Medicine</th>
                          <th className="pb-2 font-medium">Batch</th>
                          <th className="pb-2 font-medium">Expiry</th>
                          <th className="pb-2 font-medium text-center">Qty</th>
                          <th className="pb-2 font-medium text-right">Price</th>
                          <th className="pb-2 font-medium text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 text-slate-300">
                        <tr>
                          <td className="py-3">
                            <span className="font-semibold text-white">Augmentin 625mg</span>
                            <span className="block text-[10px] text-slate-400">GSK • Amox/Clav</span>
                          </td>
                          <td className="py-3 font-mono text-brand-300">AUG-9031</td>
                          <td className="py-3 text-slate-400 font-mono text-[11px]">11/2026</td>
                          <td className="py-3 text-center">2 pk</td>
                          <td className="py-3 text-right">$12.50</td>
                          <td className="py-3 text-right font-bold text-white">$25.00</td>
                        </tr>
                        <tr>
                          <td className="py-3">
                            <span className="font-semibold text-white">Panadol Extra</span>
                            <span className="block text-[10px] text-slate-400">Paracetamol + Caffeine</span>
                          </td>
                          <td className="py-3 font-mono text-brand-300">PND-4412</td>
                          <td className="py-3 text-slate-400 font-mono text-[11px]">08/2027</td>
                          <td className="py-3 text-center">4 pk</td>
                          <td className="py-3 text-right">$3.20</td>
                          <td className="py-3 text-right font-bold text-white">$12.80</td>
                        </tr>
                        <tr>
                          <td className="py-3">
                            <span className="font-semibold text-white">Ventolin Inhaler 100mcg</span>
                            <span className="block text-[10px] text-slate-400">Salbutamol 200 doses</span>
                          </td>
                          <td className="py-3 font-mono text-brand-300">VEN-7704</td>
                          <td className="py-3 text-slate-400 font-mono text-[11px]">04/2026</td>
                          <td className="py-3 text-center">1 unit</td>
                          <td className="py-3 text-right">$9.70</td>
                          <td className="py-3 text-right font-bold text-white">$9.70</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right: Checkout Ledger & Receipt Summary */}
                <div className="lg:col-span-4 p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-3">Invoice Summary</h4>
                    <div className="space-y-2 text-xs text-slate-300 border-b border-slate-800 pb-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Subtotal:</span>
                        <span className="font-mono text-white">$47.50</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Prescription Tax (5%):</span>
                        <span className="font-mono text-white">$2.38</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Customer Discount:</span>
                        <span className="font-mono text-emerald-400">-$2.00</span>
                      </div>
                    </div>

                    <div className="pt-3 mb-4">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs uppercase text-slate-400 font-bold">Net Total:</span>
                        <span className="text-2xl font-extrabold text-white font-mono">$47.88</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold mb-3">
                      <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-brand-600 text-white hover:bg-brand-500">
                        <Banknote className="w-3.5 h-3.5" /> Cash (F8)
                      </button>
                      <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700">
                        <CreditCard className="w-3.5 h-3.5" /> Card (F9)
                      </button>
                    </div>

                    <button className="w-full py-2 rounded-lg bg-slate-800/80 text-slate-400 text-xs hover:text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5">
                      <span>Post to Customer Khata (Credit)</span>
                    </button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Printer className="w-3.5 h-3.5" /> Thermal 80mm ESC/POS
                    </span>
                    <span>Ready</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FEFO MEDICINE INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Active Pharmaceutical Inventory</h4>
                    <p className="text-xs text-slate-400">Strict First-Expire First-Out batch sequencing</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Filter:</span>
                    <span className="px-2.5 py-1 rounded bg-brand-600/30 text-brand-300 text-xs font-medium border border-brand-500/30">
                      All Items (1,480)
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-2.5 font-medium">Trade Name</th>
                        <th className="pb-2.5 font-medium">Generic / Salt</th>
                        <th className="pb-2.5 font-medium">Batch No.</th>
                        <th className="pb-2.5 font-medium">Expiry Date</th>
                        <th className="pb-2.5 font-medium text-center">Stock Level</th>
                        <th className="pb-2.5 font-medium text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      <tr>
                        <td className="py-2.5 font-semibold text-white">Lipitor 20mg</td>
                        <td className="py-2.5 text-slate-400">Atorvastatin Calcium</td>
                        <td className="py-2.5 font-mono text-brand-300">LIP-2025-X</td>
                        <td className="py-2.5 text-slate-300 font-mono">12/2026</td>
                        <td className="py-2.5 text-center font-bold text-white">45 Boxes</td>
                        <td className="py-2.5 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
                            Adequate
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-white">Nexium 40mg</td>
                        <td className="py-2.5 text-slate-400">Esomeprazole Magnesium</td>
                        <td className="py-2.5 font-mono text-brand-300">NEX-901</td>
                        <td className="py-2.5 text-amber-400 font-mono font-semibold">12/2024</td>
                        <td className="py-2.5 text-center font-bold text-white">12 Boxes</td>
                        <td className="py-2.5 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] border border-amber-500/20">
                            Near Expiry
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-white">Insulin Glargine</td>
                        <td className="py-2.5 text-slate-400">Lantus SoloStar 100U/ml</td>
                        <td className="py-2.5 font-mono text-brand-300">LAN-4100</td>
                        <td className="py-2.5 text-slate-300 font-mono">09/2026</td>
                        <td className="py-2.5 text-center font-bold text-rose-300">2 Pens</td>
                        <td className="py-2.5 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] border border-rose-500/20">
                            Low Stock (Reorder)
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-white">Glucophage 500mg</td>
                        <td className="py-2.5 text-slate-400">Metformin Hydrochloride</td>
                        <td className="py-2.5 font-mono text-brand-300">GLU-552</td>
                        <td className="py-2.5 text-slate-300 font-mono">03/2027</td>
                        <td className="py-2.5 text-center font-bold text-white">120 Boxes</td>
                        <td className="py-2.5 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
                            Adequate
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SALES & PROFIT REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-medium">Monthly Gross Profit</span>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">$14,240.00</div>
                  <div className="text-[11px] text-slate-400 mt-1">26.8% Average Margin</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-medium">Cost of Goods Sold (COGS)</span>
                  <div className="text-2xl font-bold text-white mt-1">$38,890.00</div>
                  <div className="text-[11px] text-slate-400 mt-1">Verified with supplier invoices</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-medium">Active Customer Khata</span>
                  <div className="text-2xl font-bold text-brand-400 mt-1">$2,110.50</div>
                  <div className="text-[11px] text-slate-400 mt-1">42 Regular Credit Accounts</div>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-3">Top Therapeutic Categories by Revenue</h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Cardiovascular &amp; Hypertension</span>
                      <span className="font-mono text-white">$12,400 (32%)</span>
                    </div>
                    <div className="h-2 rounded bg-slate-800 overflow-hidden">
                      <div className="h-full bg-brand-500 rounded" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Antibiotics &amp; Anti-infectives</span>
                      <span className="font-mono text-white">$9,690 (25%)</span>
                    </div>
                    <div className="h-2 rounded bg-slate-800 overflow-hidden">
                      <div className="h-full bg-medical-500 rounded" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Endocrine &amp; Diabetes Care</span>
                      <span className="font-mono text-white">$8,140 (21%)</span>
                    </div>
                    <div className="h-2 rounded bg-slate-800 overflow-hidden">
                      <div className="h-full bg-brand-400 rounded" style={{ width: '21%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};
