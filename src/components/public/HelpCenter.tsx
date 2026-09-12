/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Technical Help Center & Setup Guides
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Terminal,
  Server,
  Download,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';

interface HelpCenterProps {
  section: 'help-center' | 'install-guide' | 'mt5-setup' | 'faq';
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ section }) => {
  const { settings, setCurrentRoute, eaVersions } = useApp();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'webrequest' | 'vps'>('terminal');

  const copyWebRequestUrl = () => {
    navigator.clipboard.writeText(settings.webrequestUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 3000);
  };

  const currentEa = eaVersions.find(v => v.status === 'production') || eaVersions[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* SECTION: HELP CENTER OVERVIEW */}
      {section === 'help-center' && (
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141924] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Knowledge Base & Documentation</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Technical Help Center
            </h1>
            <p className="text-zinc-300 text-base leading-relaxed">
              Step-by-step documentation for MetaTrader 5 Expert Advisor installation, WebRequest whitelist configuration, VPS deployment, and licensing diagnostics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => setCurrentRoute('install-guide')}
              className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2330] hover:border-[#C9A227]/40 transition-all cursor-pointer space-y-3 group"
            >
              <Download className="w-6 h-6 text-[#E4C765] group-hover:translate-y-0.5 transition-transform" />
              <h3 className="text-base font-semibold text-white">Installation Guide</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                How to copy the approved .ex5 binary into your MT5 terminal data directory and attach to a 15M XAUUSD chart.
              </p>
            </div>

            <div
              onClick={() => setCurrentRoute('mt5-setup')}
              className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2330] hover:border-[#C9A227]/40 transition-all cursor-pointer space-y-3 group"
            >
              <Terminal className="w-6 h-6 text-[#E4C765] group-hover:translate-y-0.5 transition-transform" />
              <h3 className="text-base font-semibold text-white">WebRequest Configuration</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Step-by-step instructions to whitelist the OPHIREUM authorization API in MT5 Tools → Options.
              </p>
            </div>

            <div
              onClick={() => setCurrentRoute('vps-ops')}
              className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2330] hover:border-[#C9A227]/40 transition-all cursor-pointer space-y-3 group"
            >
              <Server className="w-6 h-6 text-[#E4C765] group-hover:translate-y-0.5 transition-transform" />
              <h3 className="text-base font-semibold text-white">VPS Setup Standards</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Recommended Windows Server 2022 configurations, latency benchmarks, and uninterrupted execution protocols.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: INSTALLATION GUIDE */}
      {section === 'install-guide' && (
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141924] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
              <Download className="w-3.5 h-3.5" />
              <span>Step-by-Step Procedure</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              MT5 Expert Advisor Installation
            </h1>
            <p className="text-zinc-300 text-base leading-relaxed">
              Follow these exact steps to install and initialize the OPHIREUM Expert Assistant build ({currentEa.fileName}) on MetaTrader 5.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl">
            <div className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2330] space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#C9A227] text-black font-bold text-xs flex items-center justify-center">1</span>
                <h3 className="text-base font-semibold text-white">Open MT5 Data Folder</h3>
              </div>
              <p className="text-xs text-zinc-400 pl-10 leading-relaxed">
                In your MetaTrader 5 terminal, navigate to the top menu: <strong className="text-zinc-200">File → Open Data Folder</strong>. A Windows Explorer window will display your MT5 terminal directory.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2330] space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#C9A227] text-black font-bold text-xs flex items-center justify-center">2</span>
                <h3 className="text-base font-semibold text-white">Copy .ex5 into MQL5/Experts</h3>
              </div>
              <p className="text-xs text-zinc-400 pl-10 leading-relaxed">
                Navigate into the folder <strong className="text-zinc-200">MQL5 → Experts</strong>. Place the downloaded file <code className="text-[#E4C765] bg-black/40 px-1 py-0.5 rounded">{currentEa.fileName}</code> into this folder.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2330] space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#C9A227] text-black font-bold text-xs flex items-center justify-center">3</span>
                <h3 className="text-base font-semibold text-white">Refresh the Navigator Panel</h3>
              </div>
              <p className="text-xs text-zinc-400 pl-10 leading-relaxed">
                Return to MT5. In the <strong className="text-zinc-200">Navigator</strong> window (Ctrl+N), right-click on <strong className="text-zinc-200">Expert Advisors</strong> and select <strong className="text-zinc-200">Refresh</strong>. OPHIREUM Expert Assistant will appear in the list.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2330] space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#C9A227] text-black font-bold text-xs flex items-center justify-center">4</span>
                <h3 className="text-base font-semibold text-white">Attach to XAUUSD Chart (15-Minute)</h3>
              </div>
              <p className="text-xs text-zinc-400 pl-10 leading-relaxed">
                Open a clean chart for <strong className="text-zinc-200">XAUUSD</strong> on the <strong className="text-zinc-200">M15 (15 Minutes)</strong> timeframe. Drag the EA onto the chart. In the Common tab, ensure that <strong className="text-emerald-400">"Allow Algo Trading"</strong> is checked.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: MT5 WEBREQUEST SETUP */}
      {section === 'mt5-setup' && (
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141924] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              <span>Network Authorization</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              WebRequest Whitelist Configuration
            </h1>
            <p className="text-zinc-300 text-base leading-relaxed">
              MetaTrader 5 requires explicit user authorization before an Expert Advisor can transmit HTTP/HTTPS requests to an external API.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-6 max-w-4xl">
            <h3 className="text-base font-bold text-white">Required Authorization Endpoint</h3>
            
            <div className="flex items-center justify-between p-4 bg-[#121622] rounded-xl border border-[#232B3E]">
              <span className="font-mono text-sm text-[#E4C765] break-all">{settings.webrequestUrl}</span>
              <button
                onClick={copyWebRequestUrl}
                className="px-3 py-1.5 rounded-lg bg-[#1D2435] hover:bg-[#283248] text-zinc-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ml-3"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <h4 className="font-semibold text-white">Configuration Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-zinc-400">
                <li>In MetaTrader 5, click <strong className="text-zinc-200">Tools → Options</strong> (or press Ctrl+O).</li>
                <li>Switch to the <strong className="text-zinc-200">Expert Advisors</strong> tab.</li>
                <li>Check the box: <strong className="text-zinc-200">"Allow WebRequest for listed URL:"</strong>.</li>
                <li>Double-click the green <strong className="text-zinc-200">"add new URL..."</strong> entry.</li>
                <li>Paste <code className="text-[#E4C765]">https://api.ophireum.com</code> and press Enter.</li>
                <li>Click <strong className="text-zinc-200">OK</strong> to save settings.</li>
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-300 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Warning:</strong> Without adding this URL to MT5 Options, the Expert Advisor will fail with terminal error 4014 (WebRequest blocked) and will not initialize order execution.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: FAQ */}
      {section === 'faq' && (
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-zinc-300 text-base leading-relaxed">
              Direct answers to operational, licensing, broker, and execution inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-300">
            <div className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2330] space-y-2">
              <h3 className="font-semibold text-white text-sm">Which brokers are supported?</h3>
              <p className="text-zinc-400 leading-relaxed">
                OPHIREUM execution is strictly limited to four authorized partner brokerages: FBS.com, GTCFX.com, Vantage Markets (Pty) Ltd, and Pepperstone Markets Limited. Accounts must run on MetaTrader 5, and Raw Spread / ECN account types are strongly recommended for optimal gold execution.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2330] space-y-2">
              <h3 className="font-semibold text-white text-sm">Can I run multiple accounts on one licence?</h3>
              <p className="text-zinc-400 leading-relaxed">
                No. Each licence is strictly bound to one MT5 login number. To automate multiple accounts, individual licences must be acquired for each terminal environment.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2330] space-y-2">
              <h3 className="font-semibold text-white text-sm">What happens when my licence expires?</h3>
              <p className="text-zinc-400 leading-relaxed">
                Upon expiration, the authorization API will return a LICENSE_EXPIRED status. The EA will safely cease placing new orders, while existing active positions will manage to their hard stop-loss or take-profit targets.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0D1017] border border-[#1E2330] space-y-2">
              <h3 className="font-semibold text-white text-sm">Do you offer refunds on software licences?</h3>
              <p className="text-zinc-400 leading-relaxed">
                Due to the immediate cryptographic delivery of account-bound licence keys and compiled software binaries, all digital licence purchases are non-refundable once activated, as detailed in our Refund and Cancellation Policy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
