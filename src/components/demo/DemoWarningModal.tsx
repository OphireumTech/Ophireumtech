/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM DEMONSTRATION ENVIRONMENT DISCLAIMER MODAL
 * Section 65: Mandatory First-Login Acknowledgment for Development / Simulation Session
 */

import React from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface DemoWarningModalProps {
  isOpen?: boolean;
  onAcknowledge?: () => void;
  onAccept?: () => void;
}

export const DemoWarningModal: React.FC<DemoWarningModalProps> = ({ isOpen = true, onAcknowledge, onAccept }) => {
  if (!isOpen) return null;

  const handleConfirm = onAcknowledge || onAccept || (() => {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0D1017] border border-[#2B354C] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-left">
        <div className="flex items-center gap-3 border-b border-[#1E2330] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-[#E4C765] font-bold">
              Isolated Simulation Notice
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              OPHIREUM DEMONSTRATION ENVIRONMENT
            </h2>
          </div>
        </div>

        <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
          <p className="bg-[#141824] p-4 rounded-xl border border-[#2B354C] text-zinc-200">
            This environment simulates live platform functionality for development, demonstration and testing.
            Trading activity, balances, identity verification, payments and external-service responses may contain
            simulated data and do not represent actual financial transactions.
          </p>

          <div className="space-y-2 text-[11px] text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero connection to real broker capital or live customer bank accounts.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Simulated USDT addresses are test fixtures — never deposit real crypto assets.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Deterministic mathematical engine models realistic wins, losses, and drawdowns.</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-xs tracking-wider uppercase shadow-lg hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>I UNDERSTAND — CONTINUE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
