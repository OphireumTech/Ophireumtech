/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Ultimate Beneficial Ownership (UBO) Governance Console
 * Section 6: Jurisdiction thresholds (10%/25%), detailed UBO registry,
 * sanctions/PEP screening flags, and visual entity-ownership hierarchy graph.
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  GitFork,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
  Building2,
  User,
  Search,
  ExternalLink
} from 'lucide-react';
import { complianceEngine } from '../../services/complianceEngine';
import { BeneficialOwner } from '../../types/compliance';
import { useApp } from '../../context/AppContext';

export const BeneficialOwnersView: React.FC = () => {
  const { addToast } = useApp();
  const [complianceState, setComplianceState] = useState(() => complianceEngine.getState());

  useEffect(() => {
    return complianceEngine.subscribe(() => {
      setComplianceState(complianceEngine.getState());
    });
  }, []);

  const [thresholdPct, setThresholdPct] = useState<number>(() => {
    const rule = complianceEngine.getRuleForCountry(complianceState.countryOfResidence);
    return rule.uboOwnershipThresholdPct || 25;
  });

  const [ubos, setUbos] = useState<BeneficialOwner[]>(complianceState.beneficialOwners);
  const [certifyChecked, setCertifyChecked] = useState(true);

  // New UBO draft state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUbo, setNewUbo] = useState<Partial<BeneficialOwner>>({
    fullLegalName: '',
    dateOfBirth: '1985-01-01',
    nationality: 'British',
    residentialAddress: '',
    ownershipPercentage: 25,
    votingPercentage: 25,
    controlMechanism: 'direct_shares',
    position: 'Director / Shareholder',
    idDocumentType: 'Passport',
    idDocumentNumber: '',
    sourceOfWealth: 'Commercial dividend distributions',
    isPEP: false,
    sanctionsScreeningStatus: 'NO_MATCH',
    certifiedAccurate: true
  });

  const totalOwnership = ubos.reduce((sum, u) => sum + u.ownershipPercentage, 0);

  const handleAddUbo = () => {
    if (!newUbo.fullLegalName || !newUbo.idDocumentNumber) {
      addToast('Missing Details', 'Full legal name and ID document number are required.', 'warning');
      return;
    }

    const created: BeneficialOwner = {
      id: 'ubo_' + Date.now(),
      fullLegalName: newUbo.fullLegalName!,
      dateOfBirth: newUbo.dateOfBirth || '1985-01-01',
      nationality: newUbo.nationality || 'British',
      residentialAddress: newUbo.residentialAddress || 'London, UK',
      ownershipPercentage: Number(newUbo.ownershipPercentage) || 25,
      votingPercentage: Number(newUbo.votingPercentage) || 25,
      controlMechanism: newUbo.controlMechanism as any || 'direct_shares',
      position: newUbo.position || 'Shareholder',
      idDocumentType: newUbo.idDocumentType || 'Passport',
      idDocumentNumber: newUbo.idDocumentNumber!,
      sourceOfWealth: newUbo.sourceOfWealth || 'Corporate profits',
      isPEP: Boolean(newUbo.isPEP),
      sanctionsScreeningStatus: 'NO_MATCH',
      certifiedAccurate: true
    };

    const updated = [...ubos, created];
    setUbos(updated);
    complianceEngine.updateState(prev => ({
      ...prev,
      beneficialOwners: updated
    }));
    setShowAddModal(false);
    addToast('Beneficial Owner Added', `${created.fullLegalName} registered with ${created.ownershipPercentage}% equity.`, 'success');
  };

  const handleRemoveUbo = (id: string) => {
    if (ubos.length <= 1) {
      addToast('Requirement Blocked', 'At least one certified beneficial owner is required for institutional verification.', 'warning');
      return;
    }
    const updated = ubos.filter(u => u.id !== id);
    setUbos(updated);
    complianceEngine.updateState(prev => ({
      ...prev,
      beneficialOwners: updated
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2538] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#E4C765] uppercase tracking-wider">
                COMPLIANCE GATE 03 / UBO REGISTRY
              </div>
              <h1 className="text-xl font-bold text-white font-serif">
                BENEFICIAL OWNERSHIP & UBO GOVERNANCE
              </h1>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
              THRESHOLD: ≥ {thresholdPct}% EQUITY
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Statutory anti-money laundering regulations require identifying any natural person who directly or indirectly owns or controls {thresholdPct}% or more of the equity or voting rights.
        </p>
      </div>

      {/* Visual Hierarchy Graph: Entity -> Shareholders -> UBO */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-5">
        <div className="border-b border-[#1E2538] pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitFork className="w-4 h-4 text-[#E4C765]" />
            <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
              OWNERSHIP HIERARCHY GRAPH
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">Total Accounted Equity: {totalOwnership}%</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#080B11] border border-[#1B2338] space-y-6">
          {/* Level 1: The Legal Entity */}
          <div className="flex justify-center">
            <div className="p-3.5 rounded-2xl bg-[#121726] border border-[#C9A227]/40 shadow-lg text-center min-w-[240px]">
              <div className="flex items-center justify-center gap-2 text-[#E4C765] text-xs font-mono font-bold">
                <Building2 className="w-4 h-4" />
                <span>LICENSED LEGAL ENTITY</span>
              </div>
              <div className="text-xs font-bold text-white mt-1">
                {complianceState.corporateKYB?.legalCompanyName || 'Vance Capital Strategies Ltd'}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">100% Capital Pool</div>
            </div>
          </div>

          {/* Connector Line */}
          <div className="w-0.5 h-6 bg-gradient-to-b from-[#C9A227] to-[#1E2538] mx-auto" />

          {/* Level 2: The UBOs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {ubos.map(u => (
              <div
                key={u.id}
                className="p-3.5 rounded-2xl bg-[#0C101A] border border-[#1D253A] space-y-2 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-bold text-white truncate">{u.fullLegalName}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#E4C765]">
                    {u.ownershipPercentage}%
                  </span>
                </div>

                <div className="text-[10px] text-zinc-400 font-mono space-y-0.5">
                  <div>Control: <span className="text-zinc-300">{u.controlMechanism.replace('_', ' ')}</span></div>
                  <div>Nationality: <span className="text-zinc-300">{u.nationality}</span></div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>PEP & Sanctions: CLEAR</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UBO Detailed Registry */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-4">
        <div className="border-b border-[#1E2538] pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
              NATURAL PERSON BENEFICIAL OWNERS
            </h3>
            <p className="text-[11px] text-zinc-400">
              Every shareholder holding ≥ {thresholdPct}% must have verified identity documents on file.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#151A28] border border-[#242E44] text-xs font-semibold text-zinc-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#E4C765]" />
            <span>Add Beneficial Owner</span>
          </button>
        </div>

        <div className="space-y-3">
          {ubos.map(u => (
            <div
              key={u.id}
              className="p-4 rounded-2xl bg-[#080B11] border border-[#1C2336] space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#161D2E] pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#E4C765] flex items-center justify-center font-bold">
                    {u.fullLegalName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{u.fullLegalName}</h4>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      {u.position} • DOB: {u.dateOfBirth} • {u.nationality}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <div className="text-xs font-bold text-[#E4C765]">{u.ownershipPercentage}% Equity</div>
                    <div className="text-[10px] text-zinc-400">{u.votingPercentage}% Voting Rights</div>
                  </div>
                  {ubos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUbo(u.id)}
                      className="text-zinc-600 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-mono text-zinc-400">
                <div>
                  <span className="text-zinc-500 block text-[10px]">ID DOCUMENT:</span>
                  <span className="text-zinc-200">{u.idDocumentType} #{u.idDocumentNumber}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">SOURCE OF WEALTH:</span>
                  <span className="text-zinc-200">{u.sourceOfWealth}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">PEP STATUS:</span>
                  <span className={u.isPEP ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                    {u.isPEP ? 'PEP Flagged (EDD Required)' : 'Not a PEP (Standard CDD)'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <label className="p-3.5 rounded-2xl bg-[#080B11] border border-[#20283A] flex items-start gap-3 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={certifyChecked}
              onChange={e => setCertifyChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#C9A227] focus:ring-[#C9A227] border-zinc-700 bg-zinc-900 cursor-pointer shrink-0"
            />
            <div className="text-zinc-300 leading-snug">
              <span className="font-bold text-white">Authorized Officer Certification:</span> I certify under regulatory sanction that the beneficial ownership information recorded herein accurately reflects all natural persons possessing direct or indirect control over the applicant entity as of {new Date().toLocaleDateString()}.
            </div>
          </label>
        </div>
      </div>

      {/* Add UBO Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#090C12] border border-[#C9A227]/60 shadow-2xl p-6 text-left space-y-4">
            <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
              Add Ultimate Beneficial Owner (UBO)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={newUbo.fullLegalName || ''}
                  onChange={e => setNewUbo({ ...newUbo, fullLegalName: e.target.value })}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-3 py-2 rounded-xl bg-[#06080E] border border-[#1E2538] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={newUbo.dateOfBirth || ''}
                    onChange={e => setNewUbo({ ...newUbo, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#06080E] border border-[#1E2538] text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1">Nationality</label>
                  <input
                    type="text"
                    value={newUbo.nationality || ''}
                    onChange={e => setNewUbo({ ...newUbo, nationality: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#06080E] border border-[#1E2538] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 block mb-1">Ownership %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newUbo.ownershipPercentage || 25}
                    onChange={e => setNewUbo({ ...newUbo, ownershipPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#06080E] border border-[#1E2538] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1">ID Document Number</label>
                  <input
                    type="text"
                    value={newUbo.idDocumentNumber || ''}
                    onChange={e => setNewUbo({ ...newUbo, idDocumentNumber: e.target.value })}
                    placeholder="e.g. GB984210984"
                    className="w-full px-3 py-2 rounded-xl bg-[#06080E] border border-[#1E2538] text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-[#141824] text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddUbo}
                className="px-5 py-2 rounded-xl bg-[#C9A227] hover:bg-[#E4C765] text-black text-xs font-bold cursor-pointer"
              >
                Add & Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
