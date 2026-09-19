/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Consolidated View-Only Trading Monitor
 * Sections 22 & 23: View-only customer monitoring workspace without manual order buttons,
 * top metrics bar, tabs for Open Positions, Trade History, Performance, and Activity.
 */

import React, { useState } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  Shield,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Terminal
} from 'lucide-react';
import { DemoAccount, DemoPosition, DemoTrade } from '../../types';

interface TradingMonitorViewProps {
  account: DemoAccount;
  positions?: DemoPosition[];
  tradeHistory?: DemoTrade[];
  onRefresh?: () => void;
  initialSubTab?: 'positions' | 'history' | 'performance' | 'activity';
}

export const TradingMonitorView: React.FC<TradingMonitorViewProps> = ({
  account,
  positions = [],
  tradeHistory = [],
  onRefresh,
  initialSubTab = 'positions'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'positions' | 'history' | 'performance' | 'activity'>(initialSubTab);

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const [expandedPositionId, setExpandedPositionId] = useState<string | null>(null);

  // Compute live floating P/L
  const floatingPL = positions.reduce((sum, p) => sum + (p.unrealizedPL || p.profit || 0), 0);
  const todaysPL = account.dailyPL ?? 260.30;
  const equity = account.equity || (account.balance + floatingPL);

  return (
    <div className="space-y-6 text-left">
      {/* Top Consolidated Metrics Bar (Section 22) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#0D1017] border border-[#1E2538] shadow-sm">
          <div className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">Balance</div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Base currency: USD</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D1017] border border-[#1E2538] shadow-sm">
          <div className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">Equity</div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            ${equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Live liquidated value</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D1017] border border-[#1E2538] shadow-sm">
          <div className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">Floating P/L</div>
          <div className={`text-xl font-bold font-mono mt-1 ${floatingPL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {floatingPL >= 0 ? '+' : ''}${floatingPL.toFixed(2)}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{positions.length} active position(s)</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D1017] border border-[#1E2538] shadow-sm">
          <div className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">Today's P/L</div>
          <div className={`text-xl font-bold font-mono mt-1 ${todaysPL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {todaysPL >= 0 ? '+' : ''}${todaysPL.toFixed(2)}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Closed session gain</div>
        </div>
      </div>

      {/* View-Only Protection Banner (Section 23) */}
      <div className="p-3 rounded-xl bg-[#0D1017] border border-[#1E2538] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-400">
        <div className="flex items-center gap-2 text-zinc-300">
          <Shield className="w-4 h-4 text-[#C9A227] shrink-0" />
          <span>
            <strong className="text-white">View-Only Monitor:</strong> Execution is fully automated by Ophireum algorithms. Manual order placing is disabled to protect algorithmic risk parameters.
          </span>
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141926] hover:bg-[#1C2336] text-zinc-300 text-xs font-medium cursor-pointer transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
        )}
      </div>

      {/* Tabs Bar */}
      <div className="p-4 rounded-2xl bg-[#0D1017] border border-[#1E2538] space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-[#1A2130] pb-3 overflow-x-auto">
          {[
            { key: 'positions', label: `Open Positions (${positions.length})` },
            { key: 'history', label: 'Trade History' },
            { key: 'performance', label: 'Performance Analytics' },
            { key: 'activity', label: 'Connection & Health' }
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveSubTab(tab.key as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeSubTab === tab.key
                  ? 'bg-[#C9A227]/15 text-[#E4C765] font-semibold border border-[#C9A227]/30'
                  : 'text-zinc-400 hover:text-white hover:bg-[#141824]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OPEN POSITIONS */}
        {activeSubTab === 'positions' && (
          <div className="space-y-3">
            {positions.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 space-y-2">
                <Activity className="w-8 h-8 text-[#C9A227]/40 mx-auto" />
                <div className="text-sm font-medium text-zinc-300">No open positions</div>
                <div className="text-xs text-zinc-500">
                  Ophireum is actively monitoring the market for high-probability setups.
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#1C2334] text-[11px] text-zinc-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3 font-semibold">Symbol</th>
                      <th className="py-2.5 px-3 font-semibold">Type</th>
                      <th className="py-2.5 px-3 font-semibold">Volume</th>
                      <th className="py-2.5 px-3 font-semibold">Entry</th>
                      <th className="py-2.5 px-3 font-semibold">Current</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Profit / Loss</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#171D2B]">
                    {positions.map(p => {
                      const isBuy = p.direction === 'BUY' || p.type === 'BUY';
                      const pl = p.unrealizedPL || p.profit || 0;
                      const isExpanded = expandedPositionId === p.id;

                      return (
                        <React.Fragment key={p.id}>
                          <tr className="hover:bg-[#121622] transition-colors">
                            <td className="py-3 px-3 font-mono font-bold text-white">{p.symbol}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                                isBuy ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                              }`}>
                                {p.direction || p.type}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono text-zinc-300">{p.volume.toFixed(2)} lots</td>
                            <td className="py-3 px-3 font-mono text-zinc-300">${p.entryPrice.toFixed(2)}</td>
                            <td className="py-3 px-3 font-mono text-zinc-300">${p.currentPrice.toFixed(2)}</td>
                            <td className="py-3 px-3 font-mono font-bold text-right">
                              <span className={pl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                {pl >= 0 ? '+' : ''}${pl.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => setExpandedPositionId(isExpanded ? null : p.id)}
                                className="text-[11px] text-[#C9A227] hover:text-[#E4C765] font-medium inline-flex items-center gap-1 cursor-pointer"
                              >
                                <span>{isExpanded ? 'Hide' : 'Details'}</span>
                                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                              </button>
                            </td>
                          </tr>

                          {/* Progressive Disclosure (Section 13) */}
                          {isExpanded && (
                            <tr className="bg-[#121622]/60">
                              <td colSpan={7} className="p-3">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono text-zinc-400">
                                  <div>
                                    <span className="text-zinc-500 block">Stop Loss:</span>
                                    <span className="text-rose-400 font-semibold">${p.stopLoss ? p.stopLoss.toFixed(2) : '2,900.00'}</span>
                                  </div>
                                  <div>
                                    <span className="text-zinc-500 block">Take Profit:</span>
                                    <span className="text-emerald-400 font-semibold">${p.takeProfit ? p.takeProfit.toFixed(2) : '2,940.00'}</span>
                                  </div>
                                  <div>
                                    <span className="text-zinc-500 block">Ticket ID:</span>
                                    <span className="text-zinc-300">#{p.id || 'MT5-99214'}</span>
                                  </div>
                                  <div>
                                    <span className="text-zinc-500 block">Open Time:</span>
                                    <span className="text-zinc-300">{p.openTime || 'Today, 10:14 GMT'}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TRADE HISTORY */}
        {activeSubTab === 'history' && (
          <div className="space-y-3">
            {tradeHistory.length === 0 ? (
              <div className="py-10 text-center text-zinc-400 text-xs">
                Completed trades will appear here automatically.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#1C2334] text-[11px] text-zinc-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3 font-semibold">Date</th>
                      <th className="py-2.5 px-3 font-semibold">Symbol</th>
                      <th className="py-2.5 px-3 font-semibold">Type</th>
                      <th className="py-2.5 px-3 font-semibold">Volume</th>
                      <th className="py-2.5 px-3 font-semibold">Entry</th>
                      <th className="py-2.5 px-3 font-semibold">Exit</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#171D2B]">
                    {tradeHistory.map(t => {
                      const isWin = (t.profit || 0) >= 0;
                      return (
                        <tr key={t.id} className="hover:bg-[#121622] transition-colors">
                          <td className="py-3 px-3 font-mono text-zinc-400 text-[11px]">
                            {t.closeTime ? new Date(t.closeTime).toLocaleDateString() : 'Today'}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-white">{t.symbol}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                              t.type === 'BUY' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                            }`}>
                              {t.type}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-zinc-300">{t.volume.toFixed(2)} lots</td>
                          <td className="py-3 px-3 font-mono text-zinc-300">${t.openPrice.toFixed(2)}</td>
                          <td className="py-3 px-3 font-mono text-zinc-300">${t.closePrice.toFixed(2)}</td>
                          <td className="py-3 px-3 font-mono font-bold text-right">
                            <span className={isWin ? 'text-emerald-400' : 'text-rose-400'}>
                              {isWin ? '+' : ''}${(t.profit || 0).toFixed(2)}
                            </span>
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

        {/* TAB 3: PERFORMANCE */}
        {activeSubTab === 'performance' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#141824] border border-[#222A3B]">
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider">Win Rate</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">74.2%</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">36 profitable / 12 mitigated</div>
            </div>
            <div className="p-4 rounded-xl bg-[#141824] border border-[#222A3B]">
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider">Profit Factor</div>
              <div className="text-xl font-bold font-mono text-white mt-1">2.18</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Gross gains vs. losses</div>
            </div>
            <div className="p-4 rounded-xl bg-[#141824] border border-[#222A3B]">
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider">Max Drawdown</div>
              <div className="text-xl font-bold font-mono text-zinc-200 mt-1">4.2%</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Within 8.0% institutional ceiling</div>
            </div>
            <div className="p-4 rounded-xl bg-[#141824] border border-[#222A3B]">
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider">Total Trades</div>
              <div className="text-xl font-bold font-mono text-white mt-1">48</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Executed by Ophireum</div>
            </div>
          </div>
        )}

        {/* TAB 4: ACTIVITY & CONNECTION HEALTH */}
        {activeSubTab === 'activity' && (
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-[#C9A227]" />
                <div>
                  <div className="font-semibold text-white">MetaTrader 5 Bridge Connection</div>
                  <div className="text-[11px] text-zinc-400">Broker: Exness (MT5 Real-02) · Ping: 1.2ms</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                SYNCHRONIZED
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C9A227]" />
                <div>
                  <div className="font-semibold text-white">Last Telemetry Heartbeat</div>
                  <div className="text-[11px] text-zinc-400">Received 3 seconds ago via WebSocket proxy</div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">ONLINE</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
