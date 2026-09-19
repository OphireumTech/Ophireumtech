/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Public Website Layout
 * Section 1: Renders public Header with public navigation links (Features,
 * Technology, Pricing, Docs, Login, Get Started), page content, public Footer,
 * and ContactAssistant. Exclusively for public marketing & statutory pages.
 */

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ContactAssistant } from '../common/ContactAssistant';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#08090B] text-zinc-100 selection:bg-[#C9A227] selection:text-black font-sans">
      {/* Public Institutional Header with public navigation */}
      <Header />

      {/* Main Public Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Public Institutional Footer */}
      <Footer />

      {/* Public Pre-sale & General Inquiry Assistant */}
      <ContactAssistant />
    </div>
  );
};
