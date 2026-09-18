/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Compliance System: Performance Claim Review & Mandatory Disclosures
 * Enforces strict CFTC Rule 4.41 style hypothetical trading disclosures and compliance tracking.
 */

import React from 'react';
import { AlertTriangle, ShieldCheck, FileText, Info } from 'lucide-react';

export interface PerformanceClaim {
  claimId: string;
  claimText: string;
  category: 'hypothetical' | 'simulated' | 'backtested' | 'actual_demo' | 'actual_live';
  dataSource: string;
  measurementPeriod: string;
  accountSource: string;
  grossNet: 'gross' | 'net';
  methodology: string;
  feesTreatment: string;
  materialAssumptions: string[];
  limitations: string[];
  supportingDocumentation: string;
  approvalStatus: 'APPROVED' | 'REVIEW_REQUIRED' | 'DRAFT' | 'REJECTED' | 'EXPIRED';
  approver: string;
  approvalDate: string;
  expirationDate: string;
}

// Immutable registry of reviewed and approved technical benchmark claims
export const APPROVED_PERFORMANCE_CLAIMS: Record<string, PerformanceClaim> = {
  'CLM-XAU-2026-01': {
    claimId: 'CLM-XAU-2026-01',
    claimText: 'Algorithmic strategy backtest under London/New York session overlap volatility models (XAUUSD tick data).',
    category: 'backtested',
    dataSource: 'Historical Institutional MetaTrader 5 Tick Archive (London/NY Session Overlap)',
    measurementPeriod: 'January 2, 2024 – December 31, 2024 (Simulated)',
    accountSource: 'Simulated Execution Environment (Raw Spread ECN Model)',
    grossNet: 'net',
    methodology: 'Tick-by-tick backtest simulation with modeled slippage (0.2 pips avg) and commission ($7.00/lot round-turn).',
    feesTreatment: 'Deducts standard institutional broker commissions and variable spread widening.',
    materialAssumptions: [
      'Assumes zero server downtime and instant WebRequest handshake latency (<5ms).',
      'Assumes continuous liquidity at modeled tick prices without catastrophic slippage.',
      'Mandatory hard stop-loss applied to every simulated ticket.'
    ],
    limitations: [
      'Simulated results do not reflect actual market execution or broker liquidity blackouts.',
      'Past performance is not an indicator or guarantee of future trading performance.',
      'Does not account for psychological stress or manual operator intervention.'
    ],
    supportingDocumentation: 'Archived Audit Report #OPH-BT-2024-XAU-v2',
    approvalStatus: 'APPROVED',
    approver: 'Compliance Review Board',
    approvalDate: '2026-01-15',
    expirationDate: '2026-12-31'
  }
};

interface PerformanceClaimDisclosureProps {
  claimId?: string;
  showFullDetails?: boolean;
}

export const PerformanceClaimDisclosure: React.FC<PerformanceClaimDisclosureProps> = ({
  claimId = 'CLM-XAU-2026-01',
  showFullDetails = false
}) => {
  const claim = APPROVED_PERFORMANCE_CLAIMS[claimId];

  return (
    <div className="rounded-xl border border-amber-800/40 bg-[#0C0E14] p-4 text-xs text-zinc-300 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2 text-amber-400 font-semibold">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>MANDATORY STATUTORY PERFORMANCE & HYPOTHETICAL DISCLOSURE</span>
        </div>
        {claim && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-[#E4C765] border border-zinc-700">
            {claim.claimId} • {claim.approvalStatus}
          </span>
        )}
      </div>

      {/* Mandatory CFTC Rule 4.41 Equivalent Text in Immediate Proximity */}
      <div className="p-3 rounded-lg bg-black/40 border border-zinc-800/80 text-[11px] text-zinc-300 leading-relaxed font-mono">
        <p className="font-bold text-amber-300/90 mb-1">
          CFTC RULE 4.41 / REGULATORY WARNING REGARDING HYPOTHETICAL RESULTS:
        </p>
        <p>
          HYPOTHETICAL OR SIMULATED PERFORMANCE RESULTS HAVE CERTAIN INHERENT LIMITATIONS. UNLIKE AN ACTUAL PERFORMANCE RECORD, SIMULATED RESULTS DO NOT REPRESENT ACTUAL TRADING. ALSO, SINCE THE TRADES HAVE NOT ACTUALLY BEEN EXECUTED, THE RESULTS MAY HAVE UNDER- OR OVER-COMPENSATED FOR THE IMPACT, IF ANY, OF CERTAIN MARKET FACTORS, SUCH AS LACK OF LIQUIDITY. SIMULATED TRADING PROGRAMS IN GENERAL ARE ALSO SUBJECT TO THE FACT THAT THEY ARE DESIGNED WITH THE BENEFIT OF HINDSIGHT. NO REPRESENTATION IS BEING MADE THAT ANY ACCOUNT WILL OR IS LIKELY TO ACHIEVE PROFITS OR LOSSES SIMILAR TO THOSE SHOWN.
        </p>
      </div>

      {claim && showFullDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-zinc-400 pt-1">
          <div>
            <span className="text-zinc-500">Category:</span>{' '}
            <span className="text-zinc-200 font-semibold uppercase">{claim.category.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="text-zinc-500">Data Source:</span>{' '}
            <span className="text-zinc-200">{claim.dataSource}</span>
          </div>
          <div>
            <span className="text-zinc-500">Period:</span>{' '}
            <span className="text-zinc-200">{claim.measurementPeriod}</span>
          </div>
          <div>
            <span className="text-zinc-500">Fees / Expenses:</span>{' '}
            <span className="text-zinc-200">{claim.feesTreatment}</span>
          </div>
        </div>
      )}
    </div>
  );
};
