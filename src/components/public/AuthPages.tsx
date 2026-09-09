/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Authentication Views
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Lock, Mail, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthPagesProps {
  view: 'login' | 'register' | 'forgot-password';
}

export const AuthPages: React.FC<AuthPagesProps> = ({ view }) => {
  const { login, registerUser, setCurrentRoute, addToast } = useApp();

  const [email, setEmail] = useState('antonioluna2001@gmail.com');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Antonio Luna');
  const [termsAgreed, setTermsAgreed] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('Error', 'Please provide your email address', 'warning');
      return;
    }
    const ok = login(email);
    if (ok) {
      setCurrentRoute('dashboard');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      addToast('Error', 'Please fill all required fields', 'warning');
      return;
    }
    if (!termsAgreed) {
      addToast('Terms Required', 'You must agree to the Terms of Use and Risk Disclosure.', 'warning');
      return;
    }
    registerUser(fullName, email);
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    login(demoEmail);
    setCurrentRoute('dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-[#E4C765] to-[#C9A227] p-0.5 flex items-center justify-center">
          <div className="w-full h-full bg-[#08090B] rounded-[10px] flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#E4C765]" />
          </div>
        </div>
        <h1 className="text-2xl font-display font-bold text-white">
          {view === 'login' && 'Log In to OPHIREUM'}
          {view === 'register' && 'Create Customer Account'}
          {view === 'forgot-password' && 'Password Recovery'}
        </h1>
        <p className="text-xs text-zinc-400">
          {view === 'login' && 'Enter your verified email to access your licensing portal.'}
          {view === 'register' && 'Deploy disciplined MT5 algorithmic execution.'}
          {view === 'forgot-password' && 'We will send a cryptographically signed recovery link.'}
        </p>
      </div>

      {/* Main Form Box */}
      <div className="bg-[#0D1017] border border-[#1E2330] rounded-2xl p-6 sm:p-8 space-y-5">
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111420] border border-[#232838] rounded-lg pl-9 pr-3 py-2.5 text-zinc-100 focus:border-[#C9A227] outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-zinc-400">Password</label>
                <button
                  type="button"
                  onClick={() => setCurrentRoute('forgot-password')}
                  className="text-[11px] text-[#C9A227] hover:underline cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111420] border border-[#232838] rounded-lg pl-9 pr-3 py-2.5 text-zinc-100 focus:border-[#C9A227] outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-xs tracking-wide shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Access Secure Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Personas */}
            <div className="pt-4 border-t border-zinc-800 space-y-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-500 block">
                Quick Test Login (Demo Environments)
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('antonioluna2001@gmail.com')}
                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded text-left truncate"
                >
                  Customer (Antonio)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('licensing@ophireum.com')}
                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-amber-300 rounded text-left truncate"
                >
                  Licence Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('finance.auditor@ophireum.com')}
                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-emerald-300 rounded text-left truncate"
                >
                  Finance Reviewer
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('dhenzecapital@gmail.com')}
                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-rose-300 rounded text-left truncate"
                >
                  Super Admin (CTO)
                </button>
              </div>
            </div>
          </form>
        )}

        {view === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Full Legal Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#111420] border border-[#232838] rounded-lg pl-9 pr-3 py-2.5 text-zinc-100 focus:border-[#C9A227] outline-none"
                  placeholder="e.g. Antonio Luna"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111420] border border-[#232838] rounded-lg pl-9 pr-3 py-2.5 text-zinc-100 focus:border-[#C9A227] outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111420] border border-[#232838] rounded-lg pl-9 pr-3 py-2.5 text-zinc-100 focus:border-[#C9A227] outline-none"
                  placeholder="Minimum 8 characters"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 rounded bg-zinc-900 border-zinc-700 text-[#C9A227] focus:ring-0"
              />
              <label htmlFor="terms" className="text-[11px] text-zinc-400 leading-tight">
                I understand OPHIREUM is not a broker, and I agree to the <span className="text-zinc-200">Terms of Use</span> and <span className="text-[#E4C765]">Trading Risk Disclosure</span>.
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-xs tracking-wide shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Register Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {view === 'forgot-password' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Registered Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111420] border border-[#232838] rounded-lg p-2.5 text-zinc-100 focus:border-[#C9A227] outline-none"
                placeholder="name@example.com"
              />
            </div>
            <button
              onClick={() => {
                addToast('Reset Dispatched', `Password recovery link dispatched to ${email}`, 'success');
                setCurrentRoute('login');
              }}
              className="w-full py-3 rounded-xl bg-[#C9A227] text-black font-bold text-xs cursor-pointer hover:brightness-110 transition-all"
            >
              Send Password Reset Link
            </button>
          </div>
        )}

        <div className="pt-2 text-center text-xs text-zinc-500">
          {view === 'login' ? (
            <span>
              Don't have an account yet?{' '}
              <button onClick={() => setCurrentRoute('register')} className="text-[#E4C765] hover:underline cursor-pointer font-medium">
                Register here
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button onClick={() => setCurrentRoute('login')} className="text-[#E4C765] hover:underline cursor-pointer font-medium">
                Log in here
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
