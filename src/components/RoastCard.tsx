import { forwardRef, useState, useCallback, useMemo } from 'react';
import { Shield, Star, Award } from 'lucide-react';
import { generateRoast } from '../lib/roastEngine';
import type { AuraBreakdown, BrainRotTier } from '../lib/roastEngine';

interface RoastCardProps {
  name: string;
  status: string;
  achievements: string[];
  luckLevel: number;
  brainRotLevel: number;
  photo: string | null;
  issueId: string;
  isVerified: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  'Legibly Cooked': '#EF4444',
  '100% Simp': '#EC4899',
  'Professional Yapper': '#F59E0B',
  'Broke Legend': '#10B981',
  '3 AM Overthinker': '#8B5CF6',
};

const STATUS_CLASS: Record<string, string> = {
  'Legibly Cooked': 'S',
  '100% Simp': 'A',
  'Professional Yapper': 'B',
  'Broke Legend': 'C',
  '3 AM Overthinker': 'X',
};

const STATUS_VIBE: Record<string, string> = {
  'Legibly Cooked': 'Permanently on fire. No extinguisher found.',
  '100% Simp': 'Down bad. Down catastrophic. Down astronomical.',
  'Professional Yapper': 'Talks more than they think. Which is saying a lot.',
  'Broke Legend': 'Rich in spirit. Bankrupt in everything else.',
  '3 AM Overthinker': 'Brain never clocks out. Sleep is a myth.',
};

function getSpawnDate(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i);
  hash = Math.abs(hash);
  const month = (hash % 12) + 1;
  const day = (hash % 28) + 1;
  const year = 1995 + (hash % 10);
  return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
}

function getCurrentAddy(name: string): string {
  const addys = ["Mom's Basement, WiFi Lane", 'Bed, Blanket District', 'Couch, Living Room Blvd', 'DMs, Internet City', 'Cloud 9, Delusional Ave', 'Nowhere, Lost County'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i);
  return addys[Math.abs(hash) % addys.length];
}

function BrainRotMeter({ level, tier }: { level: number; tier: BrainRotTier }) {
  const barColor = level <= 30
    ? '#10B981'
    : level <= 70
      ? '#F59E0B'
      : level <= 99
        ? '#EF4444'
        : '#DC2626';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
          <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', fontFamily: "'JetBrains Mono', monospace" }}>BRAIN_ROT_LEVEL</div>
          <div style={{ fontSize: '8px', fontWeight: 700, color: tier.color, fontFamily: "'JetBrains Mono', monospace" }}>{tier.emoji} {tier.label.toUpperCase()}</div>
        </div>
        <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
          {/* Solid color bar — no CSS gradients that break in export */}
          <div
            style={{
              width: `${level}%`,
              height: '100%',
              borderRadius: '4px',
              backgroundColor: barColor,
            }}
          />
          <div style={{ position: 'absolute', left: '30%', top: 0, width: '1px', height: '100%', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ position: 'absolute', left: '70%', top: 0, width: '1px', height: '100%', background: 'rgba(255,255,255,0.1)' }} />
        </div>
      </div>
      <div style={{ fontSize: '14px', fontWeight: 800, fontFamily: "'Orbitron', sans-serif", color: tier.color, minWidth: '36px', textAlign: 'right' }}>{level}%</div>
    </div>
  );
}

function AuraTracker({ aura }: { aura: AuraBreakdown }) {
  const isNegative = aura.total < 0;
  const borderColor = isNegative ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)';
  const numberColor = isNegative ? '#EF4444' : '#10B981';

  return (
    <div
      style={{
        backgroundColor: 'rgba(0,0,0,0.35)',
        border: `1px solid ${borderColor}`,
        borderRadius: '10px',
        padding: '8px 12px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)', letterSpacing: '2.5px', fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}>
            ✨ TOTAL AURA
          </div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 900,
              fontFamily: "'Orbitron', sans-serif",
              color: numberColor,
              letterSpacing: '1px',
            }}
          >
            {aura.total > 0 ? '+' : ''}{aura.total.toLocaleString()}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', fontSize: '7px', fontFamily: "'JetBrains Mono', monospace" }}>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>START: <span style={{ color: '#10B981' }}>+{aura.starting.toLocaleString()}</span></span>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>STATUS: <span style={{ color: '#EF4444' }}>{aura.statusCost.toLocaleString()}</span></span>
          {aura.achievementCosts.map((a, i) => (
            <span key={i} style={{ color: 'rgba(255,255,255,0.2)' }}>
              {a.name.length > 18 ? a.name.slice(0, 16) + '..' : a.name}: <span style={{ color: '#EF4444' }}>{a.cost.toLocaleString()}</span>
            </span>
          ))}
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>ROT: <span style={{ color: '#EF4444' }}>{aura.brainRotCost.toLocaleString()}</span></span>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>LUCK: <span style={{ color: aura.luckBonus >= 0 ? '#10B981' : '#EF4444' }}>{aura.luckBonus > 0 ? '+' : ''}{aura.luckBonus.toLocaleString()}</span></span>
        </div>
      </div>
    </div>
  );
}

