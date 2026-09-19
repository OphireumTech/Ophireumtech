/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Client Trading Compliance, Risk Disclosure & Digital Signing System Types
 */

export type AccountClassification =
  | 'individual'
  | 'sole_proprietor'
  | 'corporation'
  | 'partnership'
  | 'trust'
  | 'institution'
  | 'other_legal_entity';

export type ClientCategorization =
  | 'retail'
  | 'professional'
  | 'eligible_counterparty'
  | 'institutional';

export type VerificationStatus =
  | 'not_submitted'
  | 'submitted'
  | 'automated_review'
  | 'manual_review_required'
  | 'verified'
  | 'rejected'
  | 'expired';

export type AMLScreeningStatus =
  | 'NOT_SCREENED'
  | 'SCREENING'
  | 'NO_MATCH'
  | 'POTENTIAL_MATCH'
  | 'MANUAL_REVIEW'
  | 'CONFIRMED_MATCH';

export type AMLRiskDecision =
  | 'CLEAR'
  | 'REVIEW'
  | 'EDD_REQUIRED'
  | 'RESTRICTED'
  | 'REJECTED';

export type AppropriatenessResult =
  | 'ASSESSMENT_COMPLETE'
  | 'ADDITIONAL_INFORMATION_REQUIRED'
  | 'RISK_WARNING_REQUIRED'
  | 'MANUAL_REVIEW_REQUIRED'
  | 'SERVICE_RESTRICTED';

export type PerformanceBasis =
  | 'LIVE_VERIFIED'
  | 'LIVE_UNVERIFIED'
  | 'DEMO'
  | 'BACKTEST'
  | 'SIMULATED'
  | 'HYPOTHETICAL';

export type LegalReviewStatus =
  | 'DRAFT'
  | 'INTERNAL_REVIEW'
  | 'EXTERNAL_COUNSEL_REVIEW'
  | 'APPROVED'
  | 'REQUIRES_UPDATE';

// 13 Mandatory Compliance Gates
export type ComplianceGateId =
  | 'gate_1_account_verification'
  | 'gate_2_identity_kyc'
  | 'gate_3_kyb_ubo'
  | 'gate_4_aml_risk_review'
  | 'gate_5_financial_trading_profile'
  | 'gate_6_appropriateness_assessment'
  | 'gate_7_broker_account_verification'
  | 'gate_8_risk_disclosures'
  | 'gate_9_legal_agreements'
  | 'gate_10_digital_signature'
  | 'gate_11_payment_verification'
  | 'gate_12_final_compliance_review'
  | 'gate_13_technology_activation';

export interface ComplianceGate {
  id: ComplianceGateId;
  gateNumber: number;
  title: string;
  description: string;
  status: 'locked' | 'pending' | 'in_review' | 'completed' | 'exempt';
  requiredFor: 'all' | 'corporate_only' | 'individual_only';
  completedAt?: string;
  notes?: string;
}

// Individual KYC Profile
export interface IndividualKYCRecord {
  legalFirstName: string;
  middleName?: string;
  legalLastName: string;
  suffix?: string;
  previousNames?: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  additionalCitizenship?: string;
  residentialAddress: {
    street: string;
    city: string;
    provinceState: string;
    postalCode: string;
    country: string;
  };
  mailingAddressSame: boolean;
  mailingAddress?: {
    street: string;
    city: string;
    provinceState: string;
    postalCode: string;
    country: string;
  };
  mobileNumber: string;
  email: string;
  occupation: string;
  employer: string;
  natureOfEmployment: string;
  employmentStatus: 'employed' | 'self_employed' | 'retired' | 'student' | 'unemployed';
  taxResidence: string;
  taxIdentificationNumber: string;
  tinIssuingCountry: string;
  documentType: 'passport' | 'national_id' | 'drivers_license' | 'other_government_id';
  documentNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expirationDate: string;
  countryOfIssue: string;
  documentFrontHash?: string;
  documentBackHash?: string;
  livenessVerified: boolean;
  status: VerificationStatus;
  submittedAt?: string;
  verifiedAt?: string;
  reviewerNotes?: string;
}

