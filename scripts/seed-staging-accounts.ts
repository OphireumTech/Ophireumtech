/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Staging & Emulator Test Accounts Seeder
 * 
 * Creates isolated test accounts exclusively in staging/emulator environments.
 * Strictly refuses to run against production project environments.
 */

import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth, UserRecord } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as crypto from 'crypto';

// Production project identifiers that MUST NEVER be seeded
const PRODUCTION_PROJECT_IDS = [
  'ophireum-prod',
  'ophireum-production',
  'ophireumtech-live',
  'gen-lang-client-0814772169' // Live cloud project associated with applet
];

interface StagingAccountDef {
  email: string;
  role: 'customer' | 'support_agent' | 'finance_reviewer' | 'license_admin' | 'super_admin';
  displayName: string;
}

const STAGING_ACCOUNTS: StagingAccountDef[] = [
  {
    email: 'customer.test@ophireum.invalid',
    role: 'customer',
    displayName: 'Staging Test Customer'
  },
  {
    email: 'support.test@ophireum.invalid',
    role: 'support_agent',
    displayName: 'Staging Support Agent'
  },
  {
    email: 'finance.test@ophireum.invalid',
    role: 'finance_reviewer',
    displayName: 'Staging Finance Reviewer'
  },
  {
    email: 'license.test@ophireum.invalid',
    role: 'license_admin',
    displayName: 'Staging License Administrator'
  },
  {
    email: 'superadmin.test@ophireum.invalid',
    role: 'super_admin',
    displayName: 'Staging Super Administrator'
  }
];

function generateSecureRandomPassword(length = 20): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}';
  const bytes = crypto.randomBytes(length);
  let pass = '';
  for (let i = 0; i < length; i++) {
    pass += chars[bytes[i] % chars.length];
  }
  return pass;
}

async function seedStagingAccounts() {
  console.log('===========================================================');
  console.log('       OPHIREUM STAGING / EMULATOR ACCOUNT SEEDER          ');
  console.log('===========================================================\n');

  // 1. Environment & Production Safeguard Check
  const currentProjectId = process.env.VITE_FIREBASE_PROJECT_ID || 
                           process.env.GCLOUD_PROJECT || 
                           process.env.FIREBASE_PROJECT_ID || 
                           '';

  const isEmulator = Boolean(process.env.FIREBASE_AUTH_EMULATOR_HOST);

  if (PRODUCTION_PROJECT_IDS.includes(currentProjectId) && !isEmulator) {
    console.error('CRITICAL ABORT: Refusing to seed test accounts. Current Project ID matches production!');
    console.error(`Target: ${currentProjectId}`);
    console.error('Test accounts with .invalid domains can only be provisioned in an isolated staging project or local emulator.');
    process.exit(1);
  }

  // 2. Initialize Admin SDK
  if (getApps().length === 0) {
    initializeApp();
  }

  const auth = getAuth();
  const db = getFirestore();

  console.log(`Environment: ${isEmulator ? 'Local Firebase Emulator' : 'Isolated Staging Environment'}`);
  console.log(`Target Accounts: ${STAGING_ACCOUNTS.length}\n`);

  const credentialsOutput: { email: string; role: string; password: string }[] = [];

  for (const acct of STAGING_ACCOUNTS) {
    const tempPassword = generateSecureRandomPassword(20);

    try {
      // Check if user already exists
      let user: UserRecord;
      try {
        user = await auth.getUserByEmail(acct.email);
        // Update password and claims
        await auth.updateUser(user.uid, {
          password: tempPassword,
          emailVerified: true,
          displayName: acct.displayName
        });
      } catch {
        // Create user
        user = await auth.createUser({
          email: acct.email,
          password: tempPassword,
          emailVerified: true,
          displayName: acct.displayName
        });
      }

      // Assign custom claim
      await auth.setCustomUserClaims(user.uid, {
        role: acct.role,
        isStagingTestAccount: true
      });

      // Synchronize Firestore user record
      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: acct.email,
        fullName: acct.displayName,
        role: acct.role,
        isEmailVerified: true,
        mfaEnabled: false,
        requiresPasswordChange: true,
        isStagingTestAccount: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      credentialsOutput.push({
        email: acct.email,
        role: acct.role,
        password: tempPassword
      });

      console.log(`[+] Seeded ${acct.role.toUpperCase()}: ${acct.email}`);
    } catch (err: any) {
      console.error(`[-] Failed to seed ${acct.email}:`, err.message);
    }
  }

  console.log('\n===========================================================');
  console.log('   TEMPORARY CREDENTIALS (PRINTED ONCE — DO NOT COMMIT)    ');
  console.log('===========================================================');
  credentialsOutput.forEach(c => {
    console.log(`Role:     ${c.role}`);
    console.log(`Email:    ${c.email}`);
    console.log(`Password: ${c.password}`);
    console.log('-----------------------------------------------------------');
  });
  console.log('\nAll staging accounts require an immediate password change upon login.\n');
}

seedStagingAccounts().catch(e => {
  console.error('Seeder failed:', e);
  process.exit(1);
});
