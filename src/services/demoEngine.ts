/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM DEMO SIMULATION ENGINE
 * Deterministic mathematical trading simulator, telemetry generator, KYC state machine,
 * and isolated demo ledger strictly segregated from production financial infrastructure.
 */

import {
  DemoTradingAccount,
  DemoPosition,
  DemoTrade,
  DemoPerformanceMetrics,
  DemoBotState,
  DemoBotStatus,
  DemoBotActivityLog,
  DemoKYCProfile,
  DemoKYCStep,
  DemoMarketEvent,
  DemoPaymentInvoice
} from '../types/demo';

// Helper to generate cryptographically compliant 9-character OCID (A-Z, 0-9)
export function generateDemoOCID(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Unambiguous uppercase alphanumeric
  let result = '';
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const SEED_OCID = 'A7K29P4XQ';

// Initial realistic historical trade ledger (Includes both WINNERS and LOSERS)
const INITIAL_DEMO_TRADES: DemoTrade[] = [
  {
    id: 'DEMO-TRD-101',
    ticket: 8849101,
    symbol: 'XAUUSD',
    direction: 'BUY',
    volume: 0.15,
    entryPrice: 2894.20,
    exitPrice: 2908.40,
    openTime: '2026-09-15 08:30:14',
    closeTime: '2026-09-15 11:45:22',
    grossPL: 213.00,
    commission: -4.50,
    swap: -1.20,
    netPL: 207.30,
    executionSource: 'OPHIREUM EXPERT ASSISTANT — SIMULATION',
    eaVersion: '2.4.1',
    account: 'DEMO-2026-001',
    environment: 'DEMO',
    closeReason: 'TAKE_PROFIT',
    slippagePips: 0.4
  },
  {
    id: 'DEMO-TRD-102',
    ticket: 8849102,
    symbol: 'XAUUSD',
    direction: 'SELL',
    volume: 0.15,
    entryPrice: 2912.80,
    exitPrice: 2919.10,
    openTime: '2026-09-15 14:15:02',
    closeTime: '2026-09-15 15:02:40',
    grossPL: -94.50,
    commission: -4.50,
    swap: 0.00,
    netPL: -99.00,
    executionSource: 'OPHIREUM EXPERT ASSISTANT — SIMULATION',
    eaVersion: '2.4.1',
    account: 'DEMO-2026-001',
    environment: 'DEMO',
    closeReason: 'STOP_LOSS',
    slippagePips: 0.8
  },
  {
    id: 'DEMO-TRD-103',
    ticket: 8849103,
    symbol: 'XAUUSD',
    direction: 'BUY',
    volume: 0.20,
    entryPrice: 2902.50,
    exitPrice: 2918.70,
    openTime: '2026-09-16 09:10:35',
    closeTime: '2026-09-16 13:20:10',
    grossPL: 324.00,
    commission: -6.00,
    swap: -2.10,
    netPL: 315.90,
    executionSource: 'OPHIREUM EXPERT ASSISTANT — SIMULATION',
    eaVersion: '2.4.1',
    account: 'DEMO-2026-001',
    environment: 'DEMO',
    closeReason: 'TRAILING_SL',
    slippagePips: 0.2
  },
  {
    id: 'DEMO-TRD-104',
    ticket: 8849104,
    symbol: 'XAUUSD',
    direction: 'SELL',
    volume: 0.10,
    entryPrice: 2922.30,
    exitPrice: 2928.00,
    openTime: '2026-09-16 16:45:12',
    closeTime: '2026-09-16 17:30:55',
    grossPL: -57.00,
    commission: -3.00,
    swap: 0.00,
    netPL: -60.00,
    executionSource: 'OPHIREUM EXPERT ASSISTANT — SIMULATION',
    eaVersion: '2.4.1',
    account: 'DEMO-2026-001',
    environment: 'DEMO',
    closeReason: 'STOP_LOSS',
    slippagePips: 0.6
  },
  {
    id: 'DEMO-TRD-105',
    ticket: 8849105,
    symbol: 'XAUUSD',
    direction: 'BUY',
    volume: 0.25,
    entryPrice: 2898.60,
    exitPrice: 2914.20,
    openTime: '2026-09-17 07:45:00',
    closeTime: '2026-09-17 12:10:19',
    grossPL: 390.00,
    commission: -7.50,
    swap: -3.20,
    netPL: 379.30,
    executionSource: 'OPHIREUM EXPERT ASSISTANT — SIMULATION',
    eaVersion: '2.4.1',
    account: 'DEMO-2026-001',
    environment: 'DEMO',
    closeReason: 'TAKE_PROFIT',
    slippagePips: 0.3
  },
  {
    id: 'DEMO-TRD-106',
    ticket: 8849106,
    symbol: 'XAUUSD',
    direction: 'BUY',
    volume: 0.15,
    entryPrice: 2915.10,
    exitPrice: 2910.40,
    openTime: '2026-09-17 15:30:20',
    closeTime: '2026-09-17 16:15:45',
    grossPL: -70.50,
    commission: -4.50,
    swap: 0.00,
    netPL: -75.00,
    executionSource: 'OPHIREUM EXPERT ASSISTANT — SIMULATION',
    eaVersion: '2.4.1',
    account: 'DEMO-2026-001',
    environment: 'DEMO',
    closeReason: 'NEWS_PROTECTION',
    slippagePips: 0.5
  },
  {
    id: 'DEMO-TRD-107',
    ticket: 8849107,
    symbol: 'XAUUSD',
    direction: 'SELL',
    volume: 0.20,
    entryPrice: 2924.50,
    exitPrice: 2911.20,
    openTime: '2026-09-17 19:10:04',
    closeTime: '2026-09-17 22:40:30',
    grossPL: 266.00,
    commission: -6.00,
    swap: -1.50,
    netPL: 258.50,
    executionSource: 'OPHIREUM EXPERT ASSISTANT — SIMULATION',
    eaVersion: '2.4.1',
    account: 'DEMO-2026-001',
    environment: 'DEMO',
    closeReason: 'TAKE_PROFIT',
    slippagePips: 0.2
  }
];

// Initial active simulated position
const INITIAL_DEMO_POSITIONS: DemoPosition[] = [
  {
    id: 'DEMO-POS-201',
    ticket: 8849108,
    symbol: 'XAUUSD',
    direction: 'BUY',
    volume: 0.15,
    openPrice: 2908.40,
    currentPrice: 2912.85,
    sl: 2898.00,
    tp: 2928.00,
    floatingPL: 66.75, // (2912.85 - 2908.40) * 15 oz = 66.75
    commission: -4.50,
    swap: 0.00,
    openTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    magicNumber: 202609,
    comment: 'OPH_M15_ALGO_BREAKOUT',
    environment: 'DEMO'
  }
];

// Initial scheduled economic calendar for demo
const INITIAL_DEMO_MARKET_EVENTS: DemoMarketEvent[] = [
  {
    id: 'EVT-01',
    event: 'US Core CPI YoY (Inflation Benchmark)',
    country: 'United States',
    currency: 'USD',
    scheduledTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    impact: 'HIGH',
    potentialMarketRelevance: 'Primary US inflation print; expected high volatility in XAUUSD spreads and intraday directional momentum.',
    reminderMinutes: 30
  },
  {
    id: 'EVT-02',
    event: 'FOMC Press Conference & Rate Decision',
    country: 'United States',
    currency: 'USD',
    scheduledTime: new Date(Date.now() + 26 * 3600 * 1000).toISOString(),
    impact: 'HIGH',
    potentialMarketRelevance: 'Federal Reserve monetary policy guidance directly impacts gold real-yield opportunity cost.',
    reminderMinutes: 60
  },
  {
    id: 'EVT-03',
    event: 'US Initial Jobless Claims',
    country: 'United States',
    currency: 'USD',
    scheduledTime: new Date(Date.now() + 50 * 3600 * 1000).toISOString(),
    impact: 'MEDIUM',
    potentialMarketRelevance: 'Labor market indicator; typical short-term price fluctuations on gold 15-minute timeframe.',
    reminderMinutes: null
  },
  {
    id: 'EVT-04',
    event: 'World Gold Council Demand & Central Bank Reserves',
    country: 'Global / IMF',
    currency: 'XAU',
    scheduledTime: new Date(Date.now() + 74 * 3600 * 1000).toISOString(),
    impact: 'LOW',
    potentialMarketRelevance: 'Macro physical demand statistics; provides background liquidity context for institutional desk order flow.',
    reminderMinutes: null
  }
];

export class DemoSimulationEngine {
  private static instance: DemoSimulationEngine;

  private account: DemoTradingAccount;
  private positions: DemoPosition[];
  private tradeHistory: DemoTrade[];
  private marketEvents: DemoMarketEvent[];
  private kycProfile: DemoKYCProfile;
  private botState: DemoBotState;
  private invoices: DemoPaymentInvoice[] = [];
  private currentXauPrice: number = 2912.85;
  private priceDirection: number = 1;
  private speedMultiplier: number = 1; // 1x, 2x, 5x, 10x, 0 = paused
  private simulationInterval: any = null;
  private subscribers: Set<(state?: any) => void> = new Set();

  private constructor() {
    this.tradeHistory = [...INITIAL_DEMO_TRADES];
    this.positions = [...INITIAL_DEMO_POSITIONS];
    this.marketEvents = [...INITIAL_DEMO_MARKET_EVENTS];

    const startingBalance = 25000.00;
    const realizedPL = this.calculateRealizedPL();
    const floatingPL = this.calculateFloatingPL();
    const balance = startingBalance + realizedPL;
    const equity = balance + floatingPL;
    const margin = this.calculateUsedMargin();
    const freeMargin = equity - margin;
    const marginLevel = margin > 0 ? (equity / margin) * 100 : 0;

    this.account = {
      accountNumber: 'DEMO-2026-001',
      brokerName: 'OPHIREUM DEMO BROKERAGE',
      brokerServer: 'OPHIREUM-DEMO',
      accountType: 'Raw Spread / ECN',
      connectionStatus: 'CONNECTED — SIMULATED',
      currency: 'USD',
      leverage: '1:100',
      startingBalance,
      balance,
      equity,
      margin,
      freeMargin,
      marginLevel,
      floatingPL,
      realizedPL,
      todayRealizedPL: 497.00,
      lastSyncTimestamp: new Date().toISOString(),
      dataSource: 'SIMULATION',
      environment: 'DEMO'
    };

    this.kycProfile = {
      entityType: 'INDIVIDUAL',
      status: 'VERIFIED — DEMO',
      ocid: SEED_OCID,
      documentType: 'PASSPORT',
      documentFileName: 'synthetic_passport_demo.pdf',
      extractedFields: {
        fullName: 'Alexander Vance Hayes',
        dob: '1988-04-12',
        docNumber: 'P98421098',
        nationality: 'United States',
        expiryDate: '2032-11-20',
        address: '742 Financial Way, Ste 400, Chicago, IL 60606'
      },
      ocrConfidence: 99.2,
      livenessPassed: true,
      duplicateResult: 'NO MATCH',
      complianceNotes: 'Synthetic compliance record generated for development demonstration.',
      submittedAt: '2026-09-14T10:20:00Z',
      verifiedAt: '2026-09-14T10:21:45Z',
      environment: 'DEMO'
    };

    this.botState = {
      status: 'MONITORING',
      isBound: true,
      boundAccount: 'DEMO-2026-001',
      licenseStatus: 'ACTIVE — DEMO',
      connectionHealth: 'HEALTHY',
      lastHeartbeat: new Date().toISOString(),
      heartbeatIntervalSec: 5,
      activityLog: [
        {
          id: 'LOG-01',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          status: 'CONNECTED',
          message: 'Connected to MT5 simulated terminal environment (OPHIREUM-DEMO)',
          type: 'info'
        },
        {
          id: 'LOG-02',
          timestamp: new Date(Date.now() - 90000).toISOString(),
          status: 'MONITORING',
          message: 'Subscribed to XAUUSD simulated feed. Spread: 0.25 | M15 ATR: 4.82',
          type: 'info'
        },
        {
          id: 'LOG-03',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          status: 'SIGNAL DETECTED',
          message: 'Quant condition satisfied: Confluence Score 9.4/10 across 19 matrix signals',
          type: 'signal'
        },
        {
          id: 'LOG-04',
          timestamp: new Date(Date.now() - 45000).toISOString(),
          status: 'ORDER SIMULATED',
          message: 'Simulated BUY order dispatched: 0.15 lots @ 2908.40 (SL: 2898.00 / TP: 2928.00)',
          type: 'trade'
        },
        {
          id: 'LOG-05',
          timestamp: new Date(Date.now() - 30000).toISOString(),
          status: 'POSITION OPEN',
          message: 'Position #8849108 confirmed open. Dynamic trailing stop active.',
          type: 'trade'
        },
        {
          id: 'LOG-06',
          timestamp: new Date(Date.now() - 5000).toISOString(),
          status: 'MONITORING POSITION',
          message: 'Heartbeat validated. Zero packet loss. Floating P/L updating dynamically.',
          type: 'info'
        }
      ]
    };

    this.invoices = [
      {
        id: 'DEMO-INV-771829',
        orderId: 'DEMO-ORD-119283',
        planId: 'professional',
        planName: 'Professional',
        amountUSDT: 1499,
        amount: 1499,
        network: 'USDT-TRC20',
        demoDepositAddress: 'T9yD14Nj9j7xAB4dbGeiX9h8unkkhxmTrcDemo',
        address: 'T9yD14Nj9j7xAB4dbGeiX9h8unkkhxmTrcDemo',
        status: 'INVOICE CREATED',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        environment: 'DEMO'
      }
    ];

    this.startLoop();
  }

  public static getInstance(): DemoSimulationEngine {
    if (!DemoSimulationEngine.instance) {
      DemoSimulationEngine.instance = new DemoSimulationEngine();
    }
    return DemoSimulationEngine.instance;
  }

  // Subscribe to state changes
  public subscribe(listener: (state?: any) => void): () => void {
    this.subscribers.add(listener);
    return () => {
      this.subscribers.delete(listener);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.subscribers.forEach(cb => cb(currentState));
  }

  // Internal loop for simulated market movement & bot heartbeat
  private startLoop() {
    if (this.simulationInterval) clearInterval(this.simulationInterval);

    this.simulationInterval = setInterval(() => {
      if (this.speedMultiplier === 0) return; // Paused

      // 1. Oscillate gold spot price with realistic volatility
      const step = (Math.random() * 0.45 - 0.20) * this.speedMultiplier;
      this.currentXauPrice = Math.max(2850, Math.min(2980, parseFloat((this.currentXauPrice + step).toFixed(2))));

      // 2. Update open positions' floating P/L
      this.positions = this.positions.map(pos => {
        let diff = 0;
        if (pos.direction === 'BUY') {
          diff = this.currentXauPrice - pos.openPrice;
        } else {
          diff = pos.openPrice - this.currentXauPrice;
        }
        // 1 lot of XAUUSD = 100 oz. 0.15 lot = 15 oz.
        const oz = pos.volume * 100;
        const floatingPL = parseFloat((diff * oz + pos.commission + pos.swap).toFixed(2));
        return {
          ...pos,
          currentPrice: this.currentXauPrice,
          floatingPL
        };
      });

      // 3. Recalculate deterministic account balance & equity
      const floatingPL = this.calculateFloatingPL();
      const equity = parseFloat((this.account.balance + floatingPL).toFixed(2));
      const margin = this.calculateUsedMargin();
      const freeMargin = parseFloat((equity - margin).toFixed(2));
      const marginLevel = margin > 0 ? parseFloat(((equity / margin) * 100).toFixed(1)) : 0;

      this.account = {
        ...this.account,
        equity,
        floatingPL,
        margin,
        freeMargin,
        marginLevel,
        lastSyncTimestamp: new Date().toISOString()
      };

      // 4. Update bot heartbeat
      this.botState = {
        ...this.botState,
        lastHeartbeat: new Date().toISOString()
      };

      this.notify();
    }, 2500);
  }

  // Getters
  public getAccount(): DemoTradingAccount {
    return { ...this.account };
  }

  public getPositions(): DemoPosition[] {
    return [...this.positions];
  }

  public getTradeHistory(): DemoTrade[] {
    return [...this.tradeHistory];
  }

  public getKYCProfile(): DemoKYCProfile {
    return { ...this.kycProfile };
  }

  public getBotState(): DemoBotState {
    return { ...this.botState };
  }

  public getMarketEvents(): DemoMarketEvent[] {
    return [...this.marketEvents];
  }

  public getCurrentPrice(): { symbol: string; price: number; bid: number; ask: number; spread: number } {
    const spread = 0.25;
    const bid = parseFloat((this.currentXauPrice - spread / 2).toFixed(2));
    const ask = parseFloat((this.currentXauPrice + spread / 2).toFixed(2));
    return {
      symbol: 'XAUUSD',
      price: this.currentXauPrice,
      bid,
      ask,
      spread
    };
  }

  public getSpeed(): number {
    return this.speedMultiplier;
  }

  // Set Speed Control
  public setSpeed(multiplier: number) {
    this.speedMultiplier = multiplier;
    this.notify();
  }

  // Derived Performance Metrics (Dynamically calculated from ledger)
  public getPerformanceMetrics(): DemoPerformanceMetrics {
    const trades = this.tradeHistory;
    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => t.netPL > 0).length;
    const losingTrades = trades.filter(t => t.netPL < 0).length;
    const winRate = totalTrades > 0 ? parseFloat(((winningTrades / totalTrades) * 100).toFixed(1)) : 0;

    let grossProfit = 0;
    let grossLoss = 0;
    trades.forEach(t => {
      if (t.netPL > 0) grossProfit += t.netPL;
      else grossLoss += Math.abs(t.netPL);
    });

    const netPL = parseFloat((grossProfit - grossLoss).toFixed(2));
    const avgWin = winningTrades > 0 ? parseFloat((grossProfit / winningTrades).toFixed(2)) : 0;
    const avgLoss = losingTrades > 0 ? parseFloat((grossLoss / losingTrades).toFixed(2)) : 0;
    const profitFactor = grossLoss > 0 ? parseFloat((grossProfit / grossLoss).toFixed(2)) : 99.9;

    // Build equity curve
    let runningBalance = this.account.startingBalance;
    let peakBalance = runningBalance;
    let maxDrawdown = 0;
    let currentDrawdown = 0;

    const equityCurve: { timestamp: string; equity: number; balance: number }[] = [
      {
        timestamp: '2026-09-14 00:00',
        equity: this.account.startingBalance,
        balance: this.account.startingBalance
      }
    ];

    trades.forEach(t => {
      runningBalance += t.netPL;
      if (runningBalance > peakBalance) {
        peakBalance = runningBalance;
      }
      const dd = peakBalance - runningBalance;
      if (dd > maxDrawdown) maxDrawdown = dd;

      equityCurve.push({
        timestamp: t.closeTime.substring(5, 16),
        equity: parseFloat((runningBalance + (t.netPL > 0 ? 30 : -20)).toFixed(2)),
        balance: parseFloat(runningBalance.toFixed(2))
      });
    });

    currentDrawdown = Math.max(0, peakBalance - runningBalance);
    const maxDrawdownPct = peakBalance > 0 ? parseFloat(((maxDrawdown / peakBalance) * 100).toFixed(2)) : 0;
    const currentDrawdownPct = peakBalance > 0 ? parseFloat(((currentDrawdown / peakBalance) * 100).toFixed(2)) : 0;

    return {
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      grossProfit: parseFloat(grossProfit.toFixed(2)),
      grossLoss: parseFloat(grossLoss.toFixed(2)),
      netPL,
      avgWin,
      avgLoss,
      profitFactor,
      maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
      maxDrawdownPct,
      currentDrawdown: parseFloat(currentDrawdown.toFixed(2)),
      currentDrawdownPct,
      equityCurve
    };
  }

  // Actions for Demo Control Center
  public openSimulatedPosition(direction: 'BUY' | 'SELL', volume: number = 0.15) {
    const price = this.currentXauPrice;
    const sl = direction === 'BUY' ? price - 10 : price + 10;
    const tp = direction === 'BUY' ? price + 18 : price - 18;
    const ticket = Math.floor(8849000 + Math.random() * 1000);

    const newPos: DemoPosition = {
      id: `DEMO-POS-${Date.now()}`,
      ticket,
      symbol: 'XAUUSD',
      direction,
      volume,
      openPrice: price,
      currentPrice: price,
      sl: parseFloat(sl.toFixed(2)),
      tp: parseFloat(tp.toFixed(2)),
      floatingPL: 0,
      commission: parseFloat((-30 * volume).toFixed(2)),
      swap: 0,
      openTime: new Date().toISOString(),
      magicNumber: 202609,
      comment: 'OPH_SIMULATED_ORDER',
      environment: 'DEMO'
    };

    this.positions.push(newPos);
    this.addBotLog('POSITION OPEN', `Manual simulated ${direction} order filled: ${volume} lots @ ${price}`, 'trade');
    this.notify();
  }

  public closePosition(positionId: string, reason: DemoTrade['closeReason'] = 'MANUAL_OVERRIDE') {
    const idx = this.positions.findIndex(p => p.id === positionId);
    if (idx === -1) return;

    const pos = this.positions[idx];
    this.positions.splice(idx, 1);

    const exitPrice = this.currentXauPrice;
    const diff = pos.direction === 'BUY' ? exitPrice - pos.openPrice : pos.openPrice - exitPrice;
    const grossPL = parseFloat((diff * pos.volume * 100).toFixed(2));
    const netPL = parseFloat((grossPL + pos.commission + pos.swap).toFixed(2));

    const trade: DemoTrade = {
      id: `DEMO-TRD-${Date.now()}`,
      ticket: pos.ticket,
      symbol: 'XAUUSD',
      direction: pos.direction,
      volume: pos.volume,
      entryPrice: pos.openPrice,
      exitPrice,
      openTime: pos.openTime,
      closeTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      grossPL,
      commission: pos.commission,
      swap: pos.swap,
      netPL,
      executionSource: 'OPHIREUM EXPERT ASSISTANT — SIMULATION',
      eaVersion: '2.4.1',
      account: this.account.accountNumber,
      environment: 'DEMO',
      closeReason: reason,
      slippagePips: 0.3
    };

    this.tradeHistory.unshift(trade);
    this.account.balance = parseFloat((this.account.balance + netPL).toFixed(2));
    this.account.realizedPL = parseFloat((this.account.realizedPL + netPL).toFixed(2));

    this.addBotLog('POSITION CLOSED', `Simulated trade #${pos.ticket} closed @ ${exitPrice}. Net P/L: ${netPL >= 0 ? '+' : ''}$${netPL}`, 'trade');
    this.notify();
  }

  public triggerForceTrade(isWinner: boolean) {
    const volume = 0.20;
    const direction: 'BUY' | 'SELL' = Math.random() > 0.5 ? 'BUY' : 'SELL';
    const entryPrice = this.currentXauPrice;
    const exitPrice = isWinner
      ? direction === 'BUY' ? entryPrice + 12.50 : entryPrice - 12.50
      : direction === 'BUY' ? entryPrice - 8.20 : entryPrice + 8.20;

    const grossPL = parseFloat(((isWinner ? 12.50 : -8.20) * volume * 100).toFixed(2));
    const commission = -6.00;
    const netPL = parseFloat((grossPL + commission).toFixed(2));
    const ticket = Math.floor(8849000 + Math.random() * 1000);

    const trade: DemoTrade = {
      id: `DEMO-TRD-${Date.now()}`,
      ticket,
      symbol: 'XAUUSD',
      direction,
      volume,
      entryPrice: parseFloat(entryPrice.toFixed(2)),
      exitPrice: parseFloat(exitPrice.toFixed(2)),
      openTime: new Date(Date.now() - 30 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
      closeTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      grossPL,
      commission,
      swap: 0,
      netPL,
      executionSource: 'OPHIREUM EXPERT ASSISTANT — SIMULATION',
      eaVersion: '2.4.1',
      account: this.account.accountNumber,
      environment: 'DEMO',
      closeReason: isWinner ? 'TAKE_PROFIT' : 'STOP_LOSS',
      slippagePips: isWinner ? 0.2 : 0.7
    };

    this.tradeHistory.unshift(trade);
    this.account.balance = parseFloat((this.account.balance + netPL).toFixed(2));
    this.account.realizedPL = parseFloat((this.account.realizedPL + netPL).toFixed(2));

    this.addBotLog(
      'POSITION CLOSED',
      `Demonstration ${isWinner ? 'WINNING' : 'LOSING'} execution concluded. Ticket #${ticket} Net P/L: ${netPL >= 0 ? '+' : ''}$${netPL}`,
      isWinner ? 'trade' : 'warning'
    );
    this.notify();
  }

  public triggerMarketVolatility() {
    const spike = (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 20);
    this.currentXauPrice = parseFloat((this.currentXauPrice + spike).toFixed(2));
    this.addBotLog('SIGNAL DETECTED', `Simulated volatility surge detected: Spot shift of ${spike >= 0 ? '+' : ''}$${spike.toFixed(2)}`, 'warning');
    this.notify();
  }

  public toggleBotStatus() {
    const nextStatus = this.botState.status === 'MONITORING' ? 'PAUSED' : 'MONITORING';
    this.botState.status = nextStatus;
    this.addBotLog(nextStatus, `Bot state toggled to ${nextStatus}`, 'info');
    this.notify();
  }

  public toggleBotBinding() {
    this.botState.isBound = !this.botState.isBound;
    this.botState.status = this.botState.isBound ? 'MONITORING' : 'DISCONNECTED';
    this.botState.licenseStatus = this.botState.isBound ? 'ACTIVE — DEMO' : 'UNBOUND';
    this.addBotLog(
      this.botState.status,
      this.botState.isBound ? 'Bot bound to DEMO-2026-001 (ACTIVE — DEMO)' : 'Bot unbound from trading terminal',
      'info'
    );
    this.notify();
  }

  public toggleConnectionHealth() {
    const nextHealth = this.botState.connectionHealth === 'HEALTHY' ? 'INTERRUPTED' : 'HEALTHY';
    this.botState.connectionHealth = nextHealth;
    this.botState.status = nextHealth === 'HEALTHY' ? 'MONITORING' : 'DISCONNECTED';
    this.addBotLog(
      this.botState.status,
      nextHealth === 'HEALTHY' ? 'Network connection recovered. WebRequest latency 18ms.' : 'Simulated packet loss & timeout interruption.',
      nextHealth === 'HEALTHY' ? 'info' : 'error'
    );
    this.notify();
  }

  // Simulated KYC state transitions
  public updateKYCStatus(step: DemoKYCStep, duplicateResult?: DemoKYCProfile['duplicateResult']) {
    this.kycProfile.status = step;
    if (duplicateResult) this.kycProfile.duplicateResult = duplicateResult;
    if (step === 'VERIFIED — DEMO') {
      this.kycProfile.verifiedAt = new Date().toISOString();
    }
    this.notify();
  }

  public setNewsReminder(eventId: string, minutes: number | null) {
    this.marketEvents = this.marketEvents.map(e => e.id === eventId ? { ...e, reminderMinutes: minutes } : e);
    this.notify();
  }

  // Reset demo environment to seed state
  public resetDemoEnvironment() {
    this.tradeHistory = [...INITIAL_DEMO_TRADES];
    this.positions = [...INITIAL_DEMO_POSITIONS];
    this.marketEvents = [...INITIAL_DEMO_MARKET_EVENTS];
    this.currentXauPrice = 2912.85;
    this.speedMultiplier = 1;

    const startingBalance = 25000.00;
    const realizedPL = this.calculateRealizedPL();
    const floatingPL = this.calculateFloatingPL();

    this.account = {
      accountNumber: 'DEMO-2026-001',
      brokerName: 'OPHIREUM DEMO BROKERAGE',
      brokerServer: 'OPHIREUM-DEMO',
      accountType: 'Raw Spread / ECN',
      connectionStatus: 'CONNECTED — SIMULATED',
      currency: 'USD',
      leverage: '1:100',
      startingBalance,
      balance: startingBalance + realizedPL,
      equity: startingBalance + realizedPL + floatingPL,
      margin: this.calculateUsedMargin(),
      freeMargin: startingBalance + realizedPL + floatingPL - this.calculateUsedMargin(),
      marginLevel: 2450.0,
      floatingPL,
      realizedPL,
      todayRealizedPL: 497.00,
      lastSyncTimestamp: new Date().toISOString(),
      dataSource: 'SIMULATION',
      environment: 'DEMO'
    };

    this.kycProfile = {
      entityType: 'INDIVIDUAL',
      status: 'VERIFIED — DEMO',
      ocid: generateDemoOCID(),
      documentType: 'PASSPORT',
      documentFileName: 'synthetic_passport_demo.pdf',
      extractedFields: {
        fullName: 'Alexander Vance Hayes',
        dob: '1988-04-12',
        docNumber: 'P98421098',
        nationality: 'United States',
        expiryDate: '2032-11-20',
        address: '742 Financial Way, Ste 400, Chicago, IL 60606'
      },
      ocrConfidence: 99.2,
      livenessPassed: true,
      duplicateResult: 'NO MATCH',
      complianceNotes: 'Synthetic compliance record reset for development demonstration.',
      submittedAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
      environment: 'DEMO'
    };

    this.botState = {
      status: 'MONITORING',
      isBound: true,
      boundAccount: 'DEMO-2026-001',
      licenseStatus: 'ACTIVE — DEMO',
      connectionHealth: 'HEALTHY',
      lastHeartbeat: new Date().toISOString(),
      heartbeatIntervalSec: 5,
      activityLog: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: 'CONNECTED',
          message: 'Simulation environment reset to initial state.',
          type: 'info'
        }
      ]
    };

    this.invoices = [
      {
        id: `DEMO-INV-${Math.floor(100000 + Math.random() * 900000)}`,
        orderId: `DEMO-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        planId: 'professional',
        planName: 'Professional',
        amountUSDT: 1499,
        amount: 1499,
        network: 'USDT-TRC20',
        demoDepositAddress: 'T9yD14Nj9j7xAB4dbGeiX9h8unkkhxmTrcDemo',
        address: 'T9yD14Nj9j7xAB4dbGeiX9h8unkkhxmTrcDemo',
        status: 'INVOICE CREATED',
        createdAt: new Date().toISOString(),
        environment: 'DEMO'
      }
    ];

    this.notify();
  }

  public triggerSimulatedTrade(direction: 'BUY' | 'SELL', volume: number = 0.15) {
    return this.openSimulatedPosition(direction, volume);
  }

  public closeSimulatedPosition(ticketOrId: number | string) {
    if (typeof ticketOrId === 'number') {
      const pos = this.positions.find(p => p.ticket === ticketOrId);
      if (pos) this.closePosition(pos.id);
    } else {
      this.closePosition(ticketOrId);
    }
  }

  public createDemoInvoice(
    planOrName: string,
    amountUSDT: number,
    network: 'USDT-TRC20' | 'USDT-BEP20' | 'USDT-ERC20' = 'USDT-TRC20',
    address?: string
  ): DemoPaymentInvoice {
    const defaultAddress = network === 'USDT-TRC20'
      ? 'T9yD14Nj9j7xAB4dbGeiX9h8unkkhxmTrcDemo'
      : network === 'USDT-BEP20'
      ? '0x71C8756DA733174538522929e5B6653702Demo99'
      : '0xdAC17F958D2ee523a2206206994597C13D83Demo';

    const invoice: DemoPaymentInvoice = {
      id: `DEMO-INV-${Math.floor(100000 + Math.random() * 900000)}`,
      orderId: `DEMO-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      planId: planOrName.toLowerCase(),
      planName: planOrName,
      amountUSDT,
      amount: amountUSDT,
      network,
      demoDepositAddress: address || defaultAddress,
      address: address || defaultAddress,
      status: 'INVOICE CREATED',
      createdAt: new Date().toISOString(),
      environment: 'DEMO'
    };

    this.invoices.unshift(invoice);
    this.addBotLog('MONITORING', `Simulated Payment Invoice created: ${invoice.id} for ${planOrName} ($${amountUSDT} USDT)`, 'info');
    this.notify();
    return invoice;
  }

  public advanceInvoiceStatus(invoiceId: string, status: DemoPaymentInvoice['status'], txHash?: string) {
    const inv = this.invoices.find(i => i.id === invoiceId);
    if (inv) {
      inv.status = status;
      if (txHash) inv.txHash = txHash;
    }
    this.addBotLog('MONITORING', `Simulated Payment Invoice ${invoiceId} transitioned to ${status}`, 'info');
    this.notify();
  }

  public getState() {
    const metrics = this.getPerformanceMetrics();
    const accountWithAliases: DemoTradingAccount = {
      ...this.account,
      currentPrice: this.currentXauPrice,
      floatingProfit: this.account.floatingPL,
      winRate: metrics.winRate,
      winningTrades: metrics.winningTrades,
      losingTrades: metrics.losingTrades,
      totalTrades: metrics.totalTrades,
      profitFactor: metrics.profitFactor,
      maxDrawdownPercent: metrics.maxDrawdownPct,
      currentDrawdownPercent: metrics.currentDrawdownPct,
      totalNetProfit: metrics.netPL,
      grossProfit: metrics.grossProfit,
      grossLoss: metrics.grossLoss,
      averageWin: metrics.avgWin,
      averageLoss: metrics.avgLoss
    };

    const positionsWithAliases = this.positions.map(p => ({
      ...p,
      floatingProfit: p.floatingPL,
      stopLoss: p.sl,
      takeProfit: p.tp
    }));

    const historyWithAliases = this.tradeHistory.map(t => ({
      ...t,
      netProfit: t.netPL,
      openPrice: t.entryPrice,
      closePrice: t.exitPrice
    }));

    const botView = {
      name: 'Ophireum Gold Engine v2.4.1 (Simulated Node)',
      status: this.botState.status,
      strategy: 'Institutional Volatility Adaptation (XAUUSD)',
      timeframe: 'M5 (5-Minute Structure)',
      latencyMs: 4.2,
      spreadPoints: 12,
      isTradingHalted: this.botState.status === 'PAUSED' || this.botState.status === 'DISCONNECTED',
      state: this.botState
    };

    const kycView = {
      ...this.kycProfile,
      accountType: this.kycProfile.entityType,
      firstName: this.kycProfile.extractedFields.fullName.split(' ')[0] || 'Alexander',
      lastName: this.kycProfile.extractedFields.fullName.split(' ').slice(1).join(' ') || 'Vance Hayes',
      documentNumber: this.kycProfile.extractedFields.docNumber,
      nationality: this.kycProfile.extractedFields.nationality,
      duplicateScreening: {
        status: (this.kycProfile.duplicateResult === 'NO MATCH' ? 'PASSED' : 'FLAGGED') as 'PASSED' | 'FLAGGED',
        matchedFields: this.kycProfile.duplicateResult === 'NO MATCH' ? [] : ['Tax Identifier', 'Passport Number'],
        riskScore: this.kycProfile.duplicateResult === 'NO MATCH' ? 0.02 : 0.88
      }
    };

    const newsView = this.marketEvents.map(e => ({
      ...e,
      goldRelevance: e.potentialMarketRelevance,
      countdown: 'Upcoming Today',
      forecast: '2.9%',
      previous: '3.1%',
      actual: 'Pending'
    }));

    return {
      account: accountWithAliases,
      bot: botView,
      botState: this.botState,
      positions: positionsWithAliases,
      tradeHistory: historyWithAliases,
      kyc: kycView,
      kycProfile: kycView,
      news: newsView,
      events: newsView,
      marketEvents: this.marketEvents,
      invoices: this.invoices,
      activeInvoice: this.invoices[0] || null,
      speed: this.speedMultiplier,
      metrics
    };
  }

  private addBotLog(status: DemoBotStatus, message: string, type: DemoBotActivityLog['type']) {
    this.botState.activityLog.unshift({
      id: `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
      status,
      message,
      type
    });
    if (this.botState.activityLog.length > 50) {
      this.botState.activityLog.pop();
    }
  }

  private calculateFloatingPL(): number {
    return parseFloat(this.positions.reduce((acc, p) => acc + p.floatingPL, 0).toFixed(2));
  }

  private calculateRealizedPL(): number {
    return parseFloat(this.tradeHistory.reduce((acc, t) => acc + t.netPL, 0).toFixed(2));
  }

  private calculateUsedMargin(): number {
    // 1 lot of XAUUSD at 1:100 leverage = $2,900 margin approx
    const totalVolume = this.positions.reduce((acc, p) => acc + p.volume, 0);
    return parseFloat((totalVolume * 100 * (this.currentXauPrice / 100)).toFixed(2));
  }
}

export const demoEngine = DemoSimulationEngine.getInstance();
