/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM ASSISTANT CENTRALIZED CREDIT LEDGER & PLAN CONFIGURATION
 * 
 * Production-grade credit accounting:
 * - Centralized administrator-controlled plan entitlements
 * - Strict Reserve–Commit–Release transactional model
 * - Per-user mutex to eliminate concurrency double-spending and negative balances
 * - Complete immutable audit transaction ledger
 * - Idempotency by requestId
 * - Strict segregation between AI subscriptions and MT5 EA licenses
 */

export type PlanTierId = 'discover' | 'trader' | 'professional' | 'institutional';

export interface PlanEntitlement {
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
  measurableRatioNote: string;
  features: string[];
  popular?: boolean;
}

export const AUTHORITATIVE_PLANS: Record<PlanTierId, PlanEntitlement> = {
  discover: {
    id: 'discover',
    name: 'Discover Tier',
    badge: 'Standard Access',
    tagline: 'Basic orientation, core market structure concepts, and platform familiarization.',
    priceMonthlyUSDT: 0,
    priceAnnualUSDT: 0,
    monthlyCredits: 50,
    dailyMessagesLimit: 10,
    dailyVoiceMinutesLimit: 2,
    maxFileSizeMB: 5,
    maxContextTokens: 4000,
    measurableRatioNote: 'Fixed starter quota (10 requests/day, 50 monthly credits)',
    features: [
      'Standard market structure & session overview',
      'Community educational research',
      'Basic position size calculator',
      'Community support desk'
    ]
  },
  trader: {
    id: 'trader',
    name: 'Trader Tier',
    badge: 'Active Traders',
    tagline: 'Daily market intelligence, key level monitoring, and structured trade planning.',
    priceMonthlyUSDT: 29,
    priceAnnualUSDT: 290,
    monthlyCredits: 1000,
    dailyMessagesLimit: 100,
    dailyVoiceMinutesLimit: 15,
    maxFileSizeMB: 15,
    maxContextTokens: 16000,
    measurableRatioNote: 'Up to 100 queries/day (~10x Discover volume)',
    features: [
      'Gold & FX structured macro analysis (A-L framework)',
      'Chart screenshot analysis (M15-H4)',
      'MetaTrader 5 Expert Advisor setup guidance',
      'Priority assistant latency',
      'Standard ticket support'
    ],
    popular: true
  },
  professional: {
    id: 'professional',
    name: 'Professional Tier',
    badge: 'Pro Desk',
    tagline: 'High-frequency analysis, multi-timeframe correlation, and custom research synthesis.',
    priceMonthlyUSDT: 79,
    priceAnnualUSDT: 790,
    monthlyCredits: 5000,
    dailyMessagesLimit: 500,
    dailyVoiceMinutesLimit: 60,
    maxFileSizeMB: 25,
    maxContextTokens: 32000,
    measurableRatioNote: 'Up to 500 queries/day (~5x Trader volume)',
    features: [
      'Full institutional driver breakdowns & yield correlation',
      'Multi-chart & PDF document analysis',
      'Ophireum Voice streaming mode',
      'Custom risk parameter calculations',
      'Dedicated compliance & support line'
    ]
  },
  institutional: {
    id: 'institutional',
    name: 'Institutional Tier',
    badge: 'Family Offices & Desks',
    tagline: 'Deep macro modeling, dedicated capacity, multi-seat governance, and custom reporting.',
    priceMonthlyUSDT: 249,
    priceAnnualUSDT: 2490,
    monthlyCredits: 25000,
    dailyMessagesLimit: 2500,
    dailyVoiceMinutesLimit: 300,
    maxFileSizeMB: 50,
    maxContextTokens: 64000,
    measurableRatioNote: 'Enterprise capacity (2,500 queries/day)',
    features: [
      'Maximum inference capacity & dedicated context window',
      'Complete quantitative risk & invalidation modeling',
      'Exportable institutional-grade research dossiers',
      'Audit log access & seat allocation controls',
      'Direct technical account manager'
    ]
  }
};

export interface CreditCostMatrix {
  standardChat: number;
  advancedReasoning: number;
  marketScan: number;
  voiceMinute: number;
  chartVision: number;
  documentAnalysis: number;
  reportGeneration: number;
}

export const AUTHORITATIVE_CREDIT_COSTS: CreditCostMatrix = {
  standardChat: 1,
  advancedReasoning: 3,
  marketScan: 2,
  voiceMinute: 2,
  chartVision: 5,
  documentAnalysis: 5,
  reportGeneration: 10
};

export interface CreditWallet {
  userId: string;
  balance: number;
  reserved: number; // In-flight reservations
  planId: PlanTierId;
  subscriptionStatus: 'active' | 'expired' | 'trial' | 'cancelled';
  expiresAt: string | null;
  dailyMessagesUsedToday: number;
  dailyVoiceMinutesUsedToday: number;
  lastResetDay: string;
  updatedAt: string;
}

export interface CreditTransactionRecord {
  id: string;
  userId: string;
  requestId: string;
  amount: number; // Negative for deductions, positive for refills/adjustments
  balanceBefore: number;
  balanceAfter: number;
  reason: string;
  actionType: string;
  timestamp: string;
  status: 'COMMITTED' | 'RELEASED' | 'RESERVED';
}

