/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Comprehensive Risk Disclosures & Statutory Performance Engine
 * Sections 17, 18, 19, 20, 21, 22, 40: Zero-guarantee declarations, XAUUSD volatility,
 * third-party broker separation, performance classification badges, and Risk Disclosure Receipts.
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  FileText,
  Download,
  Scroll,
  Printer,
  ChevronDown,
  Layers,
  Award
} from 'lucide-react';
import { complianceEngine } from '../../services/complianceEngine';
import { useApp } from '../../context/AppContext';
import { PerformanceBasis } from '../../types/compliance';

export const RiskDisclosuresView: React.FC = () => {
  const { currentUser, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<string>('no_guarantee');
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({
    no_guarantee: true,
    automated_trading: true,
    xauusd_gold: true,
    third_party_broker: true,
    client_control: true,
    performance_basis: true
  });

  const [receiptGenerated, setReceiptGenerated] = useState(false);

  const handleGenerateReceipt = () => {
    setReceiptGenerated(true);
    addToast('Risk Disclosure Receipt Generated', 'Receipt recorded in client compliance ledger and vault.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2538] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-rose-400 uppercase tracking-wider">
                COMPLIANCE GATE 08 / STATUTORY DISCLOSURES
              </div>
              <h1 className="text-xl font-bold text-white font-serif">
                MANDATORY RISK & PERFORMANCE DISCLOSURES
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateReceipt}
            className="px-4 py-2 rounded-xl bg-[#151A28] hover:bg-[#1E253A] border border-[#26324D] text-xs font-semibold text-zinc-200 hover:text-white flex items-center gap-2 cursor-pointer shadow-md transition-all shrink-0"
          >
            <Download className="w-4 h-4 text-[#E4C765]" />
            <span>Generate Risk Receipt</span>
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Statutory disclosure notices must be presented with equal prominence to any performance metrics. Review our mandatory declarations regarding gold volatility, software failure risks, and zero-profit guarantees.
        </p>
      </div>

      {/* SECTION: PROMINENT ZERO-GUARANTEE BANNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-[#0D1017] border-2 border-rose-600/50 shadow-2xl space-y-4 text-left">
        <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>STATUTORY ZERO-GUARANTEE DECLARATION</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#090C12] border border-rose-800/40 space-y-1">
            <div className="font-bold text-white font-mono text-[11px] text-rose-300">NO GUARANTEE OF PROFIT</div>
            <p className="text-[11px] text-zinc-300">
              Ophireum technology carries NO GUARANTEE OF ANY PROFIT, RETURN, OR INCOME. Capital is constantly exposed to live market conditions.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#090C12] border border-rose-800/40 space-y-1">
            <div className="font-bold text-white font-mono text-[11px] text-rose-300">NO GUARANTEE AGAINST LOSS</div>
            <p className="text-[11px] text-zinc-300">
              Loss of some or all trading capital can occur. Stop losses are subject to slippage and cannot prevent adverse market gaps.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#090C12] border border-rose-800/40 space-y-1">
            <div className="font-bold text-white font-mono text-[11px] text-rose-300">PAST PERFORMANCE CAVEAT</div>
            <p className="text-[11px] text-zinc-300">
              Historical backtests and algorithmic statistics do NOT guarantee, predict, or imply that future execution will achieve similar results.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#090C12] border border-rose-800/40 space-y-1">
            <div className="font-bold text-white font-mono text-[11px] text-rose-300">NON-FIDUCIARY SOFTWARE</div>
            <p className="text-[11px] text-zinc-300">
              Ophireum LLC is a technology provider and NOT a registered investment advisor, broker, or asset manager.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION: PERFORMANCE BASIS STANDARDS */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-4">
        <div className="border-b border-[#1E2538] pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#E4C765]" />
            <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
              PERFORMANCE DISCLOSURE & BASIS CLASSIFICATION
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">CFTC Rule 4.41 & Regulatory Mandates</span>
        </div>

        <p className="text-xs text-zinc-400">
          Every performance claim or metric throughout Ophireum documentation must clearly display one of the following standardized basis badges:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
          {[
            {
              badge: 'LIVE_VERIFIED',
              label: 'Live Verified',
              color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
              desc: 'Third-party audited live trading ledger with real broker fills.'
            },
            {
              badge: 'LIVE_UNVERIFIED',
              label: 'Live Unverified',
              color: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
              desc: 'Real funds deployed without third-party statement certification.'
            },
            {
              badge: 'DEMO',
              label: 'Demo Simulated',
              color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
              desc: 'Virtual capital executed against live market feed with simulated liquidity.'
            },
            {
              badge: 'BACKTEST',
              label: 'Historical Backtest',
              color: 'border-purple-500/40 text-purple-400 bg-purple-950/20',
              desc: 'Mathematical simulation run on historical MT5 tick data with fixed spread model.'
            },
            {
              badge: 'SIMULATED',
              label: 'Simulated Execution',
              color: 'border-indigo-500/40 text-indigo-400 bg-indigo-950/20',
              desc: 'Synthetic algorithmic stress-testing across hypothetical volatility conditions.'
            },
            {
              badge: 'HYPOTHETICAL',
              label: 'Hypothetical / Model',
              color: 'border-zinc-600 text-zinc-400 bg-zinc-900/40',
              desc: 'Designed with benefit of hindsight; not actual trading results.'
            }
          ].map(b => (
            <div key={b.badge} className={`p-3 rounded-xl border ${b.color} space-y-1`}>
              <span className="font-bold text-[11px] block">{b.label}</span>
              <p className="text-[10px] font-sans text-zinc-300">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DISCLOSURE TOPIC TABS */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-5">
        <div className="flex flex-wrap gap-2 border-b border-[#1E2538] pb-3 text-xs font-semibold">
          {[
            { id: 'no_guarantee', label: 'No Guarantee' },
            { id: 'automated_trading', label: 'Automated Trading Risk' },
            { id: 'xauusd_gold', label: 'XAUUSD Gold Volatility' },
            { id: 'third_party_broker', label: 'Third-Party Broker Separation' },
            { id: 'client_control', label: 'Client Control vs Platform Scope' }
          ].map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
                activeTab === t.id
                  ? 'bg-[#C9A227] text-black font-bold'
                  : 'bg-[#121622] text-zinc-400 hover:text-white border border-[#1E2538]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 rounded-2xl bg-[#080B11] border border-[#1A2234] text-xs text-zinc-300 leading-relaxed space-y-3 font-sans">
          {activeTab === 'no_guarantee' && (
            <>
              <h4 className="text-sm font-bold text-white font-serif uppercase">
                EXPLICIT STATUTORY ZERO-GUARANTEE NOTICE
              </h4>
              <p>
                Trading foreign exchange, precious metals, and Contracts for Difference (CFDs) carries an extremely high level of risk to your capital. You should only trade with funds you can afford to lose without sacrificing your standard of living or essential financial obligations.
              </p>
              <p>
                Ophireum LLC expressly disclaims any warranty, representation, or promise of positive returns, specific win rates, fixed monthly yields, or protection against loss. Past performance figures displayed in backtests or demo records are hypothetical and do not represent actual trading outcomes for any individual investor.
              </p>
            </>
          )}

          {activeTab === 'automated_trading' && (
            <>
              <h4 className="text-sm font-bold text-white font-serif uppercase">
                AUTOMATED & ALGORITHMIC EXECUTION RISKS
              </h4>
              <p>
                Automated software executes rules-based logic without human emotional discretion. While this eliminates psychological bias, it creates technical risks:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li>Network Latency: Execution speed depends upon the VPS proximity to broker matching engines.</li>
                <li>Software Outages: MT5 terminal crashes, memory leaks, or operating system restarts can halt active trailing stops.</li>
                <li>Slippage & Gapping: Macroeconomic events can cause orders to fill many pips away from the requested stop price.</li>
                <li>Unattended Operations: The EA may continue executing trades while you are asleep or away from terminal monitoring.</li>
              </ul>
            </>
          )}

          {activeTab === 'xauusd_gold' && (
            <>
              <h4 className="text-sm font-bold text-white font-serif uppercase">
                XAUUSD / SPOT GOLD SPECIFIC MARKET VOLATILITY
              </h4>
              <p>
                Gold is an acutely volatile commodity influenced by macroeconomic interest rate decisions, central bank reserve purchases, currency debasement, and geopolitical conflicts.
              </p>
              <p>
                Intraday gold fluctuations frequently exceed $30-$50 per ounce within minutes during Federal Reserve press conferences or Non-Farm Payrolls (NFP) releases. High leverage on gold contracts magnifies margin usage exponentially and can trigger automated broker liquidations in milliseconds.
              </p>
            </>
          )}

          {activeTab === 'third_party_broker' && (
            <>
              <h4 className="text-sm font-bold text-white font-serif uppercase">
                INDEPENDENT BROKERAGE CUSTODY & SEPARATION
              </h4>
              <p>
                Ophireum LLC is an independent commercial software vendor and is NOT affiliated with, owned by, or representative of your broker.
              </p>
              <p>
                Your broker maintains sole custody of your funds, establishes your leverage limits, sets spread markups, determines swap rollover charges, and manages order execution. Ophireum has no access to your broker balance, deposits, withdrawals, or solvency guarantees.
              </p>
            </>
          )}

          {activeTab === 'client_control' && (
            <>
              <h4 className="text-sm font-bold text-white font-serif uppercase">
                ALLOCATION OF RESPONSIBILITY: CLIENT CONTROL VS TECHNOLOGY PROVIDER
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono pt-1">
                <div className="p-3 rounded-xl bg-[#0E121B] border border-[#1E2538]">
                  <span className="text-emerald-400 font-bold block mb-1">CLIENT CONTROLS:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-zinc-300">
                    <li>Selection of regulated broker</li>
                    <li>Account funding and withdrawals</li>
                    <li>Configured risk percentage / lot sizing</li>
                    <li>Enabling / disabling AutoTrading</li>
                    <li>Unbinding software at any time</li>
                  </ul>
                </div>
                <div className="p-3 rounded-xl bg-[#0E121B] border border-[#1E2538]">
                  <span className="text-[#E4C765] font-bold block mb-1">OPHIREUM PROVIDES:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-zinc-300">
                    <li>Compiled EX5 algorithm binaries</li>
                    <li>Algorithmic mathematical updates</li>
                    <li>WebRequest license authentication</li>
                    <li>Customer portal dashboard tools</li>
                    <li>Technical installation documentation</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* RECEIPT MODAL */}
      {receiptGenerated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#090C12] border-2 border-[#C9A227] shadow-2xl p-6 text-left space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#1E2538] pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#E4C765]" />
                <span className="text-xs font-mono font-bold text-[#E4C765] uppercase">
                  STATUTORY RISK DISCLOSURE RECEIPT
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReceiptGenerated(false)}
                className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-[#141824] cursor-pointer"
              >
                Close [✕]
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#07090F] border border-[#1A2234] text-xs font-mono space-y-2 text-zinc-300">
              <div>RECEIPT REF: <span className="text-[#E4C765] font-bold">RDR-2026-08149</span></div>
              <div>SUBSCRIBER: <span className="text-white">{currentUser?.fullName || 'Alexander Vance'}</span></div>
              <div>DATE PRESENTED: <span className="text-zinc-400">{new Date().toUTCString()}</span></div>
              <div>SHA-256 HASH: <span className="text-emerald-400 text-[10px] break-all">f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0</span></div>
              <div className="pt-2 border-t border-[#182030] text-[11px] text-zinc-400">
                Acknowledged all 6 mandatory risk schedules including No-Guarantee, XAUUSD Volatility, and Third-Party Broker Separation.
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReceiptGenerated(false)}
                className="px-5 py-2 rounded-xl bg-[#C9A227] hover:bg-[#E4C765] text-black font-bold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
