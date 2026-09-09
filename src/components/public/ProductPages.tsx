/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Product Architecture Pages
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  Terminal,
  Lock,
  Server,
  Sliders,
  Shield,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Activity,
  Layers,
  Zap,
  Globe,
  Database
} from 'lucide-react';

interface ProductPageProps {
  section: 
    | 'product-ea'
    | 'mt5-integration'
    | 'licensing-info'
    | 'vps-ops'
    | 'risk-controls'
    | 'security'
    | 'how-it-works';
}

export const ProductPages: React.FC<ProductPageProps> = ({ section }) => {
  const { setCurrentRoute } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* SECTION: OPHIREUM EXPERT ASSISTANT */}
      {section === 'product-ea' && (
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141924] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>Proprietary XAUUSD Algorithmic Core</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              OPHIREUM Expert Assistant
            </h1>
            <p className="text-zinc-300 text-base leading-relaxed">
              The OPHIREUM Expert Assistant is an institutional MetaTrader 5 algorithmic execution engine engineered exclusively for gold (XAUUSD). Designed around non-correlated session dynamics, market liquidity traps, and disciplined protective execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2433] space-y-3">
              <div className="text-[#C9A227] font-semibold text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Session Timing Filter
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Executes orders strictly during the active London and New York overlaps where institutional XAUUSD liquidity minimizes spread expansion and negative slippage.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2433] space-y-3">
              <div className="text-[#C9A227] font-semibold text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Mandatory Hard Stop-Loss
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Positions are mathematically bound by rigid stop-loss points generated prior to broker transmission. Never averages down blindly or employs martingale grids.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2433] space-y-3">
              <div className="text-[#C9A227] font-semibold text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                Fixed Lot Constraint
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Enforces a disciplined 0.0100 baseline lot size, safeguarding account capital against compounding over-exposure during market dislocations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: MT5 INTEGRATION */}
      {section === 'mt5-integration' && (
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141924] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              <span>Native MetaTrader 5 Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              MetaTrader 5 Integration
            </h1>
            <p className="text-zinc-300 text-base leading-relaxed">
              Unlike legacy platforms, MetaTrader 5 supports multi-threaded strategy execution, millisecond-precision tick events, and secure native WebRequest communication with cloud APIs.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0C0F17] border border-[#1E2433] space-y-6">
            <h2 className="text-xl font-display font-bold text-white">
              WebRequest Licensing Pipeline
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-300">
              <div className="space-y-2 p-4 bg-[#111420] rounded-lg border border-zinc-800">
                <div className="font-mono text-[#E4C765] font-bold">1. Outbound Handshake</div>
                <p className="text-zinc-400">
                  MT5 terminal compiles account login, broker server, symbol, timestamp, and unique nonce into a cryptographic signature.
                </p>
              </div>
              <div className="space-y-2 p-4 bg-[#111420] rounded-lg border border-zinc-800">
                <div className="font-mono text-[#E4C765] font-bold">2. Cloud Verification</div>
                <p className="text-zinc-400">
                  OPHIREUM Cloud Run backend verifies licence validity, checks for nonce replay attacks, validates broker identity, and confirms emergency pause status.
                </p>
              </div>
              <div className="space-y-2 p-4 bg-[#111420] rounded-lg border border-zinc-800">
                <div className="font-mono text-[#E4C765] font-bold">3. Policy Dispatch</div>
                <p className="text-zinc-400">
                  Backend delivers permitted policy parameters (maximum lot, stop loss rule, heartbeat interval) back to the EA memory space.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: ACCOUNT-BOUND LICENSING */}
      {section === 'licensing-info' && (
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141924] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Cryptographic Protection</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Account-Bound Licensing
            </h1>
            <p className="text-zinc-300 text-base leading-relaxed">
              Every OPHIREUM licence is cryptographically bound to a single approved MT5 account number and broker server. This prevents unauthorized redistribution, protects intellectual property, and guarantees that our compliance team can enforce emergency market pauses when necessary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-[#0D1017] border border-[#1F2536] space-y-3">
              <h3 className="text-base font-semibold text-white">Migration Protocol</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Need to change broker accounts or upgrade from Standard to Raw spread? Submit an Unbinding Request via your portal. Compliance officers verify and authorize account migrations within 24 hours.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-[#0D1017] border border-[#1F2536] space-y-3">
              <h3 className="text-base font-semibold text-white">Nonce Replay Resistance</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every validation call requires a single-use pseudorandom nonce and a synchronized UTC timestamp. Intercepted payloads cannot be replayed or shared across terminals.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: VPS OPERATIONS */}
      {section === 'vps-ops' && (
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141924] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
              <Server className="w-3.5 h-3.5" />
              <span>Institutional Hosting</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              VPS Operations & Infrastructure
            </h1>
            <p className="text-zinc-300 text-base leading-relaxed">
              Automated XAUUSD trading demands uninterrupted 24/5 internet connectivity, high-speed execution, and isolation from personal desktop power interruptions.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0C0F17] border border-[#1E2433] space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">OPHIREUM Managed MT5 VPS Specification</h3>
                <p className="text-xs text-zinc-400">Available as an add-on at 360 USDT / year per account</p>
              </div>
              <button
                onClick={() => setCurrentRoute('contact')}
                className="px-4 py-2 rounded-lg bg-[#C9A227] text-black font-bold text-xs"
              >
                Request VPS Setup
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-[#111420] rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block">Operating System</span>
                <span className="font-semibold text-zinc-100">Windows Server 2022</span>
              </div>
              <div className="p-4 bg-[#111420] rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block">Co-location Region</span>
                <span className="font-semibold text-zinc-100">Equinix SG1 / LD4 / NY4</span>
              </div>
              <div className="p-4 bg-[#111420] rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block">Broker Latency</span>
                <span className="font-semibold text-emerald-400">&lt; 1.5ms to IC Markets</span>
              </div>
              <div className="p-4 bg-[#111420] rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block">Pre-Configuration</span>
                <span className="font-semibold text-zinc-100">WebRequest Pre-Allowed</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: RISK AND OPERATIONAL CONTROLS */}
      {section === 'risk-controls' && (
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141924] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
              <Sliders className="w-3.5 h-3.5" />
              <span>Execution Governance</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Risk and Operational Controls
            </h1>
            <p className="text-zinc-300 text-base leading-relaxed">
              We reject high-risk marketing and dangerous trading mechanics. OPHIREUM implements mathematical parameters designed to preserve capital through volatile economic releases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-300">
            <div className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2330] space-y-3">
              <div className="font-semibold text-zinc-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Spread Widening Cut-off
              </div>
              <p className="text-zinc-400 leading-relaxed">
                During rollover (21:00–23:00 GMT) or high-impact CPI/NFP news events, gold spreads can spike significantly. The EA monitors tick spreads continuously and inhibits order dispatch if spread exceeds pre-set thresholds.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2330] space-y-3">
              <div className="font-semibold text-zinc-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                Remote Emergency Stop
              </div>
              <p className="text-zinc-400 leading-relaxed">
                In the event of unforeseen broker liquidity freezes or global financial crises, authorized OPHIREUM administrators can trigger an emergency pause across all active validation tokens.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: PLATFORM SECURITY */}
      {section === 'security' && (
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141924] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Enterprise Hardening</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Platform Security
            </h1>
            <p className="text-zinc-300 text-base leading-relaxed">
              Architecture engineered to institutional banking and FinTech compliance standards, utilizing Google Cloud Run, Cloud Firestore, Firebase App Check, and Google Secret Manager.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 rounded-xl bg-[#0D1017] border border-[#1E2330] space-y-2">
              <div className="font-semibold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-[#C9A227]" />
                Customer Data Isolation
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Rigid Firestore Security Rules ensure that users can only read their own licences, orders, and tickets. No sensitive credentials or passwords are ever requested.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0D1017] border border-[#1E2330] space-y-2">
              <div className="font-semibold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#C9A227]" />
                Cloud Run API Layer
              </div>
              <p className="text-zinc-400 leading-relaxed">
                High-availability containerized microservices handling EA validation, heartbeat telemetrics, and atomic order-to-licence activation.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0D1017] border border-[#1E2330] space-y-2">
              <div className="font-semibold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#C9A227]" />
                Immutable Audit Trail
              </div>
              <p className="text-zinc-400 leading-relaxed">
                All administrative actions, plan updates, unbinding approvals, and emergency pause events are permanently recorded in cryptographically timestamped audit logs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: HOW IT WORKS */}
      {section === 'how-it-works' && (
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141924] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>End-to-End Walkthrough</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              How the Platform Works
            </h1>
            <p className="text-zinc-300 text-base leading-relaxed">
              Step-by-step technical lifecycle from registration, legal risk acknowledgement, and licence payment, to MT5 terminal binding and real-time execution.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { num: '01', title: 'Register & Accept Disclosures', text: 'Create an account and complete formal acceptance of Terms of Use, Software Licence Agreement, and Trading Risk Disclosures. Each acceptance is saved with IP audit context.' },
              { num: '02', title: 'Select Licence Package', text: 'Choose an eligible package (Starter Trial 199 USDT, Professional 1,399 USDT, Premium 2,499 USDT, or Institutional 19,999 USDT). Our backend freezes plan pricing into an immutable order.' },
              { num: '03', title: 'Payment Verification & Atomic Activation', text: 'Submit transaction hash for USDT-TRC20, USDT-ERC20, or bank wire. Once verified by our finance desk, exactly one licence is atomically generated.' },
              { num: '04', title: 'Bind MT5 Login Account', text: 'Provide your MT5 login number, broker name (e.g. IC Markets), and server. The licence is permanently bound to this single MT5 environment.' },
              { num: '05', title: 'Download Approved EA & Configure WebRequest', text: 'Download the verified .ex5 build and add https://api.ophireum.com to your MT5 terminal WebRequest whitelist.' },
              { num: '06', title: 'Live Heartbeat Telemetry & Monitoring', text: 'Attach the EA to a 15-minute XAUUSD chart. The EA communicates with OPHIREUM APIs, transacting gold under strict protective stop-loss rules.' }
            ].map((step, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2330] flex items-start gap-4">
                <span className="font-mono text-lg font-bold text-[#C9A227]">{step.num}</span>
                <div className="space-y-1">
                  <h3 className="font-semibold text-white text-sm">{step.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
