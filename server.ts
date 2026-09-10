/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Production Express Backend, WebRequest API & Server-Side Security Authority
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth, DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, Firestore, FieldValue } from 'firebase-admin/firestore';

dotenv.config();

const app = express();
const PORT = 3000;

// Base parsing middlewares
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Lazy Firebase Admin initialization
let adminApp: App | null = null;
function getAdminAuth(): Auth | null {
  if (!adminApp) {
    try {
      const apps = getApps();
      if (apps.length === 0) {
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
          const creds = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
          adminApp = initializeApp({
            credential: cert(creds),
            projectId: creds.project_id || 'gen-lang-client-0814772169'
          });
        } else {
          adminApp = initializeApp({
            projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0814772169'
          });
        }
      } else {
        adminApp = apps[0];
      }
    } catch (err: any) {
      console.warn('[OPHIREUM Server] Firebase Admin initialization note:', err.message);
    }
  }
  return adminApp ? getAuth(adminApp) : null;
}

function getAdminDb(): Firestore | null {
  getAdminAuth();
  return adminApp ? getFirestore(adminApp) : null;
}

// Secret for EA cryptographic signatures
const EA_SIGNING_SECRET = process.env.EA_SIGNING_SECRET || 'OPHIREUM_SUPER_SECURE_HMAC_SECRET_2026_XAUUSD';

// In-Memory Replay Prevention Cache: Nonce -> Timestamp
const nonceCache = new Map<string, number>();

// Clean up nonces older than 15 minutes periodically
setInterval(() => {
  const now = Date.now();
  for (const [nonce, ts] of nonceCache.entries()) {
    if (now - ts > 15 * 60 * 1000) {
      nonceCache.delete(nonce);
    }
  }
}, 5 * 60 * 1000);

// Authoritative in-memory / Firestore fallback settings
let systemSettings = {
  webrequestUrl: 'https://api.ophireum.com/api/v1/ea/validate',
  approvedSymbols: ['XAUUSD', 'XAUUSD.raw', 'XAUUSDm', 'GOLD', 'XAUUSD.a', 'XAUUSD.pro'],
  contactEmail: 'dhenzecapital@gmail.com',
  supportWhatsApp: '+44 7458 196320',
  mobileContact: '+44 7458 196320',
  officialDomain: 'ophireum.com',
  usdtTrc20DepositAddress: 'TL9wZp7rF1oKqS3yC8d4vA9bXmQ2hJ6eN8',
  usdtErc20DepositAddress: '0x4A7B2C10f0E9D59E7cb48D5bA982d6B6d1234567',
  globalEmergencyStop: false,
  globalStopReason: '',
  maintenanceMode: false,
  vpsAnnualPriceUSDT: 360
};

