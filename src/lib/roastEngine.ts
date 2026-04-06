// ═══════════════════════════════════════════════════════════════
// ROAST ENGINE v4 — INFINITE ROAST GENERATOR
// Combinatorial sentence builder: millions of unique roasts
// Every single generation is different, even with same inputs
// ═══════════════════════════════════════════════════════════════

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

export const STATUS_AURA_COSTS: Record<string, number> = {
  'Legibly Cooked': -1500,
  '100% Simp': -1200,
  'Professional Yapper': -800,
  'Broke Legend': -1100,
  '3 AM Overthinker': -1800,
};

export interface BrainRotTier { label: string; emoji: string; color: string; }

export function getBrainRotTier(pct: number): BrainRotTier {
  if (pct <= 30) return { label: 'Normal Human', emoji: '\u{1F9E0}', color: '#10B981' };
  if (pct <= 70) return { label: 'Reel Addict', emoji: '\u{1F4F1}', color: '#F59E0B' };
  if (pct <= 99) return { label: 'Skibidi Level', emoji: '\u{1F480}', color: '#EF4444' };
  return { label: 'Beyond Saving', emoji: '\u{2620}\u{FE0F}', color: '#DC2626' };
}

// ═══════════════════════════════════════════════════════════════
// SEEDED RNG — issueId is unique per generation = unique roast
// ═══════════════════════════════════════════════════════════════
function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}

function makeRng(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0x7fffffff; return s / 0x7fffffff; };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

// ═══════════════════════════════════════════════════════════════
// ROAST PARTS — combinatorial pieces that mix into millions
// Each category has OPENERS, MIDDLES, CLOSERS, EXTRAS
// Total unique combos per status: 25 × 30 × 25 × 20 = 375,000+
// ═══════════════════════════════════════════════════════════════

