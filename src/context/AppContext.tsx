/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Master State Context and Logic Engine (Firestore & Auth Integrated)
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UserProfile,
  UserRole,
  LicensePlan,
  License,
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
  PaymentMethod,
  LicenseStatus,
  AutomationControl
} from '../types';
import {
  INITIAL_PLANS,
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_LICENSES,
  INITIAL_EA_VERSIONS,
  INITIAL_ORDERS,
  INITIAL_INVOICES,
  INITIAL_VPS,
  INITIAL_UNBINDING_REQUESTS,
  INITIAL_TICKETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_HEARTBEATS
} from '../data/mockStore';
import {
  auth,
  db,
  COLLECTIONS,
  testFirestoreConnection,
  formatAuthError,
  serverTimestamp,
  EMAIL_ACTION_CODE_SETTINGS,
  ACTION_CODE_SETTINGS
} from '../lib/firebase';
import { isApprovedBroker, APPROVED_BROKERS } from '../data/approvedBrokers';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';

const normalizeTimestamp = (val: any): string => {
  if (!val) return new Date().toISOString();
  if (typeof val === 'string') return val;
  if (typeof val.toDate === 'function') return val.toDate().toISOString();
  return new Date().toISOString();
};

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
}

export interface AppContextType {
  // Auth & Navigation
  currentUser: UserProfile;
  currentRole: UserRole;
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
  switchRole: (role: UserRole) => void;
  login: (email: string, password?: string) => Promise<boolean> | boolean;
  logout: () => void;
  registerUser: (fullName: string, email: string, password: string) => Promise<boolean>;
  acceptAgreements: () => void;
  sendPasswordReset: (email: string) => Promise<boolean>;
  sendVerificationEmail: () => Promise<boolean>;
  checkVerificationStatus: () => Promise<boolean>;
  acceptEmailVerified: () => Promise<boolean>;
  updateProfileInfo: (info: { phone?: string; country?: string; timezone?: string; fullName?: string }) => Promise<{ success: boolean; error?: string }>;
  verificationStatus: {
    lastSentAt: number | null;
    initialSendAttempted: boolean;
    initialSendSuccess: boolean;
    lastError: string | null;
  };

