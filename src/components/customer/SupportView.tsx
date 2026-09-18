/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Client Support View
 * Section 32: Categorized support options, ticket creation, and ticket status history.
 */

import React, { useState } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  FileQuestion,
  Shield,
  CreditCard,
  Terminal,
  Cpu,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SupportView: React.FC = () => {
  const { addToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('Trading Connection Help');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  const categories = [
    { name: 'Account Help', icon: LifeBuoy, desc: 'Profile details and account access' },
    { name: 'Identity Verification Help', icon: Shield, desc: 'KYC status and documentation' },
    { name: 'Trading Connection Help', icon: Terminal, desc: 'MT5 bridge and broker setup' },
    { name: 'Subscription & Payment', icon: CreditCard, desc: 'USDT invoices and licensing' },
    { name: 'Ophireum Help', icon: Cpu, desc: 'Algorithm settings and risk boundaries' },
    { name: 'Security Concern', icon: Shield, desc: '2FA and authorization alerts' }
  ];

  const existingTickets = [
    {
      id: 'TCK-8812',
      subject: 'MT5 Bridge Synchronization Confirmation',
      category: 'Trading Connection',
      status: 'RESOLVED',
      date: 'Sept 15, 2026',
      reply: 'Broker bridge latency confirmed at 1.2ms. Execution parameters running normally.'
    }
  ];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNewTicketModal(false);
    setSubject('');
    setMessage('');
    addToast(
      'Support Ticket Created',
      'Ticket #TCK-8849 has been assigned to an institutional engineer. Expected response time: < 2 hours.',
      'success'
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Support Header */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2538] pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                DESK SUPPORT
              </div>
              <h1 className="text-lg font-bold text-white font-serif tracking-wide">
                CLIENT ASSISTANCE & TICKETS
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowNewTicketModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-[#C9A227]/15"
          >
            <Plus className="w-4 h-4" />
            <span>OPEN NEW TICKET</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Select Help Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map(c => (
              <div
                key={c.name}
                onClick={() => {
                  setSelectedCategory(c.name);
                  setShowNewTicketModal(true);
                }}
                className="p-4 rounded-2xl bg-[#141824] border border-[#222A3B] hover:border-[#C9A227]/50 transition-colors cursor-pointer group"
              >
                <c.icon className="w-5 h-5 text-[#C9A227] mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-white">{c.name}</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket History */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-xl space-y-4">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#1E2538] pb-3">
          Recent Support Tickets
        </h2>

        <div className="space-y-3">
          {existingTickets.map(t => (
            <div key={t.id} className="p-4 rounded-2xl bg-[#141824] border border-[#222A3B] space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-zinc-400 font-bold">{t.id}</span>
                  <span className="font-bold text-white">{t.subject}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-[10px] font-bold w-fit">
                  {t.status}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 bg-[#0F121C] p-2.5 rounded-xl border border-[#1C2232]">
                <strong className="text-zinc-300">Desk Response:</strong> {t.reply}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono flex justify-between pt-1">
                <span>Category: {t.category}</span>
                <span>Date: {t.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreateTicket}
            className="w-full max-w-lg rounded-3xl bg-[#0D1017] border border-[#222B3D] shadow-2xl p-6 space-y-4 text-left"
          >
            <h3 className="text-base font-bold text-white font-serif">Create Support Ticket</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#141824] border border-[#222A3B] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#C9A227]"
                >
                  {categories.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Summary of question or issue..."
                  className="w-full bg-[#141824] border border-[#222A3B] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Detailed Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Provide any relevant MT5 ticket numbers, dates, or error descriptions..."
                  className="w-full bg-[#141824] border border-[#222A3B] rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewTicketModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold text-xs cursor-pointer"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