const OPENERS: Record<string, string[]> = {
  'Legibly Cooked': [
    "Subject is so cooked,", "This individual is burnt beyond recognition.", "Certified overcooked specimen.",
    "WARNING: Subject has reached critical cook levels.", "The cookedness of this person is unprecedented.",
    "Subject's life is a dumpster fire,", "This human is charcoal at this point,",
    "Subject was born cooked and it only got worse.", "Even a microwave would reject this individual.",
    "Subject's existence is a cautionary tale,", "This person is so done,", "Subject is cooked rare to well-done,",
    "The level of cook on this one is ILLEGAL.", "Subject hit rock bottom and started digging.",
    "This individual's life is a 1-star Yelp review,", "Subject is the human equivalent of burnt toast,",
    "Somebody check on this person because they are FRIED.", "Subject's life went from bad to comedy special.",
    "This person is so cooked they come with a side of regret.", "Subject is exhibit A in the museum of L's.",
    "The audacity of this person existing is wild.", "Subject's vibe is 'abandoned shopping cart.'",
    "This individual peaked in the womb.", "Subject is living proof that WiFi doesn't fix everything.",
    "This person's life story is a 404 error.",
  ],
  '100% Simp': [
    "Subject has donated their spine to the crush fund.", "This individual simps so hard, their wallet cries.",
    "Certified simp. No cure found.", "Subject's love life is a one-sided conversation.",
    "WARNING: Extreme levels of simping detected.", "This person's dignity left the chat in 2021.",
    "Subject would carry groceries for someone who doesn't know their name.",
    "This individual's heart is on their sleeve, their wallet, and their Venmo.",
    "Subject's entire personality is someone else's Instagram.", "The simp energy radiating from this person is NUCLEAR.",
    "Subject rewrote their bio 14 times for someone who doesn't follow back.",
    "This person's love language is 'being left on read.'", "Subject is down so bad, they're underground.",
    "This individual treats rejection like a hobby.", "Subject's crush has a restraining order... emotionally.",
    "This person double-texted, triple-texted, then apologized for texting.",
    "Subject would buy Wi-Fi for someone who blocked them.", "The simp is STRONG with this one.",
    "Subject's diary is just screenshots of someone's stories.",
    "This individual's self-respect is on backorder.", "Subject is the CEO of unrequited feelings.",
    "This person said 'I'm not a simp' while writing a love poem to a stranger.",
    "Subject's heart is bigger than their common sense.", "This individual has a PhD in being ignored.",
    "Subject's love life has a 0% success rate and 100% effort.",
  ],
  'Professional Yapper': [
    "Subject has been talking for 47 minutes straight.", "This individual's mouth never clocks out.",
    "Certified yapper. Eardrums everywhere are filing complaints.", "Subject talks more than a podcast with no listeners.",
    "WARNING: This person will not stop talking.", "This individual could out-talk an auctioneer.",
    "Subject's jaw is the most exercised muscle in their body.",
    "This person narrates their own life like a TED talk nobody asked for.",
    "Subject could talk a wall into moving.", "The yapping levels are OFF THE CHARTS.",
    "Subject has been on a 3-hour monologue about absolutely nothing.",
    "This person's voice is their most consistent personality trait.",
    "Subject could filibuster the entire internet.", "This individual treats silence like a personal attack.",
    "Subject's group chat messages need a table of contents.",
    "This person's texts are longer than most novels.", "Subject talks in their sleep AND while awake.",
    "This individual's mouth has its own LinkedIn profile.",
    "Subject could narrate paint drying and somehow make it longer.",
    "This person's voicemails need an intermission.",
    "Subject's conversations come with a runtime warning.",
    "This individual's mouth runs on renewable energy.", "Subject's words per minute exceed the speed limit.",
    "This person talked through an entire movie. Twice.", "Subject's silence is rarer than a blue moon.",
  ],
  'Broke Legend': [
    "Subject's bank account just sent a cry for help.", "This individual is financially unalive.",
    "Certified broke legend. Even their debt has debt.", "Subject's wallet is a museum of emptiness.",
    "WARNING: This person's finances are a horror movie.", "This individual's net worth is a vibe and a prayer.",
    "Subject split a $2 ramen and still asked for Venmo.",
    "This person's financial plan is 'hoping for the best.'",
    "Subject's credit score is a personality trait at this point.",
    "The brokeness of this individual could be a case study.",
    "Subject's bank sends them motivational quotes instead of statements.",
    "This person's savings account is just a screenshot of someone else's.",
    "Subject's idea of investing is buying lottery tickets.", "This individual's wallet echoes when you open it.",
    "Subject's overdraft fee is their most loyal subscription.",
    "This person checks their bank balance with one eye closed.",
    "Subject's financial advisor quit. Via text.", "This individual treats 'free samples' as a meal plan.",
    "Subject's money management is 'spend now, cry later.'",
    "This person's budget is just vibes and crossed fingers.",
    "Subject's bank app has a permanent sad face emoji.",
    "This individual's idea of a raise is finding $5 in old jeans.",
    "Subject's retirement plan is 'going viral.'", "This person's wallet is thinner than their patience.",
    "Subject's financial literacy is at NPC levels.",
  ],
  '3 AM Overthinker': [
    "Subject's brain has 2,847 tabs open.", "This individual overthinks their overthinking.",
    "Certified 3 AM philosopher. Zero conclusions reached.", "Subject's mind is a hamster wheel on Red Bull.",
    "WARNING: This person's thoughts have thoughts.", "This individual's brain never received the shutdown command.",
    "Subject rehearsed a conversation at 3 AM that will never happen.",
    "This person analyzed a period at the end of a text for 4 hours.",
    "Subject's pillow knows more secrets than the CIA.",
    "The overthinking levels on this person violate several laws of physics.",
    "Subject created 17 scenarios in their head. All of them were bad.",
    "This person's inner monologue has a season 2.", "Subject's brain runs on anxiety and Wi-Fi.",
    "This individual's thoughts come with footnotes.", "Subject can't sleep because their brain won't shut up.",
    "This person wrote, deleted, and rewrote a text 23 times.",
    "Subject's brain is buffering at 3 AM. Again.", "This individual's anxiety has its own anxiety.",
    "Subject overthought whether to overthink this.", "This person's brain is a conspiracy theory factory.",
    "Subject's 3 AM thoughts could fill an encyclopedia.",
    "This individual's mind is a 24/7 drama channel.", "Subject's brain treats sleep as optional DLC.",
    "This person's thoughts are louder than their alarm clock.",
    "Subject's inner voice has a podcast, a blog, and a newsletter.",
  ],
};