// Corporate / KYB Profile
export interface CorporateKYBRecord {
  legalCompanyName: string;
  tradingName?: string;
  registrationNumber: string;
  jurisdiction: string;
  registrationDate: string;
  registeredAddress: {
    street: string;
    city: string;
    provinceState: string;
    postalCode: string;
    country: string;
  };
  principalBusinessAddress: {
    street: string;
    city: string;
    provinceState: string;
    postalCode: string;
    country: string;
  };
  website: string;
  businessActivity: string;
  industry: string;
  taxIdentificationNumber: string;
  regulatoryStatus?: string;
  entityType: AccountClassification;
  status: VerificationStatus;
  uploadedDocuments: {
    type: string;
    name: string;
    hash: string;
    uploadedAt: string;
  }[];
}

// Beneficial Ownership (UBO)
export interface BeneficialOwner {
  id: string;
  fullLegalName: string;
  dateOfBirth: string;
  nationality: string;
  residentialAddress: string;
  ownershipPercentage: number;
  votingPercentage: number;
  controlMechanism: 'direct_shares' | 'voting_rights' | 'executive_control' | 'trustee' | 'other';
  position: string;
  idDocumentType: string;
  idDocumentNumber: string;
  sourceOfWealth: string;
  isPEP: boolean;
  sanctionsScreeningStatus: AMLScreeningStatus;
  certifiedAccurate: boolean;
}

// Authorized Representative
export interface AuthorizedRepresentative {
  id: string;
  name: string;
  position: string;
  email: string;
  mobile: string;
  governmentIdNumber: string;
  authorizationType: 'board_resolution' | 'power_of_attorney' | 'secretary_certificate' | 'statutory_director';
  effectiveDate: string;
  expirationDate?: string;
  powers: {
    openAccount: boolean;
    purchaseTechnology: boolean;
    connectTradingAccounts: boolean;
    signAgreements: boolean;
    authorizePayments: boolean;
    bindUnbindAccounts: boolean;
  };
  documentHash?: string;
}

// Source of Funds & Source of Wealth
export interface SourceOfFundsRecord {
  primarySource:
    | 'employment_income'
    | 'business_income'
    | 'investment_income'
    | 'savings'
    | 'property_sale'
    | 'company_profits'
    | 'inheritance'
    | 'gift'
    | 'loan'
    | 'investment_liquidation'
    | 'other';
  otherDescription?: string;
  estimatedAnnualFundingUSD: string;
  originatingInstitution: string;
  institutionCountry: string;
  accountOwnershipConfirmed: boolean;
  supportingDocumentType?: string;
  documentHash?: string;
  recordedAt: string;
}

export interface SourceOfWealthRecord {
  primarySources: string[];
  estimatedAnnualIncomeRangeUSD: string;
  estimatedNetWorthRangeUSD: string;
  estimatedLiquidNetWorthRangeUSD: string;
  estimatedInvestableAssetsRangeUSD: string;
  supportingDocumentType?: string;
  recordedAt: string;
}

// Trading Experience Questionnaire
export interface TradingExperienceRecord {
  yearsTradingTotal: number;
  forexExperienceYears: number;
  cfdExperienceYears: number;
  commodityExperienceYears: number;
  goldXAUUSDExperienceYears: number;
  leveragedProductExperienceYears: number;
  algorithmicTradingExperienceYears: number;
  eaTradingExperienceYears: number;
  tradesPerYear: '0_10' | '11_50' | '51_200' | '200_plus';
  typicalTradeSizeLots: string;
  previousMaxLeverageUsed: string;
  knowledgeAnswers: {
    understandsMargin: boolean;
    understandsStopOut: boolean;
    understandsLiquidation: boolean;
    understandsDrawdown: boolean;
    understandsSlippageAndSpread: boolean;
    understandsExecutionAndLatencyRisk: boolean;
    understandsTechnologyFailures: boolean;
    understandsMarketGaps: boolean;
  };
  questionnaireVersion: string;
  submittedAt: string;
}

