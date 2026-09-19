/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Modern Client Portal Orchestrator
 * Sections 1, 2, 4, 10-33: Modular customer portal orchestrator wrapped in PortalLayout.
 * Connects to demoEngine state, provides clean navigation without duplicate headers,
 * and renders dedicated institutional views.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { demoEngine } from '../../services/demoEngine';
import { PortalLayout } from '../layout/PortalLayout';
import { DashboardOverview } from './DashboardOverview';
import { ChartCenterView } from './ChartCenterView';
import { TradingMonitorView } from './TradingMonitorView';
import { BotControlView } from './BotControlView';
import { IdentityVerificationView } from './IdentityVerificationView';
import { SubscriptionView } from './SubscriptionView';
import { ConnectAccountView } from './ConnectAccountView';
import { ProfileView } from './ProfileView';
import { SecurityView } from './SecurityView';
import { SupportView } from './SupportView';
import { RiskLegalView } from './RiskLegalView';
import { DemoNewsCalendar } from '../demo/DemoNewsCalendar';
import { AskOphireumDemo } from '../demo/AskOphireumDemo';
import { DemoWarningModal } from '../demo/DemoWarningModal';

// Compliance & Governance Views
import { ComplianceGateTracker } from '../compliance/ComplianceGateTracker';
import { CorporateKYBView } from '../compliance/CorporateKYBView';
import { BeneficialOwnersView } from '../compliance/BeneficialOwnersView';
import { TradingExperienceView } from '../compliance/TradingExperienceView';
import { SourceOfFundsView } from '../compliance/SourceOfFundsView';
import { DigitalSignatureCenter } from '../compliance/DigitalSignatureCenter';
import { DocumentVaultView } from '../compliance/DocumentVaultView';
import { PrivacyCenterView } from '../compliance/PrivacyCenterView';
import { ComplianceAuditLogsView } from '../compliance/ComplianceAuditLogsView';
import { EAAuthorizationView } from '../compliance/EAAuthorizationView';
import { LegalAgreementsView } from '../compliance/LegalAgreementsView';

