import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Shield, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LicenseData {
  id: number;
  name: string;
  status: string;
  luck_level: number;
  issue_id: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  'Legibly Cooked': '#EF4444',
  '100% Simp': '#EC4899',
  'Professional Yapper': '#F59E0B',
  'Broke Legend': '#10B981',
  '3 AM Overthinker': '#8B5CF6',
};

export default function RecentLicenses() {
  const [licenses, setLicenses] = useState<LicenseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/licenses')
      .then(r => r.json())
      .then(data => { 
        // ✅ SAFETY CHECK: Only set if data is an array
        if (Array.isArray(data)) {
          setLicenses(data); 
        } else {
          setLicenses([]); // Set empty list if API fails
        }
        setLoading(false); 
      })
      .catch(() => {
        setLicenses([]);
        setLoading(false);
      });
  }, []);

  // ✅ PREVENT CRASH: If licenses isn't an array yet, don't render the list
  if (loading || !Array.isArray(licenses) || licenses.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="mt-16 w-full max-w-md mx-auto"
    >
      <h3
        className="text-center text-sm mb-5 tracking-[4px] flex items-center justify-center gap-2"
        style={{ fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.4)' }}
      >
        <Clock size={14} />
        RECENTLY LICENSED
      </h3>
      <div className="space-y-2">
        {licenses.slice(0, 8).map((l, i) => (
          <motion.div
            key={l.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.06 }}
          >
            <Link
              to={`/card/${l.issue_id}`}
              className="glass flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/[0.08] transition-colors group cursor-pointer block"
            >
              <div className="flex items-center gap-3">
                <Shield size={13} style={{ color: STATUS_COLORS[l.status] || '#8B5CF6' }} />
                <span className="font-semibold text-sm text-white/80">{l.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold" style={{ color: STATUS_COLORS[l.status] || '#8B5CF6', fontFamily: 'var(--font-mono)' }}>{l.status}</span>
                <span className="text-[10px] text-white/20 font-mono">{l.luck_level}%</span>
                <ExternalLink size={10} className="text-white/15 group-hover:text-white/40 transition-colors" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
