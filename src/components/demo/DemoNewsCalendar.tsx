/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM SIMULATED ECONOMIC CALENDAR & HIGH-IMPACT NEWS REMINDERS
 * Sections 85 & 86: Simulated market event feed with countdown timers and institutional gold volatility analysis.
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Bell, Clock, AlertTriangle, Globe, ChevronRight, Check } from 'lucide-react';
import { DemoMarketEvent } from '../../types/demo';
import { demoEngine } from '../../services/demoEngine';

interface DemoNewsCalendarProps {
  events?: DemoMarketEvent[];
  news?: DemoMarketEvent[];
  currentPrice?: number;
  addToast?: (title: string, msg: string, type: 'info' | 'success' | 'warning' | 'critical') => void;
}

export const DemoNewsCalendar: React.FC<DemoNewsCalendarProps> = ({ events, news, currentPrice, addToast }) => {
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [reminders, setReminders] = useState<Record<string, string>>({});

  const allEvents = events || news || (demoEngine.getState().news as DemoMarketEvent[]);

  const filteredEvents = allEvents.filter(e => {
    if (filter === 'ALL') return true;
    return e.impact === filter;
  });

  const handleSetReminder = (eventId: string, minutes: number) => {
    setReminders(prev => ({
      ...prev,
      [eventId]: `${minutes}m prior`
    }));
    if (addToast) {
      addToast(
        'Simulated News Alert Configured',
        `Reminder primed ${minutes} minutes prior to release for risk protection.`,
        'info'
      );
    }
  };

  return (
    <div className="bg-[#0D1017] border border-[#232A3B] rounded-2xl p-5 sm:p-7 space-y-6 text-left shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E2536] pb-4">
        <div>
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#E4C765] font-bold">
            Sections 85 & 86 • Algorithmic Macro Feed
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
            <span>DEMO MARKET EVENTS & ECONOMIC CALENDAR</span>
            <span className="px-2 py-0.5 rounded bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#E4C765] text-xs font-mono">
              SIMULATED
            </span>
          </h2>
        </div>

        {/* Impact Filter */}
        <div className="flex rounded-xl bg-[#141824] p-1 border border-[#232A3B] text-xs font-mono">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(impact => (
            <button
              key={impact}
              type="button"
              onClick={() => setFilter(impact)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === impact
                  ? 'bg-[#C9A227] text-[#08090B] font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {impact}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.map(event => {
          const isHigh = event.impact === 'HIGH';
          const isMedium = event.impact === 'MEDIUM';

          return (
            <div
              key={event.id}
              className="p-4 rounded-xl bg-[#121622] border border-[#1E2536] hover:border-[#2B354C] transition-colors space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#1A2030] flex items-center justify-center font-bold text-xs text-white border border-[#2B354C]">
                    {event.currency}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{event.event}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          isHigh
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : isMedium
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-zinc-700/30 text-zinc-400 border border-zinc-700/50'
                        }`}
                      >
                        {event.impact} IMPACT
                      </span>
                    </h3>
                    <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      Scheduled: {new Date(event.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} GMT | In: <strong className="text-[#E4C765]">{event.countdown || 'Upcoming Today'}</strong>
                    </div>
                  </div>
                </div>

                {/* News Reminder Selector (Section 86) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-zinc-400 font-medium mr-1 hidden sm:inline">News Reminder:</span>
                  {[15, 30, 60].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => handleSetReminder(event.id, mins)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer border ${
                        reminders[event.id] === `${mins}m prior`
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                          : 'bg-[#181D29] text-zinc-300 border-[#2B354C] hover:text-white'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Economic Data Metrics */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-[#090B10] border border-[#181E2B] text-xs font-mono">
                <div>
                  <span className="text-zinc-500 text-[10px]">Forecast:</span>{' '}
                  <span className="text-zinc-300">{event.forecast || '—'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px]">Previous:</span>{' '}
                  <span className="text-zinc-300">{event.previous || '—'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px]">Actual (Sim):</span>{' '}
                  <span className="text-[#E4C765] font-bold">{event.actual || 'Pending'}</span>
                </div>
              </div>

              {/* Gold Volatility Analysis */}
              <div className="text-[11px] text-zinc-400 bg-[#161B28] p-2.5 rounded-lg border border-[#232A3B] leading-relaxed">
                <strong className="text-zinc-300">Potential Gold Relevance:</strong> {event.goldRelevance || event.potentialMarketRelevance}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
