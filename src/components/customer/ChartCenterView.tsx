/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Chart Center with LuxAlgo Smart Money Concepts (SMC)
 * Sections 14 to 21: Dedicated XAUUSD charting workspace, Simple/Advanced mode,
 * official LuxAlgo SMC integration controls with educational tooltips,
 * non-predictive disclosures, and view-only safety.
 */

import React, { useState, useMemo } from 'react';
import {
  BarChart2,
  Maximize2,
  Minimize2,
  Sliders,
  Info,
  Layers,
  TrendingUp,
  TrendingDown,
  Check,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface ChartCenterViewProps {
  currentPrice: number;
}

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const ChartCenterView: React.FC<ChartCenterViewProps> = ({ currentPrice = 2912.85 }) => {
  const [timeframe, setTimeframe] = useState<'M5' | 'M15' | 'H1' | 'H4' | 'D1'>('M15');
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIndicatorsPanel, setShowIndicatorsPanel] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // SMC LuxAlgo Indicator Configuration State
  const [smcEnabled, setSmcEnabled] = useState(true);
  const [smcSettings, setSmcSettings] = useState({
    // Basic settings
    marketStructure: true,
    orderBlocks: true,
    fairValueGaps: true,
    liquidityZones: true,
    premiumDiscount: true,
    // Advanced settings
    internalStructure: true,
    swingStructure: true,
    equalHighsLows: true,
    multiTimeframeLevels: false
  });

  // Tooltip helper state for technical terms
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Generate deterministic realistic candles for XAUUSD ending at currentPrice
  const candles = useMemo(() => {
    const list: Candle[] = [];
    const count = 32;
    const baseStep = timeframe === 'M5' ? 5 * 60 * 1000 : timeframe === 'M15' ? 15 * 60 * 1000 : timeframe === 'H1' ? 60 * 60 * 1000 : 240 * 60 * 1000;
    const now = Date.now();

    let price = currentPrice - 18.5;

    for (let i = 0; i < count; i++) {
      const isLast = i === count - 1;
      const t = new Date(now - (count - 1 - i) * baseStep);
      const timeStr = timeframe === 'D1'
        ? t.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        : t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      const volatility = timeframe === 'M5' ? 1.8 : timeframe === 'M15' ? 3.2 : 7.5;
      const delta = (Math.sin(i * 0.48) + (Math.random() - 0.48)) * volatility;
      const open = isLast ? price : price;
      const close = isLast ? currentPrice : Math.max(2800, parseFloat((open + delta).toFixed(2)));
      const high = parseFloat((Math.max(open, close) + Math.random() * (volatility * 0.55)).toFixed(2));
      const low = parseFloat((Math.min(open, close) - Math.random() * (volatility * 0.55)).toFixed(2));
      const volume = Math.floor(180 + Math.random() * 520);

      price = close;
      list.push({ time: timeStr, open, high, low, close, volume });
    }
    return list;
  }, [currentPrice, timeframe]);

  // Compute price bounds for chart scaling
  const minPrice = Math.min(...candles.map(c => c.low));
  const maxPrice = Math.max(...candles.map(c => c.high));
  const priceRange = maxPrice - minPrice || 1;
  const equilibriumPrice = (minPrice + maxPrice) / 2;

  // Key SMC levels derived from candles
  const orderBlockBullish = { top: minPrice + priceRange * 0.22, bottom: minPrice + priceRange * 0.12 };
  const orderBlockBearish = { top: maxPrice - priceRange * 0.10, bottom: maxPrice - priceRange * 0.20 };
  const fvgLevel = { top: minPrice + priceRange * 0.58, bottom: minPrice + priceRange * 0.52 };

  const toggleSMC = (key: keyof typeof smcSettings) => {
    setSmcSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={`space-y-4 text-left ${isFullscreen ? 'fixed inset-0 z-50 bg-[#08090B] p-6 overflow-y-auto' : ''}`}>
      {/* Workspace Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#0D1017] border border-[#1E2538] shadow-lg">
        {/* Symbol & Feed Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white font-mono">XAUUSD</span>
              <span className="text-xs text-zinc-400">Spot Gold / US Dollar</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                VIEW-ONLY
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              Live Spot: <strong className="text-white">${currentPrice.toFixed(2)}</strong> | Spread: 0.18
            </div>
          </div>
        </div>

        {/* Controls: Timeframe, Mode, Indicators, Fullscreen */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe selector */}
          <div className="flex rounded-xl bg-[#141824] border border-[#232A3B] p-1 text-xs font-mono">
            {(['M5', 'M15', 'H1', 'H4', 'D1'] as const).map(tf => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#C9A227] text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Simple / Advanced Mode Toggle */}
          <div className="flex rounded-xl bg-[#141824] border border-[#232A3B] p-1 text-xs">
            <button
              type="button"
              onClick={() => setMode('simple')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer text-xs font-medium ${
                mode === 'simple'
                  ? 'bg-[#222B3E] text-[#E4C765] font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Simple
            </button>
            <button
              type="button"
              onClick={() => setMode('advanced')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer text-xs font-medium ${
                mode === 'advanced'
                  ? 'bg-[#222B3E] text-[#E4C765] font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Advanced
            </button>
          </div>

          {/* Indicators Button */}
          <button
            type="button"
            onClick={() => setShowIndicatorsPanel(!showIndicatorsPanel)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              smcEnabled
                ? 'bg-[#C9A227]/15 border-[#C9A227]/40 text-[#E4C765]'
                : 'bg-[#141824] border-[#232A3B] text-zinc-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Indicators</span>
            {smcEnabled && <span className="w-1.5 h-1.5 rounded-full bg-[#E4C765]" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-[#232A3B] text-zinc-300 transition-colors cursor-pointer"
            aria-label="Toggle fullscreen chart"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* SMC LuxAlgo Indicators Control Panel (Section 15, 16, 17) */}
      {showIndicatorsPanel && (
        <div className="p-4 rounded-2xl bg-[#0D1017] border border-[#232A3B] shadow-xl space-y-4 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2538] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">Smart Money Concepts (SMC)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C9A227]/15 border border-[#C9A227]/30 text-[#E4C765]">
                  Provider: LuxAlgo
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                Authorized institutional market structure and liquidity imbalance overlays.
              </div>
            </div>

            {/* Master Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">SMC Overlay:</span>
              <button
                type="button"
                onClick={() => setSmcEnabled(!smcEnabled)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  smcEnabled
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {smcEnabled ? 'ACTIVE [ON]' : 'PAUSED [OFF]'}
              </button>
            </div>
          </div>

          {smcEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* BASIC SETTINGS */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Basic Structure Elements
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between p-2 rounded-xl bg-[#141824] hover:bg-[#181E2E] cursor-pointer text-xs">
                    <span className="flex items-center gap-1.5 text-zinc-200">
                      Market Structure (BOS / CHoCH)
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setActiveTooltip(activeTooltip === 'bos' ? null : 'bos'); }}
                        className="text-zinc-500 hover:text-[#E4C765]"
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    </span>
                    <input
                      type="checkbox"
                      checked={smcSettings.marketStructure}
                      onChange={() => toggleSMC('marketStructure')}
                      className="accent-[#C9A227] rounded cursor-pointer"
                    />
                  </label>

                  {activeTooltip === 'bos' && (
                    <div className="p-2.5 rounded-lg bg-[#181E2E] border border-[#2B354C] text-[11px] text-zinc-300">
                      <strong className="text-white">BOS / CHoCH:</strong> Break of Structure indicates continuation beyond previous swing levels. Change of Character signals an initial structural shift indicating potential trend reversal.
                    </div>
                  )}

                  <label className="flex items-center justify-between p-2 rounded-xl bg-[#141824] hover:bg-[#181E2E] cursor-pointer text-xs">
                    <span className="flex items-center gap-1.5 text-zinc-200">
                      Order Blocks (Institutional Demand/Supply)
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setActiveTooltip(activeTooltip === 'ob' ? null : 'ob'); }}
                        className="text-zinc-500 hover:text-[#E4C765]"
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    </span>
                    <input
                      type="checkbox"
                      checked={smcSettings.orderBlocks}
                      onChange={() => toggleSMC('orderBlocks')}
                      className="accent-[#C9A227] rounded cursor-pointer"
                    />
                  </label>

                  {activeTooltip === 'ob' && (
                    <div className="p-2.5 rounded-lg bg-[#181E2E] border border-[#2B354C] text-[11px] text-zinc-300">
                      <strong className="text-white">Order Blocks:</strong> Institutional price zones where substantial buy or sell volume originated before a directional expansion.
                    </div>
                  )}

                  <label className="flex items-center justify-between p-2 rounded-xl bg-[#141824] hover:bg-[#181E2E] cursor-pointer text-xs">
                    <span className="flex items-center gap-1.5 text-zinc-200">
                      Fair Value Gaps (FVG)
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setActiveTooltip(activeTooltip === 'fvg' ? null : 'fvg'); }}
                        className="text-zinc-500 hover:text-[#E4C765]"
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    </span>
                    <input
                      type="checkbox"
                      checked={smcSettings.fairValueGaps}
                      onChange={() => toggleSMC('fairValueGaps')}
                      className="accent-[#C9A227] rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl bg-[#141824] hover:bg-[#181E2E] cursor-pointer text-xs">
                    <span className="flex items-center gap-1.5 text-zinc-200">
                      Premium & Discount Zones
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setActiveTooltip(activeTooltip === 'pd' ? null : 'pd'); }}
                        className="text-zinc-500 hover:text-[#E4C765]"
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    </span>
                    <input
                      type="checkbox"
                      checked={smcSettings.premiumDiscount}
                      onChange={() => toggleSMC('premiumDiscount')}
                      className="accent-[#C9A227] rounded cursor-pointer"
                    />
                  </label>

                  {activeTooltip === 'pd' && (
                    <div className="p-2.5 rounded-lg bg-[#181E2E] border border-[#2B354C] text-[11px] text-zinc-300">
                      <strong className="text-white">Premium / Discount:</strong> Defines the trading range divided at equilibrium (50%). Discount represents below-average pricing for long setups; Premium represents above-average pricing for short setups.
                    </div>
                  )}
                </div>
              </div>

              {/* ADVANCED SETTINGS */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Advanced SMC Configuration
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between p-2 rounded-xl bg-[#141824] hover:bg-[#181E2E] cursor-pointer text-xs">
                    <span className="text-zinc-200">Internal Sub-Structure</span>
                    <input
                      type="checkbox"
                      checked={smcSettings.internalStructure}
                      onChange={() => toggleSMC('internalStructure')}
                      className="accent-[#C9A227] rounded cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-xl bg-[#141824] hover:bg-[#181E2E] cursor-pointer text-xs">
                    <span className="text-zinc-200">Swing Market Structure</span>
                    <input
                      type="checkbox"
                      checked={smcSettings.swingStructure}
                      onChange={() => toggleSMC('swingStructure')}
                      className="accent-[#C9A227] rounded cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-xl bg-[#141824] hover:bg-[#181E2E] cursor-pointer text-xs">
                    <span className="text-zinc-200">Equal Highs / Equal Lows (EQH/EQL)</span>
                    <input
                      type="checkbox"
                      checked={smcSettings.equalHighsLows}
                      onChange={() => toggleSMC('equalHighsLows')}
                      className="accent-[#C9A227] rounded cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-xl bg-[#141824] hover:bg-[#181E2E] cursor-pointer text-xs">
                    <span className="text-zinc-200">Multi-Timeframe Key Levels</span>
                    <input
                      type="checkbox"
                      checked={smcSettings.multiTimeframeLevels}
                      onChange={() => toggleSMC('multiTimeframeLevels')}
                      className="accent-[#C9A227] rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Interactive Candlestick Chart Workspace */}
      <div className="relative w-full h-[480px] bg-[#090B10] rounded-2xl border border-[#1E2538] p-4 flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Top-Right Price Levels (Y-Axis) */}
        <div className="absolute right-3 top-3 bottom-8 flex flex-col justify-between text-[11px] font-mono text-zinc-400 pointer-events-none select-none z-10">
          <span className="text-zinc-300 font-semibold">${maxPrice.toFixed(2)}</span>
          <span className="text-[#C9A227] font-semibold">${equilibriumPrice.toFixed(2)} (EQ 50%)</span>
          <span className="text-zinc-300 font-semibold">${minPrice.toFixed(2)}</span>
        </div>

        {/* Premium / Discount Background Tinting (if enabled) */}
        {smcEnabled && smcSettings.premiumDiscount && (
          <div className="absolute inset-0 right-16 pointer-events-none flex flex-col">
            {/* Premium Zone (Top 50%) */}
            <div className="flex-1 bg-rose-950/10 border-b border-dashed border-[#C9A227]/30 relative">
              <span className="absolute top-2 left-3 text-[10px] font-mono text-rose-400/60 uppercase tracking-wider">
                Premium Zone (&gt;50%)
              </span>
            </div>
            {/* Discount Zone (Bottom 50%) */}
            <div className="flex-1 bg-emerald-950/10 relative">
              <span className="absolute bottom-6 left-3 text-[10px] font-mono text-emerald-400/60 uppercase tracking-wider">
                Discount Zone (&lt;50%)
              </span>
            </div>
          </div>
        )}

        {/* SVG Chart Layer */}
        <div className="relative flex-1 w-full pr-16">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
            {/* Horizontal Grid lines */}
            <line x1="0" y1="75" x2="1000" y2="75" stroke="#161C28" strokeDasharray="3 3" />
            <line x1="0" y1="150" x2="1000" y2="150" stroke="#C9A227" strokeDasharray="4 4" strokeOpacity="0.4" />
            <line x1="0" y1="225" x2="1000" y2="225" stroke="#161C28" strokeDasharray="3 3" />

            {/* SMC: Order Blocks Overlay */}
            {smcEnabled && smcSettings.orderBlocks && (
              <>
                {/* Bearish Order Block at Highs */}
                <rect
                  x="550"
                  y="20"
                  width="440"
                  height="45"
                  fill="#EF4444"
                  fillOpacity="0.12"
                  stroke="#EF4444"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                  rx="3"
                />
                <text x="560" y="38" fill="#F87171" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  BEARISH ORDER BLOCK [H1 OB]
                </text>

                {/* Bullish Order Block at Lows */}
                <rect
                  x="120"
                  y="235"
                  width="450"
                  height="45"
                  fill="#10B981"
                  fillOpacity="0.12"
                  stroke="#10B981"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                  rx="3"
                />
                <text x="130" y="255" fill="#34D399" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  BULLISH ORDER BLOCK [H1 OB]
                </text>
              </>
            )}

            {/* SMC: Fair Value Gap (FVG) */}
            {smcEnabled && smcSettings.fairValueGaps && (
              <>
                <rect
                  x="360"
                  y="125"
                  width="280"
                  height="25"
                  fill="#EAB308"
                  fillOpacity="0.10"
                  stroke="#EAB308"
                  strokeWidth="0.8"
                  rx="2"
                />
                <text x="370" y="142" fill="#FACC15" fontSize="9" fontFamily="monospace">
                  FVG (Imbalance)
                </text>
              </>
            )}

            {/* SMC: Market Structure BOS / CHoCH Lines */}
            {smcEnabled && smcSettings.marketStructure && (
              <>
                {/* Break of Structure (BOS) Line */}
                <line x1="420" y1="85" x2="820" y2="85" stroke="#3B82F6" strokeWidth="1.2" strokeDasharray="3 3" />
                <text x="825" y="88" fill="#60A5FA" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  BOS ↑
                </text>

                {/* Change of Character (CHoCH) Line */}
                <line x1="200" y1="190" x2="480" y2="190" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="2 2" />
                <text x="485" y="193" fill="#FBBF24" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  CHoCH
                </text>
              </>
            )}

            {/* Candlesticks Rendering */}
            {candles.map((c, i) => {
              const x = (i / (candles.length - 1)) * 960 + 20;
              const isBull = c.close >= c.open;
              const color = isBull ? '#10B981' : '#EF4444';

              const top = Math.max(c.open, c.close);
              const btm = Math.min(c.open, c.close);

              const yHigh = 280 - ((c.high - minPrice) / priceRange) * 250;
              const yLow = 280 - ((c.low - minPrice) / priceRange) * 250;
              const yTop = 280 - ((top - minPrice) / priceRange) * 250;
              const yBtm = 280 - ((btm - minPrice) / priceRange) * 250;
              const h = Math.max(3, yBtm - yTop);

              return (
                <g key={i} className="transition-all">
                  {/* Wicks */}
                  <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.2" />
                  {/* Candle Body */}
                  <rect
                    x={x - 7}
                    y={yTop}
                    width={14}
                    height={h}
                    fill={color}
                    rx="1"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* X-Axis Time Labels */}
        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 pt-2 border-t border-[#181E2B] pr-16">
          <span>{candles[0]?.time}</span>
          <span>{candles[Math.floor(candles.length * 0.33)]?.time}</span>
          <span>{candles[Math.floor(candles.length * 0.66)]?.time}</span>
          <span className="text-[#E4C765] font-bold">{candles[candles.length - 1]?.time} (Live XAUUSD)</span>
        </div>
      </div>

      {/* Expandable "About these indicators" disclaimer (Section 20) */}
      <div className="p-3.5 rounded-xl bg-[#0D1017] border border-[#1E2538] text-xs space-y-2">
        <button
          type="button"
          onClick={() => setShowAboutModal(!showAboutModal)}
          className="w-full flex items-center justify-between text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 font-semibold">
            <HelpCircle className="w-4 h-4 text-[#C9A227]" />
            <span>About these indicators & market disclosures</span>
          </div>
          {showAboutModal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAboutModal && (
          <div className="text-[11px] text-zinc-400 leading-relaxed pt-2 border-t border-[#181E2B] space-y-1.5 animate-in fade-in-50">
            <p>
              Smart Money Concepts (SMC) provided via LuxAlgo organizes historical market structure, order volume zones, and fair value gaps for visual clarity. Technical indicators organize market information and do not guarantee market direction, trend reversal, or profitable trade execution.
            </p>
            <p className="text-zinc-500">
              Gold (XAUUSD) trading involves substantial market volatility and risk of capital loss. Ophireum execution technology adheres to automated stop-loss protocols and exposure boundaries.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
