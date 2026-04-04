import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Flame, Coffee, Zap, Brain } from 'lucide-react';

interface ReceiptData {
  id: number;
  name: string;
  vibe: string;
  addictions: string[];
  life_progress: number;
  transaction_id: string;
  created_at: string;
}

const VIBE_ICONS: Record<string, typeof Flame> = {
  'Cooked': Flame,
  'Chilling': Coffee,
  'Hustling': Zap,
  'Overthinking': Brain,
};

const VIBE_COLORS: Record<string, string> = {
  'Cooked': '#FF6B00',
  'Chilling': '#00FFFF',
  'Hustling': '#39FF14',
  'Overthinking': '#FF10F0',
};

export default function RecentReceipts() {
  const [receipts, setReceipts] = useState<ReceiptData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/receipts')
      .then(r => r.json())
      .then(data => { setReceipts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || receipts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-16 w-full max-w-lg mx-auto"
    >
      <h3
        className="text-center text-neon-yellow text-lg mb-4 tracking-widest"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <Clock size={18} className="inline mr-2" />
        RECENT RECEIPTS
      </h3>
      <div className="space-y-2">
        {receipts.slice(0, 8).map((r, i) => {
          const Icon = VIBE_ICONS[r.vibe] || Flame;
          const color = VIBE_COLORS[r.vibe] || '#fff';
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className="flex items-center justify-between bg-brutal-gray border-2 border-gray-700 px-4 py-2.5"
            >
              <div className="flex items-center gap-3">
                <Icon size={16} style={{ color }} />
                <span className="font-bold text-sm">{r.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span style={{ color }} className="font-bold">{r.vibe}</span>
                <span className="text-gray-500">{r.life_progress}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
