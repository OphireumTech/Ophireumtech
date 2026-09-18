/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Client Identity Verification View
 * Sections 6, 7 & 46: Step-by-step KYC verification workflow with clear steps,
 * single primary action button, accepted document types, and secure data handling.
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Upload,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const IdentityVerificationView: React.FC = () => {
  const { currentUser, addToast } = useApp();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(4); // Already verified for active customer session

  // Form states
  const [fullName, setFullName] = useState(currentUser?.fullName || 'Alexander Vance');
  const [country, setCountry] = useState('United Kingdom');
  const [docType, setDocType] = useState<'passport' | 'id_card' | 'license'>('passport');
  const [docNumber, setDocNumber] = useState('GB89210344');

  const handleComplete = () => {
    setStep(4);
    addToast('Identity Verified', 'Your Level 2 KYC status has been renewed and approved.', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E2538] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white font-serif tracking-wide">
                IDENTITY VERIFICATION
              </h1>
              <p className="text-xs text-zinc-400">
                Institutional KYC standard to authorize algorithmic execution.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
            LEVEL 2 VERIFIED
          </span>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { num: 1, label: 'Personal Details' },
            { num: 2, label: 'Document Type' },
            { num: 3, label: 'Document Upload' },
            { num: 4, label: 'Verified Status' }
          ].map(s => (
            <div
              key={s.num}
              onClick={() => setStep(s.num as any)}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                step === s.num
                  ? 'bg-[#C9A227]/15 border-[#C9A227]/40 text-[#E4C765] font-bold'
                  : step > s.num
                  ? 'bg-[#121622] border-[#20283A] text-zinc-400'
                  : 'bg-[#0A0D14] border-[#161C2A] text-zinc-600'
              }`}
            >
              <div className="text-[10px] font-mono text-zinc-500">Step 0{s.num}</div>
              <div className="text-[11px] truncate mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 4: VERIFIED STATUS CARD */}
      {step === 4 && (
        <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-xl space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <div className="text-sm font-bold text-white">Identity Verification Complete</div>
              <div className="text-xs text-zinc-300 mt-0.5">
                Your profile is officially verified for automated institutional execution and raw MT5 connectivity.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B]">
              <span className="text-zinc-500 block text-[10px]">VERIFIED NAME</span>
              <span className="text-white font-bold text-sm">{fullName}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B]">
              <span className="text-zinc-500 block text-[10px]">DOCUMENT TYPE</span>
              <span className="text-white font-bold text-sm">International Passport</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B]">
              <span className="text-zinc-500 block text-[10px]">DOCUMENT NUMBER</span>
              <span className="text-white font-bold text-sm">{docNumber}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B]">
              <span className="text-zinc-500 block text-[10px]">VALIDITY STATUS</span>
              <span className="text-emerald-400 font-bold text-sm">Active (Expires Sept 2029)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500 pt-2 border-t border-[#181E2B]">
            <Lock className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Biometric records are tokenized and stored in AES-256 encrypted cold storage.</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-zinc-400 hover:text-white cursor-pointer"
            >
              Update Document / Re-verify
            </button>
            <span className="text-xs text-emerald-400 font-mono font-semibold">
              Ready for Automated Execution
            </span>
          </div>
        </div>
      )}

      {/* STEP 1: PERSONAL DETAILS */}
      {step === 1 && (
        <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Step 1: Personal Details</h2>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-[#141824] border border-[#222A3B] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C9A227]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Country of Residence</label>
              <input
                type="text"
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full bg-[#141824] border border-[#222A3B] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DOCUMENT TYPE */}
      {step === 2 && (
        <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Step 2: Select Document Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'passport', label: 'Passport', desc: 'Government-issued passport' },
              { id: 'id_card', label: 'National ID', desc: 'Official government identity card' },
              { id: 'license', label: "Driver's License", desc: 'Full driving permit' }
            ].map(d => (
              <div
                key={d.id}
                onClick={() => setDocType(d.id as any)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-colors ${
                  docType === d.id
                    ? 'bg-[#C9A227]/15 border-[#C9A227] text-white'
                    : 'bg-[#141824] border-[#222A3B] text-zinc-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold text-white">{d.label}</div>
                <div className="text-[11px] text-zinc-400 mt-1">{d.desc}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs text-zinc-400 hover:text-white cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continue to Upload</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: UPLOAD */}
      {step === 3 && (
        <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Step 3: Document Upload</h2>
          <div className="border-2 border-dashed border-[#263048] rounded-2xl p-8 text-center space-y-3 bg-[#111522]/50">
            <Upload className="w-8 h-8 text-[#C9A227] mx-auto" />
            <div className="text-xs font-medium text-white">Drag & drop your document or click to browse</div>
            <div className="text-[10px] text-zinc-500">Supports JPG, PNG, PDF up to 10MB</div>
            <button
              type="button"
              onClick={handleComplete}
              className="px-4 py-2 rounded-xl bg-[#1E273A] hover:bg-[#28344E] text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Select File
            </button>
          </div>
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 text-xs text-zinc-400 hover:text-white cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleComplete}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold text-xs cursor-pointer"
            >
              Submit for Verification
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
