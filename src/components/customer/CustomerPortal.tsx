/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Secure Customer Portal
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Key,
  CreditCard,
  Terminal,
  Server,
  Download,
  LifeBuoy,
  FileText,
  User,
  Shield,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Copy,
  Check,
  Send,
  Printer,
  X,
  ExternalLink,
  Plus
} from 'lucide-react';
import { PaymentMethod, TicketCategory, TicketPriority } from '../../types';

export const CustomerPortal: React.FC = () => {
  const {
    currentUser,
    currentRoute,
    setCurrentRoute,
    licenses,
    orders,
    invoices,
    eaVersions,
    unbindingRequests,
    vpsInstances,
    tickets,
    createOrder,
    submitPaymentProof,
    bindMt5Account,
    submitUnbindingRequest,
    renewLicense,
    upgradeLicense,
    createTicket,
    replyTicket,
    plans,
    settings,
    addToast,
    acceptAgreements,
    acceptEmailVerified,
    sendVerificationEmail,
    sendPasswordReset,
    updateProfileInfo
  } = useApp();

  // Active portal tab
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'my-license'
    | 'purchase'
    | 'binding'
    | 'vps'
    | 'downloads'
    | 'payments'
    | 'tickets'
    | 'agreements'
    | 'profile'
  >('overview');

  // Interactive local states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Binding Form
  const [bindLogin, setBindLogin] = useState('');
  const [bindBroker, setBindBroker] = useState('IC Markets (SC)');
  const [bindServer, setBindServer] = useState('ICMarketsSC-Live04');
  const [bindAccountType, setBindAccountType] = useState('Raw');

  // Unbinding Request Form
  const [unbindingReason, setUnbindingReason] = useState('');
  const [unbindingNewLogin, setUnbindingNewLogin] = useState('');
  const [unbindingNewBroker, setUnbindingNewBroker] = useState('');

  // Payment Proof Form
  const [txHashInput, setTxHashInput] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  // New Support Ticket
  const [newTicketModal, setNewTicketModal] = useState(false);
  const [ticketCategory, setTicketCategory] = useState<TicketCategory>('General Inquiry');
  const [ticketPriority, setTicketPriority] = useState<TicketPriority>('medium');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Profile Form States
  const [profileName, setProfileName] = useState(currentUser.fullName || '');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileCountry, setProfileCountry] = useState('United Arab Emirates');
  const [profileTimezone, setProfileTimezone] = useState('UTC+4 (Dubai)');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  // Find user's primary licence
  const userLicense = licenses.find(l => l.userId === currentUser.uid) || licenses[0];
  const userOrders = orders.filter(o => o.userId === currentUser.uid);
  const userInvoices = invoices.filter(i => i.userId === currentUser.uid);
  const userTickets = tickets.filter(t => t.userId === currentUser.uid);
  const userVps = vpsInstances.find(v => v.userId === currentUser.uid);
  const userUnbinding = unbindingRequests.filter(u => u.userId === currentUser.uid);

  const currentEa = eaVersions.find(v => v.status === 'production') || eaVersions[0];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleBindAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLicense) {
      addToast('No Licence', 'You must acquire a licence before binding an MT5 account.', 'warning');
      return;
    }
    const res = bindMt5Account(userLicense.id, bindLogin, bindBroker, bindServer, bindAccountType);
    if (res.success) {
      setBindLogin('');
    }
  };

  const handleUnbindSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLicense) return;
    const res = submitUnbindingRequest(userLicense.id, unbindingReason, unbindingNewLogin, unbindingNewBroker);
    if (res.success) {
      setUnbindingReason('');
      setUnbindingNewLogin('');
      setUnbindingNewBroker('');
    }
  };

  const handleTxSubmit = (orderId: string) => {
    if (!txHashInput) {
      addToast('Input Required', 'Please enter your transaction hash.', 'warning');
      return;
    }
    const res = submitPaymentProof(orderId, txHashInput);
    if (res.success) {
      setTxHashInput('');
      setActiveOrderId(null);
    }
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    createTicket(ticketCategory, ticketPriority, ticketSubject, ticketMessage);
    setNewTicketModal(false);
    setTicketSubject('');
    setTicketMessage('');
  };

  // Status pill helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-600/60 text-emerald-300 text-xs font-semibold">Active</span>;
      case 'ready_for_binding':
        return <span className="px-2.5 py-1 rounded-full bg-blue-950/60 border border-blue-600/60 text-blue-300 text-xs font-semibold">Ready for MT5 Binding</span>;
      case 'unbinding_requested':
        return <span className="px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-600/60 text-amber-300 text-xs font-semibold">Unbinding Requested</span>;
      case 'expired':
        return <span className="px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-semibold">Expired</span>;
      case 'suspended':
      case 'revoked':
        return <span className="px-2.5 py-1 rounded-full bg-rose-950/60 border border-rose-600/60 text-rose-300 text-xs font-semibold">Suspended</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#1E2330]">
        <div>
          <div className="text-xs uppercase font-bold tracking-widest text-[#C9A227]">
            Customer Management Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
            Welcome, {currentUser.fullName}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Account UID: <span className="font-mono text-zinc-300">{currentUser.uid}</span> • Email: <span className="text-zinc-300">{currentUser.email}</span>
          </p>
        </div>

        {/* Quick Nav Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('purchase')}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-xs flex items-center gap-1 shadow-md hover:brightness-110 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Acquire Licence</span>
          </button>
          <button
            onClick={() => setActiveTab('downloads')}
            className="px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1C2234] border border-[#2B344A] text-zinc-200 text-xs flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#E4C765]" />
            <span>Download EA</span>
          </button>
        </div>
      </div>

      {/* Main Layout Grid with Sidebar Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-1 bg-[#0D1017] border border-[#1E2330] rounded-2xl p-3 h-fit">
          {[
            { key: 'overview', label: 'Dashboard Overview', icon: Layers },
            { key: 'my-license', label: 'My Licence & Policy', icon: Key },
            { key: 'purchase', label: 'Licence Packages', icon: CreditCard },
            { key: 'binding', label: 'MT5 Binding & Unbinding', icon: Terminal },
            { key: 'vps', label: 'VPS Infrastructure', icon: Server },
            { key: 'downloads', label: 'EA Download Center', icon: Download },
            { key: 'payments', label: 'Billing & Invoices', icon: FileText },
            { key: 'tickets', label: 'Support Tickets', icon: LifeBuoy },
            { key: 'agreements', label: 'Risk & Legal Acceptance', icon: Shield },
            { key: 'profile', label: 'Security & Profile', icon: User }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-[#C9A227]/15 text-[#E4C765] font-semibold border border-[#C9A227]/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Content Panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Primary Active Licence Card */}
              {userLicense ? (
                <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#101420] via-[#0E1118] to-[#0A0D14] border border-[#232A3E] space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#C9A227]">
                        Active Software Licence
                      </div>
                      <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-0.5">
                        {userLicense.planName}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-xs text-zinc-300 font-semibold">{userLicense.id}</span>
                        <button
                          onClick={() => copyToClipboard(userLicense.id, 'lic-id')}
                          className="text-zinc-500 hover:text-[#E4C765] text-xs"
                          title="Copy Licence ID"
                        >
                          {copiedId === 'lic-id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(userLicense.status)}
                    </div>
                  </div>

                  {/* Key Operational Status Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#090B10] border border-[#1A1E2B] text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[11px]">Bound MT5 Account</span>
                      <span className="font-mono font-bold text-zinc-100 text-sm">
                        {userLicense.boundMt5Account ? `#${userLicense.boundMt5Account}` : 'Unbound'}
                      </span>
                    </div>

                    <div>
                      <span className="text-zinc-500 block text-[11px]">Broker & Server</span>
                      <span className="text-zinc-200 font-medium truncate block">
                        {userLicense.brokerName ? `${userLicense.brokerName}` : 'Not Specified'}
                      </span>
                    </div>

                    <div>
                      <span className="text-zinc-500 block text-[11px]">EA Heartbeat</span>
                      <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {userLicense.heartbeatStatus?.toUpperCase() || 'ONLINE'}
                      </span>
                    </div>

                    <div>
                      <span className="text-zinc-500 block text-[11px]">Days Remaining</span>
                      <span className="font-mono font-bold text-[#E4C765] text-sm">
                        {userLicense.expiresAt 
                          ? Math.max(0, Math.ceil((new Date(userLicense.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                          : userLicense.validityDays} Days
                      </span>
                    </div>
                  </div>

                  {/* Operational Controls & Policy parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 bg-[#131622] rounded-lg border border-zinc-800 space-y-1">
                      <span className="text-zinc-500">Risk Model Constraint:</span>
                      <div className="text-white font-semibold">{userLicense.riskSettingPct}% Max Exposure</div>
                    </div>
                    <div className="p-3 bg-[#131622] rounded-lg border border-zinc-800 space-y-1">
                      <span className="text-zinc-500">Baseline Lot Constraint:</span>
                      <div className="font-mono text-white font-semibold">{userLicense.lotSetting.toFixed(4)} Lot</div>
                    </div>
                    <div className="p-3 bg-[#131622] rounded-lg border border-zinc-800 space-y-1">
                      <span className="text-zinc-500">Algorithmic Signals:</span>
                      <div className="text-[#E4C765] font-semibold">{userLicense.signalsCount} Confluence Filters</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab('binding')}
                      className="px-4 py-2 rounded-lg bg-[#181D2B] hover:bg-[#22283A] border border-[#2D364D] text-xs font-semibold text-zinc-200 cursor-pointer"
                    >
                      Manage MT5 Binding
                    </button>
                    <button
                      onClick={() => setActiveTab('purchase')}
                      className="px-4 py-2 rounded-lg bg-[#C9A227] hover:bg-[#E4C765] text-black text-xs font-bold transition-all cursor-pointer"
                    >
                      Renew or Upgrade Term
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-[#0D1017] border border-[#1E2330] text-center space-y-4">
                  <Key className="w-10 h-10 text-[#C9A227] mx-auto" />
                  <h3 className="text-lg font-bold text-white">No Active Licence Assigned</h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Select an eligible licence package to begin automated gold execution with account-bound MT5 protection.
                  </p>
                  <button
                    onClick={() => setActiveTab('purchase')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold text-xs"
                  >
                    View Licence Packages
                  </button>
                </div>
              )}

              {/* Quick Status Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* VPS Status Box */}
                <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-semibold text-sm">
                      <Server className="w-4 h-4 text-[#C9A227]" />
                      <span>Dedicated VPS Readiness</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/60 text-emerald-300 text-[10px] font-semibold">
                      {userVps ? userVps.status.toUpperCase() : 'NOT PROVISIONED'}
                    </span>
                  </div>

                  {userVps ? (
                    <div className="space-y-2 text-xs text-zinc-400">
                      <div className="flex justify-between">
                        <span>Provider & Region:</span>
                        <span className="text-zinc-200 font-medium">{userVps.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IP Address:</span>
                        <span className="font-mono text-zinc-200">{userVps.ipAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Operating System:</span>
                        <span className="text-zinc-200">{userVps.os}</span>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => setActiveTab('vps')}
                          className="text-xs text-[#E4C765] hover:underline"
                        >
                          View VPS Diagnostics →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs text-zinc-400">
                      <p>Run your MT5 EA continuously with ultra-low latency co-located hosting.</p>
                      <button
                        onClick={() => setActiveTab('purchase')}
                        className="px-3 py-1.5 bg-[#141824] hover:bg-[#1C2234] border border-[#2B354C] rounded text-zinc-200 text-xs font-semibold"
                      >
                        Request Managed VPS (360 USDT/yr)
                      </button>
                    </div>
                  )}
                </div>

                {/* WebRequest Network Whitelist Box */}
                <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-4">
                  <div className="flex items-center gap-2 text-white font-semibold text-sm">
                    <Terminal className="w-4 h-4 text-[#C9A227]" />
                    <span>MT5 WebRequest Target</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Your MT5 terminal must have WebRequest enabled for our secure licensing server:
                  </p>
                  <div className="p-3 rounded-lg bg-[#090B10] border border-[#1E2332] flex items-center justify-between">
                    <span className="font-mono text-xs text-[#E4C765] truncate">{settings.webrequestUrl}</span>
                    <button
                      onClick={() => copyToClipboard(settings.webrequestUrl, 'wr-url')}
                      className="text-zinc-400 hover:text-white shrink-0 ml-2"
                    >
                      {copiedId === 'wr-url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="pt-1">
                    <button
                      onClick={() => setCurrentRoute('mt5-setup')}
                      className="text-xs text-[#E4C765] hover:underline"
                    >
                      View Setup Instructions →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY LICENCE & POLICY */}
          {activeTab === 'my-license' && (
            <div className="space-y-6">
              <div className="p-8 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div>
                    <h2 className="text-xl font-display font-bold text-white">Licence Details & Policy Limits</h2>
                    <p className="text-xs text-zinc-400">Cryptographically verified execution parameters</p>
                  </div>
                  {userLicense && getStatusBadge(userLicense.status)}
                </div>

                {userLicense ? (
                  <div className="space-y-6 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#111420] rounded-xl border border-zinc-800 space-y-2">
                        <span className="text-zinc-500 font-semibold uppercase text-[10px]">Licence Identification</span>
                        <div className="font-mono text-white text-sm font-bold">{userLicense.id}</div>
                        <div className="text-zinc-400">Owner UID: {userLicense.userId}</div>
                        <div className="text-zinc-400">Assigned Plan: {userLicense.planName}</div>
                      </div>

                      <div className="p-4 bg-[#111420] rounded-xl border border-zinc-800 space-y-2">
                        <span className="text-zinc-500 font-semibold uppercase text-[10px]">Validity Period</span>
                        <div className="text-zinc-200">
                          Activated: {userLicense.activatedAt ? new Date(userLicense.activatedAt).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-[#E4C765] font-semibold">
                          Expires: {userLicense.expiresAt ? new Date(userLicense.expiresAt).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-zinc-400">Total Validity Term: {userLicense.validityDays} Days</div>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-[#080A0F] border border-zinc-800 space-y-3">
                      <h3 className="text-sm font-semibold text-white">Execution Constraints (Enforced in EA)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-[#111420] rounded-lg border border-zinc-800">
                          <span className="text-zinc-500 block">Permitted Lot:</span>
                          <span className="font-mono text-zinc-200 font-bold">{userLicense.lotSetting.toFixed(4)}</span>
                        </div>
                        <div className="p-3 bg-[#111420] rounded-lg border border-zinc-800">
                          <span className="text-zinc-500 block">Risk Setting:</span>
                          <span className="text-zinc-200 font-bold">{userLicense.riskSettingPct}%</span>
                        </div>
                        <div className="p-3 bg-[#111420] rounded-lg border border-zinc-800">
                          <span className="text-zinc-500 block">Trading Symbol:</span>
                          <span className="text-[#E4C765] font-bold">XAUUSD ONLY</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400">No active licence found.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PURCHASE LICENCE */}
          {activeTab === 'purchase' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-3">
                <h2 className="text-xl font-display font-bold text-white">Acquire or Upgrade Licence</h2>
                <p className="text-xs text-zinc-400">
                  Select an eligible licence package. If you already hold an active licence, packages may be upgraded to higher tiers, but cannot be downgraded.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    className="p-6 rounded-2xl bg-[#0E1118] border border-[#1E2330] space-y-4 hover:border-[#C9A227]/40 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-bold text-white">{plan.name}</h3>
                        <span className="text-xs text-zinc-400">{plan.validityDays} Days Term</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-display font-bold text-white">{plan.priceUSDT}</span>
                        <span className="text-xs font-semibold text-[#E4C765] ml-1">USDT</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400">{plan.description}</p>

                    <div className="p-3 rounded-lg bg-[#121520] border border-zinc-800 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Signals:</span>
                        <span className="text-[#E4C765] font-semibold">{plan.signalsCount} Signals</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Suggested Equity:</span>
                        <span className="text-zinc-200">{plan.suggestedEquityUSD}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const res = createOrder(plan.id, 'USDT-TRC20');
                        if (res.success) {
                          setActiveTab('payments');
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#E4C765] text-black font-bold text-xs transition-all cursor-pointer"
                    >
                      Generate Order for {plan.priceUSDT} USDT
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MT5 BINDING & UNBINDING */}
          {activeTab === 'binding' && (
            <div className="space-y-6">
              <div className="p-8 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-6">
                <div className="border-b border-zinc-800 pb-4">
                  <h2 className="text-xl font-display font-bold text-white">MT5 Terminal Binding</h2>
                  <p className="text-xs text-zinc-400">
                    Each licence is bound to one active MT5 account. You cannot overwrite an active binding directly without compliance approval.
                  </p>
                </div>

                {userLicense?.boundMt5Account ? (
                  <div className="space-y-6">
                    {/* Active Binding Card */}
                    <div className="p-6 rounded-xl bg-[#111420] border border-emerald-800/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Active Terminal Binding
                        </span>
                        <span className="text-xs text-zinc-500">Bound on {new Date(userLicense.boundAt || Date.now()).toLocaleDateString()}</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
                        <div>
                          <span className="text-zinc-500 block text-[11px]">MT5 Login</span>
                          <span className="font-mono text-sm font-bold text-white">#{userLicense.boundMt5Account}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[11px]">Broker</span>
                          <span className="text-zinc-200 font-medium">{userLicense.brokerName}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[11px]">Server</span>
                          <span className="text-zinc-200 font-medium">{userLicense.brokerServer}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[11px]">Account Type</span>
                          <span className="text-zinc-200 font-medium">{userLicense.accountType || 'Raw'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Submit Unbinding Request Section */}
                    <div className="p-6 rounded-xl bg-[#090B10] border border-zinc-800 space-y-4">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Request Account Migration / Unbinding
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        To migrate to a different MT5 account (e.g., switching broker servers or upgrading to Raw Spread), submit an unbinding request. Our licence administrators will review and authorize the transfer.
                      </p>

                      <form onSubmit={handleUnbindSubmit} className="space-y-3 text-xs">
                        <div>
                          <label className="block text-zinc-400 mb-1">Technical Reason for Migration</label>
                          <textarea
                            required
                            rows={3}
                            value={unbindingReason}
                            onChange={(e) => setUnbindingReason(e.target.value)}
                            placeholder="e.g. Upgrading to Dedicated Raw Account #883910 on IC Markets..."
                            className="w-full bg-[#111420] border border-[#232838] rounded-lg p-2.5 text-zinc-100 outline-none focus:border-[#C9A227]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-zinc-400 mb-1">New MT5 Login Number (Optional)</label>
                            <input
                              type="text"
                              value={unbindingNewLogin}
                              onChange={(e) => setUnbindingNewLogin(e.target.value)}
                              placeholder="e.g. 7731802"
                              className="w-full bg-[#111420] border border-[#232838] rounded-lg p-2.5 text-zinc-100 outline-none focus:border-[#C9A227]"
                            />
                          </div>

                          <div>
                            <label className="block text-zinc-400 mb-1">New Broker Name (Optional)</label>
                            <input
                              type="text"
                              value={unbindingNewBroker}
                              onChange={(e) => setUnbindingNewBroker(e.target.value)}
                              placeholder="e.g. IC Markets (SC)"
                              className="w-full bg-[#111420] border border-[#232838] rounded-lg p-2.5 text-zinc-100 outline-none focus:border-[#C9A227]"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors cursor-pointer"
                        >
                          Submit Unbinding Request
                        </button>
                      </form>
                    </div>

                    {/* Unbinding Request History */}
                    {userUnbinding.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-zinc-300">Previous Unbinding Requests</h4>
                        <div className="space-y-2">
                          {userUnbinding.map(req => (
                            <div key={req.id} className="p-3 bg-[#111420] border border-zinc-800 rounded-lg flex items-center justify-between text-xs">
                              <div>
                                <span className="font-mono text-zinc-300">Request #{req.id}</span>
                                <span className="text-zinc-500 ml-2">Reason: {req.reason}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                req.status === 'approved' ? 'bg-emerald-950 text-emerald-300' :
                                req.status === 'rejected' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                              }`}>
                                {req.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Initial Binding Form */
                  <form onSubmit={handleBindAccount} className="space-y-4 text-xs max-w-xl">
                    <div>
                      <label className="block text-zinc-400 mb-1">MetaTrader 5 Login Number</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 7729014"
                        value={bindLogin}
                        onChange={(e) => setBindLogin(e.target.value)}
                        className="w-full bg-[#111420] border border-[#232838] rounded-lg p-2.5 text-zinc-100 outline-none focus:border-[#C9A227]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-400 mb-1">Broker Name</label>
                        <input
                          type="text"
                          required
                          value={bindBroker}
                          onChange={(e) => setBindBroker(e.target.value)}
                          className="w-full bg-[#111420] border border-[#232838] rounded-lg p-2.5 text-zinc-100 outline-none focus:border-[#C9A227]"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-400 mb-1">Broker Server</label>
                        <input
                          type="text"
                          required
                          value={bindServer}
                          onChange={(e) => setBindServer(e.target.value)}
                          className="w-full bg-[#111420] border border-[#232838] rounded-lg p-2.5 text-zinc-100 outline-none focus:border-[#C9A227]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Account Execution Type</label>
                      <select
                        value={bindAccountType}
                        onChange={(e) => setBindAccountType(e.target.value)}
                        className="w-full bg-[#111420] border border-[#232838] rounded-lg p-2.5 text-zinc-100 outline-none focus:border-[#C9A227]"
                      >
                        <option value="Raw">Raw Spread / ECN (Recommended)</option>
                        <option value="Standard">Standard Account</option>
                        <option value="Pro">Pro / Zero Spread</option>
                      </select>
                    </div>

                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
                      Security Notice: We never request or store broker withdrawal credentials or trading passwords. Only the MT5 account number and broker server are required for cryptographic authorization.
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#E4C765] text-black font-bold text-xs transition-colors cursor-pointer"
                    >
                      Bind MT5 Terminal
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: VPS STATUS */}
          {activeTab === 'vps' && (
            <div className="space-y-6">
              <div className="p-8 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div>
                    <h2 className="text-xl font-display font-bold text-white">VPS Infrastructure Diagnostics</h2>
                    <p className="text-xs text-zinc-400">Low-latency co-located environment for continuous MT5 EA execution</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 text-xs font-semibold">
                    {userVps ? 'Active' : 'Unprovisioned'}
                  </span>
                </div>

                {userVps ? (
                  <div className="space-y-6 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-[#111420] rounded-xl border border-zinc-800 space-y-2">
                        <span className="text-zinc-500 font-semibold text-[10px] uppercase">Infrastructure Details</span>
                        <div className="text-zinc-200">Co-location: {userVps.region}</div>
                        <div className="text-zinc-200">Host IP: <span className="font-mono text-[#E4C765]">{userVps.ipAddress}</span></div>
                        <div className="text-zinc-200">System: {userVps.os}</div>
                      </div>

                      <div className="p-5 bg-[#111420] rounded-xl border border-zinc-800 space-y-2">
                        <span className="text-zinc-500 font-semibold text-[10px] uppercase">Term & Renewal</span>
                        <div className="text-zinc-200">Activated: {new Date(userVps.activatedAt).toLocaleDateString()}</div>
                        <div className="text-zinc-200">Expires: {new Date(userVps.expiresAt).toLocaleDateString()}</div>
                        <div className="text-zinc-400">Renewal: {userVps.renewalPriceUSDT} USDT / Year</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#090B10] border border-zinc-800 text-zinc-400 text-xs space-y-2">
                      <div className="font-semibold text-zinc-200">Secure Access Protocol:</div>
                      <p>
                        In accordance with our cybersecurity policy, raw administrative passwords are never stored in browser memory. If you require credentials delivery or a remote desktop reset, submit a verified support ticket.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-3">
                    <Server className="w-10 h-10 text-zinc-600 mx-auto" />
                    <p className="text-xs text-zinc-400">You do not currently have a dedicated VPS instance allocated.</p>
                    <button
                      onClick={() => setActiveTab('purchase')}
                      className="px-4 py-2 rounded-lg bg-[#C9A227] text-black font-bold text-xs"
                    >
                      Order VPS (360 USDT/yr)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: EA DOWNLOAD CENTER */}
          {activeTab === 'downloads' && (
            <div className="space-y-6">
              <div className="p-8 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-6">
                <div className="border-b border-zinc-800 pb-4">
                  <h2 className="text-xl font-display font-bold text-white">EA Download Center</h2>
                  <p className="text-xs text-zinc-400">Approved production builds and cryptographic checksums</p>
                </div>

                <div className="p-6 rounded-xl bg-[#111420] border border-[#242C3E] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-white">{currentEa.fileName}</div>
                      <div className="text-xs text-zinc-400">Production Build v{currentEa.version} • Released {currentEa.releaseDate}</div>
                    </div>

                    <a
                      href={currentEa.downloadPath}
                      download
                      onClick={(e) => {
                        e.preventDefault();
                        addToast('Download Initiated', `Downloading ${currentEa.fileName}`, 'success');
                      }}
                      className="px-4 py-2 rounded-lg bg-[#C9A227] hover:bg-[#E4C765] text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .ex5 Binary</span>
                    </a>
                  </div>

                  <div className="p-3 rounded-lg bg-[#090B10] border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold">SHA-256 Checksum:</span>
                    <div className="font-mono text-xs text-[#E4C765] break-all">{currentEa.checksumSHA256}</div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold text-zinc-300">Release Notes:</span>
                    <ul className="space-y-1 text-xs text-zinc-400">
                      {currentEa.releaseNotes.map((note, nIdx) => (
                        <li key={nIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: BILLING & INVOICES */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="p-8 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-6">
                <div className="border-b border-zinc-800 pb-4">
                  <h2 className="text-xl font-display font-bold text-white">Orders & Invoices</h2>
                  <p className="text-xs text-zinc-400">Digital software receipts and blockchain transaction hashes</p>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  {userOrders.length === 0 ? (
                    <p className="text-xs text-zinc-500">No payment orders on record.</p>
                  ) : (
                    userOrders.map(order => (
                      <div key={order.id} className="p-5 rounded-xl bg-[#111420] border border-zinc-800 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-mono text-xs text-white font-bold">{order.id}</span>
                            <div className="text-xs text-zinc-400">{order.planName} • {order.amountUSDT} USDT</div>
                          </div>
                          <span className={`px-2.5 py-1 rounded text-xs uppercase font-bold ${
                            order.status === 'confirmed' ? 'bg-emerald-950 text-emerald-300' :
                            order.status === 'under_review' ? 'bg-amber-950 text-amber-300' : 'bg-zinc-800 text-zinc-300'
                          }`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Deposit instructions if pending */}
                        {order.status === 'pending' && (
                          <div className="p-4 rounded-lg bg-[#0A0D14] border border-amber-800/40 space-y-3 text-xs">
                            <div className="flex items-center gap-2 text-amber-300 font-semibold">
                              <AlertTriangle className="w-4 h-4" />
                              <span>Transfer Required: {order.amountUSDT} USDT ({order.paymentMethod})</span>
                            </div>
                            <div>
                              <span className="text-zinc-500 block text-[11px]">Official Deposit Address:</span>
                              <div className="flex items-center justify-between font-mono text-[#E4C765] bg-black/40 p-2 rounded mt-1">
                                <span className="break-all">{order.depositAddress}</span>
                                <button
                                  onClick={() => copyToClipboard(order.depositAddress, order.id)}
                                  className="text-zinc-400 hover:text-white ml-2"
                                >
                                  {copiedId === order.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>

                            <div className="pt-2 space-y-2">
                              <label className="block text-zinc-300">Submit Transaction Hash (TxHash):</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Enter 64-character transaction hash..."
                                  value={activeOrderId === order.id ? txHashInput : ''}
                                  onChange={(e) => {
                                    setActiveOrderId(order.id);
                                    setTxHashInput(e.target.value);
                                  }}
                                  className="flex-1 bg-[#111420] border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 outline-none font-mono text-xs"
                                />
                                <button
                                  onClick={() => handleTxSubmit(order.id)}
                                  className="px-4 py-2 bg-[#C9A227] hover:bg-[#E4C765] text-black font-bold rounded-lg text-xs cursor-pointer"
                                >
                                  Submit Proof
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* View Invoice button if confirmed */}
                        {order.status === 'confirmed' && (
                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => {
                                const inv = invoices.find(i => i.orderId === order.id);
                                setSelectedInvoice(inv || null);
                              }}
                              className="text-xs text-[#E4C765] hover:underline flex items-center gap-1 font-semibold"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>View & Print Invoice</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SUPPORT TICKETS */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div className="p-8 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div>
                    <h2 className="text-xl font-display font-bold text-white">Support & Technical Desk</h2>
                    <p className="text-xs text-zinc-400">Assistance for WebRequest, VPS, and EA diagnostics</p>
                  </div>
                  <button
                    onClick={() => setNewTicketModal(true)}
                    className="px-4 py-2 rounded-lg bg-[#C9A227] hover:bg-[#E4C765] text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Open Ticket</span>
                  </button>
                </div>

                {/* Ticket Threads */}
                <div className="space-y-4">
                  {userTickets.map(t => (
                    <div key={t.id} className="p-5 rounded-xl bg-[#111420] border border-zinc-800 space-y-4 text-xs">
                      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                        <div>
                          <span className="font-mono text-zinc-400 font-bold">{t.id}</span>
                          <h4 className="text-sm font-semibold text-white mt-0.5">{t.subject}</h4>
                          <span className="text-[11px] text-zinc-500">Category: {t.category} • Priority: {t.priority}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold ${
                          t.status === 'resolved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                        }`}>
                          {t.status}
                        </span>
                      </div>

                      {/* Messages Thread */}
                      <div className="space-y-3 pl-2">
                        {t.messages.map(m => (
                          <div key={m.id} className="p-3 rounded-lg bg-[#090B10] border border-zinc-800 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-[#E4C765]">{m.senderName} ({m.senderRole})</span>
                              <span className="text-zinc-500">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-zinc-300 leading-relaxed">{m.message}</p>
                          </div>
                        ))}
                      </div>

                      {/* Reply Box */}
                      {t.status !== 'closed' && (
                        <div className="pt-2 flex gap-2">
                          <input
                            type="text"
                            placeholder="Add reply to ticket thread..."
                            value={activeTicketId === t.id ? ticketReplyText : ''}
                            onChange={(e) => {
                              setActiveTicketId(t.id);
                              setTicketReplyText(e.target.value);
                            }}
                            className="flex-1 bg-[#090B10] border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-xs outline-none"
                          />
                          <button
                            onClick={() => {
                              if (ticketReplyText) {
                                replyTicket(t.id, ticketReplyText);
                                setTicketReplyText('');
                                setActiveTicketId(null);
                              }
                            }}
                            className="px-4 py-2 bg-[#1C2234] hover:bg-[#262F48] text-[#E4C765] font-semibold rounded-lg text-xs cursor-pointer"
                          >
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: RISK & LEGAL ACCEPTANCE */}
          {activeTab === 'agreements' && (
            <div className="space-y-6">
              <div className="p-8 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-6">
                <div className="border-b border-zinc-800 pb-4">
                  <h2 className="text-xl font-display font-bold text-white">Cryptographic Legal Audit Record</h2>
                  <p className="text-xs text-zinc-400">Permanent record of Terms of Use, Software Licence, and High-Risk Trading Disclosure</p>
                </div>

                {currentUser.agreementsAccepted ? (
                  <div className="p-6 rounded-xl bg-[#111420] border border-emerald-800/40 space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Agreements Formally Accepted and Recorded</span>
                    </div>

                    <div className="space-y-1.5 text-zinc-300">
                      <div>Terms Version: <span className="font-mono text-white">{currentUser.agreementsAccepted.termsVersion}</span></div>
                      <div>Software Licence Agreement Version: <span className="font-mono text-white">{currentUser.agreementsAccepted.slaVersion}</span></div>
                      <div>Trading Risk Disclosure Version: <span className="font-mono text-white">{currentUser.agreementsAccepted.riskDisclosureVersion}</span></div>
                      <div>Accepted Timestamp: <span className="text-zinc-200">{new Date(currentUser.agreementsAccepted.acceptedAt).toISOString()}</span></div>
                      <div>Client IP Address Context: <span className="font-mono text-zinc-200">{currentUser.agreementsAccepted.ipAddress}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-amber-950/30 border border-amber-800/50 space-y-4 text-xs">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Institutional Risk Disclosure & Terms Pending Acceptance</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">
                      Trading gold (XAUUSD) and leveraged contracts involves substantial risk of capital loss. OPHIREUM provides automated algorithmic execution software only. You must acknowledge that past performance is not indicative of future results and agree to the Terms of Service v2.4-2026.
                    </p>
                    <button
                      onClick={acceptAgreements}
                      className="px-6 py-2.5 bg-[#C9A227] hover:bg-[#E4C765] text-black font-bold text-xs rounded-xl cursor-pointer flex items-center gap-2 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>I Acknowledge & Cryptographically Accept All Agreements</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 10: PROFILE & SECURITY */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="p-8 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-6 text-xs">
                <div className="border-b border-zinc-800 pb-4">
                  <h2 className="text-xl font-display font-bold text-white">Profile & Security Settings</h2>
                  <p className="text-xs text-zinc-400">Account verification, profile metadata, session security, and access credentials</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email & Auth Status */}
                  <div className="p-5 bg-[#111420] rounded-xl border border-zinc-800 space-y-3">
                    <span className="text-zinc-500 font-semibold uppercase text-[10px]">Firebase Authentication Status</span>
                    <div className="text-zinc-200">Email: <span className="font-mono font-bold text-white">{currentUser.email}</span></div>
                    <div className="text-zinc-200">Account UID: <span className="font-mono text-zinc-400">{currentUser.uid}</span></div>
                    
                    <div className="pt-1">
                      {currentUser.isEmailVerified ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 font-semibold text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Email Verified in Firebase</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-950/70 border border-amber-800/60 text-amber-300 font-semibold text-xs">
                            <Clock className="w-4 h-4" />
                            <span>Email Verification Pending</span>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <button
                              onClick={() => sendVerificationEmail()}
                              className="px-3 py-1.5 bg-[#1B2234] hover:bg-[#252E46] text-[#E4C765] rounded-lg text-xs font-semibold cursor-pointer border border-[#2B354F]"
                            >
                              Resend Verification Email
                            </button>
                            <button
                              disabled={isVerifyingEmail}
                              onClick={async () => {
                                setIsVerifyingEmail(true);
                                await acceptEmailVerified();
                                setIsVerifyingEmail(false);
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              {isVerifyingEmail ? 'Checking...' : 'Check Verification'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Password & Security Actions */}
                  <div className="p-5 bg-[#111420] rounded-xl border border-zinc-800 space-y-3">
                    <span className="text-zinc-500 font-semibold uppercase text-[10px]">Access Credentials & MFA</span>
                    <div className="text-zinc-200">Assigned Role: <span className="font-mono text-[#E4C765] font-bold uppercase">{currentUser.role}</span></div>
                    <div className="text-zinc-400">Multi-Factor Authentication (MFA): <span className="text-emerald-400 font-semibold">Ready</span></div>
                    <div className="pt-2">
                      <button
                        onClick={() => sendPasswordReset(currentUser.email)}
                        className="px-4 py-2 bg-[#1B2234] hover:bg-[#252E46] text-zinc-200 rounded-lg text-xs font-semibold cursor-pointer border border-[#2B354F]"
                      >
                        Send Password Recovery Link
                      </button>
                    </div>
                  </div>
                </div>

                {/* Profile Edit Form */}
                <div className="p-6 bg-[#111420] rounded-xl border border-zinc-800 space-y-4">
                  <h3 className="text-sm font-bold text-white">Customer Metadata</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-[#090B10] border border-zinc-700 rounded-lg p-2.5 text-zinc-100 outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">Contact Phone Number</label>
                      <input
                        type="text"
                        placeholder="+971 50 123 4567"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full bg-[#090B10] border border-zinc-700 rounded-lg p-2.5 text-zinc-100 outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">Jurisdiction / Country</label>
                      <input
                        type="text"
                        value={profileCountry}
                        onChange={(e) => setProfileCountry(e.target.value)}
                        className="w-full bg-[#090B10] border border-zinc-700 rounded-lg p-2.5 text-zinc-100 outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">Trading Terminal Timezone</label>
                      <input
                        type="text"
                        value={profileTimezone}
                        onChange={(e) => setProfileTimezone(e.target.value)}
                        className="w-full bg-[#090B10] border border-zinc-700 rounded-lg p-2.5 text-zinc-100 outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      disabled={isUpdatingProfile}
                      onClick={async () => {
                        setIsUpdatingProfile(true);
                        await updateProfileInfo({
                          fullName: profileName,
                          phone: profilePhone,
                          country: profileCountry,
                          timezone: profileTimezone
                        });
                        setIsUpdatingProfile(false);
                      }}
                      className="px-5 py-2.5 bg-[#C9A227] hover:bg-[#E4C765] text-black font-bold text-xs rounded-xl cursor-pointer transition-colors"
                    >
                      {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Printable Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1017] border border-[#262E42] rounded-2xl max-w-xl w-full p-8 space-y-6 text-xs text-zinc-300 relative animate-in fade-in">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <div className="font-display font-bold text-lg text-white">OPHIREUM INVOICE</div>
                <div className="text-zinc-500 font-mono">{selectedInvoice.id}</div>
              </div>
              <div className="text-right">
                <span className="text-xs px-2 py-0.5 bg-emerald-950 text-emerald-300 font-bold uppercase rounded">
                  {selectedInvoice.status}
                </span>
                <div className="text-[11px] text-zinc-500 mt-1">{new Date(selectedInvoice.issuedAt).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-semibold text-white">{selectedInvoice.companyDetails.name}</div>
              <div className="text-zinc-400">{selectedInvoice.companyDetails.division}</div>
              <div className="text-zinc-400">Email: {selectedInvoice.companyDetails.contactEmail}</div>
            </div>

            <div className="border-t border-b border-zinc-800 py-3 space-y-1">
              <div className="flex justify-between font-semibold text-white">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>{selectedInvoice.planName}</span>
                <span className="font-mono text-white font-bold">{selectedInvoice.amountUSDT} USDT</span>
              </div>
            </div>

            <div className="text-[11px] text-zinc-500 space-y-1">
              <div>Payment Method: {selectedInvoice.paymentMethod}</div>
              <div className="break-all font-mono">Tx: {selectedInvoice.txHash}</div>
              <div className="pt-2 italic">{selectedInvoice.taxNote}</div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 bg-[#C9A227] text-black font-bold rounded-lg text-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Receipt</span>
            </button>
          </div>
        </div>
      )}

      {/* New Support Ticket Modal */}
      {newTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1017] border border-[#262E42] rounded-2xl max-w-lg w-full p-6 space-y-4 text-xs text-zinc-300 relative animate-in fade-in">
            <button
              onClick={() => setNewTicketModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white">Open Support Ticket</h3>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1">Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value as any)}
                  className="w-full bg-[#111420] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 outline-none"
                >
                  <option value="WebRequest">WebRequest Configuration</option>
                  <option value="EA Installation">EA Installation</option>
                  <option value="MT5 Binding">MT5 Binding</option>
                  <option value="VPS">VPS Support</option>
                  <option value="Technical Error">Technical Error</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Summary of technical question"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full bg-[#111420] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Detailed Inquiry</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide terminal version, broker server, and error messages..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full bg-[#111420] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#C9A227] hover:bg-[#E4C765] text-black font-bold rounded-lg text-xs cursor-pointer"
              >
                Dispatch Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
