/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Header & Navigation
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Shield,
  Layers,
  Cpu,
  ChevronDown,
  Bell,
  User,
  Terminal,
  Server,
  AlertTriangle,
  FileText,
  LifeBuoy,
  LogOut,
  LogIn,
  Key,
  Menu,
  X,
  ExternalLink,
  Sliders,
  DollarSign
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    currentRole,
    currentRoute,
    setCurrentRoute,
    switchRole,
    logout,
    notifications,
    markNotificationRead,
    settings
  } = useApp();

  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read && (n.userId === currentUser.uid || n.userId === 'ALL')).length;

  const roles: { key: UserRole; label: string; badgeColor: string }[] = [
    { key: 'visitor', label: 'Visitor (Public)', badgeColor: 'bg-zinc-700 text-zinc-200' },
    { key: 'customer', label: 'Customer (Trader)', badgeColor: 'bg-[#C9A227]/20 text-[#E4C765] border border-[#C9A227]/40' },
    { key: 'support_agent', label: 'Support Agent', badgeColor: 'bg-blue-900/40 text-blue-300 border border-blue-700/50' },
    { key: 'finance_reviewer', label: 'Finance Reviewer', badgeColor: 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50' },
    { key: 'license_admin', label: 'Licence Admin', badgeColor: 'bg-amber-900/40 text-amber-300 border border-amber-700/50' },
    { key: 'super_admin', label: 'Super Admin', badgeColor: 'bg-rose-900/40 text-rose-300 border border-rose-700/50' }
  ];

  const handleNav = (route: string) => {
    setCurrentRoute(route);
    setProductMenuOpen(false);
    setCompanyMenuOpen(false);
    setHelpMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#08090B]/90 backdrop-blur-md border-b border-[#232733]/80">
      {/* Global Emergency Banner if active */}
      {settings.globalEmergencyStop && (
        <div className="bg-rose-950/90 border-b border-rose-600/80 px-4 py-2 text-xs font-semibold text-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>CRITICAL NOTICE: Global Emergency Stop Active. All MT5 EA executions are temporarily suspended. Reason: {settings.globalStopReason || 'Administrative Precaution'}</span>
          </div>
        </div>
      )}

      {/* Top Utility Bar with Environment Context & Role Switcher */}
      <div className="bg-[#0B0D12] border-b border-[#1A1D26] px-4 py-1.5 text-xs text-[#9CA3AF]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#E4C765] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              XAUUSD / Gold Engine v2.4.1
            </span>
            <span className="hidden md:inline text-zinc-600">|</span>
            <span className="hidden md:inline text-zinc-400">Strict MT5 Account-Bound Execution</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Link to EA Simulation Test Bench */}
            <button
              id="header-btn-ea-simulator"
              onClick={() => handleNav('ea-simulator')}
              className="px-2 py-0.5 rounded bg-[#101827] hover:bg-[#1A2234] border border-[#C9A227]/40 text-[#E4C765] flex items-center gap-1 transition-all cursor-pointer text-[11px]"
              title="Test EA Validation API, Signature, Nonce & Heartbeat in real time"
            >
              <Terminal className="w-3 h-3 text-[#C9A227]" />
              <span>EA API Studio</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                id="header-btn-role-switcher"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#161922] hover:bg-[#1F2430] border border-[#2A3040] text-zinc-200 transition-colors cursor-pointer"
              >
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Role:</span>
                <span className="font-semibold text-[#E4C765] capitalize">
                  {currentRole.replace('_', ' ')}
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-[#111318] border border-[#2A3040] rounded-lg shadow-2xl p-2 z-50">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 px-2 py-1 mb-1 border-b border-zinc-800">
                    Switch Test Persona
                  </div>
                  <div className="space-y-1">
                    {roles.map(r => (
                      <button
                        key={r.key}
                        onClick={() => {
                          switchRole(r.key);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                          currentRole === r.key
                            ? 'bg-[#C9A227]/15 text-[#E4C765] font-semibold'
                            : 'text-zinc-300 hover:bg-zinc-800/60'
                        }`}
                      >
                        <span>{r.label}</span>
                        {currentRole === r.key && <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]"></span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav('home')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
          id="header-brand-logo"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E4C765] via-[#C9A227] to-[#8C6F14] p-0.5 shadow-lg shadow-[#C9A227]/10 flex items-center justify-center">
            <div className="w-full h-full bg-[#08090B] rounded-[7px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#E4C765] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-lg tracking-wider text-[#FFFFFF] flex items-center gap-1.5">
              OPHIREUM
              <span className="text-[10px] tracking-normal font-sans font-semibold px-1.5 py-0.2 rounded bg-[#C9A227]/20 text-[#E4C765] border border-[#C9A227]/30">
                EXPERT ASSISTANT
              </span>
            </div>
            <div className="text-[10px] tracking-widest uppercase text-[#9CA3AF]">
              Discipline in Every Execution.
            </div>
          </div>
        </div>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#F7F3E8]">
          <button 
            onClick={() => handleNav('home')}
            className={`transition-colors hover:text-[#E4C765] cursor-pointer ${currentRoute === 'home' ? 'text-[#E4C765] font-semibold' : ''}`}
          >
            Home
          </button>

          {/* Product Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProductMenuOpen(!productMenuOpen)}
              onMouseEnter={() => setProductMenuOpen(true)}
              className="flex items-center gap-1 hover:text-[#E4C765] transition-colors cursor-pointer py-2"
            >
              <span>Product</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {productMenuOpen && (
              <div 
                onMouseLeave={() => setProductMenuOpen(false)}
                className="absolute top-full left-0 w-72 bg-[#111318] border border-[#232733] rounded-xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-1"
              >
                <button
                  onClick={() => handleNav('product-ea')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] transition-colors flex items-start gap-3"
                >
                  <Cpu className="w-5 h-5 text-[#E4C765] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-zinc-100 text-xs">OPHIREUM Expert Assistant</div>
                    <div className="text-[11px] text-zinc-400">Automated XAUUSD order execution rules</div>
                  </div>
                </button>
                <button
                  onClick={() => handleNav('mt5-integration')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] transition-colors flex items-start gap-3"
                >
                  <Terminal className="w-5 h-5 text-[#E4C765] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-zinc-100 text-xs">MT5 Integration</div>
                    <div className="text-[11px] text-zinc-400">WebRequest & terminal terminal bindings</div>
                  </div>
                </button>
                <button
                  onClick={() => handleNav('licensing-info')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] transition-colors flex items-start gap-3"
                >
                  <Key className="w-5 h-5 text-[#E4C765] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-zinc-100 text-xs">Account-Bound Licensing</div>
                    <div className="text-[11px] text-zinc-400">Protected migration & nonce verification</div>
                  </div>
                </button>
                <button
                  onClick={() => handleNav('vps-ops')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] transition-colors flex items-start gap-3"
                >
                  <Server className="w-5 h-5 text-[#E4C765] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-zinc-100 text-xs">VPS Operations</div>
                    <div className="text-[11px] text-zinc-400">Ultra-low latency institutional hosting</div>
                  </div>
                </button>
                <button
                  onClick={() => handleNav('risk-controls')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] transition-colors flex items-start gap-3"
                >
                  <Sliders className="w-5 h-5 text-[#E4C765] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-zinc-100 text-xs">Risk & Operational Controls</div>
                    <div className="text-[11px] text-zinc-400">Mandatory SL, lot and exposure limits</div>
                  </div>
                </button>
                <button
                  onClick={() => handleNav('security')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] transition-colors flex items-start gap-3"
                >
                  <Shield className="w-5 h-5 text-[#E4C765] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-zinc-100 text-xs">Platform Security</div>
                    <div className="text-[11px] text-zinc-400">Cloud Run, App Check, Audit telemetry</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => handleNav('how-it-works')}
            className={`transition-colors hover:text-[#E4C765] cursor-pointer ${currentRoute === 'how-it-works' ? 'text-[#E4C765] font-semibold' : ''}`}
          >
            How It Works
          </button>

          <button 
            onClick={() => handleNav('pricing')}
            className={`transition-colors hover:text-[#E4C765] cursor-pointer ${currentRoute === 'pricing' ? 'text-[#E4C765] font-semibold' : ''}`}
          >
            Pricing
          </button>

          {/* Company Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCompanyMenuOpen(!companyMenuOpen)}
              onMouseEnter={() => setCompanyMenuOpen(true)}
              className="flex items-center gap-1 hover:text-[#E4C765] transition-colors cursor-pointer py-2"
            >
              <span>Company</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {companyMenuOpen && (
              <div 
                onMouseLeave={() => setCompanyMenuOpen(false)}
                className="absolute top-full left-0 w-60 bg-[#111318] border border-[#232733] rounded-xl shadow-2xl p-2 z-50 space-y-1"
              >
                <button
                  onClick={() => handleNav('about')}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#1A1D26] text-xs font-medium text-zinc-200"
                >
                  About OPHIREUM
                </button>
                <button
                  onClick={() => handleNav('vision-mission')}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#1A1D26] text-xs font-medium text-zinc-200"
                >
                  Vision and Mission
                </button>
                <button
                  onClick={() => handleNav('core-values')}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#1A1D26] text-xs font-medium text-zinc-200"
                >
                  Core Values
                </button>
                <button
                  onClick={() => handleNav('responsible-tech')}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#1A1D26] text-xs font-medium text-zinc-200"
                >
                  Responsible Technology
                </button>
                <button
                  onClick={() => handleNav('contact')}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#1A1D26] text-xs font-medium text-zinc-200"
                >
                  Contact Us
                </button>
              </div>
            )}
          </div>

          {/* Help Dropdown */}
          <div className="relative">
            <button
              onClick={() => setHelpMenuOpen(!helpMenuOpen)}
              onMouseEnter={() => setHelpMenuOpen(true)}
              className="flex items-center gap-1 hover:text-[#E4C765] transition-colors cursor-pointer py-2"
            >
              <span>Help</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {helpMenuOpen && (
              <div 
                onMouseLeave={() => setHelpMenuOpen(false)}
                className="absolute top-full left-0 w-64 bg-[#111318] border border-[#232733] rounded-xl shadow-2xl p-2 z-50 space-y-1"
              >
                <button
                  onClick={() => handleNav('help-center')}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#1A1D26] text-xs font-medium text-zinc-200"
                >
                  Help Center
                </button>
                <button
                  onClick={() => handleNav('install-guide')}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#1A1D26] text-xs font-medium text-zinc-200"
                >
                  Installation Guide
                </button>
                <button
                  onClick={() => handleNav('mt5-setup')}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#1A1D26] text-xs font-medium text-zinc-200"
                >
                  MT5 WebRequest Setup
                </button>
                <button
                  onClick={() => handleNav('faq')}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#1A1D26] text-xs font-medium text-zinc-200"
                >
                  Frequently Asked Questions
                </button>
                <button
                  onClick={() => handleNav('contact')}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#1A1D26] text-xs font-medium text-zinc-200"
                >
                  Submit a Support Ticket
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right CTA / Portal Switcher */}
        <div className="flex items-center gap-3">
          {/* Notifications Button */}
          <div className="relative">
            <button
              id="header-btn-notifications"
              onClick={() => setNotifDrawerOpen(!notifDrawerOpen)}
              className="p-2 rounded-lg bg-[#111318] hover:bg-[#1A1D26] border border-[#232733] text-zinc-300 hover:text-[#E4C765] transition-colors relative cursor-pointer"
              title="System Alerts & Notices"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A227] text-[#08090B] font-bold text-[10px] rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {notifDrawerOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#111318] border border-[#232733] rounded-xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs">
                  <span className="font-semibold text-zinc-200">System Notifications</span>
                  <span className="text-[11px] text-[#C9A227]">{unreadCount} Unread</span>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2 py-2">
                  {notifications.length === 0 ? (
                    <div className="text-center text-xs text-zinc-500 py-4">No active notices</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                          n.read ? 'bg-zinc-900/40 text-zinc-400' : 'bg-[#181C26] text-zinc-200 border border-[#C9A227]/20'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold mb-1">
                          <span className="text-[#E4C765]">{n.title}</span>
                          <span className="text-[10px] text-zinc-500">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-300">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Portals depending on role */}
          {currentRole === 'visitor' ? (
            <div className="flex items-center gap-2">
              <button
                id="header-btn-login"
                onClick={() => handleNav('login')}
                className="px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:text-white transition-colors cursor-pointer"
              >
                Log In
              </button>
              <button
                id="header-btn-register"
                onClick={() => handleNav('register')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-xs shadow-md shadow-[#C9A227]/20 hover:brightness-110 transition-all cursor-pointer"
              >
                Get Started
              </button>
            </div>
          ) : currentRole === 'customer' ? (
            <div className="flex items-center gap-2">
              <button
                id="header-btn-dashboard"
                onClick={() => handleNav('dashboard')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-xs shadow-md shadow-[#C9A227]/20 hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Customer Portal</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="header-btn-admin-portal"
                onClick={() => handleNav('admin-overview')}
                className="px-4 py-2 rounded-lg bg-red-950/60 border border-red-600/70 text-red-200 font-bold text-xs hover:bg-red-900/60 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-red-400" />
                <span>Admin Portal</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#111318] text-zinc-300 border border-[#232733]"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D0F14] border-b border-[#232733] px-4 py-4 space-y-3 animate-in fade-in">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button onClick={() => handleNav('home')} className="p-2 text-left bg-zinc-900 rounded font-medium">Home</button>
            <button onClick={() => handleNav('pricing')} className="p-2 text-left bg-zinc-900 rounded font-medium">Pricing Plans</button>
            <button onClick={() => handleNav('product-ea')} className="p-2 text-left bg-zinc-900 rounded font-medium">OPHIREUM EA</button>
            <button onClick={() => handleNav('mt5-integration')} className="p-2 text-left bg-zinc-900 rounded font-medium">MT5 Integration</button>
            <button onClick={() => handleNav('how-it-works')} className="p-2 text-left bg-zinc-900 rounded font-medium">How It Works</button>
            <button onClick={() => handleNav('vps-ops')} className="p-2 text-left bg-zinc-900 rounded font-medium">VPS Operations</button>
            <button onClick={() => handleNav('help-center')} className="p-2 text-left bg-zinc-900 rounded font-medium">Help Center</button>
            <button onClick={() => handleNav('contact')} className="p-2 text-left bg-zinc-900 rounded font-medium">Contact</button>
          </div>

          {currentRole !== 'visitor' ? (
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400">{currentUser.fullName} ({currentRole})</span>
              <button onClick={logout} className="text-xs text-rose-400 flex items-center gap-1 font-medium">
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-zinc-800 flex gap-2">
              <button onClick={() => handleNav('login')} className="flex-1 py-2 rounded bg-zinc-900 text-xs font-semibold">Log In</button>
              <button onClick={() => handleNav('register')} className="flex-1 py-2 rounded bg-[#C9A227] text-black text-xs font-bold">Register</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
