/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM SIMULATED KYC & COMPLIANCE VERIFICATION WORKFLOW
 * Sections 68, 69, 70, 71: Complete end-to-end interactive KYC simulation with OCR, liveness, duplicate screening, and OCID generation.
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Camera,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  UserCheck,
  Building2,
  Scan,
  Fingerprint,
  FileCheck,
  Search,
  UploadCloud
} from 'lucide-react';
import { DemoKYCProfile } from '../../types/demo';
import { demoEngine } from '../../services/demoEngine';

interface DemoKYCWorkflowProps {
  kycProfile?: DemoKYCProfile;
  currentKyc?: DemoKYCProfile;
  addToast?: (title: string, msg: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
}

export const DemoKYCWorkflow: React.FC<DemoKYCWorkflowProps> = ({ kycProfile, currentKyc, addToast }) => {
  const engineKyc = typeof demoEngine !== 'undefined' ? demoEngine.getState()?.kyc : null;
  const profile: any = kycProfile || currentKyc || engineKyc || {
    ocid: 'OCID-DEMO-882194',
    status: 'VERIFIED — DEMO',
    duplicateResult: 'NO MATCH',
    entityType: 'INDIVIDUAL',
    documentType: 'PASSPORT'
  };

  const ocid = profile.ocid || 'OCID-DEMO-882194';
  const status = profile.status || 'VERIFIED — DEMO';
  const duplicateResult = profile.duplicateResult || 'NO MATCH';

  const [accountType, setAccountType] = useState<'INDIVIDUAL' | 'BUSINESS'>(profile.accountType || profile.entityType || 'INDIVIDUAL');
  const [docType, setDocType] = useState<DemoKYCProfile['documentType']>(profile.documentType || 'PASSPORT');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrStep, setOcrStep] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'form' | 'ocr' | 'duplicate'>('form');

  // Fields
  const [firstName, setFirstName] = useState(profile.firstName || profile.extractedFields?.fullName?.split(' ')[0] || 'Alexander');
  const [lastName, setLastName] = useState(profile.lastName || profile.extractedFields?.fullName?.split(' ').slice(1).join(' ') || 'Vance Hayes');
  const [docNumber, setDocNumber] = useState(profile.documentNumber || profile.extractedFields?.docNumber || 'P98421098');
  const [nationality, setNationality] = useState(profile.nationality || profile.extractedFields?.nationality || 'United States');

