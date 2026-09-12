/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Homepage
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Cpu,
  Terminal,
  Lock,
  Server,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  Activity,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Layers,
  HelpCircle,
  BarChart3,
  RefreshCw,
  Award
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setCurrentRoute, plans, settings, currentRole, createOrder } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is OPHIREUM a broker or investment fund?',
      a: 'No. OPHIREUM Multimedia Production is strictly a software and technology-licensing enterprise. OPHIREUM is not a broker, does not accept customer trading deposits, does not hold trading capital, and does not process broker withdrawals. Your funds remain exclusively in your own independent MetaTrader 5 broker account.'
    },
    {
      q: 'Why is the OPHIREUM Expert Assistant restricted to XAUUSD / Gold only?',
      a: 'Algorithmic efficiency requires deep mathematical calibration. The OPHIREUM Expert Assistant is engineered specifically for gold liquidity dynamics, spread structures, and volatility profiles during London and New York overlaps. It strictly rejects non-gold instruments.'
    },
    {
      q: 'What is Account-Bound Licensing and how does it safeguard my software?',
      a: 'Each licence is cryptographically bound to one authorized MT5 account number and broker server. When the EA launches in MT5, it signs an outbound WebRequest to the OPHIREUM authorization API containing a unique nonce, timestamp, and account parameters. If an unapproved account attempts execution, authorization is denied immediately.'
    },
    {
      q: 'What do the "Signals" metrics in each plan indicate?',
      a: 'Signals refer to concurrent algorithmic strategy confluence filters executed on real-time XAUUSD tick data. Higher tiers incorporate a broader matrix of signal parameters—ranging from 2 baseline filters in the Trial Kit to 25 confluence engines in the Institutional Kit.'
    },
    {
      q: 'Can I migrate my licence if I change broker accounts?',
      a: 'Yes. Customers may submit an Unbinding Request via the customer portal stating the technical justification and new MT5 account details. Our licence administration team reviews and approves legitimate migrations, preserving complete audit trails.'
    },
    {
      q: 'Can I downgrade a licence plan after purchase?',
      a: 'In accordance with our software licensing policies, packages may be upgraded to higher tiers with extended validity and greater signal capacity, but cannot be downgraded.'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        {/* Subtle radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#C9A227]/10 to-transparent blur-3xl pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#141822] border border-[#C9A227]/35 text-[#E4C765] text-xs font-medium shadow-md">
            <img
              src="/images/ophireum-logo.png"
              alt="Ophireum"
              className="w-4 h-4 object-contain flex-shrink-0"
              style={{ filter: 'drop-shadow(0 0 1px rgba(255, 232, 160, 0.65))' }}
            />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>OPHIREUM Multimedia Production • Automated Gold Infrastructure</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Disciplined Gold Trading Automation for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E4C765] via-[#C9A227] to-[#F7F3E8]">MetaTrader 5</span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Deploy the OPHIREUM Expert Assistant through a secure, account-bound licence designed exclusively for XAUUSD. Manage your licence, MT5 account, payments, VPS readiness, operational controls, and support from one structured platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              id="hero-btn-plans"
              onClick={() => {
                const el = document.getElementById('plans-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-sm tracking-wide shadow-lg shadow-[#C9A227]/25 hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>View Licence Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-btn-how-it-works"
              onClick={() => setCurrentRoute('how-it-works')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#111318] hover:bg-[#1A1E29] border border-[#2A3040] text-zinc-200 hover:text-white font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>See How It Works</span>
            </button>
          </div>

          {/* Trust Labels */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-zinc-400">
            {['XAUUSD Only', 'MetaTrader 5', 'Account-Bound Licensing', 'Risk-Oriented Controls', 'Secure Customer Dashboard'].map((label, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F1219]/80 border border-[#1F2533]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="font-medium text-zinc-300">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Is OPHIREUM Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D1017] border border-[#1E2330] rounded-2xl p-8 sm:p-12 space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
              Company Positioning
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              What Is OPHIREUM?
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              OPHIREUM Multimedia Production is positioned as a technology and software-licensing company focused on automated gold-trading workflows for MetaTrader 5. The company combines an Expert Advisor, secure account-bound licensing, digital billing, customer controls, operational reporting, and technical support in one coordinated ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800/80 text-xs sm:text-sm">
            <div className="p-5 rounded-xl bg-[#111520] border border-zinc-800 space-y-2">
              <div className="font-semibold text-zinc-100 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#E4C765]" />
                Customer Broker Environment
              </div>
              <p className="text-zinc-400 leading-relaxed text-xs">
                The actual Expert Advisor runs directly inside the customer’s MT5 terminal and broker account. Trading capital, broker credentials, deposit balances, and withdrawals remain entirely with the user’s designated regulated brokerage.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#111520] border border-zinc-800 space-y-2">
              <div className="font-semibold text-zinc-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#E4C765]" />
                OPHIREUM Platform Management
              </div>
              <p className="text-zinc-400 leading-relaxed text-xs">
                The OPHIREUM platform coordinates software authorization, cryptographic account binding, digital billing, telemetry monitoring, WebRequest delivery, VPS support, and authorized emergency operational controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Value Proposition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
          Value Proposition
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white max-w-3xl mx-auto">
          Technology for Controlled Market Execution
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          A professionally managed technology stack that helps users deploy, control, and review automated XAUUSD strategies with clear access rules, practical safeguards, secure licensing, and structured technical support.
        </p>
      </section>

      {/* Main Product Capabilities (9 Features) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
            Capabilities Overview
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Engineered for Precision, Security, and Control
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: '1. XAUUSD Expert Advisor',
              desc: 'Automated order execution exclusively for gold using configured entry rules, protective stop-loss triggers, position-management logic, and session timing.',
              icon: Cpu
            },
            {
              title: '2. Secure Licence Binding',
              desc: 'A controlled cryptographic licence linked to an authorized MT5 account number, with protected unbinding and migration procedures.',
              icon: Lock
            },
            {
              title: '3. Customer Dashboard',
              desc: 'A centralized operational interface for monitoring licence validity, MT5 bindings, payments, invoices, EA downloads, VPS readiness, and support tickets.',
              icon: Layers
            },
            {
              title: '4. Digital Payment Processing',
              desc: 'Purchase, renew, or upgrade licences through supported USDT-TRC20, USDT-ERC20, card, and institutional bank transfer workflows with audit verification.',
              icon: BarChart3
            },
            {
              title: '5. Risk and Condition Controls',
              desc: 'Support for permitted lot settings (0.0100 baseline), exposure limits, mandatory stop-loss, spread threshold safeguards, and session overlap filters.',
              icon: Sliders
            },
            {
              title: '6. VPS Operations',
              desc: 'Continuous MT5 execution through low-latency Windows Server Datacenter environments located adjacent to major liquidity providers.',
              icon: Server
            },
            {
              title: '7. Activity & Exception Reporting',
              desc: 'Record real-time licence validations, telemetry heartbeats, EA version status, latency logs, and operational exceptions without storing broker credentials.',
              icon: Activity
            },
            {
              title: '8. Remote Automation Controls',
              desc: 'Empowers authorized administrators to pause or resume automation during abnormal market gaps, extreme spreads, or security incidents.',
              icon: Zap
            },
            {
              title: '9. Technical Support Desk',
              desc: 'Structured technical assistance for terminal installation, WebRequest URL configuration, VPS deployment, version updates, and MT5 binding diagnostics.',
              icon: HelpCircle
            }
          ].map((feat, idx) => (
            <div
              key={idx}
              className="bg-[#0E1118] border border-[#1E2330] rounded-xl p-6 space-y-3 hover:border-[#C9A227]/40 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#141824] border border-[#262C3D] flex items-center justify-center text-[#E4C765] group-hover:scale-105 transition-transform">
                <feat.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-100">{feat.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How the Platform Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
            Structured Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            How the Platform Works
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
            From initial registration and risk disclosure acceptance to automated WebRequest validation inside MetaTrader 5.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Register & Disclosures', desc: 'Verify email and formally accept Terms of Use, Software Licence Agreement, and Trading Risk Disclosures.' },
            { step: '02', title: 'Select Licence', desc: 'Select an eligible plan (Starter, Professional, Premium, or Institutional) and complete digital payment.' },
            { step: '03', title: 'Atomic Activation', desc: 'Upon verification, your unique licence is generated and ready for MT5 account binding in the dashboard.' },
            { step: '04', title: 'Bind MT5 & VPS', desc: 'Bind your MT5 login number, download the approved EA, configure WebRequest URL, and deploy on VPS.' },
            { step: '05', title: 'Controlled Execution', desc: 'The EA validates against the OPHIREUM API, transacting XAUUSD under strict protective stop-loss rules.' }
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-[#0D1017] border border-[#1F2433] space-y-2 relative">
              <div className="text-xs font-mono font-bold text-[#C9A227]">{item.step}</div>
              <div className="text-sm font-semibold text-zinc-100">{item.title}</div>
              <div className="text-xs text-zinc-400 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Licence Packages (4 Plans + VPS) */}
      <section id="plans-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
            Transparent Software Licensing
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Licence Packages & Term Pricing
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl mx-auto">
            Direct software licences bound to your designated MT5 terminal. No performance fees, no profit shares, and no broker commissions.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all border ${
                plan.slug === 'premium'
                  ? 'bg-[#10141F] border-[#C9A227] shadow-xl shadow-[#C9A227]/10 relative'
                  : 'bg-[#0E1118] border-[#1E2330] hover:border-zinc-700'
              }`}
            >
              {plan.slug === 'premium' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-[10px] uppercase tracking-wider">
                  Recommended Institutional Term
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white">{plan.name}</h3>
                  <div className="text-xs text-zinc-400 mt-1">{plan.validityDays} Days Validity</div>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-display font-bold text-[#F7F3E8]">
                    {plan.priceUSDT.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-[#E4C765]">USDT</span>
                </div>

                <p className="text-xs text-zinc-400 min-h-[36px]">{plan.description}</p>

                {/* Technical Metric Specs */}
                <div className="p-3 rounded-lg bg-[#141824] border border-[#212738] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Risk Setting:</span>
                    <span className="font-semibold text-zinc-200">{plan.riskSettingPct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Lot Constraint:</span>
                    <span className="font-mono text-zinc-200">{plan.lotSetting.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Signals Filter:</span>
                    <span className="font-semibold text-[#E4C765]">{plan.signalsCount} Signals</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-zinc-800">
                    <span className="text-zinc-400 text-[11px]">Suggested Equity:</span>
                    <span className="text-zinc-300 font-medium text-[11px]">{plan.suggestedEquityUSD}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2 text-xs text-zinc-300 pt-2">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227] shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight text-zinc-300">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  if (currentRole === 'visitor') {
                    setCurrentRoute('login');
                  } else {
                    const res = createOrder(plan.id, 'USDT-TRC20');
                    if (res.success) {
                      setCurrentRoute('wallet-payments');
                    }
                  }
                }}
                className={`w-full py-3 rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer ${
                  plan.slug === 'premium'
                    ? 'bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] shadow-md shadow-[#C9A227]/20 hover:brightness-110'
                    : 'bg-[#181C26] hover:bg-[#202534] border border-[#2D3446] text-zinc-100'
                }`}
              >
                {plan.isTrial ? 'Acquire Starter Trial (199 USDT)' : `Select ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* VPS Add-on Box */}
        <div className="bg-[#0C0E14] border border-[#232838] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#E4C765]">
              <Server className="w-4 h-4 text-[#C9A227]" />
              <span>Dedicated Low-Latency MT5 VPS Infrastructure</span>
            </div>
            <p className="text-xs text-zinc-300">
              Co-located Equinix hosting with pre-configured MT5 terminal and granted WebRequest permissions. Sub-2ms execution latency to major gold liquidity providers.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="text-lg font-display font-bold text-white">{settings.vpsAnnualPriceUSDT} USDT</div>
              <div className="text-[10px] text-zinc-400">per account / year</div>
            </div>
            <button
              onClick={() => setCurrentRoute('vps-ops')}
              className="px-4 py-2 rounded-lg bg-[#181D2A] hover:bg-[#22283A] border border-[#30384C] text-xs font-semibold text-zinc-200"
            >
              Explore VPS Specs
            </button>
          </div>
        </div>

        {/* Technical Guidance & Risk Language */}
        <div className="p-4 rounded-xl bg-[#090B10] border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1 text-center max-w-4xl mx-auto">
          <p>
            <span className="text-zinc-200 font-semibold">Technical Parameter Note:</span> Suggested equity ranges represent technical guidance for baseline risk configuration and do not constitute a profit forecast. Risk percentages do not limit or guarantee maximum drawdown during abnormal market volatility. Signals refer to algorithmic strategy confluence filters executed on tick data.
          </p>
        </div>
      </section>

      {/* Security & Risk Philosophy Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0F131E] to-[#0A0C12] border border-[#222838] rounded-2xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1F2D] text-[#E4C765] text-xs font-medium border border-[#C9A227]/30">
              <Shield className="w-3.5 h-3.5" />
              <span>Risk Management Philosophy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Discipline in Every Execution
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
              Every position evaluated by the OPHIREUM Expert Assistant is bounded by strict protective controls:
            </p>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong className="text-white">Mandatory Stop-Loss:</strong> Hard stop-loss orders are calculated prior to ticket dispatch. No trade without a protective stop.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong className="text-white">Spread Threshold Filters:</strong> Order placement pauses automatically if broker spread widens past acceptable limits.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong className="text-white">XAUUSD Symbol Enforcement:</strong> Rejects any currency or index ticket to preserve strategy mathematical validity.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong className="text-white">Emergency Stop Control:</strong> Real-time remote pause capabilities in case of catastrophic global market dislocation.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#090A0F] border border-[#1C2130] rounded-xl p-6 font-mono text-xs text-zinc-300 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 border-b border-zinc-800 pb-2">
              <span>MT5 WebRequest Handshake Telemetry</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ACTIVE
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">
              POST /api/v1/ea/validate<br />
              <span className="text-[#E4C765]">Host:</span> api.ophireum.com<br />
              <span className="text-[#E4C765]">Licence:</span> OPH-8924-4102-XAU<br />
              <span className="text-[#E4C765]">Symbol:</span> XAUUSD<br />
              <span className="text-[#E4C765]">MT5 Account:</span> 7729014 (IC Markets SC)<br />
              <span className="text-[#E4C765]">Nonce Replay Check:</span> PASSED [Unique]<br />
              <span className="text-[#E4C765]">Timestamp Window:</span> +1.2s [Tolerance ±300s]<br />
              <span className="text-[#E4C765]">Cryptographic Sig:</span> VERIFIED
            </div>
            <div className="pt-2 border-t border-zinc-800 text-[11px] text-emerald-400 font-semibold">
              AUTHORIZATION GRANTED • Policy: maxLot=0.0100, SL=MANDATORY
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
            Clarifications & Governance
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-[#0D1017] border border-[#1E2330] overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between text-xs sm:text-sm font-semibold text-zinc-100 hover:text-[#E4C765] transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#C9A227] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-b from-[#121624] to-[#0A0D14] border border-[#262E42] rounded-3xl p-8 sm:p-14 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-white">
            Deploy with Institutional Discipline
          </h2>
          <p className="text-zinc-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Gain secure, account-bound access to the OPHIREUM Expert Assistant. Built for execution—not hype.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setCurrentRoute(currentRole === 'visitor' ? 'register' : 'dashboard')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-sm shadow-xl shadow-[#C9A227]/25 hover:brightness-110 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{currentRole === 'visitor' ? 'Create Customer Account' : 'Access Customer Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentRoute('contact')}
              className="px-8 py-3.5 rounded-xl bg-[#141824] hover:bg-[#1C2233] border border-[#2B3448] text-zinc-200 text-sm font-semibold transition-all cursor-pointer"
            >
              Technical Inquiries
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
