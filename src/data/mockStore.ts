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

export const INITIAL_USERS: UserProfile[] = [
  {
    uid: 'usr-customer-01',
    email: 'antonioluna2001@gmail.com',
    fullName: 'Antonio Luna',
    phone: '+63 995 715 1043',
    country: 'Philippines',
    isEmailVerified: true,
    mfaEnabled: true,
    role: 'customer',
    starterPurchased: false,
    createdAt: '2026-08-10T08:00:00Z',
    updatedAt: '2026-09-01T10:30:00Z',
    agreementsAccepted: {
      termsVersion: 'v2.4-2026',
      slaVersion: 'v2.4-2026',
      riskDisclosureVersion: 'v2.4-2026',
      acceptedAt: '2026-08-10T08:15:20Z',
      ipAddress: '120.29.74.19'
    }
  },
  {
    uid: 'usr-support-01',
    email: 'support.lead@ophireum.com',
    fullName: 'David Mercer',
    phone: '+63 917 966 8814',
    country: 'Singapore',
    isEmailVerified: true,
    mfaEnabled: true,
    role: 'support_agent',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
    agreementsAccepted: {
      termsVersion: 'v2.4-2026',
      slaVersion: 'v2.4-2026',
      riskDisclosureVersion: 'v2.4-2026',
      acceptedAt: '2026-05-01T00:00:00Z',
      ipAddress: '203.116.89.2'
    }
  },
  {
    uid: 'usr-finance-01',
    email: 'finance.auditor@ophireum.com',
    fullName: 'Elena Rostova',
    phone: '+63 917 966 8814',
    country: 'Switzerland',
    isEmailVerified: true,
    mfaEnabled: true,
    role: 'finance_reviewer',
    createdAt: '2026-04-12T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
    agreementsAccepted: {
      termsVersion: 'v2.4-2026',
      slaVersion: 'v2.4-2026',
      riskDisclosureVersion: 'v2.4-2026',
      acceptedAt: '2026-04-12T00:00:00Z',
      ipAddress: '194.230.145.8'
    }
  },
  {
    uid: 'usr-admin-01',
    email: 'licensing@ophireum.com',
    fullName: 'Alexander Vance',
    phone: '+63 917 966 8814',
    country: 'United Kingdom',
    isEmailVerified: true,
    mfaEnabled: true,
    role: 'license_admin',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
    agreementsAccepted: {
      termsVersion: 'v2.4-2026',
      slaVersion: 'v2.4-2026',
      riskDisclosureVersion: 'v2.4-2026',
      acceptedAt: '2026-03-01T00:00:00Z',
      ipAddress: '82.165.197.1'
    }
  },
  {
    uid: 'usr-superadmin-01',
    email: 'dhenzecapital@gmail.com',
    fullName: 'OPHIREUM Chief Technology Officer',
    phone: '+63 995 715 1043',
    country: 'Philippines',
    isEmailVerified: true,
    mfaEnabled: true,
    role: 'super_admin',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    agreementsAccepted: {
      termsVersion: 'v2.4-2026',
      slaVersion: 'v2.4-2026',
      riskDisclosureVersion: 'v2.4-2026',
      acceptedAt: '2026-01-01T00:00:00Z',
      ipAddress: '120.29.74.19'
    }
  }
];

export const INITIAL_LICENSES: License[] = [
  {
    id: 'OPH-8924-4102-XAU',
    userId: 'usr-customer-01',
    userEmail: 'antonioluna2001@gmail.com',
    planId: 'plan-professional',
    planName: 'Professional Kit',
    status: 'active',
    validityDays: 180,
    riskSettingPct: 20,
    lotSetting: 0.0100,
    suggestedEquity: 'USD 2,000–5,000',
    signalsCount: 10,
    activatedAt: '2026-08-11T14:22:00Z',
    expiresAt: '2027-02-07T14:22:00Z',
    boundMt5Account: '7729014',
    brokerName: 'IC Markets (SC)',
    brokerServer: 'ICMarketsSC-Live04',
    accountType: 'Raw',
    boundAt: '2026-08-11T15:05:00Z',
    eaVersionUsed: '2.4.1',
    lastValidationAt: '2026-09-09T12:45:10Z',
    lastHeartbeatAt: '2026-09-09T13:20:00Z',
    heartbeatStatus: 'online',
    isAutomationPaused: false,
    vpsAssigned: true,
    vpsId: 'vps-sg-0914',
    createdAt: '2026-08-11T14:20:00Z',
    updatedAt: '2026-09-09T13:20:00Z'
  }
];

