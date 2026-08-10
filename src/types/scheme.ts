export type EnterpriseSize = 'micro' | 'small' | 'medium';

export type Sector = 
  | 'food_processing'
  | 'textile'
  | 'manufacturing'
  | 'general_msme'
  | 'other';

export type Objective = 
  | 'funding'
  | 'machinery'
  | 'expansion'
  | 'export'
  | 'marketing'
  | 'infrastructure'
  | 'skill_development'
  | 'energy_efficiency';

export type Registration = 
  | 'udyam'
  | 'gst'
  | 'fssai'
  | 'iec'
  | 'other';

export type SchemeType = 'subsidy' | 'grant' | 'loan' | 'incentive' | 'training' | 'other';

export type VerificationStatus = 'verified' | 'needs_verification' | 'expired';

export interface EligibilityRule {
  id: string;
  schemeId: string;
  field: keyof UserProfile;
  operator: 'equals' | 'includes' | 'gte' | 'lte' | 'in';
  value: any;
  weight: number;
  explanation: string;
}

export interface Scheme {
  id: string;
  name: string;
  shortName: string;
  ministry: string;
  department?: string;
  description: string;
  sectors: Sector[];
  subSectors?: string[];
  states: string[]; // ['All'] or specific states like ['Maharashtra']
  schemeType: SchemeType;
  objectives: Objective[];
  benefitSummary: string;
  benefitAmount?: string;
  beneficiary?: string;
  enterpriseSizes: EnterpriseSize[];
  businessStages?: string[];
  requiredRegistrations?: Registration[];
  documents: string[];
  applicationSteps: string[];
  applicationUrl: string;
  officialSourceUrl: string;
  guidelineUrl?: string;
  lastVerifiedAt: string;
  verificationStatus: VerificationStatus;
}

export interface UserProfile {
  sector?: Sector;
  state?: string;
  district?: string;
  enterpriseSize?: EnterpriseSize;
  annualTurnover?: number; // in INR lakhs
  employeeCount?: number;
  businessAge?: number; // in years
  registrations?: Registration[];
  objectives?: Objective[];
}

export interface MatchCriterion {
  label: string;
  matched: boolean;
  details?: string;
}

export interface Recommendation {
  scheme: Scheme;
  matchScore: number; // 0 to 100
  matchedCriteria: string[];
  unmatchedCriteria: string[];
  warnings: string[];
  reasons: string[];
}
