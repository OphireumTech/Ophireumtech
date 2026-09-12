/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Header & Navigation
 * Institutional Navigation Architecture with Single-Active Dropdown,
 * Reliable Hover Delay, Full Keyboard & Pointer Support, and
 * Fail-Safe Scroll Restoration.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  Shield,
  Layers,
  Cpu,
  ChevronDown,
  ChevronRight,
  Bell,
  Terminal,
  Server,
  AlertTriangle,
  FileText,
  LifeBuoy,
  LogOut,
  Key,
  Menu,
  X,
  Sliders,
  DollarSign,
  HelpCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

type ActiveMenu = 'product' | 'company' | 'help' | null;

export const Header: React.FC = () => {
  const {
    currentUser,
    currentRole,
    currentRoute,
    setCurrentRoute,
    logout,
    notifications,
    markNotificationRead,
    settings
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  // Single authoritative active dropdown state for desktop
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<'product' | 'company' | 'help' | null>(null);

  // Close delay timer ref (160ms window to smoothly cross gap between trigger & panel)
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // DOM Refs for focus management and outside click detection
  const navContainerRef = useRef<HTMLDivElement>(null);
  const notifContainerRef = useRef<HTMLDivElement>(null);
  const productTriggerRef = useRef<HTMLButtonElement>(null);
  const companyTriggerRef = useRef<HTMLButtonElement>(null);
  const helpTriggerRef = useRef<HTMLButtonElement>(null);
  const productMenuRef = useRef<HTMLDivElement>(null);
  const companyMenuRef = useRef<HTMLDivElement>(null);
  const helpMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(
    n => !n.read && (n.userId === currentUser.uid || n.userId === 'ALL')
  ).length;

  // Nav helper with guaranteed menu cleanup
  const handleNav = (route: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveMenu(null);
    setNotifDrawerOpen(false);
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
    setCurrentRoute(route);
    const path = route.startsWith('/') ? route : `/${route}`;
    navigate(path);
  };

  // Hover handlers with debounce timer
  const handleMenuMouseEnter = (menuKey: ActiveMenu) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveMenu(menuKey);
  };

  const handleMenuMouseLeave = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 160);
  };

  const handleTriggerClick = (menuKey: 'product' | 'company' | 'help') => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveMenu(prev => (prev === menuKey ? null : menuKey));
  };

  const handleTriggerKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    menuKey: 'product' | 'company' | 'help'
  ) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setActiveMenu(menuKey);
      setTimeout(() => {
        const menuRef =
          menuKey === 'product'
            ? productMenuRef
            : menuKey === 'company'
            ? companyMenuRef
            : helpMenuRef;
        const firstItem = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
        firstItem?.focus();
      }, 50);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setActiveMenu(null);
    }
  };

  const handleDropdownKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      const trigger =
        activeMenu === 'product'
          ? productTriggerRef.current
          : activeMenu === 'company'
          ? companyTriggerRef.current
          : helpTriggerRef.current;
      setActiveMenu(null);
      trigger?.focus();
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = Array.from(
        e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]')
      );
      if (!items.length) return;
      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      let nextIndex = 0;
      if (e.key === 'ArrowDown') {
        nextIndex = currentIndex >= 0 && currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      }
      items[nextIndex]?.focus();
    }
  };

  // Outside click & global Escape handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (navContainerRef.current && !navContainerRef.current.contains(target)) {
        setActiveMenu(null);
      }
      if (notifContainerRef.current && !notifContainerRef.current.contains(target)) {
        setNotifDrawerOpen(false);
      }
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeMenu) {
          const trigger =
            activeMenu === 'product'
              ? productTriggerRef.current
              : activeMenu === 'company'
              ? companyTriggerRef.current
              : helpTriggerRef.current;
          setActiveMenu(null);
          trigger?.focus();
        }
        if (notifDrawerOpen) setNotifDrawerOpen(false);
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          document.body.style.overflow = '';
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleGlobalKeyDown);
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, [activeMenu, notifDrawerOpen, mobileMenuOpen]);

  // Route change resets everything and ensures body scroll is never locked
  useEffect(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveMenu(null);
    setNotifDrawerOpen(false);
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  }, [currentRoute, location.pathname]);

  // Mobile drawer scroll lock with robust fail-safe cleanup
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Viewport resize handler: close mobile menu & restore scroll if resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          document.body.style.overflow = '';
        }
      } else {
        if (activeMenu) {
          setActiveMenu(null);
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen, activeMenu]);

  return (
    <header className="sticky top-0 z-30 bg-[#08090B]/95 backdrop-blur-md border-b border-[#232733]/80 select-none">
      {/* Global Emergency Banner if active */}
      {settings.globalEmergencyStop && (
        <div className="bg-rose-950/90 border-b border-rose-600/80 px-4 py-2 text-xs font-semibold text-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              CRITICAL NOTICE: Global Emergency Stop Active. All MT5 EA executions are temporarily suspended. Reason:{' '}
              {settings.globalStopReason || 'Administrative Precaution'}
            </span>
          </div>
        </div>
      )}

      {/* Top Utility Bar with Environment Context & Role Switcher */}
      <div className="bg-[#0B0D12] border-b border-[#1A1D26] px-4 py-1.5 text-xs text-[#9CA3AF]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#E4C765] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              XAUUSD / Gold Engine v2.4.1
            </span>
            <span className="hidden md:inline text-zinc-600">|</span>
            <span className="hidden md:inline text-zinc-400">Strict MT5 Account-Bound Execution</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Link to EA Simulation Test Bench */}
            <button
              id="header-btn-ea-simulator"
              type="button"
              onClick={() => handleNav('ea-simulator')}
              className="px-2 py-0.5 rounded bg-[#101827] hover:bg-[#1A2234] border border-[#C9A227]/40 text-[#E4C765] flex items-center gap-1 transition-all cursor-pointer text-[11px]"
              title="Test EA Validation API, Signature, Nonce & Heartbeat in real time"
            >
              <Terminal className="w-3 h-3 text-[#C9A227]" />
              <span>EA API Studio</span>
            </button>

            {/* Authenticated Status Badge */}
            {currentUser?.uid && currentRole !== 'visitor' ? (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#161922] border border-[#2A3040] text-zinc-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Role:</span>
                <span className="font-semibold text-[#E4C765] capitalize text-[11px]">
                  {currentRole.replace('_', ' ')}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#161922]/60 border border-[#2A3040]/50 text-zinc-400 text-[11px]">
                <span>Public Access</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div id="header-brand-logo" className="flex-shrink-0">
          <BrandLogo
            size="md"
            iconOnlyOnMobile={true}
            to="/home"
            onClick={() => handleNav('home')}
          />
        </div>

        {/* Desktop Links with Single Authoritative Dropdown State */}
        <nav
          ref={navContainerRef}
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#F7F3E8]"
        >
          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`transition-colors hover:text-[#E4C765] cursor-pointer py-2 ${
              currentRoute === 'home' || location.pathname === '/' ? 'text-[#E4C765] font-semibold' : ''
            }`}
          >
            Home
          </button>

          {/* 1. PRODUCT MENU */}
          <div
            className="relative"
            onMouseEnter={() => handleMenuMouseEnter('product')}
            onMouseLeave={handleMenuMouseLeave}
          >
            <button
              ref={productTriggerRef}
              type="button"
              id="nav-trigger-product"
              aria-haspopup="menu"
              aria-expanded={activeMenu === 'product'}
              aria-controls="nav-dropdown-product"
              onClick={() => handleTriggerClick('product')}
              onKeyDown={(e) => handleTriggerKeyDown(e, 'product')}
              className={`flex items-center gap-1 hover:text-[#E4C765] transition-colors cursor-pointer py-2 ${
                activeMenu === 'product' ? 'text-[#E4C765]' : ''
              }`}
            >
              <span>Product</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-150 ${
                  activeMenu === 'product' ? 'rotate-180 text-[#E4C765]' : ''
                }`}
              />
            </button>

            {activeMenu === 'product' && (
              <div
                ref={productMenuRef}
                id="nav-dropdown-product"
                role="menu"
                aria-labelledby="nav-trigger-product"
                onMouseEnter={() => handleMenuMouseEnter('product')}
                onMouseLeave={handleMenuMouseLeave}
                onKeyDown={handleDropdownKeyDown}
                className="absolute top-full left-0 mt-1.5 w-72 max-w-[calc(100vw-32px)] bg-[#111318] border border-[#232733] rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.85),0_0_20px_rgba(201,162,39,0.12)] p-2 z-40 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => handleNav('product-ea')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] focus:bg-[#1A1D26] focus:outline-none transition-colors flex items-start gap-3 cursor-pointer group"
                >
                  <Cpu className="w-5 h-5 text-[#E4C765] shrink-0 mt-0.5 group-hover:scale-105 transition-transform" />
                  <div>
                    <div className="font-medium text-zinc-100 text-xs group-hover:text-white">
                      OPHIREUM Expert Assistant
                    </div>
                    <div className="text-[11px] text-zinc-400">Automated XAUUSD order execution rules</div>
                  </div>
                </button>

                <button
                  role="menuitem"
                  type="button"
                  onClick={() => handleNav('mt5-integration')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] focus:bg-[#1A1D26] focus:outline-none transition-colors flex items-start gap-3 cursor-pointer group"
                >
                  <Terminal className="w-5 h-5 text-[#E4C765] shrink-0 mt-0.5 group-hover:scale-105 transition-transform" />
                  <div>
                    <div className="font-medium text-zinc-100 text-xs group-hover:text-white">
                      MT5 Integration
                    </div>
                    <div className="text-[11px] text-zinc-400">WebRequest & terminal bindings</div>
                  </div>
                </button>

                <button
                  role="menuitem"
                  type="button"
                  onClick={() => handleNav('licensing-info')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] focus:bg-[#1A1D26] focus:outline-none transition-colors flex items-start gap-3 cursor-pointer group"
                >
                  <Key className="w-5 h-5 text-[#E4C765] shrink-0 mt-0.5 group-hover:scale-105 transition-transform" />
                  <div>
                    <div className="font-medium text-zinc-100 text-xs group-hover:text-white">
                      Account-Bound Licensing
                    </div>
                    <div className="text-[11px] text-zinc-400">Protected migration & nonce verification</div>
                  </div>
                </button>

                <button
                  role="menuitem"
                  type="button"
                  onClick={() => handleNav('vps-ops')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] focus:bg-[#1A1D26] focus:outline-none transition-colors flex items-start gap-3 cursor-pointer group"
                >
                  <Server className="w-5 h-5 text-[#E4C765] shrink-0 mt-0.5 group-hover:scale-105 transition-transform" />
                  <div>
                    <div className="font-medium text-zinc-100 text-xs group-hover:text-white">
                      VPS Operations
                    </div>
                    <div className="text-[11px] text-zinc-400">Ultra-low latency institutional hosting</div>
                  </div>
                </button>

                <button
                  role="menuitem"
                  type="button"
                  onClick={() => handleNav('risk-controls')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] focus:bg-[#1A1D26] focus:outline-none transition-colors flex items-start gap-3 cursor-pointer group"
                >
                  <Sliders className="w-5 h-5 text-[#E4C765] shrink-0 mt-0.5 group-hover:scale-105 transition-transform" />
                  <div>
                    <div className="font-medium text-zinc-100 text-xs group-hover:text-white">
                      Risk & Operational Controls
                    </div>
                    <div className="text-[11px] text-zinc-400">Mandatory SL, lot & exposure limits</div>
                  </div>
                </button>

                <button
                  role="menuitem"
                  type="button"
                  onClick={() => handleNav('security')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] focus:bg-[#1A1D26] focus:outline-none transition-colors flex items-start gap-3 cursor-pointer group"
                >
                  <Shield className="w-5 h-5 text-[#E4C765] shrink-0 mt-0.5 group-hover:scale-105 transition-transform" />
                  <div>
                    <div className="font-medium text-zinc-100 text-xs group-hover:text-white">
                      Platform Security
                    </div>
                    <div className="text-[11px] text-zinc-400">Cloud Run, App Check & Audit telemetry</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleNav('how-it-works')}
            className={`transition-colors hover:text-[#E4C765] cursor-pointer py-2 ${
              currentRoute === 'how-it-works' ? 'text-[#E4C765] font-semibold' : ''
            }`}
          >
            How It Works
          </button>

          <button
            type="button"
            onClick={() => handleNav('pricing')}
            className={`transition-colors hover:text-[#E4C765] cursor-pointer py-2 ${
              currentRoute === 'pricing' ? 'text-[#E4C765] font-semibold' : ''
            }`}
          >
            Pricing
          </button>

          {/* 2. COMPANY MENU */}
          <div
            className="relative"
            onMouseEnter={() => handleMenuMouseEnter('company')}
            onMouseLeave={handleMenuMouseLeave}
          >
            <button
              ref={companyTriggerRef}
              type="button"
              id="nav-trigger-company"
              aria-haspopup="menu"
              aria-expanded={activeMenu === 'company'}
              aria-controls="nav-dropdown-company"
              onClick={() => handleTriggerClick('company')}
              onKeyDown={(e) => handleTriggerKeyDown(e, 'company')}
              className={`flex items-center gap-1 hover:text-[#E4C765] transition-colors cursor-pointer py-2 ${
                activeMenu === 'company' ? 'text-[#E4C765]' : ''
              }`}
            >
              <span>Company</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-150 ${
                  activeMenu === 'company' ? 'rotate-180 text-[#E4C765]' : ''
                }`}
              />
            </button>

            {activeMenu === 'company' && (
              <div
                ref={companyMenuRef}
                id="nav-dropdown-company"
                role="menu"
                aria-labelledby="nav-trigger-company"
                onMouseEnter={() => handleMenuMouseEnter('company')}
                onMouseLeave={handleMenuMouseLeave}
                onKeyDown={handleDropdownKeyDown}
                className="absolute top-full left-0 mt-1.5 w-60 max-w-[calc(100vw-32px)] bg-[#111318] border border-[#232733] rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.85),0_0_20px_rgba(201,162,39,0.12)] p-2 z-40 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => handleNav('about')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] focus:bg-[#1A1D26] focus:outline-none text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
                >
                  About OPHIREUM
                </button>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => handleNav('vision-mission')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] focus:bg-[#1A1D26] focus:outline-none text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
                >
                  Vision and Mission
                </button>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => handleNav('core-values')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] focus:bg-[#1A1D26] focus:outline-none text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
                >
                  Core Values
                </button>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => handleNav('responsible-tech')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] focus:bg-[#1A1D26] focus:outline-none text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
                >
                  Responsible Technology
                </button>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => handleNav('contact')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] focus:bg-[#1A1D26] focus:outline-none text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </div>
            )}
          </div>

          {/* 3. HELP MENU (Right-aligned to avoid viewport right overflow) */}
          <div
            className="relative"
            onMouseEnter={() => handleMenuMouseEnter('help')}
            onMouseLeave={handleMenuMouseLeave}
          >
            <button
              ref={helpTriggerRef}
              type="button"
              id="nav-trigger-help"
              aria-haspopup="menu"
              aria-expanded={activeMenu === 'help'}
              aria-controls="nav-dropdown-help"
              onClick={() => handleTriggerClick('help')}
              onKeyDown={(e) => handleTriggerKeyDown(e, 'help')}
              className={`flex items-center gap-1 hover:text-[#E4C765] transition-colors cursor-pointer py-2 ${
                activeMenu === 'help' ? 'text-[#E4C765]' : ''
              }`}
            >
              <span>Help</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-150 ${
                  activeMenu === 'help' ? 'rotate-180 text-[#E4C765]' : ''
                }`}
              />
            </button>

            {activeMenu === 'help' && (
              <div
                ref={helpMenuRef}
                id="nav-dropdown-help"
                role="menu"
                aria-labelledby="nav-trigger-help"
                onMouseEnter={() => handleMenuMouseEnter('help')}
                onMouseLeave={handleMenuMouseLeave}
                onKeyDown={handleDropdownKeyDown}
                className="absolute top-full sm:right-0 sm:left-auto left-0 mt-1.5 w-64 max-w-[calc(100vw-32px)] bg-[#111318] border border-[#232733] rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.85),0_0_20px_rgba(201,162,39,0.12)] p-2 z-40 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => handleNav('help-center')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] focus:bg-[#1A1D26] focus:outline-none text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
                >
                  Help Center
                </button>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => handleNav('install-guide')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] focus:bg-[#1A1D26] focus:outline-none text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
                >
                  Installation Guide
                </button>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => handleNav('mt5-setup')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] focus:bg-[#1A1D26] focus:outline-none text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
                >
                  MT5 WebRequest Setup
                </button>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => handleNav('faq')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] focus:bg-[#1A1D26] focus:outline-none text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => handleNav('contact')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-[#1A1D26] focus:bg-[#1A1D26] focus:outline-none text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
                >
                  Submit a Support Ticket
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right CTA / Notification Drawer / Portal Switcher */}
        <div className="flex items-center gap-3">
          {/* Notifications Button & Drawer */}
          <div ref={notifContainerRef} className="relative">
            <button
              id="header-btn-notifications"
              type="button"
              onClick={() => {
                setActiveMenu(null);
                setNotifDrawerOpen(prev => !prev);
              }}
              aria-label="System Alerts & Notices"
              aria-expanded={notifDrawerOpen}
              className="p-2 rounded-lg bg-[#111318] hover:bg-[#1A1D26] border border-[#232733] text-zinc-300 hover:text-[#E4C765] transition-colors relative cursor-pointer"
              title="System Alerts & Notices"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A227] text-[#08090B] font-bold text-[10px] rounded-full flex items-center justify-center shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {notifDrawerOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-32px)] bg-[#111318] border border-[#232733] rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.85)] p-3 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
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
                          n.read
                            ? 'bg-zinc-900/40 text-zinc-400'
                            : 'bg-[#181C26] text-zinc-200 border border-[#C9A227]/20'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold mb-1">
                          <span className="text-[#E4C765]">{n.title}</span>
                          <span className="text-[10px] text-zinc-500">
                            {new Date(n.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
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
            <div className="hidden sm:flex items-center gap-2">
              <button
                id="header-btn-login"
                type="button"
                onClick={() => handleNav('login')}
                className="px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:text-white transition-colors cursor-pointer"
              >
                Log In
              </button>
              <button
                id="header-btn-register"
                type="button"
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
                type="button"
                onClick={() => handleNav('dashboard')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-xs shadow-md shadow-[#C9A227]/20 hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Customer Portal</span>
              </button>
              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-lg bg-[#111318] hover:bg-rose-950/40 border border-[#232733] hover:border-rose-800 text-zinc-400 hover:text-rose-300 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="header-btn-staff-portal"
                type="button"
                onClick={() => {
                  if (currentRole === 'super_admin') handleNav('admin');
                  else if (currentRole === 'license_admin') handleNav('license-dashboard');
                  else if (currentRole === 'finance_reviewer') handleNav('finance-dashboard');
                  else if (currentRole === 'support_agent') handleNav('support-dashboard');
                }}
                className="px-4 py-2 rounded-lg bg-[#141824] border border-[#2B354C] text-[#E4C765] font-bold text-xs hover:bg-[#1A2234] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>
                  {currentRole === 'super_admin'
                    ? 'Super Admin'
                    : currentRole === 'license_admin'
                    ? 'Licence Desk'
                    : currentRole === 'finance_reviewer'
                    ? 'Finance Desk'
                    : 'Support Desk'}
                </span>
              </button>
              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-lg bg-[#111318] hover:bg-rose-950/40 border border-[#232733] hover:border-rose-800 text-zinc-400 hover:text-rose-300 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => {
              setActiveMenu(null);
              setNotifDrawerOpen(false);
              setMobileMenuOpen(prev => !prev);
            }}
            className="lg:hidden p-2 rounded-lg bg-[#111318] text-zinc-300 border border-[#232733] hover:text-[#E4C765] cursor-pointer transition-colors"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer with Controlled Accordion */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-label="Mobile Navigation"
          className="lg:hidden fixed inset-x-0 top-[calc(100%)] max-h-[calc(100vh-80px)] overflow-y-auto bg-[#0A0C11] border-b border-[#232733] px-4 py-4 space-y-4 shadow-[0_24px_48px_rgba(0,0,0,0.9)] z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left"
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <BrandLogo size="sm" showText={true} to="/home" onClick={() => handleNav('home')} />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C9A227]/10 text-[#E4C765] border border-[#C9A227]/20">
              v2.4.1 MT5
            </span>
          </div>

          {/* Primary Quick Links */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className="p-2.5 text-left bg-[#11141D] hover:bg-[#181D2A] border border-zinc-800/60 rounded-xl font-medium text-zinc-200 cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNav('pricing')}
              className="p-2.5 text-left bg-[#11141D] hover:bg-[#181D2A] border border-zinc-800/60 rounded-xl font-medium text-zinc-200 cursor-pointer"
            >
              Pricing Plans
            </button>
            <button
              type="button"
              onClick={() => handleNav('how-it-works')}
              className="p-2.5 text-left bg-[#11141D] hover:bg-[#181D2A] border border-zinc-800/60 rounded-xl font-medium text-zinc-200 cursor-pointer"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => handleNav('contact')}
              className="p-2.5 text-left bg-[#11141D] hover:bg-[#181D2A] border border-zinc-800/60 rounded-xl font-medium text-zinc-200 cursor-pointer"
            >
              Contact Us
            </button>
          </div>

          {/* Accordion 1: Product Capabilities */}
          <div className="border border-zinc-800/80 rounded-xl bg-[#0E1118] overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setMobileSection(prev => (prev === 'product' ? null : 'product'))}
              className="w-full p-3 flex items-center justify-between text-zinc-200 font-semibold cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#E4C765]" />
                <span>Product Capabilities</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform ${
                  mobileSection === 'product' ? 'rotate-180 text-[#E4C765]' : ''
                }`}
              />
            </button>

            {mobileSection === 'product' && (
              <div className="px-3 pb-3 space-y-1.5 pt-1 border-t border-zinc-800/60 text-zinc-300">
                <button
                  type="button"
                  onClick={() => handleNav('product-ea')}
                  className="w-full p-2 text-left hover:bg-zinc-800/60 rounded-lg text-[11px] cursor-pointer"
                >
                  OPHIREUM Expert Assistant
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('mt5-integration')}
                  className="w-full p-2 text-left hover:bg-zinc-800/60 rounded-lg text-[11px] cursor-pointer"
                >
                  MetaTrader 5 Integration
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('licensing-info')}
                  className="w-full p-2 text-left hover:bg-zinc-800/60 rounded-lg text-[11px] cursor-pointer"
                >
                  Account-Bound Licensing
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('vps-ops')}
                  className="w-full p-2 text-left hover:bg-zinc-800/60 rounded-lg text-[11px] cursor-pointer"
                >
                  VPS Infrastructure
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('risk-controls')}
                  className="w-full p-2 text-left hover:bg-zinc-800/60 rounded-lg text-[11px] cursor-pointer"
                >
                  Risk & Operational Controls
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('security')}
                  className="w-full p-2 text-left hover:bg-zinc-800/60 rounded-lg text-[11px] cursor-pointer"
                >
                  Platform Security & Telemetry
                </button>
              </div>
            )}
          </div>

          {/* Accordion 2: Company & Governance */}
          <div className="border border-zinc-800/80 rounded-xl bg-[#0E1118] overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setMobileSection(prev => (prev === 'company' ? null : 'company'))}
              className="w-full p-3 flex items-center justify-between text-zinc-200 font-semibold cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#E4C765]" />
                <span>Company & Governance</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform ${
                  mobileSection === 'company' ? 'rotate-180 text-[#E4C765]' : ''
                }`}
              />
            </button>

            {mobileSection === 'company' && (
              <div className="px-3 pb-3 space-y-1.5 pt-1 border-t border-zinc-800/60 text-zinc-300">
                <button
                  type="button"
                  onClick={() => handleNav('about')}
                  className="w-full p-2 text-left hover:bg-zinc-800/60 rounded-lg text-[11px] cursor-pointer"
                >
                  About OPHIREUM
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('vision-mission')}
                  className="w-full p-2 text-left hover:bg-zinc-800/60 rounded-lg text-[11px] cursor-pointer"
                >
                  Vision and Mission
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('core-values')}
                  className="w-full p-2 text-left hover:bg-zinc-800/60 rounded-lg text-[11px] cursor-pointer"
                >
                  Core Values
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('responsible-tech')}
                  className="w-full p-2 text-left hover:bg-zinc-800/60 rounded-lg text-[11px] cursor-pointer"
                >
                  Responsible Technology
                </button>
              </div>
            )}
          </div>

          {/* Accordion 3: Help & Documentation */}
          <div className="border border-zinc-800/80 rounded-xl bg-[#0E1118] overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setMobileSection(prev => (prev === 'help' ? null : 'help'))}
              className="w-full p-3 flex items-center justify-between text-zinc-200 font-semibold cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#E4C765]" />
                <span>Help & Support</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform ${
                  mobileSection === 'help' ? 'rotate-180 text-[#E4C765]' : ''
                }`}
              />
            </button>

            {mobileSection === 'help' && (
              <div className="px-3 pb-3 space-y-1.5 pt-1 border-t border-zinc-800/60 text-zinc-300">
                <button
                  type="button"
                  onClick={() => handleNav('help-center')}
                  className="w-full p-2 text-left hover:bg-zinc-800/60 rounded-lg text-[11px] cursor-pointer"
                >
                  Help Center
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('install-guide')}
                  className="w-full p-2 text-left hover:bg-zinc-800/60 rounded-lg text-[11px] cursor-pointer"
                >
                  Installation Guide
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('mt5-setup')}
                  className="w-full p-2 text-left hover:bg-zinc-800/60 rounded-lg text-[11px] cursor-pointer"
                >
                  MT5 WebRequest Setup
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('faq')}
                  className="w-full p-2 text-left hover:bg-zinc-800/60 rounded-lg text-[11px] cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </div>
            )}
          </div>

          {/* Footer Auth Buttons in Mobile Drawer */}
          {currentRole !== 'visitor' ? (
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                {currentUser?.fullName || 'User'} ({currentRole})
              </span>
              <button
                type="button"
                onClick={logout}
                className="text-xs text-rose-400 flex items-center gap-1 font-medium cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-zinc-800 flex gap-2">
              <button
                type="button"
                onClick={() => handleNav('login')}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 cursor-pointer"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => handleNav('register')}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black text-xs font-bold cursor-pointer"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
