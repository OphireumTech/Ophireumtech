/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Firebase Architecture: Client SDK Initialization & Services
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  ActionCodeSettings,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
  Firestore,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

// Configuration resolution: priority to firebase-applet-config.json, with env fallback
const metaEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: metaEnv.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId
};

const databaseId = metaEnv.VITE_FIREBASE_DATABASE_ID || firebaseConfigJson.firestoreDatabaseId || '(default)';

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with designated databaseId
export const db: Firestore = databaseId && databaseId !== '(default)'
  ? getFirestore(app, databaseId)
  : getFirestore(app);

// Firestore Collection Constants enforcing the full specification schema
export const COLLECTIONS = {
  users: 'users',
  profiles: 'profiles',
  roles: 'roles',
  plans: 'plans',
  orders: 'orders',
  payments: 'payments',
  payment_events: 'payment_events',
  licenses: 'licenses',
  license_events: 'license_events',
  mt5_bindings: 'mt5_bindings',
  unbinding_requests: 'unbinding_requests',
  ea_versions: 'ea_versions',
  ea_validations: 'ea_validations',
  heartbeats: 'heartbeats',
  automation_controls: 'automation_controls',
  vps_instances: 'vps_instances',
  invoices: 'invoices',
  risk_acceptances: 'risk_acceptances',
  legal_acceptances: 'legal_acceptances',
  support_tickets: 'support_tickets',
  ticket_messages: 'ticket_messages',
  notifications: 'notifications',
  audit_logs: 'audit_logs',
  security_events: 'security_events',
  approved_symbols: 'approved_symbols',
  system_settings: 'system_settings'
} as const;

/**
 * Validates connectivity to Cloud Firestore
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const testDocRef = doc(db, 'system_settings', 'global');
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firebase connection check timed out')), 3500)
    );
    await Promise.race([getDocFromServer(testDocRef), timeoutPromise]);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[OPHIREUM Firebase] Firestore client offline or database provisioning pending.');
      return false;
    }
    console.warn('[OPHIREUM Firebase] Offline or optional backend fallback active:', error);
    return false;
  }
}

export { serverTimestamp, Timestamp };

/**
 * Production ActionCodeSettings for OPHIREUM email verification dispatch.
 * Continues to https://ophireum.biz/?emailVerified=1 upon email link click.
 */
export const ACTION_CODE_SETTINGS: ActionCodeSettings = {
  url: 'https://ophireum.biz/?emailVerified=1',
  handleCodeInApp: false
};

// Backwards compatibility alias
export const EMAIL_ACTION_CODE_SETTINGS = ACTION_CODE_SETTINGS;

/**
 * Safe Firebase Authentication error message formatter.
 * Maps Firebase Auth error codes to user-friendly, actionable messages.
 * Never exposes internal configurations, stack traces, API keys, or database IDs.
 */
export function formatAuthError(error: any): string {
  const code = error?.code || '';

  // Safe development logging: log ONLY the Firebase error code (never passwords, tokens, or customer data)
  if (code) {
    console.warn('[OPHIREUM Auth Debug] Error code:', code);
  }

  switch (code) {
    case 'auth/operation-not-allowed':
      return 'Email/password registration is not enabled in Firebase Authentication. Please enable Email/Password under Sign-in method in Firebase Console.';
    case 'auth/email-already-in-use':
      return 'An account is already registered with this email address. Please log in or use password recovery.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must contain at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network connection error. Check your internet connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many verification requests. Firebase rate limits verification emails to prevent abuse. Please wait 60 seconds before requesting another link.';
    case 'auth/user-token-expired':
      return 'Your security session has expired. Please sign in again to verify your email.';
    case 'auth/invalid-continue-uri':
      return 'The continuation URL provided in ActionCodeSettings is invalid. Please contact Ophireum support.';
    case 'auth/unauthorized-continue-uri':
      return 'The domain "ophireum.biz" is not yet allowlisted in Firebase Console → Authentication → Settings → Authorized domains. Please add ophireum.biz to authorized domains in Firebase Console.';
    case 'auth/missing-continue-uri':
      return 'A continuation link is missing from the verification request. Please contact support.';
    case 'auth/user-not-found':
      return 'No account was found matching this email address.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/user-disabled':
      return 'This account has been disabled by administrative security policy. Please contact Ophireum support.';
    case 'auth/requires-recent-login':
      return 'Please sign in again to complete this sensitive verification action.';
    case 'auth/internal-error':
      return 'Firebase encountered an internal error. Please wait a moment and try again.';
    default:
      return error?.message || 'An unexpected error occurred during authentication. Please try again.';
  }
}

export type { FirebaseUser };
