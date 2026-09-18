/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Global Ask Ophireum Assistant
 * Sections 26 & 27: Globally accessible floating assistant with contextual prompt suggestions
 * tailored directly to the page/view the customer is currently inspecting.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, CornerDownLeft, Shield, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface GlobalAskOphireumProps {
  currentTab: string;
  isOpen?: boolean;
  onClose?: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export const GlobalAskOphireum: React.FC<GlobalAskOphireumProps> = ({
  currentTab,
  isOpen = false,
  onClose
}) => {
  const { currentUser, isDemoSession } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Good day. I am your Ophireum Expert Assistant. How may I assist you with your institutional trading infrastructure or account today?',
      time: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Contextual question prompts depending on active tab
  const getContextualPrompts = (tab: string): string[] => {
    switch (tab) {
      case 'verification':
        return [
          'What documents are accepted for verification?',
          'How long does verification review take?',
          'Is my personal data encrypted?'
        ];
      case 'subscription':
      case 'billing':
        return [
          'When does my current license expire?',
          'Which networks are supported for USDT?',
          'How do I upgrade to the Enterprise plan?'
        ];
      case 'connect-account':
        return [
          'Which brokers are approved for Ophireum?',
          'How do I find my MT5 server name?',
          'Is my investor password sufficient?'
        ];
      case 'charts':
        return [
          'Explain the Smart Money Concepts (SMC) indicator.',
          'What is the difference between BOS and CHoCH?',
          'How does Ophireum identify Order Blocks on XAUUSD?'
        ];
      case 'trading-monitor':
      case 'performance':
        return [
          'Explain my latest closed trade result.',
          'What is my maximum drawdown risk limit?',
          'Is this trading monitor view-only?'
        ];
      case 'bot-control':
        return [
          'Is Ophireum currently monitoring XAUUSD?',
          'What happens during high-impact news?',
          'How do I temporarily pause automated execution?'
        ];
      case 'security':
        return [
          'How do I enable two-factor authentication?',
          'Are my trading credentials exposed?',
          'How do I terminate other active sessions?'
        ];
      default:
        return [
          'Is my account completely verified?',
          'What is Ophireum\'s current trading status?',
          'What is the next high-impact market event?'
        ];
    }
  };

  const prompts = getContextualPrompts(currentTab);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = 'I have evaluated your query against our institutional operational standards.';
      const q = text.toLowerCase();

      if (q.includes('bos') || q.includes('break of structure')) {
        reply = 'A Break of Structure (BOS) occurs when the market price aggressively penetrates and closes beyond an existing swing high (bullish BOS) or swing low (bearish BOS), confirming trend continuation.';
      } else if (q.includes('choch') || q.includes('change of character')) {
        reply = 'A Change of Character (CHoCH) is the initial structural shift where price breaks the opposing swing level, signaling that the current market trend may be exhausting and reversing.';
      } else if (q.includes('order block')) {
        reply = 'Order Blocks represent institutional accumulation or distribution zones on XAUUSD where significant institutional volume was previously transacted before a decisive expansion.';
      } else if (q.includes('smc') || q.includes('luxalgo')) {
        reply = 'Smart Money Concepts (SMC) provided by LuxAlgo dynamically plots internal/swing structure, order blocks, and fair value gaps on our chart workspace to give you institutional-grade visual clarity.';
      } else if (q.includes('broker') || q.includes('approved')) {
        reply = 'Ophireum maintains rigorous execution benchmarks and officially supports Exness, IC Markets, Pepperstone, and XM for optimal MT5 raw spread latency on XAUUSD.';
      } else if (q.includes('status') || q.includes('running')) {
        reply = 'Ophireum Expert Assistant is currently RUNNING and actively monitoring the XAUUSD spot market within prescribed risk limits.';
      } else if (q.includes('view-only') || q.includes('manual')) {
        reply = 'Yes. The customer portal is primarily a view-only monitoring dashboard to safeguard algorithmic execution and prevent inadvertent manual interference.';
      } else if (q.includes('document') || q.includes('verification')) {
        reply = 'For Identity Verification, we accept government-issued Passports, National Identity Cards, or Driver\'s Licenses with clear high-resolution photos.';
      } else if (q.includes('usdt') || q.includes('payment') || q.includes('network')) {
        reply = 'We support USDT settlement via USDT-TRC20 (Tron), USDT-BEP20 (BNB Smart Chain), and USDT-ERC20 (Ethereum). TRC20 and BEP20 offer the fastest block confirmation times.';
      } else if (q.includes('drawdown') || q.includes('risk')) {
        reply = 'Ophireum enforces strict automated stop-loss protection with maximum daily exposure caps and news halts to shield your trading capital.';
      } else {
        reply = `Regarding "${text}": All account telemetry, licensing, and risk controls are operating within normal parameters. You can monitor live performance in the Trading Monitor tab.`;
      }

      const botMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#090C12] border-l border-[#1E2538] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-[#1E2538] flex items-center justify-between bg-[#0D1017]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#E4C765]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white font-serif">OPHIREUM ASSISTANT</div>
            <div className="text-[10px] text-zinc-400">Institutional AI Guidance</div>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant panel"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#141926] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#C9A227] text-black font-medium'
                  : 'bg-[#121622] border border-[#1E2538] text-zinc-200'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[9px] text-zinc-500 mt-1 px-1">{msg.time}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#121622] border border-[#1E2538] w-fit text-xs text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Contextual Suggestions for Current Page (Section 27) */}
      <div className="p-3 bg-[#0D1017] border-t border-[#181E2B] space-y-1.5">
        <div className="text-[10px] uppercase font-semibold tracking-wider text-zinc-400 px-1">
          Suggested for this view:
        </div>
        <div className="flex flex-col gap-1">
          {prompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              className="w-full text-left px-2.5 py-1.5 rounded-lg bg-[#141926] hover:bg-[#1C2336] border border-[#222B3D] text-[11px] text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center justify-between group"
            >
              <span className="truncate">{prompt}</span>
              <ArrowRight className="w-3 h-3 text-[#C9A227] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-[#1E2538] bg-[#090C12]">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend(inputVal);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Ask about your account, trades, or SMC..."
            className="flex-1 bg-[#121622] border border-[#222B3D] rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#C9A227]"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2 rounded-xl bg-[#C9A227] hover:bg-[#E4C765] disabled:opacity-40 text-black cursor-pointer transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