const MIDDLES: string[] = [
  "Gordon Ramsay filed a restraining order.",
  "their therapist needs a therapist now.",
  "even their phone autocorrects their name to 'disappointment.'",
  "their WiFi disconnects out of secondhand embarrassment.",
  "their GPS says 'you're on your own.'",
  "their alarm clock gave up and uninstalled itself.",
  "their horoscope just says 'good luck lmao.'",
  "their Spotify Wrapped was just one long sigh.",
  "their screen time report came with a wellness check.",
  "their mom's 'I'm not mad, just disappointed' hit different.",
  "their life montage would need a content warning.",
  "their browser history is a cry for help.",
  "even their shadow tries to distance itself.",
  "their Google search history could be a Netflix documentary.",
  "their reflection in the mirror looked away first.",
  "their future self sent a cease and desist.",
  "their pet goldfish has more direction in life.",
  "their motivational poster fell off the wall.",
  "their life coach quit mid-session.",
  "their participation trophy got revoked.",
  "their backup plan needs a backup plan.",
  "their LinkedIn profile just says 'surviving.'",
  "their comfort zone has a comfort zone.",
  "their New Year's resolution lasted 11 minutes.",
  "their to-do list filed for bankruptcy.",
  "even autocorrect can't fix their life choices.",
  "their Uber rating is lower than their GPA.",
  "their rizz is in the negative dimensions.",
  "their aura is visible from space. And it's concerning.",
  "their dating profile is used as a cautionary tale.",
];

const CLOSERS: string[] = [
  "There is no coming back from this.",
  "The damage is permanent and irreversible.",
  "Recovery is not an option at this stage.",
  "Even a factory reset wouldn't help.",
  "This is beyond the scope of modern science.",
  "No amount of therapy can undo this.",
  "The universe has noted this and moved on.",
  "Case closed. Evidence: overwhelming.",
  "The council has reviewed this and they're speechless.",
  "This goes on the permanent record. Forever.",
  "Not even a time machine could fix this timeline.",
  "The algorithm has given up trying to understand.",
  "This is what happens when you skip the tutorial.",
  "Exhibit A in the court of public embarrassment.",
  "The internet will remember this.",
  "Their ancestors are pretending they don't know them.",
  "Even AI refuses to generate a solution.",
  "This is a certified 'no recovery' moment.",
  "The simulation is considering a restart because of this.",
  "Scientists are studying this as a new form of L.",
  "Future generations will study this as a warning.",
  "This person's existence is a plot twist nobody wanted.",
  "The roast writes itself at this point.",
  "Honestly, even this roast feels bad for them.",
  "They didn't just take an L. They ARE the L.",
];

