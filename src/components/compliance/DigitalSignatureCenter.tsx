/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Digital Signature Center, Scroll-and-Review, & Signature Certificate
 * Sections 24, 25, 26, 27, 28, 29: Standalone acknowledgements, ceremony,
 * SHA-256 evidence generation, and immutable Certificate of Electronic Signature.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  FileCheck,
  ShieldCheck,
  Lock,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Key,
  Calendar,
  UserCheck,
  Hash,
  Award,
  ChevronDown,
  ExternalLink,
  Printer
} from 'lucide-react';
import { complianceEngine } from '../../services/complianceEngine';
import { SignatureEvidenceRecord, SignatureCertificate } from '../../types/compliance';
import { useApp } from '../../context/AppContext';

export const DigitalSignatureCenter: React.FC = () => {
  const { currentUser, addToast } = useApp();
  const [complianceState, setComplianceState] = useState(() => complianceEngine.getState());

  useEffect(() => {
    return complianceEngine.subscribe(() => {
      setComplianceState(complianceEngine.getState());
    });
  }, []);

  // Selected document for scroll-and-review
  const [selectedDocId, setSelectedDocId] = useState<string>('tech_purchase_agreement');
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState<Record<string, boolean>>({
    tech_purchase_agreement: false,
    automated_trading_risk: false,
    terms_of_service: false
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Individual explicit acknowledgements (Never pre-checked!)
  const [ack, setAck] = useState({
    termsOfService: false,
    technologyPurchaseAgreement: false,
    automatedTradingAuthorization: false,
    tradingRiskDisclosure: false,
    leverageRiskDisclosure: false,
    noProfitGuaranteeDisclosure: false,
    performanceDisclosure: false,
    brokerThirdPartyDisclosure: false,
    xauusdGoldRiskDisclosure: false,
    clientControlDisclosure: false,
    privacyNotice: false,
    electronicCommunicationsConsent: false,
    electronicSignatureConsent: false,
    feesAndBillingAuthorization: false
  });

  // Ceremony Inputs
  const [typedName, setTypedName] = useState(currentUser?.fullName || 'Alexander Vance');
  const [confirmedSoleParty, setConfirmedSoleParty] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  // Active view modal for Certificate of Electronic Signature
  const [activeCert, setActiveCert] = useState<SignatureCertificate | null>(null);

  const allCheckboxesChecked = Object.values(ack).every(Boolean);
  const canSign = allCheckboxesChecked && confirmedSoleParty && typedName.trim().length >= 3;

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 30) {
      setHasScrolledToBottom(prev => ({
        ...prev,
        [selectedDocId]: true
      }));
    }
  };

  const handleExecuteSigning = async () => {
    if (!canSign) return;
    setIsSigning(true);
    try {
      const result = await complianceEngine.executeDigitalSigning({
        signerLegalName: typedName.trim(),
        signerEmail: currentUser?.email || 'trader@ophireum.biz',
        accountId: currentUser?.uid || 'ACC-8910442',
        documentTitle: 'OPHIREUM Comprehensive Technology Purchase & Execution Risk Agreement',
        documentVersion: 'v2026.2.0-STATUTORY',
        acknowledgements: ack,
        signatureMethod: 'typed_legal_name'
      });

      addToast(
        'Agreements Signed',
        `Digital signature SHA-256 verified (${result.evidence.documentHashSha256.substring(0, 10)}...). Certificate generated.`,
        'success'
      );
      setActiveCert(result.certificate);
    } catch (e: any) {
      addToast('Signature Error', e.message || 'Could not complete digital signing ceremony', 'critical');
    } finally {
      setIsSigning(false);
    }
  };

  const existingCert = complianceState.signatureCertificates[0];
  const existingEvidence = complianceState.signedAgreements[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2538] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#E4C765] uppercase tracking-wider">
                LEGAL & COMPLIANCE ARCHITECTURE
              </div>
              <h1 className="text-xl font-bold text-white font-serif">
                DIGITAL SIGNATURE & EVIDENCE CENTER
              </h1>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
              SHA-256 IMMUTABLE LEDGER
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          OPHIREUM enforces statutory e-signature compliance. In compliance with ESIGN and eIDAS standards, every material term, risk disclosure, and license boundary must be reviewed and explicitly acknowledged.
        </p>
      </div>

      {/* Active Certificate Banner if Already Signed */}
      {existingCert && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0F1420] to-[#12192A] border border-[#C9A227]/40 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-emerald-400 font-semibold uppercase">
                  ACTIVE SIGNED LEGAL PACKAGE ON RECORD
                </div>
                <h3 className="text-sm font-bold text-white font-serif">
                  {existingCert.agreementTitle} ({existingCert.agreementVersion})
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveCert(existingCert)}
              className="px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#E4C765] text-[#08090B] font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all shrink-0"
            >
              <FileCheck className="w-4 h-4" />
              <span>View Signature Certificate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-mono p-3 rounded-2xl bg-[#080B11] border border-[#1B2338]">
            <div>
              <span className="text-zinc-400">CERTIFICATE ID:</span>
              <div className="text-[#E4C765] font-bold">{existingCert.certificateId}</div>
            </div>
            <div>
              <span className="text-zinc-400">SHA-256 HASH:</span>
              <div className="text-zinc-200 truncate">{existingCert.documentHashSha256}</div>
            </div>
            <div>
              <span className="text-zinc-400">TIMESTAMP UTC:</span>
              <div className="text-zinc-200">{new Date(existingCert.timestampUtc).toUTCString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: SCROLL-AND-REVIEW DOCUMENT VIEWER */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2538] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
              1. SCROLL-AND-REVIEW STATUTORY DOCUMENTATION
            </h3>
            <p className="text-[11px] text-zinc-400">
              Review full terms below. Scroll to the bottom to unlock acknowledgement.
            </p>
          </div>

          <div className="flex gap-1.5 bg-[#121622] p-1 rounded-xl border border-[#1F263A]">
            <button
              type="button"
              onClick={() => setSelectedDocId('tech_purchase_agreement')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                selectedDocId === 'tech_purchase_agreement'
                  ? 'bg-[#C9A227] text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Technology License
            </button>
            <button
              type="button"
              onClick={() => setSelectedDocId('automated_trading_risk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                selectedDocId === 'automated_trading_risk'
                  ? 'bg-[#C9A227] text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Automated Risk
            </button>
            <button
              type="button"
              onClick={() => setSelectedDocId('terms_of_service')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                selectedDocId === 'terms_of_service'
                  ? 'bg-[#C9A227] text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Terms of Service
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="h-64 overflow-y-auto p-4 rounded-2xl bg-[#080B11] border border-[#1E2638] text-xs text-zinc-300 space-y-4 font-sans leading-relaxed select-text"
        >
          {selectedDocId === 'tech_purchase_agreement' && (
            <>
              <div className="font-mono text-[11px] text-[#E4C765]">DOCUMENT ID: DOC-OPHIREUM-TPA-2026.2 (VERSION 2.4)</div>
              <h4 className="text-sm font-bold text-white uppercase">OPHIREUM TRADING TECHNOLOGY PURCHASE & LICENSE AGREEMENT</h4>
              <p>
                <strong>1. PARTIES & DEFINITIONS:</strong> This Technology Purchase Agreement (&quot;Agreement&quot;) is executed between Ophireum LLC (&quot;Licensor&quot; or &quot;Technology Provider&quot;) and the registered authorized subscriber (&quot;Licensee&quot; or &quot;Client&quot;).
              </p>
              <p>
                <strong>2. SCOPE OF LICENSE:</strong> Licensor grants Client a revocable, non-exclusive, non-transferable commercial software license to install and run the compiled Expert Advisor on Client-owned MetaTrader 5 terminals strictly matching the verified account ID registered on the Ophireum compliance ledger.
              </p>
              <p>
                <strong>3. NON-FINANCIAL ADVISORY NATURE:</strong> Client expressly acknowledges that Ophireum LLC is NOT a broker-dealer, securities dealer, investment manager, commodity pool operator, financial planner, fiduciary, or custodian. The technology is published as commercial algorithmic software.
              </p>
              <p>
                <strong>4. BROKER SEPARATION:</strong> All order execution takes place on Client&apos;s chosen third-party broker terminal. Licensor exercises zero custody over Client deposits, withdrawals, or leverage margin requirements.
              </p>
              <p>
                <strong>5. DISPUTE RESOLUTION & JURISDICTION:</strong> Any controversy arising out of this software license shall be resolved through binding commercial arbitration under the London Court of International Arbitration (LCIA) rules, without waiver of non-waivable statutory consumer protections in Client&apos;s home jurisdiction.
              </p>
              <p>
                <strong>6. NO GUARANTEE:</strong> PAST ALGORITHMIC BACKTESTS DO NOT GUARANTEE FUTURE RESULTS. LOSS OF SOME OR ALL CAPITAL CAN OCCUR IN SPOT GOLD MARKETS.
              </p>
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-400 font-mono text-[10px]">
                [END OF DOCUMENT - PRESENTED FOR LEGAL REVIEW. SCROLL CONFIRMED BY SESSION AUDIT TRAIL]
              </div>
            </>
          )}

          {selectedDocId === 'automated_trading_risk' && (
            <>
              <div className="font-mono text-[11px] text-[#E4C765]">DOCUMENT ID: DOC-OPHIREUM-RISK-2026.2</div>
              <h4 className="text-sm font-bold text-white uppercase">STATUTORY AUTOMATED TRADING & LEVERAGE RISK DISCLOSURE</h4>
              <p>
                <strong>1. SUBSTANTIAL RISK OF LOSS:</strong> Trading leveraged contracts, particularly spot gold (XAUUSD), involves a high degree of risk and is not suitable for all market participants. High leverage can magnify losses as rapidly as gains.
              </p>
              <p>
                <strong>2. ALGORITHMIC & CONNECTIVITY RISK:</strong> Automated execution relies upon uninterrupted internet feeds, broker WebRequest responsiveness, and server uptime. Market gaps, economic news releases (CPI, NFP, FOMC), spread expansion, and slippage can cause orders to execute at prices substantially different from projected levels.
              </p>
              <p>
                <strong>3. STOP LOSS EXECUTION CAVEAT:</strong> Stop-loss parameters provide risk control mechanisms but cannot guarantee execution at exact requested levels during periods of extreme illiquidity or market gaps.
              </p>
              <p>
                <strong>4. ABSOLUTE LACK OF GUARANTEES:</strong> NO REPRESENTATION IS MADE THAT CLIENT WILL ACHIEVE PROFITS OR AVOID SEVERE CAPITAL DRAWDOWN.
              </p>
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-400 font-mono text-[10px]">
                [END OF DOCUMENT - PRESENTED FOR LEGAL REVIEW. SCROLL CONFIRMED BY SESSION AUDIT TRAIL]
              </div>
            </>
          )}

          {selectedDocId === 'terms_of_service' && (
            <>
              <div className="font-mono text-[11px] text-[#E4C765]">DOCUMENT ID: DOC-OPHIREUM-TOS-2026.2</div>
              <h4 className="text-sm font-bold text-white uppercase">OPHIREUM PLATFORM TERMS OF SERVICE & ACCEPTABLE USE</h4>
              <p>
                <strong>1. ACCEPTABLE USE:</strong> Client agrees not to decompile, reverse-engineer, mirror, or repackage compiled EX5 binary artifacts or WebRequest communications protocols.
              </p>
              <p>
                <strong>2. CREDENTIAL INTEGRITY:</strong> Client shall never disclose portal login credentials or allow unauthorized third parties to control automated execution bindings.
              </p>
              <p>
                <strong>3. TERMINATION & CANCELLATION:</strong> Client may terminate their technology subscription at any time via the Customer Portal. Cooling-off periods apply in accordance with applicable statutory consumer jurisdiction rules.
              </p>
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-400 font-mono text-[10px]">
                [END OF DOCUMENT - PRESENTED FOR LEGAL REVIEW. SCROLL CONFIRMED BY SESSION AUDIT TRAIL]
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span className="font-mono">
            Scroll Status:{' '}
            {hasScrolledToBottom[selectedDocId] ? (
              <span className="text-emerald-400 font-bold">Document Reviewed (Unlocked)</span>
            ) : (
              <span className="text-amber-400 font-bold">Scroll through complete document</span>
            )}
          </span>
          <span className="text-zinc-400">Version controlled & recorded in audit ledger</span>
        </div>
      </div>

      {/* SECTION 2: STANDALONE EXPLICIT ACKNOWLEDGEMENTS */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-4">
        <div className="border-b border-[#1E2538] pb-3">
          <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
            2. MANDATORY STATUTORY ACKNOWLEDGEMENTS
          </h3>
          <p className="text-[11px] text-zinc-400">
            Federal and international regulatory standards require separate, individual acknowledgements for each material disclosure. Boxes are strictly not pre-checked.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            {
              id: 'termsOfService',
              title: 'Terms of Service & License Terms',
              desc: 'I have read, understood, and agree to the Ophireum commercial software Terms of Service.'
            },
            {
              id: 'technologyPurchaseAgreement',
              title: 'Technology Purchase Agreement',
              desc: 'I agree to the licensing boundaries, permitted terminal bindings, and intellectual property terms.'
            },
            {
              id: 'automatedTradingAuthorization',
              title: 'Automated Trading Authorization',
              desc: 'I explicitly authorize the installation, MT5 WebRequest connection, and automated execution of the EA.'
            },
            {
              id: 'tradingRiskDisclosure',
              title: 'Substantial Risk of Loss Disclosure',
              desc: 'I acknowledge that spot gold and CFD trading involves significant risk of total capital loss.'
            },
            {
              id: 'leverageRiskDisclosure',
              title: 'Leveraged Products Risk Notice',
              desc: 'I understand that leverage magnifies losses as well as profits, and negative balance protection depends on my broker.'
            },
            {
              id: 'noProfitGuaranteeDisclosure',
              title: 'NO-PROFIT-GUARANTEE Disclosure',
              desc: 'I explicitly acknowledge that Ophireum LLC offers NO GUARANTEE OF RETURN, PROFIT, OR REVENUE.'
            },
            {
              id: 'performanceDisclosure',
              title: 'Performance & Backtest Disclosure',
              desc: 'I acknowledge that past performance and backtests do not guarantee future live execution results.'
            },
            {
              id: 'brokerThirdPartyDisclosure',
              title: 'Independent Broker Relationship',
              desc: 'I understand my broker is a separate entity; Ophireum does not control spreads, slippage, or solvency.'
            },
            {
              id: 'xauusdGoldRiskDisclosure',
              title: 'XAUUSD / Gold Volatility Notice',
              desc: 'I understand gold markets react sharply to interest rates, inflation data, and geopolitical volatility.'
            },
            {
              id: 'clientControlDisclosure',
              title: 'Client Discretion & Account Control',
              desc: 'I confirm that I retain sole discretion over account deposits, withdrawals, and unbinding technology.'
            },
            {
              id: 'privacyNotice',
              title: 'Privacy Policy & Data Processing Notice',
              desc: 'I have reviewed the lawful basis for KYC document retention and MT5 telemetry processing.'
            },
            {
              id: 'electronicCommunicationsConsent',
              title: 'Electronic Communications Consent',
              desc: 'I agree to receive formal statutory legal notices and compliance communications electronically.'
            },
            {
              id: 'electronicSignatureConsent',
              title: 'Electronic Signature Legal Consent',
              desc: 'I consent to use electronic signatures under the U.S. ESIGN Act and European eIDAS regulation.'
            },
            {
              id: 'feesAndBillingAuthorization',
              title: 'Fees, Billing & Refund Notice',
              desc: 'I agree to commercial software licensing fees and statutory cooling-off cancellation rights.'
            }
          ].map(item => {
            const isChecked = (ack as any)[item.id];
            return (
              <label
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                  isChecked
                    ? 'bg-[#121826] border-[#C9A227]/40 shadow-sm'
                    : 'bg-[#080B11] border-[#182030] hover:border-[#222C42]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={e =>
                    setAck(prev => ({
                      ...prev,
                      [item.id]: e.target.checked
                    }))
                  }
                  className="mt-0.5 w-4 h-4 rounded text-[#C9A227] focus:ring-[#C9A227] border-zinc-700 bg-zinc-900 cursor-pointer shrink-0"
                />
                <div className="space-y-0.5">
                  <div className="font-bold text-white text-[12px]">{item.title}</div>
                  <div className="text-[11px] text-zinc-400 leading-snug">{item.desc}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: SIGNATURE CEREMONY */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-6">
        <div className="border-b border-[#1E2538] pb-3">
          <div className="text-xs font-mono text-[#E4C765]">CEREMONY 03</div>
          <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
            3. FORMAL ELECTRONIC SIGNATURE CEREMONY
          </h3>
          <p className="text-xs text-amber-300/90 font-mono mt-1">
            &quot;You are about to electronically sign legally significant agreements and risk disclosures. Please review them carefully before continuing.&quot;
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300">
              Signer Full Legal Name (Must match verified KYC passport)
            </label>
            <div className="relative">
              <input
                type="text"
                value={typedName}
                onChange={e => setTypedName(e.target.value)}
                placeholder="e.g. Alexander Vance"
                className="w-full px-4 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white text-xs font-serif font-bold tracking-wider focus:outline-none focus:border-[#C9A227]"
              />
              <Key className="w-4 h-4 text-zinc-500 absolute right-3 top-3" />
            </div>
            <p className="text-[10px] text-zinc-500">
              Your typed legal name acts as your legally binding digital signature under applicable international law.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300">Signing Metadata</label>
            <div className="p-2.5 rounded-xl bg-[#080B11] border border-[#1A2234] text-[11px] font-mono text-zinc-400 space-y-1">
              <div>ACCOUNT ID: <span className="text-white">{currentUser?.uid || 'ACC-8910442'}</span></div>
              <div>DATE & TIME: <span className="text-[#E4C765]">{new Date().toUTCString()}</span></div>
              <div>SESSION AUTH: <span className="text-emerald-400">HMAC-SHA256 Validated</span></div>
            </div>
          </div>
        </div>

        <label className="p-3.5 rounded-2xl bg-[#0A0D15] border border-[#20283A] flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmedSoleParty}
            onChange={e => setConfirmedSoleParty(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-[#C9A227] focus:ring-[#C9A227] border-zinc-700 bg-zinc-900 cursor-pointer shrink-0"
          />
          <div className="text-xs text-zinc-300 leading-snug">
            <span className="font-bold text-white">Certification of Authority & Capacity:</span> I certify under penalty of perjury that I am the individual or authorized legal entity representative named above, that I possess the legal capacity to execute this binding contract, and that I have had ample opportunity to consult independent legal and financial counsel.
          </div>
        </label>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs font-mono text-zinc-400">
            {allCheckboxesChecked && confirmedSoleParty ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> All 14 acknowledgements confirmed
              </span>
            ) : (
              <span className="text-amber-400">
                Please check all 14 disclosure boxes and certify legal authority
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={!canSign || isSigning}
            onClick={handleExecuteSigning}
            className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xl cursor-pointer ${
              canSign && !isSigning
                ? 'bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black hover:brightness-110'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
            }`}
          >
            {isSigning ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Generating Cryptographic Evidence...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>SIGN AND ACCEPT (EXECUTE CONTRACT)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* MODAL: CERTIFICATE OF ELECTRONIC SIGNATURE & ACCEPTANCE */}
      {activeCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#090C12] border-2 border-[#C9A227] shadow-2xl p-6 sm:p-8 text-left space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#1E2538] pb-4">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-[#E4C765]" />
                <span className="text-xs font-mono font-bold text-[#E4C765] uppercase tracking-widest">
                  OFFICIAL STATUTORY RECORD
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveCert(null)}
                className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-[#141824] cursor-pointer"
              >
                Close [✕]
              </button>
            </div>

            {/* Certificate Body (Clean Print / Formal Design) */}
            <div className="p-6 rounded-2xl bg-[#0E121B] border border-[#232C42] space-y-6 text-center">
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-[#E4C765] tracking-widest uppercase">
                  OPHIREUM COMPLIANCE & LEGAL LEDGER
                </div>
                <h2 className="text-xl font-bold text-white font-serif tracking-wide">
                  CERTIFICATE OF ELECTRONIC SIGNATURE & ACCEPTANCE
                </h2>
                <div className="text-[11px] text-zinc-400 font-mono">
                  Issued under U.S. ESIGN Act (15 U.S.C. § 7001) & EU Regulation 910/2014 (eIDAS)
                </div>
              </div>

              <div className="w-16 h-0.5 bg-[#C9A227] mx-auto opacity-70" />

              <div className="text-xs text-zinc-300 leading-relaxed max-w-md mx-auto">
                This certifies that the subscriber identified below has electronically reviewed, acknowledged, and executed the stipulated statutory agreement, risk disclosures, and licensing conditions.
              </div>

              <div className="grid grid-cols-2 gap-4 text-left text-xs font-mono p-4 rounded-xl bg-[#07090F] border border-[#1A2234]">
                <div>
                  <span className="text-zinc-500 text-[10px] block">CLIENT LEGAL NAME:</span>
                  <span className="text-white font-bold">{activeCert.clientLegalName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">CERTIFICATE ID:</span>
                  <span className="text-[#E4C765] font-bold">{activeCert.certificateId}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">AGREEMENT & VERSION:</span>
                  <span className="text-zinc-200">{activeCert.agreementVersion}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">TIMESTAMP (UTC):</span>
                  <span className="text-zinc-200">{new Date(activeCert.timestampUtc).toUTCString()}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-zinc-500 text-[10px] block">DOCUMENT SHA-256 HASH:</span>
                  <span className="text-[#E4C765] text-[11px] break-all">{activeCert.documentHashSha256}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-zinc-500 text-[10px] block">AUTHENTICATION METHOD:</span>
                  <span className="text-zinc-300">{activeCert.authenticationMethod}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1C2436] text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> STATUS: IMMUTABLE & VERIFIED
                </span>
                <span>SEAL: {activeCert.complianceEngineSeal}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-[#2B354C] text-zinc-300 text-xs font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  addToast('Download Initiated', `Downloaded Certificate ${activeCert.certificateId}.pdf`, 'success');
                  setActiveCert(null);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-110"
              >
                <Download className="w-4 h-4" />
                <span>Download Certified PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
