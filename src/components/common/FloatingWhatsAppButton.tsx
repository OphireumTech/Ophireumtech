/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Floating WhatsApp Action Button
 * Provides a dedicated, accessible, brand-aligned WhatsApp contact trigger on public pages.
 */

import React from 'react';
import { useLocation } from 'react-router-dom';

const WHATSAPP_URL =
  'https://wa.me/639957151043?text=Hello%20Ophireum%2C%20I%20would%20like%20to%20inquire%20about%20the%20Ophireum%20Expert%20Assistant.';

export const FloatingWhatsAppButton: React.FC = () => {
  const location = useLocation();

  // Restrict to public pages only - hide inside protected client, staff, or administrative portals
  const isProtectedDashboard =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/support-dashboard') ||
    location.pathname.startsWith('/finance-dashboard') ||
    location.pathname.startsWith('/license-dashboard') ||
    location.pathname.startsWith('/ea-simulator');

  if (isProtectedDashboard) {
    return null;
  }

  return (
    <div
      className="fixed z-40 group select-none"
      style={{
        right: 'max(24px, env(safe-area-inset-right, 24px))',
        bottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
      }}
    >
      {/* Accessible Desktop Tooltip */}
      <div
        role="tooltip"
        id="whatsapp-fab-tooltip"
        className="hidden md:flex items-center gap-2 absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-xl bg-[#0D1017] border border-[#2B354C] text-[#F7F3E8] text-xs font-medium shadow-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap"
      >
        <span>Chat with us on WhatsApp</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] shadow-[0_0_6px_#25D366]" />
      </div>

      {/* Floating Circular WhatsApp Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Ophireum through WhatsApp"
        aria-describedby="whatsapp-fab-tooltip"
        title="Chat with us on WhatsApp"
        className="flex items-center justify-center w-14 h-14 min-w-[48px] min-h-[48px] rounded-full bg-[#25D366] text-white border border-[#C9A227]/40 shadow-[0_4px_16px_rgba(0,0,0,0.5),0_0_12px_rgba(201,162,39,0.25)] hover:shadow-[0_6px_24px_rgba(37,211,102,0.45),0_0_16px_rgba(228,199,101,0.45)] hover:border-[#E4C765] hover:scale-105 active:scale-95 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E4C765] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090B] cursor-pointer"
      >
        {/* Official WhatsApp Vector Icon */}
        <svg
          className="w-7 h-7 text-white fill-current shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.301-.779.98-.955 1.18-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.675-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.634-.929-2.239-.245-.589-.494-.509-.678-.519l-.578-.01c-.2 0-.527.075-.803.376s-1.055 1.03-1.055 2.511 1.08 2.912 1.231 3.113c.151.2 2.126 3.246 5.151 4.552.72.31 1.282.496 1.72.635.723.23 1.381.197 1.902.12.58-.087 1.78-.727 2.031-1.431.251-.703.251-1.306.176-1.431-.076-.126-.277-.201-.578-.352zM12.042 21.666h-.002c-1.688 0-3.344-.454-4.793-1.314l-.344-.204-3.564.935.951-3.475-.224-.356A9.624 9.624 0 012.4 12.046C2.4 6.726 6.726 2.4 12.047 2.4c2.58 0 5.006 1.006 6.83 2.831 1.826 1.826 2.83 4.253 2.83 6.833 0 5.322-4.329 9.602-9.665 9.602zM12.047 0C5.404 0 0 5.405 0 12.049c0 2.12.552 4.19 1.603 6.012L0 24l6.136-1.609A12.007 12.007 0 0012.047 24C18.69 24 24 18.595 24 11.951 24 5.308 18.59 0 12.047 0z" />
        </svg>
      </a>
    </div>
  );
};
