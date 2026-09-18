/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Subscription & Payment Experience
 * Sections 28 & 29: Clear license overview, renewal flow, USDT settlement wizard
 * with simulated block confirmations and instant license activation.
 */

import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  QrCode,
  Copy,
  RefreshCw,
  ExternalLink,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SubscriptionView: React.FC = () => {
  const { addToast } = useApp();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedPlan, setSelectedPlan] = useState<'Starter' | 'Professional' | 'Enterprise'>('Professional');
  const [selectedNetwork, setSelectedNetwork] = useState<'USDT-TRC20' | 'USDT-BEP20' | 'USDT-ERC20'>('USDT-TRC20');
  const [copied, setCopied] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const planPrices = {
    Starter: 499,
    Professional: 1499,
    Enterprise: 3999
  };

  const depositAddress = selectedNetwork === 'USDT-TRC20'
    ? 'TWhK1Jp8uE928xKqMnp5o1Z8Xy294KaB7w'
    : selectedNetwork === 'USDT-BEP20'
    ? '0x71C...49b2C8395B2d1'
    : '0xd8d...A71b962381a';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Address Copied', 'USDT deposit address copied to clipboard.', 'info');
  };

  const handleSimulatePayment = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      setCheckoutStep(5);
      addToast(
        'Payment Confirmed',
        `12/12 block confirmations verified on ${selectedNetwork}. Your ${selectedPlan} license is active.`,
        'success'
      );
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Current License Card (Section 28) */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2538] pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                MEMBERSHIP & LICENSE
              </div>
              <h1 className="text-lg font-bold text-white font-serif tracking-wide">
                PROFESSIONAL PLAN
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
              ACTIVE LICENSE
            </span>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B]">
            <div className="text-[11px] text-zinc-400 font-medium">Activation Date</div>
            <div className="text-xs font-bold text-white font-mono mt-1">Sept 14, 2026</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Annual billing</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B]">
            <div className="text-[11px] text-zinc-400 font-medium">Expiration Date</div>
            <div className="text-xs font-bold text-[#E4C765] font-mono mt-1">Sept 14, 2027</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">328 days remaining</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B]">
            <div className="text-[11px] text-zinc-400 font-medium">Bound Account</div>
            <div className="text-xs font-bold text-white font-mono mt-1">Exness MT5 #889210</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Hardware locked</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B]">
            <div className="text-[11px] text-zinc-400 font-medium">Auto-Renewal</div>
            <div className="text-xs font-bold text-white mt-1">Manual (USDT)</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Zero auto-debit</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setCheckoutStep(1);
              setShowCheckoutModal(true);
            }}
            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] hover:brightness-110 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#C9A227]/15 transition-all"
          >
            <span>RENEW OR EXTEND LICENSE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedPlan('Enterprise');
              setCheckoutStep(1);
              setShowCheckoutModal(true);
            }}
            className="py-3 px-6 rounded-2xl bg-[#141926] hover:bg-[#1D2436] border border-[#263048] text-zinc-300 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Upgrade to Enterprise
          </button>
        </div>
      </div>

      {/* Payment History Collapsible List (Section 28) */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E2538] pb-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Payment & Invoice History
          </h2>
          <span className="text-[10px] text-zinc-500 font-mono">1 record</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-white">Invoice #OPH-2026-9812</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              Professional Plan License (1 Year) · Paid via USDT-TRC20
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-mono font-bold text-white">$1,499.00 USDT</div>
              <div className="text-[10px] text-zinc-500">Sept 14, 2026</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
              COMPLETED
            </span>
          </div>
        </div>
      </div>

      {/* CHECKOUT WIZARD MODAL (Section 29) */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0D1017] border border-[#222B3D] shadow-2xl p-6 space-y-6 text-left animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1E2538] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#E4C765]">Step {checkoutStep} of 5</span>
                <h3 className="text-base font-bold text-white font-serif">USDT License Checkout</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#141926] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: SELECT PLAN */}
            {checkoutStep === 1 && (
              <div className="space-y-3">
                <div className="text-xs text-zinc-400">Select license tier to renew or upgrade:</div>
                {(['Starter', 'Professional', 'Enterprise'] as const).map(plan => (
                  <div
                    key={plan}
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-colors flex items-center justify-between ${
                      selectedPlan === plan
                        ? 'bg-[#C9A227]/15 border-[#C9A227] text-white'
                        : 'bg-[#141824] border-[#222A3B] text-zinc-300 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm">{plan} Plan</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {plan === 'Starter' && 'Single MT5 account, Standard risk limits'}
                        {plan === 'Professional' && 'Institutional priority, Custom risk boundaries'}
                        {plan === 'Enterprise' && 'Multi-account allocation, Direct engineering support'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-[#E4C765]">
                        ${planPrices[plan]} USDT
                      </div>
                      <div className="text-[10px] text-zinc-500">12 Months</div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Choose Network</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SELECT NETWORK */}
            {checkoutStep === 2 && (
              <div className="space-y-3">
                <div className="text-xs text-zinc-400">Select payment blockchain for USDT transfer:</div>
                {[
                  { id: 'USDT-TRC20', name: 'Tron (TRC-20)', fee: '~1 USDT fee', time: '< 2 minutes' },
                  { id: 'USDT-BEP20', name: 'BNB Smart Chain (BEP-20)', fee: '~0.30 USDT fee', time: '< 1 minute' },
                  { id: 'USDT-ERC20', name: 'Ethereum (ERC-20)', fee: '~5 USDT fee', time: '~ 5 minutes' }
                ].map(net => (
                  <div
                    key={net.id}
                    onClick={() => setSelectedNetwork(net.id as any)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-colors flex items-center justify-between ${
                      selectedNetwork === net.id
                        ? 'bg-[#C9A227]/15 border-[#C9A227] text-white'
                        : 'bg-[#141824] border-[#222A3B] text-zinc-300 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm">{net.name}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{net.fee} · {net.time}</div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#E4C765]">{net.id}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(1)}
                    className="px-4 py-2 text-xs text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW ORDER */}
            {checkoutStep === 3 && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#141824] border border-[#222A3B] space-y-2">
                  <div className="flex justify-between text-zinc-300">
                    <span>Plan:</span>
                    <strong className="text-white">{selectedPlan} License (12 Months)</strong>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Settlement Network:</span>
                    <strong className="text-[#E4C765] font-mono">{selectedNetwork}</strong>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Account License Binding:</span>
                    <span className="font-mono text-white">Exness MT5 #889210</span>
                  </div>
                  <div className="border-t border-[#1F2638] pt-2 flex justify-between text-sm font-bold text-white">
                    <span>Total Amount:</span>
                    <span className="text-[#E4C765] font-mono">${planPrices[selectedPlan]}.00 USDT</span>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500">
                  By proceeding, you authorize generation of a dedicated one-time crypto payment address. Licenses activate automatically upon 12 blockchain confirmations.
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(2)}
                    className="px-4 py-2 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(4)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Generate Deposit Address</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: DEPOSIT ADDRESS & SIMULATED CONFIRMATION */}
            {checkoutStep === 4 && (
              <div className="space-y-4 text-center">
                <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-2xl flex items-center justify-center shadow-lg">
                  <QrCode className="w-full h-full text-black" />
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-zinc-400">Send exactly:</div>
                  <div className="text-xl font-bold font-mono text-[#E4C765]">
                    ${planPrices[selectedPlan]}.00 USDT
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400">Network: {selectedNetwork}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#141824] border border-[#222A3B] flex items-center justify-between text-xs font-mono">
                  <span className="truncate max-w-[280px] text-zinc-300">{depositAddress}</span>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="p-1.5 rounded-lg bg-[#1E2638] hover:bg-[#2A354E] text-white cursor-pointer"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Simulated confirmation button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={isConfirming}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {isConfirming ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>Verifying Block Confirmations (12/12)...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-black" />
                        <span>Simulate Transfer Confirmation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: INSTANT ACTIVATION CONFIRMATION */}
            {checkoutStep === 5 && (
              <div className="space-y-4 text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-base font-bold text-white font-serif">License Activated Successfully</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Your {selectedPlan} Plan has been extended for 365 days.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141824] border border-[#222A3B] text-xs font-mono space-y-1 text-left">
                  <div className="flex justify-between text-zinc-400">
                    <span>Transaction Hash:</span>
                    <span className="text-emerald-400">0x8f2...e491a (Verified)</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>License Key:</span>
                    <span className="text-white">OPH-PRO-2026-XAU</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="w-full py-2.5 rounded-xl bg-[#1E2538] hover:bg-[#28324C] text-white font-bold text-xs cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
