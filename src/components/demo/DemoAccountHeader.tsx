/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM COMPACT DEMO ACCOUNT HEADER & DATA SOURCE BADGES
 * Sections 95 & 96: Compact institutional summary bar for authenticated simulation sessions.
 */

import React from 'react';
import { Shield, Key, Terminal, Cpu, Clock, RefreshCw } from 'lucide-react';
import { DemoTradingAccount, DemoBotState, DemoKYCProfile } from '../../types/demo';
import { demoEngine } from '../../services/demoEngine';

interface DemoAccountHeaderProps {
  account?: DemoTradingAccount;
  botState?: DemoBotState;
  bot?: any;
  kycProfile?: DemoKYCProfile;
  speed?: number;
  onOpenControls?: () => void;
}

export const DemoAccountHeader: React.FC<DemoAccountHeaderProps> = ({
  account,
  botState,
  bot,
  kycProfile,
  speed = 1,
  onOpenControls
}) => {
  const engineState = typeof demoEngine !== 'undefined' ? demoEngine.getState() : null;
  const effectiveAccount = account || engineState?.account || {
    accountNumber: 'DEMO-2026-001',
    brokerServer: 'Ophireum-Demo-Liquidity',
    balance: 50000,
    equity: 50438.50,
  };
  const effectiveBotState = botState || bot?.state || engineState?.botState || {
    status: bot?.status || 'CONNECTED',
    connectionHealth: 'HEALTHY',
    licenseStatus: 'ACTIVE — DEMO',
    boundAccount: effectiveAccount?.accountNumber || 'DEMO-2026-001'
  };
  const effectiveKyc = kycProfile || engineState?.kyc || { status: 'VERIFIED — DEMO', ocid: 'A7K29P4XQ' };
  return (
    <div className="bg-[#0D1017] border border-[#232A3B] rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
      {/* Primary Compact Header Line */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E2536] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wide">OPHIREUM</span>
              <span className="text-xs text-zinc-400 font-medium">Expert Assistant</span>
              <span className="px-2 py-0.5 rounded-md bg-[#C9A227]/20 border border-[#C9A227]/50 text-[#E4C765] text-[10px] font-mono font-bold tracking-wider">
                DEMO ACCOUNT
              </span>
            </div>
          </div>
        </div>

        {/* Speed / Control status */}
        <div className="flex items-center gap-2">
          {speed !== 1 && (
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
              {speed === 0 ? 'PAUSED' : `${speed}× SPEED`}
            </span>
          )}
          {onOpenControls && (
            <button
              type="button"
              onClick={onOpenControls}
              className="px-2.5 py-1 rounded-lg bg-[#181D29] hover:bg-[#232A3B] border border-[#2B354C] text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-[#E4C765]" />
              <span>Demo Controls</span>
            </button>
          )}
        </div>
      </div>

      {/* Section 96: Compact Status Cells */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
        {/* Cell 1: OCID */}
        <div className="p-2.5 rounded-xl bg-[#121622] border border-[#1E2536] flex flex-col justify-center">
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">OCID</div>
          <div className="font-mono font-bold text-[#E4C765] truncate text-xs mt-0.5">
            {effectiveKyc.ocid}
          </div>
        </div>

        {/* Cell 2: KYC Status */}
        <div className="p-2.5 rounded-xl bg-[#121622] border border-[#1E2536] flex flex-col justify-center">
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">KYC Status</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-semibold text-emerald-400 truncate text-[11px]">
              {effectiveKyc.status}
            </span>
          </div>
        </div>

        {/* Cell 3: License */}
        <div className="p-2.5 rounded-xl bg-[#121622] border border-[#1E2536] flex flex-col justify-center">
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Licence</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E4C765]" />
            <span className="font-semibold text-[#E4C765] truncate text-[11px]">
              {effectiveBotState.licenseStatus}
            </span>
          </div>
        </div>

        {/* Cell 4: MT5 Connection */}
        <div className="p-2.5 rounded-xl bg-[#121622] border border-[#1E2536] flex flex-col justify-center">
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">MT5 Account</div>
          <div className="flex items-center gap-1.5 mt-0.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-zinc-200 truncate text-[11px]">
              {effectiveAccount?.accountNumber} <span className="text-zinc-400 text-[10px]">({effectiveAccount?.brokerServer || 'Ophireum-Demo-Liquidity'})</span>
            </span>
          </div>
        </div>

        {/* Cell 5: Bot State */}
        <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-[#121622] border border-[#1E2536] flex flex-col justify-center">
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Bot Execution</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${effectiveBotState.status === 'PAUSED' ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
            <span className="font-semibold text-zinc-200 truncate text-[11px]">
              {effectiveBotState.status} — DEMO
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
