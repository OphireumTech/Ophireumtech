/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM EA / Automated Trading Activation & Authorization Console
 * Section 16: Pre-activation parameter confirmation, risk limits acknowledgement,
 * terminal binding checks, and explicit execution authorization.
 */

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Server,
  Sliders,
  Play,
  Pause,
  Key,
  Terminal
} from 'lucide-react';
import { complianceEngine } from '../../services/complianceEngine';
import { useApp } from '../../context/AppContext';

export const EAAuthorizationView: React.FC = () => {
  const { currentUser, settings, plans, addToast } = useApp();
  const [complianceState, setComplianceState] = useState(() => complianceEngine.getState());

  useEffect(() => {
    return complianceEngine.subscribe(() => {
      setComplianceState(complianceEngine.getState());
    });
  }, []);

  const verifiedBroker = complianceState.brokerAccounts.find(a => a.status === 'verified') || {
    brokerLegalName: 'Pepperstone Markets Limited',
    tradingServer: 'Pepperstone-Live01',
    accountNumber: '8910442',
    accountCurrency: 'USD',
    leverage: '1:100'
  };

  const [confirmations, setConfirmations] = useState({
    authorizeOrders: false,
    reviewedRiskParams: false,
    understandsLossRisk: false,
    understandsBrokerExecution: false,
    confirmsOwnership: false,
    knowsCanDisconnect: false,
    acceptedLiveRisk: false
  });

  const [isActivating, setIsActivating] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  const allConfirmed = Object.values(confirmations).every(Boolean);

  const handleActivate = () => {
    if (!allConfirmed) {
      addToast('Authorization Incomplete', 'Please acknowledge all 7 explicit authorization checkboxes.', 'warning');
      return;
    }
    setIsActivating(true);
    setTimeout(() => {
      setIsActivated(true);
      setIsActivating(false);
      addToast('EA Execution Authorized', `Ophireum Institutional EA v2026.2 bound to MT5 #${verifiedBroker.accountNumber}. WebRequest token active.`, 'success');
    }, 600);
  };

  const handleDeactivate = () => {
    setIsActivated(false);
    addToast('EA Disconnected', 'Algorithmic WebRequest authorization suspended. Terminal execution halted.', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2538] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#E4C765] uppercase tracking-wider">
                COMPLIANCE GATE 13 / TERMINAL BINDING
              </div>
              <h1 className="text-xl font-bold text-white font-serif">
                EA & AUTOMATED TRADING AUTHORIZATION
              </h1>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full font-mono text-xs font-bold border ${
                isActivated
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400'
              }`}
            >
              STATUS: {isActivated ? 'AUTHORIZED & ACTIVE' : 'DISCONNECTED / PAUSED'}
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Before automated order execution can be enabled, you must review the operational parameters, risk caps, and explicitly authorize the compiled Expert Advisor to transmit order payloads to your MT5 account.
        </p>
      </div>

      {/* PARAMETER CONFIRMATION TABLE */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-6">
        <div className="border-b border-[#1E2538] pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
            OPERATIONAL EXECUTION PARAMETERS
          </h3>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold">
            HARDWARE BOUND TO ACCOUNT #{verifiedBroker.accountNumber}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#080B11] border border-[#1A2234]">
            <span className="text-zinc-500 text-[10px] block">TECHNOLOGY / EA:</span>
            <span className="text-white font-bold">Ophireum Sovereign Gold EA</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080B11] border border-[#1A2234]">
            <span className="text-zinc-500 text-[10px] block">COMPILED VERSION:</span>
            <span className="text-[#E4C765] font-bold">v2026.2.4 (EX5 Release)</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080B11] border border-[#1A2234]">
            <span className="text-zinc-500 text-[10px] block">LICENSE KEY:</span>
            <span className="text-zinc-200 truncate block">OPH-XAU-8910442-PRO</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080B11] border border-[#1A2234]">
            <span className="text-zinc-500 text-[10px] block">SUBSCRIPTION TIER:</span>
            <span className="text-emerald-400 font-bold">Institutional Sovereign</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080B11] border border-[#1A2234]">
            <span className="text-zinc-500 text-[10px] block">TARGET BROKER:</span>
            <span className="text-white">{verifiedBroker.brokerLegalName}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080B11] border border-[#1A2234]">
            <span className="text-zinc-500 text-[10px] block">MT5 SERVER:</span>
            <span className="text-white">{verifiedBroker.tradingServer}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080B11] border border-[#1A2234]">
            <span className="text-zinc-500 text-[10px] block">MAX DAILY RISK CAP:</span>
            <span className="text-[#E4C765] font-bold">2.0% Maximum Equity Drawdown</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080B11] border border-[#1A2234]">
            <span className="text-zinc-500 text-[10px] block">SPREAD FILTER LIMIT:</span>
            <span className="text-white">Max 25 Points (2.5 pips)</span>
          </div>
        </div>
      </div>

      {/* EXPLICIT AUTHORIZATION CHECKBOXES */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-4">
        <div className="border-b border-[#1E2538] pb-3">
          <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
            MANDATORY PRE-ACTIVATION CONFIRMATIONS
          </h3>
          <p className="text-[11px] text-zinc-400">
            You must explicitly check each operational condition before triggering automated execution.
          </p>
        </div>

        <div className="space-y-2.5 text-xs">
          {[
            {
              id: 'authorizeOrders',
              title: 'Order Placement Authorization',
              desc: 'I explicitly authorize this compiled EA to place, modify, and close market orders on my designated MT5 trading account.'
            },
            {
              id: 'reviewedRiskParams',
              title: 'Risk Parameter Verification',
              desc: 'I have reviewed the configured lot sizing, maximum daily drawdown stop, and slippage controls, and confirm they match my risk tolerance.'
            },
            {
              id: 'understandsLossRisk',
              title: 'Substantial Risk of Loss',
              desc: 'I acknowledge that spot gold algorithmic trading involves substantial risk of loss and that market volatility can deplete capital.'
            },
            {
              id: 'understandsBrokerExecution',
              title: 'Independent Broker Execution',
              desc: 'I understand that execution occurs directly on my broker server and Ophireum does not control liquidity, latency, or broker slippage.'
            },
            {
              id: 'confirmsOwnership',
              title: 'First-Party Account Ownership',
              desc: 'I confirm that the connected trading account belongs strictly to me or my verified corporate entity and is not a third-party account.'
            },
            {
              id: 'knowsCanDisconnect',
              title: 'Right to Pause & Terminate',
              desc: 'I understand that I retain the unconditional right to pause, adjust, or disconnect the EA at any time directly from the MT5 terminal or portal.'
            },
            {
              id: 'acceptedLiveRisk',
              title: 'Acceptance of Live Market Risks',
              desc: 'I confirm that I have evaluated the technology in demo/backtest simulation or accept full responsibility for live capital operations.'
            }
          ].map(c => {
            const isChecked = (confirmations as any)[c.id];
            return (
              <label
                key={c.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                  isChecked
                    ? 'bg-[#121826] border-[#C9A227]/40 shadow-sm'
                    : 'bg-[#080B11] border-[#182030] hover:border-[#222C42]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={e =>
                    setConfirmations(prev => ({
                      ...prev,
                      [c.id]: e.target.checked
                    }))
                  }
                  className="mt-0.5 w-4 h-4 rounded text-[#C9A227] focus:ring-[#C9A227] border-zinc-700 bg-zinc-900 cursor-pointer shrink-0"
                />
                <div>
                  <div className="font-bold text-white text-[12px]">{c.title}</div>
                  <div className="text-[11px] text-zinc-400 leading-snug mt-0.5">{c.desc}</div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1C2436]">
          <div className="text-xs font-mono text-zinc-400">
            {isActivated ? (
              <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> EA Terminal WebRequest Status: ACTIVE & HEALTHY
              </span>
            ) : (
              <span className="text-amber-400">
                Awaiting authorization confirmation before terminal activation
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isActivated ? (
              <button
                type="button"
                onClick={handleDeactivate}
                className="px-5 py-2.5 rounded-xl bg-rose-950/60 border border-rose-800/60 hover:bg-rose-900/60 text-rose-300 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <Pause className="w-4 h-4" />
                <span>Pause / Disconnect EA Execution</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={!allConfirmed || isActivating}
                onClick={handleActivate}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xl cursor-pointer ${
                  allConfirmed && !isActivating
                    ? 'bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black hover:brightness-110'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>AUTHORIZE AND ACTIVATE TRADING TECHNOLOGY</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