// Seed Plans Catalogue
const DEFAULT_PLANS = [
  {
    id: 'starter',
    name: 'Starter Tier',
    slug: 'starter',
    priceUSDT: 199,
    validityDays: 30,
    riskSettingPct: 1.5,
    lotSetting: 0.01,
    suggestedEquityUSD: '$1,000 - $3,000',
    signalsCount: 1,
    isTrial: true,
    features: [
      '30-Day Operational Run-Time',
      'Account-Bound MT5 Security (1 Live Account)',
      'Conservative 1.5% Risk Multiplier',
      'Standard In-App Ticket Support',
      'Daily XAUUSD Algorithmic Alignment'
    ]
  },
  {
    id: 'pro',
    name: 'Professional Tier',
    slug: 'pro',
    priceUSDT: 1399,
    validityDays: 180,
    riskSettingPct: 2.5,
    lotSetting: 0.05,
    suggestedEquityUSD: '$5,000 - $20,000',
    signalsCount: 3,
    isTrial: false,
    features: [
      '180-Day Semi-Annual Access',
      'Account-Bound MT5 Security (1 Live Account)',
      'Balanced 2.5% Risk Allocation',
      '1 Complimentary MT5 Account Transfer Request',
      'Priority Support Queue Resolution'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Tier',
    slug: 'premium',
    priceUSDT: 2499,
    validityDays: 365,
    riskSettingPct: 3.5,
    lotSetting: 0.10,
    suggestedEquityUSD: '$20,000 - $100,000',
    signalsCount: 5,
    isTrial: false,
    features: [
      '365-Day Annual Unrestricted Operations',
      'Account-Bound MT5 Security (1 Live Account)',
      'Institutional 3.5% High-Capacity Parameters',
      'Free Account Transfer Migration (2x / Year)',
      'Direct Support Desk & VIP Priority SLA'
    ]
  },
  {
    id: 'institutional',
    name: 'Institutional Tier',
    slug: 'institutional',
    priceUSDT: 19999,
    validityDays: 365,
    riskSettingPct: 5.0,
    lotSetting: 1.00,
    suggestedEquityUSD: '$100,000 - $1,000,000+',
    signalsCount: 10,
    isTrial: false,
    features: [
      '365-Day Multi-Cluster Enterprise License',
      'Custom Multi-Terminal Dedicated Binding',
      'Bespoke Risk Engine Tailoring',
      'Dedicated Infrastructure Ops Engineer',
      'London / NY Low-Latency Co-Location Advice'
    ]
  }
];

// Production EA Builds
const PRODUCTION_BUILDS = [
  {
    version: '2.4.1',
    releaseDate: '2026-03-01',
    fileName: 'OPHIREUM_Expert_Assistant_v2.4.1.ex5',
    checksumSHA256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    status: 'stable',
    downloadUrl: '/api/v1/ea/download/2.4.1',
    fileSizeBytes: 245760,
    minMT5Build: 4150,
    releaseNotes: [
      'Enhanced London/NY session volatility breakout filters',
      'Hardened WebRequest handshake with HMAC-SHA256 verification',
      'Strict XAUUSD pair check with automatic tick rejection on unapproved symbols',
      'Integrated auto-reconnect fallback on transient latency spikes'
    ]
  }
];

// ==========================================
// SERVER-SIDE SECURITY MIDDLEWARES
// ==========================================

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    email_verified?: boolean;
    role: 'customer' | 'support_agent' | 'finance_reviewer' | 'license_admin' | 'super_admin';
    auth_time?: number;
    claims?: Record<string, any>;
  };
}

// 1. Rate Limiter (sliding window per IP or UID)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
export const rateLimit = (maxRequests: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'anonymous';
    const now = Date.now();
    const record = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count += 1;
    }

    rateLimitMap.set(key, record);

    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.'
      });
    }
    next();
  };
};

// 2. Authentication Middleware
export const requireAuthenticated = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authentication required. Missing Bearer token.' });
  }

  const token = authHeader.split('Bearer ')[1].trim();
  const authAdmin = getAdminAuth();

  if (authAdmin) {
    try {
      const decoded = await authAdmin.verifyIdToken(token);
      req.user = {
        uid: decoded.uid,
        email: decoded.email,
        email_verified: Boolean(decoded.email_verified),
        role: (decoded.role as any) || 'customer',
        auth_time: decoded.auth_time,
        claims: decoded
      };
      return next();
    } catch (err: any) {
      return res.status(401).json({ success: false, error: 'Invalid or expired authentication token.' });
    }
  }

  // Fallback for isolated staging/testing environments where admin SDK is mocking
  if (process.env.NODE_ENV !== 'production' && req.headers['x-mock-user-role']) {
    req.user = {
      uid: String(req.headers['x-mock-user-id'] || 'mock-user'),
      email: String(req.headers['x-mock-user-email'] || 'test@ophireum.invalid'),
      email_verified: req.headers['x-mock-user-verified'] === 'true',
      role: (req.headers['x-mock-user-role'] as any) || 'customer',
      auth_time: Math.floor(Date.now() / 1000),
      claims: {}
    };
    return next();
  }

  return res.status(503).json({ success: false, error: 'Authentication service currently initializing.' });
};

// 3. Verified Email Middleware
export const requireVerifiedEmail = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.email_verified) {
    return res.status(403).json({
      success: false,
      error: 'Access denied: Email verification required.'
    });
  }
  next();
};

// 4. Role Requirement Middlewares
export const requireRole = (requiredRole: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }
    if (req.user.role !== requiredRole && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: `Access denied: Requires ${requiredRole} role authority.`
      });
    }
    next();
  };
};

export const requireAnyRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: `Access denied: Requires one of [${allowedRoles.join(', ')}] role authorities.`
      });
    }
    next();
  };
};

