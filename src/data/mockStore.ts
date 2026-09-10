/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Data Engine and Store
 */

import {
  LicensePlan,
  License,
  UserProfile,
  Order,
  Invoice,
  EAVersion,
  UnbindingRequest,
  VPSInstance,
  SupportTicket,
  AuditLog,
  NotificationItem,
  SystemSettings,
  HeartbeatLog,
  EAValidationRequest,
  EAValidationResponse,
  EAHeartbeatRequest,
  UserRole
} from '../types';

export const INITIAL_PLANS: LicensePlan[] = [
  {
    id: 'plan-starter-trial',
    name: 'Starter Kit – Trial Version',
    slug: 'starter',
    priceUSDT: 199,
    validityDays: 90,
    riskSettingPct: 30,
    lotSetting: 0.0100,
    suggestedEquityUSD: 'USD 200–300',
    signalsCount: 2,
    description: 'Entry-tier 90-day technical trial for single-account MT5 validation on XAUUSD. One-time purchase per customer.',
    isTrial: true,
    features: [
      'Account-bound single MT5 terminal binding',
      'Exclusive XAUUSD/Gold algorithmic execution',
      'Fixed 0.0100 baseline lot constraint',
      'Mandatory Stop-Loss hard enforcement',
      '90-Day validity period (Upgrade required upon expiry)',
      'Direct WebRequest licensing authorization',
      'Community & Knowledge Base technical support'
    ]
  },
  {
    id: 'plan-professional',
    name: 'Professional Kit',
    slug: 'professional',
    priceUSDT: 1399,
    validityDays: 180,
    riskSettingPct: 20,
    lotSetting: 0.0100,
    suggestedEquityUSD: 'USD 2,000–5,000',
    signalsCount: 10,
    description: 'Structured 180-day operational licence for active gold algorithmic operators demanding controlled exposure and 10 signal streams.',
    isTrial: false,
    features: [
      'Account-bound single MT5 terminal binding',
      'Conservative 20% max risk threshold setting',
      '10 Algorithmic gold market signal channels',
      'Spread expansion and slippage safety filter',
      '180-Day active licence term with renewal protection',
      'VPS deployment readiness validation',
      'Priority ticket technical assistance (24h response)'
    ]
  },
  {
    id: 'plan-premium',
    name: 'Premium Kit',
    slug: 'premium',
    priceUSDT: 2499,
    validityDays: 365,
    riskSettingPct: 20,
    lotSetting: 0.0100,
    suggestedEquityUSD: 'USD 5,000–7,000',
    signalsCount: 19,
    description: 'Comprehensive 365-day institutional-grade architecture for year-round gold execution with 19 algorithmic signals.',
    isTrial: false,
    features: [
      'Full 365-Day continuous software licence',
      'Conservative 20% risk model optimization',
      '19 High-probability algorithmic signal patterns',
      'Automated session timing and high-impact news filter',
      'Dedicated migration assistance for MT5 unbinding',
      'VPS performance heartbeat monitoring',
      'Dedicated senior technical support agent'
    ]
  },
  {
    id: 'plan-institutional',
    name: 'Institutional Premium Kit',
    slug: 'institutional',
    priceUSDT: 19999,
    validityDays: 365,
    riskSettingPct: 30,
    lotSetting: 0.0100,
    suggestedEquityUSD: 'USD 15,000–20,000',
    signalsCount: 25,
    description: 'Enterprise operational tier for capital managers requiring maximum 25-signal confluence and direct engineering desk access.',
    isTrial: false,
    features: [
      '365-Day full enterprise licence clearance',
      'Custom 30% operational risk ceiling calibration',
      'Complete 25-signal algorithmic strategy matrix',
      'Direct Cloud Run EA priority validation routing',
      'Full VPS infrastructure management assistance',
      'Direct engineering channel & compliance audit exports',
      'Continuous health telemetrics & emergency override'
    ]
  }
];

export const INITIAL_SETTINGS: SystemSettings = {
  webrequestUrl: 'https://api.ophireum.com/api/v1/ea/validate',
  approvedSymbols: ['XAUUSD', 'XAUUSD.raw', 'XAUUSD.pro', 'GOLD', 'GOLD.pro', 'XAUUSDm'],
  contactEmail: 'dhenzecapital@gmail.com',
  supportWhatsApp: '+63 995 715 1043',
  mobileContact: '+63 917 966 8814',
  officialDomain: 'https://ophireum.com',
  usdtTrc20DepositAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  usdtErc20DepositAddress: '0x8b368752945a0b94326f18395B7b61A22cE6CBe9',
  bankDetails: {
    bankName: 'BDO Unibank',
    accountName: 'OPHIREUM Multimedia Production',
    accountNumber: '0048-2910-8472',
    swiftCode: 'BNORPHMM',
    referenceFormat: 'OPH-ORD-[ORDER_ID]'
  },
  globalEmergencyStop: false,
  globalStopReason: '',
  maintenanceMode: false,
  vpsAnnualPriceUSDT: 360
};

export const INITIAL_USERS: UserProfile[] = [];

export const INITIAL_LICENSES: License[] = [];

export const INITIAL_EA_VERSIONS: EAVersion[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_INVOICES: Invoice[] = [];

export const INITIAL_VPS: VPSInstance[] = [];

export const INITIAL_UNBINDING_REQUESTS: UnbindingRequest[] = [];

export const INITIAL_TICKETS: SupportTicket[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_HEARTBEATS: HeartbeatLog[] = [];

