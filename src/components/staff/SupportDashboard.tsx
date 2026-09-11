/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Support Agent Operations Console (/support-dashboard)
 * Strictly isolated for ticket queue management and technical support triage.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LifeBuoy,
  Search,
  Filter,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Shield,
  Tag,
  ArrowUpRight
} from 'lucide-react';
import { SupportTicket, TicketStatus, TicketPriority, TicketCategory } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

export const SupportDashboard: React.FC = () => {
  const {
    currentUser,
    tickets,
    replyTicket,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  // Filtered ticket queue
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.userEmail && ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const activeTicket = tickets.find(t => t.id === selectedTicketId) || filteredTickets[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyMessage.trim()) return;

    replyTicket(activeTicket.id, replyMessage.trim(), isInternalNote);
    setReplyMessage('');
    addToast(
      isInternalNote ? 'Internal Note Added' : 'Reply Dispatched',
      isInternalNote
        ? 'Internal note recorded for staff review.'
        : `Reply sent to customer (${activeTicket.userEmail || 'Customer'}).`,
      'success'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2B354C] pb-6">
        <div className="flex items-start gap-4">
          <BrandLogo size="md" showText={false} asLink={false} className="mt-0.5" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-950/60 border border-blue-600/40 text-blue-300 font-mono text-[10px] tracking-wider uppercase">
                Support Desk Authority
              </span>
              <span className="text-zinc-500 text-xs font-mono">• Operational Queue</span>
            </div>
            <h1 className="text-2xl font-bold text-white font-display">Support Agent Operations Console</h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Resolve customer tickets, record internal escalation notes, and manage algorithmic assistance requests.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-[#141824] border border-[#2B354C] text-xs font-mono">
            <span className="text-zinc-400">Agent: </span>
            <span className="text-[#E4C765] font-bold">{currentUser.fullName || currentUser.email}</span>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#0D0F15] border border-[#2B354C]">
          <div className="text-[11px] font-mono text-zinc-400">Open Tickets</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {tickets.filter(t => t.status === 'open').length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#0D0F15] border border-[#2B354C]">
          <div className="text-[11px] font-mono text-zinc-400">In Progress</div>
          <div className="text-2xl font-bold text-blue-400 font-mono mt-1">
            {tickets.filter(t => t.status === 'in_progress').length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#0D0F15] border border-[#2B354C]">
          <div className="text-[11px] font-mono text-zinc-400">High / Critical Priority</div>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-1">
            {tickets.filter(t => t.priority === 'urgent' || t.priority === 'high').length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#0D0F15] border border-[#2B354C]">
          <div className="text-[11px] font-mono text-zinc-400">Resolved Today</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {tickets.filter(t => t.status === 'resolved').length}
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 bg-[#0D0F15] p-3 rounded-xl border border-[#2B354C]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets by ID, subject, or customer email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#141824] border border-[#2B354C] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C9A227]"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#141824] border border-[#2B354C] text-xs text-zinc-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#141824] border border-[#2B354C] text-xs text-zinc-300 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* 2-Column Ticket Master-Detail Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Ticket Queue */}
        <div className="lg:col-span-5 bg-[#0D0F15] border border-[#2B354C] rounded-2xl overflow-hidden divide-y divide-[#2B354C]">
          <div className="p-3 bg-[#111420] text-xs font-bold text-zinc-300 flex items-center justify-between">
            <span>Ticket Queue ({filteredTickets.length})</span>
            <span className="text-[10px] text-zinc-500 font-mono">Sorted by recency</span>
          </div>

          <div className="max-h-[600px] overflow-y-auto divide-y divide-[#2B354C]/50">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500">
                No tickets matching current filters.
              </div>
            ) : (
              filteredTickets.map(ticket => {
                const isSelected = activeTicket?.id === ticket.id;
                return (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`w-full text-left p-4 transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#181C28] border-l-2 border-[#C9A227]' : 'hover:bg-[#121520]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[#E4C765]">{ticket.id}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          ticket.priority === 'urgent'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                            : ticket.priority === 'high'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {ticket.priority}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          ticket.status === 'open'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : ticket.status === 'in_progress'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs font-medium text-white line-clamp-1 mb-1">
                      {ticket.subject}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                      <span className="truncate max-w-[180px]">{ticket.userEmail || ticket.userId}</span>
                      <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Ticket Conversation & Action Desk */}
        <div className="lg:col-span-7 bg-[#0D0F15] border border-[#2B354C] rounded-2xl p-6 space-y-6">
          {activeTicket ? (
            <>
              {/* Header Info */}
              <div className="border-b border-[#2B354C] pb-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-[#E4C765] font-bold">{activeTicket.id}</span>
                  <span className="text-xs text-zinc-400 font-mono">Category: {activeTicket.category}</span>
                </div>
                <h2 className="text-lg font-bold text-white mb-2">{activeTicket.subject}</h2>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span>Customer: <strong className="text-zinc-200">{activeTicket.userEmail || activeTicket.userId}</strong></span>
                  <span>•</span>
                  <span>Created: {new Date(activeTicket.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Message Thread */}
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                {activeTicket.messages?.map((msg, idx) => {
                  const isStaff = msg.senderRole !== 'customer' && msg.senderRole !== 'visitor';
                  const isNote = msg.isStaffNote;

                  return (
                    <div
                      key={msg.id || idx}
                      className={`p-4 rounded-xl text-xs space-y-1 ${
                        isNote
                          ? 'bg-amber-950/40 border border-amber-800/60 text-amber-100 ml-6'
                          : isStaff
                          ? 'bg-[#151926] border border-[#2B354C] text-zinc-100 ml-6'
                          : 'bg-[#0A0C11] border border-[#2B354C]/60 text-zinc-300 mr-6'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400 mb-1">
                        <span className="font-bold flex items-center gap-1.5">
                          {isNote && <Tag className="w-3 h-3 text-amber-400" />}
                          {isNote ? 'INTERNAL STAFF NOTE' : msg.senderName || (isStaff ? 'OPHIREUM Support' : 'Customer')}
                          {isStaff && !isNote && (
                            <span className="text-[#E4C765] text-[10px] uppercase font-normal">({msg.senderRole})</span>
                          )}
                        </span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    </div>
                  );
                })}
              </div>

              {/* Reply / Internal Note Form */}
              <form onSubmit={handleSendReply} className="space-y-3 pt-4 border-t border-[#2B354C]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-300">
                    {isInternalNote ? 'Add Internal Note (Staff Only)' : 'Reply to Customer'}
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-amber-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={e => setIsInternalNote(e.target.checked)}
                      className="rounded bg-[#141824] border-[#2B354C] text-[#C9A227] focus:ring-0"
                    />
                    <span>Mark as Internal Staff Note</span>
                  </label>
                </div>

                <textarea
                  rows={3}
                  placeholder={
                    isInternalNote
                      ? 'Record internal troubleshooting steps, notes for License or Finance desks...'
                      : 'Draft customer response regarding MT5 configuration, symbol whitelist, or general inquiries...'
                  }
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  className={`w-full p-3 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none ${
                    isInternalNote
                      ? 'bg-amber-950/20 border border-amber-800/80 focus:border-amber-500'
                      : 'bg-[#141824] border border-[#2B354C] focus:border-[#C9A227]'
                  }`}
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className={`px-5 py-2 rounded-xl font-bold text-xs cursor-pointer inline-flex items-center gap-2 transition-colors ${
                      isInternalNote
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-[#C9A227] hover:bg-[#E4C765] text-black'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isInternalNote ? 'Save Internal Note' : 'Send Customer Reply'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-zinc-500 text-xs">
              Select a ticket from the left queue to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
