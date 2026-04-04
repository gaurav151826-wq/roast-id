import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Sparkles } from 'lucide-react';
import RoastCard from '../components/RoastCard';

interface CardData {
  id: number;
  name: string;
  status: string;
  achievements: string;
  luck_level: number;
  brain_rot_level: number;
  issue_id: string;
  is_verified: boolean;
  downloads: number;
  shares: number;
  views: number;
  created_at: string;
}

export default function CardView() {
  const { issueId } = useParams<{ issueId: string }>();
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!issueId) { setError(true); setLoading(false); return; }
    fetch(`/api/card?id=${encodeURIComponent(issueId)}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(data => { setCard(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [issueId]);

  // Parse achievements from JSON string
  const achievements: string[] = card ? (() => {
    try { return JSON.parse(card.achievements); } catch { return []; }
  })() : [];

  return (
    <div className="min-h-screen cyber-bg grid-overlay scanline-effect">
      <div className="relative z-10 px-4 py-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2))', border: '1px solid rgba(139,92,246,0.3)' }}
          >
            <Shield size={24} className="text-cyber-purple" />
          </motion.div>
          <h1
            className="text-3xl md:text-5xl font-black leading-none mb-1"
            style={{ fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #8B5CF6, #06B6D4, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '2px' }}
          >
            ROAST LICENSE
          </h1>
          <p className="text-xs mt-2 tracking-wider" style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)' }}>
            OFFICIAL DOCUMENT • NO APPEALS
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <Shield size={32} className="text-cyber-purple" />
            </motion.div>
            <p className="text-sm text-white/40" style={{ fontFamily: 'var(--font-mono)' }}>LOADING LICENSE...</p>
          </div>
        )}

        {/* Error / Not found */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🚨</div>
            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>LICENSE NOT FOUND</h2>
            <p className="text-sm text-white/40 mb-8" style={{ fontFamily: 'var(--font-mono)' }}>This roast license doesn't exist or has been revoked.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', fontFamily: 'var(--font-display)' }}
            >
              <Sparkles size={16} />
              GET YOUR OWN LICENSE
            </Link>
          </motion.div>
        )}

        {/* Card display */}
        {card && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            className="flex flex-col items-center"
          >
            {/* Owner banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl px-5 py-3 mb-6 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.3))' }}>
                <span className="text-sm">🪪</span>
              </div>
              <div>
                <div className="text-xs text-white/40" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>LICENSED TO</div>
                <div className="text-sm font-bold text-white">{card.name.toUpperCase()}</div>
              </div>
              <div className="ml-auto text-[10px] text-white/20" style={{ fontFamily: 'var(--font-mono)' }}>#{card.issue_id}</div>
            </motion.div>

            {/* The card */}
            <div className="overflow-x-auto max-w-full pb-2">
              <RoastCard
                name={card.name}
                status={card.status}
                achievements={achievements}
                luckLevel={card.luck_level}
                brainRotLevel={card.brain_rot_level || 50}
                photo={null}
                issueId={card.issue_id}
                isVerified={card.is_verified || false}
              />
            </div>

            {/* Card stats */}
            {(card.views > 0 || card.downloads > 0 || card.shares > 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center gap-4 mt-4"
              >
                {card.views > 0 && (
                  <div className="text-center">
                    <div className="text-sm font-bold text-cyber-purple" style={{ fontFamily: 'var(--font-display)' }}>{card.views}</div>
                    <div className="text-[9px] text-white/25" style={{ fontFamily: 'var(--font-mono)' }}>VIEWS</div>
                  </div>
                )}
                {card.downloads > 0 && (
                  <div className="text-center">
                    <div className="text-sm font-bold text-cyber-cyan" style={{ fontFamily: 'var(--font-display)' }}>{card.downloads}</div>
                    <div className="text-[9px] text-white/25" style={{ fontFamily: 'var(--font-mono)' }}>SAVES</div>
                  </div>
                )}
                {card.shares > 0 && (
                  <div className="text-center">
                    <div className="text-sm font-bold text-cyber-pink" style={{ fontFamily: 'var(--font-display)' }}>{card.shares}</div>
                    <div className="text-[9px] text-white/25" style={{ fontFamily: 'var(--font-mono)' }}>SHARES</div>
                  </div>
                )}
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-white/40 mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
                Think you can do worse? 💀
              </p>
              <Link
                to="/"
                className="cyber-btn inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                  boxShadow: '0 0 30px rgba(139,92,246,0.25), 0 0 60px rgba(6,182,212,0.1)',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '1.5px',
                }}
              >
                <Sparkles size={18} />
                GET YOUR OWN LICENSE
              </Link>
            </motion.div>
          </motion.div>
        )}

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-white/25 hover:text-white/50 transition-colors"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <ArrowLeft size={12} />
            BACK TO HOME
          </Link>
        </motion.div>

        <motion.footer className="text-center mt-16 pb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <div className="text-[10px] tracking-[3px] uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.12)' }}>ROAST LICENSE AUTHORITY © 2026 • ALL ROASTS FINAL</div>
        </motion.footer>
      </div>
    </div>
  );
}
