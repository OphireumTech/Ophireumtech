/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Trading Experience, Knowledge Evaluation & Financial Profile
 * Sections 11, 12, 13: Appropriateness engine, essential living expenses test,
 * algorithmic risk knowledge evaluation, and suitability outcomes.
 */

import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Lock,
  ArrowRight
} from 'lucide-react';
import { complianceEngine } from '../../services/complianceEngine';
import {
  TradingExperienceRecord,
  FinancialCapacityRecord,
  AppropriatenessResult
} from '../../types/compliance';
import { useApp } from '../../context/AppContext';

export const TradingExperienceView: React.FC = () => {
  const { addToast } = useApp();
  const [complianceState, setComplianceState] = useState(() => complianceEngine.getState());

  useEffect(() => {
    return complianceEngine.subscribe(() => {
      setComplianceState(complianceEngine.getState());
    });
  }, []);

  const [exp, setExp] = useState<TradingExperienceRecord>(() => {
    return (
      complianceState.tradingExperience || {
        yearsTradingTotal: 6,
        forexExperienceYears: 5,
        cfdExperienceYears: 4,
        commodityExperienceYears: 5,
        goldXAUUSDExperienceYears: 4,
        leveragedProductExperienceYears: 4,
        algorithmicTradingExperienceYears: 3,
        eaTradingExperienceYears: 3,
        tradesPerYear: '51_200',
        typicalTradeSizeLots: '0.10 - 0.50',
        previousMaxLeverageUsed: '1:100',
        knowledgeAnswers: {
          understandsMargin: true,
          understandsStopOut: true,
          understandsLiquidation: true,
          understandsDrawdown: true,
          understandsSlippageAndSpread: true,
          understandsExecutionAndLatencyRisk: true,
          understandsTechnologyFailures: true,
          understandsMarketGaps: true
        },
        questionnaireVersion: 'v2026.2',
        submittedAt: new Date().toISOString()
      }
    );
  });

  const [cap, setCap] = useState<FinancialCapacityRecord>(() => {
    return (
      complianceState.financialCapacity || {
        annualIncomeRangeUSD: '$150,000 - $250,000',
        netWorthRangeUSD: '$500,000 - $1,000,000',
        liquidNetWorthUSD: '$250,000',
        intendedTradingCapitalUSD: '$10,000 - $25,000',
        expectedTradingFrequency: 'daily',
        couldLossMateriallyAffectLivingExpenses: false,
        evaluatedAt: new Date().toISOString()
      }
    );
  });

  const [result, setResult] = useState<AppropriatenessResult>(() => {
    return complianceEngine.evaluateAppropriateness(exp, cap);
  });

  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      const outcome = complianceEngine.evaluateAppropriateness(exp, cap);
      setResult(outcome);
      complianceEngine.updateState(prev => ({
        ...prev,
        tradingExperience: exp,
        financialCapacity: cap,
        appropriatenessResult: outcome
      }));
      setIsEvaluating(false);
      addToast('Assessment Complete', `Appropriateness result: ${outcome.replace(/_/g, ' ')}`, 'info');
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2538] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#E4C765] uppercase tracking-wider">
                COMPLIANCE GATES 05 & 06
              </div>
              <h1 className="text-xl font-bold text-white font-serif">
                TRADING EXPERIENCE, KNOWLEDGE & FINANCIAL CAPACITY
              </h1>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full font-mono text-xs font-bold border ${
                result === 'ASSESSMENT_COMPLETE'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : result === 'RISK_WARNING_REQUIRED'
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
              }`}
            >
              OUTCOME: {result.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          International financial regulations mandate an appropriateness assessment to determine whether leveraged spot gold algorithmic execution matches your financial capacity and knowledge base.
        </p>
      </div>

      {/* Living Expenses Filter Warning (Critical Gate) */}
      {cap.couldLossMateriallyAffectLivingExpenses && (
        <div className="p-5 rounded-3xl bg-rose-950/40 border border-rose-800/60 shadow-xl flex items-start gap-4 text-rose-200">
          <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-white text-sm">SERVICE RESTRICTION WARNING: CAPITAL PRESERVATION</h4>
            <p>
              You indicated that total loss of funds allocated to trading could materially affect your essential living expenses or financial obligations. Under regulatory consumer protection guidelines, algorithmic software activation cannot be authorized until independent financial stability is confirmed.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 1: TRADING EXPERIENCE YEARS */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-6">
        <div className="border-b border-[#1E2538] pb-3">
          <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
            1. QUANTITATIVE TRADING EXPERIENCE HISTORY
          </h3>
          <p className="text-[11px] text-zinc-400">
            Record your historical market engagement across relevant asset classes and execution styles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Total Years Trading Financial Markets</label>
            <input
              type="number"
              min="0"
              max="50"
              value={exp.yearsTradingTotal}
              onChange={e => setExp({ ...exp, yearsTradingTotal: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Spot Gold (XAUUSD) Experience (Years)</label>
            <input
              type="number"
              min="0"
              max="50"
              value={exp.goldXAUUSDExperienceYears}
              onChange={e => setExp({ ...exp, goldXAUUSDExperienceYears: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Algorithmic / EA Experience (Years)</label>
            <input
              type="number"
              min="0"
              max="50"
              value={exp.algorithmicTradingExperienceYears}
              onChange={e => setExp({ ...exp, algorithmicTradingExperienceYears: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Trades Executed Annually</label>
            <select
              value={exp.tradesPerYear}
              onChange={e => setExp({ ...exp, tradesPerYear: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white"
            >
              <option value="0_10">0 - 10 trades per year</option>
              <option value="11_50">11 - 50 trades per year</option>
              <option value="51_200">51 - 200 trades per year</option>
              <option value="200_plus">200+ trades per year</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Typical Trade Size (Lots)</label>
            <input
              type="text"
              value={exp.typicalTradeSizeLots}
              onChange={e => setExp({ ...exp, typicalTradeSizeLots: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Maximum Leverage Utilized</label>
            <input
              type="text"
              value={exp.previousMaxLeverageUsed}
              onChange={e => setExp({ ...exp, previousMaxLeverageUsed: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: KNOWLEDGE TEST */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-4">
        <div className="border-b border-[#1E2538] pb-3">
          <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
            2. LEVERAGED & ALGORITHMIC TRADING KNOWLEDGE EVALUATION
          </h3>
          <p className="text-[11px] text-zinc-400">
            Confirm your mathematical understanding of margin, liquidation thresholds, and automated execution mechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            {
              key: 'understandsMargin',
              title: 'Margin & Required Equity',
              desc: 'I understand that margin is collateral held by the broker, and positions require sufficient equity to remain open.'
            },
            {
              key: 'understandsStopOut',
              title: 'Margin Call & Stop-Out Levels',
              desc: 'I understand that if margin level drops below broker stop-out thresholds, the broker will automatically liquidate positions.'
            },
            {
              key: 'understandsLiquidation',
              title: 'Liquidation Risk in High Volatility',
              desc: 'I understand that sudden market spikes in gold can deplete free margin before protective orders can be processed.'
            },
            {
              key: 'understandsDrawdown',
              title: 'Drawdown Mechanics',
              desc: 'I understand that historical drawdown represents past peak-to-trough capital decline and is not a ceiling for future loss.'
            },
            {
              key: 'understandsSlippageAndSpread',
              title: 'Spread Widening & Execution Slippage',
              desc: 'I understand that during macroeconomic news releases (CPI/NFP), brokers widen spreads and fills may slip.'
            },
            {
              key: 'understandsExecutionAndLatencyRisk',
              title: 'Latency & VPS Infrastructure Risk',
              desc: 'I understand that network latency between the VPS and broker server affects order fill timeliness.'
            },
            {
              key: 'understandsTechnologyFailures',
              title: 'Hardware & Connectivity Outages',
              desc: 'I understand that MT5 terminal crashes, power loss, or broker server restarts can disrupt active EA order flow.'
            },
            {
              key: 'understandsMarketGaps',
              title: 'Weekend & Overnight Price Gapping',
              desc: 'I understand that prices can gap over weekends or holidays, bypassing stop losses and executing at worse market prices.'
            }
          ].map(q => {
            const isChecked = (exp.knowledgeAnswers as any)[q.key];
            return (
              <label
                key={q.key}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                  isChecked
                    ? 'bg-[#121826] border-[#C9A227]/40 shadow-sm'
                    : 'bg-[#080B11] border-[#182030] hover:border-[#222C42]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={e =>
                    setExp({
                      ...exp,
                      knowledgeAnswers: {
                        ...exp.knowledgeAnswers,
                        [q.key]: e.target.checked
                      }
                    })
                  }
                  className="mt-0.5 w-4 h-4 rounded text-[#C9A227] focus:ring-[#C9A227] border-zinc-700 bg-zinc-900 cursor-pointer shrink-0"
                />
                <div>
                  <div className="font-bold text-white text-[12px]">{q.title}</div>
                  <div className="text-[11px] text-zinc-400 leading-snug mt-0.5">{q.desc}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: FINANCIAL CAPACITY & ESSENTIAL LIVING EXPENSES TEST */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-6">
        <div className="border-b border-[#1E2538] pb-3">
          <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
            3. FINANCIAL CAPACITY & LIVING EXPENSES TEST
          </h3>
          <p className="text-[11px] text-zinc-400">
            Ensure that trading capital represents true risk capital that you can afford to lose without personal distress.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Estimated Annual Income (USD)</label>
            <select
              value={cap.annualIncomeRangeUSD}
              onChange={e => setCap({ ...cap, annualIncomeRangeUSD: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white"
            >
              <option value="Under $50,000">Under $50,000</option>
              <option value="$50,000 - $100,000">$50,000 - $100,000</option>
              <option value="$100,000 - $150,000">$100,000 - $150,000</option>
              <option value="$150,000 - $250,000">$150,000 - $250,000</option>
              <option value="$250,000+">$250,000+</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Estimated Net Worth (USD)</label>
            <select
              value={cap.netWorthRangeUSD}
              onChange={e => setCap({ ...cap, netWorthRangeUSD: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white"
            >
              <option value="Under $100,000">Under $100,000</option>
              <option value="$100,000 - $250,000">$100,000 - $250,000</option>
              <option value="$250,000 - $500,000">$250,000 - $500,000</option>
              <option value="$500,000 - $1,000,000">$500,000 - $1,000,000</option>
              <option value="$1,000,000+">$1,000,000+</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Liquid Net Worth (Cash & Readily Marketable Securities)</label>
            <input
              type="text"
              value={cap.liquidNetWorthUSD}
              onChange={e => setCap({ ...cap, liquidNetWorthUSD: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Intended Trading Capital Allocated to EA (USD)</label>
            <input
              type="text"
              value={cap.intendedTradingCapitalUSD}
              onChange={e => setCap({ ...cap, intendedTradingCapitalUSD: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-[#20283A] text-white font-mono"
            />
          </div>
        </div>

        {/* VITAL REGULATORY LIVING EXPENSES TEST QUESTION */}
        <div className="p-4 rounded-2xl bg-[#0A0D15] border-2 border-amber-500/40 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase font-mono text-[11px]">
            <AlertTriangle className="w-4 h-4" />
            <span>MANDATORY STATUTORY LIVING EXPENSES DETERMINATION</span>
          </div>

          <p className="text-zinc-200 font-semibold leading-relaxed">
            &quot;Could the loss of all funds allocated to this trading activity materially affect your essential living expenses or financial obligations?&quot;
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-1">
            <label className="p-3 rounded-xl bg-[#07090F] border border-[#1C2538] flex items-center gap-3 cursor-pointer flex-1">
              <input
                type="radio"
                name="livingExpensesTest"
                checked={!cap.couldLossMateriallyAffectLivingExpenses}
                onChange={() => setCap({ ...cap, couldLossMateriallyAffectLivingExpenses: false })}
                className="text-[#C9A227] focus:ring-[#C9A227]"
              />
              <span className="text-white font-bold">
                NO — Allocated capital represents pure risk capital with zero impact on living necessities.
              </span>
            </label>

            <label className="p-3 rounded-xl bg-[#07090F] border border-[#1C2538] flex items-center gap-3 cursor-pointer flex-1">
              <input
                type="radio"
                name="livingExpensesTest"
                checked={cap.couldLossMateriallyAffectLivingExpenses}
                onChange={() => setCap({ ...cap, couldLossMateriallyAffectLivingExpenses: true })}
                className="text-rose-500 focus:ring-rose-500"
              />
              <span className="text-rose-300 font-bold">
                YES — A total loss could impact personal living obligations or debt service.
              </span>
            </label>
          </div>
        </div>

        {/* Submit & Re-evaluate */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleEvaluate}
            disabled={isEvaluating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-110"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>{isEvaluating ? 'Recalculating Scores...' : 'Recalculate Appropriateness & Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
