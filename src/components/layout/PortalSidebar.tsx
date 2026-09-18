/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Rebuilt Collapsible Client Portal Sidebar
 * Section 5 & 61: Grouped accordion navigation, simplified terminology,
 * collapsed by default except the active section, full mobile support.
 */

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Shield,
  CreditCard,
  Terminal,
  Activity,
  BarChart2,
  TrendingUp,
  Sparkles,
  Cpu,
  Newspaper,
  User,
  FileText,
  Lock,
  LifeBuoy,
  FileCheck,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';

export interface NavItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

interface PortalSidebarProps {
  activeTab: string;
  onSelectTab: (tabKey: string) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const PORTAL_NAV_GROUPS: NavGroup[] = [
  {
    id: 'overview-group',
    title: 'OVERVIEW',
    items: [
      { key: 'overview', label: 'Dashboard', icon: Layers }
    ]
  },
  {
    id: 'get-started-group',
    title: 'GET STARTED',
    items: [
      { key: 'verification', label: 'Identity Verification', icon: Shield },
      { key: 'subscription', label: 'Subscription & Payment', icon: CreditCard },
      { key: 'connect-account', label: 'Connect Trading Account', icon: Terminal }
    ]
  },
  {
    id: 'trading-group',
    title: 'TRADING',
    items: [
      { key: 'trading-monitor', label: 'Trading Monitor', icon: Activity },
      { key: 'charts', label: 'Charts', icon: BarChart2 },
      { key: 'performance', label: 'Performance', icon: TrendingUp }
    ]
  },
  {
    id: 'ophireum-group',
    title: 'OPHIREUM',
    items: [
      { key: 'assistant', label: 'Expert Assistant', icon: Sparkles, badge: 'AI' },
      { key: 'bot-control', label: 'Bot Control', icon: Cpu },
      { key: 'market-intel', label: 'Market Intelligence', icon: Newspaper }
    ]
  },
  {
    id: 'account-group',
    title: 'ACCOUNT',
    items: [
      { key: 'profile', label: 'Profile', icon: User },
      { key: 'billing', label: 'Billing & Licenses', icon: FileText },
      { key: 'security', label: 'Security', icon: Lock }
    ]
  },
  {
    id: 'help-group',
    title: 'HELP',
    items: [
      { key: 'support', label: 'Support', icon: LifeBuoy },
      { key: 'legal', label: 'Risk & Legal', icon: FileCheck }
    ]
  }
];

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  activeTab,
  onSelectTab,
  mobileOpen = false,
  onCloseMobile
}) => {
  // Find which group contains the active tab
  const findActiveGroupId = (tab: string): string => {
    for (const group of PORTAL_NAV_GROUPS) {
      if (group.items.some(item => item.key === tab)) {
        return group.id;
      }
    }
    return 'overview-group';
  };

  // State: expanded groups. Open active group by default, others closed!
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const activeGroup = findActiveGroupId(activeTab);
    return {
      [activeGroup]: true
    };
  });

  // Automatically expand group if active tab changes to another group
  useEffect(() => {
    const activeGroup = findActiveGroupId(activeTab);
    setExpandedGroups(prev => ({
      ...prev,
      [activeGroup]: true
    }));
  }, [activeTab]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleItemClick = (key: string) => {
    onSelectTab(key);
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <aside className="w-64 bg-[#090C12] border-r border-[#1B2130] flex flex-col h-full select-none">
      {/* Mobile Close Button */}
      {mobileOpen && (
        <div className="lg:hidden p-4 border-b border-[#1B2130] flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Client Navigation</span>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#141926] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Navigation Groups List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-2">
        {PORTAL_NAV_GROUPS.map(group => {
          const isOverview = group.id === 'overview-group';
          const isExpanded = expandedGroups[group.id] ?? false;
          const containsActive = group.items.some(item => item.key === activeTab);

          if (isOverview) {
            // Overview rendered as top single button without accordion header
            const item = group.items[0];
            const isActive = activeTab === item.key;
            return (
              <div key={group.id} className="pb-1">
                <button
                  type="button"
                  onClick={() => handleItemClick(item.key)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#C9A227]/15 text-[#E4C765] font-semibold border border-[#C9A227]/30 shadow-sm'
                      : 'text-zinc-300 hover:text-white hover:bg-[#131724]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-[#E4C765]' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              </div>
            );
          }

          return (
            <div key={group.id} className="border-t border-[#161B28] pt-2">
              {/* Group Accordion Header */}
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider text-zinc-400 hover:text-zinc-200 flex items-center justify-between transition-colors cursor-pointer group"
              >
                <span className={containsActive ? 'text-[#E4C765]' : ''}>{group.title}</span>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
                )}
              </button>

              {/* Group Collapsible Submenu */}
              {isExpanded && (
                <div className="mt-1 space-y-0.5 pl-1 animate-in fade-in-50 duration-150">
                  {group.items.map(item => {
                    const isActive = activeTab === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => handleItemClick(item.key)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#C9A227]/15 text-[#E4C765] font-semibold border border-[#C9A227]/30 shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#121622]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#E4C765]' : 'text-zinc-500'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#C9A227]/20 text-[#E4C765] border border-[#C9A227]/30">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Legal / System Status Line */}
      <div className="p-3 border-t border-[#161B28] text-[10px] text-zinc-500 font-mono">
        <div className="flex items-center justify-between">
          <span>MT5 ENGINE</span>
          <span className="text-emerald-400 font-semibold">SYNCHRONIZED</span>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {content}
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
