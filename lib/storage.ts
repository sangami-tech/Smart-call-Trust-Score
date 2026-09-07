import { CallRecord, AnalyticsSummaryStats, TrustScoreCategory } from './types';
import { generateSeedCallRecords } from './seedData';
import { evaluateTrustScore } from './scoring';

const STORAGE_KEY = 'smart_call_trust_score_records_v1';

export function getStoredCallRecords(): CallRecord[] {
  if (typeof window === 'undefined') {
    return generateSeedCallRecords(500);
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const initial = generateSeedCallRecords(500);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed: CallRecord[] = JSON.parse(data);
    return parsed.length > 0 ? parsed : generateSeedCallRecords(500);
  } catch (e) {
    console.error("Failed to load call records from localStorage", e);
    return generateSeedCallRecords(500);
  }
}

export function saveCallRecords(records: CallRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error("Failed to save call records to localStorage", e);
  }
}

export function resetSeedCallRecords(): CallRecord[] {
  const fresh = generateSeedCallRecords(500);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  }
  return fresh;
}

export function addCallRecord(record: CallRecord): CallRecord[] {
  const existing = getStoredCallRecords();
  const updated = [record, ...existing];
  saveCallRecords(updated);
  return updated;
}

export function computeAnalyticsStats(records: CallRecord[]): AnalyticsSummaryStats {
  const totalCalls = records.length;
  let staticSpamCount = 0;
  let rescuedUrgentCount = 0;
  let totalTrustScoreSum = 0;

  const categoryCounts: Record<TrustScoreCategory, number> = {
    'Likely Safe': 0,
    'Uncertain': 0,
    'Likely Spam': 0,
    'Possibly Urgent': 0,
  };

  const scoreBuckets = {
    '0-20': 0,
    '21-40': 0,
    '41-60': 0,
    '61-80': 0,
    '81-100': 0,
  };

  // Group by day for daily trend chart (last 7 days)
  const dailyMap: Record<string, { total: number; staticSpam: number; rescued: number }> = {};

  records.forEach((rec) => {
    const evalResult = evaluateTrustScore(rec);
    totalTrustScoreSum += evalResult.trustScore;
    categoryCounts[evalResult.category] += 1;

    if (rec.isStaticSpamTagged) {
      staticSpamCount += 1;
    }

    if (evalResult.isRescued || evalResult.isUrgencyOverride) {
      rescuedUrgentCount += 1;
    }

    // Score distribution bucket
    const score = evalResult.trustScore;
    if (score <= 20) scoreBuckets['0-20']++;
    else if (score <= 40) scoreBuckets['21-40']++;
    else if (score <= 60) scoreBuckets['41-60']++;
    else if (score <= 80) scoreBuckets['61-80']++;
    else scoreBuckets['81-100']++;

    // Daily grouping
    const dateKey = rec.timestamp ? rec.timestamp.split('T')[0] : 'Today';
    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = { total: 0, staticSpam: 0, rescued: 0 };
    }
    dailyMap[dateKey].total += 1;
    if (rec.isStaticSpamTagged) dailyMap[dateKey].staticSpam += 1;
    if (evalResult.isRescued || evalResult.isUrgencyOverride) dailyMap[dateKey].rescued += 1;
  });

  const averageTrustScore = totalCalls > 0 ? Math.round(totalTrustScoreSum / totalCalls) : 0;
  const staticSpamPercent = totalCalls > 0 ? Math.round((staticSpamCount / totalCalls) * 100) : 0;
  const rescuedUrgentPercent = totalCalls > 0 ? Math.round((rescuedUrgentCount / totalCalls) * 100) : 0;

  const scoreDistribution = [
    { range: '0-20 (Critical)', count: scoreBuckets['0-20'] },
    { range: '21-40 (Spam)', count: scoreBuckets['21-40'] },
    { range: '41-60 (Uncertain)', count: scoreBuckets['41-60'] },
    { range: '61-80 (Moderate)', count: scoreBuckets['61-80'] },
    { range: '81-100 (Safe)', count: scoreBuckets['81-100'] },
  ];

  // Get last 7 days sorted chronologically
  const sortedDates = Object.keys(dailyMap).sort().slice(-7);
  const dailyTrend = sortedDates.map((dateStr) => {
    // Format date readable e.g. "Sep 05"
    const dateObj = new Date(dateStr);
    const label = isNaN(dateObj.getTime()) ? dateStr : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      date: label,
      total: dailyMap[dateStr].total,
      staticSpam: dailyMap[dateStr].staticSpam,
      rescued: dailyMap[dateStr].rescued,
    };
  });

  return {
    totalCalls,
    staticSpamCount,
    staticSpamPercent,
    rescuedUrgentCount,
    rescuedUrgentPercent,
    averageTrustScore,
    categoryCounts,
    scoreDistribution,
    dailyTrend,
  };
}
