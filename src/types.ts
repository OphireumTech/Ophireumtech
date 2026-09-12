/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM EXPERT ASSISTANT - Complete Type Definitions
 */

export type UserRole = 
  | 'visitor'
  | 'customer'
  | 'support_agent'
  | 'finance_reviewer'
  | 'license_admin'
  | 'super_admin';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone?: string;
  country?: string;
  isEmailVerified: boolean;
  mfaEnabled: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  starterPurchased?: boolean;
  agreementsAccepted: {
    termsVersion: string;
    slaVersion: string;
    riskDisclosureVersion: string;
    acceptedAt: string;
    ipAddress: string;
  } | null;
}

export interface LicensePlan {
  id: string;
  name: string;
  slug: 'starter' | 'professional' | 'premium' | 'institutional';
  priceUSDT: number;
  validityDays: number;
  riskSettingPct: number;
  lotSetting: number;
  suggestedEquityUSD: string;
  signalsCount: number;
  description: string;
  isTrial: boolean;
  features: string[];
}

export type LicenseStatus =
  | 'awaiting_payment'
  | 'payment_under_review'
  | 'ready_for_binding'
  | 'active'
  | 'expiring_soon'
  | 'expired'
  | 'suspended'
  | 'revoked'
  | 'unbinding_requested'
  | 'upgrade_pending';

