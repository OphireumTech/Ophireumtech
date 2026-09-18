/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM DEMO ADMIN CONTROL CENTER & SPEED CONTROLLER
 * Sections 90, 91, 92: Protected tester panel for triggering state transitions and time acceleration.
 */

import React, { useState } from 'react';
import {
  Sliders,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Zap,
  Radio,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  X,
  CreditCard,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { demoEngine } from '../../services/demoEngine';
import { DemoTradingAccount, DemoBotState, DemoKYCProfile } from '../../types/demo';

interface DemoControlCenterProps {
  account?: DemoTradingAccount;
  botState?: DemoBotState;
  kycProfile?: DemoKYCProfile;
  speed?: number;
  state?: any;
  onClose?: () => void;
  addToast?: (title: string, msg: string, type: 'info' | 'success' | 'warning' | 'critical') => void;
}

export const DemoControlCenter: React.FC<DemoControlCenterProps> = ({
  account,
  botState,
  kycProfile,
  speed,
  state,
  onClose,
  addToast
}) => {
  const notify = (title: string, msg: string, type: 'info' | 'success' | 'warning' | 'critical' = 'info') => {
    if (addToast) addToast(title, msg, type);
  };
  const effState = state || demoEngine.getState();
  const effAccount = account || effState.account;
  const effBotState = botState || effState.botState || effState.bot?.state || {
    status: 'MONITORING',
    licenseStatus: 'ACTIVE — DEMO',
    connectionHealth: 'HEALTHY',
    isBound: true,
    activityLog: []
  };
  const effKyc = kycProfile || effState.kycProfile || effState.kyc || { status: 'VERIFIED — DEMO' };
  const effSpeed = speed ?? effState.speed ?? 1;

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSpeedChange = (mult: number) => {
    demoEngine.setSpeed(mult);
    notify(
      'Simulation Speed Adjusted',
      mult === 0 ? 'Engine paused.' : `Simulation operating at ${mult}× speed.`,
      'info'
    );
  };

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      demoEngine.resetDemoEnvironment();
      setIsResetting(false);
      setShowResetConfirm(false);
      notify(
        'Demonstration Reset Complete',
        'Demo trading account, KYC, licenses, and ledger restored to initial state.',
        'success'
      );
    }, 600);
  };

  return (
    <div className="bg-[#0D1017] border border-[#2B354C] rounded-2xl p-6 space-y-6 shadow-2xl text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E2536] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-[#E4C765] font-bold">
              Protected Testing Desk
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              DEMO ADMIN CONTROL CENTER
            </h2>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1C2233] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Section 91: Demo Speed Controls */}
      <div className="p-4 rounded-xl bg-[#121622] border border-[#1E2536] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-200">Simulation Clock Acceleration</span>
          <span className="text-[10px] font-mono text-zinc-400 uppercase">
            Current: <strong className="text-[#E4C765]">{effSpeed === 0 ? 'Paused' : `${effSpeed}×`}</strong>
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => handleSpeedChange(1)}
            className={`py-2 rounded-lg border transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              effSpeed === 1
                ? 'bg-[#C9A227] text-[#08090B] font-bold border-[#C9A227]'
                : 'bg-[#181D29] text-zinc-300 border-[#2B354C] hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>1× Real</span>
          </button>
          <button
            type="button"
            onClick={() => handleSpeedChange(2)}
            className={`py-2 rounded-lg border transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              effSpeed === 2
                ? 'bg-[#C9A227] text-[#08090B] font-bold border-[#C9A227]'
                : 'bg-[#181D29] text-zinc-300 border-[#2B354C] hover:text-white'
            }`}
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>2×</span>
          </button>
          <button
            type="button"
            onClick={() => handleSpeedChange(5)}
            className={`py-2 rounded-lg border transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              effSpeed === 5
                ? 'bg-[#C9A227] text-[#08090B] font-bold border-[#C9A227]'
                : 'bg-[#181D29] text-zinc-300 border-[#2B354C] hover:text-white'
            }`}
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>5×</span>
          </button>
          <button
            type="button"
            onClick={() => handleSpeedChange(10)}
            className={`py-2 rounded-lg border transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              effSpeed === 10
                ? 'bg-[#C9A227] text-[#08090B] font-bold border-[#C9A227]'
                : 'bg-[#181D29] text-zinc-300 border-[#2B354C] hover:text-white'
            }`}
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>10×</span>
          </button>
          <button
            type="button"
            onClick={() => handleSpeedChange(0)}
            className={`py-2 rounded-lg border transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              effSpeed === 0
                ? 'bg-amber-500 text-black font-bold border-amber-500'
                : 'bg-[#181D29] text-zinc-300 border-[#2B354C] hover:text-white'
            }`}
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause</span>
          </button>
        </div>
      </div>

      {/* Section 90: Manual Scenario Event Triggers */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
          Simulate Operational Scenarios (QA & Client Walkthrough)
        </div>

        {/* Action Group 1: Trading & Execution */}
        <div className="space-y-2">
          <div className="text-[11px] text-zinc-400 font-medium">Algorithmic Trade Execution</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                demoEngine.openSimulatedPosition('BUY', 0.15);
                notify('Simulated Trade Dispatched', 'Simulated BUY 0.15 lots @ spot price', 'info');
              }}
              className="p-2.5 rounded-xl bg-[#141824] hover:bg-[#1E2436] border border-[#2B354C] text-zinc-200 transition-colors cursor-pointer flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Open BUY 0.15</span>
            </button>

            <button
              type="button"
              onClick={() => {
                demoEngine.openSimulatedPosition('SELL', 0.15);
                notify('Simulated Trade Dispatched', 'Simulated SELL 0.15 lots @ spot price', 'info');
              }}
              className="p-2.5 rounded-xl bg-[#141824] hover:bg-[#1E2436] border border-[#2B354C] text-zinc-200 transition-colors cursor-pointer flex items-center gap-2"
            >
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span>Open SELL 0.15</span>
            </button>

            <button
              type="button"
              onClick={() => {
                demoEngine.triggerForceTrade(true);
                notify('Winning Trade Generated', 'Ledger updated with profitable closed trade (+$260)', 'success');
              }}
              className="p-2.5 rounded-xl bg-[#141824] hover:bg-[#1E2436] border border-emerald-500/30 text-emerald-400 transition-colors cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Force Win (+P/L)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                demoEngine.triggerForceTrade(false);
                notify('Losing Trade Generated', 'Realistic loss added to ledger demonstrating risk mitigation', 'warning');
              }}
              className="p-2.5 rounded-xl bg-[#141824] hover:bg-[#1E2436] border border-rose-500/30 text-rose-400 transition-colors cursor-pointer flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Force Loss (-P/L)</span>
            </button>
          </div>
        </div>

        {/* Action Group 2: Market Dynamics */}
        <div className="space-y-2">
          <div className="text-[11px] text-zinc-400 font-medium">Market Volatility & Events</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                demoEngine.triggerMarketVolatility();
                notify('Market Volatility Injected', 'Spot gold shifted to simulate fast order flow event', 'warning');
              }}
              className="p-2.5 rounded-xl bg-[#141824] hover:bg-[#1E2436] border border-[#2B354C] text-zinc-200 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Spike Volatility</span>
            </button>

            <button
              type="button"
              onClick={() => {
                demoEngine.toggleBotStatus();
                notify('Bot Execution Toggled', `Bot status: ${effBotState.status === 'MONITORING' ? 'PAUSED' : 'MONITORING'}`, 'info');
              }}
              className="p-2.5 rounded-xl bg-[#141824] hover:bg-[#1E2436] border border-[#2B354C] text-zinc-200 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Radio className="w-4 h-4 text-[#E4C765]" />
              <span>Toggle Bot Active</span>
            </button>

            <button
              type="button"
              onClick={() => {
                demoEngine.toggleConnectionHealth();
                notify('Network Health Toggled', `Connection: ${effBotState.connectionHealth === 'HEALTHY' ? 'INTERRUPTED' : 'HEALTHY'}`, 'info');
              }}
              className="p-2.5 rounded-xl bg-[#141824] hover:bg-[#1E2436] border border-[#2B354C] text-zinc-200 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Radio className="w-4 h-4 text-rose-400" />
              <span>Simulate Net Glitch</span>
            </button>
          </div>
        </div>

        {/* Action Group 3: Identity & Compliance Verification */}
        <div className="space-y-2">
          <div className="text-[11px] text-zinc-400 font-medium">KYC / Compliance State Simulation</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                demoEngine.updateKYCStatus('VERIFIED — DEMO', 'NO MATCH');
                notify('KYC Approved', 'Identity verification marked VERIFIED — DEMO', 'success');
              }}
              className="p-2 rounded-lg bg-[#141824] hover:bg-[#1E2436] border border-emerald-500/30 text-emerald-400 transition-colors cursor-pointer"
            >
              KYC Approved
            </button>
            <button
              type="button"
              onClick={() => {
                demoEngine.updateKYCStatus('REJECTED — DEMO');
                notify('KYC Rejected', 'Identity flagged for review: REJECTED — DEMO', 'critical');
              }}
              className="p-2 rounded-lg bg-[#141824] hover:bg-[#1E2436] border border-rose-500/30 text-rose-400 transition-colors cursor-pointer"
            >
              KYC Rejected
            </button>
            <button
              type="button"
              onClick={() => {
                demoEngine.updateKYCStatus('COMPLIANCE REVIEW', 'CONFIRMED DUPLICATE — DEMO');
                notify('Duplicate Flagged', 'Simulated duplicate match detected across records', 'warning');
              }}
              className="p-2 rounded-lg bg-[#141824] hover:bg-[#1E2436] border border-amber-500/30 text-amber-400 transition-colors cursor-pointer"
            >
              Simulate Duplicate
            </button>
            <button
              type="button"
              onClick={() => {
                demoEngine.toggleBotBinding();
                notify('MT5 Binding Toggled', effBotState.isBound ? 'Terminal unlinked' : 'Terminal bound', 'info');
              }}
              className="p-2 rounded-lg bg-[#141824] hover:bg-[#1E2436] border border-[#2B354C] text-zinc-300 transition-colors cursor-pointer"
            >
              Toggle Binding
            </button>
          </div>
        </div>
      </div>

      {/* Section 92: Reset Demonstration Environment */}
      <div className="border-t border-[#1E2536] pt-4">
        {!showResetConfirm ? (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET DEMO ACCOUNT</span>
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 space-y-3">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>RESET DEMONSTRATION ENVIRONMENT?</span>
            </div>
            <p className="text-[11px] text-zinc-300">
              This will restore all simulated positions, trades, account balances, and KYC profiles to their clean initial state. Production records cannot be affected.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isResetting}
                onClick={handleReset}
                className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isResetting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                <span>Confirm Reset</span>
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg bg-[#181D29] hover:bg-[#232A3B] border border-[#2B354C] text-zinc-300 text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
