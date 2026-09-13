/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM ASSISTANT DOMAIN & TYPE DEFINITIONS
 * Strict types for conversational workspace, market scanner, structured analysis,
 * subscriptions, transparent credit ledger, voice, and file safety.
 */

export type AssistantRole = 'guest' | 'free' | 'trader' | 'professional' | 'institutional' | 'support' | 'analyst' | 'admin';

export type PlanTierId = 'discover' | 'trader' | 'professional' | 'institutional';

export interface AssistantPlanConfig {
  id: PlanTierId;
  name: string;
  badge: string;
  tagline: string;
  priceMonthlyUSDT: number;
  priceAnnualUSDT: number;
  monthlyCredits: number;
  dailyMessagesLimit: number;
  dailyVoiceMinutesLimit: number;
  maxFileSizeMB: number;
  maxContextTokens: number;
  measurableRatioNote?: string;
  features: string[];
  popular?: boolean;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number; // Negative for consumption, positive for grant/purchase/refund
  actionType:
    | 'STANDARD_CHAT'
    | 'ADVANCED_REASONING'
    | 'LIVE_MARKET_SCAN'
    | 'VOICE_TRANSCRIPTION'
    | 'VOICE_SYNTHESIS'
    | 'CHART_IMAGE_ANALYSIS'
    | 'DOCUMENT_ANALYSIS'
    | 'REPORT_GENERATION'
    | 'MONTHLY_REFILL'
    | 'PACK_PURCHASE'
    | 'FAILED_REQUEST_REFUND'
    | 'ADMIN_MANUAL_ADJUSTMENT';
  description: string;
  timestamp: string;
  balanceAfter: number;
  idempotencyKey?: string;
}

export interface CreditWallet {
  userId: string;
  balance: number;
  planId: PlanTierId;
  monthlyAllowance: number;
  purchasedBalance: number;
  lastRefillTimestamp: string;
  dailyMessagesUsedToday: number;
  dailyVoiceMinutesUsedToday: number;
  lastResetDay: string;
}

export interface StructuredMarketAnalysis {
  marketSummary: string;
  currentMarketRegime: 'Trending Bullish' | 'Trending Bearish' | 'Range-Bound / Consolidating' | 'High Volatility Breakout' | 'Liquidity Hunt / Compression';
  principalBullishDrivers: string[];
  principalBearishDrivers: string[];
  importantEconomicEvents: string[];
  technicalStructure: string;
  keyAreasToMonitor: string[];
  bullishScenario: string;
  bearishScenario: string;
  invalidationConditions: string;
  riskConsiderations: string;
  sourcesAndTimestamp: {
    instrument: string;
    source: string;
    timestamp: string;
    status: 'live' | 'delayed' | 'cached' | 'offline';
    citationUrl?: string;
  }[];
}

export interface AssistantCitation {
  id: string;
  title: string;
  source: string;
  url?: string;
  timestamp: string;
  snippet: string;
  dataType: 'official_ophireum' | 'central_bank' | 'economic_data' | 'live_market_tick' | 'financial_news';
}

export interface UploadedMarketFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: 'chart_screenshot' | 'pdf_report' | 'csv_data' | 'xlsx_journal' | 'research_notes';
  dataUrl?: string;
  previewUrl?: string;
  textContent?: string;
  uploadedAt: string;
}

export interface AssistantMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: AssistantCitation[];
  structuredAnalysis?: StructuredMarketAnalysis;
  attachedFiles?: UploadedMarketFile[];
  feedback?: 'like' | 'dislike' | null;
  feedbackNote?: string;
  creditsConsumed?: number;
  isStreaming?: boolean;
  isInScope?: boolean;
  providerNotice?: string;
}

export interface AssistantConversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  archived: boolean;
  messageCount: number;
  tags?: string[];
  previewSnippet?: string;
}

export interface MarketTickerQuote {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePct24h: number;
  high24h: number;
  low24h: number;
  bid: number;
  ask: number;
  spread: number;
  provider: string;
  status: 'live' | 'delayed' | 'cached';
  timestamp: string;
  category: 'gold' | 'forex' | 'indices' | 'bonds' | 'energy';
}

export interface EconomicCalendarItem {
  id: string;
  title: string;
  currency: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  scheduledUtc: string;
  forecast?: string;
  previous?: string;
  actual?: string;
  source: string;
}

export interface MarketSessionInfo {
  sessionName: 'Tokyo (Asia)' | 'London (Europe)' | 'New York (Americas)' | 'Sydney (Pacific)';
  status: 'OPEN' | 'CLOSED' | 'OVERLAP';
  opensUtc: string;
  closesUtc: string;
  activeLiquidityTier: 'Maximum' | 'High' | 'Moderate' | 'Low';
}

export interface TradingCalculatorInputs {
  accountBalanceUSD: number;
  riskPercentage: number;
  stopLossPips: number;
  pairSymbol: string;
  pipValuePerLotUSD?: number;
  entryPrice?: number;
  takeProfitPrice?: number;
  leverage?: number;
}

export interface TradingCalculatorOutputs {
  monetaryRiskUSD: number;
  recommendedLotSize: number;
  pipValueUSD: number;
  riskRewardRatio?: number;
  projectedProfitUSD?: number;
  requiredMarginUSD?: number;
  maxAllowableLossUSD: number;
}
