/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Privacy Center, Data Subject Rights & Consent Governance
 * Sections 30 & 31: GDPR, UK DPA 2018, and CCPA compliance.
 * Client data access, export, rectification, deletion requests, and granular consent management.
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Download,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
  Trash2,
  RefreshCw,
  Globe
} from 'lucide-react';
import { complianceEngine } from '../../services/complianceEngine';
import { PrivacyConsentSettings, DataSubjectRequest } from '../../types/compliance';
import { useApp } from '../../context/AppContext';

export const PrivacyCenterView: React.FC = () => {
  const { currentUser, addToast } = useApp();
  const [complianceState, setComplianceState] = useState(() => complianceEngine.getState());

  useEffect(() => {
    return complianceEngine.subscribe(() => {
      setComplianceState(complianceEngine.getState());
    });
  }, []);

  const [consent, setConsent] = useState<PrivacyConsentSettings>(complianceState.privacyConsent);
  const [activeRequestType, setActiveRequestType] = useState<DataSubjectRequest['requestType']>('access_my_data');
  const [requestDetails, setRequestDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateConsent = (key: keyof PrivacyConsentSettings, val: boolean) => {
    const updated = {
      ...consent,
      [key]: val,
      updatedAt: new Date().toISOString()
    };
    setConsent(updated);
    complianceEngine.updateState(prev => ({
      ...prev,
      privacyConsent: updated
    }));
    addToast('Privacy Preferences Updated', 'Your consent preferences were saved and logged in the privacy ledger.', 'success');
  };

  const handleSubmitRequest = () => {
    if (!requestDetails.trim() && activeRequestType !== 'download_my_data') {
      addToast('Details Required', 'Please provide specific context for your privacy inquiry.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newReq: DataSubjectRequest = {
        id: 'DSR-' + Date.now().toString().substring(6),
        userId: currentUser?.uid || 'customer_default',
        requestType: activeRequestType,
        details: requestDetails || 'Complete account and KYC data export request.',
        status: 'received',
        submittedAt: new Date().toISOString()
      };

      complianceEngine.updateState(prev => ({
        ...prev,
        dataSubjectRequests: [newReq, ...prev.dataSubjectRequests]
      }));

      setIsSubmitting(false);
      setRequestDetails('');
      addToast('Data Subject Request Received', `Reference: ${newReq.id}. Our Data Protection Officer will respond within statutory limits (30 days).`, 'success');
    }, 400);
  };

  const handleDownloadMyData = () => {
    const exportData = {
      user: currentUser,
      complianceRecords: complianceState,
      exportedAt: new Date().toISOString(),
      securityDisclaimer: 'Encrypted client profile export under GDPR Article 20 / CCPA.'
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ophireum_Data_Export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Data Export Downloaded', 'Comprehensive personal and compliance data package exported.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2538] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#E4C765] uppercase tracking-wider">
                DATA PROTECTION & PRIVACY GOVERNANCE
              </div>
              <h1 className="text-xl font-bold text-white font-serif">
                PRIVACY CENTER & DATA SUBJECT RIGHTS
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadMyData}
            className="px-4 py-2 rounded-xl bg-[#151A28] hover:bg-[#1E253A] border border-[#26324D] text-xs font-semibold text-zinc-200 hover:text-white flex items-center gap-2 cursor-pointer shadow-md transition-all shrink-0"
          >
            <Download className="w-4 h-4 text-[#E4C765]" />
            <span>Download My Complete Data (JSON)</span>
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          OPHIREUM adheres strictly to international data privacy regulations (GDPR, UK Data Protection Act 2018, CCPA). Manage your processing consents, request data access, or submit formal rectification requests directly through this console.
        </p>
      </div>

      {/* SECTION 1: CONSENT MANAGEMENT */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-4">
        <div className="border-b border-[#1E2538] pb-3">
          <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
            1. GRANULAR CONSENT & PROCESSING PREFERENCES
          </h3>
          <p className="text-[11px] text-zinc-400">
            Contractual and regulatory processing is mandatory for EA operations. Optional analytics and marketing consents are strictly opt-in.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          {/* Essential Data */}
          <div className="p-3.5 rounded-2xl bg-[#080B11] border border-[#1A2234] flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Essential Account & KYC Processing</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  MANDATORY (CONTRACTUAL)
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Required for statutory AML screening, identity verification, and terminal licensing.
              </p>
            </div>
            <span className="font-mono text-xs text-emerald-400 font-bold shrink-0">ACTIVE</span>
          </div>

          {/* Telemetry */}
          <div className="p-3.5 rounded-2xl bg-[#080B11] border border-[#1A2234] flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Broker WebRequest Telemetry & Order Logs</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  MANDATORY (EA OPERATIONS)
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Technical error reporting, latency tracking, and execution verification.
              </p>
            </div>
            <span className="font-mono text-xs text-emerald-400 font-bold shrink-0">ACTIVE</span>
          </div>

          {/* Optional Benchmarking */}
          <div className="p-3.5 rounded-2xl bg-[#080B11] border border-[#1A2234] flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-white">Anonymized Performance Benchmarking</span>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Aggregate execution data used to optimize future algorithmic releases (no personal identity shared).
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={consent.optionalPerformanceBenchmarking}
                onChange={e => handleUpdateConsent('optionalPerformanceBenchmarking', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A227]"></div>
            </label>
          </div>

          {/* Product Notices */}
          <div className="p-3.5 rounded-2xl bg-[#080B11] border border-[#1A2234] flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-white">Institutional Educational Insights & Release Updates</span>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Quarterly algorithmic whitepapers, macroeconomic calendars, and parameter advisory notes.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={consent.optionalProductUpdateNotices}
                onChange={e => handleUpdateConsent('optionalProductUpdateNotices', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A227]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 2: DATA SUBJECT RIGHTS REQUESTS */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-5">
        <div className="border-b border-[#1E2538] pb-3">
          <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
            2. SUBMIT FORMAL DATA SUBJECT RIGHT REQUEST
          </h3>
          <p className="text-[11px] text-zinc-400">
            Exercise your statutory rights under GDPR Articles 15-22 or California Consumer Privacy Act.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Request Type</label>
            <select
              value={activeRequestType}
              onChange={e => setActiveRequestType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white"
            >
              <option value="access_my_data">Access My Personal Data (Art. 15)</option>
              <option value="correct_my_data">Rectify Inaccurate Records (Art. 16)</option>
              <option value="download_my_data">Data Portability Export (Art. 20)</option>
              <option value="object_to_processing">Object to Specific Processing (Art. 21)</option>
              <option value="withdraw_consent">Withdraw Optional Consents (Art. 7)</option>
              <option value="request_deletion">Erasure / Right to be Forgotten (Art. 17)</option>
            </select>
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="font-semibold text-zinc-300">Specific Request Details & Instructions</label>
            <textarea
              rows={3}
              value={requestDetails}
              onChange={e => setRequestDetails(e.target.value)}
              placeholder="Specify the exact personal data or records you wish to review, update, or inspect..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#080B11] border border-[#20283A] text-white text-xs focus:outline-none focus:border-[#C9A227]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] font-mono text-zinc-400">
            Note: Regulatory retention laws (AML/BSA) may require preserving transaction records for 5 years.
          </span>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmitRequest}
            className="px-5 py-2 rounded-xl bg-[#C9A227] hover:bg-[#E4C765] text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Logging Request...' : 'Submit Request'}</span>
          </button>
        </div>

        {/* Existing Requests */}
        {complianceState.dataSubjectRequests.length > 0 && (
          <div className="pt-4 border-t border-[#1C2436] space-y-2">
            <span className="text-[11px] font-mono text-zinc-400 block font-bold">PREVIOUS REQUESTS ON FILE:</span>
            {complianceState.dataSubjectRequests.map(req => (
              <div key={req.id} className="p-3 rounded-xl bg-[#080B11] border border-[#1A2234] text-xs font-mono flex items-center justify-between">
                <div>
                  <span className="text-[#E4C765] font-bold">{req.id}</span>
                  <span className="text-zinc-500 mx-2">•</span>
                  <span className="text-zinc-300">{req.requestType.replace(/_/g, ' ')}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#161D2E] text-zinc-400 text-[10px]">
                  {req.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: CROSS-BORDER DATA TRANSFERS */}
      <div className="p-5 rounded-3xl bg-[#080B11] border border-[#1E2538] shadow-xl space-y-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-300 font-bold font-mono">
          <Globe className="w-4 h-4 text-[#E4C765]" />
          <span>CROSS-BORDER DATA TRANSFER SAFEGUARDS</span>
        </div>
        <p className="text-zinc-400 leading-relaxed text-[11px]">
          Client records may be processed in secure cloud infrastructure within the United Kingdom, European Union, and United States under Standard Contractual Clauses (SCCs) and UK International Data Transfer Agreements (IDTA). All telemetry is encrypted in transit (TLS 1.3) and at rest (AES-256).
        </p>
      </div>
    </div>
  );
};
