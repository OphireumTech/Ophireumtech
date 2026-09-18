/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM SIMULATED SUBSCRIPTION & USDT PAYMENT ENGINE
 * Sections 72 & 73: Interactive simulation of USDT license payment, invoice generation, blockchain confirmations, and automated activation.
 */

import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  QrCode,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { DemoInvoice } from '../../types/demo';
import { demoEngine } from '../../services/demoEngine';

interface DemoPaymentSimulatorProps {
  invoices?: DemoInvoice[];
  plans?: any[];
  user?: any;
  addToast?: (title: string, msg: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
}

export const DemoPaymentSimulator: React.FC<DemoPaymentSimulatorProps> = ({ invoices = [], plans, user, addToast }) => {
  const [selectedPlan, setSelectedPlan] = useState<'Starter' | 'Professional' | 'Premium'>('Professional');
  const [network, setNetwork] = useState<'USDT-TRC20' | 'USDT-BEP20' | 'USDT-ERC20'>('USDT-TRC20');
  const [activeInvoice, setActiveInvoice] = useState<DemoInvoice | null>(() => {
    if (invoices && invoices.length > 0) return invoices[0];
    const engineState = typeof demoEngine !== 'undefined' ? demoEngine.getState() : null;
    return engineState?.activeInvoice || engineState?.invoices?.[0] || null;
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [copied, setCopied] = useState(false);

  const planPrices: Record<string, number> = {
    Starter: 199.00,
    Professional: 699.00,
    Premium: 2499.00
  };

  const dummyAddresses = {
    'USDT-TRC20': 'T9yD14Nj9j7xAB4dbGeiX9h8unkkhxmTrcDemo',
    'USDT-BEP20': '0x71C8756DA733174538522929e5B6653702Demo99',
    'USDT-ERC20': '0xdAC17F958D2ee523a2206206994597C13D83Demo'
  };

  const handleCreateInvoice = () => {
    const amount = planPrices[selectedPlan];
    const newInv = demoEngine.createDemoInvoice(
      selectedPlan,
      amount,
      network,
      dummyAddresses[network]
    );
    setActiveInvoice(newInv);
    if (addToast) {
      addToast(
        'Simulated Invoice Created',
        `Invoice #${newInv.id} issued for ${selectedPlan} ($${amount} USDT).`,
        'info'
      );
    }
  };

  const handleRunPaymentSequence = () => {
    if (!activeInvoice) return;
    setIsSimulating(true);

    const states: DemoInvoice['status'][] = [
      'PAYMENT DETECTED',
      'CONFIRMING',
      'CONFIRMED — DEMO',
      'LICENSE ACTIVATED'
    ];

    states.forEach((st, idx) => {
      setTimeout(() => {
        demoEngine.advanceInvoiceStatus(activeInvoice.id, st);
        setActiveInvoice(prev => prev ? { ...prev, status: st } : null);

        if (idx === states.length - 1) {
          setIsSimulating(false);
          if (addToast) {
            addToast(
              'License Activated — DEMO',
              'Simulated payment finalized. 12/12 block confirmations verified.',
              'success'
            );
          }
        }
      }, (idx + 1) * 800);
    });
  };

  return (
    <div className="bg-[#0D1017] border border-[#232A3B] rounded-2xl p-5 sm:p-7 space-y-6 text-left shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E2536] pb-4">
        <div>
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#E4C765] font-bold">
            Sections 72 & 73 • Licensing & Payment Pipeline
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
            <span>SIMULATED SUBSCRIPTION PURCHASE & USDT SETTLEMENT</span>
            <span className="px-2 py-0.5 rounded bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#E4C765] text-xs font-mono">
              SIMULATED
            </span>
          </h2>
        </div>

        {/* Isolation Notice */}
        <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>DO NOT SEND REAL FUNDS — TEST ENGINE</span>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(['Starter', 'Professional', 'Premium'] as const).map(plan => (
          <button
            key={plan}
            type="button"
            onClick={() => setSelectedPlan(plan)}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              selectedPlan === plan
                ? 'bg-[#C9A227]/10 border-[#C9A227] shadow-lg'
                : 'bg-[#121622] border-[#232A3B] hover:border-[#2B354C]'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-white text-sm">{plan} Package</span>
              <span className="font-mono text-sm text-[#E4C765] font-bold">
                ${planPrices[plan]}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">
              {plan === 'Starter' && 'Single MT5 live terminal binding'}
              {plan === 'Professional' && 'Up to 3 MT5 terminal bindings + VPS'}
              {plan === 'Premium' && 'Unlimited MT5 terminals + Institutional telemetry'}
            </div>
          </button>
        ))}
      </div>

      {/* Network Selector & Issue Button */}
      <div className="p-4 rounded-xl bg-[#121622] border border-[#1E2536] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 font-medium">Select Settlement Network:</span>
          <div className="flex rounded-lg bg-[#141824] border border-[#232A3B] p-0.5 font-mono">
            {(['USDT-TRC20', 'USDT-BEP20', 'USDT-ERC20'] as const).map(net => (
              <button
                key={net}
                type="button"
                onClick={() => setNetwork(net)}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  network === net
                    ? 'bg-[#C9A227] text-[#08090B] font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {net}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCreateInvoice}
          className="px-4 py-2 rounded-lg bg-[#C9A227] hover:bg-[#E4C765] text-[#08090B] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <CreditCard className="w-4 h-4" />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* Active Simulated Invoice Card */}
      {activeInvoice && (
        <div className="p-5 rounded-xl bg-[#090B10] border border-[#1E2536] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#181E2B] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono">INVOICE: #{activeInvoice.id}</span>
              <span className="text-xs text-zinc-400">({activeInvoice.planName})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400">
                {(activeInvoice.amountUSDT || activeInvoice.amount || 0).toFixed(2)} USDT
              </span>
              <span className="px-2 py-0.5 rounded bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#E4C765] text-[10px] font-mono font-bold">
                {activeInvoice.status}
              </span>
            </div>
          </div>

          {/* Payment Address Display */}
          {(() => {
            const depositAddress = activeInvoice.demoDepositAddress || activeInvoice.address || '';
            return (
              <div className="space-y-1">
                <div className="text-[10px] text-zinc-400 uppercase font-mono">
                  Simulated Deposit Address ({activeInvoice.network})
                </div>
                <div className="flex items-center gap-2 bg-[#121622] p-2.5 rounded-lg border border-[#232A3B] font-mono text-xs text-zinc-200">
                  <span className="truncate flex-1">{depositAddress}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(depositAddress);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                      addToast('Address Copied', 'Simulated test address copied to clipboard.', 'info');
                    }}
                    className="p-1.5 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}

          {/* State Machine Action */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] text-zinc-400">
              State Flow: <span className="font-mono text-zinc-300">CREATED &rarr; DETECTED &rarr; CONFIRMING &rarr; ACTIVATED</span>
            </div>

            <button
              type="button"
              disabled={isSimulating || activeInvoice.status === 'LICENSE ACTIVATED'}
              onClick={handleRunPaymentSequence}
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-xs shadow hover:brightness-110 transition-all cursor-pointer disabled:opacity-40 flex items-center gap-2"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Confirming On-Chain (Simulated)...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Simulate Payment & Activate License</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
