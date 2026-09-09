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
  Firestore
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

export type { FirebaseUser };
