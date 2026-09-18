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
      case 'verification':
      case 'kyc':
        return 'verification';
      case 'subscription':
      case 'billing':
      case 'packages':
      case 'license':
      case 'payments':
        return 'subscription';
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
      case 'verification': return 'Identity Verification';
      case 'subscription': return 'Subscription & Licenses';
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
      case 'verification':
        return <IdentityVerificationView />;
      case 'subscription':
        return <SubscriptionView />;
      case 'connect-account':
        return <ConnectAccountView />;
      case 'trading-monitor':
        return (
          <TradingMonitorView
            account={demoState.account}
            positions={demoState.positions}
            tradeHistory={demoState.trades}
            onRefresh={() => demoEngine.evaluateMarketConditions()}
          />
        );
      case 'charts':
        return <ChartCenterView currentPrice={demoState.account.currentPrice || 2912.85} />;
      case 'performance':
        return (
          <TradingMonitorView
            account={demoState.account}
            positions={demoState.positions}
            tradeHistory={demoState.trades}
            onRefresh={() => demoEngine.evaluateMarketConditions()}
          />
        );
      case 'assistant':
        return <AskOphireumDemo />;
      case 'bot-control':
        return <BotControlView />;
      case 'market-intel':
        return <DemoNewsCalendar onEventTrigger={() => demoEngine.evaluateMarketConditions()} />;
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