export interface ActiveReservation {
  id: string;
  userId: string;
  requestId: string;
  amount: number;
  actionType: string;
  createdAt: number;
  reason: string;
}

/**
 * Server-side Thread-Safe Credit Ledger State
 */
export class CreditLedgerManager {
  private wallets = new Map<string, CreditWallet>();
  private transactions: CreditTransactionRecord[] = [];
  private activeReservations = new Map<string, ActiveReservation>();
  private processedRequests = new Map<string, CreditTransactionRecord>(); // Idempotency check
  private userLocks = new Map<string, Promise<void>>();

  private async acquireLock(userId: string): Promise<() => void> {
    while (this.userLocks.has(userId)) {
      await this.userLocks.get(userId);
    }
    let resolveLock!: () => void;
    const lockPromise = new Promise<void>((resolve) => {
      resolveLock = resolve;
    });
    this.userLocks.set(userId, lockPromise);
    return () => {
      this.userLocks.delete(userId);
      resolveLock();
    };
  }

  public getOrCreateWallet(userId: string): CreditWallet {
    const today = new Date().toISOString().slice(0, 10);
    let wallet = this.wallets.get(userId);
    if (!wallet) {
      wallet = {
        userId,
        balance: 50, // Default Discover free tier credits
        reserved: 0,
        planId: 'discover',
        subscriptionStatus: 'active',
        expiresAt: null,
        dailyMessagesUsedToday: 0,
        dailyVoiceMinutesUsedToday: 0,
        lastResetDay: today,
        updatedAt: new Date().toISOString()
      };
      this.wallets.set(userId, wallet);
    }

    // Reset daily counters on date change
    if (wallet.lastResetDay !== today) {
      wallet.dailyMessagesUsedToday = 0;
      wallet.dailyVoiceMinutesUsedToday = 0;
      wallet.lastResetDay = today;
    }

    // Check expiration: if paid plan expired, drop to discover
    if (wallet.expiresAt && new Date(wallet.expiresAt).getTime() < Date.now()) {
      if (wallet.planId !== 'discover') {
        wallet.planId = 'discover';
        wallet.subscriptionStatus = 'expired';
      }
    }

    return wallet;
  }

