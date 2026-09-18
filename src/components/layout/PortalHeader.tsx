/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Compact Authenticated Portal Header
 * Section 2: Compact, professional institutional header with connection status,
 * notifications, help, subtle demo badge, and profile menu without password exposure.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  Bell,
  HelpCircle,
  LogOut,
  User,
  Shield,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  X,
  Menu,
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface PortalHeaderProps {
  pageTitle?: string;
  onOpenMobileMenu?: () => void;
  onOpenDemoControls?: () => void;
  onOpenAssistant?: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  pageTitle,
  onOpenMobileMenu,
  onOpenDemoControls,
  onOpenAssistant
}) => {
  const {
    currentUser,
    notifications,
    markNotificationRead,
    logout,
    setCurrentRoute,
    isDemoSession
  } = useApp();

  const navigate = useNavigate();
  const isDemo = isDemoSession || currentUser?.email?.includes('demo') || (typeof window !== 'undefined' && sessionStorage.getItem('ophireum_is_demo') === 'true');

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(
    n => !n.read && (n.userId === currentUser?.uid || n.userId === 'ALL')
  ).length;

  // Outside click listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleNav = (tab: string) => {
    setProfileMenuOpen(false);
    navigate(`/dashboard/${tab}`);
  };

  const handleSignOut = async () => {
    setProfileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const userDisplayName = currentUser?.fullName || 'Alexander Vance';
  const userInitials = userDisplayName
    .split(' ')
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#090C12]/95 backdrop-blur-md border-b border-[#1E2538] px-4 sm:px-6 flex items-center justify-between text-zinc-100">
      {/* LEFT: Mobile Menu Button + Brand Logo */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open portal navigation"
            className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#141926] border border-[#1E2538] cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <BrandLogo size="sm" showText={false} />
          <div className="flex flex-col">
            <span className="font-serif text-sm tracking-wider font-bold text-white group-hover:text-[#E4C765] transition-colors">
              OPHIREUM
            </span>
            <span className="text-[10px] tracking-widest text-[#C9A227] uppercase font-sans font-medium">
              Expert Assistant
            </span>
          </div>
        </div>
      </div>

      {/* CENTER: Current Page Title (Optional / Scannable) */}
      {pageTitle && (
        <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400 font-medium">
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-200 font-semibold tracking-wide">{pageTitle}</span>
        </div>
      )}

      {/* RIGHT: Status, Notifications, Help, Subtle Demo Badge, Profile Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Connection Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111624] border border-[#1E2538] text-[11px] text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">Connected</span>
        </div>

        {/* Subtle DEMO Badge (Clickable to open Demo Tools modal) */}
        {isDemo && (
          <button
            type="button"
            onClick={onOpenDemoControls}
            title="Demonstration Environment — Click to manage simulation"
            className="px-2 py-0.5 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 text-[#E4C765] text-[10px] font-mono font-bold tracking-wider hover:bg-[#C9A227]/25 transition-colors cursor-pointer"
          >
            DEMO
          </button>
        )}

        {/* Global Ask Assistant Trigger */}
        {onOpenAssistant && (
          <button
            type="button"
            onClick={onOpenAssistant}
            title="Ask Ophireum Assistant"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#141926] hover:bg-[#1C2336] border border-[#263047] text-[#E4C765] text-xs font-medium transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span className="hidden xl:inline">Ask Ophireum</span>
          </button>
        )}

        {/* Notifications Popover */}
        <div className="relative" ref={notifMenuRef}>
          <button
            type="button"
            onClick={() => setNotifMenuOpen(!notifMenuOpen)}
            aria-label="View notifications"
            className="relative p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#141926] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C9A227]" />
            )}
          </button>

          {notifMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0D1017] border border-[#232A3B] shadow-2xl p-3 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1C2334] px-1">
                <span className="text-xs font-semibold text-zinc-200">Notifications</span>
                <span className="text-[10px] font-mono text-zinc-400">{unreadCount} unread</span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1.5 text-left">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-zinc-500">No new notifications</div>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                        !n.read ? 'bg-[#151B28] text-zinc-100' : 'text-zinc-400 hover:bg-[#121620]'
                      }`}
                    >
                      <div className="font-semibold text-[11px] text-zinc-200">{n.title}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5 line-clamp-2">{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Help Link */}
        <button
          type="button"
          onClick={() => handleNav('support')}
          title="Help & Support"
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#141926] transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            aria-label="User profile menu"
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full bg-[#141926] hover:bg-[#1C2336] border border-[#232A3B] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#C9A227] to-[#E4C765] text-black font-bold text-xs flex items-center justify-center">
              {userInitials}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0D1017] border border-[#232A3B] shadow-2xl p-2 z-50 text-left animate-in fade-in-50 zoom-in-95">
              {/* User Identity Info (Never showing password!) */}
              <div className="px-3 py-2 border-b border-[#1C2334] mb-1">
                <div className="text-xs font-bold text-white truncate">{userDisplayName}</div>
                <div className="text-[11px] text-zinc-400 truncate">{currentUser?.email}</div>
              </div>

              <button
                type="button"
                onClick={() => handleNav('profile')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-[#151B28] flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                onClick={() => handleNav('security')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-[#151B28] flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-zinc-400" />
                <span>Security</span>
              </button>

              {isDemo && onOpenDemoControls && (
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onOpenDemoControls();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#E4C765] hover:bg-[#C9A227]/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Demo Controls</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleNav('support')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-[#151B28] flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                <span>Support</span>
              </button>

              <div className="my-1 border-t border-[#1C2334]" />

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
