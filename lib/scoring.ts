import { CallRecord, TrustEvaluation, TrustScoreCategory, ScoreBreakdown } from './types';

/**
 * ============================================================================
 * SMART CALL TRUST SCORE - CONTEXT-AWARE SPAM RE-EVALUATION ENGINE
 * ============================================================================
 * Academic Research Core:
 * Traditional telecom spam detection systems rely on static crowd-tagged labels.
 * This introduces significant false positives due to:
 *   1. Recycled SIM numbers (numbers reassigned after 90+ days of inactivity)
 *   2. Outdated crowd-tagging campaigns (telemarketer tags that decay over time)
 *   3. Critical emergency call attempts silenced due to legacy static flags.
 *
 * This engine implements a multi-parameter behavioral evaluation model:
 *   TrustScore = Clamp(BaseScore + TagAgeDecay + RelationshipTrust - AnomalyPenalties + UrgencyOverride)
 * ============================================================================
 */

export function evaluateTrustScore(
  record: CallRecord,
  liveBurstCountOverride?: number
): TrustEvaluation {
  // Determine effective burst count (either from live simulator toggle or historical record)
  const burstCount = liveBurstCountOverride !== undefined 
    ? liveBurstCountOverride 
    : (record.recentBurstCount || 0);

  const riskFactors: string[] = [];
  const trustFactors: string[] = [];

  // --------------------------------------------------------------------------
  // Step 1: Base Score Initialization
  // --------------------------------------------------------------------------
  let baseScore = 75; // Default neutral-high base for untagged numbers

  if (record.isSavedContact) {
    baseScore = 90;
    trustFactors.push("Caller is saved in your address book (+90 base)");
  } else if (record.isStaticSpamTagged) {
    baseScore = 25;
    riskFactors.push("Number is flagged as static spam in crowd database (-50 base penalty)");
  } else {
    trustFactors.push("No static crowd spam flags on record (+75 base)");
  }

  // --------------------------------------------------------------------------
  // Step 2: Tag Age Decay Formula (Exponential Decay Recovery)
  // Formula: DecayBonus = 45 * (1 - exp(-0.012 * ageInDays))
  // A 300-day old tag decays significantly, recovering up to +43 points.
  // --------------------------------------------------------------------------
  let tagAgeDecayBonus = 0;
  if (record.isStaticSpamTagged && record.spamTagAgeDays > 0) {
    const lambda = 0.012; // Decay rate parameter (half-life ~ 58 days)
    const maxRecovery = 45;
    tagAgeDecayBonus = Math.round(maxRecovery * (1 - Math.exp(-lambda * record.spamTagAgeDays)));
    
    if (tagAgeDecayBonus > 5) {
      trustFactors.push(
        `Static spam tag is ${record.spamTagAgeDays} days old (${Math.round(record.spamTagAgeDays / 30)} mos) -> Decay Bonus +${tagAgeDecayBonus} pts (High likelihood of number recycling)`
      );
    }
  }

  // --------------------------------------------------------------------------
  // Step 3: Historical Relationship & Established Interpersonal Trust
  // --------------------------------------------------------------------------
  let historicalTrustBonus = 0;
  if (record.hasHistoricalLongCall) {
    historicalTrustBonus += 35;
    trustFactors.push("Established relationship: Had 2+ min answered conversation in history (+35 pts)");
  }

  if (record.pastAnswerRate && record.pastAnswerRate >= 0.5) {
    historicalTrustBonus += 10;
    trustFactors.push(`High historical engagement: ${Math.round(record.pastAnswerRate * 100)}% past calls answered (+10 pts)`);
  }

  let savedContactBonus = 0;
  if (record.isSavedContact) {
    savedContactBonus = 10;
  }

  // --------------------------------------------------------------------------
  // Step 4: Behavioral Anomaly Penalties (Call Frequency & Micro-Durations)
  // --------------------------------------------------------------------------
  let frequencyPenalty = 0;
  if (record.callsInLast24h >= 25) {
    frequencyPenalty = 30;
    riskFactors.push(`High call velocity: ${record.callsInLast24h} calls in last 24h (-30 pts spam pattern)`);
  } else if (record.callsInLast24h >= 12) {
    frequencyPenalty = 18;
    riskFactors.push(`Moderate velocity burst: ${record.callsInLast24h} calls in 24h (-18 pts)`);
  } else if (record.callsInLast24h >= 6) {
    frequencyPenalty = 8;
    riskFactors.push(`Slightly elevated frequency: ${record.callsInLast24h} calls in 24h (-8 pts)`);
  }

  let durationPenalty = 0;
  if (!record.answered && record.callDuration > 0 && record.callDuration < 10) {
    durationPenalty = 15;
    riskFactors.push(`Robocall signature: Micro call duration of ${record.callDuration}s (-15 pts)`);
  }

  // --------------------------------------------------------------------------
  // Step 5: Repeat-Call Urgency Burst Override Logic
  // Criterion: 3+ calls within a 10-minute window overrides static spam tag!
  // Emergency contacts / delivery / urgent callers call repeatedly in bursts.
  // --------------------------------------------------------------------------
  const isUrgencyOverride = burstCount >= 3;
  let urgencyOverrideBonus = 0;

  if (isUrgencyOverride) {
    urgencyOverrideBonus = 45;
    trustFactors.push(
      `🚨 URGENCY OVERRIDE ACTIVATED: ${burstCount} call attempts in 10 mins! Bypassing static silence filter (+45 urgency boost)`
    );
  }

  // --------------------------------------------------------------------------
  // Step 6: Raw Score Summation & Clamping (0 - 100)
  // --------------------------------------------------------------------------
  const rawScore = 
    baseScore + 
    tagAgeDecayBonus + 
    historicalTrustBonus + 
    savedContactBonus + 
    urgencyOverrideBonus - 
    frequencyPenalty - 
    durationPenalty;

  const trustScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Breakdown detail object for visual breakdown accordion
  const breakdown: ScoreBreakdown = {
    baseScore,
    tagAgeDecayBonus,
    historicalTrustBonus,
    urgencyOverrideBonus,
    frequencyPenalty,
    durationPenalty,
    savedContactBonus,
  };

  // --------------------------------------------------------------------------
  // Step 7: Category Mapping & Reasoning Generation
  // --------------------------------------------------------------------------
  let category: TrustScoreCategory;

  if (isUrgencyOverride) {
    category = 'Possibly Urgent';
  } else if (trustScore >= 70) {
    category = 'Likely Safe';
  } else if (trustScore >= 40) {
    category = 'Uncertain';
  } else {
    category = 'Likely Spam';
  }

  const isRescued = record.isStaticSpamTagged && (category === 'Likely Safe' || category === 'Possibly Urgent');

  // Build human-readable reasoning text
  const reasoning = generateReasoningText(
    record, 
    trustScore, 
    category, 
    isUrgencyOverride, 
    burstCount, 
    tagAgeDecayBonus, 
    isRescued
  );

  return {
    trustScore,
    category,
    reasoning,
    isUrgencyOverride,
    isRescued,
    breakdown,
    riskFactors,
    trustFactors,
  };
}

