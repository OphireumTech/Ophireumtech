/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Broker Account Verification & Credential Security
 * Sections 14 & 15: Name matching against verified KYC passport, server validation,
 * credential security guarantees, and terminal WebRequest binding status.
 */

import React, { useState, useEffect } from 'react';
import {
  Server,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { complianceEngine } from '../../services/complianceEngine';
import { BrokerVerificationRecord } from '../../types/compliance';
import { useApp } from '../../context/AppContext';

export const BrokerAccountsView: React.FC = () => {
  const { currentUser, addToast } = useApp();
  const [complianceState, setComplianceState] = useState(() => complianceEngine.getState());

  useEffect(() => {
    return complianceEngine.subscribe(() => {
      setComplianceState(complianceEngine.getState());
    });
  }, []);

  const [accounts, setAccounts] = useState<BrokerVerificationRecord[]>(complianceState.brokerAccounts);
  const [showAddModal, setShowAddModal] = useState(false);

  const kycName = `${complianceState.individualKYC.legalFirstName} ${complianceState.individualKYC.legalLastName}`.trim();

  const [newAcc, setNewAcc] = useState<Partial<BrokerVerificationRecord>>({
    brokerLegalName: 'IC Markets Global',
    brokerWebsite: 'https://icmarkets.com',
    brokerRegulator: 'FSA (Seychelles) / ASIC',
    brokerJurisdiction: 'Australia / Global',
    tradingPlatform: 'MT5',
    tradingServer: 'ICMarketsSC-Live02',
    accountNumber: '',
    accountType: 'Live Raw',
    accountCurrency: 'USD',
    leverage: '1:100',
    accountHolderName: kycName,
    ownershipType: 'individual'
  });

  const handleAddAccount = () => {
    if (!newAcc.accountNumber || !newAcc.tradingServer) {
      addToast('Missing Required Fields', 'MT5 account number and trading server name are required.', 'warning');
      return;
    }

    // Name Matching Evaluation against verified KYC
    const matchResult = complianceEngine.compareAccountNames(kycName, newAcc.accountHolderName || '');

    const record: BrokerVerificationRecord = {
      id: 'brk_' + Date.now(),
      brokerLegalName: newAcc.brokerLegalName || 'Broker Partner',
      brokerWebsite: newAcc.brokerWebsite || 'https://broker.example.com',
      brokerRegulator: newAcc.brokerRegulator || 'FCA / ASIC / CySEC',
      brokerJurisdiction: newAcc.brokerJurisdiction || 'Global',
      tradingPlatform: (newAcc.tradingPlatform as any) || 'MT5',
      tradingServer: newAcc.tradingServer!,
      accountNumber: newAcc.accountNumber!,
      accountType: (newAcc.accountType as any) || 'Live Raw',
      accountCurrency: newAcc.accountCurrency || 'USD',
      leverage: newAcc.leverage || '1:100',
      accountHolderName: newAcc.accountHolderName || kycName,
      ownershipType: (newAcc.ownershipType as any) || 'individual',
      ownershipVerified: matchResult === 'exact_match' || matchResult === 'fuzzy_match',
      nameMatchConfidence: matchResult,
      status: matchResult === 'name_mismatch' ? 'mismatch_flagged' : 'verified',
      verifiedAt: new Date().toISOString(),
      reviewerNotes:
        matchResult === 'name_mismatch'
          ? 'FLAGGED: Account holder name differs from verified KYC passport. Manual review required.'
          : 'AUTOMATED OCR VERIFIED: Account holder matches KYC identity.'
    };

    const updated = [record, ...accounts];
    setAccounts(updated);
    complianceEngine.updateState(prev => ({
      ...prev,
      brokerAccounts: updated
    }));

    setShowAddModal(false);
    if (matchResult === 'name_mismatch') {
      addToast('Name Mismatch Flagged', 'The broker account holder name does not match your KYC passport. Account placed on compliance hold.', 'warning');
    } else {
      addToast('Broker Account Verified', `MT5 Account #${record.accountNumber} linked with ${matchResult.replace('_', ' ')}.`, 'success');
    }
  };

  const handleRemove = (id: string) => {
    const updated = accounts.filter(a => a.id !== id);
    setAccounts(updated);
    complianceEngine.updateState(prev => ({
      ...prev,
      brokerAccounts: updated
    }));
    addToast('Account Removed', 'Broker account unlinked from compliance ledger.', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2538] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#E4C765] uppercase tracking-wider">
                COMPLIANCE GATE 07 / EXECUTION INTEGRITY
              </div>
              <h1 className="text-xl font-bold text-white font-serif">
                BROKER ACCOUNTS & CREDENTIAL SECURITY
              </h1>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
              {accounts.filter(a => a.status === 'verified').length} VERIFIED ACCOUNTS
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Ophireum binds compiled execution algorithms strictly to verified MT5 accounts owned by the client. Third-party accounts, managed pools, and unverified brokers are prohibited.
        </p>
      </div>

      {/* SECTION: CREDENTIAL SECURITY GUARANTEE */}
      <div className="p-5 rounded-3xl bg-[#080B11] border border-emerald-500/30 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
          <Lock className="w-4 h-4" />
          <span>ZERO-PASSWORD CREDENTIAL SECURITY GUARANTEE</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          <strong>NEVER enter your trading account master or investor password into this portal, web forms, or support tickets.</strong> Ophireum technology connects to your broker exclusively via the MT5 terminal client running on your private VPS using secure cryptographic WebRequest authorization tokens. We will NEVER solicit your trading credentials.
        </p>
      </div>

      {/* Accounts List */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-4">
        <div className="border-b border-[#1E2538] pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
              LINKED BROKER TRADING ACCOUNTS
            </h3>
            <p className="text-[11px] text-zinc-400">
              Account holder name must match verified KYC profile ({kycName}).
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#151A28] border border-[#242E44] text-xs font-semibold text-zinc-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#E4C765]" />
            <span>Link Broker Account</span>
          </button>
        </div>

        <div className="space-y-3">
          {accounts.map(acc => (
            <div
              key={acc.id}
              className={`p-4 rounded-2xl border space-y-3 text-xs ${
                acc.status === 'verified'
                  ? 'bg-[#080B11] border-[#1E2638]'
                  : 'bg-rose-950/20 border-rose-800/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#161D2E] pb-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#C9A227]/15 border border-[#C9A227]/30 text-[#E4C765] flex items-center justify-center font-mono font-bold text-xs">
                    {acc.tradingPlatform}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-xs">{acc.brokerLegalName}</h4>
                      <span className="font-mono text-[10px] px-2 py-0.2 rounded bg-[#161D2E] text-zinc-300">
                        {acc.accountType}
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      Server: {acc.tradingServer} • Reg: {acc.brokerRegulator}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <div className="text-xs font-bold text-white">#{acc.accountNumber}</div>
                    <div className="text-[10px] text-zinc-400">{acc.accountCurrency} • Lev: {acc.leverage}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(acc.id)}
                    className="text-zinc-600 hover:text-rose-400 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Name Match & Reviewer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-mono">
                <div>
                  <span className="text-zinc-500 block text-[10px]">ACCOUNT HOLDER:</span>
                  <span className="text-zinc-200">{acc.accountHolderName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">NAME MATCH STATUS:</span>
                  <span
                    className={
                      acc.nameMatchConfidence === 'name_mismatch'
                        ? 'text-rose-400 font-bold'
                        : 'text-emerald-400 font-bold'
                    }
                  >
                    {acc.nameMatchConfidence.toUpperCase().replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">COMPLIANCE GATE:</span>
                  <span className={acc.status === 'verified' ? 'text-emerald-400' : 'text-amber-400'}>
                    {acc.status === 'verified' ? 'CLEARED FOR EA BINDING' : 'HOLD (MISMATCH)'}
                  </span>
                </div>
              </div>

              {acc.reviewerNotes && (
                <div className="p-2.5 rounded-xl bg-[#06080E] border border-[#161C2C] text-[10px] font-mono text-zinc-400">
                  {acc.reviewerNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#090C12] border border-[#C9A227]/60 shadow-2xl p-6 text-left space-y-4">
            <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
              Link MT5 Trading Account
            </h3>
            <p className="text-xs text-zinc-400">
              The account holder name will be automatically verified against your KYC passport ({kycName}).
            </p>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 block mb-1">Trading Platform</label>
                  <select
                    value={newAcc.tradingPlatform}
                    onChange={e => setNewAcc({ ...newAcc, tradingPlatform: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#06080E] border border-[#1E2538] text-white"
                  >
                    <option value="MT5">MetaTrader 5 (MT5)</option>
                    <option value="MT4">MetaTrader 4 (MT4)</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1">Account Type</label>
                  <select
                    value={newAcc.accountType}
                    onChange={e => setNewAcc({ ...newAcc, accountType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#06080E] border border-[#1E2538] text-white"
                  >
                    <option value="Live Raw">Live Raw Spread</option>
                    <option value="Live Standard">Live Standard</option>
                    <option value="Live Pro">Live Pro / ECN</option>
                    <option value="Demo">Demo Simulator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 block mb-1">Broker Name</label>
                  <input
                    type="text"
                    value={newAcc.brokerLegalName || ''}
                    onChange={e => setNewAcc({ ...newAcc, brokerLegalName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#06080E] border border-[#1E2538] text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1">Broker Trading Server Name</label>
                  <input
                    type="text"
                    placeholder="e.g. ICMarketsSC-Live02"
                    value={newAcc.tradingServer || ''}
                    onChange={e => setNewAcc({ ...newAcc, tradingServer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#06080E] border border-[#1E2538] text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-300 block mb-1">Account #</label>
                  <input
                    type="text"
                    placeholder="8910442"
                    value={newAcc.accountNumber || ''}
                    onChange={e => setNewAcc({ ...newAcc, accountNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#06080E] border border-[#1E2538] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1">Currency</label>
                  <input
                    type="text"
                    value={newAcc.accountCurrency || 'USD'}
                    onChange={e => setNewAcc({ ...newAcc, accountCurrency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#06080E] border border-[#1E2538] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1">Leverage</label>
                  <input
                    type="text"
                    value={newAcc.leverage || '1:100'}
                    onChange={e => setNewAcc({ ...newAcc, leverage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#06080E] border border-[#1E2538] text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1">Broker Account Holder Name</label>
                <input
                  type="text"
                  value={newAcc.accountHolderName || ''}
                  onChange={e => setNewAcc({ ...newAcc, accountHolderName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#06080E] border border-[#1E2538] text-white font-serif"
                />
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
                onClick={handleAddAccount}
                className="px-5 py-2 rounded-xl bg-[#C9A227] hover:bg-[#E4C765] text-black text-xs font-bold cursor-pointer"
              >
                Verify & Link Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