export const INITIAL_EA_VERSIONS: EAVersion[] = [
  {
    version: '2.4.1',
    releaseDate: '2026-08-15',
    minSupportedVersion: '2.4.0',
    checksumSHA256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    fileName: 'OPHIREUM_Expert_Assistant_v2.4.1.ex5',
    downloadPath: '/downloads/ea/OPHIREUM_Expert_Assistant_v2.4.1.ex5',
    status: 'production',
    releaseNotes: [
      'Refined XAUUSD London/New York session overlap volatility filters',
      'Enhanced WebRequest timeout recovery with jittered fallback',
      'Hardened local Nonce generation mechanism for zero-collision protection',
      'Enhanced spread threshold tracking during high-tier economic releases'
    ],
    forceUpdate: false
  },
  {
    version: '2.4.0',
    releaseDate: '2026-06-01',
    minSupportedVersion: '2.4.0',
    checksumSHA256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    fileName: 'OPHIREUM_Expert_Assistant_v2.4.0.ex5',
    downloadPath: '/downloads/ea/OPHIREUM_Expert_Assistant_v2.4.0.ex5',
    status: 'production',
    releaseNotes: [
      'Initial production release of account-bound MT5 signature validation',
      'XAUUSD-only strictly enforced terminal symbol check'
    ],
    forceUpdate: false
  },
  {
    version: '2.3.9',
    releaseDate: '2026-03-20',
    minSupportedVersion: '2.4.0',
    checksumSHA256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    fileName: 'OPHIREUM_Expert_Assistant_v2.3.9.ex5',
    downloadPath: '/downloads/ea/OPHIREUM_Expert_Assistant_v2.3.9.ex5',
    status: 'deprecated',
    releaseNotes: [
      'Legacy test release - deprecated due to older API communication schema'
    ],
    forceUpdate: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-8831',
    userId: 'usr-customer-01',
    userEmail: 'antonioluna2001@gmail.com',
    planId: 'plan-professional',
    planName: 'Professional Kit',
    amountUSDT: 1399,
    paymentMethod: 'USDT-TRC20',
    status: 'confirmed',
    depositAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    txHash: '7b98d28e45a2789182098bca413998274092bbf1829034871928374901928472',
    invoiceId: 'INV-2026-0941',
    licenseId: 'OPH-8924-4102-XAU',
    createdAt: '2026-08-11T14:00:00Z',
    confirmedAt: '2026-08-11T14:22:00Z'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-0941',
    orderId: 'ORD-2026-8831',
    licenseId: 'OPH-8924-4102-XAU',
    userId: 'usr-customer-01',
    userEmail: 'antonioluna2001@gmail.com',
    planName: 'Professional Kit (180 Days)',
    amountUSDT: 1399,
    paymentMethod: 'USDT-TRC20',
    txHash: '7b98d28e45a2789182098bca413998274092bbf1829034871928374901928472',
    status: 'paid',
    issuedAt: '2026-08-11T14:22:00Z',
    taxNote: 'Digital Software Licence - OPHIREUM Multimedia Production Technology Division',
    companyDetails: {
      name: 'OPHIREUM Multimedia Production',
      division: 'Software Licensing & Algorithmic Automation Division',
      contactEmail: 'dhenzecapital@gmail.com',
      supportWhatsApp: '+63 995 715 1043'
    }
  }
];

export const INITIAL_VPS: VPSInstance[] = [
  {
    id: 'vps-sg-0914',
    licenseId: 'OPH-8924-4102-XAU',
    userId: 'usr-customer-01',
    userEmail: 'antonioluna2001@gmail.com',
    planName: 'Dedicated MT5 Low-Latency VPS',
    provider: 'Equinix SG1 / Ultra-VPS FinTech',
    region: 'Singapore (1.2ms to IC Markets SC)',
    ipAddress: '139.180.198.42',
    os: 'Windows Server 2022 Datacenter (Optimized for MT5)',
    status: 'active',
    renewalPriceUSDT: 360,
    activatedAt: '2026-08-11T15:00:00Z',
    expiresAt: '2027-08-11T15:00:00Z',
    lastHeartbeatAt: '2026-09-09T13:20:00Z',
    notes: 'Pre-configured MT5 terminal with OPHIREUM WebRequest permissions granted.'
  }
];

