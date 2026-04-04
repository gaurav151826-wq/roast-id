// ═══════════════════════════════════════════════════════════════
// ROAST ENGINE v2 — Aura Tracker + Brain Rot + Dynamic Roasts
// ═══════════════════════════════════════════════════════════════

// ============ AURA COSTS PER ACHIEVEMENT ============
export const ACHIEVEMENT_AURA_COSTS: Record<string, number> = {
  "Sent 'Omw' while in bed": -1000,
  "Ignored a 'Seen' message": -800,
  "Stayed in bed 12 hours": -1200,
  "Watched 100 Reels": -900,
  "Survived on 2 hours sleep": -750,
  "Replied 'lol' to a serious text": -600,
  "Googled 'Am I cooked'": -1500,
  "Ate cereal at 3 AM": -500,
  "Stalked an ex's profile": -2000,
  "Said 'no cap' unironically": -400,
};

// ============ STATUS AURA COSTS ============
export const STATUS_AURA_COSTS: Record<string, number> = {
  'Legibly Cooked': -1500,
  '100% Simp': -1200,
  'Professional Yapper': -800,
  'Broke Legend': -1100,
  '3 AM Overthinker': -1800,
};

// ============ BRAIN ROT TIERS ============
export interface BrainRotTier {
  label: string;
  emoji: string;
  color: string;
}

export function getBrainRotTier(pct: number): BrainRotTier {
  if (pct <= 30) return { label: 'Normal Human', emoji: '🧠', color: '#10B981' };
  if (pct <= 70) return { label: 'Reel Addict', emoji: '📱', color: '#F59E0B' };
  if (pct <= 99) return { label: 'Skibidi Level', emoji: '💀', color: '#EF4444' };
  return { label: 'Beyond Saving', emoji: '☠️', color: '#DC2626' };
}

// ============ ROAST LIBRARY ============
const ROAST_LIBRARY: Record<string, string[]> = {
  'Legibly Cooked': [
    "Subject is so cooked, Gordon Ramsay filed a restraining order.",
    "This individual's life has less structure than a wet paper towel.",
    "Certified well-done. No pink left. Just charcoal and regret.",
    "Even their GPS says 'I give up, figure it out yourself.'",
    "Subject's life plan is a 404 page with confetti.",
    "They didn't just miss the boat — they're drowning in the parking lot.",
  ],
  '100% Simp': [
    "Subject has donated their entire personality to someone's DMs.",
    "This individual's spine was last seen in 2019. Still missing.",
    "They wrote a 3-paragraph 'good morning' text. It was on read.",
    "Subject would hold an umbrella for someone in a video game.",
    "Their love language is 'being ignored' and they're fluent.",
    "Caught triple-tapping a photo from 47 weeks ago. Case closed.",
  ],
  'Professional Yapper': [
    "Subject has been talking for 45 minutes. Nobody asked a question.",
    "This individual's mouth has a better work ethic than their brain.",
    "They could filibuster a group chat into extinction.",
    "Subject's jaw is the only muscle getting a daily workout.",
    "Even Siri told them to wrap it up.",
    "They narrate their own life like a Netflix documentary nobody subscribed to.",
  ],
  'Broke Legend': [
    "Subject's bank account is just vibes and a negative sign.",
    "This individual's wallet echoes when you open it.",
    "They split a $4 coffee three ways and still Venmo-requested.",
    "Subject's financial plan is 'manifesting' and 'hoping for the best.'",
    "Their credit score is a personality trait at this point.",
    "Overdraft fee is their most consistent monthly subscription.",
  ],
  '3 AM Overthinker': [
    "Subject's brain has 847 tabs open and all of them are loading.",
    "This individual rehearsed a conversation that will never happen.",
    "They analyzed a thumbs-up emoji for 3 hours. Verdict: still unclear.",
    "Subject's pillow knows more trauma than any licensed therapist.",
    "Their inner monologue has an inner monologue.",
    "They wrote, deleted, and rewrote this text 11 times before not sending it.",
  ],
};

// Nuclear-level roasts for luck > 80%
const NUCLEAR_ROASTS: string[] = [
  "NUCLEAR ALERT: Subject claims {luck}% luck but their life looks like a bloopers reel.",
  "DEFCON 1: {luck}% luck? The audacity. Even their horoscope app uninstalled itself.",
  "HAZMAT REQUIRED: Subject is delusional at {luck}% luck — their Wi-Fi disconnects out of pity.",
  "MELTDOWN: Claiming {luck}% blessed while their life speedruns every L possible.",
  "CRITICAL: {luck}% luck is wild for someone whose toast lands butter-side down EVERY time.",
];

