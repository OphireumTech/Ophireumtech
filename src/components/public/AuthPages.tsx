/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Authentication Views: Login, Register, Password Recovery, Email Verification
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Lock, Mail, User, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthPagesProps {
  view: 'login' | 'register' | 'forgot-password' | 'verify-email';
}

export const AuthPages: React.FC<AuthPagesProps> = ({ view }) => {
  const {
    login,
    registerUser,
    setCurrentRoute,
    addToast,
    sendPasswordReset,
    sendVerificationEmail,
    currentUser
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

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
    const cleanEmail = email.trim();

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
      const ok = await registerUser(cleanName, cleanEmail, password);
      if (ok) {
        setCurrentRoute('dashboard');
      }
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
    setIsSubmitting(true);
    try {
      await sendVerificationEmail();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-[#E4C765] to-[#C9A227] p-0.5 flex items-center justify-center shadow-lg shadow-[#C9A227]/10">
          <div className="w-full h-full bg-[#08090B] rounded-[10px] flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#E4C765]" />
          </div>
        </div>
        <h1 className="text-2xl font-display font-bold text-white">
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
            <div className="w-12 h-12 mx-auto rounded-full bg-[#181C26] border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white">Email Verification Required</h2>
              <p className="text-zinc-400 text-xs">
                A verification email was sent to your registered address:
              </p>
              <div className="font-semibold text-[#E4C765] text-sm py-1">
                {currentUser?.email || 'your registered email'}
              </div>
            </div>

            <div className="pt-3 space-y-2">
              <button
                onClick={handleResendVerification}
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-[#161922] hover:bg-[#202534] border border-[#2A3040] text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#C9A227]" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-[#C9A227]" />
                )}
                <span>Resend Verification Email</span>
              </button>
              <button
                onClick={() => setCurrentRoute('dashboard')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-xs transition-all cursor-pointer"
              >
                Continue to Dashboard
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
