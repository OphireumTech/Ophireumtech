/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Floating WhatsApp Action Button & Message Panel
 * Provides a dedicated, accessible, brand-aligned WhatsApp contact trigger and
 * interactive message preview panel for public visitors.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { X, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';

const WHATSAPP_PHONE_DISPLAY = '+63 995 715 1043';
const WHATSAPP_PHONE_INTL = '639957151043';
const DEFAULT_MESSAGE =
  'Hello Ophireum, I would like to inquire about the Ophireum Expert Assistant.';

export const FloatingWhatsAppButton: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [isOpenedState, setIsOpenedState] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Restrict strictly to public pages - hide inside authenticated client, staff, or administrative portals
  const isProtectedDashboard =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/support-dashboard') ||
    location.pathname.startsWith('/finance-dashboard') ||
    location.pathname.startsWith('/license-dashboard') ||
    location.pathname.startsWith('/ea-simulator');

  // Close panel on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus textarea when panel opens if not in confirmation state
  useEffect(() => {
    if (isOpen && !isOpenedState) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isOpenedState]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (isProtectedDashboard) {
    return null;
  }

  const encodedMessage = encodeURIComponent(message.trim() || DEFAULT_MESSAGE);
  const targetWhatsAppUrl = `https://wa.me/${WHATSAPP_PHONE_INTL}?text=${encodedMessage}`;

  const handleContinueClick = () => {
    setIsOpenedState(true);
  };

  const handleResetForm = () => {
    setIsOpenedState(false);
    setMessage(DEFAULT_MESSAGE);
  };

  return (
    <div
      className="fixed z-40 select-none"
      style={{
        right: 'max(24px, env(safe-area-inset-right, 24px))',
        bottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
      }}
    >
      {/* WhatsApp Message Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-labelledby="whatsapp-dialog-title"
          aria-describedby="whatsapp-dialog-desc"
          className="absolute bottom-16 sm:bottom-20 right-0 w-[calc(100vw-32px)] max-w-[370px] sm:w-[380px] max-h-[calc(100vh-120px)] flex flex-col rounded-2xl bg-[#0D1017] border border-[#C9A227]/40 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(201,162,39,0.15)] overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 z-50 text-left"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0d3f2e] via-[#128C7E] to-[#25D366] p-4 text-white flex items-center justify-between border-b border-[#25D366]/30 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/15 border border-white/30 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-white fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.301-.779.98-.955 1.18-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.675-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.634-.929-2.239-.245-.589-.494-.509-.678-.519l-.578-.01c-.2 0-.527.075-.803.376s-1.055 1.03-1.055 2.511 1.08 2.912 1.231 3.113c.151.2 2.126 3.246 5.151 4.552.72.31 1.282.496 1.72.635.723.23 1.381.197 1.902.12.58-.087 1.78-.727 2.031-1.431.251-.703.251-1.306.176-1.431-.076-.126-.277-.201-.578-.352zM12.042 21.666h-.002c-1.688 0-3.344-.454-4.793-1.314l-.344-.204-3.564.935.951-3.475-.224-.356A9.624 9.624 0 012.4 12.046C2.4 6.726 6.726 2.4 12.047 2.4c2.58 0 5.006 1.006 6.83 2.831 1.826 1.826 2.83 4.253 2.83 6.833 0 5.322-4.329 9.602-9.665 9.602zM12.047 0C5.404 0 0 5.405 0 12.049c0 2.12.552 4.19 1.603 6.012L0 24l6.136-1.609A12.007 12.007 0 0012.047 24C18.69 24 24 18.595 24 11.951 24 5.308 18.59 0 12.047 0z" />
                </svg>
              </div>
              <div>
                <h3
                  id="whatsapp-dialog-title"
                  className="font-bold text-sm text-white tracking-wide leading-tight"
                >
                  Contact Ophireum
                </h3>
                <p
                  id="whatsapp-dialog-desc"
                  className="text-xs text-emerald-100/90 leading-tight mt-0.5"
                >
                  Send us a message through WhatsApp.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close message panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-3.5 overflow-y-auto flex-1">
            {/* Contact Details Line */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#141822] border border-[#2B354C]/80 text-xs">
              <span className="text-zinc-400 font-medium">WhatsApp Contact:</span>
              <span className="font-mono text-[#E4C765] font-semibold">
                {WHATSAPP_PHONE_DISPLAY}
              </span>
            </div>

            {!isOpenedState ? (
              <>
                {/* Multiline Message Field */}
                <div>
                  <label
                    htmlFor="whatsapp-message-input"
                    className="block text-xs font-medium text-zinc-300 mb-1.5"
                  >
                    Your Message:
                  </label>
                  <textarea
                    id="whatsapp-message-input"
                    ref={textareaRef}
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full bg-[#08090B] border border-[#2B354C] rounded-xl p-3 text-sm text-[#F7F3E8] placeholder-zinc-500 focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] resize-none transition-colors"
                  />
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-1 px-0.5">
                    <span>Direct encrypted WhatsApp chat</span>
                    <span>{message.length} chars</span>
                  </div>
                </div>

                {/* Continue to WhatsApp Action Button */}
                <a
                  href={targetWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleContinueClick}
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#07090D] font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(37,211,102,0.35)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.45)] border border-[#25D366] hover:border-[#E4C765] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E4C765] cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 fill-current shrink-0"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.301-.779.98-.955 1.18-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.675-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.634-.929-2.239-.245-.589-.494-.509-.678-.519l-.578-.01c-.2 0-.527.075-.803.376s-1.055 1.03-1.055 2.511 1.08 2.912 1.231 3.113c.151.2 2.126 3.246 5.151 4.552.72.31 1.282.496 1.72.635.723.23 1.381.197 1.902.12.58-.087 1.78-.727 2.031-1.431.251-.703.251-1.306.176-1.431-.076-.126-.277-.201-.578-.352zM12.042 21.666h-.002c-1.688 0-3.344-.454-4.793-1.314l-.344-.204-3.564.935.951-3.475-.224-.356A9.624 9.624 0 012.4 12.046C2.4 6.726 6.726 2.4 12.047 2.4c2.58 0 5.006 1.006 6.83 2.831 1.826 1.826 2.83 4.253 2.83 6.833 0 5.322-4.329 9.602-9.665 9.602zM12.047 0C5.404 0 0 5.405 0 12.049c0 2.12.552 4.19 1.603 6.012L0 24l6.136-1.609A12.007 12.007 0 0012.047 24C18.69 24 24 18.595 24 11.951 24 5.308 18.59 0 12.047 0z" />
                  </svg>
                  <span>Continue to WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
                </a>
              </>
            ) : (
              /* Confirmation Screen within Website Panel */
              <div className="py-2 space-y-3.5 text-center">
                {/* Wording specifically noting WhatsApp opened without false delivery claim */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp opened</span>
                </div>

                <div className="bg-[#141822] border border-[#2B354C] rounded-xl p-4 text-center space-y-2">
                  <p className="text-sm font-semibold text-white">
                    Thank you. We will get back to you as soon as possible.
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Your inquiry has been transferred to WhatsApp with your prefilled message.
                    Please press send in your WhatsApp window to deliver it to our desk.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={targetWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Reopen Chat</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#141822] hover:bg-[#1c2230] border border-[#2B354C] text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>New Message</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Accessible Desktop Tooltip (Shown when panel is closed) */}
      {!isOpen && (
        <div
          role="tooltip"
          id="whatsapp-fab-tooltip"
          className="hidden md:flex items-center gap-2 absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-xl bg-[#0D1017] border border-[#2B354C] text-[#F7F3E8] text-xs font-medium shadow-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap"
        >
          <span>Chat with us on WhatsApp</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] shadow-[0_0_6px_#25D366]" />
        </div>
      )}

      {/* Floating Circular WhatsApp Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Contact Ophireum through WhatsApp"
        aria-expanded={isOpen}
        aria-describedby={!isOpen ? 'whatsapp-fab-tooltip' : undefined}
        title="Chat with us on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 min-w-[48px] min-h-[48px] rounded-full bg-[#25D366] text-white border border-[#C9A227]/40 shadow-[0_4px_16px_rgba(0,0,0,0.5),0_0_12px_rgba(201,162,39,0.25)] hover:shadow-[0_6px_24px_rgba(37,211,102,0.45),0_0_16px_rgba(228,199,101,0.45)] hover:border-[#E4C765] hover:scale-105 active:scale-95 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E4C765] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090B] cursor-pointer"
      >
        {/* Official WhatsApp Vector Icon (or Close icon when panel is open) */}
        {isOpen ? (
          <X className="w-6 h-6 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)] transition-transform duration-200" />
        ) : (
          <svg
            className="w-7 h-7 text-white fill-current shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)] transition-transform duration-200"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.301-.779.98-.955 1.18-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.675-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.634-.929-2.239-.245-.589-.494-.509-.678-.519l-.578-.01c-.2 0-.527.075-.803.376s-1.055 1.03-1.055 2.511 1.08 2.912 1.231 3.113c.151.2 2.126 3.246 5.151 4.552.72.31 1.282.496 1.72.635.723.23 1.381.197 1.902.12.58-.087 1.78-.727 2.031-1.431.251-.703.251-1.306.176-1.431-.076-.126-.277-.201-.578-.352zM12.042 21.666h-.002c-1.688 0-3.344-.454-4.793-1.314l-.344-.204-3.564.935.951-3.475-.224-.356A9.624 9.624 0 012.4 12.046C2.4 6.726 6.726 2.4 12.047 2.4c2.58 0 5.006 1.006 6.83 2.831 1.826 1.826 2.83 4.253 2.83 6.833 0 5.322-4.329 9.602-9.665 9.602zM12.047 0C5.404 0 0 5.405 0 12.049c0 2.12.552 4.19 1.603 6.012L0 24l6.136-1.609A12.007 12.007 0 0012.047 24C18.69 24 24 18.595 24 11.951 24 5.308 18.59 0 12.047 0z" />
          </svg>
        )}
      </button>
    </div>
  );
};
