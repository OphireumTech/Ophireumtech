/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Assistant Client API Bridge
 * Real-time SSE streaming reader, local guest allowance guard,
 * credit balance sync, domain compliance validation, and offline resilience.
 */

import {
  AssistantMessage,
  AssistantConversation,
  CreditWallet,
  CreditTransaction,
  AssistantPlanConfig,
  PlanTierId,
  StructuredMarketAnalysis
} from '../types/assistant';

const GUEST_STORAGE_KEY = 'ophireum_assistant_guest_count';
const GUEST_MAX_QUERIES = 3;

export const DEFAULT_ASSISTANT_PLANS: AssistantPlanConfig[] = [
  {
    id: 'discover',
    name: 'Ophireum Discover',
    badge: 'Free Tier',
    tagline: 'Foundational macro intelligence & trading discipline tools',
    priceMonthlyUSDT: 0,
    priceAnnualUSDT: 0,
    monthlyCredits: 100,
    dailyMessagesLimit: 10,
    dailyVoiceMinutesLimit: 2,
    maxFileSizeMB: 2,
    maxContextTokens: 4000,
    features: [
      '10 messages per day',
      '2 voice minutes per day',
      '100 monthly included credits',
      'Basic market news scans',
      'Position size & pip value calculators',
      '7-day conversation history',
      'Standard response speed'
    ]
  },
  {
    id: 'trader',
    name: 'Ophireum Trader',
    badge: 'Active Practitioner',
    tagline: 'High-frequency analysis, chart vision & market scans',
    priceMonthlyUSDT: 29,
    priceAnnualUSDT: 290,
    monthlyCredits: 1000,
    dailyMessagesLimit: 100,
    dailyVoiceMinutesLimit: 20,
    maxFileSizeMB: 10,
    maxContextTokens: 16000,
    popular: true,
    features: [
      '100 messages per day',
      '20 voice minutes per day',
      '1,000 monthly credits + pack top-ups',
      'PNG/JPG chart screenshot vision analysis',
      'Multi-currency strength scanner',
      'Custom watchlists & price alerts',
      'Daily curated market briefing',
      'Export conversations to PDF / JSON',
      'Continuous chat history'
    ]
  },
  {
    id: 'professional',
    name: 'Ophireum Professional',
    badge: '5x Measured Capacity',
    tagline: 'Institutional-depth reasoning, journal diagnostics & gold workspace',
    priceMonthlyUSDT: 79,
    priceAnnualUSDT: 790,
    monthlyCredits: 5000,
    dailyMessagesLimit: 500,
    dailyVoiceMinutesLimit: 100,
    maxFileSizeMB: 25,
    maxContextTokens: 64000,
    measurableRatioNote: 'Exactly 5x measured allowance of Trader (500 msgs/day, 100 voice mins/day, 5,000 credits/mo, 25MB file ceiling)',
    features: [
      '500 messages per day (5x Trader)',
      '100 voice minutes per day (5x Trader)',
      '5,000 monthly credits (5x Trader)',
      'Advanced multi-step reasoning models',
      'Expanded PDF/CSV/XLSX file analysis (up to 25MB)',
      'Trading journal ledger analysis (XLSX/CSV)',
      'Dedicated Gold (XAUUSD) Macro Workspace',
      'Real-time central bank policy monitors',
      'Weekly institutional market outlook reports',
      'Priority server queue'
    ]
  },
  {
    id: 'institutional',
    name: 'Ophireum Institutional',
    badge: 'Team & Desk',
    tagline: 'Multi-seat desk collaboration, audit compliance & custom integration',
    priceMonthlyUSDT: 249,
    priceAnnualUSDT: 2490,
    monthlyCredits: 20000,
    dailyMessagesLimit: 2500,
    dailyVoiceMinutesLimit: 500,
    maxFileSizeMB: 50,
    maxContextTokens: 128000,
    features: [
      'Multi-seat team workspace (5 included seats)',
      '20,000 monthly team credits pool',
      'Shared watchlists & institutional research library',
      'Role-based access & compliance audit logs',
      'Direct FIX / WebRequest market data allowances',
      'Custom prompt policy & knowledge-base binding',
      'Centralized corporate billing in USDT',
      'Dedicated institutional relationship desk'
    ]
  }
];

export function getGuestQueryCount(): number {
  if (typeof window === 'undefined') return 0;
  const val = localStorage.getItem(GUEST_STORAGE_KEY);
  return val ? parseInt(val, 10) || 0 : 0;
}

export function incrementGuestQueryCount(): number {
  if (typeof window === 'undefined') return 1;
  const current = getGuestQueryCount();
  const next = current + 1;
  localStorage.setItem(GUEST_STORAGE_KEY, next.toString());
  return next;
}

export function isGuestAllowanceConsumed(): boolean {
  return getGuestQueryCount() >= GUEST_MAX_QUERIES;
}

