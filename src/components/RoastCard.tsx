import { forwardRef, useState, useCallback, useMemo } from 'react';
import { Shield, Star } from 'lucide-react';
import { generateRoast } from '../lib/roastEngine';
import type { BrainRotTier } from '../lib/roastEngine';

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
  'Legibly Cooked': 'S', '100% Simp': 'A', 'Professional Yapper': 'B', 'Broke Legend': 'C', '3 AM Overthinker': 'X',
};

function getSpawnDate(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = ((h << 5) - h) + name.charCodeAt(i);
  h = Math.abs(h);
  return `${String((h % 12) + 1).padStart(2, '0')}/${String((h % 28) + 1).padStart(2, '0')}/${1995 + (h % 10)}`;
}

function BrainRotBar({ level, tier }: { level: number; tier: BrainRotTier }) {
  const barColor = level <= 30 ? '#10B981' : level <= 70 ? '#F59E0B' : '#EF4444';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>BRAIN ROT</span>
        <span style={{ fontSize: '12px', fontWeight: 700, color: tier.color, fontFamily: "'JetBrains Mono', monospace" }}>{tier.emoji} {tier.label.toUpperCase()} {level}%</span>
      </div>
      <div style={{ height: '10px', borderRadius: '5px', backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ width: `${level}%`, height: '100%', borderRadius: '5px', backgroundColor: barColor }} />
        <div style={{ position: 'absolute', left: '30%', top: 0, width: '1px', height: '100%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', left: '70%', top: 0, width: '1px', height: '100%', background: 'rgba(255,255,255,0.08)' }} />
      </div>
    </div>
  );
}

