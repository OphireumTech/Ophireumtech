/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM MetaTrader 5 EA Sandbox & Validation Simulator
 * Strictly restricted to Staging/Development or authorized Staff (License Admin & Super Admin).
 * Does NOT alter or write to production database records.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Zap,
  Activity,
  Shield,
  Clock,
  Cpu,
  Lock
} from 'lucide-react';
import { AccessDeniedPage } from '../common/AccessDeniedPage';

export const EASimulator: React.FC = () => {
  const { licenses, validateEA, settings, addToast, currentRole } = useApp();

  // Environment detection: in production, require license_admin or super_admin
  const isProduction = process.env.NODE_ENV === 'production';
  const isAuthorized = !isProduction || currentRole === 'license_admin' || currentRole === 'super_admin';

  if (!isAuthorized) {
    return (
      <AccessDeniedPage
        requiredRole="license_admin or super_admin"
        currentRole={currentRole}
        reason="The MT5 EA Sandbox Simulator is restricted to technical staff in production environments to prevent simulation confusion with live trading terminals."
        returnPath="/"
      />
    );
  }

  // Find strictly user's active licence or fallback safely to standalone test data without leaking another customer's record
  const activeLicense = licenses.find(l => l.status === 'active');

  // Simulator test parameters
  const [testLicenseId, setTestLicenseId] = useState(activeLicense?.id || 'OPH-TEST-SIMULATOR-XAU');
  const [testAccountNumber, setTestAccountNumber] = useState(activeLicense?.boundMt5Account || '8849102');
  const [testBroker, setTestBroker] = useState(activeLicense?.brokerName || 'IC Markets (SC)');
  const [testServer, setTestServer] = useState(activeLicense?.brokerServer || 'ICMarketsSC-Live04');
  const [testSymbol, setTestSymbol] = useState('XAUUSD');
  const [testEaVersion, setTestEaVersion] = useState('2.4.1');
  const [simulateReplay, setSimulateReplay] = useState(false);
  const [simulateTimeDrift, setSimulateTimeDrift] = useState(false);

  // Results & Terminal log stream
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '2026.09.10 09:00:00.012 OPHIREUM Expert Assistant (XAUUSD, M15): [CORE] Initializing institutional algorithmic engine...',
    '2026.09.10 09:00:00.045 OPHIREUM Expert Assistant: [CONFIG] Timeframe: M15. Target Symbol: XAUUSD (Gold).',
    '2026.09.10 09:00:00.080 OPHIREUM Expert Assistant: [NET] Preparing WebRequest cryptographic handshake...'
  ]);

  const runHandshakeSimulation = () => {
    const nonce = simulateReplay ? 'replay-nonce-stale-001' : `nonce-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = simulateTimeDrift ? Date.now() - 400000 : Date.now(); // 400s drift exceeds 300s window

    const logPrefix = new Date().toISOString().replace('T', ' ').substring(0, 23);
    
    setTerminalLogs(prev => [
      ...prev,
      `${logPrefix} OPHIREUM Expert Assistant: [SEND] Dispatching WebRequest to ${settings.webrequestUrl}...`,
      `${logPrefix} OPHIREUM Expert Assistant: [PAYLOAD] Nonce: ${nonce.substring(0, 14)}... Symbol: ${testSymbol} Account: #${testAccountNumber}`
    ]);

    // Local in-memory validation strictly isolated from live database writes
    const payload = {
      licenseId: testLicenseId,
      accountNumber: testAccountNumber,
      broker: testBroker,
      server: testServer,
      symbol: testSymbol,
      eaVersion: testEaVersion,
      nonce,
      timestamp
    };

    const res = validateEA(payload);
    setLastResponse(res);

    const resultPrefix = new Date().toISOString().replace('T', ' ').substring(0, 23);
    if (res.authorized) {
      setTerminalLogs(prev => [
        ...prev,
        `${resultPrefix} OPHIREUM Expert Assistant: [AUTH_SUCCESS] HTTP 200 AUTHORIZED. Cryptographic signature verified.`,
        `${resultPrefix} OPHIREUM Expert Assistant: [POLICY] Max Lot: ${res.permittedPolicy?.maxLot}. Risk: ${res.permittedPolicy?.riskPct}%. Execution loop ENGAGED on XAUUSD.`
      ]);
      addToast('Handshake Approved', 'EA WebRequest simulation succeeded with AUTHORIZED policy.', 'success');
    } else {
      setTerminalLogs(prev => [
        ...prev,
        `${resultPrefix} OPHIREUM Expert Assistant: [AUTH_FAILED] HTTP ${res.status} ${res.reasonCode}: ${res.message}`,
        `${resultPrefix} OPHIREUM Expert Assistant: [HALT] Algorithmic execution locked. Terminal uninitialization scheduled.`
      ]);
      addToast('Handshake Rejected', `Simulation blocked: ${res.reasonCode}`, 'warning');
    }
  };

  const clearLogs = () => {
    setTerminalLogs([
      `${new Date().toISOString().replace('T', ' ').substring(0, 23)} Terminal log reset by compliance operator.`
    ]);
    setLastResponse(null);
  };

  const copyResponse = () => {
    if (!lastResponse) return;
    navigator.clipboard.writeText(JSON.stringify(lastResponse, null, 2));
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Isolation Warning Banner */}
      <div className="p-3.5 rounded-xl bg-[#141824] border border-[#2B354C] text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[#E4C765]">
          <Shield className="w-4 h-4 shrink-0" />
          <span className="font-mono font-bold">ISOLATED STAGING EA SIMULATOR</span>
          <span className="text-zinc-400 font-sans hidden sm:inline">— Validations are sandboxed and do not alter production database state.</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[10px]">
          SANDBOX MODE
        </span>
      </div>

      <div className="border-b border-[#2B354C] pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-[#1C1708] border border-[#C9A227]/40 text-[#E4C765] font-mono text-[10px] tracking-wider uppercase">
            Protocol Inspector
          </span>
          <span className="text-zinc-500 text-xs font-mono">• MQL5 OnInit() Test Bench</span>
        </div>
        <h1 className="text-2xl font-bold text-white font-display">MetaTrader 5 EA Sandbox & Validation Simulator</h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-3xl">
          Test WebRequest handshakes, replay rejection algorithms, timestamp drift barriers, and symbol validation logic exactly as processed by the compiled EX5 Expert Assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 bg-[#0D0F15] border border-[#2B354C] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#2B354C] pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#E4C765]" />
              Terminal Handshake Parameters
            </h2>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-zinc-400 block mb-1">Licence Key (License ID):</label>
              <input
                type="text"
                value={testLicenseId}
                onChange={e => setTestLicenseId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#141824] border border-[#2B354C] text-white focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-400 block mb-1">MT5 Account #:</label>
                <input
                  type="text"
                  value={testAccountNumber}
                  onChange={e => setTestAccountNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#141824] border border-[#2B354C] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Trading Symbol:</label>
                <input
                  type="text"
                  value={testSymbol}
                  onChange={e => setTestSymbol(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#141824] border border-[#2B354C] text-[#E4C765] font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-400 block mb-1">Broker Company:</label>
                <input
                  type="text"
                  value={testBroker}
                  onChange={e => setTestBroker(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#141824] border border-[#2B354C] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Broker Server:</label>
                <input
                  type="text"
                  value={testServer}
                  onChange={e => setTestServer(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#141824] border border-[#2B354C] text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Attack & Drift Simulators */}
            <div className="p-3 rounded-xl bg-[#141824] border border-[#2B354C] space-y-2">
              <div className="text-[11px] font-bold text-zinc-300">Security Test Vectors:</div>
              <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                <input
                  type="checkbox"
                  checked={simulateReplay}
                  onChange={e => setSimulateReplay(e.target.checked)}
                  className="rounded bg-[#0D0F15] border-[#2B354C] text-[#C9A227] focus:ring-0"
                />
                <span>Simulate Replay Attack (Send Stale Nonce)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                <input
                  type="checkbox"
                  checked={simulateTimeDrift}
                  onChange={e => setSimulateTimeDrift(e.target.checked)}
                  className="rounded bg-[#0D0F15] border-[#2B354C] text-[#C9A227] focus:ring-0"
                />
                <span>Simulate Clock Drift (400s terminal skew)</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={runHandshakeSimulation}
                className="flex-1 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#E4C765] text-black font-bold text-xs cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                Execute WebRequest Handshake
              </button>

              <button
                onClick={clearLogs}
                className="px-3 py-2.5 rounded-xl bg-[#1A1F2C] hover:bg-[#252C3D] border border-[#2B354C] text-zinc-400 hover:text-white cursor-pointer"
                title="Reset Console"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Terminal Stream & Cryptographic Output */}
        <div className="lg:col-span-7 space-y-6">
          {/* MT5 Terminal Log Viewer */}
          <div className="bg-[#0D0F15] border border-[#2B354C] rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-3 bg-[#111420] border-b border-[#2B354C] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-300">
                <Terminal className="w-4 h-4 text-[#E4C765]" />
                <span>MetaTrader 5 Experts Journal Simulation</span>
              </div>
              <span className="text-[10px] text-zinc-500">Auto-Scroll Active</span>
            </div>

            <div className="p-4 bg-[#08090C] font-mono text-[11px] text-zinc-300 space-y-1.5 h-[340px] overflow-y-auto leading-relaxed">
              {terminalLogs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-zinc-500 shrink-0">{log.substring(0, 23)}</span>
                  <span className={
                    log.includes('AUTH_SUCCESS')
                      ? 'text-emerald-400 font-bold'
                      : log.includes('AUTH_FAILED')
                      ? 'text-rose-400 font-bold'
                      : log.includes('SEND')
                      ? 'text-amber-300'
                      : 'text-zinc-300'
                  }>
                    {log.substring(24)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic JSON Response */}
          {lastResponse && (
            <div className="bg-[#0D0F15] border border-[#2B354C] rounded-2xl p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#2B354C] pb-2">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#E4C765]" />
                  Server Ingress Raw JSON Payload
                </span>
                <button
                  onClick={copyResponse}
                  className="text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedResponse ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedResponse ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="p-3 bg-[#08090C] rounded-xl text-zinc-300 overflow-x-auto text-[11px] leading-relaxed max-h-56">
                {JSON.stringify(lastResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