export function getInitialWallet(userId: string, plan: PlanTierId = 'discover'): CreditWallet {
  const planConfig = DEFAULT_ASSISTANT_PLANS.find(p => p.id === plan) || DEFAULT_ASSISTANT_PLANS[0];
  return {
    userId,
    balance: planConfig.monthlyCredits,
    planId: plan,
    monthlyAllowance: planConfig.monthlyCredits,
    purchasedBalance: 0,
    lastRefillTimestamp: new Date().toISOString(),
    dailyMessagesUsedToday: 0,
    dailyVoiceMinutesUsedToday: 0,
    lastResetDay: new Date().toISOString().slice(0, 10)
  };
}

/**
 * Client-Side Domain Classifier to immediately flag clear out-of-scope topics
 * (medical, homework, entertainment, relationships, etc.)
 */
export function classifyQueryScope(prompt: string): { isInScope: boolean; refusalReason?: string } {
  const lower = prompt.toLowerCase();

  // Explicitly banned unrelated areas unless financial markets context is present
  const outOfScopeKeywords = [
    'cure my disease',
    'medical diagnosis',
    'prescription drug',
    'symptoms of cancer',
    'write my history essay',
    'solve my calculus homework',
    'movie spoiler',
    'celebrity gossip',
    'breakup advice',
    'love advice',
    'dating tips',
    'gaming cheat codes',
    'minecraft recipe',
    'who won the oscars',
    'political election betting advice'
  ];

  // If prompt explicitly matches pure unrelated themes without market terms
  const hasMarketContext = /gold|xauusd|forex|usd|eur|gbp|jpy|stock|bond|cpi|inflation|fomc|fed|central bank|technical analysis|support|resistance|pip|lot|ea|mt5|broker|trade|trading|chart|liquidity|risk|vps/i.test(lower);

  for (const phrase of outOfScopeKeywords) {
    if (lower.includes(phrase) && !hasMarketContext) {
      return {
        isInScope: false,
        refusalReason:
          "I’m Ophireum Assistant, a specialized market-intelligence and trading-education assistant. I can help with forex, commodities, gold, global market developments, technical and fundamental analysis, risk management, trading technology, and Ophireum services."
      };
    }
  }

  return { isInScope: true };
}

/**
 * Send Chat Request to Server-Side Model Gateway with streaming SSE support
 */
export async function streamAssistantChat(params: {
  message: string;
  conversationHistory: { role: 'user' | 'assistant'; content: string }[];
  planId: PlanTierId;
  authToken?: string;
  files?: { name: string; type: string; base64Data: string }[];
  onChunk: (chunkText: string) => void;
  onDone: (result: {
    fullText: string;
    citations: any[];
    structuredAnalysis?: StructuredMarketAnalysis;
    creditsConsumed: number;
    isInScope: boolean;
  }) => void;
  onError: (error: Error) => void;
  signal?: AbortSignal;
}) {
  const { message, conversationHistory, planId, authToken, files, onChunk, onDone, onError, signal } = params;

  // Immediate domain pre-check
  const scopeCheck = classifyQueryScope(message);
  if (!scopeCheck.isInScope) {
    const refusal = scopeCheck.refusalReason!;
    onChunk(refusal);
    onDone({
      fullText: refusal,
      citations: [],
      creditsConsumed: 0,
      isInScope: false
    });
    return;
  }

  try {
    const response = await fetch('/api/v1/assistant/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify({
        message,
        history: conversationHistory.slice(-8), // Keep recent context
        planId,
        files: files || []
      }),
      signal
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || `Server responded with status ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';

    // Handle Streaming SSE
    if (contentType.includes('text/event-stream') && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullText = '';
      let citations: any[] = [];
      let structuredAnalysis: StructuredMarketAnalysis | undefined;
      let creditsConsumed = 1;
      let isInScope = true;

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const dataStr = trimmed.substring(6);

          if (dataStr === '[DONE]') {
            continue;
          }

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.chunk) {
              fullText += parsed.chunk;
              onChunk(parsed.chunk);
            }
            if (parsed.citations) {
              citations = parsed.citations;
            }
            if (parsed.structuredAnalysis) {
              structuredAnalysis = parsed.structuredAnalysis;
            }
            if (parsed.creditsConsumed !== undefined) {
              creditsConsumed = parsed.creditsConsumed;
            }
            if (parsed.isInScope !== undefined) {
              isInScope = parsed.isInScope;
            }
          } catch {
            // Raw text chunk
            fullText += dataStr;
            onChunk(dataStr);
          }
        }
      }

      onDone({
        fullText,
        citations,
        structuredAnalysis,
        creditsConsumed,
        isInScope
      });
    } else {
      // Standard JSON fallback
      const data = await response.json();
      onChunk(data.response || data.text || '');
      onDone({
        fullText: data.response || data.text || '',
        citations: data.citations || [],
        structuredAnalysis: data.structuredAnalysis,
        creditsConsumed: data.creditsConsumed || 1,
        isInScope: data.isInScope !== false
      });
    }
  } catch (err: any) {
    if (signal?.aborted) {
      return;
    }
    onError(err);
  }
}
