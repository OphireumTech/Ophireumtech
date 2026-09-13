import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * Filter out benign third-party browser extension issues (e.g. MetaMask inpage injection in sandboxed iframe)
 */
function setupExtensionGuards() {
  const isExtensionError = (err: any): boolean => {
    if (!err) return false;
    const msg = (typeof err === 'string' ? err : err.message || err.reason || '').toString().toLowerCase();
    const stack = (err?.stack || '').toString().toLowerCase();
    return (
      msg.includes('metamask') ||
      msg.includes('failed to connect to metamask') ||
      msg.includes('chrome-extension://') ||
      msg.includes('moz-extension://') ||
      msg.includes('inpage.js') ||
      msg.includes('cannot redefine property: ethereum') ||
      msg.includes('resizeobserver loop') ||
      stack.includes('chrome-extension://') ||
      stack.includes('moz-extension://')
    );
  };

  window.addEventListener(
    'error',
    (event) => {
      if (isExtensionError(event.error) || isExtensionError(event.message) || isExtensionError(event.filename)) {
        event.preventDefault();
        event.stopImmediatePropagation?.();
        console.warn('[Extension Guard] Neutralized external extension error:', event.message || event.error);
        return true;
      }
    },
    true
  );

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      if (isExtensionError(event.reason)) {
        event.preventDefault();
        event.stopImmediatePropagation?.();
        console.warn('[Extension Guard] Neutralized unhandled extension rejection:', event.reason);
        return true;
      }
    },
    true
  );
}

setupExtensionGuards();

/**
 * Root Application Bootstrapper
 * Ensures the initial loading screen exits reliably and catches fatal startup errors.
 */
function initializeApp() {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  const removeFallbackLoader = () => {
    const fallback = document.getElementById('app-loading-fallback');
    if (fallback && fallback.parentNode) {
      fallback.parentNode.removeChild(fallback);
    }
  };

  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error: any) {
    console.error('[OPHIREUM] Critical startup exception:', error);
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #08090B; color: #F7F3E8; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 24px;">
        <div style="max-width: 460px; width: 100%; background-color: #0D1017; border: 1px solid #2B354C; border-radius: 16px; padding: 32px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.7);">
          <div style="width: 56px; height: 56px; margin: 0 auto 16px; border-radius: 14px; background: rgba(225, 29, 72, 0.15); border: 1px solid rgba(225, 29, 72, 0.4); display: flex; align-items: center; justify-content: center; color: #f43f5e; font-size: 24px;">
            ⚠️
          </div>
          <div style="font-size: 11px; font-weight: 700; color: #E4C765; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 8px;">
            OPHIREUM Platform Diagnostics
          </div>
          <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px; color: #ffffff;">
            Application Initialization Alert
          </h2>
          <p style="font-size: 13px; color: #9CA3AF; line-height: 1.6; margin-bottom: 20px;">
            An unexpected error occurred during application startup. The system supervisor has safely halted execution.
          </p>
          <div style="text-align: left; background: #08090B; padding: 12px; border-radius: 8px; border: 1px solid #232733; font-family: monospace; font-size: 11px; color: #fda4af; margin-bottom: 24px; word-break: break-all; max-height: 120px; overflow-y: auto;">
            ${error?.message || String(error)}
          </div>
          <button onclick="window.location.reload()" style="width: 100%; padding: 12px 20px; border-radius: 12px; background: linear-gradient(135deg, #C9A227, #E4C765); color: #08090B; font-weight: 700; font-size: 13px; border: none; cursor: pointer; transition: filter 0.2s;">
            Reload Application
          </button>
        </div>
      </div>
    `;
  } finally {
    removeFallbackLoader();
  }
}

initializeApp();
