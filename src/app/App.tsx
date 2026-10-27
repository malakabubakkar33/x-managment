import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

// Public Pages (Phase 1)
import { HomePage } from '../pages/HomePage';
import { LoginPlaceholderPage } from '../pages/LoginPlaceholderPage';
import { GetStartedPlaceholderPage } from '../pages/GetStartedPlaceholderPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { TermsPage } from '../pages/TermsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Super Admin Pages & Guard (Phase 2)
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { AdminProtectedRoute } from '../components/admin/auth/AdminProtectedRoute';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminPharmaciesPage } from '../pages/admin/AdminPharmaciesPage';
import { AdminSubscriptionsPage } from '../pages/admin/AdminSubscriptionsPage';
import { AdminPaymentsPage } from '../pages/admin/AdminPaymentsPage';
import { AdminPlansPage } from '../pages/admin/AdminPlansPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

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

  return (
    <AdminAuthProvider>
      <div className="flex flex-col min-h-screen text-slate-900 bg-slate-50">
        <ScrollHandler />

        {/* Public Header is rendered only on non-admin public pages */}
        {!isAdminRoute && <Header />}

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

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Public Footer is rendered only on non-admin public pages */}
        {!isAdminRoute && <Footer />}
      </div>
    </AdminAuthProvider>
  );
};

export default App;
