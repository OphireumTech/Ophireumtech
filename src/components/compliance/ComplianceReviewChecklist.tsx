/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Internal Compliance & Regulatory Assessment Console
 * Provides administrative oversight for Sections 16, 29, and 30 compliance checklists.
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers
} from 'lucide-react';

interface RegulatoryAssessmentItem {
  id: string;
  regulator: string;
  fullBodyName: string;
  jurisdiction: string;
  applicableLaws: string;
  status: 'NOT ASSESSED' | 'UNDER LEGAL REVIEW' | 'NOT APPLICABLE' | 'REGISTRATION REQUIRED' | 'REGISTERED' | 'RESTRICTED';
  rationale: string;
  lastReviewDate: string;
  reviewNotes: string;
}

interface ComplianceContentItem {
  contentId: string;
  page: string;
  statement: string;
  category: 'performance' | 'status' | 'safety' | 'licensing';
  status: 'APPROVED' | 'REVIEW REQUIRED' | 'DRAFT' | 'REJECTED' | 'EXPIRED';
  jurisdictionScope: string;
  legalBasis: string;
  lastReview: string;
}

export const ComplianceReviewConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'regulators' | 'registry'>('regulators');

  const [assessments] = useState<RegulatoryAssessmentItem[]>([
    {
      id: 'REG-US-SEC',
      regulator: 'SEC',
      fullBodyName: 'U.S. Securities and Exchange Commission',
      jurisdiction: 'United States (Federal)',
      applicableLaws: 'Securities Act of 1933, Investment Advisers Act of 1940',
      status: 'NOT APPLICABLE',
      rationale: 'Ophireum licenses compiled software only; does not issue securities or provide individualized investment advice.',
      lastReviewDate: '2026-01-20',
      reviewNotes: 'Verified: No discretionary management or pooled funds managed.'
    },
    {
      id: 'REG-US-CFTC',
      regulator: 'CFTC',
      fullBodyName: 'Commodity Futures Trading Commission',
      jurisdiction: 'United States (Federal)',
      applicableLaws: 'Commodity Exchange Act (CEA), CFTC Rule 4.41',
      status: 'UNDER LEGAL REVIEW',
      rationale: 'Software operates on spot/CFD gold (XAUUSD). Algorithmic rule publishing evaluated under CTA software publisher safe harbor exemptions.',
      lastReviewDate: '2026-02-01',
      reviewNotes: 'Mandatory Rule 4.41 hypothetical trading disclosure strictly integrated in all materials.'
    },
    {
      id: 'REG-US-NFA',
      regulator: 'NFA',
      fullBodyName: 'National Futures Association',
      jurisdiction: 'United States',
      applicableLaws: 'NFA Compliance Rule 2-29 (Communications with the Public)',
      status: 'UNDER LEGAL REVIEW',
      rationale: 'Non-member software vendor review for promotional standards.',
      lastReviewDate: '2026-02-01',
      reviewNotes: 'All unverified win-rate and guarantee claims eliminated from codebase.'
    },
    {
      id: 'REG-US-FINRA',
      regulator: 'FINRA',
      fullBodyName: 'Financial Industry Regulatory Authority',
      jurisdiction: 'United States',
      applicableLaws: 'FINRA Rule 2210 (Communications with the Public)',
      status: 'NOT APPLICABLE',
      rationale: 'Ophireum is not a registered broker-dealer or associated person; orders execute on client broker.',
      lastReviewDate: '2026-01-20',
      reviewNotes: 'No broker-dealer intermediation conducted.'
    },
    {
      id: 'REG-US-FINCEN',
      regulator: 'FinCEN',
      fullBodyName: 'Financial Crimes Enforcement Network',
      jurisdiction: 'United States (Federal)',
      applicableLaws: 'Bank Secrecy Act (BSA) / MSB Regulations',
      status: 'NOT APPLICABLE',
      rationale: 'Ophireum accepts digital payment exclusively as commercial software purchase price; does not transmit money for third parties.',
      lastReviewDate: '2026-01-18',
      reviewNotes: 'Commercial vendor exemption applies.'
    },
    {
      id: 'REG-US-FTC',
      regulator: 'FTC',
      fullBodyName: 'Federal Trade Commission',
      jurisdiction: 'United States (Consumer Protection)',
      applicableLaws: 'FTC Act Section 5 (Unfair or Deceptive Trade Practices)',
      status: 'REGISTERED',
      rationale: 'Strict compliance maintained via transparent software terms, clear non-refundable digital terms, and truthful risk disclosure.',
      lastReviewDate: '2026-02-10',
      reviewNotes: 'Consumer disclosures clearly visible before purchase flow.'
    }
  ]);

  const [contentRegistry] = useState<ComplianceContentItem[]>([
    {
      contentId: 'CNT-HP-HERO-01',
      page: 'HomePage',
      statement: 'Disciplined Gold Trading Automation for MetaTrader 5',
      category: 'licensing',
      status: 'APPROVED',
      jurisdictionScope: 'Global',
      legalBasis: 'Truthful technical description of software capability.',
      lastReview: '2026-02-12'
    },
    {
      contentId: 'CNT-HP-DEF-02',
      page: 'HomePage',
      statement: 'OPHIREUM Multimedia Production is strictly a software and technology-licensing enterprise. OPHIREUM is not a broker, does not accept customer trading deposits, and does not hold trading capital.',
      category: 'status',
      status: 'APPROVED',
      jurisdictionScope: 'Global',
      legalBasis: 'Required statutory disclaimer of non-brokerage status.',
      lastReview: '2026-02-12'
    },
    {
      contentId: 'CNT-RSK-WARN-03',
      page: 'LegalCenter (Risk Disclosure)',
      statement: 'No responsible trading system can guarantee profits. Automated tools execute programmed rules and may generate losses, including the loss of some or all trading capital.',
      category: 'safety',
      status: 'APPROVED',
      jurisdictionScope: 'Global',
      legalBasis: 'CFTC Rule 4.41 and general international risk disclosure principles.',
      lastReview: '2026-02-10'
    }
  ]);

  return (
    <div className="space-y-6 text-xs text-zinc-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Scale className="w-4 h-4 text-[#C9A227]" />
            <span>Compliance Oversight & Regulatory Review Console</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Sections 16 & 29 compliance registry tracking regulatory classifications and verified public statements.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('regulators')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'regulators'
                ? 'bg-[#C9A227] text-black'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
            }`}
          >
            Regulatory Classification (Sec 16)
          </button>
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'registry'
                ? 'bg-[#C9A227] text-black'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
            }`}
          >
            Content Registry (Sec 29)
          </button>
        </div>
      </div>

      {/* Tab 1: Regulatory Classification Matrix */}
      {activeTab === 'regulators' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {assessments.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#0D1017] border border-[#1E2433] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{item.regulator} ({item.fullBodyName})</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      item.status === 'REGISTERED' || item.status === 'NOT APPLICABLE'
                        ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                        : item.status === 'UNDER LEGAL REVIEW'
                        ? 'bg-amber-950/60 border-amber-700 text-amber-300'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  <span className="text-zinc-500">Jurisdiction:</span> {item.jurisdiction}
                </div>
                <div className="text-[11px] text-zinc-400">
                  <span className="text-zinc-500">Framework:</span> {item.applicableLaws}
                </div>
                <div className="pt-1 border-t border-zinc-800/80 text-[11px] text-zinc-300">
                  <span className="text-zinc-500 font-semibold">Technical Rationale:</span> {item.rationale}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Compliance Content Registry */}
      {activeTab === 'registry' && (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#0D1017]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141824] text-zinc-400 border-b border-zinc-800 font-semibold">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Page</th>
                  <th className="p-3">Verified Statement</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Legal Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {contentRegistry.map((c) => (
                  <tr key={c.contentId} className="hover:bg-zinc-900/40">
                    <td className="p-3 font-mono text-[11px] text-[#E4C765]">{c.contentId}</td>
                    <td className="p-3 text-zinc-400">{c.page}</td>
                    <td className="p-3 max-w-xs truncate text-zinc-200" title={c.statement}>
                      {c.statement}
                    </td>
                    <td className="p-3 uppercase text-[10px] text-zinc-400">{c.category}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px] font-bold">
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-zinc-400">{c.legalBasis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export const ComplianceReviewChecklist = ComplianceReviewConsole;
