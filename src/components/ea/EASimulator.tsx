/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM MetaTrader 5 EA Sandbox & Validation Simulator
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
  Cpu
} from 'lucide-react';

export const EASimulator: React.FC = () => {
  const { licenses, validateEA, settings, addToast } = useApp();

  const activeLicense = licenses.find(l => l.status === 'active') || licenses[0];

  // Simulator test parameters
  const [testLicenseId, setTestLicenseId] = useState(activeLicense?.id || 'OPH-8924-4102-XAU');
  const [testAccountNumber, setTestAccountNumber] = useState(activeLicense?.boundMt5Account || '7729014');
  const [testBroker, setTestBroker] = useState(activeLicense?.brokerName || 'IC Markets (SC)');
  const [testServer, setTestServer] = useState(activeLicense?.brokerServer || 'ICMarketsSC-Live04');
  const [testSymbol, setTestSymbol] = useState('XAUUSD');
  const [testEaVersion, setTestEaVersion] = useState('2.4.0');
  const [simulateReplay, setSimulateReplay] = useState(false);
  const [simulateTimeDrift, setSimulateTimeDrift] = useState(false);

  // Results & Terminal log stream
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '2026.09.09 13:30:00.012 OPHIREUM Expert Assistant (XAUUSD, M15): [CORE] Initializing institutional algorithmic engine...',
    '2026.09.09 13:30:00.045 OPHIREUM Expert Assistant: [CONFIG] Timeframe: M15. Target Symbol: XAUUSD (Gold).',
    '2026.09.09 13:30:00.080 OPHIREUM Expert Assistant: [NET] Preparing WebRequest cryptographic handshake...'
  ]);

  const runHandshakeSimulation = () => {
    const nonce = simulateReplay ? 'replay-nonce-stale-001' : `nonce-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = simulateTimeDrift ? Date.now() - 400000 : Date.now(); // 400s drift exceeds 300s window

    const logPrefix = new Date().toISOString().replace('T', ' ').substring(0, 23);
    
    setTerminalLogs(prev => [
      ...prev,
      `${logPrefix} OPHIREUM Expert Assistant: [SEND] Dispatching WebRequest to ${settings.webrequestUrl}/api/v1/ea/validate...`,
      `${logPrefix} OPHIREUM Expert Assistant: [PAYLOAD] Nonce: ${nonce.substring(0, 14)}... Symbol: ${testSymbol} Account: #${testAccountNumber}`
    ]);

    const result = validateEA({
      license_id: testLicenseId,
      account_number: testAccountNumber,
      broker_name: testBroker,
      broker_server: testServer,
      symbol: testSymbol,
      ea_version: testEaVersion,
      nonce: nonce,
      timestamp: timestamp,
      signature: 'hmac-sha256-demo-sig'
    });

    setLastResponse(result);

    setTimeout(() => {
      const respPrefix = new Date().toISOString().replace('T', ' ').substring(0, 23);
      if (result.status === 200) {
        setTerminalLogs(prev => [
          ...prev,
          `${respPrefix} OPHIREUM Expert Assistant: [AUTH OK] HTTP 200: Authorization Granted. Status: ACTIVE.`,
          `${respPrefix} OPHIREUM Expert Assistant: [POLICY] Max Lot: 0.0100 | Hard Stop-Loss: ENFORCED | Heartbeat: 60s`,
          `${respPrefix} OPHIREUM Expert Assistant: [EXEC] Trading engine engaged for London/NY session overlap.`
        ]);
      } else {
        setTerminalLogs(prev => [
          ...prev,
          `${respPrefix} OPHIREUM Expert Assistant: [AUTH DENIED] HTTP ${result.status}: ${result.body.message}`,
          `${respPrefix} OPHIREUM Expert Assistant: [SAFETY] Execution inhibited. Order dispatch halted.`
        ]);
      }
    }, 250);
  };

  const copyResponseJson = () => {
    navigator.clipboard.writeText(JSON.stringify(lastResponse, null, 2));
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Simulator Header */}
      <div className="border-b border-[#1E2330] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141924] border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
          <Terminal className="w-3.5 h-3.5" />
          <span>Interactive Protocol Testing Environment</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-bold text-white mt-2">
          MT5 WebRequest & Validation Simulator
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-3xl leading-relaxed">
          Test real-time cryptographic authorization handshakes between the MetaTrader 5 terminal and the OPHIREUM Cloud Run API. Inspect nonce replay resistance, symbol constraints, timestamp drift verification, and emergency pauses.
        </p>
      </div>

      {/* Main Grid: Controls vs Terminal Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Simulated MT5 Terminal Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#C9A227]" />
                Terminal Execution Parameters
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">MQL5 Sandbox</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1">Licence ID Token</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testLicenseId}
                    onChange={(e) => setTestLicenseId(e.target.value)}
                    className="flex-1 bg-[#111420] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono text-xs outline-none focus:border-[#C9A227]"
                  />
                  <button
                    onClick={() => setTestLicenseId('OPH-INVALID-KEY-999')}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[10px] cursor-pointer"
                    title="Test Invalid Licence"
                  >
                    Invalidate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">MT5 Account Number</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testAccountNumber}
                    onChange={(e) => setTestAccountNumber(e.target.value)}
                    className="flex-1 bg-[#111420] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono text-xs outline-none focus:border-[#C9A227]"
                  />
                  <button
                    onClick={() => setTestAccountNumber('9999999')}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[10px] cursor-pointer"
                    title="Test Mismatched Account"
                  >
                    Mismatch
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Broker Name</label>
                  <input
                    type="text"
                    value={testBroker}
                    onChange={(e) => setTestBroker(e.target.value)}
                    className="w-full bg-[#111420] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Broker Server</label>
                  <input
                    type="text"
                    value={testServer}
                    onChange={(e) => setTestServer(e.target.value)}
                    className="w-full bg-[#111420] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Symbol</label>
                  <select
                    value={testSymbol}
                    onChange={(e) => setTestSymbol(e.target.value)}
                    className="w-full bg-[#111420] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 text-xs outline-none"
                  >
                    <option value="XAUUSD">XAUUSD (Gold - Allowed)</option>
                    <option value="EURUSD">EURUSD (Currency - Denied)</option>
                    <option value="BTCUSD">BTCUSD (Crypto - Denied)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">EA Version</label>
                  <input
                    type="text"
                    value={testEaVersion}
                    onChange={(e) => setTestEaVersion(e.target.value)}
                    className="w-full bg-[#111420] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 text-xs outline-none font-mono"
                  />
                </div>
              </div>

              {/* Edge Case Attack Simulations */}
              <div className="p-3 rounded-xl bg-[#090B10] border border-zinc-800 space-y-2 pt-3">
                <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
                  Security Defense Vectors:
                </span>
                
                <label className="flex items-center gap-2 cursor-pointer text-[11px] text-zinc-400">
                  <input
                    type="checkbox"
                    checked={simulateReplay}
                    onChange={(e) => setSimulateReplay(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-[#C9A227] focus:ring-0"
                  />
                  <span>Simulate Nonce Replay Attack (Duplicate Request)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[11px] text-zinc-400">
                  <input
                    type="checkbox"
                    checked={simulateTimeDrift}
                    onChange={(e) => setSimulateTimeDrift(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-[#C9A227] focus:ring-0"
                  />
                  <span>Simulate Clock Drift Exceeding 300 Seconds</span>
                </label>
              </div>

              <button
                onClick={runHandshakeSimulation}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold text-xs shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Transmit WebRequest Handshake</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Terminal Console & Decoded Response (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Decoded HTTP Response Badge */}
          {lastResponse && (
            <div className={`p-4 rounded-xl border flex items-center justify-between text-xs animate-in fade-in ${
              lastResponse.status === 200
                ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                : 'bg-rose-950/40 border-rose-700/60 text-rose-300'
            }`}>
              <div className="flex items-center gap-3">
                {lastResponse.status === 200 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
                <div>
                  <div className="font-bold">
                    HTTP Response {lastResponse.status}: {lastResponse.body.status || 'ERROR'}
                  </div>
                  <div className="text-[11px] opacity-90">{lastResponse.body.message}</div>
                </div>
              </div>

              <button
                onClick={copyResponseJson}
                className="px-2.5 py-1 bg-black/40 hover:bg-black/60 rounded text-[11px] flex items-center gap-1 cursor-pointer"
              >
                {copiedResponse ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedResponse ? 'Copied' : 'JSON'}</span>
              </button>
            </div>
          )}

          {/* MT5 Terminal Experts Log Output */}
          <div className="rounded-2xl bg-[#08090D] border border-[#1A1F2C] overflow-hidden shadow-2xl">
            <div className="px-4 py-2.5 bg-[#0F131D] border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                <span className="ml-2 font-mono text-[11px] text-zinc-400 font-semibold">
                  MT5 Terminal Experts Log • XAUUSD M15
                </span>
              </div>
              <button
                onClick={() => setTerminalLogs([])}
                className="text-[10px] text-zinc-500 hover:text-zinc-300"
              >
                Clear Log
              </button>
            </div>

            <div className="p-4 font-mono text-[11px] leading-relaxed space-y-1.5 h-72 overflow-y-auto text-zinc-300">
              {terminalLogs.map((log, index) => (
                <div key={index} className="break-all">
                  {log.includes('[AUTH OK]') ? (
                    <span className="text-emerald-400 font-semibold">{log}</span>
                  ) : log.includes('[AUTH DENIED]') ? (
                    <span className="text-rose-400 font-semibold">{log}</span>
                  ) : log.includes('[POLICY]') ? (
                    <span className="text-[#E4C765]">{log}</span>
                  ) : (
                    <span>{log}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Decoded Cloud Policy Display */}
          {lastResponse?.body?.policy && (
            <div className="p-5 rounded-2xl bg-[#0D1017] border border-[#1E2330] space-y-3 text-xs">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#C9A227]" />
                Injected Policy Parameters
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#111420] rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">Execution Permitted:</span>
                  <span className="font-bold text-emerald-400">TRUE</span>
                </div>
                <div className="p-3 bg-[#111420] rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">Max Lot Setting:</span>
                  <span className="font-mono text-zinc-100 font-bold">{lastResponse.body.policy.lot_setting}</span>
                </div>
                <div className="p-3 bg-[#111420] rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">Stop-Loss Mandate:</span>
                  <span className="font-bold text-emerald-400">REQUIRED</span>
                </div>
                <div className="p-3 bg-[#111420] rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">Heartbeat Interval:</span>
                  <span className="font-mono text-zinc-100 font-bold">{lastResponse.body.policy.heartbeat_interval_sec}s</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
