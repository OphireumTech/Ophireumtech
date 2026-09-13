/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM ASSISTANT ADMINISTRATOR CONSOLE
 * Comprehensive admin workspace for AI model management, emergency killswitch,
 * domain filter calibration, authenticated credit ledger adjustments, and compliance audit logs.
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { auth } from '../../lib/firebase';
import {
  Shield,
  Sliders,
  AlertTriangle,
  Coins,
  ThumbsUp,
  ThumbsDown,
  Activity,
  RefreshCw,
  CheckCircle,
  Database,
  Users,
  Settings,
  FileText,
  ExternalLink
} from 'lucide-react';

export const AssistantAdminConsole: React.FC = () => {
  const { currentRole, addToast } = useApp();

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);

  // Form states
  const [emergencyPause, setEmergencyPause] = useState(false);
  const [modelName, setModelName] = useState('gemini-3.8-flash');
  const [strictDomainFilter, setStrictDomainFilter] = useState(true);
  const [temperature, setTemperature] = useState(0.3);

  // Manual Credit Adjustment state
  const [creditAdjustmentEmail, setCreditAdjustmentEmail] = useState('');
  const [creditAdjustmentAmount, setCreditAdjustmentAmount] = useState(500);
  const [creditAdjustmentReason, setCreditAdjustmentReason] = useState('Customer Support Courtesy');
  const [submittingCredit, setSubmittingCredit] = useState(false);

  const getAuthHeaders = async () => {
    const token = await auth.currentUser?.getIdToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/v1/assistant/admin/stats', { headers });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        if (data.settings) {
          setEmergencyPause(Boolean(data.settings.emergencyPause));
          setModelName(data.settings.modelName || 'gemini-3.8-flash');
          setStrictDomainFilter(Boolean(data.settings.strictDomainFilter));
          setTemperature(Number(data.settings.temperature ?? 0.3));
        }
      } else {
        console.warn('Admin stats endpoint returned:', res.status);
      }
    } catch (e) {
      console.warn('Failed to fetch admin stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSaveSettings = async (overridePause?: boolean) => {
    setSaving(true);
    try {
      const pauseVal = overridePause !== undefined ? overridePause : emergencyPause;
      const headers = await getAuthHeaders();
      const res = await fetch('/api/v1/assistant/admin/settings', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          emergencyPause: pauseVal,
          modelName,
          strictDomainFilter,
          temperature
        })
      });
      if (res.ok) {
        addToast('Settings Saved', 'Assistant gateway configuration updated.', 'success');
        setEmergencyPause(pauseVal);
        fetchStats();
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update');
      }
    } catch (err: any) {
      addToast('Error', err.message || 'Could not update gateway settings.', 'critical');
    } finally {
      setSaving(false);
      setShowPauseConfirm(false);
    }
  };

  const handleManualCreditDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditAdjustmentEmail.trim()) {
      addToast('Input Required', 'Please provide target user ID or email.', 'warning');
      return;
    }
    if (!creditAdjustmentReason || creditAdjustmentReason.trim().length < 8) {
      addToast('Reason Required', 'Mandatory adjustment reason of at least 8 characters required.', 'warning');
      return;
    }

    setSubmittingCredit(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/v1/assistant/admin/credits/adjust', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          targetUserId: creditAdjustmentEmail.trim(),
          amount: creditAdjustmentAmount,
          reason: creditAdjustmentReason.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        addToast(
          'Credit Adjustment Committed',
          `Successfully posted ${creditAdjustmentAmount > 0 ? '+' : ''}${creditAdjustmentAmount} credits to ${creditAdjustmentEmail}. Tx ID: ${data.tx?.id}`,
          'success'
        );
        setCreditAdjustmentEmail('');
        fetchStats();
      } else {
        throw new Error(data.message || 'Credit adjustment rejected');
      }
    } catch (err: any) {
      addToast('Adjustment Error', err.message || 'Failed to commit credit adjustment.', 'critical');
    } finally {
      setSubmittingCredit(false);
    }
  };

  if (!['super_admin', 'license_admin', 'support_agent'].includes(currentRole)) {
    return (
      <div className="p-8 text-center text-zinc-400 text-xs">
        Access restricted. Super Administrator or License Admin credentials required.
      </div>
    );
  }

  const providerHealth = stats?.systemHealth?.providerStatus;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-xl text-[#E4C765]">OPHIREUM ASSISTANT</span>
            <span className="px-2 py-0.5 rounded bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#E4C765] text-xs font-bold">
              ADMIN GATEWAY
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Global controls, model routing, safety guardrails, feedback review, and credit allocation.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-xs text-zinc-300 flex items-center gap-1.5 self-start cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Emergency Alert if Paused */}
      {emergencyPause && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-600/80 text-rose-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong>Ophireum Assistant is currently PAUSED globally.</strong>
              <p>End users requesting chat responses will receive maintenance notices.</p>
            </div>
          </div>
          <button
            onClick={() => handleSaveSettings(false)}
            disabled={saving}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold text-xs cursor-pointer"
          >
            Resume Operations
          </button>
        </div>
      )}

      {/* Confirmation Modal for Emergency Pause */}
      {showPauseConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#0E1015] border border-rose-600/60 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Global Emergency Pause</span>
            </div>
            <p className="text-xs text-zinc-300">
              Are you certain you wish to halt all Ophireum Assistant operations platform-wide? Active user queries will be rejected with maintenance notices until resumed.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPauseConfirm(false)}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-300 text-xs hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveSettings(true)}
                disabled={saving}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                {saving ? 'Pausing...' : 'Confirm Emergency Pause'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-zinc-800 bg-[#0E1015]">
          <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Gateway Status</div>
          <div className={`text-xl font-bold mt-1 flex items-center gap-2 ${emergencyPause ? 'text-rose-400' : 'text-emerald-400'}`}>
            <Activity className="w-4 h-4" />
            <span>{emergencyPause ? 'PAUSED' : 'ONLINE'}</span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Server Time: {new Date().toLocaleTimeString()}</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-[#0E1015]">
          <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Active Model Engine</div>
          <div className="text-xl font-bold mt-1 text-[#E4C765] truncate font-mono">
            {modelName}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Google GenAI TypeScript SDK</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-[#0E1015]">
          <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Quality Feedback</div>
          <div className="text-xl font-bold mt-1 text-zinc-200 flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400 text-sm">
              <ThumbsUp className="w-3.5 h-3.5" />
              {stats?.positiveFeedbackCount || 0}
            </span>
            <span className="flex items-center gap-1 text-rose-400 text-sm">
              <ThumbsDown className="w-3.5 h-3.5" />
              {stats?.negativeFeedbackCount || 0}
            </span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Total: {stats?.totalFeedbackCount || 0} Reviews</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-[#0E1015]">
          <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Compliance Filter</div>
          <div className="text-xl font-bold mt-1 text-[#E4C765]">
            {strictDomainFilter ? 'ENFORCED' : 'RELAXED'}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Strict Market Domain Only</div>
        </div>
      </div>

      {/* Main Settings & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Gateway & Model Parameters */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0E1015] space-y-4">
          <div className="text-xs font-bold text-[#E4C765] uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            <span>AI Gateway Configuration</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Model Selection */}
            <div>
              <label className="text-zinc-400 block mb-1">Inference Model</label>
              <select
                value={modelName}
                onChange={e => setModelName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-zinc-700 text-white outline-none"
              >
                <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended Fast)</option>
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep Reasoning)</option>
                <option value="gemini-2.5-flash">gemini-2.5-flash</option>
              </select>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Model Temperature: {temperature}</span>
                <span className="text-zinc-500">Lower = More Deterministic</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={e => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[#C9A227]"
              />
            </div>

            {/* Strict Domain Filter Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#141720] border border-zinc-800">
              <div>
                <div className="font-semibold text-zinc-200">Strict Market-Domain Guardrails</div>
                <div className="text-[11px] text-zinc-400">
                  Refuses non-financial inquiries (medical, homework, relationships).
                </div>
              </div>
              <input
                type="checkbox"
                checked={strictDomainFilter}
                onChange={e => setStrictDomainFilter(e.target.checked)}
                className="w-4 h-4 accent-[#C9A227] cursor-pointer"
              />
            </div>

            {/* Emergency Killswitch Action */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/20 border border-rose-900/40">
              <div>
                <div className="font-semibold text-rose-300">Global Emergency Maintenance Pause</div>
                <div className="text-[11px] text-zinc-400">
                  Requires two-step administrative confirmation.
                </div>
              </div>
              {emergencyPause ? (
                <button
                  type="button"
                  onClick={() => handleSaveSettings(false)}
                  disabled={saving}
                  className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Resume
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPauseConfirm(true)}
                  className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  Pause
                </button>
              )}
            </div>

            <button
              onClick={() => handleSaveSettings()}
              disabled={saving}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold text-xs shadow-md cursor-pointer hover:from-[#B8921F]"
            >
              {saving ? 'Saving...' : 'Commit Gateway Settings'}
            </button>
          </div>
        </div>

        {/* Right: Manual Credit Ledger Adjustment */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0E1015] space-y-4">
          <div className="text-xs font-bold text-[#E4C765] uppercase tracking-wider flex items-center gap-2">
            <Coins className="w-4 h-4" />
            <span>Credit Wallet Ledger Management</span>
          </div>

          <form onSubmit={handleManualCreditDeposit} className="space-y-3 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">User Identifier / Email</label>
              <input
                type="text"
                placeholder="user_id or customer@domain.com"
                value={creditAdjustmentEmail}
                onChange={e => setCreditAdjustmentEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-zinc-700 text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-zinc-400 block mb-1">Adjustment Amount (+/- Credits)</label>
                <input
                  type="number"
                  value={creditAdjustmentAmount}
                  onChange={e => setCreditAdjustmentAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-zinc-700 text-white outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Mandatory Reason</label>
                <input
                  type="text"
                  placeholder="Min 8 characters reason"
                  value={creditAdjustmentReason}
                  onChange={e => setCreditAdjustmentReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-zinc-700 text-white outline-none"
                />
              </div>
            </div>

            <p className="text-[11px] text-zinc-500">
              All credit adjustments are executed server-side and committed to the immutable audit ledger.
            </p>

            <button
              type="submit"
              disabled={submittingCredit}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[#E4C765] font-bold text-xs border border-[#C9A227]/40 cursor-pointer disabled:opacity-50"
            >
              {submittingCredit ? 'Posting to Ledger...' : 'Post Credit Adjustment to Server Ledger'}
            </button>
          </form>

          {/* Honest Provider Health Monitor */}
          <div className="pt-3 border-t border-zinc-800 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Provider Telemetry & Health
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-[#141720] border border-zinc-800 flex justify-between items-center">
                <span>Google GenAI Engine:</span>
                <span className={stats?.systemHealth?.geminiApiKeyConfigured ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                  {stats?.systemHealth?.geminiApiKeyConfigured ? 'Connected (API Key Active)' : 'Deterministic Fallback Mode'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#141720] border border-zinc-800">
                <div className="flex justify-between items-center">
                  <span>Market Data Stream:</span>
                  <span className={providerHealth?.isLiveFeedConnected ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                    {providerHealth?.connectionStatus || 'STANDBY_DISCONNECTED'}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">
                  {providerHealth?.notice || 'Market adapter in standby mode.'}
                </div>
                {providerHealth?.requiredCredentials && providerHealth.requiredCredentials.length > 0 && !providerHealth.isLiveFeedConnected && (
                  <div className="mt-1.5 text-[10px] text-zinc-500">
                    Required for live FIX streaming: {providerHealth.requiredCredentials.join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      {stats?.auditLogs && stats.auditLogs.length > 0 && (
        <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0E1015] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#E4C765] uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Recent Assistant Administrative Audit Trail</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] text-zinc-300">
              <thead className="bg-[#141720] text-zinc-400 border-b border-zinc-800 uppercase tracking-wider">
                <tr>
                  <th className="py-2 px-3">Timestamp (UTC)</th>
                  <th className="py-2 px-3">Action</th>
                  <th className="py-2 px-3">Admin</th>
                  <th className="py-2 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {stats.auditLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-zinc-900/40">
                    <td className="py-2 px-3 text-zinc-400">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-2 px-3 text-[#E4C765] font-semibold">{log.action}</td>
                    <td className="py-2 px-3 text-zinc-300">{log.performedBy}</td>
                    <td className="py-2 px-3 text-zinc-400 truncate max-w-md">{JSON.stringify(log.details)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
