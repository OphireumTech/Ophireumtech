/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Re-designed Client Dashboard Overview
 * Sections 10, 11, 12, 13, 63: Personalized greeting, 4 status cards, intelligent
 * Action Required panel, 7-step user journey, account overview, and next market event.
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Terminal,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Calendar,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Pause,
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoAccount } from '../../types';

interface DashboardOverviewProps {
  onNavigateTab: (tabKey: string) => void;
  account: DemoAccount;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateTab,
  account
}) => {
  const { currentUser, isDemoSession, addToast } = useApp();

  const [botRunning, setBotRunning] = useState(true);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  // Status computation
  const isIdentityVerified = true; // In demo / active user session
  const isSubscriptionActive = true;
  const isAccountConnected = true;
  const isOphireumRunning = botRunning;

  // Determine if any actions are required
  const allClear = isIdentityVerified && isSubscriptionActive && isAccountConnected && isOphireumRunning;

  const toggleBot = () => {
    const nextState = !botRunning;
    setBotRunning(nextState);
    addToast(
      nextState ? 'Ophireum Monitoring Resumed' : 'Ophireum Monitoring Paused',
      nextState
        ? 'Automated XAUUSD algorithmic monitoring is now active.'
        : 'Automated monitoring paused. Existing positions remain protected by stop-loss.',
      nextState ? 'success' : 'info'
    );
  };

  const userFirstName = currentUser?.fullName?.split(' ')[0] || 'Alexander';

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* 1. Personalized Greeting (Section 10) */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-wide">
          Good afternoon, {userFirstName}
        </h1>
        <p className="text-sm text-zinc-400">
          Here's your account at a glance.
        </p>
      </div>

      {/* 2. Four Status Cards (Section 10) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Identity */}
        <div
          onClick={() => onNavigateTab('verification')}
          className="p-4 rounded-2xl bg-[#0D1017] border border-[#1E2538] hover:border-[#C9A227]/50 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Identity</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold text-white mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Verified</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 flex items-center justify-between">
            <span>Level 2 KYC</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#E4C765] transition-colors" />
          </div>
        </div>

        {/* Card 2: Subscription */}
        <div
          onClick={() => onNavigateTab('subscription')}
          className="p-4 rounded-2xl bg-[#0D1017] border border-[#1E2538] hover:border-[#C9A227]/50 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Subscription</span>
            <CreditCard className="w-4 h-4 text-[#C9A227]" />
          </div>
          <div className="text-base font-bold text-white mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Active</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 flex items-center justify-between">
            <span>Professional Plan</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#E4C765] transition-colors" />
          </div>
        </div>

        {/* Card 3: Trading Account */}
        <div
          onClick={() => onNavigateTab('connect-account')}
          className="p-4 rounded-2xl bg-[#0D1017] border border-[#1E2538] hover:border-[#C9A227]/50 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Trading Account</span>
            <Terminal className="w-4 h-4 text-[#C9A227]" />
          </div>
          <div className="text-base font-bold text-white mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Connected</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 flex items-center justify-between">
            <span>Exness MT5 #889210</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#E4C765] transition-colors" />
          </div>
        </div>

        {/* Card 4: Ophireum */}
        <div
          onClick={() => onNavigateTab('bot-control')}
          className="p-4 rounded-2xl bg-[#0D1017] border border-[#1E2538] hover:border-[#C9A227]/50 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Ophireum</span>
            <Cpu className="w-4 h-4 text-[#C9A227]" />
          </div>
          <div className="text-base font-bold text-white mt-2 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${botRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{botRunning ? 'Monitoring' : 'Paused'}</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 flex items-center justify-between">
            <span>XAUUSD Spot Gold</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#E4C765] transition-colors" />
          </div>
        </div>
      </div>

      {/* 3. Action Required Panel (Section 11) */}
      <div className="p-4 rounded-2xl bg-[#0D1017] border border-[#1E2538] shadow-sm">
        {allClear ? (
          <div className="flex items-center gap-3 text-xs text-zinc-300">
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">You're all set</div>
              <div className="text-[11px] text-zinc-400">All systems are operational and running normally.</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Action Required</div>
                <div className="text-[11px] text-zinc-400">
                  {!isOphireumRunning && 'Ophireum monitoring is currently paused.'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleBot}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              Resume Monitoring
            </button>
          </div>
        )}
      </div>

      {/* 4. Progressive User Journey (Section 12, 63) */}
      <div className="p-5 rounded-2xl bg-[#0D1017] border border-[#1E2538] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#1A2130] pb-3">
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Setup & Activation Roadmap
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Follow the guided track to full institutional automation.
            </p>
          </div>
          <span className="text-xs font-mono text-[#E4C765] font-bold">Step 7 of 7</span>
        </div>

        {/* 7-Step Horizontal or Grid Progress */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
          {[
            { step: 1, title: 'Identity', status: 'done', tab: 'verification' },
            { step: 2, title: 'Choose Plan', status: 'done', tab: 'subscription' },
            { step: 3, title: 'Payment', status: 'done', tab: 'subscription' },
            { step: 4, title: 'Activate License', status: 'done', tab: 'billing' },
            { step: 5, title: 'Connect Account', status: 'done', tab: 'connect-account' },
            { step: 6, title: 'Connect Bot', status: 'done', tab: 'bot-control' },
            { step: 7, title: 'Monitoring', status: 'active', tab: 'trading-monitor' }
          ].map(item => (
            <div
              key={item.step}
              onClick={() => onNavigateTab(item.tab)}
              className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                item.status === 'done'
                  ? 'bg-[#121622] border-[#222B3D] hover:border-[#C9A227]/40'
                  : 'bg-[#C9A227]/10 border-[#C9A227]/50 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-zinc-400">0{item.step}</span>
                {item.status === 'done' ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[#E4C765] animate-pulse" />
                )}
              </div>
              <div className={`text-[11px] font-bold truncate ${item.status === 'active' ? 'text-[#E4C765]' : 'text-zinc-200'}`}>
                {item.title}
              </div>
              <div className="text-[9px] font-mono uppercase mt-0.5 text-zinc-400">
                {item.status === 'done' ? 'COMPLETE' : 'ACTIVE'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Account Overview & Bot Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Account Overview Card (Section 13) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0D1017] border border-[#1E2538] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#1A2130] pb-3">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Account Overview
              </h2>
              <p className="text-[11px] text-zinc-400">Exness MT5 Real-02 · #889210</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('trading-monitor')}
              className="text-xs text-[#C9A227] hover:text-[#E4C765] font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Trading Monitor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#141824] border border-[#222A3B]">
              <div className="text-[10px] text-zinc-400 uppercase font-medium">Balance</div>
              <div className="text-base font-bold font-mono text-white mt-0.5">
                ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#141824] border border-[#222A3B]">
              <div className="text-[10px] text-zinc-400 uppercase font-medium">Equity</div>
              <div className="text-base font-bold font-mono text-white mt-0.5">
                ${account.equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#141824] border border-[#222A3B]">
              <div className="text-[10px] text-zinc-400 uppercase font-medium">Today's P/L</div>
              <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                +${(account.dailyPL ?? 260.30).toFixed(2)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#141824] border border-[#222A3B]">
              <div className="text-[10px] text-zinc-400 uppercase font-medium">Open Positions</div>
              <div className="text-base font-bold font-mono text-white mt-0.5">
                1 active
              </div>
            </div>
          </div>

          {/* Progressive Disclosure: View Details */}
          <div className="pt-2 border-t border-[#181E2B]">
            <button
              type="button"
              onClick={() => setShowAccountDetails(!showAccountDetails)}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 cursor-pointer"
            >
              <span>View technical account metrics</span>
              {showAccountDetails ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {showAccountDetails && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-[#121622] border border-[#1E2538] text-[11px] font-mono text-zinc-400">
                <div>
                  <span className="text-zinc-500 block">Free Margin:</span>
                  <span className="text-white font-semibold">${(account.balance * 0.95).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Margin Level:</span>
                  <span className="text-emerald-400 font-semibold">1,842%</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Leverage:</span>
                  <span className="text-white font-semibold">1:100 Raw</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Execution Server:</span>
                  <span className="text-white font-semibold">London LD4</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ophireum Status & Next Event Card */}
        <div className="p-5 rounded-2xl bg-[#0D1017] border border-[#1E2538] shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1A2130] pb-3">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Execution State
              </h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                botRunning ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
              }`}>
                {botRunning ? 'MONITORING' : 'PAUSED'}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#141824] border border-[#222A3B]">
                <div className="text-[10px] text-zinc-400">Active Market Focus</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">XAUUSD Spot Gold</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Timeframe: M15 · Strategy: SMC LuxAlgo</div>
              </div>

              {/* Next Market Event */}
              <div className="p-3 rounded-xl bg-[#141824] border border-[#222A3B]">
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1 font-semibold text-white">
                    <Calendar className="w-3 h-3 text-[#C9A227]" /> Next Market Event
                  </span>
                  <span className="text-rose-400 font-bold font-mono">HIGH IMPACT</span>
                </div>
                <div className="text-xs font-bold text-white mt-1">
                  US Initial Jobless Claims
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  Today at 13:30 GMT (Auto risk halt armed)
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={toggleBot}
              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                botRunning
                  ? 'bg-[#181F30] hover:bg-[#202940] text-zinc-200 border border-[#2E3B59]'
                  : 'bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold'
              }`}
            >
              {botRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pause Ophireum</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>Resume Monitoring</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
