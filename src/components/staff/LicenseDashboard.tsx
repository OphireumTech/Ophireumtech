/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Licence Administrator Operations Console (/license-dashboard)
 * Strictly authorized for licence lifecycles, MT5 binding transfers, and telemetry monitoring.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Key,
  Terminal,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Shield,
  Layers,
  Pause,
  Play,
  Clock,
  Radio
} from 'lucide-react';
import { License, LicenseStatus, UnbindingRequest } from '../../types';

export const LicenseDashboard: React.FC = () => {
  const {
    currentUser,
    licenses,
    unbindingRequests,
    heartbeats,
    eaVersions,
    settings,
    approveUnbindingRequest,
    rejectUnbindingRequest,
    updateLicenseStatus,
    toggleAutomationPause,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'licenses' | 'unbinding' | 'telemetry' | 'symbols'>('licenses');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLicenseId, setSelectedLicenseId] = useState<string | null>(null);

  // Status modification modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<LicenseStatus>('suspended');
  const [statusReason, setStatusReason] = useState('');

  // Filtered licences
  const filteredLicenses = licenses.filter(lic => {
    const matchesSearch =
      lic.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lic.userEmail && lic.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lic.boundMt5Account && lic.boundMt5Account.includes(searchQuery));
    const matchesStatus = statusFilter === 'all' || lic.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeLicense = licenses.find(l => l.id === selectedLicenseId) || filteredLicenses[0];
  const pendingUnbinding = unbindingRequests.filter(u => u.status === 'pending');

  const handleUpdateStatus = () => {
    if (!activeLicense || !statusReason.trim()) {
      addToast('Reason Required', 'Please enter an administrative reason for this status change.', 'warning');
      return;
    }

    updateLicenseStatus(activeLicense.id, targetStatus, statusReason.trim());
    setStatusModalOpen(false);
    setStatusReason('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2B354C] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-600/40 text-amber-300 font-mono text-[10px] tracking-wider uppercase">
              Licence Administrator Authority
            </span>
            <span className="text-zinc-500 text-xs font-mono">• Terminal Lifecycle Desk</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">Licence & MT5 Binding Governance Desk</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Audit cryptographic MT5 bindings, review account unbinding requests, and manage Expert Advisor telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-[#141824] border border-[#2B354C] text-xs font-mono">
            <span className="text-zinc-400">Administrator: </span>
            <span className="text-[#E4C765] font-bold">{currentUser.fullName || currentUser.email}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#2B354C] gap-6 text-xs font-mono">
        <button
          onClick={() => setActiveTab('licenses')}
          className={`pb-3 border-b-2 font-bold cursor-pointer transition-colors ${
            activeTab === 'licenses'
              ? 'border-[#C9A227] text-[#E4C765]'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Licence Inventory ({licenses.length})
        </button>
        <button
          onClick={() => setActiveTab('unbinding')}
          className={`pb-3 border-b-2 font-bold cursor-pointer transition-colors relative ${
            activeTab === 'unbinding'
              ? 'border-[#C9A227] text-[#E4C765]'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Unbinding Queue
          {pendingUnbinding.length > 0 && (
            <span className="ml-2 px-1.5 py-0.2 rounded-full bg-rose-500 text-black text-[10px] font-bold">
              {pendingUnbinding.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`pb-3 border-b-2 font-bold cursor-pointer transition-colors ${
            activeTab === 'telemetry'
              ? 'border-[#C9A227] text-[#E4C765]'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Live Telemetry & Heartbeats
        </button>
        <button
          onClick={() => setActiveTab('symbols')}
          className={`pb-3 border-b-2 font-bold cursor-pointer transition-colors ${
            activeTab === 'symbols'
              ? 'border-[#C9A227] text-[#E4C765]'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Approved Gold Symbols
        </button>
      </div>

      {/* TAB 1: LICENCES INVENTORY */}
      {activeTab === 'licenses' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 bg-[#0D0F15] p-3 rounded-xl border border-[#2B354C]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search licences by ID, account number, or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#141824] border border-[#2B354C] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C9A227]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#141824] border border-[#2B354C] text-xs text-zinc-300 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="ready_for_binding">Ready for Binding</option>
              <option value="suspended">Suspended</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* List */}
            <div className="lg:col-span-6 bg-[#0D0F15] border border-[#2B354C] rounded-2xl overflow-hidden divide-y divide-[#2B354C]">
              <div className="p-3 bg-[#111420] text-xs font-bold text-zinc-300 flex items-between justify-between">
                <span>Licence Ledger ({filteredLicenses.length})</span>
                <span className="text-[10px] text-zinc-500 font-mono">Real-Time</span>
              </div>
              <div className="max-h-[600px] overflow-y-auto divide-y divide-[#2B354C]/50">
                {filteredLicenses.map(lic => {
                  const isSelected = activeLicense?.id === lic.id;
                  return (
                    <button
                      key={lic.id}
                      onClick={() => setSelectedLicenseId(lic.id)}
                      className={`w-full text-left p-4 transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#181C28] border-l-2 border-[#C9A227]' : 'hover:bg-[#121520]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#E4C765]">{lic.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          lic.status === 'active'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : lic.status === 'ready_for_binding'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : lic.status === 'suspended'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {lic.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-white font-medium">{lic.planName}</span>
                        <span className="font-mono text-zinc-300">MT5: {lic.boundMt5Account || 'UNBOUND'}</span>
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono truncate">
                        {lic.userEmail || lic.userId}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detail */}
            <div className="lg:col-span-6 bg-[#0D0F15] border border-[#2B354C] rounded-2xl p-6 space-y-6">
              {activeLicense ? (
                <>
                  <div className="border-b border-[#2B354C] pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-[#E4C765] font-bold">{activeLicense.id}</span>
                      <span className="text-xs text-zinc-400 font-mono">Plan: {activeLicense.planName}</span>
                    </div>
                    <h2 className="text-lg font-bold text-white mb-1">
                      MT5 Account: {activeLicense.boundMt5Account || 'Awaiting Customer Binding'}
                    </h2>
                    <div className="text-xs text-zinc-400">
                      Licensee: <strong className="text-zinc-200">{activeLicense.userEmail || activeLicense.userId}</strong>
                    </div>
                  </div>

                  {/* Binding Specification */}
                  <div className="bg-[#141824] p-4 rounded-xl border border-[#2B354C] space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Broker Entity:</span>
                      <span className="text-white">{activeLicense.brokerName || 'Not Set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Trading Server:</span>
                      <span className="text-white">{activeLicense.brokerServer || 'Not Set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Trading Symbol:</span>
                      <span className="text-[#E4C765]">XAUUSD (Gold Strict)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Risk Allocation:</span>
                      <span className="text-white">{activeLicense.riskSettingPct}% per trade</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Max Lot Multiplier:</span>
                      <span className="text-white">{activeLicense.lotSetting} lots</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Term Expiration:</span>
                      <span className="text-white">
                        {activeLicense.expiresAt ? new Date(activeLicense.expiresAt).toLocaleDateString() : 'Active'}
                      </span>
                    </div>
                  </div>

                  {/* Operational Controls */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-bold text-zinc-200">Administrative Governance</div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setTargetStatus(activeLicense.status === 'suspended' ? 'active' : 'suspended');
                          setStatusModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#1A1F2C] hover:bg-[#252C3D] border border-[#2B354C] text-xs font-bold text-amber-300 cursor-pointer"
                      >
                        {activeLicense.status === 'suspended' ? 'Lift Suspension' : 'Suspend Licence'}
                      </button>

                      <button
                        onClick={() => {
                          setTargetStatus('revoked');
                          setStatusModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-xs font-bold text-rose-200 cursor-pointer"
                      >
                        Revoke Licence
                      </button>

                      <button
                        onClick={() => {
                          toggleAutomationPause(
                            'single_license',
                            activeLicense.id,
                            !activeLicense.isAutomationPaused,
                            'Admin toggled pause'
                          );
                        }}
                        className="px-4 py-2 rounded-xl bg-[#1A1F2C] hover:bg-[#252C3D] border border-[#2B354C] text-xs font-bold text-zinc-200 cursor-pointer"
                      >
                        {activeLicense.isAutomationPaused ? 'Resume Execution' : 'Pause Execution'}
                      </button>
                    </div>
                  </div>

                  {/* Status Reason Modal */}
                  {statusModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                      <div className="max-w-md w-full bg-[#0D0F15] border border-[#2B354C] rounded-2xl p-6 space-y-4">
                        <h3 className="text-base font-bold text-white">
                          Change Status to: <span className="uppercase text-[#E4C765]">{targetStatus}</span>
                        </h3>
                        <p className="text-xs text-zinc-400">
                          Provide mandatory compliance justification for this lifecycle modification.
                        </p>
                        <textarea
                          rows={3}
                          placeholder="Reason for suspension or revocation..."
                          value={statusReason}
                          onChange={e => setStatusReason(e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#141824] border border-[#2B354C] text-xs text-white focus:outline-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setStatusModalOpen(false)}
                            className="px-4 py-2 rounded-xl bg-[#1A1F2C] text-zinc-300 text-xs font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleUpdateStatus}
                            className="px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#E4C765] text-black text-xs font-bold"
                          >
                            Confirm Transition
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-12 text-center text-zinc-500 text-xs">
                  Select a licence from the ledger to view details.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UNBINDING QUEUE */}
      {activeTab === 'unbinding' && (
        <div className="bg-[#0D0F15] border border-[#2B354C] rounded-2xl overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">MT5 Account Unbinding Requests</h2>
            <span className="text-xs font-mono text-zinc-400">Requires Administrator Sign-Off</span>
          </div>

          {unbindingRequests.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-500">
              No unbinding or migration requests registered.
            </div>
          ) : (
            <div className="divide-y divide-[#2B354C]">
              {unbindingRequests.map(req => (
                <div key={req.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#E4C765]">{req.id}</span>
                      <span className="text-xs font-mono text-zinc-300">Licence: {req.licenseId}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        req.status === 'approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : req.status === 'rejected'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400">
                      Current Account: <strong className="text-white font-mono">{req.currentLogin}</strong>
                      {req.newLogin && (
                        <span> → Target Account: <strong className="text-[#E4C765] font-mono">{req.newLogin}</strong> ({req.newBroker})</span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-500 italic">
                      Reason: "{req.reason}"
                    </div>
                  </div>

                  {req.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveUnbindingRequest(req.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve Transfer
                      </button>
                      <button
                        onClick={() => rejectUnbindingRequest(req.id, 'Compliance rejection')}
                        className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-200 font-bold text-xs cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TELEMETRY & HEARTBEATS */}
      {activeTab === 'telemetry' && (
        <div className="bg-[#0D0F15] border border-[#2B354C] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              Live Terminal Telemetry & Heartbeats
            </h2>
            <span className="text-xs font-mono text-zinc-400">60-Second Ingestion Cycle</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2B354C] text-zinc-400">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Licence Ref</th>
                  <th className="pb-3">MT5 Login</th>
                  <th className="pb-3">Broker Server</th>
                  <th className="pb-3">Symbol</th>
                  <th className="pb-3">Spread (Pips)</th>
                  <th className="pb-3">EA Version</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B354C]/50 text-zinc-200">
                {heartbeats.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-zinc-500">
                      No terminal telemetry registered yet.
                    </td>
                  </tr>
                ) : (
                  heartbeats.map(hb => (
                    <tr key={hb.id} className="hover:bg-[#141824]">
                      <td className="py-3 text-zinc-500">{new Date(hb.receivedAt).toLocaleTimeString()}</td>
                      <td className="py-3 text-[#E4C765]">{hb.licenseId}</td>
                      <td className="py-3">{hb.mt5Login}</td>
                      <td className="py-3 text-zinc-400">{hb.brokerServer}</td>
                      <td className="py-3 text-emerald-400">{hb.tradingSymbol}</td>
                      <td className="py-3">{hb.spreadPips}</td>
                      <td className="py-3">{hb.eaVersion}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {hb.derivedStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: APPROVED GOLD SYMBOLS */}
      {activeTab === 'symbols' && (
        <div className="bg-[#0D0F15] border border-[#2B354C] rounded-2xl p-6 space-y-4">
          <div className="border-b border-[#2B354C] pb-4">
            <h2 className="text-base font-bold text-white">Approved XAUUSD Symbol Variations</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Any WebRequest validation targeting a broker symbol outside this strict whitelist is rejected automatically.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {settings.approvedSymbols.map(sym => (
              <div key={sym} className="p-3 rounded-xl bg-[#141824] border border-[#2B354C] flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-[#E4C765]">{sym}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  APPROVED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
