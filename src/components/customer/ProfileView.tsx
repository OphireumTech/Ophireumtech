/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Client Profile View
 * Section 30: Personal info, contact info, KYC status. Non-editable restricted
 * fields display "Request Change" to preserve institutional compliance.
 */

import React, { useState } from 'react';
import { User, ShieldCheck, Mail, Phone, MapPin, CheckCircle2, Lock, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfileView: React.FC = () => {
  const { currentUser, addToast } = useApp();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestField, setRequestField] = useState('');

  const handleRequestChange = (fieldName: string) => {
    setRequestField(fieldName);
    setShowRequestModal(true);
  };

  const handleConfirmRequest = () => {
    setShowRequestModal(false);
    addToast(
      'Change Request Submitted',
      `Your request to update ${requestField} has been routed to our compliance desk. A case manager will contact you within 24 hours.`,
      'info'
    );
  };

  const displayName = currentUser?.fullName || 'Alexander Vance';
  const email = currentUser?.email || 'alexander.vance@ophireum.demo';

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Profile Card */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2538] pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C9A227] to-[#E4C765] text-black font-bold text-lg flex items-center justify-center font-serif">
              {displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-serif">{displayName}</h1>
              <div className="text-xs text-zinc-400 mt-0.5">{email}</div>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold self-start sm:self-auto flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            LEVEL 2 KYC VERIFIED
          </span>
        </div>

        {/* Personal Details */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">Full Legal Name</span>
                <span className="font-bold text-white text-sm mt-0.5">{displayName}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRequestChange('Full Legal Name')}
                className="text-[11px] text-[#C9A227] hover:text-[#E4C765] font-medium cursor-pointer"
              >
                Request Change
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">Registered Email</span>
                <span className="font-bold text-white text-sm mt-0.5">{email}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRequestChange('Email Address')}
                className="text-[11px] text-[#C9A227] hover:text-[#E4C765] font-medium cursor-pointer"
              >
                Request Change
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">Country of Residence</span>
                <span className="font-bold text-white text-sm mt-0.5">United Kingdom</span>
              </div>
              <button
                type="button"
                onClick={() => handleRequestChange('Country of Residence')}
                className="text-[11px] text-[#C9A227] hover:text-[#E4C765] font-medium cursor-pointer"
              >
                Request Change
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141824] border border-[#222A3B] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">Account Classification</span>
                <span className="font-bold text-white text-sm mt-0.5">Individual Professional</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">TIER-1</span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3.5 rounded-xl bg-[#10141F] border border-[#1C2334] text-xs text-zinc-400 flex items-center gap-3">
          <Lock className="w-4 h-4 text-[#C9A227] shrink-0" />
          <span>
            Identity records are locked post-verification. Modifying personal legal data requires regulatory re-verification by compliance officers.
          </span>
        </div>
      </div>

      {/* Request Change Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#0D1017] border border-[#222B3D] shadow-2xl p-6 space-y-4 text-left">
            <h3 className="text-base font-bold text-white font-serif">Request Profile Modification</h3>
            <p className="text-xs text-zinc-400">
              You are requesting to update your <strong className="text-white">{requestField}</strong>. For your security, changes to verified credentials require supporting documentation.
            </p>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Reason for update / New value:</label>
              <textarea
                rows={3}
                placeholder="Explain the update request..."
                className="w-full bg-[#141824] border border-[#222A3B] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C9A227]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRequest}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold text-xs cursor-pointer"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