/**
 * Helper to construct context-aware human-readable reasoning string for UI display.
 */
function generateReasoningText(
  record: CallRecord,
  score: number,
  category: TrustScoreCategory,
  isUrgent: boolean,
  burstCount: number,
  decayBonus: number,
  isRescued: boolean
): string {
  if (isUrgent) {
    return `Tagged spam in crowd database, but called ${burstCount} times in 10 minutes — URGENCY OVERRIDE applied (Reconsider immediately).`;
  }

  if (record.isStaticSpamTagged) {
    const months = Math.round(record.spamTagAgeDays / 30);
    if (isRescued) {
      if (record.hasHistoricalLongCall) {
        return `Tagged spam ${months} months ago, but has past 2+ min conversation history with you — Reclassified as Safe.`;
      }
      return `Tagged spam ${months} months ago (${record.spamTagAgeDays}d decay), but showing normal recent behavior — Reclassified from static spam flag.`;
    } else {
      return `Tagged static spam ${record.spamTagAgeDays} days ago with ${record.callsInLast24h} calls/24h — High confidence spam (${score}/100).`;
    }
  }

  if (record.isSavedContact) {
    return `Verified address book contact. Clean behavioral pattern (${score}/100).`;
  }

  if (category === 'Likely Safe') {
    return `No crowd spam flags, normal call frequency (${record.callsInLast24h} in 24h) — Clean caller record (${score}/100).`;
  }

  if (category === 'Uncertain') {
    return `Untagged number with moderate daily activity (${record.callsInLast24h} calls/24h) — Proceed with normal caution (${score}/100).`;
  }

  return `High call frequency (${record.callsInLast24h} calls/24h) with short call durations — Flagged as suspicious (${score}/100).`;
}

/**
 * Returns Tailwind CSS color classes for score categories
 */
export function getCategoryBadgeStyle(category: TrustScoreCategory): {
  bg: string;
  text: string;
  border: string;
  icon: string;
  glow: string;
} {
  switch (category) {
    case 'Likely Safe':
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-500/30',
        icon: '🛡️',
        glow: 'shadow-emerald-500/20',
      };
    case 'Uncertain':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-500/30',
        icon: '⚠️',
        glow: 'shadow-amber-500/20',
      };
    case 'Likely Spam':
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-500/20',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-500/30',
        icon: '🚫',
        glow: 'shadow-rose-500/20',
      };
    case 'Possibly Urgent':
      return {
        bg: 'bg-purple-500/15 dark:bg-purple-500/25',
        text: 'text-purple-600 dark:text-purple-300',
        border: 'border-purple-500/50',
        icon: '🚨',
        glow: 'shadow-purple-500/40 animate-pulse-slow',
      };
  }
}
