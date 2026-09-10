/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Root Error Boundary
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Shield, AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('OPHIREUM Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.hash = '#/';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#08090B] text-zinc-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0D1017] border border-[#2A3040] rounded-2xl p-6 sm:p-8 space-y-6 text-center shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1C1412] border border-rose-600/40 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <div className="text-xs uppercase font-bold tracking-widest text-[#E4C765]">
                OPHIREUM System Diagnostic
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-white">
                Application Rendering Notice
              </h1>
              <p className="text-xs text-zinc-400 leading-relaxed">
                An unexpected exception was safely caught by the OPHIREUM runtime supervisor.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-[#08090B] p-3 rounded-lg border border-zinc-800 font-mono text-[11px] text-rose-300 break-all max-h-32 overflow-y-auto">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-[#08090B] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#161922] hover:bg-[#202534] border border-[#2B344A] text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
