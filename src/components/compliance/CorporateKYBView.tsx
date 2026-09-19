/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Corporate Onboarding & KYB Verification Console
 * Section 5 & 7: Entity registration, statutory corporate filings,
 * authorized representatives, and verification pipeline.
 */

import React, { useState, useEffect } from 'react';
import {
  Building2,
  FileCheck,
  ShieldCheck,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  UserCheck,
  Plus,
  Trash2,
  Lock
} from 'lucide-react';
import { complianceEngine } from '../../services/complianceEngine';
import { CorporateKYBRecord, AuthorizedRepresentative, AccountClassification } from '../../types/compliance';
import { useApp } from '../../context/AppContext';

export const CorporateKYBView: React.FC = () => {
  const { addToast } = useApp();
  const [complianceState, setComplianceState] = useState(() => complianceEngine.getState());

  useEffect(() => {
    return complianceEngine.subscribe(() => {
      setComplianceState(complianceEngine.getState());
    });
  }, []);

  const [formData, setFormData] = useState<CorporateKYBRecord>(() => {
    return (
      complianceState.corporateKYB || {
        legalCompanyName: 'Vance Capital Strategies Ltd',
        tradingName: 'VCS Quant Tech',
        registrationNumber: '12948201',
        jurisdiction: 'United Kingdom',
        registrationDate: '2020-04-18',
        registeredAddress: {
          street: '42 Berkeley Square, Mayfair',
          city: 'London',
          provinceState: 'Greater London',
          postalCode: 'W1J 5AW',
          country: 'United Kingdom'
        },
        principalBusinessAddress: {
          street: '42 Berkeley Square, Mayfair',
          city: 'London',
          provinceState: 'Greater London',
          postalCode: 'W1J 5AW',
          country: 'United Kingdom'
        },
        website: 'https://vancecapital.example.com',
        businessActivity: 'Algorithmic financial technology and automated quantitative trading',
        industry: 'Fintech & Quantitative Trading Systems',
        taxIdentificationNumber: 'GB-TAX-9948201',
        regulatoryStatus: 'Unregulated Technology Entity (Software Licensee)',
        entityType: 'corporation',
        status: 'verified',
        uploadedDocuments: [
          {
            type: 'Certificate of Incorporation',
            name: 'VCS_Cert_Of_Incorporation_CompaniesHouse.pdf',
            hash: '7a9c8b01e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b',
            uploadedAt: '2026-01-15T09:30:00Z'
          },
          {
            type: 'Articles of Association',
            name: 'Articles_of_Association_Adopted.pdf',
            hash: '3f2d1e0a89fc1c149afbf4c8996fb92427ae41e4649b934ca495991be3b0c442',
            uploadedAt: '2026-01-15T09:35:00Z'
          },
          {
            type: 'Register of Directors & Shareholders',
            name: 'Current_Register_Directors_Shareholders_Certified.pdf',
            hash: '90ab12cd34ef567890abcdef1234567890abcdef1234567890abcdef12345678',
            uploadedAt: '2026-01-15T09:40:00Z'
          }
        ]
      }
    );
  });

  const [representatives, setRepresentatives] = useState<AuthorizedRepresentative[]>(
    complianceState.authorizedRepresentatives
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      complianceEngine.updateState(prev => ({
        ...prev,
        accountClassification: formData.entityType,
        corporateKYB: formData,
        authorizedRepresentatives: representatives
      }));
      setIsSaving(false);
      addToast('Corporate KYB Updated', 'Entity records and statutory filings updated successfully.', 'success');
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2538] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#E4C765] uppercase tracking-wider">
                COMPLIANCE GATE 03
              </div>
              <h1 className="text-xl font-bold text-white font-serif">
                CORPORATE ONBOARDING & KYB VERIFICATION
              </h1>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
              KYB STATUS: {formData.status.toUpperCase()}
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Corporations, partnerships, and institutional entities licensing Ophireum technology must document corporate registry standing, statutory officers, and authorized signatory powers.
        </p>
      </div>

      {/* Entity Profile Form */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-6">
        <div className="border-b border-[#1E2538] pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
            1. ENTITY LEGAL REGISTRY
          </h3>
          <span className="text-[11px] font-mono text-zinc-400">All fields required for corporate accounts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Entity Legal Classification</label>
            <select
              value={formData.entityType}
              onChange={e => setFormData({ ...formData, entityType: e.target.value as AccountClassification })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white focus:outline-none focus:border-[#C9A227]"
            >
              <option value="corporation">Corporation (Ltd, LLC, Inc)</option>
              <option value="sole_proprietor">Sole Proprietorship</option>
              <option value="partnership">General or Limited Partnership</option>
              <option value="trust">Trust or Foundation</option>
              <option value="institution">Institutional / Family Office</option>
              <option value="other_legal_entity">Other Statutory Legal Entity</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Registered Legal Company Name</label>
            <input
              type="text"
              value={formData.legalCompanyName}
              onChange={e => setFormData({ ...formData, legalCompanyName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Trading Name / DBA (Optional)</label>
            <input
              type="text"
              value={formData.tradingName || ''}
              onChange={e => setFormData({ ...formData, tradingName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Company Registration Number</label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={e => setFormData({ ...formData, registrationNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white font-mono focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Incorporation Jurisdiction</label>
            <input
              type="text"
              value={formData.jurisdiction}
              onChange={e => setFormData({ ...formData, jurisdiction: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Tax Identification Number (TIN / VAT)</label>
            <input
              type="text"
              value={formData.taxIdentificationNumber}
              onChange={e => setFormData({ ...formData, taxIdentificationNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white font-mono focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="font-semibold text-zinc-300">Registered Office Address</label>
            <input
              type="text"
              value={formData.registeredAddress.street}
              onChange={e =>
                setFormData({
                  ...formData,
                  registeredAddress: { ...formData.registeredAddress, street: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">City / Postal Code</label>
            <input
              type="text"
              value={`${formData.registeredAddress.city}, ${formData.registeredAddress.postalCode}`}
              onChange={e => {
                const parts = e.target.value.split(',');
                setFormData({
                  ...formData,
                  registeredAddress: {
                    ...formData.registeredAddress,
                    city: parts[0]?.trim() || '',
                    postalCode: parts[1]?.trim() || ''
                  }
                });
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Website URL</label>
            <input
              type="text"
              value={formData.website}
              onChange={e => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white focus:outline-none focus:border-[#C9A227]"
            />
          </div>
        </div>
      </div>

      {/* Corporate Document Checklist */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-4">
        <div className="border-b border-[#1E2538] pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
              2. MANDATORY STATUTORY DOCUMENTATION
            </h3>
            <p className="text-[11px] text-zinc-400">
              Upload certified English copies or certified translations. Files pass through isolated antivirus and SHA-256 hashing.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const fakeDoc = {
                type: 'Board Resolution',
                name: 'Board_Resolution_Authorizing_EA_Subscription.pdf',
                hash: 'b8e90a12cd34ef567890abcdef1234567890abcdef1234567890abcdef12345678',
                uploadedAt: new Date().toISOString()
              };
              setFormData({
                ...formData,
                uploadedDocuments: [fakeDoc, ...formData.uploadedDocuments]
              });
              addToast('Document Staged', 'Board Resolution added to security pipeline.', 'info');
            }}
            className="px-3 py-1.5 rounded-xl bg-[#151A28] border border-[#242E44] text-xs font-semibold text-zinc-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#E4C765]" />
            <span>Upload Document</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {formData.uploadedDocuments.map((doc, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[#080B11] border border-[#1C2336] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white truncate">{doc.name}</div>
                  <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-2">
                    <span className="text-[#E4C765]">{doc.type}</span>
                    <span>•</span>
                    <span className="truncate">SHA: {doc.hash.substring(0, 16)}...</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                  APPROVED
                </span>
                <span className="text-zinc-500">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Authorized Representatives */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-4">
        <div className="border-b border-[#1E2538] pb-3">
          <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
            3. AUTHORIZED CORPORATE SIGNATORIES
          </h3>
          <p className="text-[11px] text-zinc-400">
            Persons authorized by corporate resolution to execute technology purchase agreements and bind trading accounts.
          </p>
        </div>

        <div className="space-y-3">
          {representatives.map(rep => (
            <div key={rep.id} className="p-4 rounded-2xl bg-[#080B11] border border-[#1E2638] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-[#E4C765]" />
                  <span className="font-bold text-white">{rep.name}</span>
                  <span className="text-zinc-400 font-mono">({rep.position})</span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#151C2C] text-zinc-300">
                  {rep.authorizationType.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-zinc-400 pt-1 border-t border-[#161D2E]">
                <div>Email: <span className="text-white">{rep.email}</span></div>
                <div>Phone: <span className="text-white">{rep.mobile}</span></div>
                <div>ID Ref: <span className="text-white">{rep.governmentIdNumber}</span></div>
                <div>Effective: <span className="text-[#E4C765]">{rep.effectiveDate}</span></div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/30">
                  ✓ Purchase Technology
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/30">
                  ✓ Connect Trading Accounts
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/30">
                  ✓ Sign Agreements
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/30">
                  ✓ Bind/Unbind EA
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="pt-3 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-110"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSaving ? 'Updating...' : 'Save & Verify Corporate Records'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
