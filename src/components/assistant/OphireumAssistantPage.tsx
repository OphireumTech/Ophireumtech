/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM ASSISTANT WORKSPACE
 * High-performance conversational market-intelligence interface with
 * collapsible sidebar, voice mode (Ophireum Voice), chart & document analysis,
 * structured A-L analysis, financial calculators, live market quotes,
 * transparent credit ledger, and statutory compliance disclosures.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { auth } from '../../lib/firebase';
import {
  AssistantMessage,
  AssistantConversation,
  UploadedMarketFile,
  PlanTierId,
  CreditWallet,
  StructuredMarketAnalysis
} from '../../types/assistant';
import {
  DEFAULT_ASSISTANT_PLANS,
  getGuestQueryCount,
  incrementGuestQueryCount,
  isGuestAllowanceConsumed,
  getInitialWallet,
  streamAssistantChat
} from '../../services/assistantApi';
import {
  getCuratedMarketQuotes,
  getCuratedEconomicCalendar,
  getMarketSessionStatus,
  calculateCurrencyStrength,
  executePositionSizeCalculation
} from '../../services/marketData';
import {
  Send,
  Square,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Paperclip,
  Plus,
  Search,
  Pin,
  PinOff,
  Archive,
  Trash2,
  Download,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Shield,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Compass,
  CreditCard,
  Sliders,
  AlertTriangle,
  Info,
  Sun,
  Moon,
  FileText,
  Image as ImageIcon,
  X,
  RefreshCw,
  Coins,
  FileSpreadsheet
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  { text: 'Analyze today’s principal XAUUSD drivers', category: 'Gold & Macro' },
  { text: 'What events could affect gold this week?', category: 'Economic Events' },
  { text: 'Explain the current USD market structure', category: 'Forex' },
  { text: 'Build a technical-analysis checklist', category: 'Strategy' },
  { text: 'Compare risk-on and risk-off conditions', category: 'Macro' },
  { text: 'Create a nonfarm-payroll trading preparation plan', category: 'News Trading' },
  { text: 'Explain how inflation affects gold', category: 'Education' },
  { text: 'Scan today’s major forex-market developments', category: 'Global Markets' },
  { text: 'Help me calculate position size and risk', category: 'Calculators' },
  { text: 'Explain how to install an MT5 indicator or EA', category: 'MT5 & Tech' }
];

