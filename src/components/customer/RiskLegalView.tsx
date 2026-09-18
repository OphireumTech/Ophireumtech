/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Risk & Legal Disclosures View
 * Section 33: Complete statutory documentation, algorithmic risk notices,
 * terms of service, and broker disclaimers.
 */

import React, { useState } from 'react';
import { FileCheck, ShieldAlert, FileText, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

export const RiskLegalView: React.FC = () => {
  const [expandedDoc, setExpandedDoc] = useState<string | null>('risk');

  const documents = [
    {
      id: 'risk',
      title: 'High-Risk Investment & Leverage Disclosure',
      date: 'Effective Sept 2026',
      summary: 'Trading gold (XAUUSD) and leveraged contracts carries a high level of risk and may not be suitable for all investors. Leverage can work against you as well as for you.',
      body: 'Financial instruments, particularly spot gold and CFD contracts, carry a high degree of volatility. Past algorithmic performance or backtested statistics do not guarantee future results. You should carefully consider your financial situation and consult independent financial advisors before connecting automated execution technology.'
    },
    {
      id: 'auto',
      title: 'Automated Trading & Algorithmic Technology Disclosure',
      date: 'Effective Sept 2026',
      summary: 'Ophireum provides algorithmic software that connects via MT5 bridge. The client retains full ownership of the broker account.',
      body: 'Ophireum LLC is a technology provider, not a broker-dealer or investment advisor. Ophireum Expert Assistant generates and executes algorithmic orders based on pre-defined mathematical logic and Smart Money Concepts (SMC). Users retain the right to pause, disconnect, or override execution at any time.'
    },
    {
      id: 'broker',
      title: 'Broker Execution & Slippage Disclaimer',
      date: 'Effective Sept 2026',
      summary: 'Order execution speed, spread width, and slippage depend on your independent broker and liquidity provider.',
      body: 'Ophireum is not responsible for broker latency spikes, order rejection, spread expansion during high-impact macroeconomic announcements, or server outages originating on the broker side.'
    },
    {
      id: 'terms',
      title: 'Software License Terms of Service',
      date: 'Effective Sept 2026',
      summary: 'Your license grants non-exclusive, non-transferable access for the authorized MetaTrader 5 account ID.',
      body: 'Each annual license tier is hardware and account bound to protect algorithmic intellectual property. Redistribution, reverse engineering, or unauthorized sublicensing of Ophireum code is strictly prohibited.'
    },
    {
      id: 'privacy',
      title: 'Privacy & Data Protection Policy',
      date: 'Effective Sept 2026',
      summary: 'All KYC identity documents and broker tokens are encrypted with military-grade AES-256 standard.',
      body: 'We do not sell, rent, or distribute client trading telemetry or personal KYC files to unauthorized third parties. Server logs are purged regularly according to regulatory retention requirements.'
    },
    {
      id: 'demo',
      title: 'Demonstration & Simulation Environment Disclaimer',
      date: 'Effective Sept 2026',
      summary: 'Simulated demo sessions replicate real-market XAUUSD conditions with virtual capital for QA and evaluation.',
      body: 'Demo accounts operate in an isolated virtual execution sandbox. No real capital is exposed during demo simulation. While simulated prices track live market feeds, execution latency and liquidity fills may differ from live market conditions.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-2xl space-y-4">
        <div className="flex items-center gap-3.5 border-b border-[#1E2538] pb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
              COMPLIANCE & REGULATION
            </div>
            <h1 className="text-lg font-bold text-white font-serif tracking-wide">
              STATUTORY & RISK DOCUMENTATION
            </h1>
          </div>
        </div>

        <p className="text-xs text-zinc-400">
          Review our formal legal disclosures, risk warnings, and technological license agreements.
        </p>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {documents.map(doc => {
          const isExpanded = expandedDoc === doc.id;
          return (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-[#0D1017] border border-[#1E2538] shadow-md transition-all"
            >
              <button
                type="button"
                onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                className="w-full text-left flex items-start justify-between gap-4 cursor-pointer"
              >
                <div>
                  <div className="text-xs font-mono text-[#E4C765]">{doc.date}</div>
                  <h3 className="text-sm font-bold text-white mt-0.5">{doc.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{doc.summary}</p>
                </div>
                <div className="p-1 rounded-lg bg-[#141824] text-zinc-400 hover:text-white shrink-0 mt-1">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-[#181E2B] text-xs text-zinc-300 leading-relaxed space-y-2 animate-in fade-in-50">
                  <p>{doc.body}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
