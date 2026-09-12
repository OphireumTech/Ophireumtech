/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Production MT5 Architecture: Authoritative Approved Brokers Specification
 *
 * CRITICAL DIRECTIVE:
 * Strict enforcement of approved broker partners. Do NOT add any brokers other than these four:
 * - FBS.com
 * - GTCFX.com
 * - Vantage Markets (Pty) Ltd
 * - Pepperstone Markets Limited
 */

import { ApprovedBrokerConfig, ApprovedBrokerName, SymbolMapping } from '../types';

export const APPROVED_BROKERS: ApprovedBrokerConfig[] = [
  {
    name: 'FBS.com',
    displayName: 'FBS (FBS.com)',
    website: 'https://fbs.com',
    regulatoryJurisdiction: 'CySEC / IFSC / ASIC Tier-1 Regulated',
    servers: ['FBS-Real', 'FBS-Real-2', 'FBS-Real-3', 'FBS-Real-4', 'FBS-Demo'],
    defaultGoldSymbol: 'XAUUSD',
    supportedGoldSymbols: ['XAUUSD', 'XAUUSDm'],
    recommendedAccountType: 'Raw Spread / ECN',
    minDepositUsd: 200,
    maxLeverage: '1:500'
  },
  {
    name: 'GTCFX.com',
    displayName: 'GTCFX (GTC Global Trade Capital)',
    website: 'https://gtcfx.com',
    regulatoryJurisdiction: 'SCA / DFSA / FSC Regulated',
    servers: ['GTC-Live', 'GTC-Live-2', 'GTC-Demo'],
    defaultGoldSymbol: 'XAUUSD',
    supportedGoldSymbols: ['XAUUSD', 'XAUUSD.pro'],
    recommendedAccountType: 'Raw Spread / ECN',
    minDepositUsd: 200,
    maxLeverage: '1:400'
  },
  {
    name: 'Vantage Markets (Pty) Ltd',
    displayName: 'Vantage Markets (Pty) Ltd',
    website: 'https://vantagemarkets.com',
    regulatoryJurisdiction: 'FSCA / ASIC / CIMA Regulated',
    servers: [
      'VantageFXInternational-Live',
      'VantageFXInternational-Live 2',
      'VantageFXInternational-Live 3',
      'VantageInternational-Demo'
    ],
    defaultGoldSymbol: 'XAUUSD.raw',
    supportedGoldSymbols: ['XAUUSD.raw', 'XAUUSD', 'XAUUSD+'],
    recommendedAccountType: 'Raw Spread / ECN',
    minDepositUsd: 200,
    maxLeverage: '1:500'
  },
  {
    name: 'Pepperstone Markets Limited',
    displayName: 'Pepperstone Markets Limited',
    website: 'https://pepperstone.com',
    regulatoryJurisdiction: 'SCB / FCA / ASIC Regulated',
    servers: [
      'Pepperstone-MT5-Live01',
      'Pepperstone-MT5-Live02',
      'Pepperstone-MT5-Demo'
    ],
    defaultGoldSymbol: 'XAUUSD',
    supportedGoldSymbols: ['XAUUSD', 'XAUUSD.pro'],
    recommendedAccountType: 'Raw Spread / ECN',
    minDepositUsd: 200,
    maxLeverage: '1:500'
  }
];

export const APPROVED_BROKER_NAMES: ApprovedBrokerName[] = [
  'FBS.com',
  'GTCFX.com',
  'Vantage Markets (Pty) Ltd',
  'Pepperstone Markets Limited'
];