  /**
   * Step 1: RESERVE CREDITS
   * Verifies daily limit, available unreserved balance, and places in-flight hold.
   */
  public async reserveCredits(
    userId: string,
    estimatedAmount: number,
    requestId: string,
    actionType: string,
    reason: string
  ): Promise<{ success: boolean; reservationId?: string; error?: string }> {
    const release = await this.acquireLock(userId);
    try {
      // Idempotency: if request was already committed, reject duplicate attempt
      if (this.processedRequests.has(requestId)) {
        return {
          success: false,
          error: `Duplicate request ID: ${requestId} was already executed.`
        };
      }

      const wallet = this.getOrCreateWallet(userId);
      const plan = AUTHORITATIVE_PLANS[wallet.planId];

      // Check daily message limit
      if (wallet.dailyMessagesUsedToday >= plan.dailyMessagesLimit) {
        return {
          success: false,
          error: `Daily query entitlement exceeded for ${plan.name} (${plan.dailyMessagesLimit} max/day). Please upgrade or wait for daily reset.`
        };
      }

      const availableBalance = wallet.balance - wallet.reserved;
      if (availableBalance < estimatedAmount) {
        return {
          success: false,
          error: `Insufficient credits. Required: ${estimatedAmount}, Available: ${availableBalance}. Please refill or upgrade plan.`
        };
      }

      const reservationId = `res-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      wallet.reserved += estimatedAmount;
      wallet.updatedAt = new Date().toISOString();

      this.activeReservations.set(reservationId, {
        id: reservationId,
        userId,
        requestId,
        amount: estimatedAmount,
        actionType,
        createdAt: Date.now(),
        reason
      });

      return { success: true, reservationId };
    } finally {
      release();
    }
  }

  /**
   * Step 2: COMMIT CREDITS
   * Converts reservation into an immutable transaction deduction.
   * Handles idempotency: duplicate commits with the same requestId return existing tx.
   */
  public async commitCredits(
    userId: string,
    reservationId: string,
    actualAmount: number,
    requestId: string,
    reason: string
  ): Promise<{ success: boolean; tx?: CreditTransactionRecord; error?: string }> {
    const release = await this.acquireLock(userId);
    try {
      const existingTx = this.processedRequests.get(requestId);
      if (existingTx) {
        return { success: true, tx: existingTx };
      }

      const reservation = this.activeReservations.get(reservationId);
      if (!reservation || reservation.userId !== userId) {
        return { success: false, error: 'Invalid or missing reservation ID.' };
      }

      const wallet = this.getOrCreateWallet(userId);
      const balanceBefore = wallet.balance;

      // Remove reservation hold
      wallet.reserved = Math.max(0, wallet.reserved - reservation.amount);

      // Perform actual deduction
      wallet.balance = Math.max(0, wallet.balance - actualAmount);
      wallet.dailyMessagesUsedToday += 1;
      wallet.updatedAt = new Date().toISOString();

      const balanceAfter = wallet.balance;

      const tx: CreditTransactionRecord = {
        id: `ctx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        userId,
        requestId,
        amount: -actualAmount,
        balanceBefore,
        balanceAfter,
        reason,
        actionType: reservation.actionType,
        timestamp: new Date().toISOString(),
        status: 'COMMITTED'
      };

      this.transactions.unshift(tx);
      this.processedRequests.set(requestId, tx);
      this.activeReservations.delete(reservationId);

      return { success: true, tx };
    } finally {
      release();
    }
  }

  /**
   * Step 3: RELEASE CREDITS
   * Returns reserved hold back to the user without deduction (e.g. model timeout, error).
   */
  public async releaseCredits(
    userId: string,
    reservationId: string,
    reason: string
  ): Promise<{ success: boolean; releasedAmount: number }> {
    const release = await this.acquireLock(userId);
    try {
      const reservation = this.activeReservations.get(reservationId);
      if (!reservation || reservation.userId !== userId) {
        return { success: false, releasedAmount: 0 };
      }

      const wallet = this.getOrCreateWallet(userId);
      wallet.reserved = Math.max(0, wallet.reserved - reservation.amount);
      wallet.updatedAt = new Date().toISOString();

      this.activeReservations.delete(reservationId);

      const tx: CreditTransactionRecord = {
        id: `ctx-rel-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        userId,
        requestId: reservation.requestId,
        amount: 0,
        balanceBefore: wallet.balance,
        balanceAfter: wallet.balance,
        reason: `Reserved credits released: ${reason}`,
        actionType: 'RESERVE_RELEASE',
        timestamp: new Date().toISOString(),
        status: 'RELEASED'
      };
      this.transactions.unshift(tx);

      return { success: true, releasedAmount: reservation.amount };
    } finally {
      release();
    }
  }

  /**
   * Manual Administrator Adjustment (Requires documented reason & audit record)
   */
  public async adminAdjustCredits(
    adminEmail: string,
    targetUserId: string,
    amount: number,
    reason: string
  ): Promise<{ success: boolean; tx?: CreditTransactionRecord; error?: string }> {
    if (!reason || reason.trim().length < 8) {
      return { success: false, error: 'Mandatory adjustment reason of at least 8 characters required.' };
    }
    if (amount === 0) {
      return { success: false, error: 'Adjustment amount cannot be zero.' };
    }

    const release = await this.acquireLock(targetUserId);
    try {
      const wallet = this.getOrCreateWallet(targetUserId);
      const balanceBefore = wallet.balance;
      wallet.balance = Math.max(0, wallet.balance + amount);
      wallet.updatedAt = new Date().toISOString();
      const balanceAfter = wallet.balance;

      const tx: CreditTransactionRecord = {
        id: `ctx-adm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        userId: targetUserId,
        requestId: `admin-adj-${Date.now()}`,
        amount,
        balanceBefore,
        balanceAfter,
        reason: `[ADMIN: ${adminEmail}] ${reason.trim()}`,
        actionType: 'ADMIN_MANUAL_ADJUSTMENT',
        timestamp: new Date().toISOString(),
        status: 'COMMITTED'
      };

      this.transactions.unshift(tx);
      return { success: true, tx };
    } finally {
      release();
    }
  }

  /**
   * Server-Side Plan Activation / Purchase Confirmation
   * Never trust client state; called only after verified payment gateway confirmation.
   */
  public async activateSubscription(
    userId: string,
    planId: PlanTierId,
    durationDays = 30
  ): Promise<{ success: boolean; wallet: CreditWallet }> {
    const release = await this.acquireLock(userId);
    try {
      const plan = AUTHORITATIVE_PLANS[planId];
      const wallet = this.getOrCreateWallet(userId);
      const balanceBefore = wallet.balance;

      wallet.planId = planId;
      wallet.subscriptionStatus = 'active';
      wallet.balance += plan.monthlyCredits;
      
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + durationDays);
      wallet.expiresAt = expiry.toISOString();
      wallet.updatedAt = new Date().toISOString();

      const tx: CreditTransactionRecord = {
        id: `ctx-sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        userId,
        requestId: `sub-act-${Date.now()}`,
        amount: plan.monthlyCredits,
        balanceBefore,
        balanceAfter: wallet.balance,
        reason: `Verified activation: ${plan.name} (+${plan.monthlyCredits} credits)`,
        actionType: 'SUBSCRIPTION_ACTIVATION',
        timestamp: new Date().toISOString(),
        status: 'COMMITTED'
      };
      this.transactions.unshift(tx);

      return { success: true, wallet };
    } finally {
      release();
    }
  }

  public getTransactionsForUser(userId: string): CreditTransactionRecord[] {
    return this.transactions.filter(t => t.userId === userId);
  }

  public getAllTransactions(): CreditTransactionRecord[] {
    return this.transactions;
  }
}

export const creditLedger = new CreditLedgerManager();