// Financial Capacity & Living Expenses Test
export interface FinancialCapacityRecord {
  annualIncomeRangeUSD: string;
  netWorthRangeUSD: string;
  liquidNetWorthUSD: string;
  intendedTradingCapitalUSD: string;
  expectedTradingFrequency: 'daily' | 'weekly' | 'monthly';
  // Vital compliance filter:
  couldLossMateriallyAffectLivingExpenses: boolean;
  capacityNotes?: string;
  evaluatedAt: string;
}

// Broker Account Record
export interface BrokerVerificationRecord {
  id: string;
  brokerLegalName: string;
  brokerWebsite: string;
  brokerRegulator?: string;
  brokerJurisdiction: string;
  tradingPlatform: 'MT5' | 'MT4' | 'Other';
  tradingServer: string;
  accountNumber: string;
  accountType: 'Demo' | 'Live Standard' | 'Live Raw' | 'Live Pro' | 'Live ECN';
  accountCurrency: string;
  leverage: string;
  accountHolderName: string;
  ownershipType: 'individual' | 'company';
  ownershipVerified: boolean;
  nameMatchConfidence: 'exact_match' | 'fuzzy_match' | 'name_mismatch';
  proofDocumentHash?: string;
  status: 'pending_review' | 'verified' | 'mismatch_flagged' | 'rejected';
  verifiedAt?: string;
  reviewerNotes?: string;
}

// Digital Signature & Evidence Record
export interface SignatureEvidenceRecord {
  transactionId: string;
  signerLegalName: string;
  signerEmail: string;
  accountId: string;
  documentTitle: string;
  documentId: string;
  documentVersion: string;
  documentHashSha256: string;
  signingTimestamp: string;
  timezone: string;
  ipAddress: string;
  sessionId: string;
  authenticationMethod: 'firebase_auth_session' | 'mfa_confirmed';
  userAgent: string;
  signatureMethod: 'typed_legal_name' | 'drawn_signature';
  signatureDataUrl?: string;
  acknowledgements: {
    termsOfService: boolean;
    technologyPurchaseAgreement: boolean;
    automatedTradingAuthorization: boolean;
    tradingRiskDisclosure: boolean;
    leverageRiskDisclosure: boolean;
    noProfitGuaranteeDisclosure: boolean;
    performanceDisclosure: boolean;
    brokerThirdPartyDisclosure: boolean;
    xauusdGoldRiskDisclosure: boolean;
    clientControlDisclosure: boolean;
    privacyNotice: boolean;
    electronicCommunicationsConsent: boolean;
    electronicSignatureConsent: boolean;
    feesAndBillingAuthorization: boolean;
  };
  completionStatus: 'COMPLETED_IMMUTABLE';
}

export interface SignatureCertificate {
  certificateId: string;
  clientLegalName: string;
  agreementTitle: string;
  agreementVersion: string;
  documentId: string;
  documentHashSha256: string;
  signatureTransactionRef: string;
  timestampUtc: string;
  authenticationMethod: string;
  complianceEngineSeal: string;
}

// Client Document Vault Item
export interface DocumentVaultItem {
  id: string;
  folderCategory:
    | 'Identity'
    | 'Address'
    | 'Corporate'
    | 'UBO'
    | 'Financial'
    | 'Source of Funds'
    | 'Source of Wealth'
    | 'Broker'
    | 'Agreements'
    | 'Signed Agreements'
    | 'Signature Certificates'
    | 'Payments'
    | 'Tax'
    | 'Compliance'
    | 'Other';
  fileName: string;
  fileSizeKb: number;
  mimeType: string;
  sha256Hash: string;
  securityPipelineStatus: {
    isolatedStaging: boolean;
    signatureValidated: boolean;
    malwareScanned: boolean;
    encryptedAtRest: boolean;
    humanReviewed: boolean;
  };
  uploadedAt: string;
  expiresAt?: string;
  version: number;
  status: 'staged' | 'clean' | 'approved' | 'quarantine' | 'expired';
}

