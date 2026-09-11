/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Super Administrator Executive Console (/admin)
 * Dedicated to Super Administrators: RBAC Governance, System Parameters, Audit Ledger & Emergency Stop.
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Users,
  Sliders,
  AlertTriangle,
  Lock,
  Terminal,
  Activity,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Key,
  Database,
  Radio,
  RefreshCw,
  Server,
  Zap,
  Clock
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { auth, db } from '../../lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { BrandLogo } from '../common/BrandLogo';

export const AdminPortal: React.FC = () => {
  const {
    currentUser,
    currentRole,
    settings,
    plans,
    auditLogs,
    toggleGlobalEmergencyStop,
    addToast,
    setCurrentRoute
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'emergency' | 'audit' | 'settings' | 'plans' | 'infra'>('users');
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [searchUser, setSearchUser] = useState('');

  // Role Assignment Modal
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<UserProfile | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<UserRole>('customer');
  const [roleChangeReason, setRoleChangeReason] = useState('');
  const [isSubmittingRole, setIsSubmittingRole] = useState(false);

  // Emergency Stop Modal
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState('');
  const [isSubmittingEmergency, setIsSubmittingEmergency] = useState(false);

  // Fetch Users from Firestore
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      const list: UserProfile[] = [];
      snap.forEach(d => {
        list.push(d.data() as UserProfile);
      });
      setUsersList(list);
    } catch (err: any) {
      console.warn('Could not list users from Firestore:', err.message);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (currentRole === 'super_admin') {
      fetchUsers();
    }
  }, [currentRole]);

  // Execute Privileged Role Assignment via Server-Side Authority
  const handleAssignRole = async () => {
    if (!targetUser || !roleChangeReason.trim()) {
      addToast('Reason Required', 'You must supply a compliance justification for this privilege alteration.', 'warning');
      return;
    }

    setIsSubmittingRole(true);
    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';

      const response = await fetch('/api/v1/admin/assign-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          targetUid: targetUser.uid,
          newRole: selectedNewRole,
          reason: roleChangeReason.trim()
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Server rejected role assignment');
      }

      addToast('Role Updated', data.message || `Assigned ${selectedNewRole} to ${targetUser.email}`, 'success');
      setRoleModalOpen(false);
      setRoleChangeReason('');
      setTargetUser(null);
      await fetchUsers();
    } catch (err: any) {
      addToast('Privilege Escalation Failed', err.message, 'critical');
    } finally {
      setIsSubmittingRole(false);
    }
  };

  // Handle Emergency Stop Toggle
  const handleConfirmEmergencyStop = async () => {
    if (!emergencyReason.trim()) {
      addToast('Reason Required', 'A formal administrative explanation is required for emergency stop actions.', 'warning');
      return;
    }

    setIsSubmittingEmergency(true);
    try {
      const res = toggleGlobalEmergencyStop(!settings.globalEmergencyStop, emergencyReason.trim());
      if (res.success) {
        setEmergencyModalOpen(false);
        setEmergencyReason('');
      }
    } finally {
      setIsSubmittingEmergency(false);
    }
  };

  if (currentRole !== 'super_admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-600/50 flex items-center justify-center mx-auto text-rose-400">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-display">Super Administrator Required</h2>
        <p className="text-xs text-zinc-400">
          Your current role (<span className="text-[#E4C765] font-mono font-bold uppercase">{currentRole}</span>) lacks cryptographic authority to access the Master Governance Engine.
        </p>
      </div>
    );
  }

  const filteredUsers = usersList.filter(u => {
    return (
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      (u.fullName && u.fullName.toLowerCase().includes(searchUser.toLowerCase())) ||
      u.uid.toLowerCase().includes(searchUser.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2B354C] pb-6">
        <div className="flex items-start gap-4">
          <BrandLogo size="md" showText={false} asLink={false} className="mt-0.5" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-950/60 border border-rose-600/40 text-rose-300 font-mono text-[10px] tracking-wider uppercase">
                Root Authority
              </span>
              <span className="text-zinc-500 text-xs font-mono">• Super Administrator Session</span>
            </div>
            <h1 className="text-2xl font-bold text-white font-display">Executive Governance & Security Console</h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Cryptographic role assignments, global emergency kill-switch, system parameters, and immutable audit ledger.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setEmergencyModalOpen(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-colors cursor-pointer flex items-center gap-2 ${
              settings.globalEmergencyStop
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-rose-700 hover:bg-rose-600 text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            {settings.globalEmergencyStop ? 'Disengage Emergency Stop' : 'Engage Emergency Kill-Switch'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2B354C] gap-6 text-xs font-mono">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 font-bold cursor-pointer transition-colors ${
            activeTab === 'users' ? 'border-[#C9A227] text-[#E4C765]' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          User RBAC Administration
        </button>
        <button
          onClick={() => setActiveTab('emergency')}
          className={`pb-3 border-b-2 font-bold cursor-pointer transition-colors ${
            activeTab === 'emergency' ? 'border-[#C9A227] text-[#E4C765]' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Emergency Controls
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 border-b-2 font-bold cursor-pointer transition-colors ${
            activeTab === 'audit' ? 'border-[#C9A227] text-[#E4C765]' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Immutable Audit Ledger ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 border-b-2 font-bold cursor-pointer transition-colors ${
            activeTab === 'settings' ? 'border-[#C9A227] text-[#E4C765]' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          System Settings & Whitelists
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`pb-3 border-b-2 font-bold cursor-pointer transition-colors ${
            activeTab === 'plans' ? 'border-[#C9A227] text-[#E4C765]' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Licensing Packages
        </button>
        <button
          onClick={() => setActiveTab('infra')}
          className={`pb-3 border-b-2 font-bold cursor-pointer transition-colors ${
            activeTab === 'infra' ? 'border-[#C9A227] text-[#E4C765]' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Infrastructure Status
        </button>
      </div>

      {/* TAB 1: USER RBAC ADMINISTRATION */}
      {activeTab === 'users' && (
        <div className="bg-[#0D0F15] border border-[#2B354C] rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-white">Privileged Role Assignment & Directory</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Manage roles via server-side Admin SDK. Changes revoke refresh tokens and require re-authentication.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Filter users..."
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#141824] border border-[#2B354C] text-xs text-white placeholder:text-zinc-500 focus:outline-none"
              />
              <button
                onClick={fetchUsers}
                className="px-3 py-1.5 rounded-lg bg-[#1A1F2C] text-zinc-300 text-xs font-mono hover:text-white cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2B354C] text-zinc-400">
                  <th className="pb-3">User</th>
                  <th className="pb-3">UID</th>
                  <th className="pb-3">Verified Email</th>
                  <th className="pb-3">Role Authority</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B354C]/50 text-zinc-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500">
                      {isLoadingUsers ? 'Querying Firestore directory...' : 'No users match criteria.'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.uid} className="hover:bg-[#141824]">
                      <td className="py-3">
                        <div className="font-bold text-white">{user.fullName || 'User'}</div>
                        <div className="text-[11px] text-zinc-400">{user.email}</div>
                      </td>
                      <td className="py-3 text-[11px] text-zinc-500 font-mono truncate max-w-[120px]">
                        {user.uid}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          user.isEmailVerified
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {user.isEmailVerified ? 'VERIFIED' : 'PENDING'}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          user.role === 'super_admin'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : user.role === 'license_admin'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : user.role === 'finance_reviewer'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : user.role === 'support_agent'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            setTargetUser(user);
                            setSelectedNewRole(user.role);
                            setRoleModalOpen(true);
                          }}
                          className="px-3 py-1 rounded-lg bg-[#1A1F2C] hover:bg-[#252C3D] border border-[#2B354C] text-[11px] text-[#E4C765] font-bold cursor-pointer"
                        >
                          Modify Role
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Role Change Modal */}
          {roleModalOpen && targetUser && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-[#0D0F15] border border-[#2B354C] rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-rose-400">
                  <Shield className="w-5 h-5" />
                  <h3 className="text-base font-bold text-white">Privileged Role Assignment</h3>
                </div>

                <div className="bg-[#141824] p-3 rounded-xl border border-[#2B354C] text-xs font-mono space-y-1">
                  <div>Target User: <strong className="text-white">{targetUser.email}</strong></div>
                  <div>Current Role: <span className="text-[#E4C765] uppercase">{targetUser.role}</span></div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Target Role Authority:</label>
                  <select
                    value={selectedNewRole}
                    onChange={e => setSelectedNewRole(e.target.value as UserRole)}
                    className="w-full p-2.5 rounded-xl bg-[#141824] border border-[#2B354C] text-xs text-white focus:outline-none"
                  >
                    <option value="customer">customer (Standard Client)</option>
                    <option value="support_agent">support_agent (Support Desk Queue)</option>
                    <option value="finance_reviewer">finance_reviewer (Payments & Settlements)</option>
                    <option value="license_admin">license_admin (MT5 Bindings & Lifecycle)</option>
                    <option value="super_admin">super_admin (Master System Authority)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Compliance Justification (Audit Logged):</label>
                  <textarea
                    rows={3}
                    placeholder="Document administrative approval reason..."
                    value={roleChangeReason}
                    onChange={e => setRoleChangeReason(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#141824] border border-[#2B354C] text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    disabled={isSubmittingRole}
                    onClick={() => setRoleModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#1A1F2C] text-zinc-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmittingRole || !roleChangeReason.trim()}
                    onClick={handleAssignRole}
                    className="px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#E4C765] disabled:opacity-40 text-black text-xs font-bold"
                  >
                    {isSubmittingRole ? 'Setting Claims...' : 'Confirm Assignment'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EMERGENCY CONTROLS */}
      {activeTab === 'emergency' && (
        <div className="bg-[#0D0F15] border border-[#2B354C] rounded-2xl p-6 space-y-6">
          <div className="border-b border-[#2B354C] pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Global Algorithmic Kill-Switch
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Engaging this kill-switch forces the Cloud Run WebRequest API to instantly reject all MT5 OnInit() handshakes and runtime ticks across all accounts globally.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border ${
            settings.globalEmergencyStop
              ? 'bg-rose-950/40 border-rose-700/80 text-rose-200'
              : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold font-mono uppercase">
                  Current Status: {settings.globalEmergencyStop ? 'EMERGENCY HALT ACTIVE' : 'SYSTEM OPERATIONAL'}
                </div>
                <div className="text-xs mt-1 opacity-80">
                  {settings.globalEmergencyStop
                    ? `Kill-switch engaged: ${settings.globalStopReason || 'Administrative Precaution'}`
                    : 'All Expert Advisors are validating normally against live broker quotes.'}
                </div>
              </div>

              <button
                onClick={() => setEmergencyModalOpen(true)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer font-mono ${
                  settings.globalEmergencyStop
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {settings.globalEmergencyStop ? 'Disengage Halt' : 'Engage Emergency Halt'}
              </button>
            </div>
          </div>

          {/* Modal */}
          {emergencyModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-[#0D0F15] border border-[#2B354C] rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white">
                  {settings.globalEmergencyStop ? 'Disengage Emergency Stop' : 'Engage Global Emergency Stop'}
                </h3>
                <p className="text-xs text-zinc-400">
                  Enter formal reason for audit recording:
                </p>
                <textarea
                  rows={3}
                  placeholder="e.g., Extreme geopolitical gold volatility, API maintenance..."
                  value={emergencyReason}
                  onChange={e => setEmergencyReason(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#141824] border border-[#2B354C] text-xs text-white focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEmergencyModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#1A1F2C] text-zinc-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!emergencyReason.trim() || isSubmittingEmergency}
                    onClick={handleConfirmEmergencyStop}
                    className={`px-4 py-2 rounded-xl font-bold text-xs ${
                      settings.globalEmergencyStop
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    Confirm Action
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: IMMUTABLE AUDIT LEDGER */}
      {activeTab === 'audit' && (
        <div className="bg-[#0D0F15] border border-[#2B354C] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2B354C] pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Cryptographic Immutable Audit Ledger</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Append-only log of all security events, role escalations, payment decisions, and MT5 unbindings.
              </p>
            </div>
            <span className="text-xs font-mono text-[#E4C765]">Read-Only Super Administrator View</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2B354C] text-zinc-400">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Actor</th>
                  <th className="pb-3">Target Resource</th>
                  <th className="pb-3">Operational Details</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B354C]/50 text-zinc-300">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-500">
                      No audit events recorded in current ledger.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-[#141824]">
                      <td className="py-3 text-zinc-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="py-3 font-bold text-white">{log.action}</td>
                      <td className="py-3 text-zinc-400">{log.actorId}</td>
                      <td className="py-3 text-[#E4C765]">{log.target || log.resourceId}</td>
                      <td className="py-3 text-zinc-300 truncate max-w-[240px]">{log.details || log.reason}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          log.result === 'SUCCESS'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {log.result}
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

      {/* TAB 4: SYSTEM SETTINGS & WHITELISTS */}
      {activeTab === 'settings' && (
        <div className="bg-[#0D0F15] border border-[#2B354C] rounded-2xl p-6 space-y-6">
          <div className="border-b border-[#2B354C] pb-4">
            <h2 className="text-base font-bold text-white">Authoritative System Settings</h2>
            <p className="text-xs text-zinc-400 mt-1">Configured parameters for WebRequest ingress and USDT crypto settlements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#141824] border border-[#2B354C] space-y-1">
              <span className="text-zinc-400">WebRequest Endpoint URL:</span>
              <div className="text-white font-bold">{settings.webrequestUrl}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#141824] border border-[#2B354C] space-y-1">
              <span className="text-zinc-400">Official Domain:</span>
              <div className="text-white font-bold">{settings.officialDomain}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#141824] border border-[#2B354C] space-y-1">
              <span className="text-zinc-400">USDT TRC20 Deposit Target:</span>
              <div className="text-[#E4C765] font-bold break-all">{settings.usdtTrc20DepositAddress}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#141824] border border-[#2B354C] space-y-1">
              <span className="text-zinc-400">USDT ERC20 Deposit Target:</span>
              <div className="text-[#E4C765] font-bold break-all">{settings.usdtErc20DepositAddress}</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LICENSING PACKAGES */}
      {activeTab === 'plans' && (
        <div className="bg-[#0D0F15] border border-[#2B354C] rounded-2xl p-6 space-y-4">
          <div className="border-b border-[#2B354C] pb-4">
            <h2 className="text-base font-bold text-white">Configured Licensing Packages</h2>
            <p className="text-xs text-zinc-400 mt-1">Tiered pricing and operational parameters governed by OPHIREUM specification.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map(p => (
              <div key={p.id} className="p-4 rounded-xl bg-[#141824] border border-[#2B354C] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{p.name}</span>
                  <span className="text-[#E4C765] font-mono font-bold">${p.priceUSDT}</span>
                </div>
                <div className="text-xs font-mono text-zinc-400 space-y-1">
                  <div>Validity: {p.validityDays} Days</div>
                  <div>Risk Multiplier: {p.riskSettingPct}%</div>
                  <div>Max Lot: {p.lotSetting} lots</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: INFRASTRUCTURE STATUS */}
      {activeTab === 'infra' && (
        <div className="bg-[#0D0F15] border border-[#2B354C] rounded-2xl p-6 space-y-4">
          <div className="border-b border-[#2B354C] pb-4">
            <h2 className="text-base font-bold text-white">Operational Infrastructure & Health</h2>
            <p className="text-xs text-zinc-400 mt-1">Status of cloud components powering OPHIREUM production ingress.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#141824] border border-[#2B354C] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Cloud Run Ingress</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">ONLINE</span>
              </div>
              <p className="text-zinc-400">Port 3000 reverse proxy handling WebRequest and SPA traffic.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#141824] border border-[#2B354C] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Firebase Firestore</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">CONNECTED</span>
              </div>
              <p className="text-zinc-400">Rules deployed with RBAC custom claims validation.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#141824] border border-[#2B354C] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Firebase Auth</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">ENFORCED</span>
              </div>
              <p className="text-zinc-400">Authoritative email verification & custom claims enabled.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
