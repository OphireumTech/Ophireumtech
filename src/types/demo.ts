/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM DEMO / SIMULATION ENVIRONMENT DOMAIN TYPES
 * Strict mathematical, telemetry, KYC, and ledger models for the isolated simulation engine.
 */

export type DemoEnvironment = 'DEMO';
export type DemoDataSource = 'SIMULATION';

export interface DemoTradingAccount {
  accountNumber: string;
  brokerName: string;
  brokerServer: string;
  accountType: string;
  connectionStatus: 'CONNECTED — SIMULATED' | 'CONNECTING' | 'DISCONNECTED';
  currency: 'USD';
  leverage: string;
  startingBalance: number;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  floatingPL: number;
  floatingProfit?: number;
  realizedPL: number;
  todayRealizedPL: number;
  lastSyncTimestamp: string;
  dataSource: DemoDataSource;
  environment: DemoEnvironment;
  currentPrice?: number;
  winRate?: number;
  winningTrades?: number;
  losingTrades?: number;
  totalTrades?: number;
  profitFactor?: number;
  maxDrawdownPercent?: number;
  currentDrawdownPercent?: number;
  totalNetProfit?: number;
  grossProfit?: number;
  grossLoss?: number;
  averageWin?: number;
  averageLoss?: number;
}

export interface DemoPosition {
  id: string;
  ticket: number;
  symbol: 'XAUUSD';
  direction: 'BUY' | 'SELL';
  volume: number;
  openPrice: number;
  currentPrice: number;
  sl: number;
  tp: number;
  stopLoss?: number;
  takeProfit?: number;
  floatingPL: number;
  floatingProfit?: number;
  commission: number;
  swap: number;
  openTime: string;
  magicNumber: number;
  comment: string;
  environment: DemoEnvironment;
}

export interface DemoTrade {
  id: string;
  ticket: number;
  symbol: 'XAUUSD';
  direction: 'BUY' | 'SELL';
  volume: number;
  entryPrice: number;
  exitPrice: number;
  openPrice?: number;
  closePrice?: number;
  openTime: string;
  closeTime: string;
  grossPL: number;
  commission: number;
  swap: number;
  netPL: number;
  netProfit?: number;
  executionSource: string;
  eaVersion: string;
  account: string;
  environment: DemoEnvironment;
  closeReason: 'TAKE_PROFIT' | 'STOP_LOSS' | 'MANUAL_OVERRIDE' | 'NEWS_PROTECTION' | 'TRAILING_SL';
  slippagePips: number;
}

export interface DemoPerformanceMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  grossProfit: number;
  grossLoss: number;
  netPL: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  maxDrawdown: number;
  maxDrawdownPct: number;
  currentDrawdown: number;
  currentDrawdownPct: number;
  equityCurve: { timestamp: string; equity: number; balance: number }[];
}

export type DemoBotStatus =
  | 'INITIALIZING'
  | 'CONNECTED'
  | 'MONITORING'
  | 'SIGNAL DETECTED'
  | 'EXECUTION REQUEST'
  | 'ORDER SIMULATED'
  | 'POSITION OPEN'
  | 'MONITORING POSITION'
  | 'POSITION CLOSED'
  | 'PAUSED'
  | 'DISCONNECTED';

export interface DemoBotActivityLog {
  id: string;
  timestamp: string;
  status: DemoBotStatus;
  message: string;
  type: 'info' | 'trade' | 'signal' | 'warning' | 'error';
}

export interface DemoBotState {
  status: DemoBotStatus;
  isBound: boolean;
  boundAccount: string;
  licenseStatus: 'ACTIVE — DEMO' | 'EXPIRED' | 'UNBOUND';
  connectionHealth: 'HEALTHY' | 'DEGRADED' | 'INTERRUPTED';
  lastHeartbeat: string;
  heartbeatIntervalSec: number;
  activityLog: DemoBotActivityLog[];
}

export type DemoKYCStep =
  | 'NOT_STARTED'
  | 'DOCUMENT RECEIVED'
  | 'OCR PROCESSING'
  | 'DOCUMENT ANALYSIS'
  | 'LIVENESS CHECK'
  | 'IDENTITY MATCHING'
  | 'DUPLICATE SCREENING'
  | 'COMPLIANCE REVIEW'
  | 'VERIFIED — DEMO'
  | 'REJECTED — DEMO';

export interface DemoKYCProfile {
  entityType: 'INDIVIDUAL' | 'BUSINESS';
  accountType?: 'INDIVIDUAL' | 'BUSINESS';
  status: DemoKYCStep;
  ocid: string;
  documentType: 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID' | 'CERTIFICATE_OF_INC';
  documentFileName: string;
  firstName?: string;
  lastName?: string;
  documentNumber?: string;
  nationality?: string;
  extractedFields: {
    fullName: string;
    dob: string;
    docNumber: string;
    nationality: string;
    expiryDate: string;
    address: string;
    taxOrRegNumber?: string;
  };
  ocrConfidence: number;
  livenessPassed: boolean;
  duplicateResult: 'NO MATCH' | 'POSSIBLE MATCH' | 'MANUAL REVIEW' | 'CONFIRMED DUPLICATE — DEMO';
  duplicateScreening?: {
    status: 'PASSED' | 'FLAGGED' | 'MANUAL_REVIEW';
    matchedFields: string[];
    riskScore: number;
  };
  complianceNotes: string;
  submittedAt: string | null;
  verifiedAt: string | null;
  environment: DemoEnvironment;
}

export interface DemoMarketEvent {
  id: string;
  event: string;
  country: string;
  currency: string;
  scheduledTime: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  potentialMarketRelevance: string;
  goldRelevance?: string;
  reminderMinutes: number | null;
  countdown?: string;
  forecast?: string;
  previous?: string;
  actual?: string;
}

export interface DemoPaymentInvoice {
  id: string;
  orderId: string;
  planId: string;
  planName: string;
  amountUSDT: number;
  amount?: number;
  network: 'USDT-TRC20' | 'USDT-BEP20' | 'USDT-ERC20';
  demoDepositAddress: string;
  address?: string;
  status: 'INVOICE CREATED' | 'AWAITING PAYMENT' | 'PAYMENT DETECTED' | 'CONFIRMING' | 'CONFIRMED — DEMO' | 'LICENSE ACTIVATED';
  txHash?: string;
  createdAt: string;
  confirmedAt?: string;
  environment: DemoEnvironment;
}

export type DemoInvoice = DemoPaymentInvoice;