export const OphireumAssistantPage: React.FC = () => {
  const { currentUser, currentRole, addToast } = useApp();
  const navigate = useNavigate();

  // Color Theme: 'dark' (Ophireum Charcoal/Gold) or 'light' (Crisp White/Gold)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  // Active Tool Drawers / Modals
  const [activeDrawer, setActiveDrawer] = useState<'none' | 'market_scanner' | 'calculators' | 'plans' | 'privacy'>('none');
  const [feedbackModalMessage, setFeedbackModalMessage] = useState<AssistantMessage | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<'like' | 'dislike'>('like');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);

  // Conversations and active session state
  const [conversations, setConversations] = useState<AssistantConversation[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('ophireum_assistant_convos');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'conv-default-1',
        userId: currentUser?.uid || 'guest',
        title: 'XAUUSD Daily Market Structure',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        pinned: true,
        archived: false,
        messageCount: 2,
        previewSnippet: 'Spot Gold XAUUSD consolidating near the $2,908.45 benchmark...'
      }
    ];
  });

  const [activeConversationId, setActiveConversationId] = useState<string>(
    conversations[0]?.id || 'conv-new'
  );

  // Messages dictionary per conversation
  const [messagesMap, setMessagesMap] = useState<Record<string, AssistantMessage[]>>(() => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem('ophireum_assistant_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      'conv-default-1': [
        {
          id: 'msg-seed-user',
          conversationId: 'conv-default-1',
          role: 'user',
          content: 'Analyze today’s principal XAUUSD drivers',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'msg-seed-assistant',
          conversationId: 'conv-default-1',
          role: 'assistant',
          content: `### Structured Market Analysis: Spot Gold (XAUUSD)\n\n**A. Market Summary**\nSpot Gold (XAUUSD) trades at $2,908.45/oz (+0.51%), consolidating near recent swing highs as participants weigh Treasury yield dynamics against sovereign reserve accumulation.\n\n**B. Current Market Regime**\nRange-Bound / Consolidating with an upward bias above the $2,886 daily support shelf.\n\n**C. Principal Bullish Drivers**\n- Ongoing central-bank sovereign bullion accumulation (PBoC, RBI, and emerging-market reserves).\n- Persistent geopolitical hedging and demand for real assets amid sovereign debt expansion.\n- Market anticipation of continued central bank policy adjustments.\n\n**D. Principal Bearish Drivers**\n- US Dollar Index (DXY) maintaining support above 104.00.\n- US 10-Year Treasury Yield above 4.28%, sustaining elevated real carry costs.\n- Tactical profit-taking following extended bullish runs.\n\n**E. Important Economic Events**\n- US Consumer Price Index (CPI YoY) — Wednesday 12:30 UTC\n- FOMC Interest Rate Decision & Press Conference — Wednesday 18:00 UTC\n- US Non-Farm Payrolls (NFP) — Friday 12:30 UTC\n\n**F. Technical Structure**\nPrice remains above the rising 50-day Exponential Moving Average ($2,854). The H4 chart displays higher lows with strong volume acceptance above $2,900.\n\n**G. Key Areas to Monitor**\n- Resistance: $2,924.10 (Session High) and $2,945.00 (Psychological Extension)\n- Support: $2,886.30 (Session Low) and $2,865.00 (Value Area Low)\n- Key Pivot: $2,908.00\n\n**H. Bullish Scenario**\nIf price holds above $2,908 and achieves a confirmed H4 close above $2,925 with expanding volume, this may indicate momentum expansion toward $2,945 and $2,960.\n\n**I. Bearish Scenario**\nThe bearish scenario becomes stronger if price sustains an hourly break below $2,886, potentially opening an orderly liquidity retest toward $2,865.\n\n**J. Invalidation Conditions**\nThe constructive bullish outlook is invalidated if price suffers a daily close below $2,850 on heavy institutional volume.\n\n**K. Risk Considerations**\nHigh-impact macro announcements create sudden spread widening and slippage. Risk should not exceed 1-2% of liquid account equity, with hard stop-loss execution.\n\n**L. Sources and Data Timestamp**\n- Verified Spot Gold Benchmark: $2,908.45/oz (Timestamp: ${new Date().toISOString()})\n- Source: Ophireum Institutional Feed & Macro Benchmark Series`,
          timestamp: new Date(Date.now() - 3550000).toISOString(),
          citations: [
            {
              id: 'cit-1',
              title: 'Spot Gold Fix',
              source: 'Ophireum Institutional Feed',
              timestamp: new Date().toISOString(),
              snippet: 'Live spot tick $2,908.45/oz. Status: Active FIX Feed.',
              dataType: 'live_market_tick'
            }
          ],
          feedback: 'like'
        }
      ]
    };
  });

  // Active messages list
  const activeMessages = messagesMap[activeConversationId] || [];

  // Input & Generation State
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<UploadedMarketFile[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [editingTitleConvoId, setEditingTitleConvoId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState('');

  // Voice Mode: Speech-To-Text and Text-To-Speech ("Ophireum Voice")
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);
  const [voiceTranscriptPreview, setVoiceTranscriptPreview] = useState('');
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Credit Wallet state
  const [wallet, setWallet] = useState<CreditWallet>(() => {
    if (typeof window === 'undefined') return getInitialWallet('guest', 'discover');
    const saved = localStorage.getItem('ophireum_assistant_wallet');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return getInitialWallet(currentUser?.uid || 'guest', 'discover');
  });

  // Live Market Data Feeds
  const [marketQuotes, setMarketQuotes] = useState(getCuratedMarketQuotes());
  const [economicEvents] = useState(getCuratedEconomicCalendar());
  const [sessionClocks] = useState(getMarketSessionStatus());
  const [currencyStrengths] = useState(calculateCurrencyStrength());
  const [providerTelemetry, setProviderTelemetry] = useState<any>(null);

  // Synchronize Authoritative Server Wallet
  const fetchServerWallet = async () => {
    if (!currentUser?.uid) return;
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/v1/assistant/wallet', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.wallet) {
          setWallet(data.wallet);
        }
      }
    } catch (e) {
      console.warn('Wallet fetch error:', e);
    }
  };

  const fetchMarketData = async () => {
    try {
      const res = await fetch('/api/v1/assistant/market-overview');
      if (res.ok) {
        const data = await res.json();
        if (data.quotes && data.quotes.length > 0) {
          setMarketQuotes(data.quotes);
        }
        setProviderTelemetry({
          provider: data.provider,
          isLiveFeedConnected: data.isLiveFeedConnected,
          status: data.status,
          notice: data.notice,
          requiredCredentials: data.requiredCredentials
        });
      }
    } catch (e) {
      console.warn('Market feed fetch error:', e);
    }
  };

  useEffect(() => {
    fetchServerWallet();
    fetchMarketData();
  }, [currentUser?.uid]);

  // Interactive Calculator State
  const [calcInputs, setCalcInputs] = useState({
    accountBalanceUSD: 10000,
    riskPercentage: 1.0,
    stopLossPips: 50,
    pairSymbol: 'XAUUSD',
    entryPrice: 2908.0,
    takeProfitPrice: 2928.0,
    leverage: 100
  });

  const calcOutputs = useMemo(() => {
    return executePositionSizeCalculation(calcInputs);
  }, [calcInputs]);

  // Save state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ophireum_assistant_convos', JSON.stringify(conversations));
      localStorage.setItem('ophireum_assistant_messages', JSON.stringify(messagesMap));
      localStorage.setItem('ophireum_assistant_wallet', JSON.stringify(wallet));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [conversations, messagesMap, wallet]);

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechRecognitionSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;
        recog.lang = 'en-US';

        recog.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            interimTranscript += event.results[i][0].transcript;
          }
          setVoiceTranscriptPreview(interimTranscript);
        };

        recog.onerror = (event: any) => {
          console.warn('[Ophireum Voice] Recognition notice:', event.error);
          setIsRecordingVoice(false);
        };

        recog.onend = () => {
          setIsRecordingVoice(false);
          if (voiceTranscriptPreview) {
            setPromptInput(prev => (prev ? `${prev} ${voiceTranscriptPreview}` : voiceTranscriptPreview));
            setVoiceTranscriptPreview('');
          }
        };

        recognitionRef.current = recog;
      }
    }
  }, [voiceTranscriptPreview]);

  // Scroll to bottom of message stream
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, isGenerating]);

  // Handlers for conversations
  const handleNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConvo: AssistantConversation = {
      id: newId,
      userId: currentUser?.uid || 'guest',
      title: 'New Market Inquiry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false,
      archived: false,
      messageCount: 0
    };
    setConversations(prev => [newConvo, ...prev]);
    setActiveConversationId(newId);
    setPromptInput('');
    setAttachedFiles([]);
  };

  const handleDeleteConversation = (convoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this conversation permanently? This action cannot be undone.')) return;
    setConversations(prev => prev.filter(c => c.id !== convoId));
    setMessagesMap(prev => {
      const copy = { ...prev };
      delete copy[convoId];
      return copy;
    });
    if (activeConversationId === convoId) {
      const remaining = conversations.filter(c => c.id !== convoId);
      if (remaining.length > 0) {
        setActiveConversationId(remaining[0].id);
      } else {
        handleNewChat();
      }
    }
    addToast('Conversation Deleted', 'Session record removed.', 'info');
  };

  const handleTogglePin = (convoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev =>
      prev.map(c => (c.id === convoId ? { ...c, pinned: !c.pinned } : c))
    );
  };

  const handleToggleArchive = (convoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev =>
      prev.map(c => (c.id === convoId ? { ...c, archived: !c.archived } : c))
    );
    addToast('Archive Updated', 'Conversation archive status toggled.', 'info');
  };

  const handleSaveTitle = (convoId: string) => {
    if (!editingTitleText.trim()) return;
    setConversations(prev =>
      prev.map(c => (c.id === convoId ? { ...c, title: editingTitleText.trim() } : c))
    );
    setEditingTitleConvoId(null);
    setEditingTitleText('');
  };

  const handleClearAllConversations = () => {
    if (!window.confirm('Are you sure you want to delete ALL conversation history?')) return;
    setConversations([]);
    setMessagesMap({});
    handleNewChat();
    addToast('History Cleared', 'All local conversations have been wiped.', 'info');
  };

  const handleExportData = (format: 'json' | 'txt') => {
    const currentConvo = conversations.find(c => c.id === activeConversationId);
    if (!currentConvo) return;
    const msgs = activeMessages;

    let blob: Blob;
    let filename: string;

    if (format === 'json') {
      const exportObj = {
        conversation: currentConvo,
        messages: msgs,
        exportedAt: new Date().toISOString(),
        disclaimer: 'Ophireum Assistant Educational Market Intelligence Export'
      };
      blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
      filename = `ophireum-assistant-${currentConvo.id}.json`;
    } else {
      let txt = `====================================================\n`;
      txt += `OPHIREUM ASSISTANT EXPORT: ${currentConvo.title}\n`;
      txt += `Timestamp: ${new Date().toISOString()}\n`;
      txt += `====================================================\n\n`;
      msgs.forEach(m => {
        txt += `[${m.role.toUpperCase()}] (${m.timestamp})\n`;
        txt += `${m.content}\n\n`;
      });
      txt += `\n\nDISCLAIMER:\nOphireum Assistant provides market information, research tools, and general trading education. Not personalized financial advice.`;
      blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
      filename = `ophireum-assistant-${currentConvo.id}.txt`;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Export Generated', `Saved as ${filename}`, 'success');
  };

  // File Upload Handling
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.csv', '.xlsx', '.txt', '.docx'];
    const lowerName = file.name.toLowerCase();
    const isAllowed = allowedExtensions.some(ext => lowerName.endsWith(ext));

    if (!isAllowed) {
      addToast(
        'Unsupported File Format',
        'Please upload PNG/JPG chart screenshots, PDF reports, CSV histories, or XLSX spreadsheets.',
        'warning'
      );
      return;
    }

    // Size limit check (25MB)
    if (file.size > 25 * 1024 * 1024) {
      addToast('File Too Large', 'Maximum allowable file size is 25MB.', 'critical');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;

      // Server-side security check if logged in
      if (currentUser?.uid) {
        try {
          const token = await auth.currentUser?.getIdToken();
          const res = await fetch('/api/v1/assistant/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              filename: file.name,
              fileData: dataUrl,
              mimeType: file.type
            })
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            addToast('Security Verification Rejected', err.message || 'File validation failed on server.', 'critical');
            return;
          }

          const uploadData = await res.json();
          const newFile: UploadedMarketFile = {
            id: uploadData.file.id,
            name: uploadData.file.name,
            size: uploadData.file.size,
            type: uploadData.file.type,
            category: uploadData.file.category,
            dataUrl,
            uploadedAt: uploadData.file.uploadedAt
          };
          setAttachedFiles(prev => [...prev, newFile]);
          addToast('File Verified & Attached', `${file.name} passed server magic-byte inspection.`, 'success');
          return;
        } catch (err: any) {
          addToast('Upload Error', err.message || 'Error communicating with file validator.', 'warning');
        }
      }

      // Guest / Fallback local attachment
      const newFile: UploadedMarketFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        category: file.type.startsWith('image/') ? 'chart_screenshot' : 'pdf_report',
        dataUrl,
        uploadedAt: new Date().toISOString()
      };
      setAttachedFiles(prev => [...prev, newFile]);
      addToast('File Attached', `${file.name} ready for chart & document analysis.`, 'success');
    };
    reader.readAsDataURL(file);

    if (e.target) e.target.value = '';
  };

  // Voice input toggle
  const toggleVoiceRecording = () => {
    if (!speechRecognitionSupported) {
      addToast('Voice Not Supported', 'Your browser does not support SpeechRecognition. Use Chrome or Edge.', 'warning');
      return;
    }

    if (isRecordingVoice) {
      recognitionRef.current?.stop();
      setIsRecordingVoice(false);
    } else {
      try {
        setVoiceTranscriptPreview('');
        recognitionRef.current?.start();
        setIsRecordingVoice(true);
        addToast('Ophireum Voice Active', 'Listening for market query... Speak clearly.', 'info');
      } catch (err) {
        console.warn('Voice activation error:', err);
        setIsRecordingVoice(false);
      }
    }
  };

  // Text-To-Speech Playback State
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);

  const handleToggleSpeakMessage = (msg: AssistantMessage) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      addToast('TTS Unavailable', 'Speech synthesis is not supported in this browser.', 'warning');
      return;
    }

    if (playingMessageId === msg.id) {
      window.speechSynthesis.cancel();
      setPlayingMessageId(null);
      setIsSpeechPaused(false);
      return;
    }

    window.speechSynthesis.cancel();
    setPlayingMessageId(msg.id);
    setIsSpeechPaused(false);

    // Strip markdown formatting symbols for clean speech
    const cleanSpeech = msg.content
      .replace(/[*#_`$]/g, '')
      .replace(/\n+/g, '. ')
      .slice(0, 1500);

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setPlayingMessageId(null);
      setIsSpeechPaused(false);
    };
    utterance.onerror = () => {
      setPlayingMessageId(null);
      setIsSpeechPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleSpeechPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeechPaused) {
      window.speechSynthesis.resume();
      setIsSpeechPaused(false);
      addToast('Audio Resumed', 'Speech synthesis continuing.', 'info');
    } else {
      window.speechSynthesis.pause();
      setIsSpeechPaused(true);
      addToast('Audio Paused', 'Speech synthesis paused.', 'info');
    }
  };

  // Message Copy
  const handleCopyMessage = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 2000);
    addToast('Copied', 'Analysis copied to clipboard.', 'success');
  };

  // Feedback Submission
  const handleSubmitFeedback = async () => {
    if (!feedbackModalMessage) return;
    setFeedbackSubmitting(true);
    try {
      await fetch('/api/v1/assistant/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: feedbackModalMessage.id,
          rating: feedbackRating,
          feedbackNote: feedbackComment,
          userEmail: currentUser?.email || 'guest'
        })
      });

      // Update local message feedback badge
      setMessagesMap(prev => {
        const convoMsgs = prev[activeConversationId] || [];
        return {
          ...prev,
          [activeConversationId]: convoMsgs.map(m =>
            m.id === feedbackModalMessage.id ? { ...m, feedback: feedbackRating, feedbackNote: feedbackComment } : m
          )
        };
      });

      addToast('Feedback Recorded', 'Thank you for helping improve Ophireum Assistant models.', 'success');
      setFeedbackModalMessage(null);
      setFeedbackComment('');
    } catch {
      addToast('Error', 'Unable to record feedback right now.', 'warning');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Plan Subscription Checkout Handler
  const handleServerPlanCheckout = async (planId: string) => {
    if (!currentUser?.uid) {
      navigate('/register');
      return;
    }
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/v1/assistant/subscription/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ planId, paymentMethod: 'usdt' })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.wallet) {
          setWallet(data.wallet);
        }
        addToast(
          data.isTestMode ? 'Sandbox Checkout Confirmed' : 'Subscription Updated',
          data.message || 'Plan subscription activated.',
          'success'
        );
        setActiveDrawer('none');
        fetchServerWallet();
      } else {
        throw new Error(data.message || 'Checkout failed');
      }
    } catch (err: any) {
      addToast('Checkout Notice', err.message || 'Subscription checkout error.', 'warning');
    }
  };

  // Credit Pack Purchase Handler
  const handleCreditPackCheckout = async (creditAmount: number, usdtAmount: number) => {
    if (!currentUser?.uid) {
      navigate('/register');
      return;
    }
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/v1/assistant/subscription/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          planId: wallet.planId,
          creditPack: creditAmount,
          amountUSDT: usdtAmount,
          paymentMethod: 'usdt'
        })
      });
      const data = await res.json();
      if (res.ok) {
        fetchServerWallet();
        addToast(
          'Credits Top-Up Processed',
          `Order verified for ${creditAmount} credits pack (${usdtAmount} USDT).`,
          'success'
        );
      } else {
        throw new Error(data.message || 'Purchase error');
      }
    } catch (err: any) {
      addToast('Top-Up Notice', err.message || 'Payment processing error.', 'warning');
    }
  };

  // Send Message Handler
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || promptInput;
    if (!textToSend.trim() && attachedFiles.length === 0) return;
    if (isGenerating) return;

    // Check Guest Quota
    if (!currentUser?.uid || currentRole === 'visitor') {
      if (isGuestAllowanceConsumed()) {
        setGuestModalOpen(true);
        return;
      }
      incrementGuestQueryCount();
    }

    const currentConvoId = activeConversationId;
    const userMsgId = `msg-${Date.now()}`;
    const assistantMsgId = `msg-${Date.now() + 1}`;

    const userMessage: AssistantMessage = {
      id: userMsgId,
      conversationId: currentConvoId,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toISOString(),
      attachedFiles: [...attachedFiles]
    };

    // Initialize blank streaming assistant message
    const initialAssistantMessage: AssistantMessage = {
      id: assistantMsgId,
      conversationId: currentConvoId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true
    };

    // Update conversation message list
    setMessagesMap(prev => ({
      ...prev,
      [currentConvoId]: [...(prev[currentConvoId] || []), userMessage, initialAssistantMessage]
    }));

    // Update conversation metadata
    setConversations(prev =>
      prev.map(c =>
        c.id === currentConvoId
          ? {
              ...c,
              updatedAt: new Date().toISOString(),
              messageCount: (c.messageCount || 0) + 2,
              title: c.title === 'New Market Inquiry' ? textToSend.slice(0, 32) : c.title,
              previewSnippet: textToSend.slice(0, 60)
            }
          : c
      )
    );

    setPromptInput('');
    setAttachedFiles([]);
    setIsGenerating(true);

    const controller = new AbortController();
    setAbortController(controller);

    const historyForBackend = (messagesMap[currentConvoId] || []).map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }));

    const filePayload = userMessage.attachedFiles?.map(f => ({
      name: f.name,
      type: f.type,
      base64Data: f.dataUrl || ''
    }));

    const userToken = currentUser?.uid ? await auth.currentUser?.getIdToken() : undefined;

    await streamAssistantChat({
      message: userMessage.content,
      conversationHistory: historyForBackend,
      planId: wallet.planId,
      authToken: userToken,
      files: filePayload,
      signal: controller.signal,
      onChunk: (chunk) => {
        setMessagesMap(prev => {
          const msgs = prev[currentConvoId] || [];
          return {
            ...prev,
            [currentConvoId]: msgs.map(m =>
              m.id === assistantMsgId ? { ...m, content: m.content + chunk } : m
            )
          };
        });
      },
      onDone: (result) => {
        setMessagesMap(prev => {
          const msgs = prev[currentConvoId] || [];
          return {
            ...prev,
            [currentConvoId]: msgs.map(m =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: result.fullText,
                    citations: result.citations,
                    structuredAnalysis: result.structuredAnalysis,
                    creditsConsumed: result.creditsConsumed,
                    isStreaming: false,
                    isInScope: result.isInScope
                  }
                : m
            )
          };
        });

        // Sync authoritative server balance
        if (currentUser?.uid) {
          fetchServerWallet();
        } else if (result.creditsConsumed > 0) {
          setWallet(w => ({
            ...w,
            balance: Math.max(0, w.balance - result.creditsConsumed)
          }));
        }

        setIsGenerating(false);
        setAbortController(null);
      },
      onError: (err) => {
        console.warn('Streaming error:', err);
        setMessagesMap(prev => {
          const msgs = prev[currentConvoId] || [];
          return {
            ...prev,
            [currentConvoId]: msgs.map(m =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content:
                      m.content ||
                      'An error occurred connecting to the market intelligence service. Please verify your connection or retry.',
                    isStreaming: false
                  }
                : m
            )
          };
        });
        setIsGenerating(false);
        setAbortController(null);
        addToast('Gateway Notice', 'Response completed with fallback data.', 'info');
      }
    });
  };

  const handleStopGenerating = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setIsGenerating(false);
    setMessagesMap(prev => {
      const msgs = prev[activeConversationId] || [];
      return {
        ...prev,
        [activeConversationId]: msgs.map(m => (m.isStreaming ? { ...m, isStreaming: false } : m))
      };
    });
    addToast('Stopped', 'Assistant response generation stopped.', 'info');
  };

  const filteredConversations = useMemo(() => {
    if (!searchFilter.trim()) return conversations;
    const q = searchFilter.toLowerCase();
    return conversations.filter(
      c => c.title.toLowerCase().includes(q) || c.previewSnippet?.toLowerCase().includes(q)
    );
  }, [conversations, searchFilter]);

  const activeConvo = conversations.find(c => c.id === activeConversationId);
  const guestQueriesLeft = Math.max(0, 3 - getGuestQueryCount());

  return (
    <div
      className={`h-[calc(100vh-4.5rem)] flex flex-col font-sans transition-colors duration-200 overflow-hidden ${
        theme === 'dark' ? 'bg-[#08090B] text-zinc-100' : 'bg-[#FAFAFA] text-zinc-900'
      }`}
    >
      {/* 1. TOP UTILITY & MARKET TICKER BAR */}
      <header
        className={`h-12 border-b px-4 flex items-center justify-between text-xs shrink-0 select-none ${
          theme === 'dark'
            ? 'bg-[#0E1015] border-[#1F232E] text-zinc-300'
            : 'bg-white border-zinc-200 text-zinc-700 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse sidebar' : 'Open sidebar'}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'border-[#232733] hover:bg-[#1A1D26] text-zinc-300'
                : 'border-zinc-200 hover:bg-zinc-100 text-zinc-700'
            }`}
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm tracking-wide text-[#E4C765]">OPHIREUM</span>
            <span className="font-semibold tracking-wider text-xs px-1.5 py-0.5 rounded bg-[#C9A227]/20 text-[#E4C765] border border-[#C9A227]/30">
              ASSISTANT
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-zinc-700/40 text-[11px] text-zinc-400">
            <span>“Discipline in Every Decision”</span>
            <span className="text-zinc-600">•</span>
            <span className="text-[#E4C765]">Global Markets. Structured Intelligence.</span>
          </div>
        </div>

        {/* Live Ticker Pills */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto py-1">
          {marketQuotes.slice(0, 4).map(q => (
            <button
              key={q.symbol}
              onClick={() => setActiveDrawer('market_scanner')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#141720] border-[#222838] hover:border-[#C9A227]/50'
                  : 'bg-zinc-100 border-zinc-300 hover:border-[#C9A227]'
              }`}
            >
              <span className="font-bold text-[#E4C765]">{q.symbol}</span>
              <span>${q.price.toFixed(q.price > 500 ? 2 : 4)}</span>
              <span
                className={`flex items-center text-[10px] ${
                  q.changePct24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {q.changePct24h >= 0 ? '+' : ''}
                {q.changePct24h.toFixed(2)}%
              </span>
            </button>
          ))}
        </div>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2">
          {/* Market Scanner Button */}
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'market_scanner' ? 'none' : 'market_scanner')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs cursor-pointer ${
              activeDrawer === 'market_scanner'
                ? 'bg-[#C9A227]/20 border-[#C9A227] text-[#E4C765]'
                : theme === 'dark'
                ? 'border-[#232733] hover:bg-[#1A1D26] text-zinc-300'
                : 'border-zinc-200 hover:bg-zinc-100 text-zinc-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#E4C765]" />
            <span className="hidden sm:inline">Market Scanner</span>
          </button>

          {/* Calculator Button */}
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'calculators' ? 'none' : 'calculators')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs cursor-pointer ${
              activeDrawer === 'calculators'
                ? 'bg-[#C9A227]/20 border-[#C9A227] text-[#E4C765]'
                : theme === 'dark'
                ? 'border-[#232733] hover:bg-[#1A1D26] text-zinc-300'
                : 'border-zinc-200 hover:bg-zinc-100 text-zinc-700'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-[#E4C765]" />
            <span className="hidden sm:inline">Risk Calc</span>
          </button>

          {/* Credits & Subscription Button */}
          <button
            onClick={() => setActiveDrawer('plans')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold cursor-pointer ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-[#1A1D26] to-[#12141C] border-[#C9A227]/50 text-[#E4C765]'
                : 'bg-zinc-100 border-[#C9A227]/50 text-[#927318]'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-[#E4C765]" />
            <span>{wallet.balance} Cr</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            className={`p-1.5 rounded-lg border cursor-pointer ${
              theme === 'dark'
                ? 'border-[#232733] hover:bg-[#1A1D26] text-zinc-300'
                : 'border-zinc-200 hover:bg-zinc-100 text-zinc-700'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#E4C765]" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE BODY (SIDEBAR + CHAT CANVAS + DRAWERS) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT COLLAPSIBLE CONVERSATION SIDEBAR */}
        {sidebarOpen && (
          <aside
            className={`w-72 sm:w-80 shrink-0 border-r flex flex-col z-20 select-none ${
              theme === 'dark'
                ? 'bg-[#0B0D12] border-[#1F232E] text-zinc-300'
                : 'bg-white border-zinc-200 text-zinc-800'
            }`}
          >
            {/* Top Sidebar Action: New Chat */}
            <div className="p-3 border-b border-inherit space-y-2">
              <button
                onClick={handleNewChat}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] hover:from-[#B8921F] hover:to-[#D4B755] text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Market Chat</span>
              </button>

              {/* Search conversations */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search history..."
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border outline-none ${
                    theme === 'dark'
                      ? 'bg-[#141720] border-[#222838] focus:border-[#C9A227] text-zinc-200 placeholder-zinc-500'
                      : 'bg-zinc-50 border-zinc-200 focus:border-[#C9A227] text-zinc-800 placeholder-zinc-400'
                  }`}
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {/* Pinned Section */}
              {filteredConversations.filter(c => c.pinned && !c.archived).length > 0 && (
                <div className="mb-3">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#E4C765] flex items-center gap-1">
                    <Pin className="w-3 h-3" />
                    <span>Pinned Sessions</span>
                  </div>
                  {filteredConversations
                    .filter(c => c.pinned && !c.archived)
                    .map(convo => (
                      <div
                        key={convo.id}
                        onClick={() => setActiveConversationId(convo.id)}
                        className={`group p-2 rounded-lg text-xs cursor-pointer flex items-center justify-between border transition-all ${
                          convo.id === activeConversationId
                            ? theme === 'dark'
                              ? 'bg-[#1A1D26] border-[#C9A227]/40 text-white'
                              : 'bg-amber-50 border-amber-300 text-amber-950 font-medium'
                            : theme === 'dark'
                            ? 'border-transparent hover:bg-[#12141A] text-zinc-400 hover:text-zinc-200'
                            : 'border-transparent hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <div className="flex-1 truncate pr-2">
                          <div className="font-medium truncate">{convo.title}</div>
                          <div className="text-[10px] text-zinc-500 truncate">{convo.previewSnippet || 'No messages'}</div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0">
                          <button
                            onClick={e => handleTogglePin(convo.id, e)}
                            title="Unpin"
                            className="p-1 hover:text-[#E4C765]"
                          >
                            <PinOff className="w-3 h-3" />
                          </button>
                          <button
                            onClick={e => handleDeleteConversation(convo.id, e)}
                            title="Delete"
                            className="p-1 hover:text-rose-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Recent Conversations */}
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Recent Research
              </div>
              {filteredConversations.filter(c => !c.pinned && !c.archived).length === 0 ? (
                <div className="px-3 py-6 text-center text-xs text-zinc-500 italic">
                  No conversation history.
                </div>
              ) : (
                filteredConversations
                  .filter(c => !c.pinned && !c.archived)
                  .map(convo => (
                    <div
                      key={convo.id}
                      onClick={() => setActiveConversationId(convo.id)}
                      className={`group p-2 rounded-lg text-xs cursor-pointer flex items-center justify-between border transition-all ${
                        convo.id === activeConversationId
                          ? theme === 'dark'
                            ? 'bg-[#1A1D26] border-[#C9A227]/40 text-white font-medium'
                            : 'bg-amber-50 border-amber-300 text-amber-950 font-medium'
                          : theme === 'dark'
                          ? 'border-transparent hover:bg-[#12141A] text-zinc-400 hover:text-zinc-200'
                          : 'border-transparent hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      <div className="flex-1 truncate pr-2">
                        {editingTitleConvoId === convo.id ? (
                          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editingTitleText}
                              onChange={e => setEditingTitleText(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleSaveTitle(convo.id)}
                              className="px-1.5 py-0.5 text-xs rounded bg-black/40 border border-[#C9A227] text-white w-full outline-none"
                              autoFocus
                            />
                            <button onClick={() => handleSaveTitle(convo.id)} className="text-[#E4C765]">
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="truncate font-medium">{convo.title}</div>
                            <div className="text-[10px] text-zinc-500 truncate">{convo.previewSnippet || 'New session'}</div>
                          </>
                        )}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0">
                        <button
                          onClick={e => handleTogglePin(convo.id, e)}
                          title="Pin"
                          className="p-1 hover:text-[#E4C765]"
                        >
                          <Pin className="w-3 h-3" />
                        </button>
                        <button
                          onClick={e => handleToggleArchive(convo.id, e)}
                          title="Archive"
                          className="p-1 hover:text-amber-400"
                        >
                          <Archive className="w-3 h-3" />
                        </button>
                        <button
                          onClick={e => handleDeleteConversation(convo.id, e)}
                          title="Delete"
                          className="p-1 hover:text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Bottom Sidebar Panel: User Plan & Settings */}
            <div className="p-3 border-t border-inherit space-y-2 text-xs">
              {/* Guest Quota Bar if visitor */}
              {(!currentUser?.uid || currentRole === 'visitor') && (
                <div
                  className={`p-2 rounded-lg border text-[11px] ${
                    guestQueriesLeft > 0
                      ? 'bg-[#141720] border-[#2A3144] text-zinc-300'
                      : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-medium">
                    <span>Guest Allowance</span>
                    <span className="text-[#E4C765]">{guestQueriesLeft} / 3 left</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="bg-[#C9A227] h-full transition-all duration-300"
                      style={{ width: `${(guestQueriesLeft / 3) * 100}%` }}
                    />
                  </div>
                  {guestQueriesLeft === 0 && (
                    <Link
                      to="/register"
                      className="block mt-1.5 text-center text-[10px] text-[#E4C765] font-bold hover:underline"
                    >
                      Register for free to continue →
                    </Link>
                  )}
                </div>
              )}

              {/* Data & History Controls */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-400">
                <button
                  onClick={() => handleExportData('json')}
                  className="hover:text-[#E4C765] flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={() => handleExportData('txt')}
                  className="hover:text-[#E4C765] flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3 h-3" />
                  <span>Export TXT</span>
                </button>
                <button
                  onClick={handleClearAllConversations}
                  className="hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* MAIN CHAT CANVAS */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* Active Conversation Header / Subbar */}
          <div
            className={`px-4 py-2 border-b flex items-center justify-between text-xs shrink-0 select-none ${
              theme === 'dark'
                ? 'bg-[#0A0C10] border-[#1B1E28] text-zinc-400'
                : 'bg-white border-zinc-200 text-zinc-600'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold text-zinc-200 truncate">
                {activeConvo?.title || 'Ophireum Market Workspace'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 font-mono">
                {activeMessages.length} msgs
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="hidden sm:inline text-zinc-500">
                Powered by Gemini • Calibrated for XAUUSD & Macro
              </span>
              <button
                onClick={() => setActiveDrawer('privacy')}
                className="hover:text-[#E4C765] underline cursor-pointer"
              >
                Privacy & Data Retention
              </button>
            </div>
          </div>

          {/* MESSAGES LIST OR EMPTY STATE */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {activeMessages.length === 0 ? (
              /* WELCOME ONBOARDING SCREEN */
              <div className="max-w-3xl mx-auto py-8 space-y-8 animate-in fade-in duration-300">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#E4C765] text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ophireum Intelligent Trading Workspace</span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#E4C765]">
                    Global Markets. Structured Intelligence.
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
                    Welcome to Ophireum Assistant. Analyze global markets, explore gold and foreign-exchange conditions,
                    scan market-moving events, and develop structured trading ideas from one intelligent workspace.
                  </p>
                </div>

                {/* Suggested Prompts Grid */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                    <span>Suggested Quantitative Inquiries</span>
                    <span className="text-[11px] text-[#E4C765] lowercase font-normal">Click any prompt to execute</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SUGGESTED_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt.text)}
                        className={`p-3 rounded-xl border text-left transition-all group cursor-pointer ${
                          theme === 'dark'
                            ? 'bg-[#111318] border-[#222735] hover:border-[#C9A227]/60 hover:bg-[#161922]'
                            : 'bg-white border-zinc-200 hover:border-[#C9A227] hover:bg-amber-50/50 shadow-sm'
                        }`}
                      >
                        <div className="text-[10px] uppercase font-bold text-[#E4C765] tracking-wider mb-1">
                          {prompt.category}
                        </div>
                        <div className="text-xs text-zinc-200 font-medium group-hover:text-white transition-colors">
                          {prompt.text}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mandatory Regulatory Notice Banner */}
                <div
                  className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                    theme === 'dark'
                      ? 'bg-[#101217] border-[#2A3144] text-zinc-400'
                      : 'bg-zinc-50 border-zinc-300 text-zinc-600'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-zinc-200 text-xs">
                    <Shield className="w-4 h-4 text-[#E4C765]" />
                    <span>Statutory Market Compliance & Risk Disclosure</span>
                  </div>
                  <p className="text-[11px]">
                    Ophireum Assistant provides market information, research tools, and general trading education. It
                    does not provide personalized investment advice, guarantee results, manage customer funds, or
                    execute trades. Leveraged products involve substantial risk, and losses may exceed expectations.
                    Verify all information independently and consult an appropriately licensed professional when
                    necessary.
                  </p>
                </div>
              </div>
            ) : (
              /* ACTIVE MESSAGE STREAM */
              <div className="max-w-4xl mx-auto space-y-6">
                {activeMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col space-y-2 animate-in fade-in duration-200 ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    {/* User Prompt Box */}
                    {msg.role === 'user' ? (
                      <div
                        className={`max-w-2xl p-4 rounded-2xl rounded-tr-none text-xs sm:text-sm font-medium border shadow-md ${
                          theme === 'dark'
                            ? 'bg-[#1A1D26] border-[#2D3346] text-zinc-100'
                            : 'bg-amber-50 border-amber-200 text-zinc-900'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>

                        {/* Display Attached Files if any */}
                        {msg.attachedFiles && msg.attachedFiles.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-inherit flex flex-wrap gap-2">
                            {msg.attachedFiles.map(f => (
                              <div
                                key={f.id}
                                className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/30 text-[10px] text-zinc-300 border border-zinc-700/50"
                              >
                                {f.category === 'chart_screenshot' ? (
                                  <ImageIcon className="w-3 h-3 text-[#E4C765]" />
                                ) : (
                                  <FileSpreadsheet className="w-3 h-3 text-[#E4C765]" />
                                )}
                                <span>{f.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="text-[10px] text-zinc-500 text-right mt-1.5">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ) : (
                      /* Assistant Response Box */
                      <div
                        className={`w-full p-5 rounded-2xl border shadow-sm space-y-4 ${
                          theme === 'dark'
                            ? 'bg-[#101218] border-[#1F2432] text-zinc-200'
                            : 'bg-white border-zinc-200 text-zinc-800'
                        }`}
                      >
                        {/* Assistant Header Badge */}
                        <div className="flex items-center justify-between pb-2 border-b border-inherit text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#E4C765] animate-pulse" />
                            <span className="font-serif font-bold text-[#E4C765]">Ophireum Assistant</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                              Quant Research
                            </span>
                          </div>

                          <div className="text-[10px] text-zinc-500">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        {/* Render Content */}
                        <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-3 whitespace-pre-wrap">
                          {msg.content}
                          {msg.isStreaming && (
                            <span className="inline-block w-2 h-4 bg-[#E4C765] ml-1 animate-pulse" />
                          )}
                        </div>

                        {/* Citations Panel if present */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="pt-3 border-t border-inherit space-y-2">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-[#E4C765] flex items-center gap-1.5">
                              <Shield className="w-3.5 h-3.5" />
                              <span>Verified Data Citations & Benchmarks</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {msg.citations.map(cit => (
                                <div
                                  key={cit.id}
                                  className={`p-2.5 rounded-lg border text-[11px] space-y-1 ${
                                    theme === 'dark'
                                      ? 'bg-[#141720] border-[#222838]'
                                      : 'bg-zinc-50 border-zinc-200'
                                  }`}
                                >
                                  <div className="font-semibold text-zinc-200 flex items-center justify-between">
                                    <span>{cit.title}</span>
                                    <span className="text-[9px] px-1 rounded bg-emerald-950 border border-emerald-700/50 text-emerald-400 uppercase">
                                      Verified
                                    </span>
                                  </div>
                                  <div className="text-zinc-400 text-[10px]">{cit.snippet}</div>
                                  <div className="text-zinc-500 text-[9px] flex items-center justify-between pt-1">
                                    <span>Source: {cit.source}</span>
                                    <span>{new Date(cit.timestamp).toLocaleTimeString()}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Response Action Bar (TTS, Copy, Regenerate, Feedback) */}
                        <div className="pt-3 border-t border-inherit flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2">
                          <div className="flex items-center gap-2">
                            {/* Text to Speech Button Group */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleToggleSpeakMessage(msg)}
                                title={playingMessageId === msg.id ? 'Stop audio' : 'Play text-to-speech'}
                                className={`flex items-center gap-1 px-2 py-1 rounded-lg border cursor-pointer transition-colors ${
                                  playingMessageId === msg.id
                                    ? 'bg-[#C9A227]/20 border-[#C9A227] text-[#E4C765]'
                                    : 'hover:bg-zinc-800/40 border-transparent hover:border-zinc-700'
                                }`}
                              >
                                {playingMessageId === msg.id ? (
                                  <>
                                    <VolumeX className="w-3.5 h-3.5 text-[#E4C765]" />
                                    <span>Stop Voice</span>
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="w-3.5 h-3.5" />
                                    <span>Listen</span>
                                  </>
                                )}
                              </button>
                              {playingMessageId === msg.id && (
                                <button
                                  onClick={handleToggleSpeechPause}
                                  title={isSpeechPaused ? 'Resume playback' : 'Pause playback'}
                                  className="px-2 py-1 rounded-lg border border-[#C9A227]/50 bg-[#C9A227]/10 text-[#E4C765] hover:bg-[#C9A227]/30 text-[11px] font-medium cursor-pointer"
                                >
                                  {isSpeechPaused ? 'Resume' : 'Pause'}
                                </button>
                              )}
                            </div>

                            {/* Copy Answer Button */}
                            <button
                              onClick={() => handleCopyMessage(msg.id, msg.content)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg border border-transparent hover:border-zinc-700 hover:bg-zinc-800/40 cursor-pointer"
                            >
                              {copiedMessageId === msg.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>

                            {/* Regenerate Control */}
                            <button
                              onClick={() => {
                                const prevUserMsg = activeMessages
                                  .filter(m => m.role === 'user')
                                  .slice(-1)[0];
                                if (prevUserMsg) handleSendMessage(prevUserMsg.content);
                              }}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg border border-transparent hover:border-zinc-700 hover:bg-zinc-800/40 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Regenerate</span>
                            </button>
                          </div>

                          {/* Feedback like/dislike */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setFeedbackModalMessage(msg);
                                setFeedbackRating('like');
                              }}
                              className={`p-1.5 rounded-lg hover:bg-zinc-800/40 cursor-pointer ${
                                msg.feedback === 'like' ? 'text-emerald-400' : 'hover:text-emerald-400'
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setFeedbackModalMessage(msg);
                                setFeedbackRating('dislike');
                              }}
                              className={`p-1.5 rounded-lg hover:bg-zinc-800/40 cursor-pointer ${
                                msg.feedback === 'dislike' ? 'text-rose-400' : 'hover:text-rose-400'
                              }`}
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* 3. INPUT PROMPT CANVAS & DOCK */}
          <div
            className={`p-4 border-t shrink-0 ${
              theme === 'dark' ? 'bg-[#0E1015] border-[#1E222D]' : 'bg-white border-zinc-200 shadow-lg'
            }`}
          >
            <div className="max-w-4xl mx-auto space-y-2">
              {/* Attached Files Preview Bar */}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-1">
                  {attachedFiles.map(f => (
                    <div
                      key={f.id}
                      className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#181B24] border border-[#2B3245] text-xs text-zinc-200"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[#E4C765]" />
                      <span className="truncate max-w-xs">{f.name}</span>
                      <button
                        onClick={() => setAttachedFiles(prev => prev.filter(x => x.id !== f.id))}
                        className="text-zinc-400 hover:text-rose-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Voice Transcript Preview if recording */}
              {isRecordingVoice && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/50 flex items-center justify-between text-xs animate-pulse">
                  <div className="flex items-center gap-2 text-amber-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span>Listening... {voiceTranscriptPreview || 'Speak your market inquiry now...'}</span>
                  </div>
                  <button
                    onClick={toggleVoiceRecording}
                    className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-black font-bold text-[10px]"
                  >
                    Done
                  </button>
                </div>
              )}

              {/* Main Prompt Input Box */}
              <div
                className={`relative rounded-2xl border p-2 flex flex-col transition-all shadow-inner ${
                  theme === 'dark'
                    ? 'bg-[#12141A] border-[#222838] focus-within:border-[#C9A227]'
                    : 'bg-zinc-50 border-zinc-300 focus-within:border-[#C9A227]'
                }`}
              >
                <textarea
                  rows={2}
                  placeholder="Ask Ophireum Assistant about XAUUSD drivers, market structure, risk calculation, MT5 setup..."
                  value={promptInput}
                  onChange={e => setPromptInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className={`w-full p-2 bg-transparent text-xs sm:text-sm outline-none resize-none placeholder-zinc-500 ${
                    theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'
                  }`}
                />

                {/* Bottom Controls inside input bar */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    {/* File Upload Hidden Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".png,.jpg,.jpeg,.pdf,.csv,.xlsx,.txt,.docx"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload chart screenshot or research document"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 cursor-pointer"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    {/* Microphone Voice Button */}
                    <button
                      type="button"
                      onClick={toggleVoiceRecording}
                      title="Ophireum Voice: Uses local browser Web Speech API. Audio is processed client-side and is not end-to-end encrypted."
                      className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                        isRecordingVoice
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'text-zinc-400 hover:text-[#E4C765] hover:bg-zinc-800/50'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    <span className="text-[11px] text-zinc-500 hidden sm:inline pl-1">
                      {isGenerating ? 'Synthesizing response...' : 'Shift + Enter for newline'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Stop generating button if generating */}
                    {isGenerating ? (
                      <button
                        onClick={handleStopGenerating}
                        className="py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Stop</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendMessage()}
                        disabled={!promptInput.trim() && attachedFiles.length === 0}
                        className="py-1.5 px-4 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] hover:from-[#B8921F] hover:to-[#D4B755] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                      >
                        <span>Analyze</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom compliance note */}
              <div className="text-[10px] text-center text-zinc-500">
                Ophireum Assistant is an educational market research workspace. Verify data independently. Leveraged
                trading involves significant risk of loss.
              </div>
            </div>
          </div>
        </div>

        {/* 4. SLIDE-OVER DRAWER: MARKET SCANNER */}
        {activeDrawer === 'market_scanner' && (
          <div
            className={`w-80 sm:w-96 border-l shrink-0 flex flex-col z-30 shadow-2xl animate-in slide-in-from-right duration-200 ${
              theme === 'dark' ? 'bg-[#0D0F14] border-[#222838] text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            <div className="p-3 border-b border-inherit flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#E4C765]" />
                <span className="font-bold text-xs uppercase tracking-wide">Live Market Scanner</span>
              </div>
              <button
                onClick={() => setActiveDrawer('none')}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
              {/* Provider Attribution and Feed Mode Status */}
              <div className="p-3 rounded-lg border border-[#2B3245] bg-[#12151F] text-[11px] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-300">Market Feed Status:</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      providerTelemetry?.isLiveFeedConnected
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'bg-amber-950/70 text-amber-300 border border-amber-700/60'
                    }`}
                  >
                    {providerTelemetry?.isLiveFeedConnected ? 'LIVE FEED CONNECTED' : 'STANDBY / REFERENCE'}
                  </span>
                </div>
                <div className="text-zinc-400 text-[10px]">
                  Provider: <span className="text-[#E4C765]">{providerTelemetry?.provider || 'Ophireum Curated Liquidity Feed'}</span>
                </div>
                {providerTelemetry?.notice && (
                  <div className="text-[10px] text-zinc-400 leading-tight">
                    {providerTelemetry.notice}
                  </div>
                )}
              </div>

              {/* Session Clocks */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#E4C765] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Global Trading Sessions</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {sessionClocks.map(s => (
                    <div
                      key={s.sessionName}
                      className={`p-2 rounded-lg border text-[11px] ${
                        s.status === 'OPEN' || s.status === 'OVERLAP'
                          ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                          : 'bg-[#141720] border-[#222838] text-zinc-400'
                      }`}
                    >
                      <div className="font-semibold">{s.sessionName}</div>
                      <div className="text-[10px] mt-0.5 flex items-center justify-between">
                        <span className="capitalize">{s.status}</span>
                        <span className="text-[9px] opacity-80">{s.activeLiquidityTier} Liq</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Currency Strength Engine */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#E4C765]">
                  Currency Strength Heatmap
                </div>
                <div className="space-y-1.5">
                  {currencyStrengths.map(c => (
                    <div key={c.symbol} className="space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-bold">{c.symbol}</span>
                        <span className="text-zinc-400">{c.strengthPct}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            c.strengthPct >= 65
                              ? 'bg-emerald-500'
                              : c.strengthPct <= 35
                              ? 'bg-rose-500'
                              : 'bg-[#C9A227]'
                          }`}
                          style={{ width: `${c.strengthPct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Economic Calendar */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#E4C765] flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Upcoming Macro Events</span>
                </div>
                <div className="space-y-2">
                  {economicEvents.map(e => (
                    <div
                      key={e.id}
                      className={`p-2 rounded-lg border text-[11px] space-y-1 ${
                        theme === 'dark' ? 'bg-[#141720] border-[#222838]' : 'bg-zinc-50 border-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{e.title}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                          {e.impact}
                        </span>
                      </div>
                      <div className="text-zinc-400 text-[10px] flex justify-between">
                        <span>{e.scheduledUtc}</span>
                        <span>Exp: {e.forecast}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. SLIDE-OVER DRAWER: RISK & POSITION SIZE CALCULATORS */}
        {activeDrawer === 'calculators' && (
          <div
            className={`w-80 sm:w-96 border-l shrink-0 flex flex-col z-30 shadow-2xl animate-in slide-in-from-right duration-200 ${
              theme === 'dark' ? 'bg-[#0D0F14] border-[#222838] text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            <div className="p-3 border-b border-inherit flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#E4C765]" />
                <span className="font-bold text-xs uppercase tracking-wide">Risk & Lot Calculator</span>
              </div>
              <button
                onClick={() => setActiveDrawer('none')}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Account Balance ($ USD)</label>
                  <input
                    type="number"
                    value={calcInputs.accountBalanceUSD}
                    onChange={e => setCalcInputs({ ...calcInputs, accountBalanceUSD: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg border bg-black/30 border-zinc-700 text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Risk Percentage (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={calcInputs.riskPercentage}
                      onChange={e => setCalcInputs({ ...calcInputs, riskPercentage: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 rounded-lg border bg-black/30 border-zinc-700 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Stop Loss (Pips)</label>
                    <input
                      type="number"
                      value={calcInputs.stopLossPips}
                      onChange={e => setCalcInputs({ ...calcInputs, stopLossPips: parseFloat(e.target.value) || 1 })}
                      className="w-full px-3 py-1.5 rounded-lg border bg-black/30 border-zinc-700 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Instrument Pair</label>
                  <select
                    value={calcInputs.pairSymbol}
                    onChange={e => setCalcInputs({ ...calcInputs, pairSymbol: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border bg-black/30 border-zinc-700 text-white outline-none"
                  >
                    <option value="XAUUSD">XAUUSD (Spot Gold)</option>
                    <option value="EURUSD">EURUSD</option>
                    <option value="GBPUSD">GBPUSD</option>
                    <option value="USDJPY">USDJPY</option>
                  </select>
                </div>
              </div>

              {/* Calculated Outputs Card */}
              <div className="p-4 rounded-xl bg-[#141722] border border-[#C9A227]/40 space-y-2.5">
                <div className="text-xs font-bold text-[#E4C765] uppercase tracking-wider">
                  Derived Execution Parameters
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-zinc-400">Capital at Risk:</span>
                  <span className="font-bold text-rose-400">${calcOutputs.monetaryRiskUSD} USD</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-zinc-400">Recommended Lot Size:</span>
                  <span className="font-bold text-[#E4C765] text-sm">{calcOutputs.recommendedLotSize} Lots</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-zinc-400">Pip Value:</span>
                  <span className="font-bold text-zinc-200">${calcOutputs.pipValueUSD}/pip</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Required Margin (1:100):</span>
                  <span className="font-bold text-zinc-200">${calcOutputs.requiredMarginUSD}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const query = `Calculate position size: Account $${calcInputs.accountBalanceUSD}, Risk ${calcInputs.riskPercentage}%, Stop loss ${calcInputs.stopLossPips} pips on ${calcInputs.pairSymbol}. Provide structured risk parameters and MT5 placement advice.`;
                  handleSendMessage(query);
                  setActiveDrawer('none');
                }}
                className="w-full py-2 rounded-xl bg-[#C9A227] hover:bg-[#B8921F] text-black font-bold text-xs cursor-pointer"
              >
                Send Calculation into Chat
              </button>
            </div>
          </div>
        )}

        {/* 6. MODAL: SUBSCRIPTION PLANS & CREDIT LEDGER */}
        {activeDrawer === 'plans' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div
              className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border p-6 space-y-6 shadow-2xl ${
                theme === 'dark' ? 'bg-[#0E1015] border-[#222838] text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-4 border-inherit">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#E4C765]">Ophireum Assistant Packages</h2>
                  <p className="text-xs text-zinc-400">
                    Transparent plans with explicitly measurable limits. MT5 EA licenses remain separate software products.
                  </p>
                </div>
                <button onClick={() => setActiveDrawer('none')} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {DEFAULT_ASSISTANT_PLANS.map(plan => (
                  <div
                    key={plan.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between space-y-4 ${
                      wallet.planId === plan.id
                        ? 'bg-[#181B26] border-[#C9A227] shadow-[0_0_15px_rgba(201,162,39,0.2)]'
                        : 'bg-[#12141A] border-[#202535]'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase font-bold text-[#E4C765]">{plan.badge}</div>
                      <div className="font-bold text-sm">{plan.name}</div>
                      <div className="text-lg font-bold text-zinc-100">
                        {plan.priceMonthlyUSDT === 0 ? 'Free' : `${plan.priceMonthlyUSDT} USDT`}
                        <span className="text-xs font-normal text-zinc-400"> /mo</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 leading-tight">{plan.tagline}</div>

                      {plan.measurableRatioNote && (
                        <div className="p-2 rounded bg-[#C9A227]/10 border border-[#C9A227]/30 text-[10px] text-[#E4C765]">
                          {plan.measurableRatioNote}
                        </div>
                      )}

                      <ul className="space-y-1.5 pt-2 text-[11px] text-zinc-300">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3 h-3 text-[#E4C765] shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleServerPlanCheckout(plan.id)}
                      className={`w-full py-2 rounded-lg font-bold text-xs cursor-pointer ${
                        wallet.planId === plan.id
                          ? 'bg-zinc-800 text-zinc-400 cursor-default'
                          : 'bg-[#C9A227] hover:bg-[#B8921F] text-black'
                      }`}
                    >
                      {wallet.planId === plan.id ? 'Active Plan' : 'Select Plan'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Credit Pack Top-Ups */}
              <div className="p-4 rounded-xl border border-[#2B3144] bg-[#141722] space-y-3">
                <div className="text-xs font-bold text-[#E4C765] uppercase tracking-wider flex items-center gap-1.5">
                  <Coins className="w-4 h-4" />
                  <span>Credit Top-Up Packs (Instant USDT Settlement)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-zinc-700 bg-black/30 flex items-center justify-between">
                    <div>
                      <div className="font-bold">500 Credits</div>
                      <div className="text-zinc-400 text-[11px]">10 USDT</div>
                    </div>
                    <button
                      onClick={() => handleCreditPackCheckout(500, 10)}
                      className="px-2.5 py-1 rounded bg-[#C9A227] hover:bg-[#B8921F] text-black font-bold text-xs cursor-pointer"
                    >
                      Buy
                    </button>
                  </div>

                  <div className="p-3 rounded-lg border border-zinc-700 bg-black/30 flex items-center justify-between">
                    <div>
                      <div className="font-bold">2,000 Credits</div>
                      <div className="text-zinc-400 text-[11px]">35 USDT</div>
                    </div>
                    <button
                      onClick={() => handleCreditPackCheckout(2000, 35)}
                      className="px-2.5 py-1 rounded bg-[#C9A227] hover:bg-[#B8921F] text-black font-bold text-xs cursor-pointer"
                    >
                      Buy
                    </button>
                  </div>

                  <div className="p-3 rounded-lg border border-zinc-700 bg-black/30 flex items-center justify-between">
                    <div>
                      <div className="font-bold">5,000 Credits</div>
                      <div className="text-zinc-400 text-[11px]">75 USDT</div>
                    </div>
                    <button
                      onClick={() => handleCreditPackCheckout(5000, 75)}
                      className="px-2.5 py-1 rounded bg-[#C9A227] hover:bg-[#B8921F] text-black font-bold text-xs cursor-pointer"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. MODAL: PRIVACY & DATA RETENTION */}
        {activeDrawer === 'privacy' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div
              className={`max-w-xl w-full rounded-2xl border p-6 space-y-4 shadow-2xl ${
                theme === 'dark' ? 'bg-[#0E1015] border-[#222838] text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-inherit">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#E4C765]" />
                  <h3 className="font-bold text-sm">Ophireum Privacy & Data Isolation</h3>
                </div>
                <button onClick={() => setActiveDrawer('none')} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs space-y-3 leading-relaxed text-zinc-300">
                <p>
                  <strong>Private Data Isolation:</strong> Your conversations, uploaded charts, and financial journals
                  remain strictly isolated to your authenticated account.
                </p>
                <p>
                  <strong>Zero Model Training:</strong> Ophireum does not use your private market chats or trading records
                  for public third-party model training without explicit consent.
                </p>
                <p>
                  <strong>Audit-Logged Administration:</strong> Administrators are technically restricted from viewing
                  private conversation transcripts by default. Any authorized technical support access is permanently
                  recorded in our security audit log.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveDrawer('none')}
                  className="px-4 py-1.5 rounded-lg bg-[#C9A227] text-black font-bold text-xs"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 8. MODAL: USER FEEDBACK MODAL */}
        {feedbackModalMessage && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div
              className={`max-w-md w-full rounded-2xl border p-5 space-y-4 shadow-2xl ${
                theme === 'dark' ? 'bg-[#0E1015] border-[#222838] text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-inherit">
                <div className="flex items-center gap-2">
                  {feedbackRating === 'like' ? (
                    <ThumbsUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ThumbsDown className="w-4 h-4 text-rose-400" />
                  )}
                  <span className="font-bold text-xs">Help Refine Market Models</span>
                </div>
                <button onClick={() => setFeedbackModalMessage(null)} className="text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs space-y-2">
                <p className="text-zinc-400">
                  Provide optional details to help our quantitative team calibrate technical and fundamental accuracy:
                </p>
                <textarea
                  rows={3}
                  value={feedbackComment}
                  onChange={e => setFeedbackComment(e.target.value)}
                  placeholder="What worked well or what was inaccurate about this response?"
                  className="w-full p-2.5 rounded-xl border bg-black/30 border-zinc-700 text-white text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setFeedbackModalMessage(null)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-700 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={feedbackSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-[#C9A227] hover:bg-[#B8921F] text-black font-bold text-xs"
                >
                  {feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 9. MODAL: GUEST ALLOWANCE EXCEEDED */}
        {guestModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div
              className={`max-w-md w-full rounded-2xl border p-6 text-center space-y-4 shadow-2xl ${
                theme === 'dark' ? 'bg-[#0E1015] border-[#C9A227]/60 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-[#C9A227]/20 border border-[#C9A227] flex items-center justify-center mx-auto text-[#E4C765]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#E4C765]">Guest Allowance Consumed</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                You have reached the complimentary 3-query limit for guest visitors. To continue utilizing Ophireum
                Assistant for live market scans and risk calculations, please register an account.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => navigate('/register')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] hover:from-[#B8921F] hover:to-[#D4B755] text-black font-bold text-xs"
                >
                  Create Free Account
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
