/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM ASSISTANT - CLEAN MINIMALIST MESSAGE RENDERER
 * Formats research briefings, market intelligence, and conversational responses
 * into an ultra-clean, neat, simple, and minimalist institutional layout.
 * Completely strips raw asterisks (*), markdown hashes (###), and formatting clutter.
 */

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  ShieldAlert,
  Clock,
  Compass,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';

interface CleanMessageRendererProps {
  content: string;
  isStreaming?: boolean;
  theme?: 'dark' | 'light';
}

/**
 * Strips all markdown asterisks, hashes, and symbols to produce clean plain text.
 */
export function cleanPlainText(text: string): string {
  if (!text) return '';
  return text
    .replace(/^#{1,6}\s+/gm, '') // Remove heading hashes
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
    .replace(/\*(.*?)\*/g, '$1') // Remove *italic*
    .replace(/_{1,2}(.*?)_{1,2}/g, '$1') // Remove underscores
    .replace(/^\s*[-*•]\s+/gm, '• ') // Normalize bullets
    .replace(/\*/g, '') // Remove any stray asterisks
    .trim();
}

/**
 * Helper to render inline text with clean bolding (zero asterisks).
 */
function renderInlineText(rawText: string, isLight: boolean): React.ReactNode {
  if (!rawText) return null;

  // Clean any leading dashes or stray asterisks
  let cleaned = rawText.replace(/^\s*[-*•]\s*/, '').trim();

  // Pattern to match **bold text**
  const boldRegex = /\*\*(.*?)\*\*/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = boldRegex.exec(cleaned)) !== null) {
    if (match.index > lastIndex) {
      const plain = cleaned.substring(lastIndex, match.index).replace(/\*/g, '');
      parts.push(plain);
    }
    const boldText = match[1].replace(/\*/g, '');
    parts.push(
      <strong
        key={`bold-${match.index}`}
        className={`font-semibold ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}
      >
        {boldText}
      </strong>
    );
    lastIndex = boldRegex.lastIndex;
  }

  if (lastIndex < cleaned.length) {
    parts.push(cleaned.substring(lastIndex).replace(/\*/g, ''));
  }

  return parts;
}

interface ParsedSection {
  id: string;
  letter?: string;
  title?: string;
  isMainHeader?: boolean;
  lines: string[];
}

/**
 * Parses raw assistant markdown/text into clean, distinct structured sections.
 */
function parseContentToSections(content: string): { mainTitle: string | null; sections: ParsedSection[] } {
  if (!content) return { mainTitle: null, sections: [] };

  const rawLines = content.split('\n');
  let mainTitle: string | null = null;
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;

  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      // Empty line: add spacer if we are in an active section
      if (currentSection && currentSection.lines.length > 0) {
        // Only push one spacer to avoid massive gaps
        if (currentSection.lines[currentSection.lines.length - 1] !== '') {
          currentSection.lines.push('');
        }
      }
      continue;
    }

    // 1. Check for top-level Main Title (### Title, ## Title, # Title)
    if ((trimmed.startsWith('###') || trimmed.startsWith('##') || trimmed.startsWith('#')) && !mainTitle) {
      mainTitle = trimmed.replace(/^#{1,6}\s*/, '').replace(/\*/g, '').trim();
      continue;
    }

    // 2. Check for A-to-L or standard Section Header:
    // Examples: "**A. Market Summary**", "A. Market Summary", "**B. Current Market Regime**"
    const isAlphabeticalSection = /^(?:#{1,4}\s*)?(?:\*\*)?([A-Z])\.\s+(.+?)(?:\*\*)?:?$/i.exec(trimmed);

    if (isAlphabeticalSection) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const letter = isAlphabeticalSection[1].toUpperCase();
      const title = isAlphabeticalSection[2].replace(/\*/g, '').trim();
      currentSection = {
        id: `sec-${letter}-${i}`,
        letter,
        title,
        lines: []
      };
      continue;
    }

    // 3. Check for any standalone bold heading or markdown heading (e.g. "**Key Areas to Monitor**", "### Technical Outlook", "**Analysis:**")
    const isGenericHeading = /^(?:#{1,4}\s+)?\*\*([^*]+)\*\*:?$/.exec(trimmed) ||
      /^#{1,4}\s+([A-Za-z0-9\s/&—–:-]+)$/.exec(trimmed);

    if (isGenericHeading) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const title = (isGenericHeading[1] || isGenericHeading[0]).replace(/^#{1,4}\s+/, '').replace(/\*/g, '').replace(/:$/, '').trim();
      currentSection = {
        id: `sec-gen-${i}`,
        title,
        lines: []
      };
      continue;
    }

    // If no section is active, create a generic introductory section
    if (!currentSection) {
      currentSection = {
        id: `sec-intro-${i}`,
        lines: []
      };
    }

    currentSection.lines.push(trimmed);
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return { mainTitle, sections };
}

export const CleanMessageRenderer: React.FC<CleanMessageRendererProps> = ({
  content,
  isStreaming = false,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const { mainTitle, sections } = parseContentToSections(content);

  // If no sections were parsed, show simple cleaned inline text
  if (sections.length === 0 && !mainTitle) {
    return (
      <div className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
        {renderInlineText(content, isLight)}
        {isStreaming && (
          <span className="inline-block w-1.5 h-3.5 bg-[#E4C765] ml-1 animate-pulse align-middle" />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5 text-xs sm:text-sm leading-relaxed select-text">
      {/* 1. Main Document Header (Clean, Minimalist, No ### or *) */}
      {mainTitle && (
        <div
          className={`pb-3 border-b flex items-center justify-between ${
            isLight ? 'border-zinc-200' : 'border-zinc-800/80'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-4 rounded-full bg-[#E4C765]" />
            <h2
              className={`text-sm sm:text-base font-semibold tracking-wide ${
                isLight ? 'text-zinc-900' : 'text-white'
              }`}
            >
              {mainTitle}
            </h2>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-mono ${
              isLight
                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                : 'bg-[#C9A227]/10 text-[#E4C765] border border-[#C9A227]/30'
            }`}
          >
            Verified Research
          </span>
        </div>
      )}

      {/* 2. Structured Sections */}
      <div className="space-y-4">
        {sections.map((section, sIdx) => {
          const isKeyAreas = section.title?.toLowerCase().includes('key areas') || section.title?.toLowerCase().includes('monitor');
          const isEconomicEvents = section.title?.toLowerCase().includes('economic events');
          const isBullishDrivers = section.title?.toLowerCase().includes('bullish');
          const isBearishDrivers = section.title?.toLowerCase().includes('bearish');
          const isRiskOrInvalidation = section.title?.toLowerCase().includes('risk') || section.title?.toLowerCase().includes('invalidation');

          return (
            <div
              key={section.id || sIdx}
              className={`group transition-all ${
                section.title ? 'pt-1.5' : ''
              }`}
            >
              {/* Section Header: Clean, Simple, Minimalist (Zero Asterisks) */}
              {section.title && (
                <div className="flex items-center gap-2 mb-2">
                  {section.letter && (
                    <span className="text-[11px] font-bold text-[#E4C765] font-mono w-4 shrink-0">
                      {section.letter}.
                    </span>
                  )}
                  <h3
                    className={`text-xs sm:text-sm font-semibold tracking-wide uppercase ${
                      isLight ? 'text-zinc-800' : 'text-zinc-200'
                    }`}
                  >
                    {section.title}
                  </h3>
                  {isBullishDrivers && (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 opacity-80" />
                  )}
                  {isBearishDrivers && (
                    <TrendingDown className="w-3.5 h-3.5 text-rose-400 opacity-80" />
                  )}
                  {isEconomicEvents && (
                    <Calendar className="w-3.5 h-3.5 text-sky-400 opacity-80" />
                  )}
                  {isRiskOrInvalidation && (
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400 opacity-80" />
                  )}
                </div>
              )}

              {/* Specialized Render: Key Areas to Monitor (Resistance / Support / Pivot as clean cards) */}
              {isKeyAreas && section.lines.some(l => l.includes('Resistance:') || l.includes('Support:') || l.includes('Pivot:')) ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-2">
                  {section.lines.map((line, lIdx) => {
                    const clean = line.replace(/^\s*[-*•]\s*/, '').replace(/\*/g, '').trim();
                    if (!clean) return null;

                    const isRes = clean.toLowerCase().includes('resistance:');
                    const isSup = clean.toLowerCase().includes('support:');
                    const isPiv = clean.toLowerCase().includes('pivot:');

                    if (isRes || isSup || isPiv) {
                      const [label, ...valParts] = clean.split(':');
                      const val = valParts.join(':').trim();
                      return (
                        <div
                          key={lIdx}
                          className={`p-2.5 rounded-lg border text-xs ${
                            isRes
                              ? isLight
                                ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                                : 'bg-[#181318] border-rose-900/40 text-rose-200'
                              : isSup
                              ? isLight
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                                : 'bg-[#121915] border-emerald-900/40 text-emerald-200'
                              : isLight
                              ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                              : 'bg-[#171510] border-[#C9A227]/30 text-amber-200'
                          }`}
                        >
                          <div className="text-[10px] uppercase font-bold tracking-wider opacity-70 mb-0.5">
                            {label}
                          </div>
                          <div className="font-medium">{val}</div>
                        </div>
                      );
                    }

                    return (
                      <div key={lIdx} className="col-span-full text-xs text-zinc-400 py-1">
                        {renderInlineText(clean, isLight)}
                      </div>
                    );
                  })}
                </div>
              ) : isRiskOrInvalidation ? (
                /* Specialized Minimalist Callout for Risk & Invalidation */
                <div
                  className={`p-3 rounded-xl border text-xs sm:text-sm my-1 space-y-1 ${
                    isLight
                      ? 'bg-amber-50/50 border-amber-200/80 text-amber-950'
                      : 'bg-[#15130E] border-[#C9A227]/25 text-zinc-300'
                  }`}
                >
                  {section.lines.map((line, lIdx) => {
                    const clean = line.replace(/^\s*[-*•]\s*/, '').replace(/\*/g, '').trim();
                    if (!clean) return null;
                    return (
                      <div key={lIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E4C765] mt-1.5 shrink-0 opacity-80" />
                        <div className="flex-1 leading-relaxed">
                          {renderInlineText(clean, isLight)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Standard Clean Content List / Paragraphs */
                <div
                  className={`space-y-2 pl-0 sm:pl-3 border-l-0 sm:border-l ${
                    isLight ? 'border-zinc-200 text-zinc-700' : 'border-zinc-800/70 text-zinc-300'
                  }`}
                >
                  {section.lines.map((line, lIdx) => {
                    const isBullet = /^\s*[-*•]\s+/.test(line);
                    const clean = line.replace(/^\s*[-*•]\s*/, '').replace(/\*/g, '').trim();

                    if (!clean) return <div key={lIdx} className="h-1" />;

                    if (isBullet) {
                      return (
                        <div key={lIdx} className="flex items-start gap-2.5 text-xs sm:text-sm py-0.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                              isBullishDrivers
                                ? 'bg-emerald-400'
                                : isBearishDrivers
                                ? 'bg-rose-400'
                                : isEconomicEvents
                                ? 'bg-sky-400'
                                : 'bg-[#E4C765]'
                            }`}
                          />
                          <div className="flex-1 leading-relaxed">
                            {renderInlineText(clean, isLight)}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <p key={lIdx} className="text-xs sm:text-sm leading-relaxed">
                        {renderInlineText(clean, isLight)}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Streaming pulse cursor */}
      {isStreaming && (
        <div className="flex items-center gap-1.5 pt-1 text-[#E4C765] text-xs font-mono">
          <span className="w-1.5 h-3.5 bg-[#E4C765] animate-pulse" />
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Synthesizing...</span>
        </div>
      )}
    </div>
  );
};