export const INITIAL_UNBINDING_REQUESTS: UnbindingRequest[] = [
  {
    id: 'unb-2026-001',
    licenseId: 'OPH-8924-4102-XAU',
    userId: 'usr-customer-01',
    userEmail: 'antonioluna2001@gmail.com',
    currentLogin: '7729014',
    currentBroker: 'IC Markets (SC)',
    reason: 'Upgrading to Dedicated Raw Spread Account #7731802 with lower commission structure.',
    newLogin: '7731802',
    newBroker: 'IC Markets (SC)',
    status: 'pending',
    createdAt: '2026-09-09T10:15:00Z',
    updatedAt: '2026-09-09T10:15:00Z'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-2026-4401',
    userId: 'usr-customer-01',
    userEmail: 'antonioluna2001@gmail.com',
    category: 'WebRequest',
    priority: 'medium',
    status: 'resolved',
    subject: 'Verification of WebRequest URL in MT5 Terminal Settings',
    assignedAgent: 'David Mercer',
    createdAt: '2026-08-11T14:40:00Z',
    updatedAt: '2026-08-11T15:10:00Z',
    messages: [
      {
        id: 'msg-1',
        ticketId: 'TCK-2026-4401',
        senderId: 'usr-customer-01',
        senderName: 'Antonio Luna',
        senderRole: 'customer',
        message: 'Hello, I just purchased the Professional Kit. What exact URL should I paste into MT5 -> Tools -> Options -> Expert Advisors -> Allow WebRequest for listed URL?',
        createdAt: '2026-08-11T14:40:00Z'
      },
      {
        id: 'msg-2',
        ticketId: 'TCK-2026-4401',
        senderId: 'usr-support-01',
        senderName: 'David Mercer',
        senderRole: 'support_agent',
        message: 'Hello Antonio, congratulations on your licence activation. Please add: https://api.ophireum.com (ensure HTTPS is included). Then attach the EA to a 15-minute XAUUSD chart and your licence will validate automatically.',
        createdAt: '2026-08-11T14:55:00Z'
      },
      {
        id: 'msg-3',
        ticketId: 'TCK-2026-4401',
        senderId: 'usr-customer-01',
        senderName: 'Antonio Luna',
        senderRole: 'customer',
        message: 'Understood, added and successfully validated with green indicator. Thank you!',
        createdAt: '2026-08-11T15:10:00Z'
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-9901',
    actorId: 'usr-finance-01',
    actorRole: 'finance_reviewer',
    action: 'PAYMENT_CONFIRMED_ATOMIC_ACTIVATE',
    resourceType: 'ORDER',
    resourceId: 'ORD-2026-8831',
    previousValue: 'status: under_review',
    newValue: 'status: confirmed, licenseId: OPH-8924-4102-XAU',
    reason: 'Verified on TRC-20 Explorer with matching amount 1,399 USDT and confirmed block depth',
    ipAddress: '194.230.145.8',
    timestamp: '2026-08-11T14:22:00Z',
    result: 'SUCCESS'
  },
  {
    id: 'aud-9902',
    actorId: 'usr-customer-01',
    actorRole: 'customer',
    action: 'MT5_ACCOUNT_BOUND',
    resourceType: 'LICENSE',
    resourceId: 'OPH-8924-4102-XAU',
    previousValue: 'boundMt5Account: null',
    newValue: 'boundMt5Account: 7729014, broker: IC Markets (SC)',
    reason: 'Initial account binding by licensed customer',
    ipAddress: '120.29.74.19',
    timestamp: '2026-08-11T15:05:00Z',
    result: 'SUCCESS'
  },
  {
    id: 'aud-9903',
    actorId: 'usr-customer-01',
    actorRole: 'customer',
    action: 'UNBINDING_REQUEST_SUBMITTED',
    resourceType: 'UNBINDING_REQUEST',
    resourceId: 'unb-2026-001',
    previousValue: 'none',
    newValue: 'target: 7731802',
    reason: 'Upgrading to Dedicated Raw Spread Account #7731802 with lower commission structure.',
    ipAddress: '120.29.74.19',
    timestamp: '2026-09-09T10:15:00Z',
    result: 'SUCCESS'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'usr-customer-01',
    title: 'EA Heartbeat Verified',
    message: 'Your MT5 Expert Advisor on IC Markets #7729014 is operating with nominal latency (1.2ms).',
    type: 'success',
    category: 'system',
    read: false,
    createdAt: '2026-09-09T13:20:00Z'
  },
  {
    id: 'notif-2',
    userId: 'usr-customer-01',
    title: 'Unbinding Request Under Review',
    message: 'Your MT5 migration request to account #7731802 has been routed to the Licence Administration desk.',
    type: 'info',
    category: 'binding',
    read: false,
    createdAt: '2026-09-09T10:15:00Z'
  },
  {
    id: 'notif-3',
    userId: 'ALL',
    title: 'OPHIREUM EA v2.4.1 Production Notice',
    message: 'Production build v2.4.1 is active. Legacy versions below v2.4.0 will be blocked starting next scheduled maintenance.',
    type: 'warning',
    category: 'system',
    read: true,
    createdAt: '2026-08-15T09:00:00Z'
  }
];

export const INITIAL_HEARTBEATS: HeartbeatLog[] = [
  {
    id: 'hb-01',
    licenseId: 'OPH-8924-4102-XAU',
    mt5Login: '7729014',
    brokerServer: 'ICMarketsSC-Live04',
    tradingSymbol: 'XAUUSD',
    eaVersion: '2.4.1',
    spreadPips: 1.1,
    openPositionsCount: 1,
    derivedStatus: 'online',
    receivedAt: '2026-09-09T13:20:00Z'
  },
  {
    id: 'hb-02',
    licenseId: 'OPH-8924-4102-XAU',
    mt5Login: '7729014',
    brokerServer: 'ICMarketsSC-Live04',
    tradingSymbol: 'XAUUSD',
    eaVersion: '2.4.1',
    spreadPips: 0.9,
    openPositionsCount: 1,
    derivedStatus: 'online',
    receivedAt: '2026-09-09T13:15:00Z'
  }
];
