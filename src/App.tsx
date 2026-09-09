/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Master Application Entry Point
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
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
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

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
              : toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-700/60 text-rose-100'
              : toast.type === 'warning'
              ? 'bg-amber-950/90 border-amber-700/60 text-amber-100'
              : 'bg-[#111420]/95 border-[#2B354C] text-zinc-100'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
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

const AppContent: React.FC = () => {
  const { currentRoute, settings, currentUser, currentRole, acceptAgreements } = useApp();

  const renderRoute = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage />;

      case 'ea-simulator':
        return <EASimulator />;

      // Product architecture pages
      case 'product-overview':
      case 'product-ea':
      case 'mt5-integration':
      case 'licensing-info':
      case 'vps-ops':
      case 'risk-controls':
      case 'security':
      case 'how-it-works':
        return <ProductPages section={currentRoute} />;

      // Company & Governance
      case 'about':
      case 'vision-mission':
      case 'core-values':
      case 'responsible-tech':
      case 'contact':
        return <CompanyPages section={currentRoute} />;

      // Help Center & Installation
      case 'help-center':
      case 'install-guide':
      case 'mt5-setup':
      case 'faq':
        return <HelpCenter section={currentRoute} />;

      // Legal statutory center
      case 'legal-terms':
      case 'legal-sla':
      case 'legal-risk':
      case 'legal-privacy':
      case 'legal-cookies':
      case 'legal-refunds':
      case 'legal-acceptable-use':
        return <LegalCenter document={currentRoute} />;

      // Authentication flows
      case 'login':
      case 'register':
      case 'forgot-password':
        return <AuthPages view={currentRoute} />;

      // Customer Portal
      case 'dashboard':
        return <CustomerPortal />;

      // Admin & Operations Portal
      case 'admin-dashboard':
        return <AdminPortal />;

      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090B] text-zinc-100 selection:bg-[#C9A227] selection:text-black font-sans">
      {/* Global Emergency Stop Alert Bar */}
      {settings.globalEmergencyStop && (
        <div className="bg-rose-700 text-white text-xs font-bold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-lg">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
          <span>GLOBAL EMERGENCY STOP ENGAGED: Cloud Run API is currently holding all EA order executions.</span>
        </div>
      )}

      {/* Main institutional header */}
      <Header />

      {/* Page Content Container */}
      <main className="flex-1">
        {renderRoute()}
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
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
