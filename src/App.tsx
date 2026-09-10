/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Master Application Entry Point with HashRouter & Protected Routing
 */

import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/public/HomePage';
import { ProductPages } from './components/public/ProductPages';
import { CompanyPages } from './components/public/CompanyPages';
import { HelpCenter } from './components/public/HelpCenter';
import { LegalCenter } from './components/public/LegalCenter';
import { AuthPages } from './components/public/AuthPages';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { EASimulator } from './components/ea/EASimulator';
import { NotFoundPage } from './components/common/NotFoundPage';
import { AlertTriangle, CheckCircle2, Info, X, Shield } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-xl shadow-2xl border flex items-start gap-3 backdrop-blur-md animate-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-700/60 text-emerald-100'
              : toast.type === 'critical'
              ? 'bg-rose-950/90 border-rose-700/60 text-rose-100'
              : toast.type === 'warning'
              ? 'bg-amber-950/90 border-amber-700/60 text-amber-100'
              : 'bg-[#111420]/95 border-[#2B354C] text-zinc-100'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'critical' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#E4C765] shrink-0 mt-0.5" />}

          <div className="flex-1 text-xs">
            <div className="font-bold">{toast.title}</div>
            <div className="text-[11px] opacity-90 mt-0.5">{toast.message}</div>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-zinc-400 hover:text-white shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

// Protected Route Guard for Customers
const ProtectedCustomerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, currentRole } = useApp();

  if (currentRole === 'visitor' || !currentUser?.uid) {
    return <Navigate to="/login?redirect=/dashboard" replace />;
  }

  return <>{children}</>;
};

// Protected Route Guard for Staff/Admins
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentRole } = useApp();

  if (currentRole === 'visitor' || currentRole === 'customer') {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { settings } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#08090B] text-zinc-100 selection:bg-[#C9A227] selection:text-black font-sans">
      {/* Global Emergency Stop Alert Bar */}
      {settings.globalEmergencyStop && (
        <div className="bg-rose-700 text-white text-xs font-bold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-lg sticky top-0 z-50">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
          <span>GLOBAL EMERGENCY STOP ENGAGED: Cloud Run API is currently holding all EA order executions.</span>
        </div>
      )}

      {/* Main institutional header */}
      <Header />

      {/* Page Content Container with React Router Routes */}
      <main className="flex-1">
        <Routes>
          {/* Public Home & Pricing */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/pricing" element={<HomePage />} />

          {/* EA Sandbox Simulator */}
          <Route path="/ea-simulator" element={<EASimulator />} />

          {/* Product Architecture Pages */}
          <Route path="/product-overview" element={<ProductPages section="product-overview" />} />
          <Route path="/product-ea" element={<ProductPages section="product-ea" />} />
          <Route path="/mt5-integration" element={<ProductPages section="mt5-integration" />} />
          <Route path="/licensing-info" element={<ProductPages section="licensing-info" />} />
          <Route path="/vps-ops" element={<ProductPages section="vps-ops" />} />
          <Route path="/risk-controls" element={<ProductPages section="risk-controls" />} />
          <Route path="/security" element={<ProductPages section="security" />} />
          <Route path="/how-it-works" element={<ProductPages section="how-it-works" />} />

          {/* Company & Governance */}
          <Route path="/about" element={<CompanyPages section="about" />} />
          <Route path="/vision-mission" element={<CompanyPages section="vision-mission" />} />
          <Route path="/core-values" element={<CompanyPages section="core-values" />} />
          <Route path="/responsible-tech" element={<CompanyPages section="responsible-tech" />} />
          <Route path="/contact" element={<CompanyPages section="contact" />} />

          {/* Help Center & Installation */}
          <Route path="/help-center" element={<HelpCenter section="help-center" />} />
          <Route path="/install-guide" element={<HelpCenter section="install-guide" />} />
          <Route path="/mt5-setup" element={<HelpCenter section="mt5-setup" />} />
          <Route path="/faq" element={<HelpCenter section="faq" />} />

          {/* Statutory Legal Center */}
          <Route path="/legal-terms" element={<LegalCenter document="legal-terms" />} />
          <Route path="/terms" element={<LegalCenter document="legal-terms" />} />
          <Route path="/legal-sla" element={<LegalCenter document="legal-sla" />} />
          <Route path="/license-agreement" element={<LegalCenter document="legal-sla" />} />
          <Route path="/service-agreement" element={<LegalCenter document="service-agreement" />} />
          <Route path="/legal-risk" element={<LegalCenter document="legal-risk" />} />
          <Route path="/risk-disclosure" element={<LegalCenter document="legal-risk" />} />
          <Route path="/legal-privacy" element={<LegalCenter document="legal-privacy" />} />
          <Route path="/privacy" element={<LegalCenter document="legal-privacy" />} />
          <Route path="/legal-cookies" element={<LegalCenter document="legal-cookies" />} />
          <Route path="/cookie-policy" element={<LegalCenter document="legal-cookies" />} />
          <Route path="/legal-refunds" element={<LegalCenter document="legal-refunds" />} />
          <Route path="/refund-policy" element={<LegalCenter document="legal-refunds" />} />
          <Route path="/legal-acceptable-use" element={<LegalCenter document="legal-acceptable-use" />} />
          <Route path="/acceptable-use" element={<LegalCenter document="legal-acceptable-use" />} />
          <Route path="/disclaimer" element={<LegalCenter document="disclaimer" />} />

          {/* Authentication & Verification */}
          <Route path="/login" element={<AuthPages view="login" />} />
          <Route path="/register" element={<AuthPages view="register" />} />
          <Route path="/forgot-password" element={<AuthPages view="forgot-password" />} />
          <Route path="/verify-email" element={<AuthPages view="verify-email" />} />

          {/* Protected Customer Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedCustomerRoute>
                <CustomerPortal />
              </ProtectedCustomerRoute>
            }
          />
          <Route path="/wallet-payments" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Admin & Operations Console */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminPortal />
              </ProtectedAdminRoute>
            }
          />
          <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/admin-overview" element={<Navigate to="/admin" replace />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Institutional Legal Footer */}
      <Footer />

      {/* Dynamic Toast Layer */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </HashRouter>
    </ErrorBoundary>
  );
}
