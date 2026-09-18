/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Connect Trading Account View
 * Sections 6 & 7: Streamlined broker connection interface with verified brokers
 * (Exness, IC Markets, Pepperstone, XM), connection status, and latency diagnostics.
 */

import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Zap,
  Lock,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConnectAccountView: React.FC = () => {
  const { addToast } = useApp();
  const [isConnected, setIsConnected] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState('Exness');
  const [accountNumber, setAccountNumber] = useState('889210');
  const [server, setServer] = useState('Exness-MT5Real2');

  const approvedBrokers = [
    { name: 'Exness', latency: '1.2 ms', spread: '0.12 pips', status: 'RECOMMENDED' },
    { name: 'IC Markets', latency: '1.4 ms', spread: '0.14 pips', status: 'VERIFIED' },
    { name: 'Pepperstone', latency: '1.8 ms', spread: '0.15 pips', status: 'VERIFIED' },
    { name: 'XM', latency: '2.1 ms', spread: '0.20 pips', status: 'VERIFIED' }
  ];

  const handleReconnect = () => {
    addToast('Account Synchronized', 'Bridge connection to Exness MT5 #889210 re-established.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Current Connection Status Card */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2538] pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                BROKER INFRASTRUCTURE
              </div>
              <h1 className="text-lg font-bold text-white font-serif tracking-wide">
                TRADING ACCOUNT BRIDGE
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              CONNECTED
            </span>
          </div>
        </div>

        {/* 4 Details Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B]">
            <div className="text-[11px] text-zinc-400 font-medium">Broker</div>
            <div className="text-xs font-bold text-white mt-1">Exness Global</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Raw Spread MT5</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B]">
            <div className="text-[11px] text-zinc-400 font-medium">Account ID</div>
            <div className="text-xs font-bold text-white font-mono mt-1">#889210</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Authorized</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B]">
            <div className="text-[11px] text-zinc-400 font-medium">Latency</div>
            <div className="text-xs font-bold text-emerald-400 font-mono mt-1">1.2 ms</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">LD4 Cross-connect</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B]">
            <div className="text-[11px] text-zinc-400 font-medium">Leverage</div>
            <div className="text-xs font-bold text-white font-mono mt-1">1:100</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Margin requirement: 1%</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleReconnect}
            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#C9A227]/15"
          >
            <RefreshCw className="w-4 h-4" />
            <span>RE-SYNC CONNECTION</span>
          </button>
        </div>
      </div>

      {/* Approved Brokers Benchmark (Section 6) */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E2538] pb-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Approved Broker Network
          </h2>
          <span className="text-[10px] text-zinc-500">Tier-1 liquidity feeds</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {approvedBrokers.map(b => (
            <div
              key={b.name}
              className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                b.name === selectedBroker
                  ? 'bg-[#C9A227]/10 border-[#C9A227]/50 text-white'
                  : 'bg-[#141824] border-[#222A3B] text-zinc-300'
              }`}
            >
              <div>
                <div className="font-bold text-sm flex items-center gap-1.5">
                  <span>{b.name}</span>
                  {b.name === selectedBroker && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Latency: <span className="text-emerald-400 font-mono font-medium">{b.latency}</span> · Spread: <span className="font-mono">{b.spread}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C2234] border border-[#2B354C] text-zinc-400">
                {b.status}
              </span>
            </div>
          ))}
        </div>

        <div className="text-[11px] text-zinc-500 pt-2 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Ophireum operates exclusively via encrypted MT5 client bridges. We never have withdrawal access to your broker capital.</span>
        </div>
      </div>
    </div>
  );
};
