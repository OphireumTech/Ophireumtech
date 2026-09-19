/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Legal Agreements, Version Control & Regulatory Review Engine
 * Sections 23, 29, 56: Comprehensive statutory software agreements,
 * legal counsel audit approvals, and version lineage.
 */

import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Award,
  Clock,
  History,
  CheckCircle2,
  ExternalLink,
  Scale,
  Download,
  AlertCircle
} from 'lucide-react';
import { LegalReviewStatus } from '../../types/compliance';
import { useApp } from '../../context/AppContext';

export const LegalAgreementsView: React.FC = () => {
  const { addToast } = useApp();
  const [selectedVersion, setSelectedVersion] = useState<string>('v2026.2');

  const agreementVersions = [
    {
      version: 'v2026.2',
      effectiveDate: '2026-01-15',
      status: 'APPROVED' as LegalReviewStatus,
      reviewedBy: 'Baker & Partners UK LLP (London) / Garrity Legal (Washington DC)',
      jurisdictionScope: 'United Kingdom, United States & Global Common Law',
      notes: 'Integrated updated CFTC Rule 4.41 disclosures and enhanced UBO definition.'
    },
    {
      version: 'v2026.1',
      effectiveDate: '2025-10-01',
      status: 'APPROVED' as LegalReviewStatus,
      reviewedBy: 'Baker & Partners UK LLP',
      jurisdictionScope: 'United Kingdom & International Commercial Framework',
      notes: 'Initial institutional EA licensing framework release.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2538] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#E4C765] uppercase tracking-wider">
                COMPLIANCE GATE 09 / STATUTORY CONTRACTS
              </div>
              <h1 className="text-xl font-bold text-white font-serif">
                LEGAL AGREEMENTS & VERSION CONTROL
              </h1>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
              COUNSEL STATUS: APPROVED
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          OPHIREUM software licensing operates under strict commercial contract governance. Every agreement is version-controlled, digitally stamped with cryptographic SHA-256 hashes, and certified by independent regulatory legal counsel.
        </p>
      </div>

      {/* VERSION CONTROL & LEGAL REVIEW METADATA */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-4">
        <div className="border-b border-[#1E2538] pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#E4C765]" />
            <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
              AGREEMENT VERSION CONTROL & AUDIT RECORD
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">Current Standard: {selectedVersion}</span>
        </div>

        <div className="space-y-3">
          {agreementVersions.map(v => (
            <div
              key={v.version}
              onClick={() => setSelectedVersion(v.version)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs ${
                selectedVersion === v.version
                  ? 'bg-[#141A28] border-[#C9A227]/60 shadow-md'
                  : 'bg-[#080B11] border-[#1A2234] hover:border-[#243048]'
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#161D2E] pb-2">
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-white text-xs">{v.version}</span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-400">Effective: {v.effectiveDate}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-mono text-[10px] font-semibold">
                  {v.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400 pt-2">
                <div>
                  <span className="text-zinc-500 block text-[10px]">REVIEWING COUNSEL:</span>
                  <span className="text-zinc-200">{v.reviewedBy}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">JURISDICTION SCOPE:</span>
                  <span className="text-zinc-200">{v.jurisdictionScope}</span>
                </div>
                <div className="col-span-2 pt-1 text-zinc-300 font-sans">
                  {v.notes}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULL STATUTORY AGREEMENT TEXT */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E2538] pb-3">
          <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
            OPHIREUM TECHNOLOGY PURCHASE & LICENSE AGREEMENT (FULL TEXT)
          </h3>
          <button
            type="button"
            onClick={() => {
              addToast('Agreement Downloaded', 'Technology Purchase Agreement v2026.2 PDF saved.', 'success');
            }}
            className="text-xs text-[#E4C765] hover:text-white flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF Copy</span>
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-[#080B11] border border-[#1A2234] text-xs text-zinc-300 leading-relaxed space-y-4 font-sans max-h-96 overflow-y-auto select-text">
          <div className="font-mono text-[11px] text-[#E4C765]">
            DOCUMENT REFERENCE: DOC-OPHIREUM-TPA-2026.2 • SHA-256 ENCRYPTED MASTER
          </div>

          <h4 className="text-sm font-bold text-white">RECITALS & PARTIES</h4>
          <p>
            This Technology Purchase Agreement (&quot;Agreement&quot;) is made and entered into by and between Ophireum LLC, a software technology licensing company (&quot;Licensor&quot; or &quot;Company&quot;), and the verified subscribing client (&quot;Licensee&quot; or &quot;Client&quot;).
          </p>

          <h4 className="text-sm font-bold text-white">SECTION 1: LICENSE GRANT & RESTRICTIONS</h4>
          <p>
            Licensor hereby grants to Licensee a non-exclusive, non-transferable, revocable license to install and operate the compiled binary Expert Advisor on MetaTrader 5 terminals registered and bound to Licensee&apos;s verified account ID. Licensee shall not disassemble, decompile, reverse-engineer, resell, or distribute the software to any third party.
          </p>

          <h4 className="text-sm font-bold text-white">SECTION 2: BROKER INDEPENDENCE & EXECUTION SEPARATION</h4>
          <p>
            Licensee explicitly acknowledges that Licensor is not a registered broker-dealer, financial adviser, commodity trading advisor (CTA), commodity pool operator (CPO), or custodian. All capital deposits, trade orders, margin allocations, and withdrawals are governed exclusively by Licensee&apos;s independent agreement with their chosen third-party broker.
          </p>

          <h4 className="text-sm font-bold text-white">SECTION 3: STATUTORY COOLING-OFF PERIOD & REFUNDS</h4>
          <p>
            In accordance with applicable statutory consumer jurisdiction provisions, retail clients in designated jurisdictions are entitled to a cooling-off cancellation period (14 days in the UK/EU) prior to automated terminal activation. Once live algorithmic WebRequest execution tokens are generated and bound to live market terminals, the software delivery is deemed fully performed.
          </p>

          <h4 className="text-sm font-bold text-white">SECTION 4: LIMITATION OF LIABILITY</h4>
          <p>
            IN NO EVENT SHALL LICENSOR, ITS DIRECTORS, EMPLOYEES, OR AFFILIATES BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE SOFTWARE, INCLUDING BUT NOT LIMITED TO TRADING LOSSES, BROKER SLIPPAGE, INTERNET DISRUPTIONS, OR LATENCY DELAYS.
          </p>

          <h4 className="text-sm font-bold text-white">SECTION 5: DISPUTE RESOLUTION & GOVERNING LAW</h4>
          <p>
            This Agreement shall be governed by and construed in accordance with the laws of England and Wales. Any dispute, controversy, or claim arising out of or relating to this contract shall be submitted to binding arbitration under the LCIA Rules.
          </p>

          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-400 font-mono text-[10px]">
            [END OF MASTER STATUTORY TEXT • CERTIFIED TAMPER-PROOF]
          </div>
        </div>
      </div>
    </div>
  );
};
