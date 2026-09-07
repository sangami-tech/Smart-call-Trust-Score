import { CallRecord, PresetScenario } from './types';

/**
 * Seed data generator for Smart Call Trust Score
 * Generates ~500 realistic synthetic call records with realistic Indian telecom numbering (+91-XXXXX-XXXXX)
 * and specific edge case distributions.
 */

// Key Edge Case Personas for Live Simulator Presets
export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'recycled_number',
    title: 'Old Tag + Normal Behavior',
    subtitle: 'Recycled Number Scenario',
    description: 'Tagged spam 9 months ago by legacy user, but recent call frequency is low and had a 3-minute answered call last week.',
    badge: 'Rescued Spam',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    sampleRecord: {
      id: 'preset-recycled-1',
      callerNumber: '+91-98765-XX101',
      callerName: 'Ramesh (Potential Recycled SIM)',
      timestamp: new Date().toISOString(),
      callDuration: 185,
      answered: true,
      isStaticSpamTagged: true,
      spamTagAgeDays: 270, // 9 months old tag!
      callsInLast24h: 2,
      hasHistoricalLongCall: true,
      isSavedContact: false,
      pastAnswerRate: 0.67,
      recentBurstCount: 1,
      scenarioCategory: 'recycled_number'
    }
  },
  {
    id: 'urgent_burst',
    title: 'Static Spam + 4 Calls in 6 Mins',
    subtitle: 'Emergency Urgency Override',
    description: 'Flagged as spam in crowd database, but caller has attempted 4 calls in the last 6 minutes. Triggers Urgency Override.',
    badge: 'Urgent Override',
    badgeColor: 'bg-purple-500/25 text-purple-300 border-purple-500/50 animate-pulse',
    sampleRecord: {
      id: 'preset-urgent-1',
      callerNumber: '+91-99887-XX202',
      callerName: 'Dr. Mehta / Apollo Clinic (Emergency)',
      timestamp: new Date().toISOString(),
      callDuration: 0,
      answered: false,
      isStaticSpamTagged: true,
      spamTagAgeDays: 45,
      callsInLast24h: 8,
      hasHistoricalLongCall: false,
      isSavedContact: false,
      pastAnswerRate: 0.1,
      recentBurstCount: 4, // 4 calls in last 10 mins!
      scenarioCategory: 'urgent_burst'
    }
  },
  {
    id: 'clean_legitimate',
    title: 'Clean Saved Contact',
    subtitle: 'High-Trust Interpersonal Call',
    description: 'Saved contact with no static spam tags, 85% historical answer rate, and regular call duration.',
    badge: 'Likely Safe',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    sampleRecord: {
      id: 'preset-clean-1',
      callerNumber: '+91-94433-XX303',
      callerName: 'Priya (Address Book Contact)',
      timestamp: new Date().toISOString(),
      callDuration: 240,
      answered: true,
      isStaticSpamTagged: false,
      spamTagAgeDays: 0,
      callsInLast24h: 1,
      hasHistoricalLongCall: true,
      isSavedContact: true,
      pastAnswerRate: 0.90,
      recentBurstCount: 1,
      scenarioCategory: 'clean_legitimate'
    }
  },
  {
    id: 'obvious_spam',
    title: 'Aggressive Telemarketer',
    subtitle: 'High Velocity Robocaller',
    description: 'Flagged spam 3 days ago, 38 call attempts in last 24h with average duration of 4 seconds.',
    badge: 'Likely Spam',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    sampleRecord: {
      id: 'preset-spam-1',
      callerNumber: '+91-14001-XX404',
      callerName: 'Credit Card Loan Spammer',
      timestamp: new Date().toISOString(),
      callDuration: 4,
      answered: false,
      isStaticSpamTagged: true,
      spamTagAgeDays: 3,
      callsInLast24h: 38,
      hasHistoricalLongCall: false,
      isSavedContact: false,
      pastAnswerRate: 0.0,
      recentBurstCount: 1,
      scenarioCategory: 'obvious_spam'
    }
  }
];