// Achievement-specific zingers (appended as P.S.)
const ACHIEVEMENT_ZINGERS: Record<string, string[]> = {
  "Sent 'Omw' while in bed": [
    "Sent 'Omw' while horizontal. ETA: next century.",
    "Their 'Omw' translates to 'Oh, Maybe Wednesday.'",
    "Lied about being on the way from under 3 blankets.",
    "The only thing 'on the way' is another excuse.",
    "'Omw' but the only movement is rolling over in bed.",
    "Their friends now add 2 hours to any ETA they give.",
    "Maps says 5 min. Their blanket says otherwise.",
  ],
  "Ignored a 'Seen' message": [
    "Left someone on 'Seen' like it's an Olympic sport.",
    "Their read receipts are classified as emotional warfare.",
    "Ghosting level: would make Casper jealous.",
    "Opened the message, read it, and chose violence (silence).",
    "Their 'Seen' notification is basically a rejection letter.",
    "Professional ghoster. LinkedIn endorsements pending.",
    "They see messages the way people see terms and conditions.",
  ],
  'Stayed in bed 12 hours': [
    "Mattress filed them as a dependent on its taxes.",
    "Their bed has more screen time than any device.",
    "Gravity is their best friend and only workout partner.",
    "They've merged with the mattress at a molecular level.",
    "Their bed has a better relationship status than they do.",
    "12 hours in bed isn't rest, it's a lifestyle choice.",
    "Even their pillow is tired of them.",
  ],
  'Watched 100 Reels': [
    "Lost 6 hours to Reels. Retained exactly 0 information.",
    "Their attention span is now measured in Reel durations.",
    "The algorithm knows them better than their own mother.",
    "100 Reels deep and they can't remember a single one.",
    "Their brain is now 90% trending audio.",
    "They've watched so many Reels, reality feels like a filter.",
    "Their thumb has a six-pack from scrolling.",
  ],
  'Survived on 2 hours sleep': [
    "Running on 2 hours of sleep and pure delusion.",
    "Their eye bags have eye bags. It's bags all the way down.",
    "Functioning on caffeine, spite, and a prayer.",
    "2 hours of sleep and they think they're fine. They're not.",
    "Their body is running on fumes and audacity.",
    "Sleep schedule: non-existent. Dark circles: thriving.",
    "They treat sleep like a suggestion, not a requirement.",
  ],
  "Replied 'lol' to a serious text": [
    "Emotional range of a buffering screen.",
    "'lol' is carrying their entire emotional vocabulary.",
    "Responded to genuine concern with two consonants and a vowel.",
    "Their emotional support response is 'lol.' That's it.",
    "Someone poured their heart out. They said 'lol.' Iconic.",
    "Using 'lol' as a coping mechanism since day one.",
    "'lol' — the verbal equivalent of a shrug emoji.",
  ],
  "Googled 'Am I cooked'": [
    "Google said 'yes' and auto-closed the browser.",
    "The AI literally responded with 'I'm sorry for your loss.'",
    "Even incognito mode judged them for this search.",
    "Search results: 'Yes. Next question.'",
    "Google suggested therapy. And a career change. And a new identity.",
    "The search bar autocompleted it after one letter. That's how cooked.",
    "Bing, Yahoo, AND DuckDuckGo all agreed: cooked.",
  ],
  "Ate cereal at 3 AM": [
    "Their dinner reservation is with a cereal box at 0300 hours.",
    "Peak nutrition: Cap'n Crunch at 3 AM in the dark.",
    "The fridge light is their only nightlife.",
    "3 AM cereal hits different when it's your 4th meal.",
    "Their kitchen at 3 AM is basically a Michelin-star sadness restaurant.",
    "Eating cereal in the dark like a raccoon with WiFi.",
    "The spoon-to-bowl ratio at 3 AM is concerning.",
  ],
  "Stalked an ex's profile": [
    "FBI called. They want their surveillance techniques back.",
    "Scrolled so far back they found the ex's childhood photos.",
    "Digital archaeology is their true calling.",
    "They know their ex's new partner's cousin's dog's name.",
    "Went 87 weeks deep. Accidentally liked a photo. Panicked.",
    "Their ex's profile is their most-visited website.",
    "They have a PhD in ex-partner social media forensics.",
  ],
  "Said 'no cap' unironically": [
    "Their vocabulary is 90% recycled TikTok audio.",
    "Brain rot has entered the chat. Permanently.",
    "Webster's Dictionary sent a cease and desist.",
    "They said 'no cap' to their grandma. At dinner.",
    "Their English teacher just felt a disturbance in the force.",
    "Using internet slang IRL is their entire personality.",
    "They're one 'skibidi' away from being a lost cause.",
  ],
};

// Brain rot specific roasts
const BRAIN_ROT_ROASTS: string[] = [
  "Brain rot level suggests they communicate exclusively in TikTok sounds.",
  "Their neurons are filing for unemployment.",
  "The brain rot is so advanced, they think 'sigma' is a compliment.",
  "Their brain cells are on life support and the plug is loose.",
  "Certified skibidi brain. No thoughts, just vibes and Reels.",
  "Their attention span makes a goldfish look like a scholar.",
  "The brain rot has its own brain rot at this point.",
  "Their last original thought was in 2019.",
  "Neural pathways have been replaced with trending audio.",
  "Their brain is running on Internet Explorer in 2026.",
];