// Jurisdiction Configuration
export interface JurisdictionRule {
  countryCode: string;
  countryName: string;
  serviceStatus: 'ALLOWED' | 'RESTRICTED' | 'PROHIBITED' | 'MANUAL_REVIEW';
  permittedClientTypes: AccountClassification[];
  retailPermitted: boolean;
  professionalPermitted: boolean;
  institutionalPermitted: boolean;
  mandatoryKycLevel: 'basic' | 'standard' | 'enhanced';
  mandatoryKybRequired: boolean;
  uboOwnershipThresholdPct: number; // e.g. 10% or 25%
  appropriatenessAssessmentRequired: boolean;
  specificRiskWarningText?: string;
  localRegulatorName?: string;
  marketingRestrictionsNotice?: string;
  coolingOffDays: number;
  legalReviewStatus: LegalReviewStatus;
  lastLegalReviewDate: string;
  reviewedByCounsel: string;
}

// Privacy & Consent
export interface PrivacyConsentSettings {
  essentialServiceData: boolean; // strictly required
  securityAndAuditLogs: boolean; // strictly required
  brokerTelemetryProcessing: boolean; // required for EA execution
  optionalPerformanceBenchmarking: boolean;
  optionalProductUpdateNotices: boolean;
  optionalEducationalInsights: boolean;
  dataRetentionPolicyAcknowledged: boolean;
  crossBorderTransferAcknowledged: boolean;
  updatedAt: string;
}

export interface DataSubjectRequest {
  id: string;
  userId: string;
  requestType: 'access_my_data' | 'correct_my_data' | 'download_my_data' | 'object_to_processing' | 'withdraw_consent' | 'request_deletion';
  details: string;
  status: 'received' | 'in_review' | 'fulfilled' | 'legally_exempt_declined';
  submittedAt: string;
  completedAt?: string;
  complianceNotes?: string;
}

// Formal Complaint
export interface FormalComplaintRecord {
  caseNumber: string; // e.g. CMP-2026-0814
  userId: string;
  userEmail: string;
  category: 'execution_technology' | 'billing_payment' | 'licensing_binding' | 'compliance_kyc' | 'service_availability' | 'other';
  subject: string;
  description: string;
  relatedTransactionId?: string;
  relatedAgreementVersion?: string;
  requestedResolution: string;
  status: 'Received' | 'Under Review' | 'Information Requested' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  auditEvents: {
    timestamp: string;
    actor: string;
    action: string;
    note: string;
  }[];
}

// Regulatory Audit Trail
export type AuditEventType =
  | 'AUTH_LOGIN'
  | 'KYC_SUBMITTED'
  | 'KYC_APPROVED'
  | 'KYB_SUBMITTED'
  | 'SIGNATURE_CREATED'
  | 'EA_ACTIVATED'
  | 'EA_DEACTIVATED'
  | 'DOCUMENT_UPLOADED'
  | 'CONSENT_UPDATED'
  | 'DATA_EXPORT_REQUESTED'
  | 'GATE_TRANSITION'
  | 'EMERGENCY_STOP_TRIGGERED';

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  eventType: AuditEventType;
  actionDescription: string;
  actorEmail: string;
  actorRole: string;
  ipAddress: string;
  sha256Hash: string;
  outcome: 'SUCCESS' | 'BLOCKED' | 'FLAGGED' | 'COMPLIANT';
  metadata?: Record<string, any>;
}