// Helper to generate seed dataset of ~500 records
export function generateSeedCallRecords(count = 500): CallRecord[] {
  const records: CallRecord[] = [];
  const now = new Date();

  // Names / labels pool
  const safeNames = [
    'Priya Sharma', 'Anand Kumar', 'Delivery Partner (Zomato)', 'Tech Support (Airtel)',
    'Aarav Patel', 'Neha Singh', 'Electrician (Urban Company)', 'Apollo Pharmacy',
    'Vikram Das', 'Kavita Reddy', 'Uber Driver', 'School Office (DPS)'
  ];

  const spamNames = [
    'Unknown Telemarketer', 'Loan Offer Agent', 'Insurance Spam Bot', 'Real Estate Cold Call',
    'Crypto Investment Bot', 'Trading Tip Caller', 'Personal Loan Center', 'Lottery Scam Alert'
  ];

  const recycledNames = [
    'Unknown (Old Tag - Decayed)', 'Delivery Service (Recycled)', 'Local Shop Vendor', 'Ramesh Chandra'
  ];

  // Guaranteed Edge Case Injections
  // 1. Recycled Numbers (40 records)
  for (let i = 0; i < 40; i++) {
    const ageDays = 180 + Math.floor(Math.random() * 200); // 180 - 380 days old tag
    records.push({
      id: `recycled-${i + 1}`,
      callerNumber: `+91-${98000 + (i * 123) % 1000}-XX${100 + (i % 900)}`,
      callerName: recycledNames[i % recycledNames.length],
      timestamp: getRandomPastDate(now, 30),
      callDuration: 120 + Math.floor(Math.random() * 300),
      answered: Math.random() > 0.3,
      isStaticSpamTagged: true,
      spamTagAgeDays: ageDays,
      callsInLast24h: 1 + Math.floor(Math.random() * 3),
      hasHistoricalLongCall: true,
      isSavedContact: false,
      pastAnswerRate: 0.5 + Math.random() * 0.4,
      recentBurstCount: 1,
      scenarioCategory: 'recycled_number'
    });
  }

  // 2. Urgent Burst Emergency Calls (25 records)
  for (let i = 0; i < 25; i++) {
    records.push({
      id: `urgent-${i + 1}`,
      callerNumber: `+91-${99000 + (i * 147) % 1000}-XX${200 + (i % 800)}`,
      callerName: i % 2 === 0 ? 'Dr. Mehta (Clinic Emergency)' : 'Unknown (Burst 4 Calls in 8 mins)',
      timestamp: getRandomPastDate(now, 5),
      callDuration: Math.floor(Math.random() * 60),
      answered: false,
      isStaticSpamTagged: Math.random() > 0.5,
      spamTagAgeDays: 15 + Math.floor(Math.random() * 90),
      callsInLast24h: 5 + Math.floor(Math.random() * 6),
      hasHistoricalLongCall: Math.random() > 0.6,
      isSavedContact: false,
      pastAnswerRate: 0.2,
      recentBurstCount: 3 + Math.floor(Math.random() * 3), // 3 to 5 calls in 10 mins
      scenarioCategory: 'urgent_burst'
    });
  }

  // 3. Obvious Spam Telemarketers (180 records)
  for (let i = 0; i < 180; i++) {
    records.push({
      id: `spam-${i + 1}`,
      callerNumber: `+91-14${Math.floor(100 + Math.random() * 899)}-XX${Math.floor(100 + Math.random() * 899)}`,
      callerName: spamNames[i % spamNames.length],
      timestamp: getRandomPastDate(now, 30),
      callDuration: Math.floor(Math.random() * 15),
      answered: Math.random() > 0.85,
      isStaticSpamTagged: true,
      spamTagAgeDays: 1 + Math.floor(Math.random() * 30), // Fresh spam tags
      callsInLast24h: 15 + Math.floor(Math.random() * 35), // High daily frequency
      hasHistoricalLongCall: false,
      isSavedContact: false,
      pastAnswerRate: 0.05,
      recentBurstCount: 1,
      scenarioCategory: 'obvious_spam'
    });
  }

  // 4. Clean Legitimate & Saved Contacts (255 records)
  for (let i = 0; i < (count - records.length); i++) {
    const isSaved = Math.random() > 0.45;
    records.push({
      id: `clean-${i + 1}`,
      callerNumber: `+91-${94000 + Math.floor(Math.random() * 5000)}-XX${Math.floor(100 + Math.random() * 899)}`,
      callerName: isSaved ? safeNames[i % safeNames.length] : 'Unknown Legitimate Caller',
      timestamp: getRandomPastDate(now, 30),
      callDuration: 45 + Math.floor(Math.random() * 400),
      answered: Math.random() > 0.15,
      isStaticSpamTagged: false,
      spamTagAgeDays: 0,
      callsInLast24h: 1 + Math.floor(Math.random() * 4),
      hasHistoricalLongCall: true,
      isSavedContact: isSaved,
      pastAnswerRate: isSaved ? 0.85 + Math.random() * 0.15 : 0.4 + Math.random() * 0.4,
      recentBurstCount: 1,
      scenarioCategory: 'clean_legitimate'
    });
  }

  // Sort descending by timestamp
  return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function getRandomPastDate(now: Date, maxDaysAgo: number): string {
  const daysAgo = Math.random() * maxDaysAgo;
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString();
}
