/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Official Reusable Brand Logo Component
 */

import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  showText?: boolean;
  iconOnlyOnMobile?: boolean;
  subtitle?: string;
  to?: string;
  asLink?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  iconOnlyOnMobile = false,
  subtitle = 'EXPERT ASSISTANT',
  to = '/',
  asLink = true,
  className = '',
  onClick
}) => {
  // Determine pixel sizes
  let iconSizeDesktop = 44;
  let iconSizeMobile = 36;
  let containerPadding = 'p-1.5';
  let titleSize = 'text-base sm:text-lg';
  let subtitleSize = 'text-[9px] sm:text-[10px]';

  if (typeof size === 'number') {
    iconSizeDesktop = size;
    iconSizeMobile = Math.max(28, Math.round(size * 0.82));
  } else {
    switch (size) {
      case 'sm':
        iconSizeDesktop = 34;
        iconSizeMobile = 30;
        containerPadding = 'p-1';
        titleSize = 'text-sm';
        subtitleSize = 'text-[8px]';
        break;
      case 'lg':
        iconSizeDesktop = 56;
        iconSizeMobile = 46;
        containerPadding = 'p-2';
        titleSize = 'text-xl sm:text-2xl';
        subtitleSize = 'text-[11px]';
        break;
      case 'xl':
        iconSizeDesktop = 72;
        iconSizeMobile = 56;
        containerPadding = 'p-2.5';
        titleSize = 'text-2xl sm:text-3xl';
        subtitleSize = 'text-xs';
        break;
      case 'md':
      default:
        iconSizeDesktop = 44;
        iconSizeMobile = 36;
        containerPadding = 'p-1.5';
        titleSize = 'text-base sm:text-lg';
        subtitleSize = 'text-[9px] sm:text-[10px]';
        break;
    }
  }

  // Base URL safe image path for GitHub Pages and Custom Domains
  const logoSrc = `${import.meta.env.BASE_URL}images/ophireum-logo.png`;

  const content = (
    <>
      <span
        className={`brand-logo-container inline-flex items-center justify-center ${containerPadding} border border-[#D4AF37]/30 rounded-xl bg-[#07090D]/90 shadow-[0_2px_12px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:border-[#D4AF37]/60 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] flex-shrink-0`}
      >
        <img
          src={logoSrc}
          alt="Ophireum Expert Assistant"
          className="brand-logo object-contain flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
          style={{
            width: `var(--logo-size, ${iconSizeDesktop}px)`,
            height: `var(--logo-size, ${iconSizeDesktop}px)`,
            filter:
              'drop-shadow(0 0 1px rgba(255, 232, 160, 0.65)) drop-shadow(0 4px 12px rgba(212, 175, 55, 0.18))'
          }}
          loading="eager"
        />
      </span>

      {showText && (
        <span
          className={`brand-copy flex flex-col justify-center leading-none select-none ${
            iconOnlyOnMobile ? 'hidden sm:flex' : 'flex'
          }`}
        >
          <span
            className={`brand-name font-cinzel font-bold text-[#F5D77A] tracking-[0.14em] ${titleSize} transition-colors duration-200 group-hover:text-[#FFF4D0]`}
          >
            OPHIREUM
          </span>
          <span
            className={`brand-subtitle font-mono text-[#A7ADB7] ${subtitleSize} tracking-[0.18em] uppercase mt-1 font-medium`}
          >
            {subtitle}
          </span>
        </span>
      )}
    </>
  );

  const containerStyle = {
    '--logo-size': `${iconSizeDesktop}px`
  } as React.CSSProperties;

  if (asLink) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`brand-link inline-flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60 rounded-xl transition-opacity hover:opacity-95 ${className}`}
        aria-label="Ophireum Expert Assistant home"
        style={containerStyle}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`brand-link inline-flex items-center gap-2.5 sm:gap-3 ${className}`}
      style={containerStyle}
    >
      {content}
    </div>
  );
};
