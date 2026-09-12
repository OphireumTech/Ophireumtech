/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Authentication Views: Login, Register, Password Recovery, Email Verification
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Lock, Mail, User, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { BrandLogo } from '../common/BrandLogo';

interface AuthPagesProps {
  view: 'login' | 'register' | 'forgot-password' | 'verify-email';
}

export const AuthPages: React.FC<AuthPagesProps> = ({ view }) => {
  const {
    login,
    logout,
    registerUser,
    setCurrentRoute,
    addToast,
    sendPasswordReset,
    sendVerificationEmail,
    checkVerificationStatus,
    currentUser,
    verificationStatus
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // 60-second cooldown timer for resend verification email
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // If already verified, route to dashboard automatically
  useEffect(() => {
    if (view === 'verify-email') {
      const fbUser = auth.currentUser;
      if (fbUser?.emailVerified || currentUser?.isEmailVerified) {
        setCurrentRoute('dashboard');
      }
    }
  }, [view, currentUser?.isEmailVerified]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      addToast('Credentials Required', 'Please provide your email and password.', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await login(email.trim(), password);
      if (ok) {
        setCurrentRoute('dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      addToast('Full Name Required', 'Please enter your full legal name.', 'warning');
      return;
    }
    if (!cleanEmail) {
      addToast('Email Required', 'Please enter a valid email address.', 'warning');
      return;
    }
    if (!password || password.length < 6) {
      addToast('Weak Password', 'Password must contain at least 6 characters.', 'warning');
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      addToast('Password Mismatch', 'The passwords entered do not match. Please verify.', 'warning');
      return;
    }
    if (!termsAgreed) {
      addToast('Agreements Required', 'You must agree to the Terms of Use and Risk Disclosure.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerUser(cleanName, cleanEmail, password);
      // registerUser handles verification email dispatch and routes to verify-email
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('Email Required', 'Please enter your registered email address', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await sendPasswordReset(email);
      if (ok) {
        setResetSent(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    const user = auth.currentUser;
    if (!user) {
      addToast('Authentication Required', 'Please log in to your account to resend the verification email.', 'warning');
      setCurrentRoute('login');
      return;
    }

    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    try {
      const ok = await sendVerificationEmail();
      if (ok) {
        setResendCooldown(60);
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckStatus = async () => {
    const user = auth.currentUser;
    if (!user) {
      addToast('Authentication Required', 'Please log in to check your email verification status.', 'warning');
      setCurrentRoute('login');
      return;
    }

    if (isCheckingStatus) return;

    setIsCheckingStatus(true);
    try {
      const verified = await checkVerificationStatus();
      if (verified) {
        setCurrentRoute('dashboard');
      }
    } finally {
      setIsCheckingStatus(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-3 flex flex-col items-center">
        <BrandLogo size="lg" to="/home" onClick={() => setCurrentRoute('home')} />
        <h1 className="text-2xl font-display font-bold text-white pt-1">
          {view === 'login' && 'Institutional Client Access'}
          {view === 'register' && 'Deploy OPHIREUM Account'}
          {view === 'forgot-password' && 'Password Recovery'}
          {view === 'verify-email' && 'Verify Email Address'}
        </h1>
        <p className="text-xs text-zinc-400">
          {view === 'login' && 'Enter your credentials to manage MT5 licensing and accounts.'}
          {view === 'register' && 'Deploy disciplined MT5 algorithmic execution.'}
          {view === 'forgot-password' && 'Enter your email to receive a secure password recovery link.'}
          {view === 'verify-email' && 'Confirm your email address to unlock production activations.'}
        </p>
      </div>

      {/* Main Form Box */}
      <div className="bg-[#0D1017] border border-[#1E2330] rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
        {/* LOGIN FORM */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  id="auth-input-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111420] border border-[#232838] rounded-lg pl-9 pr-3 py-2.5 text-zinc-100 placeholder-zinc-600 focus:border-[#C9A227] outline-none transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-zinc-400 font-medium">Password</label>
                <button
                  type="button"
                  onClick={() => setCurrentRoute('forgot-password')}
                  className="text-[11px] text-[#C9A227] hover:underline cursor-pointer font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  id="auth-input-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111420] border border-[#232838] rounded-lg pl-9 pr-3 py-2.5 text-zinc-100 placeholder-zinc-600 focus:border-[#C9A227] outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              id="auth-btn-login-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-xs tracking-wide shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Access Secure Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {view === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Full Legal Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  id="auth-input-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#111420] border border-[#232838] rounded-lg pl-9 pr-3 py-2.5 text-zinc-100 placeholder-zinc-600 focus:border-[#C9A227] outline-none transition-colors"
                  placeholder="Institutional or Personal Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  id="auth-input-reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111420] border border-[#232838] rounded-lg pl-9 pr-3 py-2.5 text-zinc-100 placeholder-zinc-600 focus:border-[#C9A227] outline-none transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  id="auth-input-reg-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111420] border border-[#232838] rounded-lg pl-9 pr-3 py-2.5 text-zinc-100 placeholder-zinc-600 focus:border-[#C9A227] outline-none transition-colors"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  id="auth-input-reg-confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#111420] border border-[#232838] rounded-lg pl-9 pr-3 py-2.5 text-zinc-100 placeholder-zinc-600 focus:border-[#C9A227] outline-none transition-colors"
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 rounded bg-zinc-900 border-zinc-700 text-[#C9A227] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="terms" className="text-[11px] text-zinc-400 leading-tight">
                I understand OPHIREUM is a software provider (not a financial broker), and I agree to the{' '}
                <Link to="/legal-terms" className="text-zinc-200 underline">Terms of Use</Link> and{' '}
                <Link to="/legal-risk" className="text-[#E4C765] underline">Trading Risk Disclosure</Link>.
              </label>
            </div>

            <button
              id="auth-btn-register-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-xs tracking-wide shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Register Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {view === 'forgot-password' && (
          <div className="space-y-4 text-xs">
            {resetSent ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/60 text-emerald-200 space-y-2 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <div className="font-bold text-sm">Recovery Link Dispatched</div>
                <p className="text-[11px] text-zinc-300">
                  Instructions to reset your password have been sent to <span className="font-semibold text-white">{email}</span>. Please check your inbox and spam folder.
                </p>
                <button
                  onClick={() => setCurrentRoute('login')}
                  className="mt-3 inline-block text-xs font-semibold text-[#E4C765] hover:underline cursor-pointer"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Registered Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#111420] border border-[#232838] rounded-lg pl-9 pr-3 py-2.5 text-zinc-100 placeholder-zinc-600 focus:border-[#C9A227] outline-none"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#C9A227] text-black font-bold text-xs cursor-pointer hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending Link...</span>
                    </>
                  ) : (
                    <span>Send Password Reset Link</span>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* VERIFY EMAIL */}
        {view === 'verify-email' && (
          <div className="space-y-4 text-xs text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#181C26] border border-[#C9A227]/40 flex items-center justify-center text-[#E4C765] shadow-lg shadow-[#C9A227]/5">
              <Mail className="w-7 h-7 text-[#E4C765]" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-base font-bold text-white">Email Verification Required</h2>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mx-auto">
                A verification link has been requested for your registered account. Please click the link to confirm ownership and activate institutional features.
              </p>
              <div className="inline-block px-3 py-1 rounded-lg bg-[#0F131D] border border-[#232A3E] font-mono font-semibold text-[#E4C765] text-xs mt-1">
                {auth.currentUser?.email || currentUser?.email || 'your registered email'}
              </div>
            </div>

            {/* Delivery Status Feedback */}
            {verificationStatus?.initialSendSuccess ? (
              <div className="p-3 rounded-xl bg-[#0F2218] border border-emerald-500/30 text-emerald-300 text-left text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verification Request Submitted</span>
                </div>
                <p className="text-[11px] text-emerald-300/90 leading-relaxed">
                  Verification email requested successfully. Check your inbox, Spam, Junk, Promotions, and All Mail folders. Delivery may take a few minutes.
                </p>
              </div>
            ) : verificationStatus?.initialSendAttempted && !verificationStatus?.initialSendSuccess ? (
              <div className="p-3 rounded-xl bg-[#241315] border border-rose-500/30 text-rose-300 text-left text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-rose-200">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Email Dispatch Notice</span>
                </div>
                <p className="text-[11px] text-rose-300/90 leading-relaxed">
                  {verificationStatus.lastError === 'auth/unauthorized-continue-uri' ? (
                    <>
                      The domain <strong className="text-amber-300">ophireum.biz</strong> must be added to Authorized Domains in Firebase Console → Authentication → Settings → Authorized domains.
                    </>
                  ) : verificationStatus.lastError === 'auth/too-many-requests' ? (
                    'Firebase rate limits verification emails to prevent abuse. Please wait 60 seconds before requesting another link.'
                  ) : (
                    'Initial verification email could not be sent. Please check project settings or click Resend Verification Email below.'
                  )}
                </p>
              </div>
            ) : null}

            {/* Verification Instructions Callout */}
            <div className="p-3 rounded-xl bg-[#0C0F17] border border-[#1E2433] text-left text-zinc-400 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
                <Shield className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Verification Checklist:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1 text-zinc-400">
                <li>Check your inbox and <strong className="text-zinc-300">Spam, Junk, and Promotions</strong> folders.</li>
                <li>Click the secure verification link in the email.</li>
                <li>Return here and click <strong className="text-zinc-300">Check Verification Status</strong> to unlock your account.</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              {/* Check Status Button */}
              <button
                type="button"
                onClick={handleCheckStatus}
                disabled={isCheckingStatus}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
              >
                {isCheckingStatus ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Checking Status...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span>Check Verification Status</span>
                  </>
                )}
              </button>

              {/* Resend Verification Email Button */}
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendCooldown > 0 || isResending}
                className="w-full py-2.5 rounded-xl bg-[#161922] hover:bg-[#202534] border border-[#2A3040] text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C9A227]" />
                    <span>Dispatching Link...</span>
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <Clock className="w-4 h-4 text-[#C9A227]" />
                    <span>Resend Available in {resendCooldown}s</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 text-[#C9A227]" />
                    <span>Resend Verification Email</span>
                  </>
                )}
              </button>
            </div>

            {/* Email Correction / Recovery Path */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  setCurrentRoute('register');
                }}
                className="text-[11px] text-zinc-400 hover:text-[#E4C765] transition-colors underline cursor-pointer"
              >
                Registered with the wrong email? Register again with correct email
              </button>
            </div>
          </div>
        )}

        {/* Footer Navigation Switcher */}
        <div className="pt-2 text-center text-xs text-zinc-500 border-t border-zinc-800/80">
          {view === 'login' && (
            <span>
              Don't have an account yet?{' '}
              <button
                onClick={() => setCurrentRoute('register')}
                className="text-[#E4C765] hover:underline cursor-pointer font-semibold ml-1"
              >
                Register here
              </button>
            </span>
          )}
          {(view === 'register' || view === 'forgot-password' || view === 'verify-email') && (
            <span>
              Already registered?{' '}
              <button
                onClick={() => setCurrentRoute('login')}
                className="text-[#E4C765] hover:underline cursor-pointer font-semibold ml-1"
              >
                Log in here
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
