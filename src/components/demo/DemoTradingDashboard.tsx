/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM DEMO TRADING EXECUTION & PERFORMANCE DASHBOARD
 * Sections 77, 80, 81, 82, 87: Live-style position manager, historical trade ledger, and risk/performance analytics.
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  DollarSign,
  ShieldCheck
} from 'lucide-react';
import { TradingViewDemoArea } from './TradingViewDemoArea';
import { DemoTradingAccount, DemoPosition, DemoTrade } from '../../types/demo';
import { demoEngine } from '../../services/demoEngine';

interface DemoTradingDashboardProps {
  account: DemoTradingAccount;
  positions: DemoPosition[];
  tradeHistory: DemoTrade[];
  addToast: (title: string, msg: string, type: 'info' | 'success' | 'warning' | 'critical') => void;
}

export const DemoTradingDashboard: React.FC<DemoTradingDashboardProps> = ({
  account,
  positions,
  tradeHistory,
  addToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'positions' | 'performance' | 'ledger'>('positions');

  const handleClosePosition = (ticket: number) => {
    demoEngine.closeSimulatedPosition(ticket);
    addToast(
      'Simulated Position Closed',
      `Position #${ticket} finalized and recorded to synthetic trade ledger.`,
      'info'
    );
  };

  return (
    <div className="space-y-6 text-left">
      {/* Section 87: TradingView Demo Area with Internal Simulated Canvas */}
      <TradingViewDemoArea currentPrice={account.currentPrice || 2912.85} />

      {/* Navigation Sub-Tabs */}
      <div className="flex rounded-xl bg-[#141824] p-1 border border-[#232A3B] text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveSubTab('positions')}
          className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            activeSubTab === 'positions'
              ? 'bg-[#232A3B] text-white font-bold shadow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#E4C765]" />
          <span>Open Positions ({positions.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('performance')}
          className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            activeSubTab === 'performance'
              ? 'bg-[#232A3B] text-white font-bold shadow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5 text-[#E4C765]" />
          <span>Performance Dashboard</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('ledger')}
          className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            activeSubTab === 'ledger'
              ? 'bg-[#232A3B] text-white font-bold shadow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#E4C765]" />
          <span>Historical Trade Ledger ({tradeHistory.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: OPEN POSITIONS */}
      {activeSubTab === 'positions' && (
        <div className="bg-[#0D1017] border border-[#232A3B] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E2536] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>ACTIVE SIMULATED ORDERS</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                  LIVE TRACKING
                </span>
              </h3>
              <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                Floating P/L updates tick-by-tick based on synthetic price feed
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-zinc-400">Total Floating:</span>
              {(() => {
                const fp = account.floatingProfit ?? account.floatingPL ?? 0;
                return (
                  <span className={`font-bold ${fp >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {fp >= 0 ? '+' : ''}${fp.toFixed(2)}
                  </span>
                );
              })()}
            </div>
          </div>

          {positions.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[#121622] border border-[#1E2536] space-y-2">
              <Clock className="w-8 h-8 text-zinc-500 mx-auto" />
              <div className="text-sm font-bold text-zinc-300">No Open Positions</div>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                The Ophireum Expert Assistant algorithm is currently monitoring market structure. Use Demo Controls to simulate a buy or sell execution.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1E2536] text-[10px] uppercase text-zinc-400">
                    <th className="py-2.5 px-3">Ticket</th>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Symbol</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Volume</th>
                    <th className="py-2.5 px-3">Open Price</th>
                    <th className="py-2.5 px-3">Current</th>
                    <th className="py-2.5 px-3">S / L</th>
                    <th className="py-2.5 px-3">T / P</th>
                    <th className="py-2.5 px-3">Commission</th>
                    <th className="py-2.5 px-3 text-right">Profit</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181E2B]">
                  {positions.map(pos => {
                    const isBuy = pos.direction === 'BUY';
                    const posProfit = pos.floatingProfit ?? pos.floatingPL ?? 0;
                    const isProfitable = posProfit >= 0;
                    const sLoss = pos.stopLoss ?? pos.sl;
                    const tProfit = pos.takeProfit ?? pos.tp;

                    return (
                      <tr key={pos.ticket} className="hover:bg-[#141824] transition-colors">
                        <td className="py-3 px-3 text-[#E4C765] font-bold">#{pos.ticket}</td>
                        <td className="py-3 px-3 text-zinc-400">{pos.openTime.substring(11, 19)}</td>
                        <td className="py-3 px-3 text-white font-bold">{pos.symbol}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              isBuy
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {pos.direction}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-zinc-200">{pos.volume.toFixed(2)}</td>
                        <td className="py-3 px-3 text-zinc-200">${pos.openPrice.toFixed(2)}</td>
                        <td className="py-3 px-3 text-white font-bold">${pos.currentPrice.toFixed(2)}</td>
                        <td className="py-3 px-3 text-zinc-400">${sLoss ? sLoss.toFixed(2) : '—'}</td>
                        <td className="py-3 px-3 text-zinc-400">${tProfit ? tProfit.toFixed(2) : '—'}</td>
                        <td className="py-3 px-3 text-zinc-400">-${pos.commission.toFixed(2)}</td>
                        <td
                          className={`py-3 px-3 text-right font-bold ${
                            isProfitable ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isProfitable ? '+' : ''}${posProfit.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleClosePosition(pos.ticket)}
                            className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            Close
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: PERFORMANCE DASHBOARD (Sections 81 & 82) */}
      {activeSubTab === 'performance' && (
        <div className="space-y-5">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-[#0D1017] border border-[#232A3B] space-y-1">
              <div className="text-[10px] text-zinc-400 uppercase font-mono">Win Rate</div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {(account.winRate ?? 78.5).toFixed(1)}%
              </div>
              <div className="text-[10px] text-zinc-500">
                {account.winningTrades ?? 11} Wins / {account.losingTrades ?? 3} Losses
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1017] border border-[#232A3B] space-y-1">
              <div className="text-[10px] text-zinc-400 uppercase font-mono">Profit Factor</div>
              <div className="text-xl font-bold font-mono text-[#E4C765]">
                {(account.profitFactor ?? 3.82).toFixed(2)}
              </div>
              <div className="text-[10px] text-zinc-500">Gross Win / Gross Loss</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1017] border border-[#232A3B] space-y-1">
              <div className="text-[10px] text-zinc-400 uppercase font-mono">Max Drawdown</div>
              <div className="text-xl font-bold font-mono text-amber-400">
                {(account.maxDrawdownPercent ?? 3.42).toFixed(2)}%
              </div>
              <div className="text-[10px] text-zinc-500">Historical peak-to-valley</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1017] border border-[#232A3B] space-y-1">
              <div className="text-[10px] text-zinc-400 uppercase font-mono">Total Net P/L</div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                +${(account.totalNetProfit ?? account.realizedPL ?? 682.20).toFixed(2)}
              </div>
              <div className="text-[10px] text-zinc-500">Realized historical gain</div>
            </div>
          </div>

          {/* Secondary Financial Attributes */}
          <div className="p-5 rounded-2xl bg-[#0D1017] border border-[#232A3B] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
              Detailed Mathematical Risk & Return Profile (Simulated)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#121622] border border-[#1E2536]">
                <div className="text-zinc-500 text-[10px]">Gross Profit:</div>
                <div className="text-emerald-400 font-bold mt-1">+${(account.grossProfit ?? 927.20).toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-lg bg-[#121622] border border-[#1E2536]">
                <div className="text-zinc-500 text-[10px]">Gross Loss:</div>
                <div className="text-rose-400 font-bold mt-1">-${(account.grossLoss ?? 245.00).toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-lg bg-[#121622] border border-[#1E2536]">
                <div className="text-zinc-500 text-[10px]">Average Win:</div>
                <div className="text-emerald-400 font-bold mt-1">+${(account.averageWin ?? 84.29).toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-lg bg-[#121622] border border-[#1E2536]">
                <div className="text-zinc-500 text-[10px]">Average Loss:</div>
                <div className="text-rose-400 font-bold mt-1">-${(account.averageLoss ?? 81.67).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: HISTORICAL TRADE LEDGER (Section 80) */}
      {activeSubTab === 'ledger' && (
        <div className="bg-[#0D1017] border border-[#232A3B] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E2536] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>SIMULATED TRADING FOOTPRINT & LEDGER</span>
                <span className="px-2 py-0.5 rounded bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#E4C765] text-[10px] font-mono font-bold">
                  CONTAINS REALISTIC LOSSES
                </span>
              </h3>
              <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                Execution Source: OPHIREUM EXPERT ASSISTANT — SIMULATION | Environment: DEMO
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#1E2536] text-[10px] uppercase text-zinc-400">
                  <th className="py-2.5 px-3">Ticket</th>
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Vol</th>
                  <th className="py-2.5 px-3">Open Time</th>
                  <th className="py-2.5 px-3">Close Time</th>
                  <th className="py-2.5 px-3">Open</th>
                  <th className="py-2.5 px-3">Close</th>
                  <th className="py-2.5 px-3">Swap / Comm</th>
                  <th className="py-2.5 px-3 text-right">Net P/L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181E2B]">
                {tradeHistory.map(trade => {
                  const isBuy = trade.direction === 'BUY';
                  const netProfit = trade.netProfit ?? trade.netPL ?? 0;
                  const isWin = netProfit >= 0;
                  const oPrice = trade.openPrice ?? trade.entryPrice ?? 0;
                  const cPrice = trade.closePrice ?? trade.exitPrice ?? 0;

                  return (
                    <tr key={trade.id} className="hover:bg-[#141824] transition-colors">
                      <td className="py-3 px-3 text-[#E4C765] font-bold">#{trade.ticket}</td>
                      <td className="py-3 px-3 text-white font-bold">{trade.symbol}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isBuy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {trade.direction}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-zinc-300">{trade.volume.toFixed(2)}</td>
                      <td className="py-3 px-3 text-zinc-400">{trade.openTime.substring(11, 16)}</td>
                      <td className="py-3 px-3 text-zinc-400">{trade.closeTime.substring(11, 16)}</td>
                      <td className="py-3 px-3 text-zinc-300">${oPrice.toFixed(2)}</td>
                      <td className="py-3 px-3 text-zinc-300">${cPrice.toFixed(2)}</td>
                      <td className="py-3 px-3 text-zinc-400">
                        -${(trade.commission + trade.swap).toFixed(2)}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-bold ${
                          isWin ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isWin ? '+' : ''}${netProfit.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
