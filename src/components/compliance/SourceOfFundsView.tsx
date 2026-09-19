/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Source of Funds & Source of Wealth AML Verification
 * Sections 9 & 10: Origin of trading capital, institutional banking trail,
 * cumulative net worth origins, and documentary evidence.
 */

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShieldCheck,
  Building,
  Upload,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Lock,
  Landmark
} from 'lucide-react';
import { complianceEngine } from '../../services/complianceEngine';
import { SourceOfFundsRecord, SourceOfWealthRecord } from '../../types/compliance';
import { useApp } from '../../context/AppContext';

export const SourceOfFundsView: React.FC = () => {
  const { addToast } = useApp();
  const [complianceState, setComplianceState] = useState(() => complianceEngine.getState());

  useEffect(() => {
    return complianceEngine.subscribe(() => {
      setComplianceState(complianceEngine.getState());
    });
  }, []);

  const [sof, setSof] = useState<SourceOfFundsRecord>(() => {
    return (
      complianceState.sourceOfFunds || {
        primarySource: 'business_income',
        estimatedAnnualFundingUSD: '$50,000 - $100,000',
        originatingInstitution: 'Barclays Bank PLC London',
        institutionCountry: 'United Kingdom',
        accountOwnershipConfirmed: true,
        supportingDocumentType: 'Bank Statement (Past 3 Months)',
        recordedAt: new Date().toISOString()
      }
    );
  });

  const [sow, setSow] = useState<SourceOfWealthRecord>(() => {
    return (
      complianceState.sourceOfWealth || {
        primarySources: ['Business ownership', 'Investments', 'Professional income'],
        estimatedAnnualIncomeRangeUSD: '$150,000 - $250,000',
        estimatedNetWorthRangeUSD: '$500,000 - $1,000,000',
        estimatedLiquidNetWorthRangeUSD: '$200,000 - $500,000',
        estimatedInvestableAssetsRangeUSD: '$100,000 - $250,000',
        supportingDocumentType: 'Certified Financial Statement / Tax Return',
        recordedAt: new Date().toISOString()
      }
    );
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      complianceEngine.updateState(prev => ({
        ...prev,
        sourceOfFunds: sof,
        sourceOfWealth: sow
      }));
      setIsSaving(false);
      addToast('AML Financial Records Saved', 'Source of funds and wealth certified in compliance ledger.', 'success');
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2538] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#E4C765] uppercase tracking-wider">
                COMPLIANCE GATE 05 / AML FINANCIAL VERIFICATION
              </div>
              <h1 className="text-xl font-bold text-white font-serif">
                SOURCE OF FUNDS & SOURCE OF WEALTH
              </h1>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
              AML REVIEW: CLEAR
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Statutory anti-money laundering regulations require distinguishing between Source of Funds (the origin of the specific trading capital deployed to your broker) and Source of Wealth (the cumulative activities generating your net worth).
        </p>
      </div>

      {/* SECTION 1: SOURCE OF FUNDS */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-6">
        <div className="border-b border-[#1E2538] pb-3">
          <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
            1. SOURCE OF FUNDS (SPECIFIC TRADING CAPITAL)
          </h3>
          <p className="text-[11px] text-zinc-400">
            Identify the primary origin of funds allocated to your broker trading account for EA operations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Primary Capital Source</label>
            <select
              value={sof.primarySource}
              onChange={e => setSof({ ...sof, primarySource: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white"
            >
              <option value="employment_income">Employment Income / Salary</option>
              <option value="business_income">Commercial / Corporate Business Income</option>
              <option value="investment_income">Investment Profits / Dividends</option>
              <option value="savings">Accumulated Personal Savings</option>
              <option value="property_sale">Real Estate / Property Sale Proceeds</option>
              <option value="company_profits">Retained Company Profits</option>
              <option value="inheritance">Estate Inheritance</option>
              <option value="investment_liquidation">Liquidation of Securities</option>
              <option value="other">Other Legitimate Commercial Activity</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Estimated Annual Trading Allocation (USD)</label>
            <input
              type="text"
              value={sof.estimatedAnnualFundingUSD}
              onChange={e => setSof({ ...sof, estimatedAnnualFundingUSD: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Originating Banking Institution</label>
            <input
              type="text"
              value={sof.originatingInstitution}
              onChange={e => setSof({ ...sof, originatingInstitution: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Bank Domicile / Country</label>
            <input
              type="text"
              value={sof.institutionCountry}
              onChange={e => setSof({ ...sof, institutionCountry: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white"
            />
          </div>
        </div>

        <label className="p-3.5 rounded-2xl bg-[#080B11] border border-[#20283A] flex items-start gap-3 cursor-pointer text-xs">
          <input
            type="checkbox"
            checked={sof.accountOwnershipConfirmed}
            onChange={e => setSof({ ...sof, accountOwnershipConfirmed: e.target.checked })}
            className="mt-0.5 w-4 h-4 rounded text-[#C9A227] focus:ring-[#C9A227] border-zinc-700 bg-zinc-900 cursor-pointer shrink-0"
          />
          <div className="text-zinc-300 leading-snug">
            <span className="font-bold text-white">First-Party Account Certification:</span> I confirm that all funds deposited into my broker account originate strictly from bank accounts held in my legal name (or in the name of the verified corporate entity), and not from third parties or undisclosed accounts.
          </div>
        </label>
      </div>

      {/* SECTION 2: SOURCE OF WEALTH */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-6">
        <div className="border-b border-[#1E2538] pb-3">
          <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
            2. SOURCE OF WEALTH (TOTAL NET ASSET ACCUMULATION)
          </h3>
          <p className="text-[11px] text-zinc-400">
            Document the cumulative lifetime economic activities that generated your total financial net worth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Estimated Annual Income Range (USD)</label>
            <select
              value={sow.estimatedAnnualIncomeRangeUSD}
              onChange={e => setSow({ ...sow, estimatedAnnualIncomeRangeUSD: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white"
            >
              <option value="Under $50,000">Under $50,000</option>
              <option value="$50,000 - $100,000">$50,000 - $100,000</option>
              <option value="$100,000 - $250,000">$100,000 - $250,000</option>
              <option value="$250,000 - $500,000">$250,000 - $500,000</option>
              <option value="$500,000+">$500,000+</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Estimated Total Net Worth (USD)</label>
            <select
              value={sow.estimatedNetWorthRangeUSD}
              onChange={e => setSow({ ...sow, estimatedNetWorthRangeUSD: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white"
            >
              <option value="Under $100,000">Under $100,000</option>
              <option value="$100,000 - $250,000">$100,000 - $250,000</option>
              <option value="$250,000 - $500,000">$250,000 - $500,000</option>
              <option value="$500,000 - $1,000,000">$500,000 - $1,000,000</option>
              <option value="$1,000,000+">$1,000,000+</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Estimated Liquid Net Worth (USD)</label>
            <input
              type="text"
              value={sow.estimatedLiquidNetWorthRangeUSD}
              onChange={e => setSow({ ...sow, estimatedLiquidNetWorthRangeUSD: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Supporting Verification Document</label>
            <input
              type="text"
              value={sow.supportingDocumentType || 'Bank Statement / Tax Clearance'}
              onChange={e => setSow({ ...sow, supportingDocumentType: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-110"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Certify AML Financial Records'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
