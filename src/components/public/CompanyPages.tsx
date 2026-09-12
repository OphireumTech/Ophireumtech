/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Company & Governance Pages
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  Shield,
  Eye,
  Target,
  Compass,
  CheckCircle2,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Building,
  Lock,
  FileCheck
} from 'lucide-react';

interface CompanyPageProps {
  section: 'about' | 'vision-mission' | 'core-values' | 'responsible-tech' | 'contact';
}

export const CompanyPages: React.FC<CompanyPageProps> = ({ section }) => {
  const { settings, createTicket, currentRole, addToast } = useApp();

  // Contact form state
  const [contactCategory, setContactCategory] = useState<any>('General Inquiry');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactSubject || !contactMessage) {
      addToast('Missing Fields', 'Please complete all required fields.', 'warning');
      return;
    }
    createTicket(contactCategory, 'medium', contactSubject, contactMessage);
    setContactSuccess(true);
    setContactSubject('');
    setContactMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* SECTION: ABOUT OPHIREUM */}
      {section === 'about' && (
        <div className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <BrandLogo size="md" showText={false} asLink={false} />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141924] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
                <Building className="w-3.5 h-3.5" />
                <span>Corporate & Engineering Profile</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              About OPHIREUM
            </h1>
            <p className="text-zinc-300 text-base leading-relaxed">
              OPHIREUM Multimedia Production is a technology and software-licensing company delivering Expert Advisor software, secure account-bound licensing, client tools, digital billing, VPS operational support, and technical infrastructure for automated XAUUSD trading on MetaTrader 5.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="p-8 rounded-2xl bg-[#0D1017] border border-[#1E2433] space-y-4">
              <h2 className="text-xl font-display font-bold text-white">Company Overview</h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                OPHIREUM Multimedia Production is positioned as a technology and software-licensing company focused on automated gold-trading workflows for MetaTrader 5. The company combines an Expert Advisor, secure account-bound licensing, digital billing, customer controls, operational reporting, and technical support in one coordinated ecosystem.
              </p>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                The trading logic operates through the customer’s MT5 terminal and broker environment. The OPHIREUM platform manages product access, licence status, billing, MT5 binding, VPS records, support, and authorized operational controls.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#0D1017] border border-[#1E2433] space-y-4">
              <h2 className="text-xl font-display font-bold text-white">Non-Brokerage Status</h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                OPHIREUM is not a broker, does not accept trading deposits, and does not hold customer funds. Customers maintain complete sovereignty over their brokerage accounts. We supply the algorithmic intelligence and the secure licensing platform to govern execution with discipline.
              </p>
              <div className="p-4 rounded-xl bg-[#131722] border border-[#232A3C] text-xs text-[#E4C765] space-y-1">
                <span className="font-semibold block">Primary Operational Tagline</span>
                <span className="text-zinc-200">Discipline in Every Execution.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: VISION AND MISSION */}
      {section === 'vision-mission' && (
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141924] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Strategic Purpose</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Vision & Mission
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#0F131E] to-[#0A0C12] border border-[#23293A] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#161C2A] border border-[#2A344A] flex items-center justify-center text-[#E4C765]">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white">Our Vision</h2>
              <p className="text-zinc-300 text-sm leading-relaxed">
                To become a trusted technology brand for disciplined automated-trading operations, recognized for secure access, clear processes, and responsible product design.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#0F131E] to-[#0A0C12] border border-[#23293A] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#161C2A] border border-[#2A344A] flex items-center justify-center text-[#E4C765]">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white">Our Mission</h2>
              <p className="text-zinc-300 text-sm leading-relaxed">
                To equip traders and professional operators with reliable MT5 tools, structured licensing, and practical controls that support informed, risk-aware execution.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: CORE VALUES */}
      {section === 'core-values' && (
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141924] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Institutional Pillars</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Core Values
            </h1>
            <p className="text-zinc-300 text-base leading-relaxed">
              Our principles determine every architectural decision, security rule, and operational process we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Discipline',
                text: 'Design systems around defined rules, risk parameters, and operational consistency. Reject reckless discretionary deviations.'
              },
              {
                title: 'Security',
                text: 'Protect product access through account binding, licence verification, protected administration, and continuous monitoring.'
              },
              {
                title: 'Innovation',
                text: 'Continuously improve reliability, reporting, configuration, and customer experience through modern FinTech architectures.'
              },
              {
                title: 'Transparency',
                text: 'Clearly communicate product scope, access conditions, technical requirements, limitations, and material risks.'
              },
              {
                title: 'Responsibility',
                text: 'Reject guaranteed-return messaging and encourage independent financial, legal, and tax advice.'
              }
            ].map((val, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2330] space-y-3">
                <div className="text-xs font-mono font-bold text-[#C9A227]">0{idx + 1}</div>
                <h3 className="text-lg font-semibold text-white">{val.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{val.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: RESPONSIBLE TECHNOLOGY */}
      {section === 'responsible-tech' && (
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141924] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Ethical AI & Automation</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Responsible Technology
            </h1>
            <p className="text-zinc-300 text-base leading-relaxed">
              In an industry frequently crowded with deceptive marketing and get-rich-quick claims, OPHIREUM maintains strict ethical boundaries:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-zinc-300">
            <div className="p-8 rounded-2xl bg-[#0D1017] border border-[#1E2433] space-y-4">
              <h3 className="text-base font-bold text-white">What We Reject</h3>
              <ul className="space-y-2.5 text-zinc-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>No guaranteed-profit claims or hypothetical return forecasts.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>No sports cars, luxury lifestyle imagery, or fabricated customer testimonials.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>No high-risk martingale grids or unhedged averaging down.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>No affiliate schemes, referral payouts, or introducing broker commissions.</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-[#0D1017] border border-[#1E2433] space-y-4">
              <h3 className="text-base font-bold text-white">What We Enforce</h3>
              <ul className="space-y-2.5 text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Mandatory hard stop-loss calculation on every ticket.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Strict XAUUSD-only currency & symbol validation.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Real-time administrative emergency pause capabilities.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Independent financial and legal advice recommendations.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: CONTACT */}
      {section === 'contact' && (
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141924] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
              <Mail className="w-3.5 h-3.5" />
              <span>Direct Communication</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Contact Operations Desk
            </h1>
            <p className="text-zinc-300 text-base leading-relaxed">
              Reach our technical engineers, licence compliance desk, or executive management through verified channels.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Direct Contact Cards */}
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2433] space-y-4">
                <h3 className="text-base font-semibold text-white">Official Communications</h3>
                
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-zinc-400">Direct Operations Email</div>
                      <a href={`mailto:${settings.contactEmail}`} className="text-zinc-100 hover:text-[#E4C765] font-medium">
                        {settings.contactEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-zinc-400">WhatsApp Support</div>
                      <a
                        href="https://wa.me/639957151043?text=Hello%20Ophireum%2C%20I%20would%20like%20to%20inquire%20about%20the%20Ophireum%20Expert%20Assistant."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-100 hover:text-[#E4C765] font-medium"
                      >
                        WhatsApp: +63 995 715 1043
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-zinc-400">Operations Mobile</div>
                      <span className="text-zinc-100 font-medium">{settings.mobileContact}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2433] space-y-2 text-xs text-zinc-400">
                <span className="font-semibold text-zinc-200 block">Domain Routing (Ready for Production)</span>
                <p>
                  System email routing is prepared for future domain email addresses:
                </p>
                <div className="pt-2 flex flex-col gap-1 font-mono text-[11px] text-[#E4C765]">
                  <span>• support@ophireum.com</span>
                  <span>• licensing@ophireum.com</span>
                  <span>• legal@ophireum.com</span>
                </div>
              </div>
            </div>

            {/* Support Ticket Submission Form */}
            <div className="p-8 rounded-2xl bg-[#0D1017] border border-[#1E2433] space-y-5">
              <h3 className="text-lg font-bold text-white">Submit a Technical Inquiry</h3>
              {contactSuccess ? (
                <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-emerald-200 text-xs space-y-2">
                  <div className="font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Inquiry Ticket Dispatched
                  </div>
                  <p>
                    Your message has been assigned to a technical support engineer. We will respond via email and in your customer dashboard within 24 hours.
                  </p>
                  <button
                    onClick={() => setContactSuccess(false)}
                    className="mt-2 text-xs font-semibold underline text-white cursor-pointer"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-zinc-400 mb-1">Inquiry Category</label>
                    <select
                      value={contactCategory}
                      onChange={(e) => setContactCategory(e.target.value as any)}
                      className="w-full bg-[#111420] border border-[#232838] rounded-lg p-2.5 text-zinc-100 focus:border-[#C9A227] outline-none"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Licence">Licence & Plans</option>
                      <option value="MT5 Binding">MT5 Account Binding</option>
                      <option value="WebRequest">WebRequest Configuration</option>
                      <option value="VPS">VPS Technical Support</option>
                      <option value="Payment">Payment & Billing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Question regarding Pepperstone WebRequest URL"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full bg-[#111420] border border-[#232838] rounded-lg p-2.5 text-zinc-100 focus:border-[#C9A227] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Detailed Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please provide your MT5 broker, server, and inquiry details..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full bg-[#111420] border border-[#232838] rounded-lg p-2.5 text-zinc-100 focus:border-[#C9A227] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-xs tracking-wide shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Technical Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
