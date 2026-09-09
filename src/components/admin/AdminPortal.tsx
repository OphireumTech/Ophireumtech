/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Administrative & Compliance Portal
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Key,
  CreditCard,
  LifeBuoy,
  Server,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Check,
  X,
  FileText,
  Sliders,
  Users,
  Activity,
  Zap,
  Lock,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { LicenseStatus, OrderStatus } from '../../types';

export const AdminPortal: React.FC = () => {
  const {
    currentUser,
    currentRole,
    licenses,
    orders,
    unbindingRequests,
    tickets,
    auditLogs,
    settings,
    plans,
    eaVersions,
    approveUnbindingRequest,
    rejectUnbindingRequest,
    confirmPaymentOrder,
    rejectPaymentOrder,
    updateLicenseStatus,
    toggleGlobalEmergencyStop,
    replyTicket,
    addToast,
    setCurrentRoute
  } = useApp();

  // Active admin module
  const [adminTab, setAdminTab] = useState<
    'overview' | 'licenses' | 'unbinding' | 'finance' | 'tickets' | 'builds' | 'emergency' | 'audit'
  >('overview');

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [licenseFilter, setLicenseFilter] = useState<string>('all');

  // Interactive ticket response
  const [replyText, setReplyText] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Rejection modal
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Permission checks
  const isSuperAdmin = currentRole === 'super_admin';
  const isLicenseAdmin = currentRole === 'license_admin' || isSuperAdmin;
  const isFinance = currentRole === 'finance_reviewer' || isSuperAdmin;
  const isSupport = currentRole === 'support_agent' || isSuperAdmin;

  // Filtered lists
  const filteredLicenses = licenses.filter(lic => {
    const matchesSearch = 
      lic.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lic.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lic.boundMt5Account && lic.boundMt5Account.includes(searchQuery));
    if (licenseFilter === 'all') return matchesSearch;
    return matchesSearch && lic.status === licenseFilter;
  });

  const pendingOrders = orders.filter(o => o.status === 'under_review' || o.status === 'pending');
  const pendingUnbinding = unbindingRequests.filter(u => u.status === 'pending');

  if (currentRole === 'customer' || currentRole === 'visitor') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-600/50 flex items-center justify-center mx-auto text-rose-400">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-display">Access Denied: Staff Authorization Required</h2>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          Your current account role (<span className="font-mono text-[#E4C765] font-bold uppercase">{currentRole}</span>) is not authorized to access the Administrative Governance Console. This security check is enforced server-side.
        </p>
        <button
          onClick={() => setCurrentRoute('dashboard')}
          className="px-6 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#E4C765] text-black font-bold text-xs cursor-pointer transition-colors inline-flex items-center gap-2"
        >
          Return to Customer Portal
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header with Security & Role Badge */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#1E2330]">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#E4C765]">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrative Governance Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
            Enterprise Operations Desk
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Active Operator: <span className="text-zinc-200">{currentUser.fullName}</span> • Authenticated Role:{' '}
            <span className="font-mono text-[#E4C765] font-bold uppercase">{currentRole}</span>
          </p>
        </div>

        {/* Global Emergency Status Banner */}
        <div className={`p-3 rounded-xl border flex items-center gap-3 ${
          settings.globalEmergencyStop
            ? 'bg-rose-950/60 border-rose-600 text-rose-200'
            : 'bg-[#111624] border-emerald-800/40 text-emerald-300'
        }`}>
          <div className="w-3 h-3 rounded-full bg-current animate-pulse" />
          <div className="text-xs">
            <span className="font-bold block">
              {settings.globalEmergencyStop ? 'EMERGENCY HALT ACTIVE' : 'SYSTEM OPERATING NORMALLY'}
            </span>
            <span className="text-[10px] opacity-80">
              {settings.globalEmergencyStop ? 'All WebRequest EA validations paused' : 'Real-time XAUUSD algorithmic execution permitted'}
            </span>
          </div>
          {isSuperAdmin && (
            <button
              onClick={toggleGlobalEmergencyStop}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                settings.globalEmergencyStop
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
            >
              {settings.globalEmergencyStop ? 'Deactivate Halt' : 'Trigger Halt'}
            </button>
          )}
        </div>
      </div>

      {/* Main Admin Tabbed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-1 bg-[#0D1017] border border-[#1E2330] rounded-2xl p-3 h-fit">
          {[
            { key: 'overview', label: 'Operations Dashboard', icon: Activity, allowed: true },
            { key: 'licenses', label: 'Licence Directory', icon: Key, allowed: isLicenseAdmin },
            { key: 'unbinding', label: `Unbinding Requests (${pendingUnbinding.length})`, icon: Terminal, allowed: isLicenseAdmin },
            { key: 'finance', label: `Billing & Proofs (${pendingOrders.length})`, icon: CreditCard, allowed: isFinance },
            { key: 'tickets', label: `Support Desk (${tickets.filter(t => t.status === 'open').length})`, icon: LifeBuoy, allowed: isSupport },
            { key: 'builds', label: 'EA Production Builds', icon: Download, allowed: isSuperAdmin },
            { key: 'emergency', label: 'Safety & System Controls', icon: Sliders, allowed: isSuperAdmin },
            { key: 'audit', label: 'Immutable Audit Trail', icon: FileText, allowed: isSuperAdmin }
          ].filter(tab => tab.allowed).map(tab => (
            <button
              key={tab.key}
              onClick={() => setAdminTab(tab.key as any)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-3 transition-colors cursor-pointer ${
                adminTab === tab.key
                  ? 'bg-[#C9A227]/15 text-[#E4C765] font-semibold border border-[#C9A227]/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Admin Panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB 1: OPERATIONS DASHBOARD OVERVIEW */}
          {adminTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-1">
                  <span className="text-zinc-500 text-xs font-medium">Total Licences</span>
                  <div className="text-2xl font-display font-bold text-white">{licenses.length}</div>
                  <span className="text-[11px] text-emerald-400">{licenses.filter(l => l.status === 'active').length} Active Live</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-1">
                  <span className="text-zinc-500 text-xs font-medium">Pending Review</span>
                  <div className="text-2xl font-display font-bold text-amber-400">{pendingOrders.length}</div>
                  <span className="text-[11px] text-zinc-400">Payment Confirmations</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-1">
                  <span className="text-zinc-500 text-xs font-medium">Unbinding Queue</span>
                  <div className="text-2xl font-display font-bold text-[#E4C765]">{pendingUnbinding.length}</div>
                  <span className="text-[11px] text-zinc-400">MT5 Migrations</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-1">
                  <span className="text-zinc-500 text-xs font-medium">Total Invoiced</span>
                  <div className="text-2xl font-display font-bold text-white">
                    {orders.filter(o => o.status === 'confirmed').reduce((sum, o) => sum + o.amountUSDT, 0).toLocaleString()}
                  </div>
                  <span className="text-[11px] text-[#C9A227]">USDT Volume</span>
                </div>
              </div>

              {/* Action Required Quick Callouts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#C9A227]" />
                      <span>Pending MT5 Unbinding Requests</span>
                    </h3>
                    <span className="text-xs text-amber-400 font-semibold">{pendingUnbinding.length} Pending</span>
                  </div>

                  {pendingUnbinding.length === 0 ? (
                    <p className="text-xs text-zinc-500">Queue is clean. No account transfers awaiting review.</p>
                  ) : (
                    <div className="space-y-3">
                      {pendingUnbinding.slice(0, 3).map(req => (
                        <div key={req.id} className="p-3 rounded-xl bg-[#111420] border border-zinc-800 text-xs space-y-2">
                          <div className="flex justify-between">
                            <span className="font-mono text-white font-bold">{req.licenseId}</span>
                            <span className="text-zinc-500">{new Date(req.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-zinc-400 text-[11px]">Reason: {req.reason}</p>
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              onClick={() => approveUnbindingRequest(req.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded text-[11px] cursor-pointer"
                            >
                              Approve Unbind
                            </button>
                            <button
                              onClick={() => rejectUnbindingRequest(req.id, 'Insufficient verification')}
                              className="px-2.5 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded text-[11px] cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#C9A227]" />
                      <span>Payment Proofs Under Review</span>
                    </h3>
                    <span className="text-xs text-amber-400 font-semibold">{pendingOrders.length} Pending</span>
                  </div>

                  {pendingOrders.length === 0 ? (
                    <p className="text-xs text-zinc-500">All payment orders have been processed.</p>
                  ) : (
                    <div className="space-y-3">
                      {pendingOrders.slice(0, 3).map(order => (
                        <div key={order.id} className="p-3 rounded-xl bg-[#111420] border border-zinc-800 text-xs space-y-2">
                          <div className="flex justify-between">
                            <span className="font-mono text-white font-bold">{order.id}</span>
                            <span className="font-bold text-[#E4C765]">{order.amountUSDT} USDT</span>
                          </div>
                          <div className="font-mono text-[10px] text-zinc-400 truncate">
                            Tx: {order.txHash || 'Awaiting submission'}
                          </div>
                          {order.status === 'under_review' && (
                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                onClick={() => confirmPaymentOrder(order.id)}
                                className="px-2.5 py-1 bg-[#C9A227] hover:bg-[#E4C765] text-black font-bold rounded text-[11px] cursor-pointer"
                              >
                                Confirm & Issue Licence
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LICENCE DIRECTORY */}
          {adminTab === 'licenses' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-white">Licence Directory & Controls</h2>
                    <p className="text-xs text-zinc-400">Manage account-bound keys, lot constraints, and status</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search ID, MT5 #, User..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-[#111420] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none"
                    />
                    <select
                      value={licenseFilter}
                      onChange={(e) => setLicenseFilter(e.target.value)}
                      className="bg-[#111420] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="ready_for_binding">Ready For Binding</option>
                      <option value="unbinding_requested">Unbinding Requested</option>
                      <option value="suspended">Suspended</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>

                {/* Licenses Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-[#111420] text-zinc-500 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Licence ID</th>
                        <th className="p-3">Plan</th>
                        <th className="p-3">Bound MT5 #</th>
                        <th className="p-3">Broker / Server</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {filteredLicenses.map(lic => (
                        <tr key={lic.id} className="hover:bg-zinc-900/40">
                          <td className="p-3 font-mono font-bold text-white">{lic.id}</td>
                          <td className="p-3">{lic.planName}</td>
                          <td className="p-3 font-mono">{lic.boundMt5Account ? `#${lic.boundMt5Account}` : 'Unbound'}</td>
                          <td className="p-3 text-zinc-400">{lic.brokerName || '—'}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              lic.status === 'active' ? 'bg-emerald-950 text-emerald-300' :
                              lic.status === 'suspended' ? 'bg-rose-950 text-rose-300' : 'bg-zinc-800 text-zinc-300'
                            }`}>
                              {lic.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            {lic.status === 'active' ? (
                              <button
                                onClick={() => updateLicenseStatus(lic.id, 'suspended', 'Administrative audit suspension')}
                                className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => updateLicenseStatus(lic.id, 'active', 'Administrative activation')}
                                className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                              >
                                Activate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MT5 UNBINDING QUEUE */}
          {adminTab === 'unbinding' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-4">
                <h2 className="text-lg font-bold text-white">MT5 Account Unbinding Queue</h2>
                <p className="text-xs text-zinc-400">
                  Review migration requests submitted by operators transferring licences between broker environments.
                </p>

                <div className="space-y-4">
                  {unbindingRequests.map(req => (
                    <div key={req.id} className="p-5 rounded-xl bg-[#111420] border border-zinc-800 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-sm font-bold text-white">Request #{req.id}</span>
                          <span className="text-zinc-400 ml-3">Target Licence: {req.licenseId}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          req.status === 'approved' ? 'bg-emerald-950 text-emerald-300' :
                          req.status === 'rejected' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                        }`}>
                          {req.status}
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-[#090B10] border border-zinc-800 text-zinc-300 space-y-1">
                        <div><strong>Reason Provided:</strong> {req.reason}</div>
                        {req.newMt5Account && <div><strong>New Requested Account:</strong> #{req.newMt5Account} ({req.newBroker})</div>}
                      </div>

                      {req.status === 'pending' && (
                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => approveUnbindingRequest(req.id)}
                            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-xs cursor-pointer"
                          >
                            Authorize Account Transfer
                          </button>
                          <button
                            onClick={() => rejectUnbindingRequest(req.id, 'Account verification mismatch')}
                            className="px-4 py-1.5 bg-rose-900 hover:bg-rose-800 text-white font-medium rounded-lg text-xs cursor-pointer"
                          >
                            Reject Request
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FINANCE & PAYMENTS */}
          {adminTab === 'finance' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-4">
                <h2 className="text-lg font-bold text-white">Financial Desk & Proof Review</h2>
                <p className="text-xs text-zinc-400">
                  Verify blockchain transactions (TRC20 / ERC20), confirm orders, and trigger atomic licence issuance.
                </p>

                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="p-5 rounded-xl bg-[#111420] border border-zinc-800 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-sm font-bold text-white">{order.id}</span>
                          <span className="text-zinc-400 ml-3">{order.planName} • {order.amountUSDT} USDT</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold ${
                          order.status === 'confirmed' ? 'bg-emerald-950 text-emerald-300' :
                          order.status === 'under_review' ? 'bg-amber-950 text-amber-300' : 'bg-zinc-800 text-zinc-300'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="p-3 bg-[#090B10] rounded-lg border border-zinc-800 space-y-1 font-mono text-[11px]">
                        <div>Deposit Target: {order.depositAddress}</div>
                        <div className="text-[#E4C765] break-all">Tx Hash: {order.txHash || 'Awaiting proof submission'}</div>
                      </div>

                      {order.status === 'under_review' && (
                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => confirmPaymentOrder(order.id)}
                            className="px-4 py-1.5 bg-[#C9A227] hover:bg-[#E4C765] text-black font-bold rounded-lg text-xs cursor-pointer"
                          >
                            Verify Tx & Issue Licence
                          </button>
                          <button
                            onClick={() => rejectPaymentOrder(order.id, 'Transaction not found on chain explorer')}
                            className="px-4 py-1.5 bg-rose-900 hover:bg-rose-800 text-white font-medium rounded-lg text-xs cursor-pointer"
                          >
                            Reject Proof
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SUPPORT TICKETS */}
          {adminTab === 'tickets' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-4">
                <h2 className="text-lg font-bold text-white">Support Desk Queue</h2>
                <p className="text-xs text-zinc-400">Technical assistance and customer ticket resolutions</p>

                <div className="space-y-4">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="p-5 rounded-xl bg-[#111420] border border-zinc-800 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-white">{ticket.id}</span>
                          <span className="text-zinc-300 font-semibold ml-3">{ticket.subject}</span>
                          <span className="text-zinc-500 ml-2">({ticket.category})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          ticket.status === 'resolved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>

                      <div className="space-y-2 pl-2">
                        {ticket.messages.map(m => (
                          <div key={m.id} className="p-2.5 rounded bg-[#090B10] border border-zinc-800 space-y-1">
                            <span className="font-semibold text-[#E4C765] text-[11px]">{m.senderName} ({m.senderRole})</span>
                            <p className="text-zinc-300">{m.message}</p>
                          </div>
                        ))}
                      </div>

                      {/* Staff reply */}
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Respond as Support / Operations Staff..."
                          value={selectedTicketId === ticket.id ? replyText : ''}
                          onChange={(e) => {
                            setSelectedTicketId(ticket.id);
                            setReplyText(e.target.value);
                          }}
                          className="flex-1 bg-[#090B10] border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-xs outline-none"
                        />
                        <button
                          onClick={() => {
                            if (replyText) {
                              replyTicket(ticket.id, replyText);
                              setReplyText('');
                              setSelectedTicketId(null);
                            }
                          }}
                          className="px-4 py-2 bg-[#C9A227] hover:bg-[#E4C765] text-black font-bold rounded-lg text-xs cursor-pointer"
                        >
                          Dispatch Response
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PRODUCTION BUILDS */}
          {adminTab === 'builds' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-4">
                <h2 className="text-lg font-bold text-white">EA Production Builds & Releases</h2>
                <p className="text-xs text-zinc-400">Manage compiled .ex5 versions and cryptographic integrity hashes</p>

                <div className="space-y-4">
                  {eaVersions.map(build => (
                    <div key={build.id} className="p-5 rounded-xl bg-[#111420] border border-zinc-800 space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-white text-sm">{build.fileName}</span>
                          <span className="text-zinc-400 ml-2">Version {build.version}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold uppercase text-[10px]">
                          {build.status}
                        </span>
                      </div>

                      <div className="p-2.5 bg-[#090B10] rounded border border-zinc-800 font-mono text-[11px] text-[#E4C765] break-all">
                        SHA-256: {build.checksumSHA256}
                      </div>

                      <div className="space-y-1 text-zinc-400">
                        {build.releaseNotes.map((r, i) => (
                          <div key={i}>• {r}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SAFETY & SYSTEM CONTROLS */}
          {adminTab === 'emergency' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-6 text-xs">
                <div>
                  <h2 className="text-lg font-bold text-white">System Controls & Emergency Kill-Switch</h2>
                  <p className="text-zinc-400">Platform-wide execution governance and API endpoints</p>
                </div>

                <div className="p-6 rounded-xl bg-rose-950/30 border border-rose-800/60 space-y-4">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Global Emergency Stop</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Triggering the Emergency Stop immediately instructs the Cloud Run WebRequest authorization API to return EMERGENCY_STOP to all EA heartbeat requests. Terminals will cease initiating new gold positions.
                  </p>
                  <button
                    onClick={toggleGlobalEmergencyStop}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-lg transition-all ${
                      settings.globalEmergencyStop
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                  >
                    {settings.globalEmergencyStop ? 'Resume Algorithmic Operations' : 'ENGAGE IMMEDIATE GLOBAL STOP'}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#111420] border border-zinc-800 space-y-2">
                  <span className="font-semibold text-white">Target WebRequest Whitelist URL:</span>
                  <div className="font-mono text-[#E4C765]">{settings.webrequestUrl}</div>
                  <span className="text-zinc-500">Contact Support Email: {settings.contactEmail}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: IMMUTABLE AUDIT TRAIL */}
          {adminTab === 'audit' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">Immutable Operational Audit Trail</h2>
                    <p className="text-xs text-zinc-400">Cryptographically recorded administrative and security events</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {auditLogs.map(log => (
                    <div key={log.id} className="p-3 rounded-lg bg-[#111420] border border-zinc-800 text-xs space-y-1 font-mono">
                      <div className="flex justify-between text-zinc-400 text-[11px]">
                        <span className="text-[#E4C765] font-bold">{log.action}</span>
                        <span>{new Date(log.timestamp).toISOString()}</span>
                      </div>
                      <div className="text-zinc-200">Actor: {log.actorRole} ({log.actorId}) • Target: {log.target}</div>
                      <div className="text-zinc-500 text-[10px]">
                        Details: {JSON.stringify(log.details)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