export interface License {
  id: string; // e.g. OPH-8839-4421-XAU
  userId: string;
  userEmail: string;
  planId: string;
  planName: string;
  status: LicenseStatus;
  validityDays: number;
  riskSettingPct: number;
  lotSetting: number;
  suggestedEquity: string;
  signalsCount: number;
  activatedAt?: string;
  expiresAt?: string;
  boundMt5Account?: string;
  brokerName?: string;
  brokerServer?: string;
  accountType?: 'Standard' | 'Raw' | 'Pro' | 'ECN';
  boundAt?: string;
  eaVersionUsed?: string;
  lastValidationAt?: string;
  lastHeartbeatAt?: string;
  heartbeatStatus?: 'online' | 'delayed' | 'offline' | 'paused' | 'error';
  isAutomationPaused?: boolean;
  pauseReason?: string;
  suspensionReason?: string;
  vpsAssigned?: boolean;
  vpsId?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// APPROVED BROKERS SPECIFICATION (STRICT - NO OTHER BROKERS ALLOWED)
// ============================================================================
export type ApprovedBrokerName =
  | 'FBS.com'
  | 'GTCFX.com'
  | 'Vantage Markets (Pty) Ltd'
  | 'Pepperstone Markets Limited';

export interface ApprovedBrokerConfig {
  name: ApprovedBrokerName;
  displayName: string;
  website: string;
  regulatoryJurisdiction: string;
  servers: string[];
  defaultGoldSymbol: string;
  supportedGoldSymbols: string[];
  recommendedAccountType: 'Raw Spread / ECN' | 'Standard' | 'Pro / Zero';
  minDepositUsd: number;
  maxLeverage: string;
}

export type Mt5BindingState =
  | 'draft'
  | 'pending_worker_validation'
  | 'active'
  | 'suspended'
  | 'unbound'
  | 'disconnected'
  | 'failed';

export type Mt5ConnectionStatus =
  | 'binding_infrastructure_pending'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export interface Mt5Binding {
  id?: string;
  licenseId: string;
  userId: string;
  userEmail?: string;
  mt5Login: string;
  brokerName: ApprovedBrokerName | string;
  brokerServer: string;
  accountType: string;
  status: Mt5BindingState;
  connectionState: Mt5ConnectionStatus;
  credentialRefId?: string; // Reference to Secret Manager encrypted credential, NEVER plaintext password
  workerId?: string; // Assigned Windows VPS MT5 Worker
  workerAssignedAt?: string;
  boundAt?: string;
  lastVerifiedAt?: string;
  lastSyncAt?: string;
  terminalLatencyMs?: number;
  terminalConnected?: boolean;
  executionHalted?: boolean;
  haltReason?: string;
  goldSymbolMapped?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Mt5Worker {
  id: string; // e.g. worker-win-vps-01
  name: string;
  ipAddress: string;
  region: string;
  os: string;
  terminalVersion: string;
  status: 'online' | 'offline' | 'busy' | 'maintenance';
  activeAccountsCount: number;
  maxAccountsCapacity: number;
  lastHeartbeatAt: string;
  approvedBrokers: ApprovedBrokerName[];
  createdAt: string;
  updatedAt: string;
}

export interface Mt5AccountSnapshot {
  id?: string;
  licenseId: string;
  userId: string;
  mt5Login: string;
  broker: string;
  server: string;
  currency: string;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  leverage: number;
  floatingProfit: number;
  closedProfitToday: number;
  openPositionsCount: number;
  activeOrdersCount: number;
  pingMs: number;
  terminalConnected: boolean;
  tradingAllowed: boolean;
  eaAttached: boolean;
  goldSymbolMapped: string;
  workerId: string;
  snapshotTimestamp: string;
}

export interface Mt5Position {
  id: string;
  licenseId: string;
  userId: string;
  mt5Login: string;
  ticket: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  openPrice: number;
  currentPrice: number;
  sl: number;
  tp: number;
  profit: number;
  swap: number;
  openTime: string;
}

export interface Mt5Order {
  id: string;
  licenseId: string;
  ticket: number;
  symbol: string;
  type: 'BUY_LIMIT' | 'SELL_LIMIT' | 'BUY_STOP' | 'SELL_STOP';
  volume: number;
  price: number;
  sl: number;
  tp: number;
  state: string;
  placedAt: string;
}

export interface Mt5Deal {
  id: string;
  licenseId: string;
  ticket: number;
  orderId: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  price: number;
  profit: number;
  commission: number;
  swap: number;
  executedAt: string;
}

export type ExecutionCommandType =
  | 'VALIDATE_ACCOUNT'
  | 'CONNECT_TERMINAL'
  | 'SYNC_STATE'
  | 'EMERGENCY_STOP'
  | 'RESUME_TRADING'
  | 'DISCONNECT_UNBIND';

export interface ExecutionRequest {
  id: string;
  licenseId: string;
  userId: string;
  workerId?: string;
  command: ExecutionCommandType;
  payload: Record<string, any>;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  attempts: number;
  requestedAt: string;
  processedAt?: string;
}

export interface ExecutionResult {
  id: string;
  requestId: string;
  licenseId: string;
  workerId: string;
  command: string;
  success: boolean;
  returnCode: number;
  resultData?: any;
  errorMessage?: string;
  executionTimeMs: number;
  timestamp: string;
}

export interface AccountHeartbeat {
  id: string;
  licenseId: string;
  mt5Login: string;
  workerId: string;
  status: 'online' | 'delayed' | 'offline';
  latencyMs: number;
  timestamp: string;
}

export interface BrokerServerConfig {
  id: string;
  brokerName: ApprovedBrokerName;
  serverName: string;
  isLive: boolean;
  goldSymbol: string;
  minDepositUSD: number;
  leverageCap: number;
  status: 'active' | 'deprecated';
}

export interface SymbolMapping {
  id: string;
  brokerName: ApprovedBrokerName;
  standardSymbol: 'XAUUSD';
  brokerSymbol: string;
  contractSize: number;
  digits: number;
  minLot: number;
  maxLot: number;
  lotStep: number;
  isVerified: boolean;
}

export interface RiskPolicy {
  id: string;
  planId: string;
  maxLot: number;
  riskPercent: number;
  hardStopLossRequired: boolean;
  maxDailyLossPct: number;
  maxDrawdownPct: number;
  weekendHoldingAllowed: boolean;
  newsTradingAllowed: boolean;
}

export interface AutomationEvent {
  id: string;
  licenseId: string;
  eventType: 'EMERGENCY_HALT' | 'RESUMED' | 'SYMBOL_DRIFT' | 'MARGIN_WARNING' | 'CONNECTION_DROP' | 'WORKER_FAILOVER';
  severity: 'info' | 'warning' | 'critical';
  details: string;
  actor: string;
  timestamp: string;
}

export interface CredentialReference {
  id: string;
  licenseId: string;
  userId: string;
  mt5Login: string;
  brokerServer: string;
  secretManagerUri: string;
  keyVersion: string;
  encryptedEnvelope: string;
  iv: string;
  authTag: string;
  createdAt: string;
  lastRotatedAt: string;
}

export interface BindingAuditLog {
  id: string;
  licenseId: string;
  userId: string;
  actorUid: string;
  actorRole: string;
  action:
    | 'BINDING_INITIATED'
    | 'CREDENTIALS_ENCRYPTED'
    | 'WORKER_DISPATCHED'
    | 'BROKER_AUTHENTICATION_VERIFIED'
    | 'EMERGENCY_STOP_TRIGGERED'
    | 'TRADING_RESUMED'
    | 'UNBINDING_REQUESTED'
    | 'UNBINDING_EXECUTED';
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILED' | 'REJECTED';
  timestamp: string;
}

export interface UnbindingRequest {
  id: string;
  licenseId: string;
  userId: string;
  userEmail: string;
  currentLogin: string;
  currentBroker: string;
  reason: string;
  newLogin?: string;
  newMt5Account?: string;
  newBroker?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 
  | 'USDT-TRC20'
  | 'USDT-ERC20'
  | 'CARD'
  | 'BANK_TRANSFER';

export type OrderStatus =
  | 'pending'
  | 'under_review'
  | 'confirmed'
  | 'rejected'
  | 'refunded';

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  planId: string;
  planName: string;
  amountUSDT: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  depositAddress: string;
  txHash?: string;
  paymentProofUrl?: string;
  rejectionReason?: string;
  invoiceId: string;
  licenseId?: string;
  createdAt: string;
  confirmedAt?: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  licenseId?: string;
  userId: string;
  userEmail: string;
  planName: string;
  amountUSDT: number;
  paymentMethod: PaymentMethod;
  txHash?: string;
  status: 'paid' | 'pending' | 'refunded';
  issuedAt: string;
  taxNote: string;
  companyDetails: {
    name: string;
    division: string;
    contactEmail: string;
    supportWhatsApp: string;
  };
}

export interface EAVersion {
  id?: string;
  version: string;
  releaseDate: string;
  minSupportedVersion: string;
  checksumSHA256: string;
  fileName: string;
  downloadPath: string;
  status: 'production' | 'testing' | 'deprecated' | 'blocked';
  releaseNotes: string[];
  forceUpdate: boolean;
}

export interface EAValidationRequest {
  licenseId: string;
  mt5Login: string;
  brokerName: string;
  brokerServer: string;
  tradingSymbol: string;
  eaVersion: string;
  installationId: string;
  timestamp: number;
  nonce: string;
  signature: string;
}

export interface EAValidationResponse {
  authorized: boolean;
  reasonCode: 
    | 'AUTHORIZED'
    | 'LICENSE_NOT_FOUND'
    | 'LICENSE_INACTIVE'
    | 'LICENSE_EXPIRED'
    | 'ACCOUNT_MISMATCH'
    | 'BROKER_MISMATCH'
    | 'SYMBOL_UNAUTHORIZED'
    | 'VERSION_UNSUPPORTED'
    | 'VERSION_FORCE_UPDATE'
    | 'NONCE_REUSED'
    | 'TIMESTAMP_OUT_OF_BOUNDS'
    | 'SIGNATURE_INVALID'
    | 'AUTOMATION_PAUSED'
    | 'EMERGENCY_STOP';
  licenseExpiresAt?: string;
  allowedSymbol?: string;
  permittedPolicy?: {
    maxLot: number;
    riskPct: number;
    signalsCount: number;
    stopLossMandatory: boolean;
    maxConcurrentPositions: number;
    spreadThresholdPips: number;
  };
  requiredEaVersion?: string;
  heartbeatIntervalSec?: number;
  paused?: boolean;
  message: string;
  webrequestUrl?: string;
}

export interface EAHeartbeatRequest {
  licenseId: string;
  mt5Login: string;
  brokerName: string;
  brokerServer: string;
  tradingSymbol: string;
  eaVersion: string;
  terminalStatus: 'running' | 'idle' | 'warning';
  tradingEnabled: boolean;
  lastMarketTickTime: number;
  uptimeSeconds: number;
  spreadPips: number;
  openPositionsCount: number;
  errorCode?: number;
  timestamp: number;
  signature: string;
}

export type HeartbeatDerivedStatus =
  | 'online'
  | 'delayed'
  | 'offline'
  | 'version_outdated'
  | 'license_invalid'
  | 'broker_disconnected'
  | 'symbol_invalid'
  | 'automation_paused'
  | 'configuration_error';

export interface HeartbeatLog {
  id: string;
  licenseId: string;
  mt5Login: string;
  brokerServer: string;
  tradingSymbol: string;
  eaVersion: string;
  spreadPips: number;
  openPositionsCount: number;
  derivedStatus: HeartbeatDerivedStatus;
  receivedAt: string;
}

export interface AutomationControl {
  id: string;
  scope: 'single_license' | 'single_mt5_account' | 'ea_version' | 'account_group' | 'global_emergency';
  targetIdentifier: string; // 'ALL' for global, licenseId, mt5Login, or version string
  isPaused: boolean;
  reason: string;
  setByRole: UserRole;
  setByEmail: string;
  updatedAt: string;
}

export interface VPSInstance {
  id: string;
  licenseId: string;
  userId: string;
  userEmail: string;
  planName: string;
  provider: string;
  region: string;
  ipAddress: string;
  os: string;
  status: 'provisioned' | 'active' | 'expiring' | 'maintenance' | 'offline';
  renewalPriceUSDT: number;
  activatedAt: string;
  expiresAt: string;
  lastHeartbeatAt?: string;
  notes?: string;
}

export type TicketCategory =
  | 'Registration'
  | 'Payment'
  | 'Licence'
  | 'MT5 Binding'
  | 'EA Installation'
  | 'WebRequest'
  | 'VPS'
  | 'EA Validation'
  | 'Technical Error'
  | 'Renewal'
  | 'Upgrade'
  | 'Security Concern'
  | 'General Inquiry';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed';

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  attachments?: { name: string; size: number; url: string }[];
  isStaffNote?: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  assignedAgent?: string;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // 'ALL' or user UID
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  category: 'license' | 'security' | 'payment' | 'system' | 'binding';
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: UserRole;
  action: string;
  resourceType: string;
  resourceId: string;
  target?: string;
  details?: string;
  previousValue?: string;
  newValue?: string;
  reason: string;
  ipAddress: string;
  userAgent?: string;
  timestamp: string;
  result: 'SUCCESS' | 'DENIED' | 'FAILED';
}

export interface SystemSettings {
  webrequestUrl: string;
  approvedSymbols: string[];
  contactEmail: string;
  supportWhatsApp: string;
  mobileContact: string;
  officialDomain: string;
  usdtTrc20DepositAddress: string;
  usdtErc20DepositAddress: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swiftCode: string;
    referenceFormat: string;
  };
  globalEmergencyStop: boolean;
  globalStopReason?: string;
  maintenanceMode: boolean;
  vpsAnnualPriceUSDT: number;
}