  const runSimulatedOCR = () => {
    setIsProcessing(true);
    setActiveTab('ocr');
    const steps = [
      'Document Received (Simulated Ingestion)...',
      'Optical Character Recognition (OCR Engine)...',
      'Document Analysis & Tamper Detection...',
      'Facial Liveness Match (3D Depth Map)...',
      'Anti-Money Laundering & Sanctions Screening...',
      'Duplicate Screening (Database Cross-Check)...',
      'Automated Compliance Risk Scoring...',
      'Verification Finalized (VERIFIED — DEMO)'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setOcrStep(step);
        if (idx === steps.length - 1) {
          setIsProcessing(false);
          demoEngine.updateKYCStatus('VERIFIED — DEMO', 'NO MATCH');
          if (addToast) {
            addToast(
              'KYC Workflow Completed — DEMO',
              `OCR verified extracted identity. Generated OCID: ${ocid}`,
              'success'
            );
          }
        }
      }, (idx + 1) * 700);
    });
  };

  const handleDuplicateTest = (result: DemoKYCProfile['duplicateResult']) => {
    demoEngine.updateKYCStatus(
      result === 'NO MATCH' ? 'VERIFIED — DEMO' : 'COMPLIANCE REVIEW',
      result
    );
    if (addToast) {
      addToast(
        'Duplicate Check Updated',
        `Simulated screening result: ${result}`,
        result === 'NO MATCH' ? 'success' : 'warning'
      );
    }
  };

  return (
    <div className="bg-[#0D1017] border border-[#232A3B] rounded-2xl p-5 sm:p-7 space-y-6 text-left shadow-xl">
      {/* Title & Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E2536] pb-4">
        <div>
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#E4C765] font-bold">
            Sections 68-71 • Identity & Compliance Module
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
            <span>SIMULATED KYC WORKFLOW</span>
            <span className="px-2 py-0.5 rounded bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#E4C765] text-xs font-mono">
              SIMULATED
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-zinc-400 uppercase font-mono">Unique Client ID</div>
            <div className="font-mono font-bold text-[#E4C765] text-sm">{ocid}</div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#141824] border border-[#2B354C] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">{status}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-[#141824] p-1 border border-[#232A3B] text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('form')}
          className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'form' ? 'bg-[#232A3B] text-white font-bold shadow' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-[#E4C765]" />
          <span>Profile & Upload</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ocr')}
          className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'ocr' ? 'bg-[#232A3B] text-white font-bold shadow' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Scan className="w-3.5 h-3.5 text-[#E4C765]" />
          <span>OCR & Liveness Engine</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('duplicate')}
          className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'duplicate' ? 'bg-[#232A3B] text-white font-bold shadow' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-[#E4C765]" />
          <span>Duplicate Screening Simulation</span>
        </button>
      </div>

      {/* TAB 1: Profile & Document Upload */}
      {activeTab === 'form' && (
        <div className="space-y-5 text-xs">
          {/* Account Type Selector */}
          <div>
            <label className="block text-zinc-400 font-medium mb-2">Account Entity Classification</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccountType('INDIVIDUAL')}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-colors cursor-pointer ${
                  accountType === 'INDIVIDUAL'
                    ? 'bg-[#C9A227]/10 border-[#C9A227] text-white'
                    : 'bg-[#121622] border-[#232A3B] text-zinc-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-5 h-5 text-[#E4C765]" />
                <div className="text-left">
                  <div className="font-bold">Individual Account</div>
                  <div className="text-[11px] text-zinc-400">Retail proprietary trader</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAccountType('BUSINESS')}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-colors cursor-pointer ${
                  accountType === 'BUSINESS'
                    ? 'bg-[#C9A227]/10 border-[#C9A227] text-white'
                    : 'bg-[#121622] border-[#232A3B] text-zinc-400 hover:text-white'
                }`}
              >
                <Building2 className="w-5 h-5 text-[#E4C765]" />
                <div className="text-left">
                  <div className="font-bold">Business / Institutional</div>
                  <div className="text-[11px] text-zinc-400">Corporate or fund entity</div>
                </div>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">First Legal Name</label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full bg-[#121622] border border-[#232A3B] rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Last Legal Name</label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full bg-[#121622] border border-[#232A3B] rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Document Type</label>
              <select
                value={docType}
                onChange={e => setDocType(e.target.value as any)}
                className="w-full bg-[#121622] border border-[#232A3B] rounded-lg px-3 py-2 text-white"
              >
                <option value="PASSPORT">Passport (International)</option>
                <option value="DRIVERS_LICENSE">Driver's License (State / Provincial)</option>
                <option value="NATIONAL_ID">National Identity Card</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Document Number</label>
              <input
                type="text"
                value={docNumber}
                onChange={e => setDocNumber(e.target.value)}
                className="w-full bg-[#121622] border border-[#232A3B] rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          {/* Simulated File Upload Zone */}
          <div className="p-6 rounded-xl bg-[#121622] border border-dashed border-[#2B354C] flex flex-col items-center justify-center text-center space-y-2">
            <UploadCloud className="w-8 h-8 text-[#E4C765]" />
            <div className="font-bold text-white">Upload Identity Document (Simulation)</div>
            <p className="text-[11px] text-zinc-400 max-w-sm">
              Supports simulated JPG, PNG, PDF. High-resolution front & back photograph capture simulated.
            </p>
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={runSimulatedOCR}
                className="px-4 py-2 rounded-lg bg-[#C9A227] hover:bg-[#E4C765] text-[#08090B] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                <span>Simulate Camera Scan & Run OCR</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OCR & Liveness Engine */}
      {activeTab === 'ocr' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-[#121622] border border-[#232A3B] space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-white flex items-center gap-2">
                <Scan className="w-4 h-4 text-[#E4C765]" />
                <span>Simulated Automated Verification Pipeline</span>
              </div>
              {isProcessing && <RefreshCw className="w-4 h-4 text-[#E4C765] animate-spin" />}
            </div>

            <div className="p-3 rounded-lg bg-[#090B10] font-mono text-zinc-300 text-[11px] border border-[#1B2130]">
              {ocrStep || 'Pipeline ready. Click "Execute Automated OCR Pipeline" to test.'}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
              <div className="p-2 rounded-lg bg-[#141824] border border-[#232A3B]">
                <div className="text-zinc-400">OCR Confidence</div>
                <div className="font-bold text-emerald-400 font-mono">99.4%</div>
              </div>
              <div className="p-2 rounded-lg bg-[#141824] border border-[#232A3B]">
                <div className="text-zinc-400">Liveness Score</div>
                <div className="font-bold text-emerald-400 font-mono">PASS (0.98)</div>
              </div>
              <div className="p-2 rounded-lg bg-[#141824] border border-[#232A3B]">
                <div className="text-zinc-400">AML / PEP Match</div>
                <div className="font-bold text-emerald-400 font-mono">CLEAR</div>
              </div>
              <div className="p-2 rounded-lg bg-[#141824] border border-[#232A3B]">
                <div className="text-zinc-400">Audit Proof</div>
                <div className="font-bold text-[#E4C765] font-mono truncate">SHA256-SIMULATED</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={runSimulatedOCR}
                className="w-full py-2.5 rounded-lg bg-[#181D29] hover:bg-[#232A3B] border border-[#2B354C] text-[#E4C765] font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>Execute Automated OCR Pipeline</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Duplicate Screening Simulation */}
      {activeTab === 'duplicate' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-[#121622] border border-[#232A3B] space-y-3">
            <div className="font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-[#E4C765]" />
              <span>Section 70: Duplicate Identity Detection Engine</span>
            </div>
            <p className="text-[11px] text-zinc-300">
              Test platform responses when an applicant matches an existing registered user, national identity number, or biometric hash.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleDuplicateTest('NO MATCH')}
                className="p-3 rounded-xl bg-[#141824] hover:bg-[#1C2233] border border-emerald-500/30 text-emerald-400 font-bold transition-colors cursor-pointer text-center"
              >
                NO MATCH
                <div className="text-[10px] text-zinc-400 font-normal mt-1">Direct Pass</div>
              </button>

              <button
                type="button"
                onClick={() => handleDuplicateTest('POSSIBLE MATCH')}
                className="p-3 rounded-xl bg-[#141824] hover:bg-[#1C2233] border border-amber-500/30 text-amber-400 font-bold transition-colors cursor-pointer text-center"
              >
                POSSIBLE MATCH
                <div className="text-[10px] text-zinc-400 font-normal mt-1">Partial Field Match</div>
              </button>

              <button
                type="button"
                onClick={() => handleDuplicateTest('MANUAL REVIEW')}
                className="p-3 rounded-xl bg-[#141824] hover:bg-[#1C2233] border border-blue-500/30 text-blue-400 font-bold transition-colors cursor-pointer text-center"
              >
                MANUAL REVIEW
                <div className="text-[10px] text-zinc-400 font-normal mt-1">Escalate to Staff</div>
              </button>

              <button
                type="button"
                onClick={() => handleDuplicateTest('CONFIRMED DUPLICATE — DEMO')}
                className="p-3 rounded-xl bg-[#141824] hover:bg-[#1C2233] border border-rose-500/30 text-rose-400 font-bold transition-colors cursor-pointer text-center"
              >
                CONFIRMED DUPLICATE
                <div className="text-[10px] text-zinc-400 font-normal mt-1">Blocked Entity</div>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[#090B10] border border-[#1B2130] text-[11px] font-mono flex items-center justify-between">
              <span className="text-zinc-400">Current Duplicate Status:</span>
              <span className="font-bold text-[#E4C765]">{duplicateResult}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
