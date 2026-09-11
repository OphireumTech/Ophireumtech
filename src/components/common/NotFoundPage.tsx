/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM 404 Not Found View
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, LifeBuoy } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="flex justify-center">
        <BrandLogo size="lg" showText={false} asLink={false} />
      </div>

      <div className="space-y-2">
        <div className="text-xs uppercase font-bold tracking-widest text-[#C9A227]">
          HTTP 404 • Resource Not Found
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
          Requested Page Unavailable
        </h1>
        <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
          The requested path does not exist on the OPHIREUM platform or has been relocated.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-xs flex items-center gap-2 hover:brightness-110 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          to="/help-center"
          className="px-5 py-2.5 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-[#2B354C] text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <LifeBuoy className="w-4 h-4 text-[#E4C765]" />
          <span>Visit Help Center</span>
        </Link>
      </div>
    </div>
  );
};