const LBL: React.CSSProperties = { fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, marginBottom: '3px' };
const SLBL: React.CSSProperties = { fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, marginBottom: '2px' };
const SVAL: React.CSSProperties = { fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', monospace" };
const DIV: React.CSSProperties = { borderTop: '1px solid rgba(255,255,255,0.06)', margin: '14px 0' };

const RoastCard = forwardRef<HTMLDivElement, RoastCardProps>(
  ({ name, status, achievements, luckLevel, brainRotLevel, photo, issueId, isVerified }, ref) => {
    const [shimmerPos, setShimmerPos] = useState({ x: -100, y: 0 });
    const sc = STATUS_COLORS[status] || '#8B5CF6';
    const classType = STATUS_CLASS[status] || '?';
    const spawnDate = getSpawnDate(name);

    const roast = useMemo(
      () => generateRoast(name, status, achievements, luckLevel, brainRotLevel, issueId),
      [name, status, achievements, luckLevel, brainRotLevel, issueId]
    );

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setShimmerPos({ x: ((e.clientX - rect.left) / rect.width) * 200 - 100, y: ((e.clientY - rect.top) / rect.height) * 200 - 100 });
    }, []);

    const issueDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const auraStr = (roast.aura.total > 0 ? '+' : '') + roast.aura.total.toLocaleString();
    const isNeg = roast.aura.total < 0;

    return (
      <div
        ref={ref}
        id="roast-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShimmerPos({ x: -100, y: 0 })}
        className="holo-shimmer roast-card relative"
        style={{
          '--shimmer-x': `${shimmerPos.x}%`,
          width: 'min(540px, 100%)',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#0B0620',
          backgroundImage: 'linear-gradient(145deg, #110B30, #050214)',
          boxShadow: '0 0 40px rgba(139,92,246,0.15), 0 20px 60px rgba(0,0,0,0.5)',
          fontFamily: "'Exo 2', sans-serif",
          position: 'relative',
        } as React.CSSProperties}
      >
        {/* Border edges */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #8B5CF6, #06B6D4, #EC4899)', borderRadius: '24px 24px 0 0' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #EC4899, #06B6D4, #8B5CF6)', borderRadius: '0 0 24px 24px' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '2px', background: 'linear-gradient(180deg, #8B5CF6, #EC4899)', borderRadius: '24px 0 0 24px' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '2px', background: 'linear-gradient(180deg, #06B6D4, #8B5CF6)', borderRadius: '0 24px 24px 0' }} />

        <div className="roast-card-inner" style={{ position: 'relative', zIndex: 5, padding: '24px 28px' }}>

          {/* HEADER */}
          <div className="roast-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="roast-card-title-wrap" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} style={{ color: '#8B5CF6' }} />
              <span className="roast-card-title" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '13px', fontWeight: 800, letterSpacing: '3px', color: '#8B5CF6' }}>OFFICIAL ROAST LICENSE</span>
            </div>
            <div className="roast-card-active" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: sc, boxShadow: `0 0 8px ${sc}` }} />
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>ACTIVE</span>
            </div>
          </div>

          {/* PHOTO + NAME */}
          <div className="roast-card-identity" style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
            <div className="roast-card-avatar-wrap" style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', padding: '3px', background: `conic-gradient(from 0deg, ${sc}, #8B5CF6, #06B6D4, ${sc})` }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {photo ? (
                    <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '36px', opacity: 0.6 }}>👤</span>
                  )}
                </div>
              </div>
              {isVerified && (
                <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFD700, #FFA500)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #110B30' }}>
                  <span style={{ fontSize: '14px' }}>🤡</span>
                </div>
              )}
            </div>
            <div className="roast-card-identity-text" style={{ flex: 1 }}>
              <div style={LBL}>SUBJECT ALIAS</div>
              <div className="roast-card-name" style={{ fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '0.5px', marginBottom: '6px', overflowWrap: 'anywhere' }}>{name.toUpperCase()}</div>
              <div style={LBL}>MAIN CHARACTER ROLE</div>
              <div className="roast-card-status" style={{ fontSize: '14px', fontWeight: 700, color: sc }}>{status}</div>
            </div>
          </div>

          {/* INFO GRID */}
          <div className="roast-card-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '4px' }}>
            <div><div style={SLBL}>ISSUE ID</div><div style={SVAL}>#{issueId}</div></div>
            <div><div style={SLBL}>CLASS</div><div style={{ ...SVAL, color: sc }}>CLASS {classType}</div></div>
            <div><div style={SLBL}>SPAWN DATE</div><div style={SVAL}>{spawnDate}</div></div>
          </div>

          <div style={DIV} />

          {/* BRAIN ROT */}
          <BrainRotBar level={roast.brainRotLevel} tier={roast.brainRotTier} />

          <div style={DIV} />

          {/* ACHIEVEMENTS */}
          <div>
            <div style={{ ...LBL, marginBottom: '8px' }}>ACHIEVEMENTS</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {achievements.map((a, i) => (
                <span key={i} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: 'rgba(255,255,255,0.65)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {a}
                </span>
              ))}
            </div>
          </div>

          <div style={DIV} />

          {/* AURA — clean, just the total */}
          <div className="roast-card-aura" style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: `1px solid ${isNeg ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`, borderRadius: '12px', padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="roast-card-aura-label" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', letterSpacing: '3px', fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}>✨ TOTAL AURA</span>
            <span className="roast-card-aura-value" style={{ fontSize: '28px', fontWeight: 900, fontFamily: "'Orbitron', sans-serif", color: isNeg ? '#EF4444' : '#10B981' }}>{auraStr}</span>
          </div>

          <div style={DIV} />

          {/* OFFICER'S VERDICT */}
          <div style={{ padding: '14px 16px', borderRadius: '12px', backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', right: '14px', transform: 'translateY(-50%) rotate(-12deg)', fontSize: '40px', fontFamily: "'Caveat', cursive", fontWeight: 700, color: 'rgba(239,68,68,0.06)', letterSpacing: '3px', pointerEvents: 'none', whiteSpace: 'nowrap' }}>COOKED</div>
            <div style={{ position: 'absolute', top: '6px', right: '10px', width: '48px', height: '48px', borderRadius: '50%', border: '2px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-18deg)' }}>
              <span style={{ fontSize: '8px', fontFamily: "'Orbitron', sans-serif", fontWeight: 800, color: 'rgba(239,68,68,0.45)', letterSpacing: '1px', textAlign: 'center', lineHeight: 1.2 }}>ROAST<br />DEPT.</span>
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(239,68,68,0.5)', letterSpacing: '3px', fontFamily: "'Orbitron', sans-serif", fontWeight: 700, marginBottom: '8px' }}>🚨 OFFICER'S VERDICT</div>
            <div
              style={{
                fontSize: '15px',
                lineHeight: 1.5,
                color: 'rgba(255,200,200,0.95)',
                fontFamily: "'Exo 2', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 700,
                fontStyle: 'normal',
                paddingRight: '56px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              "{roast.verdict}"
            </div>
          </div>

          <div style={DIV} />

          {/* FOOTER */}
          <div className="roast-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="roast-card-footer-meta" style={{ display: 'flex', gap: '20px' }}>
              <div><div style={SLBL}>ISSUED</div><div style={SVAL}>{issueDate}</div></div>
              <div><div style={SLBL}>LUCK</div><div style={{ ...SVAL, color: '#06B6D4' }}>{luckLevel}%</div></div>
              <div><div style={SLBL}>EXPIRES</div><div style={{ fontSize: '11px', color: '#EF4444', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>NEVER</div></div>
            </div>
            {isVerified && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255,215,0,0.1)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(255,215,0,0.25)' }}>
                <Star size={10} style={{ color: '#FFD700' }} />
                <span style={{ fontSize: '9px', color: '#FFD700', fontWeight: 700, fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px' }}>VERIFIED</span>
              </div>
            )}
          </div>

          {/* BRANDING */}
          <div style={{ textAlign: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.2)', letterSpacing: '4px' }}>GET YOURS AT: ROAST-LICENSE.COM</span>
          </div>
        </div>

        {/* Pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.015, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.5) 3px, rgba(255,255,255,0.5) 4px)', pointerEvents: 'none', zIndex: 1 }} />
      </div>
    );
  }
);

RoastCard.displayName = 'RoastCard';
export default RoastCard;
