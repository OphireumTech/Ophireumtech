/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Official Regulatory Status & Corporate Transparency Page
 * Dynamic, verified regulatory status disclosure adhering to Section 14 compliance requirements.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  FileCheck2,
  ExternalLink,
  Info,
  AlertTriangle,
  Globe,
  Lock,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface VerifiedRegulatoryProfile {
  legalCompanyName: string;
  businessType: string;
  jurisdiction: string;
  registeredOffice: string;
  companyRegistrationNumber: string;
  taxIdentificationStatus: string;
  regulatoryRegistrations: Array<{
    authority: string;
    licenseType: string;
    licenseNumber: string;
    effectiveDate: string;
    expirationDate: string;
    verificationUrl: string;
    verified: boolean;
  }>;
  regulatedActivitiesStatus: {
    investmentAdvisory: string;
    brokerDealerServices: string;
    custodyOfFunds: string;
    commodityTradingAdvisory: string;
    moneyTransmission: string;
  };
  unregulatedSoftwareActivities: string[];
  geographicRestrictions: string[];
}

export const RegulatoryStatusPage: React.FC = () => {
  const { setCurrentRoute } = useApp();

  // Administrator-controlled verified regulatory configuration
  // IMPORTANT: Unverified fields are strictly hidden or explicitly flagged as unverified/not-held.
  const [profile] = useState<VerifiedRegulatoryProfile>({
    legalCompanyName: 'OPHIREUM Multimedia Production',
    businessType: 'Software Technology Licensing & Multimedia Production Enterprise',
    jurisdiction: 'Registered Entity Under Verification [Formal Corporate Legal Review in Progress]',
    registeredOffice: 'Corporate Operations Desk, Taguig City, Metro Manila, Philippines',
    companyRegistrationNumber: 'VERIFIED_BUSINESS_ENTITY [Certificate on File with Compliance]',
    taxIdentificationStatus: 'Active Corporate Tax Identification Registered',
    regulatoryRegistrations: [], // Strictly empty: No fabricated SEC, CFTC, NFA, or FINRA numbers
    regulatedActivitiesStatus: {
      investmentAdvisory: 'NOT LICENSED / NOT PROVIDED (Software Only)',
      brokerDealerServices: 'NOT LICENSED / NOT PROVIDED (Independent MT5 Broker Required)',
      custodyOfFunds: 'NOT APPLICABLE (Ophireum Never Holds Client Trading Capital)',
      commodityTradingAdvisory: 'NOT REGISTERED (User Retains Complete Discretion & Manual Parameter Control)',
      moneyTransmission: 'NOT APPLICABLE (Software Subscription Licensing Only)'
    },
    unregulatedSoftwareActivities: [
      'Development and licensing of compiled MetaTrader 5 Expert Advisor (.ex5) binary software.',
      'Cloud Run WebRequest authorization API infrastructure and cryptographic nonce verification.',
      'Operational risk parameter templates (mandatory stop-loss, max lot size constraints, session filters).',
      'Dedicated low-latency VPS architecture coordination for independent customer terminals.',
      'Customer support, terminal installation documentation, and technical troubleshooting.'
    ],
    geographicRestrictions: [
      'Services may not be available in all jurisdictions.',
      'Residents of jurisdictions subject to comprehensive international financial sanctions or local restrictions prohibiting automated commodity derivatives execution are ineligible to acquire software licences.',
      'Prospective operators are solely responsible for ensuring that their use of algorithmic trading software complies with their local municipal, state, and national laws.'
    ]
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header Section */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1E2B] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
          <Building2 className="w-3.5 h-3.5" />
          <span>Statutory Transparency & Compliance Readiness</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Regulatory Status & Corporate Disclosure
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          OPHIREUM operates strictly as a commercial financial-technology software developer. Review our corporate registration classification, non-brokerage status, and scope of operations.
        </p>
      </div>

      {/* Primary Legal Clarification Box */}
      <div className="p-6 rounded-2xl bg-[#0E1119] border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-[#E4C765] font-semibold text-sm">
          <Info className="w-4 h-4" />
          <span>Essential Distinction: Technology Provider vs. Regulated Financial Institution</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-300">
          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              What OPHIREUM Provides (Technology Enterprise)
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              OPHIREUM develops, distributes, and licenses pre-compiled algorithmic trading software (the OPHIREUM Expert Assistant) engineered for MetaTrader 5. We provide cryptographic account-bound activation, API validation, and technical support.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
            <div className="font-bold text-rose-300 flex items-center gap-1.5 text-xs">
              <XCircle className="w-4 h-4 text-rose-400" />
              What OPHIREUM Does NOT Provide (Regulated Services)
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              OPHIREUM is not an investment manager, broker-dealer, commodity pool operator (CPO), commodity trading advisor (CTA), money transmitter, or custodian. We do not accept trading deposits, manage client portfolios, or hold customer balances.
            </p>
          </div>
        </div>
      </div>

      {/* Corporate Registration & Entity Profile */}
      <div className="rounded-2xl bg-[#0D1017] border border-[#1F2433] p-6 sm:p-8 space-y-6">
        <div className="border-b border-zinc-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#C9A227]" />
            <span>Corporate Entity & Jurisdiction Information</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Official business profile and corporate details maintained by compliance administration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#121520] border border-zinc-800 space-y-1">
            <span className="text-zinc-500 font-medium">Legal Company Name:</span>
            <div className="text-sm font-bold text-white">{profile.legalCompanyName}</div>
          </div>
          <div className="p-4 rounded-xl bg-[#121520] border border-zinc-800 space-y-1">
            <span className="text-zinc-500 font-medium">Business Classification:</span>
            <div className="text-sm font-bold text-zinc-200">{profile.businessType}</div>
          </div>
          <div className="p-4 rounded-xl bg-[#121520] border border-zinc-800 space-y-1">
            <span className="text-zinc-500 font-medium">Jurisdiction of Operation:</span>
            <div className="text-sm font-semibold text-zinc-200">{profile.jurisdiction}</div>
          </div>
          <div className="p-4 rounded-xl bg-[#121520] border border-zinc-800 space-y-1">
            <span className="text-zinc-500 font-medium">Operating Office:</span>
            <div className="text-sm font-semibold text-zinc-200">{profile.registeredOffice}</div>
          </div>
        </div>
      </div>

      {/* Regulated Activities Matrix */}
      <div className="rounded-2xl bg-[#0D1017] border border-[#1F2433] p-6 sm:p-8 space-y-6">
        <div className="border-b border-zinc-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>Regulated Activities Audit Matrix</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Transparent disclosure of regulated activity classifications under applicable financial laws.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          {Object.entries(profile.regulatedActivitiesStatus).map(([key, value], idx) => {
            const labelMap: Record<string, string> = {
              investmentAdvisory: 'Personalized Investment Advice / Discretionary Portfolio Management',
              brokerDealerServices: 'Brokerage Execution, Order Routing, or Financial Intermediation',
              custodyOfFunds: 'Custody, Depository, or Safekeeping of Customer Trading Funds',
              commodityTradingAdvisory: 'Discretionary Commodity Trading Advisory (CTA)',
              moneyTransmission: 'Money Transmission or Currency Exchange Services'
            };

            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#121520] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <span className="font-semibold text-zinc-200">{labelMap[key] || key}</span>
                <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-amber-300/90 font-medium shrink-0">
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Permitted Software Activities */}
      <div className="rounded-2xl bg-[#0D1017] border border-[#1F2433] p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Authorized Software Activities</span>
        </h2>
        <ul className="space-y-2.5 text-xs text-zinc-300">
          {profile.unregulatedSoftwareActivities.map((act, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] mt-1.5 shrink-0" />
              <span>{act}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Geographic & Jurisdictional Notice */}
      <div className="rounded-2xl bg-[#0D1017] border border-[#1F2433] p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#E4C765]" />
          <span>Geographic Restrictions & International Notice</span>
        </h2>
        <div className="space-y-2 text-xs text-zinc-400 leading-relaxed">
          {profile.geographicRestrictions.map((geo, idx) => (
            <p key={idx}>{geo}</p>
          ))}
          <p className="pt-2 text-[11px] text-zinc-500 italic">
            Notice: The software has not been submitted for approval to the U.S. Securities and Exchange Commission (SEC), the U.S. Commodity Futures Trading Commission (CFTC), the National Futures Association (NFA), or any non-U.S. government supervisory body, and no such authority has endorsed or recommended this product.
          </p>
        </div>
      </div>

      {/* Support & Inquiries CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => setCurrentRoute('contact')}
          className="px-6 py-2.5 rounded-xl bg-[#141824] hover:bg-[#1B2132] border border-[#2B3448] text-xs font-semibold text-zinc-200 transition-all cursor-pointer"
        >
          Have questions regarding compliance or licensing? Contact our compliance desk →
        </button>
      </div>
    </div>
  );
};
