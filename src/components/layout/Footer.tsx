/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Official Institutional Footer & Statutory Disclosures
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  Shield,
  Mail,
  Phone,
  MessageSquare,
  AlertTriangle,
  Lock,
  ExternalLink,
  Cpu,
  FileCheck
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentRoute, settings } = useApp();

  const handleNav = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050608] border-t border-[#1F232E] text-[#9CA3AF] text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Division */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <BrandLogo size="md" to="/home" onClick={() => handleNav('home')} />
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              OPHIREUM Multimedia Production is a technology and software-licensing company delivering Expert Advisor software, secure account-bound licensing, VPS operational readiness, and technical infrastructure designed exclusively for automated XAUUSD/gold trading on MetaTrader 5.
            </p>

            <div className="space-y-1.5 pt-2 text-[11px] text-zinc-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Operational Inquiries: <a href={`mailto:${settings.contactEmail}`} className="text-zinc-200 hover:text-[#E4C765] underline">{settings.contactEmail}</a></span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>WhatsApp / Tel Desk: <a href="https://wa.me/639957151043" target="_blank" rel="noreferrer" className="text-zinc-200 hover:text-[#E4C765]">{settings.supportWhatsApp}</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Direct Operations Mobile: <span className="text-zinc-200">{settings.mobileContact}</span></span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-[10px] text-zinc-500">
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">support@ophireum.com</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">licensing@ophireum.com</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">legal@ophireum.com</span>
            </div>
          </div>

          {/* Product & Solutions */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Technology</div>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('product-ea')} className="hover:text-[#E4C765] transition-colors">
                  OPHIREUM Expert Assistant
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('mt5-integration')} className="hover:text-[#E4C765] transition-colors">
                  MetaTrader 5 Integration
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('licensing-info')} className="hover:text-[#E4C765] transition-colors">
                  Account-Bound Licensing
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('vps-ops')} className="hover:text-[#E4C765] transition-colors">
                  VPS Infrastructure
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('risk-controls')} className="hover:text-[#E4C765] transition-colors">
                  Risk & Operational Controls
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('pricing')} className="hover:text-[#E4C765] transition-colors">
                  Licence Packages & Plans
                </button>
              </li>
            </ul>
          </div>

          {/* Documentation & Support */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Resources</div>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('help-center')} className="hover:text-[#E4C765] transition-colors">
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('install-guide')} className="hover:text-[#E4C765] transition-colors">
                  Installation Guide
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('mt5-setup')} className="hover:text-[#E4C765] transition-colors">
                  WebRequest Configuration
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('vps-ops')} className="hover:text-[#E4C765] transition-colors">
                  VPS Setup Standards
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-[#E4C765] transition-colors">
                  Submit a Support Ticket
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('ea-simulator')} className="hover:text-[#E4C765] transition-colors text-[#E4C765] flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> EA Validation Test Bench
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Center Links */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Legal Center</div>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('legal-terms')} className="hover:text-[#E4C765] transition-colors">
                  Terms of Use
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('legal-sla')} className="hover:text-[#E4C765] transition-colors">
                  Software Licence Agreement
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('legal-risk')} className="hover:text-[#E4C765] transition-colors text-[#E4C765]">
                  Trading Risk Disclosure
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('legal-privacy')} className="hover:text-[#E4C765] transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('legal-refunds')} className="hover:text-[#E4C765] transition-colors">
                  Refund & Cancellation Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('legal-acceptable-use')} className="hover:text-[#E4C765] transition-colors">
                  Acceptable Use Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Risk Notice Box */}
        <div className="bg-[#0C0E14] border border-[#232733] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E4C765]">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>CRITICAL RISK AND OPERATIONAL NOTICE</span>
          </div>
          <p className="text-zinc-300 text-xs leading-relaxed">
            No responsible trading system can guarantee profits. Automated tools execute programmed rules and may generate losses, including the loss of some or all trading capital. Market gaps, volatility, spread expansion, latency, slippage, broker execution, incorrect configuration, and connectivity failures can materially affect outcomes.
          </p>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            OPHIREUM Multimedia Production provides software, digital licensing, technical support, and related operational technology. OPHIREUM is not a broker and does not accept customer trading deposits or process withdrawals from brokerage accounts. Unless separately licensed and expressly disclosed for a particular jurisdiction, OPHIREUM does not provide personalized investment advice, discretionary portfolio management, brokerage, custody, or guaranteed investment returns. Leveraged trading involves substantial risk and may result in the loss of some or all trading capital. Past performance and hypothetical results do not guarantee future performance.
          </p>
        </div>

        {/* Bottom Metadata & Copyright */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} OPHIREUM Multimedia Production. All Rights Reserved. Built for execution—not hype.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-zinc-400">
              <Lock className="w-3 h-3 text-[#C9A227]" />
              Cryptographically Bound MT5 Architecture
            </span>
            <span>•</span>
            <span className="text-zinc-500">XAUUSD Specialized Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
