import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flame, Brain, Coffee, Sparkles, ChevronDown } from 'lucide-react';

const VIBES = [
  { value: 'Cooked', icon: Flame, color: '#FF6B00' },
  { value: 'Chilling', icon: Coffee, color: '#00FFFF' },
  { value: 'Hustling', icon: Zap, color: '#39FF14' },
  { value: 'Overthinking', icon: Brain, color: '#FF10F0' },
];

const ADDICTIONS = [
  'Doomscrolling', 'Coffee', 'Netflix', 'Gym', 'Procrastinating',
  'Spotify', 'TikTok', 'Napping', 'Online Shopping', 'Gaming',
  'Overthinking', 'Snacking', 'YouTube', 'Memes', 'Crypto',
  'Energy Drinks', 'Late Nights', 'Retail Therapy',
];

interface FormData {
  name: string;
  vibe: string;
  addictions: string[];
  lifeProgress: number;
}

interface VibeFormProps {
  onGenerate: (data: FormData) => void;
  isGenerating: boolean;
}

export default function VibeForm({ onGenerate, isGenerating }: VibeFormProps) {
  const [name, setName] = useState('');
  const [vibe, setVibe] = useState('');
  const [addictions, setAddictions] = useState<string[]>([]);
  const [lifeProgress, setLifeProgress] = useState(50);
  const [vibeOpen, setVibeOpen] = useState(false);

  const toggleAddiction = (a: string) => {
    if (addictions.includes(a)) {
      setAddictions(addictions.filter(x => x !== a));
    } else if (addictions.length < 3) {
      setAddictions([...addictions, a]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !vibe || addictions.length === 0) return;
    onGenerate({ name: name.trim(), vibe, addictions, lifeProgress });
  };

  const selectedVibe = VIBES.find(v => v.value === vibe);

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-lg mx-auto"
    >
      {/* Name */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-neon-green font-bold text-sm mb-2 tracking-widest uppercase" style={{ fontFamily: 'var(--font-display)' }}>
          YOUR NAME
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name..."
          className="brutal-input w-full px-4 py-3 text-lg"
          maxLength={24}
          required
        />
      </motion.div>

      {/* Vibe Selector */}
      <motion.div
        className="mb-6 relative"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-neon-green font-bold text-sm mb-2 tracking-widest uppercase" style={{ fontFamily: 'var(--font-display)' }}>
          CURRENT VIBE
        </label>
        <button
          type="button"
          onClick={() => setVibeOpen(!vibeOpen)}
          className="brutal-input w-full px-4 py-3 text-lg text-left flex items-center justify-between"
        >
          {selectedVibe ? (
            <span className="flex items-center gap-2">
              <selectedVibe.icon size={20} style={{ color: selectedVibe.color }} />
              {selectedVibe.value}
            </span>
          ) : (
            <span className="text-gray-400">Select your vibe...</span>
          )}
          <ChevronDown size={20} className={`transition-transform ${vibeOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {vibeOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scaleY: 0.8 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -10, scaleY: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-1 border-4 border-brutal-black bg-brutal-white origin-top"
            >
              {VIBES.map(v => (
                <button
                  key={v.value}
                  type="button"
                  onClick={() => { setVibe(v.value); setVibeOpen(false); }}
                  className="w-full px-4 py-3 text-left text-brutal-black font-bold flex items-center gap-3 hover:bg-neon-green transition-colors"
                >
                  <v.icon size={20} style={{ color: v.color }} />
                  {v.value}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Addictions */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-neon-green font-bold text-sm mb-2 tracking-widest uppercase" style={{ fontFamily: 'var(--font-display)' }}>
          TOP 3 DAILY ADDICTIONS <span className="text-neon-pink">({addictions.length}/3)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {ADDICTIONS.map(a => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAddiction(a)}
              className={`tag-chip px-3 py-1.5 text-sm font-bold ${
                addictions.includes(a)
                  ? 'selected'
                  : 'bg-brutal-white text-brutal-black'
              } ${!addictions.includes(a) && addictions.length >= 3 ? 'opacity-40 cursor-not-allowed' : ''}`}
              disabled={!addictions.includes(a) && addictions.length >= 3}
            >
              {a}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Life Progress */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label className="block text-neon-green font-bold text-sm mb-2 tracking-widest uppercase" style={{ fontFamily: 'var(--font-display)' }}>
          LIFE PROGRESS
        </label>
        <div className="relative">
          <input
            type="range"
            min={0}
            max={100}
            value={lifeProgress}
            onChange={e => setLifeProgress(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500 font-bold">0% (NPC)</span>
            <motion.span
              key={lifeProgress}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold"
              style={{
                fontFamily: 'var(--font-display)',
                color: lifeProgress > 75 ? '#39FF14' : lifeProgress > 40 ? '#FFE600' : '#FF10F0',
              }}
            >
              {lifeProgress}%
            </motion.span>
            <span className="text-xs text-gray-500 font-bold">100% (GOAT)</span>
          </div>
        </div>
      </motion.div>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={!name.trim() || !vibe || addictions.length === 0 || isGenerating}
        className="brutal-btn w-full py-4 text-xl bg-neon-green text-brutal-black flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Sparkles size={24} />
        {isGenerating ? 'PRINTING...' : 'GENERATE MY RECEIPT'}
        <Sparkles size={24} />
      </motion.button>
    </motion.form>
  );
}
