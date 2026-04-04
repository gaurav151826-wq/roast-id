import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Flame, Download } from 'lucide-react';

interface Stats {
  total: number;
  avgLuck: number;
  avgRot: number;
  totalDownloads: number;
  totalShares: number;
  topStatus: string | null;
}

export default function StatsBar() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  if (!stats || stats.total === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex flex-wrap justify-center gap-3 mb-10"
    >
      <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
        <Users size={13} className="text-cyber-purple" />
        <span className="text-xs font-bold text-cyber-purple" style={{ fontFamily: 'var(--font-mono)' }}>{stats.total}</span>
        <span className="text-[10px] text-white/30">LICENSED</span>
      </div>
      {stats.topStatus && (
        <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
          <Flame size={13} className="text-cyber-pink" />
          <span className="text-xs font-bold text-cyber-pink" style={{ fontFamily: 'var(--font-mono)' }}>{stats.topStatus}</span>
          <span className="text-[10px] text-white/30">TOP</span>
        </div>
      )}
      <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
        <TrendingUp size={13} className="text-cyber-cyan" />
        <span className="text-xs font-bold text-cyber-cyan" style={{ fontFamily: 'var(--font-mono)' }}>{stats.avgRot}%</span>
        <span className="text-[10px] text-white/30">AVG ROT</span>
      </div>
      {(stats.totalDownloads + stats.totalShares) > 0 && (
        <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
          <Download size={13} className="text-neon-cyan" />
          <span className="text-xs font-bold text-neon-cyan" style={{ fontFamily: 'var(--font-mono)' }}>{stats.totalDownloads + stats.totalShares}</span>
          <span className="text-[10px] text-white/30">EXPORTS</span>
        </div>
      )}
    </motion.div>
  );
}
