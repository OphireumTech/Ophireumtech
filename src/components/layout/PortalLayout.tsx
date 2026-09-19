/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Dedicated Protected Client Portal Layout
 * Sections 1, 2, 4, 34: Completely isolated from PublicLayout.
 * Public header and footer are absent. Features compact PortalHeader,
 * collapsible PortalSidebar, main content area, minimal legal disclaimer,
 * and contextual floating Ask Ophireum assistant.
 */

import React, { useState } from 'react';
import { PortalHeader } from './PortalHeader';
import { PortalSidebar } from './PortalSidebar';
import { GlobalAskOphireum } from '../customer/GlobalAskOphireum';
import { DemoControlCenter } from '../demo/DemoControlCenter';
import { Sparkles } from 'lucide-react';

interface PortalLayoutProps {
  activeTab: string;
  onSelectTab: (tabKey: string) => void;
  pageTitle?: string;
  children: React.ReactNode;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({
  activeTab,
  onSelectTab,
  pageTitle,
  children
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07090E] text-zinc-100 flex flex-col selection:bg-[#C9A227]/30 selection:text-[#E4C765]">
      {/* 1. Compact Authenticated Header (No public header!) */}
      <PortalHeader
        pageTitle={pageTitle}
        onOpenMobileMenu={() => setMobileSidebarOpen(true)}
        onOpenDemoControls={() => setDemoModalOpen(true)}
        onOpenAssistant={() => setAssistantOpen(true)}
      />

      {/* 2. Main Portal Body: Sidebar + Dynamic Workspace Content */}
      <div className="flex-1 flex w-full">
        {/* Collapsible Rebuilt Portal Sidebar */}
        <PortalSidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Content Region */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col justify-between">
          <div className="space-y-6">
            {children}
          </div>

          {/* 3. Minimal Discreet Legal Footer (No public navigation!) */}
          <footer className="mt-12 pt-6 border-t border-[#161C2A] text-center text-[11px] text-zinc-400 space-y-1 select-none">
            <div>
              © {new Date().getFullYear()} OPHIREUM LLC. Automated execution technology for MetaTrader 5.
            </div>
            <div className="text-zinc-400 max-w-2xl mx-auto">
              Trading spot gold (XAUUSD) involves substantial risk of capital loss. Past algorithmic performance does not guarantee future results.
            </div>
          </footer>
        </main>
      </div>

      {/* 4. Global Floating "Ask Ophireum" Button (Section 26) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setAssistantOpen(true)}
          className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#C9A227] to-[#E4C765] hover:brightness-110 text-black font-bold text-xs flex items-center gap-2 shadow-2xl shadow-[#C9A227]/25 cursor-pointer transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4 fill-black" />
          <span>Ask Ophireum</span>
        </button>
      </div>

      {/* 5. Global Contextual Assistant Slide-Out Panel */}
      <GlobalAskOphireum
        currentTab={activeTab}
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />

      {/* 6. Demo Control Center Modal (Accessible via Header, Profile, or Demo badge) */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0D1017] border border-[#232B3D] shadow-2xl p-6 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#1E2538] pb-3 mb-4">
              <span className="text-xs font-bold text-[#E4C765] font-mono">DEMONSTRATION SIMULATOR CONTROLS</span>
              <button
                type="button"
                onClick={() => setDemoModalOpen(false)}
                className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded-lg bg-[#141824] cursor-pointer"
              >
                Close [✕]
              </button>
            </div>
            <DemoControlCenter onClose={() => setDemoModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
