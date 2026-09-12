/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Official Contact Assistant
 * Replaces obsolete standalone third-party buttons with the approved
 * black-and-gold Ophireum Institutional Contact Assistant.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  X,
  Mail,
  Send,
  HelpCircle,
  FileText,
  ExternalLink,
  Copy,
  Check,
  Headphones,
  ShieldCheck,
  Phone
} from 'lucide-react';

const SUPPORT_EMAIL = 'support@ophireum.biz';
const WHATSAPP_PHONE_INTL = '639957151043';
const WHATSAPP_PHONE_DISPLAY = '+63 995 715 1043';

export const ContactAssistant: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCurrentRoute } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'channels' | 'message'>('channels');
  const [message, setMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Restrict strictly to public pages - hide inside authenticated staff or user dashboards
  const isProtectedDashboard =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/support-dashboard') ||
    location.pathname.startsWith('/finance-dashboard') ||
    location.pathname.startsWith('/license-dashboard') ||
    location.pathname.startsWith('/ea-simulator');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close on Click Outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Reset state on route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  if (isProtectedDashboard) {
    return null;
  }

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleNavigate = (route: string) => {
    setIsOpen(false);
    setCurrentRoute(route);
    const path = route.startsWith('/') ? route : `/${route}`;
    navigate(path);
  };

  const handleSendDirectMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim() || 'Hello Ophireum, I would like to inquire about the Ophireum Expert Assistant.';
    const encoded = encodeURIComponent(text);
    const targetUrl = `https://wa.me/${WHATSAPP_PHONE_INTL}?text=${encoded}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <div
      id="ophireum-contact-assistant-container"
      className="fixed z-40 select-none"
      style={{
        right: 'max(24px, env(safe-area-inset-right, 24px))',
        bottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
      }}
    >
      {/* Assistant Modal Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-labelledby="contact-assistant-title"
          aria-modal="true"
          className="absolute bottom-16 right-0 w-[calc(100vw-32px)] sm:w-[380px] max-w-[400px] max-h-[calc(100vh-120px)] flex flex-col rounded-2xl bg-[#0D1017] border border-[#C9A227]/40 shadow-[0_16px_48px_rgba(0,0,0,0.85),0_0_24px_rgba(201,162,39,0.2)] overflow-hidden text-left"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#121622] via-[#10141F] to-[#0A0C11] border-b border-[#232733] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1A1F2D] border border-[#C9A227]/50 flex items-center justify-center text-[#E4C765] shadow-inner">
                <Headphones className="w-5 h-5 text-[#E4C765]" />
              </div>
              <div>
                <h3 id="contact-assistant-title" className="text-xs font-bold text-white tracking-wide">
                  OPHIREUM Contact Assistant
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Institutional Desk Active</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Contact Assistant"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs inside Assistant */}
          <div className="flex border-b border-[#1E2330] bg-[#0A0C12] text-xs">
            <button
              onClick={() => setActiveTab('channels')}
              className={`flex-1 py-2.5 px-3 font-semibold text-center transition-colors cursor-pointer ${
                activeTab === 'channels'
                  ? 'text-[#E4C765] border-b-2 border-[#C9A227] bg-[#10141E]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Support Channels
            </button>
            <button
              onClick={() => setActiveTab('message')}
              className={`flex-1 py-2.5 px-3 font-semibold text-center transition-colors cursor-pointer ${
                activeTab === 'message'
                  ? 'text-[#E4C765] border-b-2 border-[#C9A227] bg-[#10141E]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Instant Message
            </button>
          </div>

          {/* Content Body */}
          <div className="p-4 space-y-3 overflow-y-auto max-h-[380px] text-xs">
            {activeTab === 'channels' ? (
              <div className="space-y-2.5">
                {/* Submit Ticket */}
                <button
                  onClick={() => handleNavigate('contact')}
                  className="w-full p-3 rounded-xl bg-[#111520] hover:bg-[#181F30] border border-[#232A3E] hover:border-[#C9A227]/50 text-left transition-all flex items-start gap-3 cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-[#181D2A] text-[#E4C765] group-hover:scale-105 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-zinc-100 flex items-center justify-between">
                      <span>Submit a Support Ticket</span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#E4C765]" />
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Open an institutional ticket with technical details, MT5 logs, or account binding requests.
                    </p>
                  </div>
                </button>

                {/* Email Support */}
                <div className="p-3 rounded-xl bg-[#111520] border border-[#232A3E] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                      <Mail className="w-4 h-4 text-[#C9A227]" />
                      <span>Email Operations Desk</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#1A2234] text-zinc-300 hover:text-[#E4C765] border border-zinc-700/60 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="block font-mono text-[11px] text-[#E4C765] hover:underline break-all"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                  <div className="text-[10px] text-zinc-400">
                    Direct technical and compliance inquiries answered within 2-4 business hours.
                  </div>
                </div>

                {/* Direct Instant Chat Desk */}
                <div className="p-3 rounded-xl bg-[#111520] border border-[#232A3E] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                      <Phone className="w-4 h-4 text-[#C9A227]" />
                      <span>Direct Operations Line</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">Available</span>
                  </div>
                  <div className="font-mono text-zinc-200 text-xs">{WHATSAPP_PHONE_DISPLAY}</div>
                  <button
                    onClick={() => setActiveTab('message')}
                    className="w-full py-2 px-3 rounded-lg bg-[#1A2234] hover:bg-[#232E47] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send Message to Desk</span>
                  </button>
                </div>

                {/* Documentation Links */}
                <div className="pt-1 grid grid-cols-2 gap-2 text-[11px]">
                  <button
                    onClick={() => handleNavigate('help-center')}
                    className="p-2 rounded-lg bg-[#0F1219] hover:bg-[#171B26] border border-zinc-800 text-zinc-300 text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                    <span className="truncate">Help Center</span>
                  </button>
                  <button
                    onClick={() => handleNavigate('mt5-setup')}
                    className="p-2 rounded-lg bg-[#0F1219] hover:bg-[#171B26] border border-zinc-800 text-zinc-300 text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                    <span className="truncate">MT5 Setup</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendDirectMessage} className="space-y-3">
                <div>
                  <label htmlFor="assistant-msg-input" className="block text-zinc-300 font-medium mb-1 text-[11px]">
                    Message to Ophireum Desk:
                  </label>
                  <textarea
                    id="assistant-msg-input"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your question, MT5 account inquiry, or licensing need..."
                    className="w-full bg-[#111420] border border-[#232838] focus:border-[#C9A227] rounded-xl p-3 text-zinc-100 placeholder-zinc-600 text-xs outline-none transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div className="p-2.5 rounded-lg bg-[#0C0F17] border border-zinc-800/80 text-[10px] text-zinc-400 space-y-1">
                  <div className="text-zinc-300 font-semibold">Transmission Note:</div>
                  <div>
                    Clicking dispatch will open an encrypted direct chat with pre-filled inquiry to our verified desk line ({WHATSAPP_PHONE_DISPLAY}).
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] hover:brightness-110 text-[#08090B] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#C9A227]/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Message to Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Accessible Desktop Tooltip (Shown when assistant is closed) */}
      {!isOpen && (
        <div
          role="tooltip"
          id="assistant-fab-tooltip"
          className="hidden md:flex items-center gap-2 absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-[#0D1017] border border-[#2B354C] text-[#F7F3E8] text-xs font-medium shadow-2xl pointer-events-none whitespace-nowrap"
        >
          <span>Contact Assistant</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E4C765] shadow-[0_0_6px_#C9A227]" />
        </div>
      )}

      {/* Floating Circular Contact Assistant Button (Black & Gold) */}
      <button
        ref={triggerRef}
        type="button"
        id="btn-ophireum-contact-assistant"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open Ophireum Contact Assistant"
        aria-expanded={isOpen}
        aria-describedby={!isOpen ? 'assistant-fab-tooltip' : undefined}
        title="Ophireum Contact Assistant"
        className="group relative flex items-center justify-center w-14 h-14 min-w-[48px] min-h-[48px] rounded-full bg-[#0D1017] text-[#E4C765] border-2 border-[#C9A227]/60 shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_16px_rgba(201,162,39,0.3)] hover:shadow-[0_6px_28px_rgba(201,162,39,0.45)] hover:border-[#E4C765] hover:bg-[#141824] hover:scale-105 active:scale-95 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E4C765] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090B] cursor-pointer"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] transition-transform duration-200" />
        ) : (
          <Headphones className="w-6 h-6 text-[#E4C765] group-hover:scale-110 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] transition-transform duration-200" />
        )}
      </button>
    </div>
  );
};