// Achievement-specific roast fragments
const ACHIEVEMENT_ROASTS: Record<string, string[]> = {
  "Sent 'Omw' while in bed": [
    "Sent 'Omw' while still horizontal. The audacity is unmatched.",
    "Their ETA is a lie wrapped in a blanket.",
    "'Omw' means 'Oh, Maybe Wednesday' for this one.",
  ],
  "Ignored a 'Seen' message": [
    "Left someone on 'Seen' like it's a competitive sport.",
    "Their read receipts are basically war crimes.",
    "Ghosting level: professional. Resume updated.",
  ],
  'Stayed in bed 12 hours': [
    "Still horizontal. Mattress filed them as a dependent.",
    "Their bed has more screen time than their actual screen.",
    "Gravity is their only remaining friend and it's winning.",
  ],
  'Watched 100 Reels': [
    "Lost 4 hours to Reels. Gained nothing. Zero knowledge retained.",
    "Their attention span is now measured in Reel durations.",
    "Algorithm knows them better than their own mother.",
  ],
  'Survived on 2 hours sleep': [
    "Running on 2 hours of sleep and pure delusion.",
    "Their eye bags have eye bags. It's bags all the way down.",
    "Functioning on caffeine, spite, and a prayer.",
  ],
  "Replied 'lol' to a serious text": [
    "Emotional range of a loading screen.",
    "'lol' is doing heavy lifting as their entire vocabulary.",
    "Responded to trauma with two consonants and a vowel.",
  ],
  "Googled 'Am I cooked'": [
    "The search results said 'yes' and auto-closed the browser.",
    "Google's AI literally said 'I'm sorry for your loss.'",
    "Even incognito mode judged them.",
  ],
  "Ate cereal at 3 AM": [
    "Their dinner reservation is with a cereal box at 3 AM.",
    "Peak nutrition is Cap'n Crunch at 0300 hours.",
    "The fridge light is their only nightlife.",
  ],
  "Stalked an ex's profile": [
    "FBI called. They want their surveillance techniques back.",
    "Scrolled so far back they found the ex's baby photos.",
    "Digital archaeology is their true passion.",
  ],
  "Said 'no cap' unironically": [
    "Their vocabulary is 90% TikTok audio.",
    "Brain rot has entered the chat. And it's staying.",
    "Webster's Dictionary just blocked them.",
  ],
};

// ============ SEEDED RANDOM ============
function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function pickRandom<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

// ============ RESULT TYPES ============
export interface AuraBreakdown {
  starting: number;
  statusCost: number;
  achievementCosts: { name: string; cost: number }[];
  brainRotCost: number;
  luckBonus: number;
  total: number;
}

export interface RoastResult {
  verdict: string;
  aura: AuraBreakdown;
  brainRotLevel: number;
  brainRotTier: BrainRotTier;
}

// ============ MAIN GENERATOR ============
export function generateRoast(
  name: string,
  status: string,
  achievements: string[],
  luckLevel: number,
  brainRotLevel: number,
  issueId: string
): RoastResult {
  const seedStr = `${name}-${status}-${achievements.join(',')}-${luckLevel}-${brainRotLevel}-${issueId}`;
  const seed = hashSeed(seedStr);
  const rng = seededRandom(seed);

  // ---- VERDICT ----
  let verdict = '';
  const isNuclear = luckLevel > 80;

  if (isNuclear) {
    const nuclearBase = pickRandom(NUCLEAR_ROASTS, rng);
    verdict = nuclearBase.replace('{luck}', String(luckLevel));
  } else {
    const statusRoasts = ROAST_LIBRARY[status] || ROAST_LIBRARY['Legibly Cooked'];
    verdict = pickRandom(statusRoasts, rng);
  }

  // Weave in achievement-specific roast
  const hasBedAchievement = achievements.includes('Stayed in bed 12 hours');
  const hasOmw = achievements.includes("Sent 'Omw' while in bed");

  if (hasOmw && rng() > 0.25) {
    const omwRoasts = ACHIEVEMENT_ROASTS["Sent 'Omw' while in bed"];
    verdict += ` P.S. ${pickRandom(omwRoasts, rng)}`;
  } else if (hasBedAchievement && rng() > 0.3) {
    const bedRoasts = ACHIEVEMENT_ROASTS['Stayed in bed 12 hours'];
    verdict += ` P.S. ${pickRandom(bedRoasts, rng)}`;
  } else if (achievements.length > 0 && rng() > 0.4) {
    const randomAchievement = pickRandom(achievements, rng);
    const achievementRoasts = ACHIEVEMENT_ROASTS[randomAchievement];
    if (achievementRoasts) {
      verdict += ` Also: ${pickRandom(achievementRoasts, rng)}`;
    }
  }

  // ---- AURA TRACKER (starts at +5,000) ----
  const starting = 5000;

  const statusCost = STATUS_AURA_COSTS[status] || -1000;

  const achievementCosts = achievements.map(a => ({
    name: a,
    cost: ACHIEVEMENT_AURA_COSTS[a] || -500,
  }));
  const totalAchievementCost = achievementCosts.reduce((sum, a) => sum + a.cost, 0);

  // Brain rot penalty: scales with level
  const brainRotCost = brainRotLevel > 70 ? -2000 : brainRotLevel > 30 ? -800 : -200;

  // Luck bonus: low luck = more aura loss, high luck = tiny bonus
  const luckBonus = luckLevel > 80 ? Math.floor(rng() * 200 + 100) : luckLevel < 20 ? -1500 : -Math.floor((100 - luckLevel) * 8);

  // Small random jitter
  const jitter = Math.floor(rng() * 200) - 100;

  const total = starting + statusCost + totalAchievementCost + brainRotCost + luckBonus + jitter;

  const brainRotTier = getBrainRotTier(brainRotLevel);

  return {
    verdict,
    aura: {
      starting,
      statusCost,
      achievementCosts,
      brainRotCost,
      luckBonus,
      total,
    },
    brainRotLevel,
    brainRotTier,
  };
}
