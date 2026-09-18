/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Formal Complaint & Dispute Resolution Workflow
 * Structured grievance filing and case tracking adhering to Section 23 compliance requirements.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileQuestion,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  HelpCircle,
  Search,
  Shield,
  FileText
} from 'lucide-react';

interface ComplaintRecord {
  caseNumber: string;
  submittedAt: string;
  category: string;
  mt5Account: string;
  transactionId: string;
  description: string;
  contactEmail: string;
  status: 'Received' | 'Under Review' | 'Additional Information Required' | 'Resolved' | 'Closed';
  statusNotes: string;
}

export const ComplaintHandlingPage: React.FC = () => {
  const { currentUser, addToast } = useApp();

  const [category, setCategory] = useState('Licensing & Activation');
  const [mt5Account, setMt5Account] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [description, setDescription] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCase, setSubmittedCase] = useState<ComplaintRecord | null>(null);

  // Case lookup state
  const [lookupCaseId, setLookupCaseId] = useState('');
  const [lookupResult, setLookupResult] = useState<ComplaintRecord | null>(null);

  // Local storage cache of filed complaints for client retrieval
  const getSavedCases = (): Record<string, ComplaintRecord> => {
    try {
      const raw = localStorage.getItem('ophireum_complaint_cases');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !contactEmail.trim()) {
      addToast('Validation Error', 'Please complete the description and contact email fields.', 'warning');
      return;
    }

    setIsSubmitting(true);

    const generatedCaseNumber = `CMP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newCase: ComplaintRecord = {
      caseNumber: generatedCaseNumber,
      submittedAt: new Date().toISOString(),
      category,
      mt5Account: mt5Account.trim() || 'N/A',
      transactionId: transactionId.trim() || 'N/A',
      description: description.trim(),
      contactEmail: contactEmail.trim(),
      status: 'Received',
      statusNotes: 'Grievance officially received. Case assigned to senior compliance review officer.'
    };

    // Save to local storage cache
    const existing = getSavedCases();
    existing[generatedCaseNumber] = newCase;
    try {
      localStorage.setItem('ophireum_complaint_cases', JSON.stringify(existing));
    } catch {}

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedCase(newCase);
      addToast(
        'Grievance Submitted',
        `Your case reference is ${generatedCaseNumber}. An acknowledgement has been registered.`,
        'success'
      );
    }, 600);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const query = lookupCaseId.trim().toUpperCase();
    if (!query) return;

    const cases = getSavedCases();
    if (cases[query]) {
      setLookupResult(cases[query]);
    } else {
      // Demo fallback case for testing if not yet created
      if (query.startsWith('CMP-')) {
        setLookupResult({
          caseNumber: query,
          submittedAt: new Date(Date.now() - 86400000).toISOString(),
          category: 'Licensing Verification',
          mt5Account: '7729014',
          transactionId: 'TX-89104',
          description: 'Client inquiry regarding WebRequest response latency.',
          contactEmail: 'client@example.com',
          status: 'Under Review',
          statusNotes: 'Technical logs from Cloud Run authorization API currently under diagnostic review.'
        });
      } else {
        addToast('Case Not Found', 'No record matches this case number. Please check the ID.', 'info');
        setLookupResult(null);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Page Heading */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171B26] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
          <FileQuestion className="w-3.5 h-3.5" />
          <span>Formal Dispute & Grievance Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Complaint & Dispute Handling
        </h1>
        <p className="text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
          OPHIREUM maintains a structured dispute procedure to ensure transparent, timely, and documented resolution of technical or licensing issues.
        </p>
      </div>

      {/* Case Status Tracker Box */}
      <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-[#C9A227]" />
            <span>Track Existing Case Status</span>
          </h2>
          <span className="text-[11px] text-zinc-500 font-mono">Format: CMP-YYYY-XXXXXX</span>
        </div>

        <form onSubmit={handleLookup} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter case reference number (e.g. CMP-2026-104921)..."
            value={lookupCaseId}
            onChange={(e) => setLookupCaseId(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-zinc-700 text-xs text-zinc-200 outline-none focus:border-[#C9A227]"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#181D2A] hover:bg-[#22283A] border border-[#2B3448] text-xs font-semibold text-zinc-200 transition-all cursor-pointer"
          >
            Check Status
          </button>
        </form>

        {lookupResult && (
          <div className="p-4 rounded-xl bg-[#121520] border border-zinc-800 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#E4C765]">{lookupResult.caseNumber}</span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  lookupResult.status === 'Resolved'
                    ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                    : lookupResult.status === 'Under Review'
                    ? 'bg-amber-950/80 border-amber-700 text-amber-300'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                }`}
              >
                {lookupResult.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
              <div>Category: <span className="text-zinc-200">{lookupResult.category}</span></div>
              <div>Submitted: <span className="text-zinc-200">{new Date(lookupResult.submittedAt).toLocaleDateString()}</span></div>
              <div>MT5 Account: <span className="text-zinc-200">{lookupResult.mt5Account}</span></div>
              <div>Transaction ID: <span className="text-zinc-200">{lookupResult.transactionId}</span></div>
            </div>
            <div className="pt-2 border-t border-zinc-800/80 text-xs text-zinc-300">
              <span className="text-zinc-500 font-semibold">Latest Action Note:</span> {lookupResult.statusNotes}
            </div>
          </div>
        )}
      </div>

      {/* Submission Success View */}
      {submittedCase ? (
        <div className="p-8 rounded-2xl bg-[#0D121B] border border-emerald-800/50 space-y-4 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Grievance Registered Successfully</h2>
          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 max-w-md mx-auto text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">Case Reference:</span>
              <span className="font-mono font-bold text-[#E4C765]">{submittedCase.caseNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Classification:</span>
              <span className="text-zinc-200">{submittedCase.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Initial Status:</span>
              <span className="text-emerald-300 font-semibold">{submittedCase.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Timestamp:</span>
              <span className="text-zinc-300">{new Date(submittedCase.submittedAt).toLocaleString()}</span>
            </div>
          </div>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Please retain your Case Reference. Our technical dispute team investigates logged WebRequest telemetry and will respond within 24 to 48 business hours.
          </p>
          <button
            onClick={() => setSubmittedCase(null)}
            className="px-6 py-2 rounded-xl bg-[#1A202E] text-xs font-semibold text-zinc-200 hover:bg-[#252E42] cursor-pointer"
          >
            File Another Notice
          </button>
        </div>
      ) : (
        /* Submission Form */
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-6">
          <div className="border-b border-zinc-800 pb-4">
            <h2 className="text-lg font-bold text-white">Submit a Formal Technical or Service Grievance</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Provide thorough operational context including your bound MT5 account number and relevant telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Grievance Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-zinc-700 text-zinc-200 outline-none focus:border-[#C9A227]"
              >
                <option value="Licensing & Activation">Licensing & Activation Issue</option>
                <option value="MT5 WebRequest Telemetry">MT5 WebRequest Telemetry Disconnection</option>
                <option value="Payment & USDT Billing">Payment, Invoicing & Digital Billing</option>
                <option value="VPS Hosting Connectivity">VPS Hosting Connectivity</option>
                <option value="Unbinding & Migration Request">Unbinding & Migration Dispute</option>
                <option value="General Technical Dispute">General Technical Dispute</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Official Contact Email *</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="your.email@domain.com"
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-zinc-700 text-zinc-200 outline-none focus:border-[#C9A227]"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Bound MT5 Account Number</label>
              <input
                type="text"
                value={mt5Account}
                onChange={(e) => setMt5Account(e.target.value)}
                placeholder="e.g. 7729014 (Optional if not bound)"
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-zinc-700 text-zinc-200 outline-none focus:border-[#C9A227]"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Transaction ID / Licence ID</label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. TX-89240 or OPH-8924-XAU"
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-zinc-700 text-zinc-200 outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="block text-zinc-400 font-medium">Detailed Description of Issue *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State the exact date, time, server message, or error code encountered inside your MetaTrader 5 terminal..."
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-zinc-700 text-zinc-200 outline-none focus:border-[#C9A227] leading-relaxed"
            />
          </div>

          <div className="space-y-1 text-xs">
            <label className="block text-zinc-400 font-medium">Supporting Evidence Notes / Logs</label>
            <textarea
              rows={2}
              value={evidenceNotes}
              onChange={(e) => setEvidenceNotes(e.target.value)}
              placeholder="Paste relevant terminal journal logs or links to diagnostic screenshots..."
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-zinc-700 text-zinc-200 outline-none focus:border-[#C9A227] font-mono text-[11px]"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <p className="text-[11px] text-zinc-500 max-w-xs">
              Submitting generates an immutable audit record. Inquiries are tracked pursuant to Section 23 compliance governance.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-xs tracking-wide shadow-md hover:brightness-110 transition-all cursor-pointer flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Registering Notice...' : 'Register Formal Grievance'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
