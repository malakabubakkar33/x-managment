import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import { ShopAuthProvider } from '../context/ShopAuthContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

// Public Pages (Phase 1)
import { HomePage } from '../pages/HomePage';
import { LoginPlaceholderPage } from '../pages/LoginPlaceholderPage';
import { GetStartedPlaceholderPage } from '../pages/GetStartedPlaceholderPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { TermsPage } from '../pages/TermsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Super Admin Pages & Guard (Phase 2 & 3)
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { AdminProtectedRoute } from '../components/admin/auth/AdminProtectedRoute';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminPharmaciesPage } from '../pages/admin/AdminPharmaciesPage';
import { AdminSubscriptionsPage } from '../pages/admin/AdminSubscriptionsPage';
import { AdminPaymentsPage } from '../pages/admin/AdminPaymentsPage';
import { AdminPlansPage } from '../pages/admin/AdminPlansPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

// Pharmacy Shop Pages & Guard (Phase 5, 6, 7)
import { ShopLoginPage } from '../pages/shop/ShopLoginPage';
import { ShopProtectedRoute } from '../components/shop/auth/ShopProtectedRoute';
import { ShopDashboardPage } from '../pages/shop/ShopDashboardPage';
import { ShopInventoryPage } from '../pages/shop/ShopInventoryPage';
import { ShopMedicineFormPage } from '../pages/shop/ShopMedicineFormPage';
import { ShopBatchesPage } from '../pages/shop/ShopBatchesPage';
import { ShopMovementsPage } from '../pages/shop/ShopMovementsPage';
import { ShopInventoryAlertsPage } from '../pages/shop/ShopInventoryAlertsPage';
import { ShopSuppliersPage } from '../pages/shop/ShopSuppliersPage';
import { ShopPurchasesPage } from '../pages/shop/ShopPurchasesPage';
import { ShopPurchaseNewPage } from '../pages/shop/ShopPurchaseNewPage';
import { ShopPurchaseDetailPage } from '../pages/shop/ShopPurchaseDetailPage';
import { ShopGoodsReceivingPage } from '../pages/shop/ShopGoodsReceivingPage';
import { ShopPlaceholderPage } from '../pages/shop/ShopPlaceholderPage';

function ScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 50);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, hash]);

  return null;
}