interface CustomerPortalProps {
  initialTab?: string;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({ initialTab }) => {
  const { currentUser, isDemoSession } = useApp();
  const navigate = useNavigate();
  const params = useParams<{ tab?: string }>();

  const isDemo = isDemoSession ||
    currentUser?.uid?.includes('demo') ||
    currentUser?.email?.includes('demo') ||
    (typeof window !== 'undefined' && sessionStorage.getItem('ophireum_is_demo') === 'true');

  const [demoState, setDemoState] = useState(() => demoEngine.getState());
  const [showWarningModal, setShowWarningModal] = useState(() => {
    return isDemo && (typeof window !== 'undefined' ? !sessionStorage.getItem('ophireum_demo_acknowledged') : false);
  });

  // Subscribe to demo simulation engine
  useEffect(() => {
    if (isDemo) {
      const unsub = demoEngine.subscribe(st => setDemoState(st));
      return unsub;
    }
  }, [isDemo]);

  // Normalize tab keys
  const normalizeTab = (tab?: string): string => {
    if (!tab) return 'overview';
    switch (tab.toLowerCase()) {
      case 'overview':
      case 'dashboard':
        return 'overview';
      case 'compliance-tracker':
      case 'gates':
      case 'compliance':
        return 'compliance-tracker';
      case 'verification':
      case 'kyc':
        return 'verification';
      case 'corporate-kyb':
      case 'kyb':
      case 'entity':
        return 'corporate-kyb';
      case 'ubo-registry':
      case 'ubo':
      case 'beneficial-owners':
        return 'ubo-registry';
      case 'suitability-test':
      case 'suitability':
      case 'appropriateness':
      case 'experience':
        return 'suitability-test';
      case 'source-of-funds':
      case 'sof':
      case 'sow':
        return 'source-of-funds';
      case 'digital-signatures':
      case 'signature':
      case 'signatures':
      case 'sign':
        return 'digital-signatures';
      case 'document-vault':
      case 'vault':
      case 'documents':
        return 'document-vault';
      case 'privacy-center':
      case 'privacy':
      case 'gdpr':
        return 'privacy-center';
      case 'audit-trail':
      case 'audit':
      case 'audit-logs':
        return 'audit-trail';
      case 'ea-authorization':
      case 'activation':
      case 'ea-auth':
        return 'ea-authorization';
      case 'legal-agreements':
      case 'tpa':
      case 'contract':
        return 'legal-agreements';
      case 'subscription':
      case 'packages':
        return 'subscription';
      case 'billing':
      case 'license':
      case 'payments':
        return 'billing';
      case 'connect-account':
      case 'binding':
      case 'mt5-binding':
        return 'connect-account';
      case 'trading-monitor':
      case 'trading':
        return 'trading-monitor';
      case 'charts':
      case 'chart':
        return 'charts';
      case 'performance':
        return 'performance';
      case 'assistant':
      case 'ask-assistant':
        return 'assistant';
      case 'bot-control':
      case 'bot':
      case 'vps':
      case 'downloads':
        return 'bot-control';
      case 'market-intel':
      case 'news':
        return 'market-intel';
      case 'profile':
        return 'profile';
      case 'security':
        return 'security';
      case 'support':
      case 'tickets':
        return 'support';
      case 'legal':
      case 'agreements':
      case 'disclosures':
        return 'legal';
      default:
        return 'overview';
    }
  };

  const resolvedTab = normalizeTab(params.tab || initialTab);
  const [activeTab, setActiveTab] = useState<string>(resolvedTab);

  useEffect(() => {
    const nextTab = normalizeTab(params.tab || initialTab);
    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
  }, [params.tab, initialTab]);

  const handleSelectTab = (tabKey: string) => {
    setActiveTab(tabKey);
    navigate(`/dashboard/${tabKey}`);
  };

  const getPageTitle = (tab: string): string => {
    switch (tab) {
      case 'overview': return 'Dashboard Overview';
      case 'compliance-tracker': return '13-Gate Compliance Progression';
      case 'verification': return 'Individual Identity Verification';
      case 'corporate-kyb': return 'Corporate Entity KYB';
      case 'ubo-registry': return 'Ultimate Beneficial Ownership (UBO)';
      case 'suitability-test': return 'Trading Experience & Appropriateness';
      case 'source-of-funds': return 'Source of Funds & Wealth (AML)';
      case 'digital-signatures': return 'Digital Signature & Certificate Center';
      case 'document-vault': return 'Secure Client Document Vault';
      case 'privacy-center': return 'Privacy Center & Data Subject Rights';
      case 'audit-trail': return 'Regulatory Audit Trail & Event Ledger';
      case 'ea-authorization': return 'EA Automated Trading Authorization';
      case 'legal-agreements': return 'Technology Purchase & License Agreements';
      case 'subscription': return 'Subscription & Licenses';
      case 'billing': return 'Billing & Invoices';
      case 'connect-account': return 'Connect Trading Account';
      case 'trading-monitor': return 'Trading Monitor';
      case 'charts': return 'XAUUSD Chart Center';
      case 'performance': return 'Performance Analytics';
      case 'assistant': return 'Expert Assistant';
      case 'bot-control': return 'Bot Control Center';
      case 'market-intel': return 'Market Intelligence';
      case 'profile': return 'My Profile';
      case 'security': return 'Security Settings';
      case 'support': return 'Client Support';
      case 'legal': return 'Risk & Legal Disclosures';
      default: return 'Client Portal';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DashboardOverview
            account={demoState.account}
            onNavigateTab={handleSelectTab}
          />
        );
      case 'compliance-tracker':
        return (
          <ComplianceGateTracker
            onNavigateToGate={(gateId) => {
              if (gateId === 'GATE_01_JURISDICTION' || gateId === 'GATE_02_KYC_INDIVIDUAL') handleSelectTab('verification');
              else if (gateId === 'GATE_03_KYB_ENTITY') handleSelectTab('corporate-kyb');
              else if (gateId === 'GATE_04_UBO_REGISTRY') handleSelectTab('ubo-registry');
              else if (gateId === 'GATE_05_SOURCE_OF_FUNDS' || gateId === 'GATE_06_FINANCIAL_PROFILE') handleSelectTab('source-of-funds');
              else if (gateId === 'GATE_07_TRADING_EXPERIENCE') handleSelectTab('suitability-test');
              else if (gateId === 'GATE_08_RISK_DISCLOSURES' || gateId === 'GATE_09_CONTRACT_EXECUTION') handleSelectTab('digital-signatures');
              else if (gateId === 'GATE_10_SUBSCRIPTION_BILLING') handleSelectTab('subscription');
              else if (gateId === 'GATE_11_BROKER_VERIFICATION') handleSelectTab('connect-account');
              else if (gateId === 'GATE_12_AUTHENTICATION_2FA') handleSelectTab('security');
              else if (gateId === 'GATE_13_EA_AUTHORIZATION') handleSelectTab('ea-authorization');
              else handleSelectTab('verification');
            }}
          />
        );
      case 'verification':
        return <IdentityVerificationView />;
      case 'corporate-kyb':
        return <CorporateKYBView />;
      case 'ubo-registry':
        return <BeneficialOwnersView />;
      case 'suitability-test':
        return <TradingExperienceView />;
      case 'source-of-funds':
        return <SourceOfFundsView />;
      case 'digital-signatures':
        return <DigitalSignatureCenter />;
      case 'document-vault':
        return <DocumentVaultView />;
      case 'privacy-center':
        return <PrivacyCenterView />;
      case 'audit-trail':
        return <ComplianceAuditLogsView />;
      case 'ea-authorization':
        return <EAAuthorizationView />;
      case 'legal-agreements':
        return <LegalAgreementsView />;
      case 'subscription':
      case 'billing':
        return <SubscriptionView />;
      case 'connect-account':
        return <ConnectAccountView />;
      case 'trading-monitor':
        return (
          <TradingMonitorView
            account={demoState.account}
            positions={demoState.positions}
            tradeHistory={demoState.tradeHistory}
            initialSubTab="positions"
            onRefresh={() => demoEngine.triggerMarketVolatility()}
          />
        );
      case 'charts':
        return <ChartCenterView currentPrice={demoState.account.currentPrice || 2912.85} />;
      case 'performance':
        return (
          <TradingMonitorView
            account={demoState.account}
            positions={demoState.positions}
            tradeHistory={demoState.tradeHistory}
            initialSubTab="performance"
            onRefresh={() => demoEngine.triggerMarketVolatility()}
          />
        );
      case 'assistant':
        return <AskOphireumDemo />;
      case 'bot-control':
        return <BotControlView />;
      case 'market-intel':
        return <DemoNewsCalendar events={demoState.marketEvents} currentPrice={demoState.account.currentPrice} />;
      case 'profile':
        return <ProfileView />;
      case 'security':
        return <SecurityView />;
      case 'support':
        return <SupportView />;
      case 'legal':
        return <RiskLegalView />;
      default:
        return (
          <DashboardOverview
            account={demoState.account}
            onNavigateTab={handleSelectTab}
          />
        );
    }
  };

  return (
    <>
      <PortalLayout
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        pageTitle={getPageTitle(activeTab)}
      >
        {renderTabContent()}
      </PortalLayout>

      {/* Demo Initial Welcome Warning Modal */}
      {showWarningModal && (
        <DemoWarningModal
          onAcknowledge={() => {
            sessionStorage.setItem('ophireum_demo_acknowledged', 'true');
            setShowWarningModal(false);
          }}
        />
      )}
    </>
  );
};
