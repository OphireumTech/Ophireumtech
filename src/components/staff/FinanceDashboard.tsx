/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Finance Reviewer Operations Console (/finance-dashboard)
 * Authoritative financial audit, payment reconciliation, and on-chain verification.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Search,
  Filter,
  FileText,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  Building
} from 'lucide-react';
import { Order, Invoice } from '../../types';

export const FinanceDashboard: React.FC = () => {
  const {
    currentUser,
    orders,
    invoices,
    confirmPaymentOrder,
    rejectPaymentOrder,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'under_review' | 'confirmed' | 'rejected'>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedTx, setCopiedTx] = useState<string | null>(null);

  // Separation of duties: check if reviewer is the customer
  const isOrderCreator = (order: Order) => order.userId === currentUser.uid;

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.txHash && o.txHash.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeOrder = orders.find(o => o.id === selectedOrderId) || filteredOrders[0];
  const activeInvoice = activeOrder ? invoices.find(i => i.orderId === activeOrder.id) : null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(id);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const handleApprove = async (order: Order) => {
    if (isOrderCreator(order)) {
      addToast(
        'Separation of Duties Violation',
        'You cannot approve a payment order you personally created.',
        'critical'
      );
      return;
    }

    setIsProcessing(true);
    try {
      const res = await confirmPaymentOrder(order.id);
      if (res.success) {
        addToast(
          'Payment Approved',
          `Order ${order.id} confirmed. Digital licence issued atomically.`,
          'success'
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (order: Order) => {
    if (!rejectReason.trim()) {
      addToast('Reason Required', 'Please provide a clear justification for payment rejection.', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await rejectPaymentOrder(order.id, rejectReason.trim());
      if (res.success) {
        setShowRejectModal(false);
        setRejectReason('');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Metrics
  const pendingVolume = orders
    .filter(o => o.status === 'pending' || o.status === 'under_review')
    .reduce((sum, o) => sum + (o.amountUSDT || 0), 0);

  const confirmedVolume = orders
    .filter(o => o.status === 'confirmed')
    .reduce((sum, o) => sum + (o.amountUSDT || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2B354C] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 font-mono text-[10px] tracking-wider uppercase">
              Finance Reviewer Authority
            </span>
            <span className="text-zinc-500 text-xs font-mono">• Separation of Duties Enforced</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">Financial Operations & Settlement Desk</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Audit on-chain cryptocurrency receipts, review generated invoices, and approve verified licensing transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-[#141824] border border-[#2B354C] text-xs font-mono">
            <span className="text-zinc-400">Reviewer: </span>
            <span className="text-[#E4C765] font-bold">{currentUser.fullName || currentUser.email}</span>
          </div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0D0F15] border border-[#2B354C]">
          <div className="text-[11px] font-mono text-zinc-400">Pending Review</div>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1">
            {orders.filter(o => o.status === 'under_review' || o.status === 'pending').length}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">${pendingVolume.toLocaleString()} USDT value</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D0F15] border border-[#2B354C]">
          <div className="text-[11px] font-mono text-zinc-400">Settled Volume</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            ${confirmedVolume.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">USDT confirmed settlements</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D0F15] border border-[#2B354C]">
          <div className="text-[11px] font-mono text-zinc-400">Issued Invoices</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {invoices.length}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Institutional records</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D0F15] border border-[#2B354C]">
          <div className="text-[11px] font-mono text-zinc-400">Rejections</div>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-1">
            {orders.filter(o => o.status === 'rejected').length}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Invalid or duplicate hashes</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 bg-[#0D0F15] p-3 rounded-xl border border-[#2B354C]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders by ID, user email, or blockchain transaction hash..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#141824] border border-[#2B354C] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C9A227]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 rounded-lg bg-[#141824] border border-[#2B354C] text-xs text-zinc-300 focus:outline-none"
        >
          <option value="all">All Order Statuses</option>
          <option value="under_review">Under Review (Proof Submitted)</option>
          <option value="pending">Pending Proof</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Order List & Audit Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Orders Queue */}
        <div className="lg:col-span-6 bg-[#0D0F15] border border-[#2B354C] rounded-2xl overflow-hidden divide-y divide-[#2B354C]">
          <div className="p-3 bg-[#111420] text-xs font-bold text-zinc-300 flex items-center justify-between">
            <span>Orders Queue ({filteredOrders.length})</span>
            <span className="text-[10px] text-zinc-500 font-mono">Real-Time Ingestion</span>
          </div>

          <div className="max-h-[620px] overflow-y-auto divide-y divide-[#2B354C]/50">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500">
                No orders matching current filter criteria.
              </div>
            ) : (
              filteredOrders.map(order => {
                const isSelected = activeOrder?.id === order.id;
                const isSelf = isOrderCreator(order);

                return (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`w-full text-left p-4 transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#181C28] border-l-2 border-[#C9A227]' : 'hover:bg-[#121520]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[#E4C765]">{order.id}</span>
                      <div className="flex items-center gap-1.5">
                        {isSelf && (
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[9px]">
                            SELF-ORDER
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          order.status === 'confirmed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : order.status === 'under_review'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                            : order.status === 'rejected'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-white">{order.planName}</span>
                      <span className="font-mono font-bold text-[#E4C765]">${order.amountUSDT} USDT</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                      <span className="truncate max-w-[200px]">{order.userEmail}</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Settlement & Verification Desk */}
        <div className="lg:col-span-6 bg-[#0D0F15] border border-[#2B354C] rounded-2xl p-6 space-y-6">
          {activeOrder ? (
            <>
              <div className="border-b border-[#2B354C] pb-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-mono text-[#E4C765] font-bold">{activeOrder.id}</span>
                  <span className="text-xs text-zinc-400 font-mono">Method: {activeOrder.paymentMethod}</span>
                </div>
                <h2 className="text-lg font-bold text-white mb-1">
                  {activeOrder.planName} (${activeOrder.amountUSDT} USDT)
                </h2>
                <div className="text-xs text-zinc-400">
                  Customer: <strong className="text-zinc-200">{activeOrder.userEmail}</strong> (UID: {activeOrder.userId})
                </div>
              </div>

              {/* On-Chain Evidence Review */}
              <div className="space-y-3 bg-[#141824] p-4 rounded-xl border border-[#2B354C]">
                <div className="text-xs font-bold text-zinc-200 flex items-center justify-between">
                  <span>Cryptographic Settlement Evidence</span>
                  <span className="text-[10px] font-mono text-zinc-400">TRC20 / ERC20 Network</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[11px] mb-0.5">Deposit Destination Address:</span>
                    <div className="font-mono text-zinc-200 bg-[#0A0C11] p-2 rounded-lg border border-[#2B354C] text-[11px] break-all flex items-center justify-between">
                      <span>{activeOrder.depositAddress || 'TL9wZp7rF1oKqS3yC8d4vA9bXmQ2hJ6eN8'}</span>
                      <button
                        onClick={() => handleCopy(activeOrder.depositAddress || '', 'dep')}
                        className="text-zinc-400 hover:text-white ml-2 shrink-0 cursor-pointer"
                      >
                        {copiedTx === 'dep' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-zinc-400 block text-[11px] mb-0.5">Submitted Blockchain Transaction Hash (TxHash):</span>
                    {activeOrder.txHash ? (
                      <div className="font-mono text-[#E4C765] bg-[#0A0C11] p-2 rounded-lg border border-[#2B354C] text-[11px] break-all flex items-center justify-between">
                        <span>{activeOrder.txHash}</span>
                        <div className="flex items-center gap-1.5 ml-2 shrink-0">
                          <button
                            onClick={() => handleCopy(activeOrder.txHash!, 'tx')}
                            className="text-zinc-400 hover:text-white cursor-pointer"
                          >
                            {copiedTx === 'tx' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <a
                            href={`https://tronscan.org/#/transaction/${activeOrder.txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-400 hover:text-white"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-800/40 text-amber-300 text-[11px] font-mono">
                        Awaiting transaction hash submission by customer.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Linked Invoice */}
              {activeInvoice && (
                <div className="p-4 rounded-xl bg-[#141824] border border-[#2B354C] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-200">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#E4C765]" />
                      Tax Invoice #{activeInvoice.id}
                    </span>
                    <span className="font-mono text-zinc-400 uppercase text-[10px]">{activeInvoice.status}</span>
                  </div>
                  <div className="text-xs text-zinc-400">
                    Issued to {activeInvoice.userEmail} for {activeInvoice.planName}
                  </div>
                </div>
              )}

              {/* Separation of Duties Warning */}
              {isOrderCreator(activeOrder) && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>
                    <strong>Separation of Duties Enforced:</strong> You created this order. To prevent fraud, a different authorized Finance Reviewer must perform this review.
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  disabled={
                    isProcessing ||
                    isOrderCreator(activeOrder) ||
                    activeOrder.status === 'confirmed' ||
                    !activeOrder.txHash
                  }
                  onClick={() => handleApprove(activeOrder)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {activeOrder.status === 'confirmed' ? 'Already Approved' : 'Approve & Issue Licence'}
                </button>

                <button
                  disabled={isProcessing || isOrderCreator(activeOrder) || activeOrder.status === 'confirmed'}
                  onClick={() => setShowRejectModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 disabled:opacity-40 text-rose-200 font-bold text-xs cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>

              {/* Rejection Modal */}
              {showRejectModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="max-w-md w-full bg-[#0D0F15] border border-[#2B354C] rounded-2xl p-6 space-y-4">
                    <h3 className="text-base font-bold text-white">Reject Payment Proof</h3>
                    <p className="text-xs text-zinc-400">
                      Specify the operational reason for rejection (e.g. invalid txHash, amount mismatch, wrong blockchain network).
                    </p>

                    <textarea
                      rows={3}
                      placeholder="Enter rejection reason..."
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#141824] border border-[#2B354C] text-xs text-white focus:outline-none focus:border-rose-500"
                    />

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowRejectModal(false)}
                        className="px-4 py-2 rounded-xl bg-[#1A1F2C] text-zinc-300 text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReject(activeOrder)}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-zinc-500 text-xs">
              Select an order from the queue to conduct financial review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
