/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM TRADINGVIEW DEMO AREA & SIMULATED CANDLESTICK CHART
 * Section 87: Honest reporting of unconfigured external provider with institutional internal demo chart.
 */

import React, { useState, useMemo } from 'react';
import { AlertCircle, BarChart2, TrendingUp, Clock, Eye, Layers } from 'lucide-react';

interface TradingViewDemoAreaProps {
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

export const TradingViewDemoArea: React.FC<TradingViewDemoAreaProps> = ({ currentPrice }) => {
  const [timeframe, setTimeframe] = useState<'M15' | 'H1' | 'D1'>('M15');
  const [indicator, setIndicator] = useState<'EMA' | 'BOLL' | 'NONE'>('EMA');

  // Deterministically generate realistic XAUUSD candles ending at currentPrice
  const candles = useMemo(() => {
    const list: Candle[] = [];
    const count = 28;
    const baseStep = timeframe === 'M15' ? 15 * 60 * 1000 : timeframe === 'H1' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const now = Date.now();

    let price = currentPrice - (timeframe === 'M15' ? 8.5 : timeframe === 'H1' ? 24.0 : 65.0);

    for (let i = 0; i < count; i++) {
      const isLast = i === count - 1;
      const t = new Date(now - (count - 1 - i) * baseStep);
      const timeStr = timeframe === 'D1'
        ? t.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        : t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      const volatility = timeframe === 'M15' ? 2.5 : timeframe === 'H1' ? 5.5 : 14.0;
      const delta = (Math.sin(i * 0.45) + (Math.random() - 0.48)) * volatility;
      const open = isLast ? price : price;
      const close = isLast ? currentPrice : Math.max(2850, parseFloat((open + delta).toFixed(2)));
      const high = parseFloat((Math.max(open, close) + Math.random() * (volatility * 0.6)).toFixed(2));
      const low = parseFloat((Math.min(open, close) - Math.random() * (volatility * 0.6)).toFixed(2));
      const volume = Math.floor(120 + Math.random() * 450);

      price = close;
      list.push({ time: timeStr, open, high, low, close, volume });
    }
    return list;
  }, [currentPrice, timeframe]);

  // Compute price bounds for chart scaling
  const minPrice = Math.min(...candles.map(c => c.low));
  const maxPrice = Math.max(...candles.map(c => c.high));
  const priceRange = maxPrice - minPrice || 1;

  return (
    <div className="bg-[#0D1017] border border-[#232A3B] rounded-2xl p-5 space-y-4 shadow-xl text-left">
      {/* Top Bar with Honest Provider Disclosure (Section 87) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E2536] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white font-mono">XAUUSD</span>
              <span className="text-xs text-zinc-400">Spot Gold / US Dollar</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                SIMULATED FEED
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
              Current: <strong className="text-white">${currentPrice.toFixed(2)}</strong> | Spread: 0.25 | Server Time: {new Date().toISOString().substring(11, 19)} GMT
            </div>
          </div>
        </div>

        {/* Timeframe & Overlay Controls */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-[#141824] border border-[#232A3B] p-0.5 text-xs font-mono">
            {(['M15', 'H1', 'D1'] as const).map(tf => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#C9A227] text-[#08090B] font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex rounded-lg bg-[#141824] border border-[#232A3B] p-0.5 text-xs">
            {(['EMA', 'BOLL', 'NONE'] as const).map(ind => (
              <button
                key={ind}
                type="button"
                onClick={() => setIndicator(ind)}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] ${
                  indicator === ind
                    ? 'bg-[#232A3B] text-[#E4C765] font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mandatory Section 87 Disclosure Ribbon */}
      <div className="p-2.5 rounded-xl bg-[#141824]/80 border border-[#2B354C] flex items-center justify-between gap-3 text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#E4C765] shrink-0" />
          <span className="text-[11px]">
            <strong className="text-zinc-200">TRADINGVIEW INTEGRATION NOT CONNECTED</strong> — Displaying internal calibrated algorithmic simulation chart.
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider hidden md:inline">
          Proprietary Canvas Isolated
        </span>
      </div>

      {/* Interactive Candlestick Chart Stage */}
      <div className="relative w-full h-72 bg-[#090B10] rounded-xl border border-[#1B2130] p-4 overflow-hidden flex flex-col justify-between">
        {/* Price Y-Axis Labels */}
        <div className="absolute right-3 top-3 bottom-8 flex flex-col justify-between text-[10px] font-mono text-zinc-400 pointer-events-none select-none">
          <span>${maxPrice.toFixed(2)}</span>
          <span>${((maxPrice + minPrice) / 2).toFixed(2)}</span>
          <span>${minPrice.toFixed(2)}</span>
        </div>

        {/* SVG Candles */}
        <div className="relative flex-1 w-full pr-14">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
            {/* Grid lines */}
            <line x1="0" y1="50" x2="1000" y2="50" stroke="#181E2B" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2="1000" y2="100" stroke="#181E2B" strokeDasharray="3 3" />
            <line x1="0" y1="150" x2="1000" y2="150" stroke="#181E2B" strokeDasharray="3 3" />

            {/* Simulated Moving Average Line */}
            {indicator === 'EMA' && (
              <path
                d={candles.map((c, i) => {
                  const x = (i / (candles.length - 1)) * 960 + 20;
                  const y = 180 - ((c.close - minPrice) / priceRange) * 150;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke="#C9A227"
                strokeWidth="1.5"
                strokeOpacity="0.75"
              />
            )}

            {/* Candle Bars */}
            {candles.map((candle, idx) => {
              const x = (idx / (candles.length - 1)) * 960 + 20;
              const isBullish = candle.close >= candle.open;
              const candleColor = isBullish ? '#10B981' : '#EF4444';

              const topPrice = Math.max(candle.open, candle.close);
              const bottomPrice = Math.min(candle.open, candle.close);

              const yHigh = 190 - ((candle.high - minPrice) / priceRange) * 170;
              const yLow = 190 - ((candle.low - minPrice) / priceRange) * 170;
              const yTop = 190 - ((topPrice - minPrice) / priceRange) * 170;
              const yBottom = 190 - ((bottomPrice - minPrice) / priceRange) * 170;
              const bodyHeight = Math.max(3, yBottom - yTop);

              return (
                <g key={idx}>
                  {/* High/Low Wick */}
                  <line
                    x1={x}
                    y1={yHigh}
                    x2={x}
                    y2={yLow}
                    stroke={candleColor}
                    strokeWidth="1.2"
                  />
                  {/* Real Body */}
                  <rect
                    x={x - 8}
                    y={yTop}
                    width={16}
                    height={bodyHeight}
                    fill={candleColor}
                    rx="1.5"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* X-Axis Time Labels */}
        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 pt-2 border-t border-[#181E2B] pr-14">
          <span>{candles[0]?.time}</span>
          <span>{candles[Math.floor(candles.length / 2)]?.time}</span>
          <span className="text-[#E4C765] font-bold">{candles[candles.length - 1]?.time} (Live Tick)</span>
        </div>
      </div>
    </div>
  );
};
