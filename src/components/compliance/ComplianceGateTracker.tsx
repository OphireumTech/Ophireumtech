/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM 13-Gate Compliance Progress Tracker
 */

import React from 'react';
import {
  CheckCircle2,
  Clock,
  Lock,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { ComplianceGate, ComplianceGateId } from '../../types/compliance';
import { complianceEngine } from '../../services/complianceEngine';

export interface ComplianceGateTrackerProps {
  gates?: ComplianceGate[];
  activeGateId?: string;
  onSelectGate?: (gate: ComplianceGate) => void;
  onNavigateToGate?: (gateId: ComplianceGateId | string) => void;
  compact?: boolean;
}

export const ComplianceGateTracker: React.FC<ComplianceGateTrackerProps> = ({
  gates: initialGates,
  activeGateId,
  onSelectGate,
  onNavigateToGate,
  compact = false
}) => {
  const [engineGates, setEngineGates] = React.useState<ComplianceGate[]>(() => {
    return initialGates || complianceEngine.getState().gates;
  });

  React.useEffect(() => {
    if (initialGates) {
      setEngineGates(initialGates);
    } else {
      return complianceEngine.subscribe(state => {
        setEngineGates(state.gates);
      });
    }
  }, [initialGates]);

  const gates = engineGates;
  const completedCount = gates.filter(g => g.status === 'completed' || g.status === 'exempt').length;
  const totalCount = gates.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;

  if (compact) {
    return (
      <div className="p-3.5 rounded-2xl bg-[#0D1017] border border-[#1E2538] shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-[#E4C765]" />
            <span className="font-bold text-white uppercase tracking-wider">COMPLIANCE PROGRESS</span>
          </div>
          <span className="font-mono text-[#E4C765] font-bold">{completedCount} / {totalCount} GATES ({pct}%)</span>
        </div>
        <div className="w-full bg-[#161B28] h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#C9A227] to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-6 text-left">
      {/* Header & Metric */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2538] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#E4C765]">
            <ShieldCheck className="w-4 h-4" />
            <span>MANDATORY ONBOARDING & EXECUTION ARCHITECTURE</span>
          </div>
          <h2 className="text-xl font-bold text-white font-serif mt-1">
            STATUTORY COMPLIANCE GATES
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            All applicable regulatory, AML, risk disclosure, and digital agreement gates must be satisfied prior to automated EA activation.
          </p>
        </div>

        <div className="shrink-0 text-right font-mono p-3 rounded-2xl bg-[#121624] border border-[#1F263A]">
          <div className="text-[11px] text-zinc-400 uppercase">Verification Level</div>
          <div className="text-lg font-bold text-[#E4C765]">
            {completedCount} / {totalCount} <span className="text-xs text-zinc-400 font-sans font-normal">Completed</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
            {completedCount === totalCount ? 'READY FOR EA ACTIVATION' : `${totalCount - completedCount} GATES REMAINING`}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono text-zinc-400">
          <span>Overall Readiness</span>
          <span className="text-[#E4C765] font-bold">{pct}%</span>
        </div>
        <div className="w-full bg-[#161B28] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#20283A]">
          <div
            className="bg-gradient-to-r from-[#C9A227] via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Demo Notice */}
      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 flex items-center justify-between text-xs text-amber-300">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="px-1.5 py-0.5 rounded bg-amber-900/60 font-bold border border-amber-700/50">DEMO / DEV</span>
          <span>Regulatory verifications, OCR scanning, and sanctions screening operate in simulated sandbox mode.</span>
        </div>
        <span className="text-[10px] text-zinc-400 hidden sm:inline">SHA-256 Validated</span>
      </div>

      {/* Gates Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {gates.map(gate => {
          const isSelected = activeGateId === gate.id;
          const isDone = gate.status === 'completed';
          const isInReview = gate.status === 'in_review';
          const isExempt = gate.status === 'exempt';
          const isLocked = gate.status === 'locked';

          return (
            <div
              key={gate.id}
              onClick={() => {
                if (onSelectGate) onSelectGate(gate);
                if (onNavigateToGate) onNavigateToGate(gate.id);
              }}
              className={`p-3.5 rounded-2xl border transition-all text-left flex items-start justify-between gap-3 ${
                (onSelectGate || onNavigateToGate) ? 'cursor-pointer hover:border-[#C9A227]/40 hover:bg-[#131724]' : ''
              } ${
                isSelected
                  ? 'bg-[#151A28] border-[#C9A227] shadow-lg shadow-[#C9A227]/10'
                  : isDone
                  ? 'bg-[#0E121B] border-[#1C2336]'
                  : isInReview
                  ? 'bg-[#151820] border-amber-800/50'
                  : isLocked
                  ? 'bg-[#0A0C12] border-[#141824] opacity-60'
                  : 'bg-[#0E121B] border-[#1A2132]'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="shrink-0 mt-0.5">
                  {isDone ? (
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isExempt ? (
                    <div className="w-7 h-7 rounded-xl bg-zinc-800/40 border border-zinc-700/40 text-zinc-400 flex items-center justify-center font-mono text-[10px]">
                      N/A
                    </div>
                  ) : isInReview ? (
                    <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                      <Clock className="w-4 h-4 animate-spin-slow" />
                    </div>
                  ) : isLocked ? (
                    <div className="w-7 h-7 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-600 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-xl bg-[#C9A227]/15 border border-[#C9A227]/30 text-[#E4C765] flex items-center justify-center font-mono text-xs font-bold">
                      {gate.gateNumber}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                      Gate {gate.gateNumber.toString().padStart(2, '0')}
                    </span>
                    {isDone && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/70 border border-emerald-800/40 text-emerald-400 font-semibold">
                        PASSED
                      </span>
                    )}
                    {isInReview && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/70 border border-amber-800/40 text-amber-400 font-semibold">
                        UNDER REVIEW
                      </span>
                    )}
                    {isExempt && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                        EXEMPT (INDIVIDUAL)
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white mt-0.5 truncate">{gate.title}</h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">{gate.description}</p>
                  {gate.completedAt && (
                    <div className="text-[10px] font-mono text-zinc-400 mt-1">
                      Cleared: {new Date(gate.completedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {onSelectGate && (
                <div className="text-zinc-600 hover:text-zinc-300 shrink-0 self-center">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