const RoastCard = forwardRef<HTMLDivElement, RoastCardProps>(
  ({ name, status, achievements, luckLevel, brainRotLevel, photo, issueId, isVerified }, ref) => {
    const [shimmerPos, setShimmerPos] = useState({ x: -100, y: 0 });
    const statusColor = STATUS_COLORS[status] || '#8B5CF6';
    const classType = STATUS_CLASS[status] || '?';
    const vibeCord = STATUS_VIBE[status] || 'Vibes: Unknown. Proceed with caution.';
    const spawnDate = getSpawnDate(name);
    const addy = getCurrentAddy(name);

    const roast = useMemo(
      () => generateRoast(name, status, achievements, luckLevel, brainRotLevel, issueId),
      [name, status, achievements, luckLevel, brainRotLevel, issueId]
    );

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 200 - 100;
      const y = ((e.clientY - rect.top) / rect.height) * 200 - 100;
      setShimmerPos({ x, y });
    }, []);

    const handleMouseLeave = useCallback(() => {
      setShimmerPos({ x: -100, y: 0 });
    }, []);

    const today = new Date();
    const issueDate = today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

    return (
      <div
        ref={ref}
        id="roast-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="holo-shimmer relative"
        style={{
          '--shimmer-x': `${shimmerPos.x}%`,
          width: '500px',
          borderRadius: '20px',
          overflow: 'hidden',
          /* CRITICAL: Solid background for PNG export — no transparency */
          backgroundColor: '#0B0620',
          backgroundImage: 'linear-gradient(145deg, #110B30, #050214)',
          boxShadow: '0 0 40px rgba(139,92,246,0.15), 0 0 80px rgba(6,182,212,0.08), 0 20px 60px rgba(0,0,0,0.5)',
          fontFamily: "'Exo 2', sans-serif",
          position: 'relative',
        } as React.CSSProperties}
      >
        {/* Gradient border — rendered as 4 edge strips for canvas compatibility */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #8B5CF6, #06B6D4, #EC4899)', borderRadius: '20px 20px 0 0', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #EC4899, #06B6D4, #8B5CF6)', borderRadius: '0 0 20px 20px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '2px', background: 'linear-gradient(180deg, #8B5CF6, #EC4899)', borderRadius: '20px 0 0 20px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '2px', background: 'linear-gradient(180deg, #06B6D4, #8B5CF6)', borderRadius: '0 20px 20px 0', pointerEvents: 'none' }} />

        {/* Inner content */}
        <div style={{ position: 'relative', zIndex: 5, padding: '16px 20px', display: 'flex', flexDirection: 'column' }}>

          {/* HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Shield size={13} style={{ color: '#8B5CF6' }} />
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '10px', fontWeight: 800, letterSpacing: '2.5px', color: '#8B5CF6' }}>OFFICIAL ROAST LICENSE</span>
              </div>
              <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.25)', letterSpacing: '2px', marginTop: '2px', fontFamily: "'JetBrains Mono', monospace" }}>GOVERNMENT OF THE INTERNET • EST. 2026</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusColor }} />
              <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>ACTIVE</span>
            </div>
          </div>

          {/* MAIN ROW */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '8px' }}>
            {/* Photo */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: '76px', height: '76px', borderRadius: '50%', padding: '3px', background: `conic-gradient(from 0deg, ${statusColor}, #8B5CF6, #06B6D4, ${statusColor})` }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#110B30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {photo ? <img src={photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '30px' }}>👤</span>}
                </div>
              </div>
              {isVerified && (
                <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFD700, #FFA500)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #110B30' }}>
                  <span style={{ fontSize: '12px' }}>🤡</span>
                </div>
              )}
            </div>

            {/* Fields */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div>
                <div style={{ fontSize: '6px', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', fontFamily: "'JetBrains Mono', monospace" }}>SUBJECT_ALIAS</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', letterSpacing: '0.5px' }}>{name.toUpperCase()}</div>
              </div>
              <div>
                <div style={{ fontSize: '6px', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', fontFamily: "'JetBrains Mono', monospace" }}>MAIN_CHARACTER_ROLE</div>
                <div style={{ fontSize: '10px', fontWeight: 600, color: statusColor }}>{status}</div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '1px' }}>
                <div>
                  <div style={{ fontSize: '6px', color: 'rgba(255,255,255,0.25)', letterSpacing: '1.5px', fontFamily: "'JetBrains Mono', monospace" }}>ISSUE_ID</div>
                  <div style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', fontFamily: "'JetBrains Mono', monospace" }}>#{issueId}</div>
                </div>
                <div>
                  <div style={{ fontSize: '6px', color: 'rgba(255,255,255,0.25)', letterSpacing: '1.5px', fontFamily: "'JetBrains Mono', monospace" }}>CLASS_TYPE</div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: statusColor, fontFamily: "'JetBrains Mono', monospace" }}>CLASS {classType}</div>
                </div>
                <div>
                  <div style={{ fontSize: '6px', color: 'rgba(255,255,255,0.25)', letterSpacing: '1.5px', fontFamily: "'JetBrains Mono', monospace" }}>SPAWN_DATE</div>
                  <div style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', fontFamily: "'JetBrains Mono', monospace" }}>{spawnDate}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ADDY + VIBE */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '6px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '6px', color: 'rgba(255,255,255,0.25)', letterSpacing: '2px', fontFamily: "'JetBrains Mono', monospace", marginBottom: '1px' }}>CURRENT_ADDY</div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>{addy}</div>
            </div>
            <div style={{ flex: 1.5 }}>
              <div style={{ fontSize: '6px', color: 'rgba(255,255,255,0.25)', letterSpacing: '2px', fontFamily: "'JetBrains Mono', monospace", marginBottom: '1px' }}>VIBE_CORDED</div>
              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>{vibeCord}</div>
            </div>
          </div>

          {/* BRAIN ROT */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '7px', marginBottom: '6px' }}>
            <BrainRotMeter level={roast.brainRotLevel} tier={roast.brainRotTier} />
          </div>

          {/* ACHIEVEMENTS */}
          <div style={{ marginBottom: '6px' }}>
            <div style={{ fontSize: '6px', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', fontFamily: "'JetBrains Mono', monospace", marginBottom: '3px' }}>RECENT_ACHIEVEMENTS</div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {roast.aura.achievementCosts.map((a, i) => (
                <span key={i} style={{ fontSize: '7px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.2)', color: 'rgba(255,255,255,0.55)', fontFamily: "'JetBrains Mono', monospace", display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {a.name}
                  <span style={{ color: '#EF4444', fontWeight: 700, fontSize: '7px' }}>({a.cost.toLocaleString()})</span>
                </span>
              ))}
            </div>
          </div>

          {/* AURA TRACKER */}
          <AuraTracker aura={roast.aura} />

          {/* OFFICER'S VERDICT */}
          <div style={{ marginTop: '6px', padding: '8px 10px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%) rotate(-12deg)', fontSize: '32px', fontFamily: "'Caveat', cursive", fontWeight: 700, color: 'rgba(239, 68, 68, 0.07)', letterSpacing: '3px', textTransform: 'uppercase', pointerEvents: 'none', whiteSpace: 'nowrap', lineHeight: 1 }}>COOKED</div>
            <div style={{ position: 'absolute', top: '3px', right: '6px', width: '42px', height: '42px', borderRadius: '50%', border: '2px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-18deg)' }}>
              <span style={{ fontSize: '6px', fontFamily: "'Orbitron', sans-serif", fontWeight: 800, color: 'rgba(239, 68, 68, 0.5)', letterSpacing: '1px', textAlign: 'center', lineHeight: 1.2 }}>ROAST<br />DEPT.</span>
            </div>
            <div style={{ fontSize: '6px', color: 'rgba(239, 68, 68, 0.55)', letterSpacing: '2.5px', fontFamily: "'Orbitron', sans-serif", fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>🚨 OFFICER'S VERDICT</div>
            <div style={{ fontSize: '10px', lineHeight: 1.45, color: 'rgba(255, 200, 200, 0.85)', fontFamily: "'Caveat', cursive", fontWeight: 700, fontStyle: 'italic', paddingRight: '48px', letterSpacing: '0.3px' }}>"{roast.verdict}"</div>
          </div>

          {/* FOOTER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '6px', color: 'rgba(255,255,255,0.2)', letterSpacing: '1px', fontFamily: "'JetBrains Mono', monospace" }}>ISSUE_DATE</div>
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>{issueDate}</div>
              </div>
              <div>
                <div style={{ fontSize: '6px', color: 'rgba(255,255,255,0.2)', letterSpacing: '1px', fontFamily: "'JetBrains Mono', monospace" }}>LUCK_LVL</div>
                <div style={{ fontSize: '8px', color: '#06B6D4', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{luckLevel}%</div>
              </div>
              <div>
                <div style={{ fontSize: '6px', color: 'rgba(255,255,255,0.2)', letterSpacing: '1px', fontFamily: "'JetBrains Mono', monospace" }}>EXPIRY_DATE</div>
                <div style={{ fontSize: '7px', color: '#EF4444', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>NEVER (STAY COOKED)</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {isVerified && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', backgroundColor: 'rgba(255,215,0,0.12)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255,215,0,0.3)' }}>
                  <Star size={8} style={{ color: '#FFD700' }} />
                  <span style={{ fontSize: '6px', color: '#FFD700', fontWeight: 700, fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px' }}>VERIFIED</span>
                </div>
              )}
              <Award size={11} style={{ color: 'rgba(255,255,255,0.12)' }} />
            </div>
          </div>

          {/* VIRAL BRANDING WATERMARK */}
          <div style={{ textAlign: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
            <span style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.2)', letterSpacing: '3px' }}>GET YOURS AT: ROAST-LICENSE.COM</span>
          </div>
        </div>

        {/* Pattern overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.02, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)', pointerEvents: 'none', zIndex: 1 }} />
      </div>
    );
  }
);

RoastCard.displayName = 'RoastCard';
export default RoastCard;
