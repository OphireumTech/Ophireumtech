/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Automated Test Suite: Business Logic & Compliance Rules
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

describe('OPHIREUM Algorithmic Compliance & Licensing Suite', () => {

  // Test 1: Gold / XAUUSD Strict Symbol Whitelist
  describe('Symbol Whitelist Rule (XAUUSD-Only Architecture)', () => {
    const approvedSymbols = ['XAUUSD', 'XAUUSD.raw', 'XAUUSDm', 'GOLD', 'XAUUSD.a', 'XAUUSD.pro'];

    function isSymbolAuthorized(symbol: string): boolean {
      return approvedSymbols.some(s => s.toUpperCase() === symbol.trim().toUpperCase());
    }

    it('approves standard XAUUSD and approved broker suffixes', () => {
      assert.equal(isSymbolAuthorized('XAUUSD'), true);
      assert.equal(isSymbolAuthorized('xauusd.raw'), true);
      assert.equal(isSymbolAuthorized('GOLD'), true);
      assert.equal(isSymbolAuthorized('XAUUSDm'), true);
    });

    it('strictly denies non-gold currency pairs and indices', () => {
      assert.equal(isSymbolAuthorized('EURUSD'), false);
      assert.equal(isSymbolAuthorized('GBPUSD'), false);
      assert.equal(isSymbolAuthorized('BTCUSD'), false);
      assert.equal(isSymbolAuthorized('US30'), false);
      assert.equal(isSymbolAuthorized('NAS100'), false);
    });
  });

  // Test 2: Replay Attack Protection (Nonce Validation)
  describe('Replay Protection & Nonce Cache', () => {
    const consumedNonces = new Set<string>();

    function validateNonce(nonce: string): { valid: boolean; reason?: string } {
      if (!nonce || nonce.length < 8) {
        return { valid: false, reason: 'INVALID_NONCE' };
      }
      if (consumedNonces.has(nonce)) {
        return { valid: false, reason: 'REPLAY_ATTACK_DETECTED' };
      }
      consumedNonces.add(nonce);
      return { valid: true };
    }

    it('accepts a fresh cryptographic nonce', () => {
      const freshNonce = `nonce-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const res = validateNonce(freshNonce);
      assert.equal(res.valid, true);
    });

    it('rejects an identical consumed nonce (prevents replay attacks)', () => {
      const reusedNonce = 'replay-attack-sample-nonce-001';
      validateNonce(reusedNonce); // First use succeeds
      const replayAttempt = validateNonce(reusedNonce); // Second use MUST fail
      assert.equal(replayAttempt.valid, false);
      assert.equal(replayAttempt.reason, 'REPLAY_ATTACK_DETECTED');
    });
  });

  // Test 3: Timestamp Drift Bounds (+/- 300 Seconds)
  describe('Timestamp Synchronization Constraint', () => {
    function checkTimestampDrift(timestampSeconds: number, serverNowSeconds: number): boolean {
      const drift = Math.abs(serverNowSeconds - timestampSeconds);
      return drift <= 300;
    }

    it('permits requests within 300 seconds of server clock', () => {
      const now = 1773000000;
      assert.equal(checkTimestampDrift(now, now), true);
      assert.equal(checkTimestampDrift(now - 120, now), true);
      assert.equal(checkTimestampDrift(now + 280, now), true);
    });

    it('rejects requests with timestamp drift exceeding 300 seconds', () => {
      const now = 1773000000;
      assert.equal(checkTimestampDrift(now - 301, now), false);
      assert.equal(checkTimestampDrift(now + 600, now), false);
    });
  });

  // Test 4: Cryptographic HMAC Signature Generation
  describe('Cryptographic Signature Verification', () => {
    const SECRET = 'OPHIREUM_TEST_SECRET_KEY';

    function signPayload(payload: string): string {
      return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
    }

    it('generates valid deterministic HMAC-SHA256 signature', () => {
      const sig1 = signPayload('OPH-1234-5678-XAU:8829104:XAUUSD:AUTHORIZED');
      const sig2 = signPayload('OPH-1234-5678-XAU:8829104:XAUUSD:AUTHORIZED');
      assert.equal(sig1, sig2);
      assert.equal(sig1.length, 64);
    });

    it('fails when payload is modified by an adversary', () => {
      const legitimate = signPayload('OPH-1234-5678-XAU:8829104:XAUUSD:AUTHORIZED');
      const tampered = signPayload('OPH-1234-5678-XAU:9999999:XAUUSD:AUTHORIZED');
      assert.notEqual(legitimate, tampered);
    });
  });

  // Test 5: Plan Purchase Rules & One-Time Starter Trial Rule
  describe('Commercial Licensing Rules', () => {
    interface UserState {
      starterPurchased: boolean;
      agreementsAccepted: boolean;
    }

    function canPurchasePlan(user: UserState, planIsTrial: boolean): { allowed: boolean; reason?: string } {
      if (!user.agreementsAccepted) {
        return { allowed: false, reason: 'AGREEMENTS_REQUIRED' };
      }
      if (planIsTrial && user.starterPurchased) {
        return { allowed: false, reason: 'STARTER_TRIAL_LIMIT_EXCEEDED' };
      }
      return { allowed: true };
    }

    it('requires legal and risk agreements before purchasing any plan', () => {
      const unverifiedUser: UserState = { starterPurchased: false, agreementsAccepted: false };
      const res = canPurchasePlan(unverifiedUser, false);
      assert.equal(res.allowed, false);
      assert.equal(res.reason, 'AGREEMENTS_REQUIRED');
    });

    it('permits one starter trial per customer', () => {
      const freshUser: UserState = { starterPurchased: false, agreementsAccepted: true };
      const res = canPurchasePlan(freshUser, true);
      assert.equal(res.allowed, true);
    });

    it('strictly forbids repeat purchases of the starter trial tier', () => {
      const existingUser: UserState = { starterPurchased: true, agreementsAccepted: true };
      const res = canPurchasePlan(existingUser, true);
      assert.equal(res.allowed, false);
      assert.equal(res.reason, 'STARTER_TRIAL_LIMIT_EXCEEDED');
    });
  });

  // Test 6: MT5 Account Binding & Duplicate Collision Prevention
  describe('MT5 Terminal Binding Constraints', () => {
    const existingBindings = new Map<string, string>([
      ['OPH-ACTIVE-01', '7729014'],
      ['OPH-ACTIVE-02', '8839102']
    ]);

    function bindTerminal(licenseId: string, newLogin: string): { success: boolean; error?: string } {
      if (!/^\d{4,12}$/.test(newLogin)) {
        return { success: false, error: 'INVALID_LOGIN_FORMAT' };
      }
      for (const [otherLic, boundAcc] of existingBindings.entries()) {
        if (otherLic !== licenseId && boundAcc === newLogin) {
          return { success: false, error: 'ACCOUNT_ALREADY_BOUND' };
        }
      }
      existingBindings.set(licenseId, newLogin);
      return { success: true };
    }

    it('validates numerical format for MT5 terminal account number', () => {
      assert.equal(bindTerminal('OPH-TEST', 'ABC1234').success, false);
      assert.equal(bindTerminal('OPH-TEST', '12').success, false); // too short
      assert.equal(bindTerminal('OPH-TEST', '9928103').success, true);
    });

    it('prevents duplicate binding of the same MT5 account across different licences', () => {
      const collision = bindTerminal('OPH-NEW', '7729014');
      assert.equal(collision.success, false);
      assert.equal(collision.error, 'ACCOUNT_ALREADY_BOUND');
    });
  });

  // Test 7: Global Emergency Stop Behavior
  describe('Global Killswitch & Governance Behavior', () => {
    function evaluateExecution(globalHaltActive: boolean, licenseActive: boolean): string {
      if (globalHaltActive) return 'EMERGENCY_STOP';
      if (!licenseActive) return 'LICENSE_INACTIVE';
      return 'AUTHORIZED';
    }

    it('halts all execution when Global Emergency Stop is engaged', () => {
      assert.equal(evaluateExecution(true, true), 'EMERGENCY_STOP');
      assert.equal(evaluateExecution(true, false), 'EMERGENCY_STOP');
    });

    it('authorizes execution when system is operating normally with active license', () => {
      assert.equal(evaluateExecution(false, true), 'AUTHORIZED');
    });
  });
});
