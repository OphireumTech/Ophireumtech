/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM High-Security Access Denied Component
 */

import React from 'react';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

interface AccessDeniedProps {
  requiredRole?: string;
  currentRole?: string;
  reason?: string;
  returnPath?: string;
}

export const AccessDeniedPage: React.FC<AccessDeniedProps> = ({
  requiredRole = 'privileged staff',
  currentRole,
  reason = 'Your credentials do not possess the cryptographic permissions required to view this system module.',
  returnPath = '/'
}) => {
  const { currentUser } = useApp();
  const effectiveRole = currentRole || currentUser?.role || 'visitor';

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-[#0D0F15] border border-[#2B354C] rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-rose-500/50 blur-sm"></div>

        <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-600/40 flex items-center justify-center mx-auto text-rose-400 mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/40 border border-rose-800/40 text-rose-300 text-[11px] font-mono font-medium mb-3">
          <Lock className="w-3 h-3" />
          <span>HTTP 403: RBAC AUTHORIZATION BREACH PREVENTED</span>
        </div>

        <h2 className="text-xl font-bold text-white mb-2 font-display">
          Access Denied
        </h2>

        <p className="text-xs text-zinc-400 leading-relaxed mb-6">
          {reason}
        </p>

        <div className="bg-[#141824] rounded-xl p-3 border border-[#2B354C]/60 text-left mb-6 space-y-1.5 text-xs font-mono">
          <div className="flex justify-between text-zinc-400">
            <span>Current Role:</span>
            <span className="text-[#E4C765] font-bold uppercase">{effectiveRole}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Required Authority:</span>
            <span className="text-rose-400 font-bold uppercase">{requiredRole}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Identity Ref:</span>
            <span className="text-zinc-300 truncate max-w-[180px]">{currentUser?.email || 'Unauthenticated'}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={returnPath}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#1A1F2C] hover:bg-[#252C3D] border border-[#2B354C] text-zinc-200 text-xs font-bold transition-colors inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous Page
          </Link>
          <Link
            to="/"
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#E4C765] text-black text-xs font-bold transition-colors inline-flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            Platform Home
          </Link>
        </div>
      </div>
    </div>
  );
};