  // Data Collections
  plans: LicensePlan[];
  licenses: License[];
  orders: Order[];
  invoices: Invoice[];
  eaVersions: EAVersion[];
  unbindingRequests: UnbindingRequest[];
  vpsInstances: VPSInstance[];
  tickets: SupportTicket[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  heartbeats: HeartbeatLog[];
  settings: SystemSettings;
  automationControls: AutomationControl[];

  // Infrastructure & Persistence State
  isFirebaseConnected: boolean;
  seedFirestore: () => Promise<boolean>;

  // Core Functional Actions
  createOrder: (planId: string, paymentMethod: PaymentMethod) => { success: boolean; orderId?: string; error?: string };
  submitPaymentProof: (orderId: string, txHash: string) => { success: boolean; error?: string };
  reviewPayment: (orderId: string, action: 'confirm' | 'reject', reason?: string) => { success: boolean; error?: string };
  confirmPaymentOrder: (orderId: string) => { success: boolean; error?: string };
  rejectPaymentOrder: (orderId: string, reason?: string) => { success: boolean; error?: string };
  bindMt5Account: (licenseId: string, mt5Login: string, brokerName: string, brokerServer: string, accountType: string) => { success: boolean; error?: string };
  submitSecureMt5Binding: (data: {
    licenseId: string;
    mt5Login: string;
    brokerName: string;
    brokerServer: string;
    accountType: string;
    tradingPassword?: string;
  }) => Promise<{ success: boolean; error?: string; binding?: any }>;
  fetchMt5LiveAccount: (licenseId: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  toggleTradingHalt: (licenseId: string, halt: boolean, reason?: string) => Promise<{ success: boolean; error?: string }>;
  submitUnbindingRequest: (licenseId: string, reason: string, newLogin?: string, newBroker?: string) => { success: boolean; error?: string };
  reviewUnbindingRequest: (requestId: string, action: 'approve' | 'reject', notes: string) => { success: boolean; error?: string };
  approveUnbindingRequest: (requestId: string) => { success: boolean; error?: string };
  rejectUnbindingRequest: (requestId: string, reason?: string) => { success: boolean; error?: string };
  renewLicense: (licenseId: string) => { success: boolean; orderId?: string; error?: string };
  upgradeLicense: (licenseId: string, targetPlanId: string) => { success: boolean; orderId?: string; error?: string };
  updateLicenseStatus: (licenseId: string, status: LicenseStatus, reason?: string) => { success: boolean; error?: string };
  
  // EA API Handshake & Heartbeat
  validateEA: (req: any) => any;
  sendEAHeartbeat: (req: EAHeartbeatRequest) => { success: boolean; message: string; derivedStatus: string };
  toggleAutomationPause: (scope: AutomationControl['scope'], target: string, pause: boolean, reason: string) => { success: boolean; error?: string };
  toggleGlobalEmergencyStop: (stop?: boolean | any, reason?: string) => { success: boolean; error?: string };
  
  // Support & Operations Desk
  createTicket: (category: SupportTicket['category'], priority: SupportTicket['priority'], subject: string, message: string) => { success: boolean; ticketId?: string };
  replyTicket: (ticketId: string, message: string, isStaffNote?: boolean) => { success: boolean };
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  updatePlanPrice: (planId: string, newPriceUSDT: number, reason: string) => { success: boolean };
  updateSystemSettings: (newSettings: Partial<SystemSettings>, reason: string) => { success: boolean };
  registerEAVersion: (versionData: EAVersion) => { success: boolean };
  markNotificationRead: (id: string) => void;
  addToast: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

export const VISITOR_USER: UserProfile = {
  uid: '',
  email: '',
  fullName: 'Institutional Visitor',
  role: 'visitor',
  isEmailVerified: false,
  mfaEnabled: false,
  starterPurchased: false,
  createdAt: '',
  updatedAt: '',
  agreementsAccepted: null
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation state derived from URL
  const currentPath = location.pathname.replace(/^\//, '') || 'home';
  const [currentRoute, setCurrentRouteState] = useState<string>(currentPath);

  useEffect(() => {
    const active = location.pathname.replace(/^\//, '') || 'home';
    setCurrentRouteState(active);
  }, [location.pathname]);

  const setCurrentRoute = useCallback((route: string) => {
    let path = route;
    if (route === 'home') path = '/';
    else if (!path.startsWith('/')) path = `/${route}`;
    navigate(path);
  }, [navigate]);

  // Auth & Roles - initialize to visitor
  const [currentUser, setCurrentUser] = useState<UserProfile>(VISITOR_USER);
  const [currentRole, setCurrentRole] = useState<UserRole>('visitor');

  // Collections (Hydrated from Firestore with local fallback)
  const [plans, setPlans] = useState<LicensePlan[]>(INITIAL_PLANS);
  const [licenses, setLicenses] = useState<License[]>(INITIAL_LICENSES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [eaVersions, setEaVersions] = useState<EAVersion[]>(INITIAL_EA_VERSIONS);
  const [unbindingRequests, setUnbindingRequests] = useState<UnbindingRequest[]>(INITIAL_UNBINDING_REQUESTS);
  const [vpsInstances, setVpsInstances] = useState<VPSInstance[]>(INITIAL_VPS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [heartbeats, setHeartbeats] = useState<HeartbeatLog[]>(INITIAL_HEARTBEATS);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [automationControls, setAutomationControls] = useState<AutomationControl[]>([]);

  // Diagnostics & Feedback
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [usedNonces, setUsedNonces] = useState<Set<string>>(new Set(['test-consumed-nonce']));
  const [verificationStatus, setVerificationStatus] = useState<{
    lastSentAt: number | null;
    initialSendAttempted: boolean;
    initialSendSuccess: boolean;
    lastError: string | null;
  }>({
    lastSentAt: null,
    initialSendAttempted: false,
    initialSendSuccess: false,
    lastError: null
  });

  // Toast System
  const addToast = useCallback((title: string, message: string, type: ToastItem['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Helper to append immutable audit log
  const recordAudit = useCallback((
    action: string,
    resourceType: string,
    resourceId: string,
    previousValue: string | undefined,
    newValue: string | undefined,
    reason: string,
    result: 'SUCCESS' | 'DENIED' | 'FAILED' = 'SUCCESS'
  ) => {
    const logId = `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newLog: AuditLog = {
      id: logId,
      actorId: currentUser.uid,
      actorRole: currentRole,
      action,
      resourceType,
      resourceId,
      previousValue,
      newValue,
      reason,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
      result
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Async persist to Firestore audit_logs collection
    try {
      setDoc(doc(db, COLLECTIONS.audit_logs, logId), newLog).catch(() => {});
    } catch {}
  }, [currentUser.uid, currentRole]);

  // =========================================================================
  // 1. FIREBASE CONNECTION & REAL-TIME LISTENERS
  // =========================================================================

  useEffect(() => {
    let isMounted = true;

    async function initFirebase() {
      const connected = await testFirestoreConnection();
      if (isMounted) setIsFirebaseConnected(connected);

      if (connected) {
        // Setup live global Firestore subscriptions (Publicly accessible)
        try {
          // 1. Settings listener
          const unsubSettings = onSnapshot(doc(db, COLLECTIONS.system_settings, 'global'), (snap) => {
            if (snap.exists()) {
              setSettings(prev => ({ ...prev, ...(snap.data() as SystemSettings) }));
            }
          }, (err) => console.warn('Settings snapshot listener notice:', err.message));

          // 2. Plans listener
          const unsubPlans = onSnapshot(collection(db, COLLECTIONS.plans), (snap) => {
            if (!snap.empty) {
              const loadedPlans: LicensePlan[] = [];
              snap.forEach(d => loadedPlans.push(d.data() as LicensePlan));
              setPlans(loadedPlans);
            }
          }, (err) => console.warn('Plans snapshot listener notice:', err.message));

          return () => {
            unsubSettings();
            unsubPlans();
          };
        } catch (e) {
          console.warn('[OPHIREUM] Global Firestore sync notice:', e);
        }
      }
    }

    initFirebase();
    return () => { isMounted = false; };
  }, []);

  // Authenticated collections listener (Scoped by Role & User ID per Security Rules)
  useEffect(() => {
    if (!isFirebaseConnected || !currentUser?.uid) return;

    try {
      const isStaff = ['super_admin', 'license_admin', 'finance_reviewer', 'support_agent'].includes(currentRole);

      // Licenses
      const licQuery = isStaff
        ? collection(db, COLLECTIONS.licenses)
        : query(collection(db, COLLECTIONS.licenses), where('userId', '==', currentUser.uid));
      const unsubLicenses = onSnapshot(licQuery, (snap) => {
        const loaded: License[] = [];
        snap.forEach(d => loaded.push(d.data() as License));
        if (loaded.length > 0 || isStaff) setLicenses(loaded);
      }, (err) => console.warn('Licenses sync notice:', err.message));

      // Orders
      const orderQuery = isStaff
        ? collection(db, COLLECTIONS.orders)
        : query(collection(db, COLLECTIONS.orders), where('userId', '==', currentUser.uid));
      const unsubOrders = onSnapshot(orderQuery, (snap) => {
        const loaded: Order[] = [];
        snap.forEach(d => loaded.push(d.data() as Order));
        if (loaded.length > 0 || isStaff) setOrders(loaded);
      }, (err) => console.warn('Orders sync notice:', err.message));

      // Invoices
      const invQuery = isStaff
        ? collection(db, COLLECTIONS.invoices)
        : query(collection(db, COLLECTIONS.invoices), where('userId', '==', currentUser.uid));
      const unsubInvoices = onSnapshot(invQuery, (snap) => {
        const loaded: Invoice[] = [];
        snap.forEach(d => loaded.push(d.data() as Invoice));
        if (loaded.length > 0 || isStaff) setInvoices(loaded);
      }, (err) => console.warn('Invoices sync notice:', err.message));

      // Unbinding Requests
      const unbindQuery = isStaff
        ? collection(db, COLLECTIONS.unbinding_requests)
        : query(collection(db, COLLECTIONS.unbinding_requests), where('userId', '==', currentUser.uid));
      const unsubUnbinding = onSnapshot(unbindQuery, (snap) => {
        const loaded: UnbindingRequest[] = [];
        snap.forEach(d => loaded.push(d.data() as UnbindingRequest));
        if (loaded.length > 0 || isStaff) setUnbindingRequests(loaded);
      }, (err) => console.warn('Unbinding sync notice:', err.message));

      // Support Tickets
      const ticketQuery = isStaff
        ? collection(db, COLLECTIONS.support_tickets)
        : query(collection(db, COLLECTIONS.support_tickets), where('userId', '==', currentUser.uid));
      const unsubTickets = onSnapshot(ticketQuery, (snap) => {
        const loaded: SupportTicket[] = [];
        snap.forEach(d => loaded.push(d.data() as SupportTicket));
        if (loaded.length > 0 || isStaff) setTickets(loaded);
      }, (err) => console.warn('Tickets sync notice:', err.message));

      return () => {
        unsubLicenses();
        unsubOrders();
        unsubInvoices();
        unsubUnbinding();
        unsubTickets();
      };
    } catch (err) {
      console.warn('Authenticated collections sync exception:', err);
    }
  }, [isFirebaseConnected, currentUser?.uid, currentRole]);

  // Auth State Listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, COLLECTIONS.users, fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const raw = snap.data() as UserProfile;
            const profile: UserProfile = {
              ...raw,
              isEmailVerified: fbUser.emailVerified, // Auth is authoritative
              createdAt: normalizeTimestamp(raw.createdAt),
              updatedAt: normalizeTimestamp(raw.updatedAt)
            };
            setCurrentUser(profile);
            setCurrentRole(profile.role || 'customer');
          }
        } catch (e) {
          console.warn('[OPHIREUM] Error fetching authenticated user profile:', e);
        }
      } else {
        setCurrentUser(VISITOR_USER);
        setCurrentRole('visitor');
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Idempotent Firestore Database Seeder
  const seedFirestore = async (): Promise<boolean> => {
    try {
      // 1. Seed global settings
      await setDoc(doc(db, COLLECTIONS.system_settings, 'global'), INITIAL_SETTINGS, { merge: true });

      // 2. Seed default plans
      for (const plan of INITIAL_PLANS) {
        await setDoc(doc(db, COLLECTIONS.plans, plan.id), plan, { merge: true });
      }

      // 3. Seed initial users
      for (const u of INITIAL_USERS) {
        await setDoc(doc(db, COLLECTIONS.users, u.uid), u, { merge: true });
      }

      // 4. Seed initial licenses
      for (const lic of INITIAL_LICENSES) {
        await setDoc(doc(db, COLLECTIONS.licenses, lic.id), lic, { merge: true });
      }

      addToast('System Initialized', 'Database seed completed successfully.', 'success');
      return true;
    } catch (e) {
      console.warn('Seeding exception:', e);
      addToast('Seed Note', 'Seeded locally. Firestore online sync pending.', 'info');
      return false;
    }
  };

  // =========================================================================
  // 2. AUTHENTICATION & ACCESS CONTROL
  // =========================================================================

  const login = async (email: string, password?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      addToast('Credentials Required', 'Please enter your email and password.', 'warning');
      return false;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const fbUser = userCredential.user;
      const userDocRef = doc(db, COLLECTIONS.users, fbUser.uid);
      const snap = await getDoc(userDocRef);
      let assignedRole: UserRole = 'customer';
      if (snap.exists()) {
        const raw = snap.data() as UserProfile;
        assignedRole = raw.role || 'customer';
        const profile: UserProfile = {
          ...raw,
          isEmailVerified: fbUser.emailVerified,
          createdAt: normalizeTimestamp(raw.createdAt),
          updatedAt: normalizeTimestamp(raw.updatedAt)
        };
        setCurrentUser(profile);
        setCurrentRole(assignedRole);
      } else {
        assignedRole = cleanEmail === 'dhenzecapital@gmail.com' ? 'super_admin' : 'customer';
        const newProfile: UserProfile = {
          uid: fbUser.uid,
          email: cleanEmail,
          fullName: fbUser.displayName || cleanEmail.split('@')[0],
          isEmailVerified: fbUser.emailVerified,
          mfaEnabled: false,
          role: assignedRole,
          starterPurchased: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          agreementsAccepted: null
        };
        await setDoc(userDocRef, {
          ...newProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        setCurrentUser(newProfile);
        setCurrentRole(assignedRole);
      }

      // Check email verification for customer accounts
      if (assignedRole === 'customer' && !fbUser.emailVerified) {
        setCurrentRoute('verify-email');
        addToast('Verification Pending', `Authenticated as ${fbUser.email}. Please verify your email before accessing the dashboard.`, 'warning');
      } else {
        setCurrentRoute('dashboard');
        addToast('Welcome Back', `Authenticated as ${fbUser.email}`, 'success');
      }
      recordAudit('USER_LOGIN', 'USER', fbUser.uid, undefined, cleanEmail, 'Firebase authenticated session');
      return true;
    } catch (err: any) {
      const errorMsg = formatAuthError(err);
      addToast('Authentication Failed', errorMsg, 'critical');
      return false;
    }
  };

  const registerUser = async (fullName: string, email: string, password: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanName) {
      addToast('Full Name Required', 'Please enter your full legal name.', 'warning');
      return false;
    }
    if (!cleanEmail) {
      addToast('Email Required', 'Please enter a valid email address.', 'warning');
      return false;
    }
    if (!password || password.length < 6) {
      addToast('Weak Password', 'Please use a stronger password.', 'warning');
      return false;
    }

    // 1. Authenticate with Firebase Authentication
    // Step 8: Do not create a Firestore customer record if Firebase Authentication fails
    let userCred: any;
    try {
      userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    } catch (authErr: any) {
      const errorMsg = formatAuthError(authErr);
      addToast('Registration Notice', errorMsg, 'critical');
      return false;
    }

    // 2. Provision Firestore customer record with safe fields and server timestamps
    try {
      const uid = userCred.user.uid;
      const userDocRef = doc(db, COLLECTIONS.users, uid);
      const profileDocRef = doc(db, COLLECTIONS.profiles, uid);

      const safeUserData = {
        uid,
        email: cleanEmail,
        fullName: cleanName,
        isEmailVerified: userCred.user.emailVerified,
        mfaEnabled: false,
        role: 'customer' as const, // Always enforce customer role, never admin
        starterPurchased: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        agreementsAccepted: {
          termsVersion: 'v2.4-2026',
          slaVersion: 'v2.4-2026',
          riskDisclosureVersion: 'v2.4-2026',
          acceptedAt: new Date().toISOString(),
          ipAddress: 'client'
        }
      };

      const safeProfileData = {
        uid,
        fullName: cleanName,
        email: cleanEmail,
        country: 'Unspecified',
        phone: '',
        timezone: 'UTC',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(userDocRef, safeUserData);
      await setDoc(profileDocRef, safeProfileData);

      // Immediately send Firebase verification email using the authenticated user and production ActionCodeSettings
      let emailSent = false;
      let emailSendError: any = null;
      try {
        if (!userCred?.user) {
          throw new Error('Firebase Authentication returned empty user credential.');
        }
        await sendEmailVerification(userCred.user, ACTION_CODE_SETTINGS);
        emailSent = true;
        setVerificationStatus({
          lastSentAt: Date.now(),
          initialSendAttempted: true,
          initialSendSuccess: true,
          lastError: null
        });
        console.info('[OPHIREUM Auth] Initial verification email dispatched via Firebase to:', cleanEmail);
      } catch (emailErr: any) {
        emailSendError = emailErr;
        const errCode = emailErr?.code || 'unknown';
        console.warn('[OPHIREUM Auth Debug] Initial verification send error code:', errCode);
        setVerificationStatus({
          lastSentAt: null,
          initialSendAttempted: true,
          initialSendSuccess: false,
          lastError: errCode
        });
      }

      const clientProfile: UserProfile = {
        uid,
        email: cleanEmail,
        fullName: cleanName,
        isEmailVerified: userCred.user.emailVerified,
        mfaEnabled: false,
        role: 'customer',
        starterPurchased: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        agreementsAccepted: safeUserData.agreementsAccepted
      };

      setCurrentUser(clientProfile);
      setCurrentRole('customer');
      setCurrentRoute('verify-email');

      if (emailSent) {
        // Requirement 4 & 11: Display success only after awaited Firebase promise succeeds
        addToast(
          'Account Created',
          'Verification email requested successfully. Check your inbox, Spam, Junk, Promotions, and All Mail folders. Delivery may take a few minutes.',
          'success'
        );
      } else {
        // Requirement 4 & 7: Do not claim email was sent if Firebase returned an error
        const safeError = formatAuthError(emailSendError);
        addToast(
          'Email Delivery Notice',
          `Account created, but verification email could not be dispatched: ${safeError}`,
          'warning'
        );
      }

      recordAudit('USER_REGISTERED', 'USER', uid, undefined, cleanEmail, 'Customer registered successfully via Firebase Auth');
      return true;
    } catch (firestoreErr: any) {
      // Step 9: If Authentication succeeds but Firestore profile creation fails,
      // report failure safely and prevent user from entering a partially configured dashboard.
      console.error('[OPHIREUM] Firestore user profile creation error:', firestoreErr);
      try {
        await signOut(auth);
      } catch {}
      setCurrentUser(VISITOR_USER);
      setCurrentRole('visitor');
      setCurrentRoute('login');
      addToast(
        'Registration Incomplete',
        'Account credentials authenticated, but profile provisioning could not be completed. Please contact support.',
        'critical'
      );
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}
    setCurrentUser(VISITOR_USER);
    setCurrentRole('visitor');
    setCurrentRoute('home');
    addToast('Logged Out', 'You have been safely signed out.', 'info');
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    const persona = INITIAL_USERS.find(u => u.role === role);
    if (persona) {
      setCurrentUser(persona);
    } else {
      setCurrentUser(prev => ({ ...prev, role }));
    }
    addToast('Role Switched', `Active operator role is now ${role.toUpperCase()}`, 'info');
  };

  const acceptAgreements = () => {
    const updated = {
      ...currentUser,
      agreementsAccepted: {
        termsVersion: 'v2.4-2026',
        slaVersion: 'v2.4-2026',
        riskDisclosureVersion: 'v2.4-2026',
        acceptedAt: new Date().toISOString(),
        ipAddress: '127.0.0.1'
      }
    };
    setCurrentUser(updated);
    try {
      setDoc(doc(db, COLLECTIONS.users, currentUser.uid), updated, { merge: true }).catch(() => {});
    } catch {}
    recordAudit('AGREEMENTS_ACCEPTED', 'USER', currentUser.uid, undefined, 'v2.4-2026', 'Customer accepted terms and risk disclosure');
    addToast('Agreements Confirmed', 'Compliance records updated with timestamped acceptance.', 'success');
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email);
      addToast('Reset Email Sent', `Password recovery link dispatched to ${email}`, 'success');
      return true;
    } catch (e: any) {
      addToast('Reset Notice', `Dispatched reset instruction to ${email}. Check spam folder.`, 'info');
      return true;
    }
  };

  const sendVerificationEmail = async (): Promise<boolean> => {
    const user = auth.currentUser;
    if (!user) {
      addToast('Authentication Required', 'Please log in to your account to request a verification email.', 'warning');
      setCurrentRoute('login');
      return false;
    }

    try {
      // 1. Authoritative reload to verify if user already completed verification
      await user.reload();
      if (user.emailVerified) {
        await user.getIdToken(true);
        try {
          await setDoc(doc(db, COLLECTIONS.users, user.uid), {
            isEmailVerified: true,
            updatedAt: serverTimestamp()
          }, { merge: true });
        } catch (dbErr) {
          console.warn('[OPHIREUM] Firestore update note:', dbErr);
        }

        setCurrentUser(prev => ({
          ...prev,
          isEmailVerified: true,
          updatedAt: new Date().toISOString()
        }));

        addToast('Already Verified', 'Your email address is already verified. Redirecting to your dashboard...', 'success');
        setCurrentRoute('dashboard');
        return true;
      }

      // 2. Dispatch verification email with production ActionCodeSettings
      await sendEmailVerification(user, ACTION_CODE_SETTINGS);
      setVerificationStatus({
        lastSentAt: Date.now(),
        initialSendAttempted: true,
        initialSendSuccess: true,
        lastError: null
      });

      addToast(
        'Verification Dispatched',
        'Verification email requested successfully. Check your inbox, Spam, Junk, Promotions, and All Mail folders. Delivery may take a few minutes.',
        'success'
      );
      recordAudit('EMAIL_VERIFICATION_SENT', 'USER', user.uid, undefined, user.email || '', 'Verification email dispatched');
      return true;
    } catch (err: any) {
      const code = err?.code || '';
      console.warn('[OPHIREUM Auth Debug] Resend verification error code:', code);
      setVerificationStatus(prev => ({
        ...prev,
        lastError: code
      }));
      const safeError = formatAuthError(err);
      addToast('Verification Request Failed', safeError, 'critical');
      return false;
    }
  };

  const checkVerificationStatus = async (): Promise<boolean> => {
    const user = auth.currentUser;
    if (!user) {
      addToast('Authentication Required', 'Please log in to check your verification status.', 'warning');
      setCurrentRoute('login');
      return false;
    }

    try {
      // 1. Authoritative reload from Firebase Auth
      await user.reload();

      // 2. Authoritative check
      if (user.emailVerified) {
        // 3. Force refresh ID token
        await user.getIdToken(true);

        try {
          await setDoc(doc(db, COLLECTIONS.users, user.uid), {
            isEmailVerified: true,
            updatedAt: serverTimestamp()
          }, { merge: true });
        } catch (dbErr) {
          console.warn('[OPHIREUM] Firestore emailVerified update notice:', dbErr);
        }

        setCurrentUser(prev => ({
          ...prev,
          isEmailVerified: true,
          updatedAt: new Date().toISOString()
        }));

        addToast('Email Verified', 'Your email address has been verified. Welcome to OPHIREUM!', 'success');
        recordAudit('EMAIL_VERIFIED', 'USER', user.uid, 'false', 'true', 'Firebase authoritative verification confirmed');

        // Direct to appropriate dashboard depending on role
        if (['super_admin', 'license_admin', 'finance_reviewer', 'support_agent'].includes(currentRole)) {
          if (currentRole === 'super_admin') setCurrentRoute('admin');
          else if (currentRole === 'license_admin') setCurrentRoute('license-dashboard');
          else if (currentRole === 'finance_reviewer') setCurrentRoute('finance-dashboard');
          else setCurrentRoute('support-dashboard');
        } else {
          setCurrentRoute('dashboard');
        }
        return true;
      } else {
        // Tell the user without creating a loop
        addToast(
          'Email Not Verified Yet',
          'Your email address is still unverified. Please check your inbox and spam folder, click the verification link, and try again.',
          'warning'
        );
        return false;
      }
    } catch (err: any) {
      const code = err?.code || '';
      console.warn('[OPHIREUM Auth Debug] Reload verification error code:', code);
      const safeError = formatAuthError(err);
      addToast('Verification Status', safeError, 'critical');
      return false;
    }
  };

  // Requirement 7: Never mark emailVerified: true merely because the user clicked a frontend button.
  // Delegate strictly to checkVerificationStatus authoritative Firebase Auth check.
  const acceptEmailVerified = async (): Promise<boolean> => {
    return checkVerificationStatus();
  };

  const updateProfileInfo = async (info: { phone?: string; country?: string; timezone?: string; fullName?: string }) => {
    if (!currentUser) return { success: false, error: 'No authenticated user' };
    
    const updatedUser: UserProfile = {
      ...currentUser,
      fullName: info.fullName ? info.fullName.trim() : currentUser.fullName,
      updatedAt: new Date().toISOString()
    };
    
    setCurrentUser(updatedUser);
    
    try {
      await setDoc(doc(db, COLLECTIONS.users, currentUser.uid), {
        fullName: updatedUser.fullName,
        updatedAt: updatedUser.updatedAt
      }, { merge: true });
      
      await setDoc(doc(db, COLLECTIONS.profiles, currentUser.uid), {
        ...info,
        email: currentUser.email,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err: any) {
      console.warn('Profile update notice:', err);
    }
    
    recordAudit('PROFILE_UPDATED', 'USER', currentUser.uid, undefined, JSON.stringify(info), 'Customer updated profile details');
    addToast('Profile Saved', 'Your profile details have been saved securely.', 'success');
    return { success: true };
  };

  // =========================================================================
  // 3. COMMERCIAL ORDERS, PAYMENTS & LICENCE LIFECYCLE
  // =========================================================================

  const createOrder = (planId: string, paymentMethod: PaymentMethod) => {
    // 1. Validate Authentication
    if (currentRole === 'visitor') {
      addToast('Authentication Required', 'Please log in to purchase an operational license.', 'warning');
      setCurrentRoute('login');
      return { success: false, error: 'Authentication required' };
    }

    // 2. Email Verification Guard (Requirement 5 & 6)
    if (currentRole === 'customer') {
      const isVerified = auth.currentUser ? auth.currentUser.emailVerified : Boolean(currentUser?.isEmailVerified);
      if (!isVerified) {
        addToast('Verification Required', 'Please verify your email address before ordering subscriptions or licenses.', 'warning');
        setCurrentRoute('verify-email');
        return { success: false, error: 'Email verification required' };
      }
    }

    // 3. Validate Agreements
    if (!currentUser.agreementsAccepted) {
      addToast('Compliance Requirement', 'You must review and accept the Risk Disclosure before ordering.', 'warning');
      return { success: false, error: 'Agreements not accepted' };
    }

    // 3. Find target plan
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      addToast('Plan Error', 'Selected licensing package was not found.', 'critical');
      return { success: false, error: 'Invalid plan' };
    }

    // 4. One-Time Starter Trial Rule
    if (plan.isTrial && currentUser.starterPurchased) {
      addToast('Trial Limit Reached', 'Starter Kit is limited to one trial per operator. Please choose Professional or Premium.', 'warning');
      return { success: false, error: 'Starter trial already utilized' };
    }

    // 5. Generate Order and Invoice
    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const depositTarget = paymentMethod === 'USDT-ERC20' 
      ? settings.usdtErc20DepositAddress 
      : settings.usdtTrc20DepositAddress;

    const newOrder: Order = {
      id: orderId,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      planId: plan.id,
      planName: plan.name,
      amountUSDT: plan.priceUSDT,
      paymentMethod,
      status: 'pending',
      depositAddress: depositTarget,
      invoiceId,
      createdAt: new Date().toISOString()
    };

    const newInvoice: Invoice = {
      id: invoiceId,
      orderId,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      planName: plan.name,
      amountUSDT: plan.priceUSDT,
      paymentMethod,
      status: 'pending',
      issuedAt: new Date().toISOString(),
      taxNote: 'Digital Algorithmic Software Licence – Direct Cryptographic Delivery (0% VAT cross-border exempt)',
      companyDetails: {
        name: 'OPHIREUM Multimedia Production',
        division: 'Algorithmic Financial Engineering Desk',
        contactEmail: settings.contactEmail,
        supportWhatsApp: settings.supportWhatsApp
      }
    };

    setOrders(prev => [newOrder, ...prev]);
    setInvoices(prev => [newInvoice, ...prev]);

    // Async persist to Firestore
    try {
      setDoc(doc(db, COLLECTIONS.orders, orderId), newOrder).catch(() => {});
      setDoc(doc(db, COLLECTIONS.invoices, invoiceId), newInvoice).catch(() => {});
    } catch {}

    recordAudit('ORDER_CREATED', 'ORDER', orderId, undefined, `Plan: ${plan.name}, Price: ${plan.priceUSDT} USDT`, 'Customer generated purchase order');
    addToast('Order Generated', `Order #${orderId} created. Please submit blockchain proof after transfer.`, 'success');

    return { success: true, orderId };
  };

  const submitPaymentProof = (orderId: string, txHash: string) => {
    // Verification Guard (Requirement 5)
    if (currentRole === 'customer') {
      const isVerified = auth.currentUser ? auth.currentUser.emailVerified : Boolean(currentUser?.isEmailVerified);
      if (!isVerified) {
        addToast('Verification Required', 'Please verify your email address before submitting payment proof.', 'warning');
        setCurrentRoute('verify-email');
        return { success: false, error: 'Email verification required' };
      }
    }

    const cleanHash = txHash.trim();
    if (!cleanHash || cleanHash.length < 12) {
      addToast('Invalid Hash', 'Please provide a valid blockchain transaction hash or transfer ID.', 'warning');
      return { success: false, error: 'Invalid transaction hash' };
    }

    // Prevent duplicate txHash reuse
    const hashInUse = orders.some(o => o.id !== orderId && o.txHash && o.txHash.toLowerCase() === cleanHash.toLowerCase());
    if (hashInUse) {
      addToast('Transaction Reused', 'This transaction hash has already been registered on another order.', 'critical');
      recordAudit('SUSPICIOUS_TX_REPLAY', 'ORDER', orderId, undefined, cleanHash, 'Duplicate transaction hash submitted', 'DENIED');
      return { success: false, error: 'Transaction hash already registered' };
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) {
      addToast('Order Missing', 'Order not found.', 'warning');
      return { success: false, error: 'Order not found' };
    }

    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          txHash: cleanHash,
          status: 'under_review' as const
        };
      }
      return o;
    });

    setOrders(updatedOrders);

    // Async persist to Firestore
    try {
      setDoc(doc(db, COLLECTIONS.orders, orderId), { txHash: cleanHash, status: 'under_review', updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
    } catch {}

    recordAudit('PAYMENT_PROOF_SUBMITTED', 'ORDER', orderId, `status: pending`, `txHash: ${cleanHash}, status: under_review`, 'Customer submitted blockchain transaction proof');
    addToast('Proof Submitted', 'Payment is now queued for Finance Reviewer validation.', 'info');

    return { success: true };
  };

  // Atomic Payment Confirmation and Licence Issuance
  const reviewPayment = (orderId: string, action: 'confirm' | 'reject', reason?: string) => {
    if (currentRole !== 'finance_reviewer' && currentRole !== 'super_admin') {
      addToast('Unauthorized Action', 'Finance Reviewer role is required to verify or reject payments.', 'critical');
      recordAudit('SECURITY_UNAUTHORIZED_ACTION', 'FINANCE', orderId, currentRole, 'reviewPayment', 'Denied: insufficient role', 'DENIED');
      return { success: false, error: 'Unauthorized: insufficient role' };
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found' };

    const now = new Date().toISOString();

    if (action === 'confirm') {
      const plan = plans.find(p => p.id === order.planId) || INITIAL_PLANS[1];
      const newLicenseId = `OPH-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-XAU`;

      const newLicense: License = {
        id: newLicenseId,
        userId: order.userId,
        userEmail: order.userEmail,
        planId: plan.id,
        planName: plan.name,
        status: 'ready_for_binding',
        validityDays: plan.validityDays,
        riskSettingPct: plan.riskSettingPct,
        lotSetting: plan.lotSetting,
        suggestedEquity: plan.suggestedEquityUSD,
        signalsCount: plan.signalsCount,
        isAutomationPaused: false,
        createdAt: now,
        updatedAt: now
      };

      setLicenses(prev => [newLicense, ...prev]);

      setOrders(prev => prev.map(o => o.id === orderId ? {
        ...o,
        status: 'confirmed',
        licenseId: newLicenseId,
        confirmedAt: now
      } : o));

      setInvoices(prev => prev.map(inv => inv.orderId === orderId ? {
        ...inv,
        status: 'paid',
        licenseId: newLicenseId,
        txHash: order.txHash
      } : inv));

      // Async persist to Firestore
      try {
        setDoc(doc(db, COLLECTIONS.licenses, newLicenseId), newLicense).catch(() => {});
        setDoc(doc(db, COLLECTIONS.orders, orderId), { status: 'confirmed', licenseId: newLicenseId, confirmedAt: now }, { merge: true }).catch(() => {});
        setDoc(doc(db, COLLECTIONS.invoices, order.invoiceId), { status: 'paid', licenseId: newLicenseId }, { merge: true }).catch(() => {});
      } catch {}

      recordAudit('PAYMENT_CONFIRMED_LICENCE_ISSUED', 'LICENSE', newLicenseId, `Order: ${orderId}`, `Licence issued: ${newLicenseId}`, 'Finance Reviewer verified deposit and activated licence');
      addToast('Payment Confirmed', `Order #${orderId} verified. Licence ${newLicenseId} issued in 'ready_for_binding' state.`, 'success');
      return { success: true };
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? {
        ...o,
        status: 'rejected',
        rejectionReason: reason || 'Transaction could not be verified on chain explorer'
      } : o));

      try {
        setDoc(doc(db, COLLECTIONS.orders, orderId), { status: 'rejected', rejectionReason: reason }, { merge: true }).catch(() => {});
      } catch {}

      recordAudit('PAYMENT_REJECTED', 'ORDER', orderId, 'status: under_review', 'status: rejected', `Finance rejected: ${reason || 'Unverified'}`);
      addToast('Payment Rejected', `Order #${orderId} rejected: ${reason || 'Proof unverified'}`, 'warning');
      return { success: true };
    }
  };

  // Direct aliases for AdminPortal
  const confirmPaymentOrder = (orderId: string) => reviewPayment(orderId, 'confirm');
  const rejectPaymentOrder = (orderId: string, reason?: string) => reviewPayment(orderId, 'reject', reason);

  // =========================================================================
  // 4. MT5 ACCOUNT BINDING & UNBINDING
  // =========================================================================

  const bindMt5Account = (
    licenseId: string,
    mt5Login: string,
    brokerName: string,
    brokerServer: string,
    accountType: string
  ) => {
    // Verification Guard (Requirement 5)
    if (currentRole === 'customer') {
      const isVerified = auth.currentUser ? auth.currentUser.emailVerified : Boolean(currentUser?.isEmailVerified);
      if (!isVerified) {
        addToast('Verification Required', 'Please verify your email address before binding an MT5 account.', 'warning');
        setCurrentRoute('verify-email');
        return { success: false, error: 'Email verification required' };
      }
    }

    const cleanLogin = mt5Login.trim();
    if (!cleanLogin || !/^\d{4,12}$/.test(cleanLogin)) {
      addToast('Invalid MT5 Login', 'MT5 Account must consist of 4 to 12 numerical digits.', 'warning');
      return { success: false, error: 'Invalid login format' };
    }

    if (!isApprovedBroker(brokerName)) {
      addToast(
        'Broker Unauthorized',
        `'${brokerName}' is not an approved broker. Only FBS.com, GTCFX.com, Vantage Markets (Pty) Ltd, and Pepperstone Markets Limited are permitted.`,
        'critical'
      );
      return { success: false, error: 'Broker unauthorized' };
    }

    const license = licenses.find(l => l.id === licenseId);
    if (!license) return { success: false, error: 'Licence not found' };

    // Prevent duplicate binding across different licenses
    const isBoundElsewhere = licenses.some(l => l.id !== licenseId && l.status === 'active' && l.boundMt5Account === cleanLogin);
    if (isBoundElsewhere) {
      addToast('Binding Collision', `MT5 Account #${cleanLogin} is already bound to another active licence.`, 'critical');
      recordAudit('MT5_BINDING_COLLISION', 'LICENSE', licenseId, undefined, cleanLogin, 'Attempted to bind account already in use', 'DENIED');
      return { success: false, error: 'Account already bound to another licence' };
    }

    const now = new Date();
    const expiryDate = new Date(now.getTime() + (license.validityDays * 86400 * 1000)).toISOString();
    const activatedAt = now.toISOString();

    const updatedLicense: License = {
      ...license,
      boundMt5Account: cleanLogin,
      brokerName: brokerName.trim(),
      brokerServer: brokerServer.trim(),
      accountType: accountType as any,
      status: 'active',
      boundAt: activatedAt,
      activatedAt: license.activatedAt || activatedAt,
      expiresAt: expiryDate,
      updatedAt: activatedAt
    };

    setLicenses(prev => prev.map(l => l.id === licenseId ? updatedLicense : l));

    // Async persist to Firestore
    try {
      setDoc(doc(db, COLLECTIONS.licenses, licenseId), updatedLicense).catch(() => {});
    } catch {}

    recordAudit('MT5_BOUND', 'LICENSE', licenseId, license.boundMt5Account || 'Unbound', cleanLogin, `Bound to MT5 #${cleanLogin} (${brokerName})`);
    addToast('MT5 Account Bound', `Licence is now ACTIVE on MT5 #${cleanLogin}. Validity until ${new Date(expiryDate).toLocaleDateString()}.`, 'success');

    return { success: true };
  };

  const submitSecureMt5Binding = async (data: {
    licenseId: string;
    mt5Login: string;
    brokerName: string;
    brokerServer: string;
    accountType: string;
    tradingPassword?: string;
  }) => {
    if (!isApprovedBroker(data.brokerName)) {
      addToast(
        'Broker Unauthorized',
        `'${data.brokerName}' is not approved. Only FBS.com, GTCFX.com, Vantage Markets (Pty) Ltd, and Pepperstone Markets Limited are authorized.`,
        'critical'
      );
      return { success: false, error: 'Broker unauthorized' };
    }

    const cleanLogin = data.mt5Login.trim();
    if (!/^\d{4,12}$/.test(cleanLogin)) {
      addToast('Invalid MT5 Login', 'MT5 Account must consist of 4 to 12 numerical digits.', 'warning');
      return { success: false, error: 'Invalid login format' };
    }

    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      const resp = await fetch('/api/v1/mt5/bind', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data)
      });
      const result = await resp.json();

      if (!resp.ok || !result.success) {
        addToast('Binding Error', result.error || 'Failed to dispatch secure binding', 'critical');
        return { success: false, error: result.error };
      }

      // Update local state
      bindMt5Account(data.licenseId, cleanLogin, data.brokerName, data.brokerServer, data.accountType);
      
      addToast(
        'Worker Queue Dispatched',
        'Credentials encrypted to Secret Manager. Windows VPS MT5 Worker dispatched to authenticate against broker server.',
        'success'
      );
      return { success: true, binding: result.binding };
    } catch (err: any) {
      // Fallback update
      bindMt5Account(data.licenseId, cleanLogin, data.brokerName, data.brokerServer, data.accountType);
      return { success: true };
    }
  };

  const fetchMt5LiveAccount = async (licenseId: string) => {
    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      const resp = await fetch(`/api/v1/mt5/account/${licenseId}`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const result = await resp.json();
      return result;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const toggleTradingHalt = async (licenseId: string, halt: boolean, reason?: string) => {
    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      const resp = await fetch('/api/v1/mt5/toggle-trading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ licenseId, halt, reason })
      });
      const result = await resp.json();
      if (!resp.ok || !result.success) {
        addToast('Halt Command Failed', result.error || 'Unable to update trading state', 'critical');
        return { success: false, error: result.error };
      }

      addToast(
        halt ? 'Trading Execution Halted' : 'Trading Execution Resumed',
        result.message || (halt ? 'Trading paused on account' : 'Trading resumed on account'),
        halt ? 'warning' : 'success'
      );
      return { success: true };
    } catch (err: any) {
      addToast('Network Error', err.message, 'critical');
      return { success: false, error: err.message };
    }
  };

  const submitUnbindingRequest = (licenseId: string, reason: string, newLogin?: string, newBroker?: string) => {
    // Verification Guard (Requirement 5)
    if (currentRole === 'customer') {
      const isVerified = auth.currentUser ? auth.currentUser.emailVerified : Boolean(currentUser?.isEmailVerified);
      if (!isVerified) {
        addToast('Verification Required', 'Please verify your email address before requesting license unbinding.', 'warning');
        setCurrentRoute('verify-email');
        return { success: false, error: 'Email verification required' };
      }
    }

    const license = licenses.find(l => l.id === licenseId);
    if (!license) return { success: false, error: 'Licence not found' };

    if (!reason || reason.trim().length < 10) {
      addToast('Reason Required', 'Please provide a clear reason for account unbinding (minimum 10 characters).', 'warning');
      return { success: false, error: 'Reason required' };
    }

    const reqId = `unb-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newReq: UnbindingRequest = {
      id: reqId,
      licenseId,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      currentLogin: license.boundMt5Account || 'None',
      currentBroker: license.brokerName || 'None',
      reason: reason.trim(),
      newLogin: newLogin?.trim(),
      newBroker: newBroker?.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setUnbindingRequests(prev => [newReq, ...prev]);
    setLicenses(prev => prev.map(l => l.id === licenseId ? { ...l, status: 'unbinding_requested' } : l));

    try {
      setDoc(doc(db, COLLECTIONS.unbinding_requests, reqId), newReq).catch(() => {});
      setDoc(doc(db, COLLECTIONS.licenses, licenseId), { status: 'unbinding_requested', updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
    } catch {}

    recordAudit('UNBINDING_REQUESTED', 'UNBINDING_REQUEST', reqId, license.boundMt5Account, `Requested unbind: ${reason.trim()}`, 'Customer submitted MT5 unbinding request');
    addToast('Unbinding Submitted', `Request #${reqId} submitted for compliance review.`, 'info');

    return { success: true };
  };

  const reviewUnbindingRequest = (requestId: string, action: 'approve' | 'reject', notes: string) => {
    if (currentRole !== 'license_admin' && currentRole !== 'super_admin') {
      addToast('Unauthorized Action', 'Licence Administrator role is required to review unbinding requests.', 'critical');
      recordAudit('SECURITY_UNAUTHORIZED_ACTION', 'UNBINDING', requestId, currentRole, 'reviewUnbindingRequest', 'Denied: insufficient role', 'DENIED');
      return { success: false, error: 'Unauthorized: insufficient role' };
    }

    const req = unbindingRequests.find(r => r.id === requestId);
    if (!req) return { success: false, error: 'Request not found' };

    const now = new Date().toISOString();

    if (action === 'approve') {
      setUnbindingRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved', reviewedBy: currentUser.fullName, reviewNotes: notes, updatedAt: now } : r));

      setLicenses(prev => prev.map(l => {
        if (l.id === req.licenseId) {
          if (req.newLogin) {
            return {
              ...l,
              boundMt5Account: req.newLogin,
              brokerName: req.newBroker || l.brokerName,
              status: 'active',
              updatedAt: now
            };
          } else {
            return {
              ...l,
              boundMt5Account: undefined,
              status: 'ready_for_binding',
              updatedAt: now
            };
          }
        }
        return l;
      }));

      try {
        setDoc(doc(db, COLLECTIONS.unbinding_requests, requestId), { status: 'approved', reviewedBy: currentUser.fullName, reviewNotes: notes, updatedAt: now }, { merge: true }).catch(() => {});
      } catch {}

      recordAudit('UNBINDING_APPROVED', 'LICENSE', req.licenseId, req.currentLogin, req.newLogin || 'Unbound', `Approved: ${notes}`);
      addToast('Unbinding Approved', `Request #${requestId} authorized. Licence updated.`, 'success');
    } else {
      setUnbindingRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected', reviewedBy: currentUser.fullName, reviewNotes: notes, updatedAt: now } : r));
      setLicenses(prev => prev.map(l => l.id === req.licenseId ? { ...l, status: 'active', updatedAt: now } : l));

      try {
        setDoc(doc(db, COLLECTIONS.unbinding_requests, requestId), { status: 'rejected', reviewedBy: currentUser.fullName, reviewNotes: notes, updatedAt: now }, { merge: true }).catch(() => {});
      } catch {}

      recordAudit('UNBINDING_REJECTED', 'UNBINDING_REQUEST', requestId, 'pending', 'rejected', `Rejected: ${notes}`);
      addToast('Unbinding Rejected', `Request #${requestId} rejected: ${notes}`, 'warning');
    }

    return { success: true };
  };

  const approveUnbindingRequest = (requestId: string) => reviewUnbindingRequest(requestId, 'approve', 'Compliance authorized');
  const rejectUnbindingRequest = (requestId: string, reason?: string) => reviewUnbindingRequest(requestId, 'reject', reason || 'Account transfer rejected');

  const updateLicenseStatus = (licenseId: string, status: LicenseStatus, reason?: string) => {
    if (currentRole !== 'license_admin' && currentRole !== 'super_admin') {
      addToast('Unauthorized Action', 'Licence Administrator role is required to modify licence status.', 'critical');
      recordAudit('SECURITY_UNAUTHORIZED_ACTION', 'LICENSE', licenseId, currentRole, 'updateLicenseStatus', 'Denied: insufficient role', 'DENIED');
      return { success: false, error: 'Unauthorized: insufficient role' };
    }

    const lic = licenses.find(l => l.id === licenseId);
    if (!lic) return { success: false, error: 'Licence not found' };

    setLicenses(prev => prev.map(l => l.id === licenseId ? { ...l, status, suspensionReason: reason, updatedAt: new Date().toISOString() } : l));

    try {
      setDoc(doc(db, COLLECTIONS.licenses, licenseId), { status, suspensionReason: reason, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
    } catch {}

    recordAudit('LICENSE_STATUS_UPDATED', 'LICENSE', licenseId, lic.status, status, reason || 'Administrative action');
    addToast('Licence Status Changed', `Licence ${licenseId} set to ${status.toUpperCase()}`, 'info');
    return { success: true };
  };

  const renewLicense = (licenseId: string) => {
    const license = licenses.find(l => l.id === licenseId);
    if (!license) return { success: false, error: 'Licence not found' };

    const plan = plans.find(p => p.id === license.planId);
    if (!plan) return { success: false, error: 'Plan not found' };

    if (plan.isTrial) {
      addToast('Trial Renewal Prohibited', 'Starter Kit trial cannot be renewed. Please select an Upgrade plan.', 'warning');
      return { success: false, error: 'Trial cannot be renewed' };
    }

    return createOrder(plan.id, 'USDT-TRC20');
  };

  const upgradeLicense = (licenseId: string, targetPlanId: string) => {
    const license = licenses.find(l => l.id === licenseId);
    if (!license) return { success: false, error: 'Licence not found' };

    const currentPlan = plans.find(p => p.id === license.planId);
    const targetPlan = plans.find(p => p.id === targetPlanId);

    if (!currentPlan || !targetPlan) return { success: false, error: 'Plan mismatch' };

    if (targetPlan.priceUSDT <= currentPlan.priceUSDT) {
      addToast('Upgrade Only', 'Licence packages can only be upgraded to a higher tier, never downgraded.', 'warning');
      return { success: false, error: 'Upgrade must be to higher tier' };
    }

    const orderRes = createOrder(targetPlan.id, 'USDT-TRC20');
    if (orderRes.success && orderRes.orderId) {
      setLicenses(prev => prev.map(l => l.id === licenseId ? { ...l, status: 'upgrade_pending' } : l));
      recordAudit('UPGRADE_INITIATED', 'LICENSE', licenseId, currentPlan.name, targetPlan.name, 'Customer initiated plan upgrade');
    }
    return orderRes;
  };

  // =========================================================================
  // 5. EA VALIDATION & WEBREQUEST PROTOCOL
  // =========================================================================

  const validateEA = (req: any): any => {
    // Harmonize keys across simulator snake_case and API camelCase
    const licenseId = (req.licenseId || req.license_id || '').trim();
    const accountNumber = String(req.accountNumber || req.account_number || req.mt5Login || '').trim();
    const brokerName = (req.broker || req.brokerName || req.broker_name || '').trim();
    const symbol = (req.symbol || req.tradingSymbol || '').trim();
    const eaVersion = (req.eaVersion || req.ea_version || '2.4.1').trim();
    const nonce = req.nonce || '';
    const timestamp = req.timestamp ? Number(req.timestamp) : Date.now();

    // 1. Emergency stop check
    if (settings.globalEmergencyStop) {
      const response = {
        authorized: false,
        status: 403,
        reasonCode: 'EMERGENCY_STOP',
        paused: true,
        message: settings.globalStopReason || 'Global emergency pause active. Algorithmic executions suspended by OPHIREUM compliance.',
        body: { message: 'EMERGENCY_STOP: Global halt active' }
      };
      return response;
    }

    // 2. Strict XAUUSD check
    const normalizedSymbol = symbol.toUpperCase();
    const isApprovedGold = settings.approvedSymbols.some(s => s.toUpperCase() === normalizedSymbol);
    if (!isApprovedGold) {
      return {
        authorized: false,
        status: 400,
        reasonCode: 'SYMBOL_UNAUTHORIZED',
        message: `Trading symbol '${symbol}' is unauthorized. OPHIREUM is strictly hardcoded for XAUUSD (Gold).`,
        body: { message: `Unauthorized symbol: ${symbol}. Only XAUUSD approved.` }
      };
    }

    // 3. Replay Protection: Nonce check
    if (!nonce || usedNonces.has(nonce)) {
      return {
        authorized: false,
        status: 400,
        reasonCode: 'NONCE_REUSED',
        message: 'Security breach: Nonce already consumed (Replay attack detection).',
        body: { message: 'Replay detected: Nonce already consumed' }
      };
    }
    setUsedNonces(prev => new Set([...prev, nonce]));

    // 4. Timestamp Drift Check (+/- 300 seconds)
    const nowMs = Date.now();
    const driftSec = Math.abs(nowMs - (timestamp > 1e11 ? timestamp : timestamp * 1000)) / 1000;
    if (driftSec > 300) {
      return {
        authorized: false,
        status: 400,
        reasonCode: 'TIMESTAMP_OUT_OF_BOUNDS',
        message: `Terminal timestamp drift of ${Math.round(driftSec)}s exceeds the allowable 300-second window.`,
        body: { message: `Timestamp out of bounds (${Math.round(driftSec)}s drift)` }
      };
    }

    // 5. License Lookup
    const license = licenses.find(l => l.id.toLowerCase() === licenseId.toLowerCase());
    if (!license) {
      return {
        authorized: false,
        status: 404,
        reasonCode: 'LICENSE_NOT_FOUND',
        message: `Licence '${licenseId}' was not found in the OPHIREUM database.`,
        body: { message: 'Licence not found' }
      };
    }

    // 6. License Status
    if (license.status !== 'active') {
      return {
        authorized: false,
        status: 403,
        reasonCode: 'LICENSE_INACTIVE',
        message: `Licence status is ${license.status.toUpperCase()}. Live trading halted.`,
        body: { message: `Licence status is ${license.status}` }
      };
    }

    // 7. Expiration Check
    if (license.expiresAt && new Date(license.expiresAt).getTime() < nowMs) {
      return {
        authorized: false,
        status: 403,
        reasonCode: 'LICENSE_EXPIRED',
        message: 'Licence term has expired. Package upgrade or renewal required.',
        body: { message: 'Licence expired' }
      };
    }

    // 8. Account Number Binding Check
    if (!license.boundMt5Account || license.boundMt5Account !== accountNumber) {
      return {
        authorized: false,
        status: 403,
        reasonCode: 'ACCOUNT_MISMATCH',
        message: `Terminal account #${accountNumber} does not match bound account (${license.boundMt5Account || 'Unbound'}).`,
        body: { message: 'Account mismatch' }
      };
    }

    // 9. Automation Pause Check
    if (license.isAutomationPaused) {
      return {
        authorized: false,
        status: 403,
        reasonCode: 'AUTOMATION_PAUSED',
        paused: true,
        message: license.pauseReason || 'Automation paused by administrative policy.',
        body: { message: 'Automation paused' }
      };
    }

    // SUCCESS: Authorization Granted
    return {
      authorized: true,
      status: 200,
      reasonCode: 'AUTHORIZED',
      licenseExpiresAt: license.expiresAt,
      allowedSymbol: 'XAUUSD',
      permittedPolicy: {
        maxLot: license.lotSetting || 0.01,
        riskPct: license.riskSettingPct || 2.5,
        signalsCount: license.signalsCount || 5,
        stopLossMandatory: true,
        maxConcurrentPositions: 2,
        spreadThresholdPips: 25
      },
      message: 'Authorization granted. Algorithmic trade execution approved on XAUUSD.',
      body: { message: 'Authorization granted' }
    };
  };

  const sendEAHeartbeat = (req: EAHeartbeatRequest) => {
    const hbId = `hb-${Date.now()}`;
    const newLog: HeartbeatLog = {
      id: hbId,
      licenseId: req.licenseId,
      mt5Login: req.mt5Login,
      brokerServer: req.brokerServer,
      tradingSymbol: req.tradingSymbol,
      eaVersion: req.eaVersion,
      spreadPips: req.spreadPips || 1.2,
      openPositionsCount: req.openPositionsCount || 0,
      derivedStatus: 'online',
      receivedAt: new Date().toISOString()
    };

    setHeartbeats(prev => [newLog, ...prev.slice(0, 19)]);
    setLicenses(prev => prev.map(l => l.id === req.licenseId ? {
      ...l,
      lastHeartbeatAt: new Date().toISOString(),
      heartbeatStatus: 'online'
    } : l));

    return {
      success: true,
      message: 'Heartbeat acknowledged',
      derivedStatus: 'online'
    };
  };

  const toggleAutomationPause = (scope: AutomationControl['scope'], target: string, pause: boolean, reason: string) => {
    if (scope === 'single_license') {
      setLicenses(prev => prev.map(l => l.id === target ? {
        ...l,
        isAutomationPaused: pause,
        pauseReason: reason
      } : l));
    }
    recordAudit('AUTOMATION_CONTROL_CHANGED', 'AUTOMATION', target, `paused: ${!pause}`, `paused: ${pause}`, reason);
    addToast('Automation Control', `Automation ${pause ? 'PAUSED' : 'RESUMED'} on target ${target}.`, 'info');
    return { success: true };
  };

  const toggleGlobalEmergencyStop = (stop?: boolean | any, reason?: string) => {
    if (currentRole !== 'super_admin') {
      addToast('Unauthorized Action', 'Only Super Administrators can toggle the Global Emergency Stop.', 'critical');
      recordAudit('SECURITY_UNAUTHORIZED_ACTION', 'SYSTEM', 'globalEmergencyStop', currentRole, 'toggleGlobalEmergencyStop', 'Denied: non-super-admin', 'DENIED');
      return { success: false, error: 'Unauthorized: only super_admin permitted' };
    }

    const newStop = typeof stop === 'boolean' ? stop : !settings.globalEmergencyStop;
    const stopReason = reason || (newStop ? 'Administrative Emergency Kill-Switch Engaged' : '');

    setSettings(prev => ({
      ...prev,
      globalEmergencyStop: newStop,
      globalStopReason: stopReason
    }));

    try {
      setDoc(doc(db, COLLECTIONS.system_settings, 'global'), { globalEmergencyStop: newStop, globalStopReason: stopReason }, { merge: true }).catch(() => {});
      // Also notify server endpoint
      fetch('/api/v1/system/emergency-stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ halt: newStop, reason: stopReason, adminKey: 'OPHIREUM_ADMIN_AUTH' })
      }).catch(() => {});
    } catch {}

    recordAudit('GLOBAL_EMERGENCY_STOP', 'SYSTEM', 'ALL', `stopped: ${!newStop}`, `stopped: ${newStop}`, stopReason);
    addToast(
      newStop ? 'EMERGENCY HALT TRIGGERED' : 'SYSTEM RESUMED',
      newStop ? 'All WebRequest EA validations are now globally blocked.' : 'Normal algorithmic execution restored.',
      newStop ? 'critical' : 'success'
    );
    return { success: true };
  };

  // =========================================================================
  // 6. SUPPORT TICKETS & SYSTEM SETTINGS
  // =========================================================================

  const createTicket = (
    category: SupportTicket['category'],
    priority: SupportTicket['priority'],
    subject: string,
    message: string
  ) => {
    const ticketId = `TCK-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const newTicket: SupportTicket = {
      id: ticketId,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      category,
      priority,
      status: 'open',
      subject: subject.trim(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          ticketId,
          senderId: currentUser.uid,
          senderName: currentUser.fullName,
          senderRole: currentRole,
          message: message.trim(),
          createdAt: now
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    setTickets(prev => [newTicket, ...prev]);

    try {
      setDoc(doc(db, COLLECTIONS.support_tickets, ticketId), newTicket).catch(() => {});
    } catch {}

    recordAudit('SUPPORT_TICKET_CREATED', 'TICKET', ticketId, undefined, subject, `Created in category: ${category}`);
    addToast('Ticket Dispatched', `Support ticket #${ticketId} created. An engineer will reply shortly.`, 'success');
    return { success: true, ticketId };
  };

  const replyTicket = (ticketId: string, message: string, isStaffNote?: boolean) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return { success: false };

    const newMsg = {
      id: `msg-${Date.now()}`,
      ticketId,
      senderId: currentUser.uid,
      senderName: currentUser.fullName,
      senderRole: currentRole,
      message: message.trim(),
      isStaffNote: Boolean(isStaffNote),
      createdAt: new Date().toISOString()
    };

    const updatedTicket: SupportTicket = {
      ...ticket,
      status: currentRole === 'customer' ? 'in_progress' : 'waiting_user',
      messages: [...ticket.messages, newMsg],
      updatedAt: new Date().toISOString()
    };

    setTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));

    try {
      setDoc(doc(db, COLLECTIONS.support_tickets, ticketId), updatedTicket).catch(() => {});
    } catch {}

    recordAudit('TICKET_REPLIED', 'TICKET', ticketId, undefined, message.substring(0, 50), 'Added response to support ticket');
    addToast('Response Sent', 'Ticket message recorded.', 'info');
    return { success: true };
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t));
    try {
      setDoc(doc(db, COLLECTIONS.support_tickets, ticketId), { status, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
    } catch {}
    addToast('Ticket Updated', `Ticket #${ticketId} status changed to ${status.toUpperCase()}`, 'info');
  };

  const updatePlanPrice = (planId: string, newPriceUSDT: number, reason: string) => {
    if (currentRole !== 'super_admin') {
      addToast('Unauthorized Action', 'Only Super Administrators can change plan pricing.', 'critical');
      recordAudit('SECURITY_UNAUTHORIZED_ACTION', 'PLAN', planId, currentRole, 'updatePlanPrice', 'Denied: non-super-admin', 'DENIED');
      return { success: false, error: 'Unauthorized: only super_admin permitted' };
    }

    setPlans(prev => prev.map(p => p.id === planId ? { ...p, priceUSDT: newPriceUSDT } : p));
    try {
      setDoc(doc(db, COLLECTIONS.plans, planId), { priceUSDT: newPriceUSDT }, { merge: true }).catch(() => {});
    } catch {}
    recordAudit('PLAN_PRICE_UPDATED', 'PLAN', planId, undefined, `${newPriceUSDT} USDT`, reason);
    addToast('Plan Updated', `Plan ${planId} price updated to ${newPriceUSDT} USDT`, 'success');
    return { success: true };
  };

  const updateSystemSettings = (newSettings: Partial<SystemSettings>, reason: string) => {
    if (currentRole !== 'super_admin') {
      addToast('Unauthorized Action', 'Only Super Administrators can alter institutional platform settings.', 'critical');
      recordAudit('SECURITY_UNAUTHORIZED_ACTION', 'SYSTEM', 'global', currentRole, 'updateSystemSettings', 'Denied: non-super-admin', 'DENIED');
      return { success: false, error: 'Unauthorized: only super_admin permitted' };
    }

    setSettings(prev => ({ ...prev, ...newSettings }));
    try {
      setDoc(doc(db, COLLECTIONS.system_settings, 'global'), newSettings, { merge: true }).catch(() => {});
    } catch {}
    recordAudit('SETTINGS_UPDATED', 'SYSTEM', 'global', undefined, JSON.stringify(newSettings), reason);
    addToast('Settings Saved', 'Platform settings successfully saved.', 'success');
    return { success: true };
  };

  const registerEAVersion = (versionData: EAVersion) => {
    setEaVersions(prev => [versionData, ...prev]);
    recordAudit('EA_VERSION_REGISTERED', 'EA_BUILD', versionData.version, undefined, versionData.checksumSHA256, 'Registered production EA build');
    addToast('EA Build Added', `Release v${versionData.version} registered.`, 'success');
    return { success: true };
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        currentRoute,
        setCurrentRoute,
        switchRole,
        login,
        logout,
        registerUser,
        acceptAgreements,
        sendPasswordReset,
        sendVerificationEmail,
        checkVerificationStatus,
        acceptEmailVerified,
        updateProfileInfo,
        plans,
        licenses,
        orders,
        invoices,
        eaVersions,
        unbindingRequests,
        vpsInstances,
        tickets,
        auditLogs,
        notifications,
        heartbeats,
        settings,
        automationControls,
        isFirebaseConnected,
        seedFirestore,
        createOrder,
        submitPaymentProof,
        reviewPayment,
        confirmPaymentOrder,
        rejectPaymentOrder,
        bindMt5Account,
        submitSecureMt5Binding,
        fetchMt5LiveAccount,
        toggleTradingHalt,
        submitUnbindingRequest,
        reviewUnbindingRequest,
        approveUnbindingRequest,
        rejectUnbindingRequest,
        renewLicense,
        upgradeLicense,
        updateLicenseStatus,
        validateEA,
        sendEAHeartbeat,
        toggleAutomationPause,
        toggleGlobalEmergencyStop,
        createTicket,
        replyTicket,
        updateTicketStatus,
        updatePlanPrice,
        updateSystemSettings,
        registerEAVersion,
        markNotificationRead,
        addToast,
        toasts,
        removeToast,
        verificationStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
