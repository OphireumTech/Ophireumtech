/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM INTERACTIVE EXPERT ASSISTANT FOR DEMONSTRATION SESSIONS
 * Section 88: Context-aware assistant that references synthetic state and prefixes simulated financial records.
 */

import React, { useState } from 'react';
import { Bot, Send, Sparkles, HelpCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import { DemoTradingAccount, DemoBotState, DemoPosition } from '../../types/demo';
import { demoEngine } from '../../services/demoEngine';

interface AskOphireumDemoProps {
  account?: DemoTradingAccount;
  botState?: DemoBotState;
  positions?: DemoPosition[];
  state?: any;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export const AskOphireumDemo: React.FC<AskOphireumDemoProps> = ({ account, botState, positions, state }) => {
  const effState = state || demoEngine.getState();
  const effAccount = account || effState.account;
  const effBotState = botState || effState.botState || effState.bot?.state || { licenseStatus: 'ACTIVE — DEMO', status: 'CONNECTED' };
  const effPositions = positions || effState.positions || [];

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Based on your simulated demo account, I am ready to analyze your active synthetic positions, algorithmic trade telemetry, margin buffers, or scheduled macro events.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const cannedQuestions = [
    'Explain my current simulated positions.',
    "Summarize today's simulated trading.",
    'What is my simulated drawdown?',
    'What major market events are scheduled?',
    'Explain margin level.',
    'When does my demo license expire?'
  ];

  const handleAsk = (query: string) => {
    if (!query.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      let answer = '';
      const qLower = query.toLowerCase();

      if (qLower.includes('position')) {
        if (effPositions.length === 0) {
          answer = 'Based on your simulated demo account, there are currently 0 active open positions in the simulation ledger. The Ophireum Expert Assistant algorithm is actively scanning for momentum breakouts.';
        } else {
          const pos = effPositions[0];
          const fProfit = pos.floatingProfit ?? pos.floatingPL ?? 0;
          const sLoss = pos.stopLoss ?? pos.sl;
          answer = `Based on your simulated demo account, you currently have ${effPositions.length} open position: ${pos.direction} ${pos.volume} lots on ${pos.symbol} @ $${pos.openPrice.toFixed(2)}. Floating P/L is currently ${fProfit >= 0 ? '+' : ''}$${fProfit.toFixed(2)}. Stop loss is stationed at $${sLoss ? sLoss.toFixed(2) : 'None'}.`;
        }
      } else if (qLower.includes('summarize') || qLower.includes('today')) {
        const wr = effAccount.winRate ?? 78.5;
        const tt = effAccount.totalTrades ?? 14;
        answer = `Based on your simulated demo account, today's trading balance stands at $${effAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}, with an unrealized equity of $${effAccount.equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}. Win rate across simulated cycles is ${wr.toFixed(1)}% across ${tt} closed iterations.`;
      } else if (qLower.includes('drawdown')) {
        const mdd = effAccount.maxDrawdownPercent ?? 3.42;
        const cdd = effAccount.currentDrawdownPercent ?? 1.15;
        answer = `Based on your simulated demo account, maximum simulated historical drawdown is currently calibrated at ${mdd.toFixed(2)}%, and current floating drawdown is ${cdd.toFixed(2)}%, well within the conservative 5.0% institutional risk boundary.`;
      } else if (qLower.includes('event') || qLower.includes('news')) {
        answer = 'Based on your simulated demo account, the next high-impact market event is US Core CPI YoY scheduled in 1h 45m. Volatility filtering protocols will automatically tighten trailing stops.';
      } else if (qLower.includes('margin')) {
        answer = `Based on your simulated demo account, your simulated Margin Level is currently ${effAccount.marginLevel.toFixed(1)}% with $${effAccount.freeMargin.toLocaleString('en-US', { minimumFractionDigits: 2 })} in free margin, indicating high institutional capitalization.`;
      } else if (qLower.includes('license')) {
        answer = `Based on your simulated demo account, your demonstration license (${effBotState.licenseStatus}) is active for this session. In demo mode, license validity is maintained continuously for uninterrupted testing.`;
      } else {
        answer = `Based on your simulated demo account, your simulated MT5 terminal (${effAccount.accountNumber}) is synchronized with the Ophireum Demo Engine. Bot execution status is currently ${effBotState.status}.`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsThinking(false);
    }, 450);
  };

  return (
    <div className="bg-[#0D1017] border border-[#232A3B] rounded-2xl p-5 sm:p-7 space-y-5 text-left shadow-xl flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E2536] pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>ASK OPHIREUM — SIMULATION ANALYST</span>
              <span className="px-2 py-0.5 rounded bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#E4C765] text-[10px] font-mono font-bold">
                DEMO MODE
              </span>
            </h3>
            <div className="text-[11px] text-zinc-400">
              Deterministic responses strictly prefixed: <em>"Based on your simulated demo account..."</em>
            </div>
          </div>
        </div>
      </div>

      {/* Canned Quick Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none text-xs">
        {cannedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleAsk(q)}
            className="px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1E2536] border border-[#2B354C] text-zinc-300 hover:text-white whitespace-nowrap text-[11px] transition-colors cursor-pointer shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 rounded-xl bg-[#090B10] border border-[#181E2B] text-xs">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#C9A227] text-[#08090B] font-medium'
                  : 'bg-[#141824] border border-[#232A3B] text-zinc-200'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] font-mono text-zinc-500 mt-1 px-1">{m.time}</span>
          </div>
        ))}
        {isThinking && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs italic p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#E4C765]" />
            <span>Analyzing simulated state...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleAsk(input);
        }}
        className="flex gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Ophireum about your simulated positions or engine state..."
          className="flex-1 bg-[#121622] border border-[#232A3B] rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#C9A227] outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-xs hover:brightness-110 transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
