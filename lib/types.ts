export type TrustScoreCategory = 'Likely Safe' | 'Uncertain' | 'Likely Spam' | 'Possibly Urgent';

export type EdgeCaseScenario = 
  | 'recycled_number' 
  | 'urgent_burst' 
  | 'clean_legitimate' 
  | 'obvious_spam' 
  | 'general';

export interface CallRecord {
  id: string;
  callerNumber: string;
  callerName?: string;
  timestamp: string; // ISO 8601 string
  callDuration: number; // Duration in seconds
  answered: boolean;
  isStaticSpamTagged: boolean; // Static telecom tag flag
  spamTagAgeDays: number; // Age of the static tag in days (0 if not tagged)
  callsInLast24h: number; // Frequency metric
  hasHistoricalLongCall: boolean; // Had a 2+ min (120s+) conversation previously
  isSavedContact?: boolean; // In user's address book
  pastAnswerRate?: number; // 0.0 - 1.0 ratio of user answering this caller
  recentBurstCount?: number; // Calls received from this caller in the last 10 minutes
  scenarioCategory?: EdgeCaseScenario;
}

export interface ScoreBreakdown {
  baseScore: number;
  tagAgeDecayBonus: number;
  historicalTrustBonus: number;
  urgencyOverrideBonus: number;
  frequencyPenalty: number;
  durationPenalty: number;
  savedContactBonus: number;
}

export interface TrustEvaluation {
  trustScore: number; // 0 to 100
  category: TrustScoreCategory;
  reasoning: string;
  isUrgencyOverride: boolean;
  isRescued: boolean; // Static Tag = true, but evaluated as Safe/Urgent
  breakdown: ScoreBreakdown;
  riskFactors: string[];
  trustFactors: string[];
}

export interface AnalyticsSummaryStats {
  totalCalls: number;
  staticSpamCount: number;
  staticSpamPercent: number;
  rescuedUrgentCount: number;
  rescuedUrgentPercent: number;
  averageTrustScore: number;
  categoryCounts: Record<TrustScoreCategory, number>;
  scoreDistribution: { range: string; count: number }[];
  dailyTrend: { date: string; total: number; staticSpam: number; rescued: number }[];
}

export interface PresetScenario {
  id: EdgeCaseScenario;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  badgeColor: string;
  sampleRecord: CallRecord;
}
