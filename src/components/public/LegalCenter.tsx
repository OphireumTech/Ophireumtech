/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Legal Center & Statutory Agreements
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Scale,
  Calendar,
  Building
} from 'lucide-react';

interface LegalCenterProps {
  document: 
    | 'legal-terms'
    | 'legal-sla'
    | 'legal-risk'
    | 'legal-privacy'
    | 'legal-cookies'
    | 'legal-refunds'
    | 'legal-acceptable-use'
    | 'service-agreement'
    | 'disclaimer';
}

export const LegalCenter: React.FC<LegalCenterProps> = ({ document }) => {
  const { currentUser, acceptAgreements, currentRole } = useApp();

  const isAccepted = !!currentUser.agreementsAccepted;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Acceptance Status Banner */}
      {currentRole === 'customer' && (
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${
          isAccepted 
            ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' 
            : 'bg-amber-950/30 border-amber-800/50 text-amber-200'
        }`}>
          <div className="flex items-center gap-2">
            {isAccepted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <div>
              <span className="font-semibold block">
                {isAccepted ? 'Legal Agreements Accepted & Cryptographically Logged' : 'Formal Action Required: Review and Accept Disclosures'}
              </span>
              <span className="text-[11px] text-zinc-400">
                {isAccepted
                  ? `Version v2.4-2026 formally recorded on ${new Date(currentUser.agreementsAccepted!.acceptedAt).toLocaleString()} (IP: ${currentUser.agreementsAccepted!.ipAddress})`
                  : 'You must formally accept the current Terms of Use, Software Licence Agreement, and Risk Disclosures before deploying the EA.'}
              </span>
            </div>
          </div>

          {!isAccepted && (
            <button
              onClick={acceptAgreements}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-xs tracking-wide shadow-md hover:brightness-110 shrink-0 cursor-pointer"
            >
              Formally Accept Disclosures
            </button>
          )}
        </div>
      )}

      {/* DOCUMENT HEADER */}
      <div className="space-y-3 border-b border-zinc-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141924] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
          <Scale className="w-3.5 h-3.5" />
          <span>Statutory Governance • OPHIREUM Multimedia Production</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
          {document === 'legal-terms' && 'Terms of Use'}
          {document === 'legal-sla' && 'Software Licence Agreement (SLA)'}
          {document === 'service-agreement' && 'Service & Operational Agreement'}
          {document === 'legal-risk' && 'Trading Risk & Operational Disclosure'}
          {document === 'legal-privacy' && 'Privacy & Data Protection Policy'}
          {document === 'legal-cookies' && 'Cookie Policy'}
          {document === 'legal-refunds' && 'Refund and Cancellation Policy'}
          {document === 'legal-acceptable-use' && 'Acceptable Use Policy'}
          {document === 'disclaimer' && 'Financial & Regulatory Disclaimer'}
        </h1>
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span>Effective Date: August 1, 2026</span>
          <span>•</span>
          <span>Version: 2.4-2026</span>
          <span>•</span>
          <span>Jurisdiction: Direct Software Licensing</span>
        </div>
      </div>

      {/* DOCUMENT CONTENT */}
      <div className="space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-4xl">
        {/* TRADING RISK DISCLOSURE */}
        {document === 'legal-risk' && (
          <>
            <div className="p-6 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-3">
              <h2 className="text-base font-bold text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Persistent Risk Notice
              </h2>
              <p className="text-rose-200 text-xs sm:text-sm leading-relaxed font-medium">
                No responsible trading system can guarantee profits. Automated tools execute programmed rules and may generate losses, including the loss of some or all trading capital. Market gaps, volatility, spread expansion, latency, slippage, broker execution, incorrect configuration, and connectivity failures can materially affect outcomes.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">1. Scope of Operations & Non-Brokerage Status</h3>
              <p className="text-zinc-400">
                OPHIREUM Multimedia Production provides software, digital licensing, technical support, and related operational technology. OPHIREUM is not a broker and does not accept customer trading deposits or process withdrawals from brokerage accounts. Unless separately licensed and expressly disclosed for a particular jurisdiction, OPHIREUM does not provide personalized investment advice, discretionary portfolio management, brokerage, custody, or guaranteed investment returns.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">2. Leveraged Derivatives Risk</h3>
              <p className="text-zinc-400">
                Trading spot gold (XAUUSD) on margin involves significant risk. The high degree of leverage that is often obtainable in commodity trading can work against you as well as for you. The use of leverage can lead to large losses as well as gains. Past performance or backtested metrics are not indicative of future performance.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">3. Customer Responsibilities</h3>
              <ul className="list-disc list-inside space-y-1.5 text-zinc-400">
                <li>Determining the suitability of algorithmic software for their personal financial circumstances.</li>
                <li>Selecting an independent, regulated MetaTrader 5 broker.</li>
                <li>Safeguarding broker and VPS access credentials.</li>
                <li>Maintaining adequate margin to prevent stop-out during spread spikes.</li>
                <li>Seeking independent financial, legal, and tax advice.</li>
              </ul>
            </div>
          </>
        )}

        {/* TERMS OF USE */}
        {document === 'legal-terms' && (
          <>
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">1. Agreement to Terms</h3>
              <p className="text-zinc-400">
                By creating an account, accessing the OPHIREUM portal, or purchasing a software licence, you agree to be bound by these Terms of Use. If you do not agree with all of these terms, you are expressly prohibited from using the platform and must discontinue access immediately.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">2. Intellectual Property Rights</h3>
              <p className="text-zinc-400">
                Unless otherwise indicated, the platform, source code, database architectures, APIs, and the compiled Expert Advisor (.ex5) are the exclusive proprietary property of OPHIREUM Multimedia Production. Reverse-engineering, de-compilation, or unauthorized cracking of licence validation checks is strictly prohibited.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">3. User Representations</h3>
              <p className="text-zinc-400">
                You represent that: (1) you have legal capacity to enter these agreements; (2) you are at least 18 years of age; (3) you will not access the platform through automated scraping; and (4) your use of the software complies with all applicable local financial and tax laws.
              </p>
            </div>
          </>
        )}

        {/* SOFTWARE LICENCE AGREEMENT */}
        {document === 'legal-sla' && (
          <>
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">1. Grant of Single-Account Licence</h3>
              <p className="text-zinc-400">
                Subject to the terms of this Agreement and payment of the applicable plan fee, OPHIREUM grants you a non-exclusive, non-transferable, revocable licence to run the OPHIREUM Expert Assistant bound to exactly one (1) authorized MetaTrader 5 login number for the purchased validity term.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">2. Account Binding & Unbinding Procedures</h3>
              <p className="text-zinc-400">
                Each licence requires verification through our Cloud Run authorization API. Overwriting an active MT5 binding directly from the client interface is disabled to protect against unauthorized multi-terminal execution. Legitimate migrations must be submitted via an Unbinding Request and approved by compliance administrators.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">3. Automatic Expiration & Upgrade Policy</h3>
              <p className="text-zinc-400">
                Licences expire automatically upon the conclusion of their validity term (e.g., 90 days for Starter Trial, 180 days for Professional, 365 days for Premium). Starter Trial licences cannot be extended and require an upgrade to a regular tier. Packages may be upgraded at any time, but downgrades are not permitted.
              </p>
            </div>
          </>
        )}

        {/* PRIVACY POLICY */}
        {document === 'legal-privacy' && (
          <>
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">1. Information We Collect</h3>
              <p className="text-zinc-400">
                We collect your name, email address, country, bound MT5 account number, broker name, and server name. We <strong className="text-white">NEVER</strong> collect, store, or request broker withdrawal credentials, trading account passwords, or master passwords.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">2. Telemetry and Heartbeat Data</h3>
              <p className="text-zinc-400">
                To monitor technical execution health, our servers log terminal uptime, tick latency, spread in pips, and EA version numbers. This data is utilized solely for support diagnostics and emergency stop triggers.
              </p>
            </div>
          </>
        )}

        {/* REFUND POLICY */}
        {document === 'legal-refunds' && (
          <>
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">1. Digital Nature of Software Deliverables</h3>
              <p className="text-zinc-400">
                Because OPHIREUM provides immediate access to proprietary algorithmic software, downloadable compiled binaries, and cryptographic cloud licensing tokens, all sales are final once an order is confirmed and a licence ID has been issued.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">2. Trial Kit Availability</h3>
              <p className="text-zinc-400">
                To enable prospective operators to evaluate system compatibility and MT5 WebRequest performance on live or demo accounts, we provide an accessible 90-day Starter Kit – Trial Version at 199 USDT prior to committing to annual tiers.
              </p>
            </div>
          </>
        )}

        {/* COOKIE POLICY */}
        {document === 'legal-cookies' && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white">Essential Session Storage</h3>
            <p className="text-zinc-400">
              We utilize strictly necessary session cookies and local storage to preserve your authenticated user session, role tokens, and agreement acceptance timestamps. We do not deploy third-party advertising cookies or cross-site tracking pixels.
            </p>
          </div>
        )}

        {/* ACCEPTABLE USE POLICY */}
        {document === 'legal-acceptable-use' && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white">Prohibited Activities</h3>
            <p className="text-zinc-400">
              Users may not: (1) attempt to flood or DDoS the WebRequest authorization endpoints; (2) tamper with request nonces or forge cryptographic signatures; (3) execute the software on unauthorized non-gold symbols; or (4) market or resell licences under affiliate or commission schemes.
            </p>
          </div>
        )}

        {/* SERVICE AGREEMENT */}
        {document === 'service-agreement' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">1. Provision of Technical Infrastructure</h3>
              <p className="text-zinc-400">
                OPHIREUM Multimedia Production provides technical infrastructure services including license key issuance, MT5 WebRequest authentication, cloud licensing telemetry, and optional managed virtual private server (VPS) provisioning.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">2. Service Level Commitments</h3>
              <p className="text-zinc-400">
                We maintain high availability for our cloud licensing verification cluster. Scheduled maintenance windows will be communicated via customer notifications in advance.
              </p>
            </div>
          </div>
        )}

        {/* REGULATORY DISCLAIMER */}
        {document === 'disclaimer' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 space-y-2">
              <h3 className="text-base font-bold text-amber-300">Non-Fiduciary & Technology Status</h3>
              <p className="text-xs sm:text-sm leading-relaxed">
                OPHIREUM is purely a software and multimedia technology provider. OPHIREUM is not a broker, exchange, custodian, investment advisor, or portfolio manager. We do not handle, hold, or execute client fiat or brokerage funds. All financial trade executions occur directly on the client's independently chosen MetaTrader 5 broker.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