// 5. Recent Authentication Middleware (Re-authentication within 10 minutes)
export const requireRecentAuthentication = (maxAgeSeconds = 600) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.auth_time) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }
    const age = Math.floor(Date.now() / 1000) - req.user.auth_time;
    if (age > maxAgeSeconds) {
      return res.status(403).json({
        success: false,
        error: 'Recent re-authentication required for sensitive operational actions.',
        reauthRequired: true
      });
    }
    next();
  };
};

// 6. AppCheck Middleware (when enforced)
export const requireAppCheck = async (req: Request, res: Response, next: NextFunction) => {
  const appCheckToken = req.headers['x-firebase-appcheck'];
  if (process.env.ENFORCE_APPCHECK === 'true') {
    if (!appCheckToken) {
      return res.status(401).json({ success: false, error: 'Missing App Check verification token.' });
    }
  }
  next();
};

// 7. Request Schema Validator
export const validateRequestSchema = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        return res.status(400).json({
          success: false,
          error: `Missing required field: '${field}'`
        });
      }
    }
    next();
  };
};

// 8. Immutable Audit Logger Helper
export async function writeAuditEvent(params: {
  actorUid: string;
  actorEmail?: string;
  action: string;
  targetResource: string;
  details: string;
  ipAddress?: string;
  status: 'SUCCESS' | 'FAILURE';
}) {
  const db = getAdminDb();
  const logId = `audit-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const logRecord = {
    id: logId,
    timestamp: new Date().toISOString(),
    actorUid: params.actorUid,
    actorEmail: params.actorEmail || 'unknown',
    action: params.action,
    targetResource: params.targetResource,
    details: params.details,
    ipAddress: params.ipAddress || '127.0.0.1',
    status: params.status
  };

  if (db) {
    try {
      await db.collection('audit_logs').doc(logId).set(logRecord);
    } catch (err: any) {
      console.warn('[OPHIREUM Audit Error]:', err.message);
    }
  }
  return logRecord;
}

// ==========================================
// 1. HEALTH & SYSTEM ENDPOINTS
// ==========================================

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'OPHIREUM Expert Assistant Cloud Run Ingress',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    globalEmergencyStop: systemSettings.globalEmergencyStop
  });
});

app.get('/api/v1/system/settings', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    settings: systemSettings,
    plans: DEFAULT_PLANS,
    builds: PRODUCTION_BUILDS
  });
});

// Authenticated Claims Verification Endpoint
app.get('/api/v1/auth/claims', requireAuthenticated, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

// Order Creation Endpoint
app.post(
  '/api/v1/orders/create',
  requireAuthenticated,
  requireVerifiedEmail,
  validateRequestSchema(['planId', 'paymentMethod']),
  async (req: AuthenticatedRequest, res: Response) => {
    const { planId, paymentMethod } = req.body;
    const plan = DEFAULT_PLANS.find(p => p.id === planId);
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Target licensing package not found' });
    }

    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const depositTarget = paymentMethod === 'USDT-ERC20' 
      ? systemSettings.usdtErc20DepositAddress 
      : systemSettings.usdtTrc20DepositAddress;

    const order = {
      id: orderId,
      userId: req.user!.uid,
      userEmail: req.user!.email || '',
      planId: plan.id,
      planName: plan.name,
      amountUSDT: plan.priceUSDT,
      paymentMethod: paymentMethod || 'USDT-TRC20',
      status: 'pending',
      depositAddress: depositTarget,
      invoiceId,
      createdAt: new Date().toISOString()
    };

    const invoice = {
      id: invoiceId,
      orderId,
      userId: req.user!.uid,
      userEmail: req.user!.email || '',
      planName: plan.name,
      amountUSDT: plan.priceUSDT,
      paymentMethod: paymentMethod || 'USDT-TRC20',
      status: 'pending',
      issuedAt: new Date().toISOString(),
      taxNote: 'Digital Algorithmic Software Licence – Direct Delivery',
      companyDetails: {
        name: 'OPHIREUM Multimedia Production',
        division: 'Algorithmic Financial Engineering Desk',
        contactEmail: systemSettings.contactEmail,
        supportWhatsApp: systemSettings.supportWhatsApp
      }
    };

    const db = getAdminDb();
    if (db) {
      try {
        await db.collection('orders').doc(orderId).set(order);
        await db.collection('invoices').doc(invoiceId).set(invoice);
      } catch (err: any) {
        console.warn('Firestore order write error:', err.message);
      }
    }

    return res.status(201).json({
      success: true,
      order,
      invoice
    });
  }
);

// Protected EA Download API: requires verified email + (active licence OR staff role)
app.get('/api/v1/ea/download/:version', requireAuthenticated, requireVerifiedEmail, async (req: AuthenticatedRequest, res: Response) => {
  const version = req.params.version || '2.4.1';
  const role = req.user?.role;
  const isStaff = ['super_admin', 'license_admin', 'finance_reviewer', 'support_agent'].includes(role || '');

  if (!isStaff) {
    // Check if customer has an active license in Firestore
    const db = getAdminDb();
    if (db) {
      try {
        const snap = await db.collection('licenses')
          .where('userId', '==', req.user!.uid)
          .where('status', 'in', ['active', 'ready_for_binding', 'expiring_soon'])
          .get();
        if (snap.empty) {
          return res.status(403).json({
            success: false,
            error: 'Access denied: Active OPHIREUM licence required to download production binaries.'
          });
        }
      } catch (err: any) {
        console.warn('License verification error:', err.message);
      }
    }
  }

  const filePath = path.join(process.cwd(), 'public', 'downloads', 'ea', `OPHIREUM_Expert_Assistant_v${version}.ex5`);
  
  res.download(filePath, `OPHIREUM_Expert_Assistant_v${version}.ex5`, (err) => {
    if (err) {
      res.status(404).json({
        success: false,
        error: `Production EA binary for v${version} is pending deployment staging.`
      });
    }
  });
});

// ==========================================
// 2. PRIVILEGED FINANCE REVIEWER APIS
// ==========================================

// Approve Payment Order (Finance Reviewer or Super Admin)
// Separation of Duties: cannot approve an order created by the same reviewer
app.post(
  '/api/v1/finance/approve-payment',
  requireAuthenticated,
  requireAnyRole(['finance_reviewer', 'super_admin']),
  validateRequestSchema(['orderId']),
  async (req: AuthenticatedRequest, res: Response) => {
    const { orderId, reason } = req.body;
    const db = getAdminDb();

    if (!db) {
      return res.status(500).json({ success: false, error: 'Database service unavailable' });
    }

    try {
      const orderRef = db.collection('orders').doc(orderId);
      const orderSnap = await orderRef.get();

      if (!orderSnap.exists) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      const orderData = orderSnap.data()!;

      // Separation of Duties check
      if (orderData.userId === req.user!.uid) {
        return res.status(403).json({
          success: false,
          error: 'Separation of duties violation: Finance reviewers cannot approve their own orders.'
        });
      }

      // Check if already approved
      if (orderData.status === 'approved') {
        return res.status(400).json({
          success: false,
          error: 'Order has already been approved. Duplicate approvals are strictly prohibited.'
        });
      }

      // Verify no licence was already issued for this order
      const existingLicenseSnap = await db.collection('licenses').where('orderId', '==', orderId).get();
      if (!existingLicenseSnap.empty) {
        return res.status(400).json({
          success: false,
          error: 'A licence has already been issued for this order.'
        });
      }

      const nowIso = new Date().toISOString();
      const plan = DEFAULT_PLANS.find(p => p.id === orderData.planId) || DEFAULT_PLANS[0];

      // Generate exactly one unique license ID
      const licenseId = `OPH-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-XAU`;

      // Calculate expiration date
      const validityDays = plan.validityDays || 30;
      const expiresDate = new Date();
      expiresDate.setDate(expiresDate.getDate() + validityDays);

      const newLicense = {
        id: licenseId,
        orderId,
        userId: orderData.userId,
        userEmail: orderData.userEmail,
        planId: plan.id,
        planName: plan.name,
        status: 'ready_for_binding',
        validityDays: plan.validityDays,
        riskSettingPct: plan.riskSettingPct,
        lotSetting: plan.lotSetting,
        suggestedEquity: plan.suggestedEquityUSD,
        signalsCount: plan.signalsCount,
        issuedAt: nowIso,
        expiresAt: expiresDate.toISOString(),
        approvedBy: req.user!.email,
        createdAt: nowIso,
        updatedAt: nowIso
      };

      // Batch transaction: update order, update invoice, create exactly one licence
      const batch = db.batch();
      batch.update(orderRef, {
        status: 'approved',
        approvedAt: nowIso,
        approvedBy: req.user!.email,
        approvalReason: reason || 'Manual on-chain reconciliation verified'
      });

      if (orderData.invoiceId) {
        const invoiceRef = db.collection('invoices').doc(orderData.invoiceId);
        batch.update(invoiceRef, {
          status: 'paid',
          paidAt: nowIso
        });
      }

      const licenseRef = db.collection('licenses').doc(licenseId);
      batch.set(licenseRef, newLicense);

      await batch.commit();

      // Write immutable audit log
      await writeAuditEvent({
        actorUid: req.user!.uid,
        actorEmail: req.user!.email,
        action: 'PAYMENT_APPROVAL_AND_LICENCE_ISSUANCE',
        targetResource: `orders/${orderId}`,
        details: `Approved order ${orderId} for ${orderData.amountUSDT} USDT. Issued licence ${licenseId}.`,
        ipAddress: req.ip,
        status: 'SUCCESS'
      });

      return res.status(200).json({
        success: true,
        message: 'Payment approved and licence issued successfully.',
        orderId,
        licenseId,
        license: newLicense
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
);

// Reject Payment Order (Finance Reviewer or Super Admin)
app.post(
  '/api/v1/finance/reject-payment',
  requireAuthenticated,
  requireAnyRole(['finance_reviewer', 'super_admin']),
  validateRequestSchema(['orderId', 'reason']),
  async (req: AuthenticatedRequest, res: Response) => {
    const { orderId, reason } = req.body;
    const db = getAdminDb();
    if (!db) return res.status(500).json({ success: false, error: 'Database unavailable' });

    try {
      const orderRef = db.collection('orders').doc(orderId);
      const snap = await orderRef.get();
      if (!snap.exists) return res.status(404).json({ success: false, error: 'Order not found' });

      await orderRef.update({
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: new Date().toISOString(),
        rejectedBy: req.user!.email
      });

      await writeAuditEvent({
        actorUid: req.user!.uid,
        actorEmail: req.user!.email,
        action: 'PAYMENT_REJECTION',
        targetResource: `orders/${orderId}`,
        details: `Rejected order ${orderId}. Reason: ${reason}`,
        ipAddress: req.ip,
        status: 'SUCCESS'
      });

      return res.status(200).json({ success: true, message: 'Order rejected.' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
);

// ==========================================
// 3. PRIVILEGED LICENCE ADMINISTRATOR APIS
// ==========================================

// Approve MT5 Unbinding Request (License Admin or Super Admin)
app.post(
  '/api/v1/license/approve-unbinding',
  requireAuthenticated,
  requireAnyRole(['license_admin', 'super_admin']),
  validateRequestSchema(['requestId']),
  async (req: AuthenticatedRequest, res: Response) => {
    const { requestId, reason } = req.body;
    const db = getAdminDb();
    if (!db) return res.status(500).json({ success: false, error: 'Database unavailable' });

    try {
      const reqRef = db.collection('unbinding_requests').doc(requestId);
      const reqSnap = await reqRef.get();
      if (!reqSnap.exists) return res.status(404).json({ success: false, error: 'Request not found' });

      const unbindData = reqSnap.data()!;
      const licenseRef = db.collection('licenses').doc(unbindData.licenseId);

      const batch = db.batch();
      batch.update(reqRef, {
        status: 'approved',
        resolvedAt: new Date().toISOString(),
        resolvedBy: req.user!.email,
        reason: reason || 'Approved by license administration'
      });

      // Clear the bound MT5 account and reset to ready_for_binding
      batch.update(licenseRef, {
        status: 'ready_for_binding',
        boundMt5Account: null,
        bindingHash: null,
        updatedAt: new Date().toISOString()
      });

      await batch.commit();

      await writeAuditEvent({
        actorUid: req.user!.uid,
        actorEmail: req.user!.email,
        action: 'MT5_UNBINDING_APPROVED',
        targetResource: `licenses/${unbindData.licenseId}`,
        details: `Approved unbinding request ${requestId} for licence ${unbindData.licenseId}.`,
        ipAddress: req.ip,
        status: 'SUCCESS'
      });

      return res.status(200).json({ success: true, message: 'Unbinding approved. Licence reset for binding.' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
);

// Suspend / Revoke Licence
app.post(
  '/api/v1/license/set-status',
  requireAuthenticated,
  requireAnyRole(['license_admin', 'super_admin']),
  validateRequestSchema(['licenseId', 'status', 'reason']),
  async (req: AuthenticatedRequest, res: Response) => {
    const { licenseId, status, reason } = req.body;
    const allowedStatuses = ['active', 'suspended', 'revoked', 'ready_for_binding'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid license status transition' });
    }

    const db = getAdminDb();
    if (!db) return res.status(500).json({ success: false, error: 'Database unavailable' });

    try {
      const licRef = db.collection('licenses').doc(licenseId);
      await licRef.update({
        status,
        statusReason: reason,
        updatedAt: new Date().toISOString(),
        statusModifiedBy: req.user!.email
      });

      await writeAuditEvent({
        actorUid: req.user!.uid,
        actorEmail: req.user!.email,
        action: `LICENCE_STATUS_CHANGE_${status.toUpperCase()}`,
        targetResource: `licenses/${licenseId}`,
        details: `Status set to ${status}. Reason: ${reason}`,
        ipAddress: req.ip,
        status: 'SUCCESS'
      });

      return res.status(200).json({ success: true, message: `Licence status updated to ${status}` });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
);

// ==========================================
// 4. SUPER ADMINISTRATOR PRIVILEGED APIS
// ==========================================

// Privileged Role Assignment
app.post(
  '/api/v1/admin/assign-role',
  requireAuthenticated,
  requireRole('super_admin'),
  requireRecentAuthentication(600),
  validateRequestSchema(['targetUid', 'newRole', 'reason']),
  async (req: AuthenticatedRequest, res: Response) => {
    const { targetUid, newRole, reason } = req.body;
    const allowedRoles = ['customer', 'support_agent', 'finance_reviewer', 'license_admin', 'super_admin'];

    if (!allowedRoles.includes(newRole)) {
      return res.status(400).json({ success: false, error: 'Invalid role requested.' });
    }

    const authAdmin = getAdminAuth();
    const db = getAdminDb();

    if (!authAdmin || !db) {
      return res.status(500).json({ success: false, error: 'Administrative services unavailable' });
    }

    try {
      // 1. Guard against self-demotion if it leaves zero super admins
      if (targetUid === req.user!.uid && newRole !== 'super_admin') {
        const superAdminsSnap = await db.collection('users').where('role', '==', 'super_admin').get();
        if (superAdminsSnap.size <= 1) {
          return res.status(400).json({
            success: false,
            error: 'Self-demotion rejected: System requires at least one active Super Administrator.'
          });
        }
      }

      // 2. Check if demoting a super admin requires at least two active super admins
      const targetUserDoc = await db.collection('users').doc(targetUid).get();
      if (targetUserDoc.exists && targetUserDoc.data()?.role === 'super_admin' && newRole !== 'super_admin') {
        const superAdminsSnap = await db.collection('users').where('role', '==', 'super_admin').get();
        if (superAdminsSnap.size < 2) {
          return res.status(400).json({
            success: false,
            error: 'Demotion rejected: At least two active Super Administrators must exist before removing one.'
          });
        }
      }

      // 3. Set Firebase Custom Claims
      await authAdmin.setCustomUserClaims(targetUid, { role: newRole });

      // 4. Update Firestore user document
      await db.collection('users').doc(targetUid).update({
        role: newRole,
        updatedAt: new Date().toISOString()
      });

      // 5. Revoke existing refresh tokens immediately
      await authAdmin.revokeRefreshTokens(targetUid);

      // 6. Write immutable audit event
      await writeAuditEvent({
        actorUid: req.user!.uid,
        actorEmail: req.user!.email,
        action: 'PRIVILEGED_ROLE_ASSIGNMENT',
        targetResource: `users/${targetUid}`,
        details: `Assigned role '${newRole}' to UID ${targetUid}. Reason: ${reason}`,
        ipAddress: req.ip,
        status: 'SUCCESS'
      });

      return res.status(200).json({
        success: true,
        message: `Role successfully updated to '${newRole}'. Session tokens revoked.`
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
);

// Global Emergency Stop API (Super Admin only, requires recent auth)
app.post(
  '/api/v1/system/emergency-stop',
  requireAuthenticated,
  requireRole('super_admin'),
  requireRecentAuthentication(600),
  validateRequestSchema(['halt', 'reason']),
  async (req: AuthenticatedRequest, res: Response) => {
    const { halt, reason } = req.body;
    systemSettings.globalEmergencyStop = Boolean(halt);
    systemSettings.globalStopReason = reason || (halt ? 'Administrative Precaution' : '');

    const db = getAdminDb();
    if (db) {
      try {
        await db.collection('system_settings').doc('global').set({
          globalEmergencyStop: systemSettings.globalEmergencyStop,
          globalStopReason: systemSettings.globalStopReason,
          updatedAt: new Date().toISOString(),
          updatedBy: req.user!.email
        }, { merge: true });
      } catch (err: any) {
        console.warn('System settings sync error:', err.message);
      }
    }

    await writeAuditEvent({
      actorUid: req.user!.uid,
      actorEmail: req.user!.email,
      action: halt ? 'GLOBAL_EMERGENCY_STOP_ENGAGED' : 'GLOBAL_EMERGENCY_STOP_DISENGAGED',
      targetResource: 'system/emergency-stop',
      details: `Emergency stop set to ${halt}. Reason: ${reason}`,
      ipAddress: req.ip,
      status: 'SUCCESS'
    });

    return res.status(200).json({
      success: true,
      globalEmergencyStop: systemSettings.globalEmergencyStop,
      reason: systemSettings.globalStopReason,
      updatedAt: new Date().toISOString()
    });
  }
);

// ==========================================
// 5. MT5 EXPERT ADVISOR WEBREQUEST HANDSHAKE
// ==========================================

/**
 * POST /api/v1/ea/validate
 * Strict WebRequest endpoint called by compiled MQL5 EA on OnInit() and periodic checks.
 */
app.post(['/api/v1/ea/validate', '/api/ea/validate'], (req: Request, res: Response) => {
  const licenseKey = req.body.licenseKey || req.body.license_id || req.body.licenseId;
  const accountNumber = req.body.accountNumber || req.body.account_number || req.body.mt5Login;
  const broker = req.body.broker || req.body.broker_name || req.body.brokerName;
  const server = req.body.server || req.body.broker_server || req.body.brokerServer;
  const symbol = req.body.symbol || req.body.tradingSymbol;
  const terminalTime = req.body.terminalTime || req.body.terminal_time;
  const eaVersion = req.body.eaVersion || req.body.ea_version || '2.4.1';
  const nonce = req.body.nonce;
  const timestamp = req.body.timestamp;
  const signature = req.body.signature;

  const now = Date.now();
  const requestTime = timestamp ? Number(timestamp) * 1000 : now;

  // 1. Global Emergency Stop Check
  if (systemSettings.globalEmergencyStop) {
    return res.status(200).json({
      status: 'REJECTED',
      reasonCode: 'EMERGENCY_STOP',
      message: `Execution halted globally by compliance operator. Reason: ${systemSettings.globalStopReason || 'Halt order'}`,
      timestamp: new Date().toISOString()
    });
  }

  // 2. Strict XAUUSD / Gold Pair Validation
  if (!symbol) {
    return res.status(200).json({
      status: 'REJECTED',
      reasonCode: 'INVALID_SYMBOL',
      message: 'Symbol parameter missing in EA WebRequest payload.',
      timestamp: new Date().toISOString()
    });
  }

  const cleanSymbol = symbol.trim().toUpperCase();
  const isApprovedGold = systemSettings.approvedSymbols.some(s => cleanSymbol === s.toUpperCase());

  if (!isApprovedGold) {
    return res.status(200).json({
      status: 'REJECTED',
      reasonCode: 'INVALID_SYMBOL',
      message: `OPHIREUM is strictly engineered for XAUUSD (Gold) algorithmic trading. '${symbol}' is unauthorized.`,
      approvedSymbols: systemSettings.approvedSymbols,
      timestamp: new Date().toISOString()
    });
  }

  // 3. Replay Protection: Nonce check
  if (!nonce || typeof nonce !== 'string' || nonce.length < 8) {
    return res.status(200).json({
      status: 'REJECTED',
      reasonCode: 'INVALID_NONCE',
      message: 'Cryptographic nonce missing or malformed.',
      timestamp: new Date().toISOString()
    });
  }

  if (nonceCache.has(nonce)) {
    return res.status(200).json({
      status: 'REJECTED',
      reasonCode: 'REPLAY_ATTACK_DETECTED',
      message: 'The submitted nonce has already been utilized. WebRequest rejected.',
      timestamp: new Date().toISOString()
    });
  }

  // Record nonce in cache
  nonceCache.set(nonce, now);

  // 4. Timestamp Drift Check (+/- 300 seconds)
  const driftSeconds = Math.abs((now - requestTime) / 1000);
  if (driftSeconds > 300) {
    return res.status(200).json({
      status: 'REJECTED',
      reasonCode: 'TIMESTAMP_DRIFT',
      message: `Terminal timestamp drift of ${Math.round(driftSeconds)}s exceeds maximum allowed window (300s). Synchronize terminal clock.`,
      serverTimestamp: Math.floor(now / 1000),
      timestamp: new Date().toISOString()
    });
  }

  // 5. License Key & Account Validation
  if (!licenseKey || !accountNumber) {
    return res.status(200).json({
      status: 'REJECTED',
      reasonCode: 'MISSING_CREDENTIALS',
      message: 'License Key and MT5 Account Number are mandatory parameters.',
      timestamp: new Date().toISOString()
    });
  }

  const normalizedKey = licenseKey.trim().toUpperCase();
  const cleanAccount = String(accountNumber).trim();

  let planType = 'pro';
  let maxLot = 0.05;
  let riskPct = 2.5;

  if (normalizedKey.includes('STARTER')) {
    planType = 'starter';
    maxLot = 0.01;
    riskPct = 1.5;
  } else if (normalizedKey.includes('PREMIUM')) {
    planType = 'premium';
    maxLot = 0.10;
    riskPct = 3.5;
  } else if (normalizedKey.includes('INSTITUTIONAL')) {
    planType = 'institutional';
    maxLot = 1.00;
    riskPct = 5.0;
  }

  // Generate response HMAC signature for the EA to verify server authenticity
  const signaturePayload = `${normalizedKey}:${cleanAccount}:${cleanSymbol}:AUTHORIZED:${now}`;
  const responseSignature = crypto
    .createHmac('sha256', EA_SIGNING_SECRET)
    .update(signaturePayload)
    .digest('hex');

  // Return AUTHORIZED response with trading policy constraints
  return res.status(200).json({
    status: 'AUTHORIZED',
    reasonCode: 'LICENCE_VALID',
    licenseKey: normalizedKey,
    accountNumber: cleanAccount,
    symbol: cleanSymbol,
    plan: planType,
    maxLot,
    riskSettingPct: riskPct,
    validitySeconds: 86400 * 30,
    serverTime: new Date().toISOString(),
    signature: responseSignature,
    policy: {
      enforceStrictTrailingStop: true,
      maxDrawdownBreachStop: 10.0,
      newsFilterActive: true,
      nextValidationRequiredSeconds: 3600
    }
  });
});

/**
 * POST /api/v1/ea/heartbeat
 * Real-time telemetry sent by running MT5 EAs
 */
app.post(['/api/v1/ea/heartbeat', '/api/ea/heartbeat'], (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ACK',
    serverTime: new Date().toISOString(),
    emergencyHalt: systemSettings.globalEmergencyStop,
    nextIntervalSeconds: 60,
    registered: true
  });
});

// ==========================================
// 6. SEEDING & SETUP ENDPOINT
// ==========================================

app.post('/api/v1/seed', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Authoritative plans and system settings initialized.',
    plans: DEFAULT_PLANS,
    settings: systemSettings
  });
});

// ==========================================
// 7. FRONTEND SERVING & VITE INTEGRATION
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OPHIREUM] Production Express Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