export const APPROVED_SYMBOL_MAPPINGS: SymbolMapping[] = [
  {
    id: 'sym-fbs-xauusd',
    brokerName: 'FBS.com',
    standardSymbol: 'XAUUSD',
    brokerSymbol: 'XAUUSD',
    contractSize: 100,
    digits: 2,
    minLot: 0.01,
    maxLot: 50.0,
    lotStep: 0.01,
    isVerified: true
  },
  {
    id: 'sym-fbs-xauusdm',
    brokerName: 'FBS.com',
    standardSymbol: 'XAUUSD',
    brokerSymbol: 'XAUUSDm',
    contractSize: 100,
    digits: 2,
    minLot: 0.01,
    maxLot: 10.0,
    lotStep: 0.01,
    isVerified: true
  },
  {
    id: 'sym-gtc-xauusd',
    brokerName: 'GTCFX.com',
    standardSymbol: 'XAUUSD',
    brokerSymbol: 'XAUUSD',
    contractSize: 100,
    digits: 2,
    minLot: 0.01,
    maxLot: 50.0,
    lotStep: 0.01,
    isVerified: true
  },
  {
    id: 'sym-gtc-xauusd-pro',
    brokerName: 'GTCFX.com',
    standardSymbol: 'XAUUSD',
    brokerSymbol: 'XAUUSD.pro',
    contractSize: 100,
    digits: 2,
    minLot: 0.01,
    maxLot: 50.0,
    lotStep: 0.01,
    isVerified: true
  },
  {
    id: 'sym-vantage-xauusd-raw',
    brokerName: 'Vantage Markets (Pty) Ltd',
    standardSymbol: 'XAUUSD',
    brokerSymbol: 'XAUUSD.raw',
    contractSize: 100,
    digits: 2,
    minLot: 0.01,
    maxLot: 100.0,
    lotStep: 0.01,
    isVerified: true
  },
  {
    id: 'sym-vantage-xauusd',
    brokerName: 'Vantage Markets (Pty) Ltd',
    standardSymbol: 'XAUUSD',
    brokerSymbol: 'XAUUSD',
    contractSize: 100,
    digits: 2,
    minLot: 0.01,
    maxLot: 50.0,
    lotStep: 0.01,
    isVerified: true
  },
  {
    id: 'sym-vantage-xauusd-plus',
    brokerName: 'Vantage Markets (Pty) Ltd',
    standardSymbol: 'XAUUSD',
    brokerSymbol: 'XAUUSD+',
    contractSize: 100,
    digits: 2,
    minLot: 0.01,
    maxLot: 50.0,
    lotStep: 0.01,
    isVerified: true
  },
  {
    id: 'sym-pep-xauusd',
    brokerName: 'Pepperstone Markets Limited',
    standardSymbol: 'XAUUSD',
    brokerSymbol: 'XAUUSD',
    contractSize: 100,
    digits: 2,
    minLot: 0.01,
    maxLot: 100.0,
    lotStep: 0.01,
    isVerified: true
  },
  {
    id: 'sym-pep-xauusd-pro',
    brokerName: 'Pepperstone Markets Limited',
    standardSymbol: 'XAUUSD',
    brokerSymbol: 'XAUUSD.pro',
    contractSize: 100,
    digits: 2,
    minLot: 0.01,
    maxLot: 100.0,
    lotStep: 0.01,
    isVerified: true
  }
];

export const MANDATORY_SECURITY_NOTICE =
  'Your MT5 trading password is required only to establish and maintain an authorized execution session. Ophireum will never request your broker client-portal password, withdrawal password, banking password, card PIN, cryptocurrency recovery phrase, or unrelated credentials.';

export const ARCHITECTURE_FLOW_DESCRIPTION =
  'Client Web Application → Authenticated Backend API → Encrypted Command Queue → Authorized Windows VPS MT5 Worker → Installed MetaTrader 5 Terminal → Customer Broker Server.';

/**
 * Validates whether a broker name is in the approved 4 brokers list.
 */
export function isApprovedBroker(brokerName: string): boolean {
  if (!brokerName) return false;
  const clean = brokerName.trim().toLowerCase();
  return APPROVED_BROKERS.some(b => b.name.toLowerCase() === clean || b.displayName.toLowerCase() === clean);
}

/**
 * Finds configuration for an approved broker
 */
export function getApprovedBroker(brokerName: string): ApprovedBrokerConfig | undefined {
  if (!brokerName) return undefined;
  const clean = brokerName.trim().toLowerCase();
  return APPROVED_BROKERS.find(b => b.name.toLowerCase() === clean || b.displayName.toLowerCase() === clean);
}

/**
 * Validates whether a trading symbol represents XAUUSD/Gold on an approved broker
 */
export function isValidGoldSymbol(brokerName: string, symbol: string): boolean {
  if (!symbol) return false;
  const cleanSym = symbol.trim().toUpperCase();
  const broker = getApprovedBroker(brokerName);
  if (!broker) return false;
  return broker.supportedGoldSymbols.some(s => s.toUpperCase() === cleanSym);
}
