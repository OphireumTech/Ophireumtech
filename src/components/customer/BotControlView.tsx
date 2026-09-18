/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Bot Control View
 * Sections 24 & 25: Clean, single-card bot control with dominant Pause/Resume button,
 * status breakdown, plain-English activity timeline, and progressive disclosure for raw logs.
 */

import React, { useState } from 'react';
import {
  Cpu,
  Pause,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Terminal,
  ChevronDown,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BotControlView: React.FC = () => {
  const { addToast } = useApp();
  const [isRunning, setIsRunning] = useState(true);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const toggleBot = () => {
    const nextState = !isRunning;
    setIsRunning(nextState);
    addToast(
      nextState ? 'Ophireum Monitoring Resumed' : 'Ophireum Monitoring Paused',
      nextState
        ? 'Automated XAUUSD algorithmic monitoring is now active.'
        : 'Automated monitoring paused. Existing positions remain protected by stop-loss.',
      nextState ? 'success' : 'info'
    );
  };

  const timelineEvents = [
    { time: '11:15 GMT', text: 'Target reached: XAUUSD position closed at $2,912.85 (+ $260.30)', status: 'success' },
    { time: '10:52 GMT', text: 'Market conditions aligned: Buy order 0.15 lots opened at $2,910.45', status: 'info' },
    { time: '10:41 GMT', text: 'Market conditions evaluated: Order Block validated on M15 timeframe', status: 'normal' },
    { time: '10:32 GMT', text: 'Ophireum initialized monitoring on XAUUSD', status: 'normal' },
    { time: '08:00 GMT', text: 'Pre-market liquidity scan completed. Risk limits verified.', status: 'normal' }
  ];

  const technicalLogs = [
    '[2026-09-18 11:15:02.192] [INFO] [EXEC] Ticket #99214 TP triggered @ 2912.85. P/L: +260.30 USD',
    '[2026-09-18 10:52:14.881] [INFO] [SIGNAL] SMC Bullish OB rejection on XAUUSD M15. Entry: 2910.45, SL: 2900.00, TP: 2940.00',
    '[2026-09-18 10:41:00.024] [DEBUG] [TELEMETRY] Exness MT5 bridge latency 1.18ms. Spread: 1.8 pips.',
    '[2026-09-18 10:32:00.000] [INFO] [STARTUP] Ophireum Expert Assistant v2026.4 initialized.'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Main Bot Control Card (Section 24) */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-2xl space-y-6">
        {/* Header & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2538] pb-6">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
              isRunning
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
            }`}>
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                EXECUTION ENGINE
              </div>
              <h1 className="text-lg font-bold text-white font-serif tracking-wide">
                OPHIREUM EXPERT ASSISTANT
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 ${
              isRunning
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {isRunning ? 'RUNNING' : 'PAUSED'}
            </span>
          </div>
        </div>

        {/* 4 Status Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B]">
            <div className="text-[11px] text-zinc-400 font-medium">Trading Account</div>
            <div className="text-xs font-bold text-white mt-1">Exness MT5 #889210</div>
            <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Connected
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B]">
            <div className="text-[11px] text-zinc-400 font-medium">License</div>
            <div className="text-xs font-bold text-[#E4C765] mt-1">Professional Plan</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">328 days remaining</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B]">
            <div className="text-[11px] text-zinc-400 font-medium">Current Focus</div>
            <div className="text-xs font-bold text-white mt-1">XAUUSD Spot</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Timeframe: M15 / H1</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B]">
            <div className="text-[11px] text-zinc-400 font-medium">Risk Protocol</div>
            <div className="text-xs font-bold text-white mt-1">Institutional Shield</div>
            <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Stop-Loss Enforced
            </div>
          </div>
        </div>

        {/* Primary Action Button (Single Dominant Button) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={toggleBot}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
              isRunning
                ? 'bg-[#181F30] hover:bg-[#202940] text-zinc-200 border border-[#2E3B59]'
                : 'bg-gradient-to-r from-[#C9A227] to-[#E4C765] hover:brightness-110 text-black shadow-[#C9A227]/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 text-amber-400" />
                <span>PAUSE OPHIREUM MONITORING</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black" />
                <span>RESUME OPHIREUM MONITORING</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Plain English Activity Timeline (Section 25) */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E2538] pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C9A227]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Recent Activity Timeline
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">Live event stream</span>
        </div>

        <div className="space-y-3">
          {timelineEvents.map((evt, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs">
              <span className="font-mono text-zinc-500 shrink-0 text-[11px] pt-0.5 w-16">
                {evt.time}
              </span>
              <div className="flex-1 p-2.5 rounded-xl bg-[#141824] border border-[#222A3B] text-zinc-300">
                {evt.text}
              </div>
            </div>
          ))}
        </div>

        {/* Technical Details Progressive Disclosure */}
        <div className="pt-3 border-t border-[#181E2B]">
          <button
            type="button"
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="text-xs text-[#C9A227] hover:text-[#E4C765] font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <span>Technical Details & Logs</span>
            {showTechnicalDetails ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {showTechnicalDetails && (
            <div className="mt-3 p-3 rounded-xl bg-[#080A0F] border border-[#1C2233] font-mono text-[11px] text-zinc-400 space-y-1.5 overflow-x-auto">
              {technicalLogs.map((log, i) => (
                <div key={i} className="whitespace-pre">{log}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