export const App: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isShopRoute = location.pathname.startsWith('/shop');
  const isPublicRoute = !isAdminRoute && !isShopRoute;

  return (
    <AdminAuthProvider>
      <ShopAuthProvider>
        <div className="flex flex-col min-h-screen text-slate-900 bg-slate-50">
          <ScrollHandler />

          {/* Public Header is rendered only on public marketing pages */}
          {isPublicRoute && <Header />}

          <main className="flex-grow">
            <Routes>
              {/* Public Marketing & Phase 1 Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPlaceholderPage />} />
              <Route path="/get-started" element={<GetStartedPlaceholderPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />

              {/* Super Admin Authentication (Phase 2) */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Super Admin Application Routes */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboardPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/pharmacies"
                element={
                  <AdminProtectedRoute>
                    <AdminPharmaciesPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/subscriptions"
                element={
                  <AdminProtectedRoute>
                    <AdminSubscriptionsPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/payments"
                element={
                  <AdminProtectedRoute>
                    <AdminPaymentsPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/plans"
                element={
                  <AdminProtectedRoute>
                    <AdminPlansPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminProtectedRoute>
                    <AdminUsersPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminProtectedRoute>
                    <AdminSettingsPage />
                  </AdminProtectedRoute>
                }
              />

              {/* Pharmacy Tenant Authentication (Phase 5) */}
              <Route path="/shop/login" element={<ShopLoginPage />} />

              {/* Protected Pharmacy Shop Routes */}
              <Route
                path="/shop"
                element={
                  <ShopProtectedRoute>
                    <ShopDashboardPage />
                  </ShopProtectedRoute>
                }
              />
              <Route
                path="/shop/inventory"
                element={
                  <ShopProtectedRoute>
                    <ShopInventoryPage />
                  </ShopProtectedRoute>
                }
              />
              <Route
                path="/shop/inventory/new"
                element={
                  <ShopProtectedRoute>
                    <ShopMedicineFormPage />
                  </ShopProtectedRoute>
                }
              />
              <Route
                path="/shop/inventory/edit/:id"
                element={
                  <ShopProtectedRoute>
                    <ShopMedicineFormPage />
                  </ShopProtectedRoute>
                }
              />
              <Route
                path="/shop/batches"
                element={
                  <ShopProtectedRoute>
                    <ShopBatchesPage />
                  </ShopProtectedRoute>
                }
              />
              <Route
                path="/shop/movements"
                element={
                  <ShopProtectedRoute>
                    <ShopMovementsPage />
                  </ShopProtectedRoute>
                }
              />
              <Route
                path="/shop/alerts"
                element={
                  <ShopProtectedRoute>
                    <ShopInventoryAlertsPage />
                  </ShopProtectedRoute>
                }
              />

              {/* Procurement & Purchasing Routes (Phase 7) */}
              <Route
                path="/shop/suppliers"
                element={
                  <ShopProtectedRoute>
                    <ShopSuppliersPage />
                  </ShopProtectedRoute>
                }
              />
              <Route
                path="/shop/purchases"
                element={
                  <ShopProtectedRoute>
                    <ShopPurchasesPage />
                  </ShopProtectedRoute>
                }
              />
              <Route
                path="/shop/purchases/new"
                element={
                  <ShopProtectedRoute>
                    <ShopPurchaseNewPage />
                  </ShopProtectedRoute>
                }
              />
              <Route
                path="/shop/purchases/:id"
                element={
                  <ShopProtectedRoute>
                    <ShopPurchaseDetailPage />
                  </ShopProtectedRoute>
                }
              />
              <Route
                path="/shop/goods-receiving"
                element={
                  <ShopProtectedRoute>
                    <ShopGoodsReceivingPage />
                  </ShopProtectedRoute>
                }
              />

              {/* Roadmap Placeholders (Phases 8+) */}
              <Route
                path="/shop/pos"
                element={
                  <ShopProtectedRoute>
                    <ShopPlaceholderPage
                      title="Point of Sale (POS) Counter"
                      description="High-speed barcode scanner retail checkout, split cash/card payments, prescription attachments, and thermal receipt printing."
                      phase="Phase 8"
                      features={[
                        'Barcode scanner rapid item entry',
                        'FEFO auto-allocation on item ring-up',
                        'Customer receipt customization (thermal 80mm/58mm)',
                        'Hold cart & multi-register cash drawer reconciliation',
                      ]}
                    />
                  </ShopProtectedRoute>
                }
              />
              <Route
                path="/shop/customers"
                element={
                  <ShopProtectedRoute>
                    <ShopPlaceholderPage
                      title="Customer Khata & Credit Ledger"
                      description="Credit sale ledgers, patient profiles, credit limits, reminder SMS, and partial payment recovery tracking."
                      phase="Phase 9"
                      features={[
                        'Customer credit account limit enforcement',
                        'Automated statement generation & SMS reminders',
                        'Prescription history tied to patient profile',
                        'Multi-part credit settlement ledger',
                      ]}
                    />
                  </ShopProtectedRoute>
                }
              />
              <Route
                path="/shop/reports"
                element={
                  <ShopProtectedRoute>
                    <ShopPlaceholderPage
                      title="Financial & Inventory Analytics"
                      description="Profit & loss calculations, fast/slow moving medicine heatmaps, supplier payment schedules, and tax reporting."
                      phase="Phase 10"
                      features={[
                        'Daily gross and net revenue reconciliation',
                        'Gross margin per medicine and category',
                        'Dead stock & near-expiry write-off valuation',
                        'Sales tax & withholding tax export',
                      ]}
                    />
                  </ShopProtectedRoute>
                }
              />
              <Route
                path="/shop/settings"
                element={
                  <ShopProtectedRoute>
                    <ShopPlaceholderPage
                      title="Dispensary Branch Settings"
                      description="Pharmacy license info, staff role permissions, thermal printer baud rates, and automated daily backup routines."
                      phase="Phase 11"
                      features={[
                        'Pharmacy license and drug authority details',
                        'Staff access controls (Cashier, Manager, Pharmacist)',
                        'Receipt header/footer personalization',
                        'Low-stock email & alert thresholds',
                      ]}
                    />
                  </ShopProtectedRoute>
                }
              />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Public Footer is rendered only on public marketing pages */}
          {isPublicRoute && <Footer />}
        </div>
      </ShopAuthProvider>
    </AdminAuthProvider>
  );
};

export default App;
