/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Cryptographic Bootstrap Script: Super Administrator Provisioning
 * 
 * Usage:
 *   npx tsx scripts/bootstrap-super-admin.ts --email admin@example.com
 *   or
 *   npx tsx scripts/bootstrap-super-admin.ts --uid TARGET_FIREBASE_UID
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth, UserRecord } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as crypto from 'crypto';

// Command line argument parser
function parseArgs(): { email?: string; uid?: string } {
  const args = process.argv.slice(2);
  const result: { email?: string; uid?: string } = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      result.email = args[i + 1].trim().toLowerCase();
      i++;
    } else if (args[i] === '--uid' && args[i + 1]) {
      result.uid = args[i + 1].trim();
      i++;
    }
  }

  return result;
}

async function bootstrapSuperAdmin() {
  console.log('===========================================================');
  console.log('  OPHIREUM MASTER SECURITY: SUPER ADMINISTRATOR BOOTSTRAP  ');
  console.log('===========================================================\n');

  // 1. Refuse to run without server credentials
  const hasServiceAccount = Boolean(
    process.env.GOOGLE_APPLICATION_CREDENTIALS || 
    process.env.FIREBASE_CONFIG || 
    process.env.FIREBASE_SERVICE_ACCOUNT
  );

  const isEmulator = Boolean(process.env.FIREBASE_AUTH_EMULATOR_HOST);

  if (!hasServiceAccount && !isEmulator) {
    console.error('CRITICAL ERROR: Refusing to run without verified server credentials.');
    console.error('Please configure GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT environment variable.');
    process.exit(1);
  }

  const { email, uid } = parseArgs();

  if (!email && !uid) {
    console.error('Error: You must provide either --email <email> or --uid <uid>');
    console.error('Example: npx tsx scripts/bootstrap-super-admin.ts --email target@ophireum.com');
    process.exit(1);
  }

  // 2. Initialize Firebase Admin SDK
  try {
    if (getApps().length === 0) {
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const creds = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        initializeApp({
          credential: cert(creds)
        });
      } else {
        initializeApp();
      }
    }
  } catch (err: any) {
    console.error('Failed to initialize Firebase Admin SDK:', err.message);
    process.exit(1);
  }

  const auth = getAuth();
  const db = getFirestore();

  try {
    // 3. Confirm target user exists in Firebase Authentication
    let userRecord: UserRecord;
    if (uid) {
      userRecord = await auth.getUser(uid);
    } else {
      userRecord = await auth.getUserByEmail(email!);
    }

    console.log(`[+] User verified: ${userRecord.email} (UID: ${userRecord.uid})`);

    // 4. Set server-controlled custom claim
    await auth.setCustomUserClaims(userRecord.uid, {
      role: 'super_admin',
      elevatedAt: Date.now(),
      mfaRequired: true
    });
    console.log('[+] Custom claim set: { role: "super_admin" }');

    // 5. Create or update the protected server-controlled role record in Firestore
    const userDocRef = db.collection('users').doc(userRecord.uid);
    const nowIso = new Date().toISOString();

    await userDocRef.set(
      {
        uid: userRecord.uid,
        email: userRecord.email,
        fullName: userRecord.displayName || userRecord.email?.split('@')[0] || 'Super Administrator',
        role: 'super_admin',
        isEmailVerified: userRecord.emailVerified,
        updatedAt: nowIso
      },
      { merge: true }
    );
    console.log('[+] Protected Firestore user record synchronized with role "super_admin"');

    // 6. Revoke existing refresh tokens immediately
    await auth.revokeRefreshTokens(userRecord.uid);
    console.log('[+] Existing refresh tokens revoked (forces immediate session refresh)');

    // 7. Write an immutable audit event
    const auditId = `audit-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    await db.collection('audit_logs').doc(auditId).set({
      id: auditId,
      timestamp: nowIso,
      actorUid: 'SYSTEM_BOOTSTRAP_CLI',
      actorEmail: 'root@internal.security',
      action: 'ROLE_ELEVATION_SUPER_ADMIN',
      targetResource: `users/${userRecord.uid}`,
      targetUserEmail: userRecord.email,
      details: 'Super administrator provisioned via cryptographic CLI bootstrap tool.',
      ipAddress: '127.0.0.1_SERVER_CLI',
      status: 'SUCCESS'
    });
    console.log(`[+] Immutable audit log recorded: ${auditId}`);

    // 8. Print instructions
    console.log('\n-----------------------------------------------------------');
    console.log('SUCCESS: Super Administrator credentials provisioned.');
    console.log('INSTRUCTIONS:');
    console.log('1. The user must log out and log in again to acquire fresh custom claims.');
    console.log('2. Enroll Multi-Factor Authentication (MFA) immediately upon first login.');
    console.log('3. All administrative operations are logged to the immutable audit ledger.');
    console.log('-----------------------------------------------------------\n');

    process.exit(0);
  } catch (err: any) {
    console.error('\nCRITICAL FAILURE during bootstrap execution:', err.message);
    process.exit(1);
  }
}

bootstrapSuperAdmin();