// Low luck specific roasts
const UNLUCKY_ROASTS: string[] = [
  "Their luck is so bad, they'd lose a coin flip with a two-headed coin.",
  "Fortune cookies refuse to give them predictions.",
  "They're the reason 'better luck next time' was invented.",
  "Black cats cross the street to avoid THEM.",
  "Their lucky number is 'none.'",
  "They found a four-leaf clover once. It wilted immediately.",
  "Luck left the chat, the building, and the country.",
  "Even a broken clock is right twice a day. This person? Never.",
];

// Name-based roast fragments for extra personalization
const NAME_ROASTS: string[] = [
  "Honestly {name}, this is embarrassing even by internet standards.",
  "Dear {name}, the council has reviewed your application for coolness. It was denied.",
  "{name} really thought they could escape this roast. Adorable.",
  "Somebody needs to check on {name} because this is concerning.",
  "{name}'s parents looked at this and pretended they don't know them.",
  "Breaking news: {name} has been officially classified as a walking L.",
  "{name} is the main character... of a tragedy.",
  "{name}'s vibe check came back negative.",
  "Sources confirm {name} has zero chill and maximum chaos.",
  "{name} really said 'it can't get worse' and the universe said 'bet.'",
];

// ═══════════════════════════════════════════════════════════════
// THE GENERATOR — combinatorial builder
// Picks: OPENER + MIDDLE + CLOSER + optional P.S.
// With 25 × 30 × 25 = 18,750 base combos per status
// × 10 name roasts × 7+ achievement zingers = millions
// ═══════════════════════════════════════════════════════════════

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

export function generateRoast(
  name: string,
  status: string,
  achievements: string[],
  luckLevel: number,
  brainRotLevel: number,
  issueId: string
): RoastResult {
  // issueId is random per generation → always different roast
  const seed = hashSeed(`${issueId}-${name}-${status}-${brainRotLevel}-${luckLevel}`);
  const rng = makeRng(seed);

  // ── Build the verdict sentence ──
  const parts: string[] = [];

  // 1. Status-specific opener
  const openers = OPENERS[status] || OPENERS['Legibly Cooked'];
  parts.push(pick(openers, rng));

  // 2. Universal middle (the punchline)
  parts.push(pick(MIDDLES, rng));

  // 3. Closer
  parts.push(pick(CLOSERS, rng));

  let verdict = parts.join(' ');

  // 4. Conditional extras based on inputs

  // Brain rot > 70 → add brain rot roast
  if (brainRotLevel > 70 && rng() > 0.3) {
    verdict += ` P.S. ${pick(BRAIN_ROT_ROASTS, rng)}`;
  }
  // Low luck → add unlucky roast
  else if (luckLevel < 20 && rng() > 0.3) {
    verdict += ` P.S. ${pick(UNLUCKY_ROASTS, rng)}`;
  }
  // Achievement-specific zinger
  else if (achievements.length > 0 && rng() > 0.2) {
    const achv = pick(achievements, rng);
    const zingers = ACHIEVEMENT_ZINGERS[achv];
    if (zingers) {
      verdict += ` P.S. ${pick(zingers, rng)}`;
    }
  }

  // 5. 40% chance to add a personalized name roast at the end
  if (rng() > 0.6) {
    const nameRoast = pick(NAME_ROASTS, rng).replace('{name}', name);
    verdict += ` ${nameRoast}`;
  }

  // ── Aura calculation ──
  const starting = 5000;
  const statusCost = STATUS_AURA_COSTS[status] || -1000;
  const achievementCosts = achievements.map(a => ({
    name: a,
    cost: ACHIEVEMENT_AURA_COSTS[a] || -500,
  }));
  const totalAchCost = achievementCosts.reduce((s, a) => s + a.cost, 0);
  const brainRotCost = brainRotLevel > 70 ? -2000 : brainRotLevel > 30 ? -800 : -200;
  const luckBonus = luckLevel > 80
    ? Math.floor(rng() * 200 + 100)
    : luckLevel < 20
      ? -1500
      : -Math.floor((100 - luckLevel) * 8);
  const jitter = Math.floor(rng() * 200) - 100;
  const total = starting + statusCost + totalAchCost + brainRotCost + luckBonus + jitter;

  return {
    verdict,
    aura: { starting, statusCost, achievementCosts, brainRotCost, luckBonus, total },
    brainRotLevel,
    brainRotTier: getBrainRotTier(brainRotLevel),
  };
}
