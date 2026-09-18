/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Accessibility Statement
 * Formally documents WCAG 2.1 Level AA commitment, assistive technology adaptations, and feedback channels.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Eye,
  Keyboard,
  Contrast,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Smartphone,
  Sliders
} from 'lucide-react';

export const AccessibilityPage: React.FC = () => {
  const { settings, setCurrentRoute } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171B26] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
          <Eye className="w-3.5 h-3.5" />
          <span>Universal Usability & Inclusion</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Accessibility Statement
        </h1>
        <p className="text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
          OPHIREUM is dedicated to ensuring digital accessibility for people with disabilities. We continually refine user experience and apply relevant accessibility standards.
        </p>
      </div>

      {/* Conformance Status */}
      <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#C9A227]" />
          <span>Conformance Benchmark: WCAG 2.1 Level AA</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers to improve accessibility for individuals with visual, auditory, motor, or cognitive impairments. The OPHIREUM platform is designed to target <strong className="text-white">WCAG 2.1 Level AA</strong> standards across all public, customer dashboard, and technical portals.
        </p>
      </div>

      {/* Concrete Accessibility Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-[#0E1119] border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Contrast className="w-4 h-4 text-[#E4C765]" />
            <span>High Contrast Visual Architecture</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Our black-and-gold color system is strictly calibrated to preserve minimum 4.5:1 contrast ratios for standard text and 3:1 for large display elements against dark canvas backgrounds, preventing eye fatigue during prolonged market monitoring.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#0E1119] border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Keyboard className="w-4 h-4 text-[#E4C765]" />
            <span>Full Keyboard Navigability</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            All interactive navigation triggers, dropdown menus, modals, and customer portal buttons support standard keyboard control (<code className="text-[#E4C765]">Tab</code>, <code className="text-[#E4C765]">Enter</code>, <code className="text-[#E4C765]">Space</code>, and <code className="text-[#E4C765]">Esc</code>) with visible outline rings.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#0E1119] border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Sliders className="w-4 h-4 text-[#E4C765]" />
            <span>Fluid Typography & Zooming</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The platform is structured using scalable typographic tokens that gracefully expand up to 200% zoom without truncation, broken layouts, or lost functionality.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#0E1119] border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Smartphone className="w-4 h-4 text-[#E4C765]" />
            <span>Adaptive Responsive Touch Targets</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Interactive buttons and touch targets meet or exceed 44x44 CSS pixels on touch devices, accompanied by semantic ARIA attributes and structured form labels for assistive screen readers.
          </p>
        </div>
      </div>

      {/* Feedback & Remediation Contact */}
      <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-3 text-xs sm:text-sm text-zinc-300">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#C9A227]" />
          <span>Accessibility Feedback & Technical Assistance</span>
        </h2>
        <p className="text-zinc-400 leading-relaxed">
          We welcome your feedback on the accessibility of the OPHIREUM website. If you encounter accessibility barriers or require documentation in an alternative format, please reach our technical coordination team:
        </p>
        <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-1 font-mono text-xs">
          <div>Email: <a href={`mailto:${settings.contactEmail}`} className="text-[#E4C765] hover:underline">{settings.contactEmail}</a></div>
          <div>Subject Line: "Accessibility Inquiry / Remediation Request"</div>
          <div>Direct Operations Phone: {settings.mobileContact}</div>
        </div>
        <div className="pt-2">
          <button
            onClick={() => setCurrentRoute('contact')}
            className="px-5 py-2 rounded-xl bg-[#161B27] hover:bg-[#202738] border border-[#2D364A] text-xs font-semibold text-zinc-200 transition-all cursor-pointer"
          >
            Submit Accessibility Request via Contact Desk →
          </button>
        </div>
      </div>
    </div>
  );
};
