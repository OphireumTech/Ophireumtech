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
    await getDocFromServer(testDocRef);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[OPHIREUM Firebase] Firestore client offline or database provisioning pending.');
      return false;
    }
    // Missing document still proves connection succeeded
    return true;
  }
}

export { serverTimestamp, Timestamp };

/**
 * Safe Firebase Authentication error message formatter.
 * Maps Firebase Auth error codes to user-friendly messages.
 * Never exposes internal configurations, stack traces, API keys, or database IDs.
 */
export function formatAuthError(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/operation-not-allowed':
      return 'Email/password registration is not enabled. Please contact support.';
    case 'auth/email-already-in-use':
      return 'An account already exists for this email. Please log in or reset your password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Please use a stronger password.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait before trying again.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/requires-recent-login':
      return 'Please sign in again to complete this sensitive operation.';
    default:
      return 'An unexpected error occurred during authentication. Please try again.';
  }
}

export type { FirebaseUser };
