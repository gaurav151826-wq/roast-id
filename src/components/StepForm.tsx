import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Upload, X, User, Sparkles, Zap, Camera, BrainCircuit } from 'lucide-react';
import { ACHIEVEMENT_AURA_COSTS, getBrainRotTier } from '../lib/roastEngine';

const STATUSES = [
  { value: 'Legibly Cooked', emoji: '🔥', color: '#EF4444' },
  { value: '100% Simp', emoji: '💕', color: '#EC4899' },
  { value: 'Professional Yapper', emoji: '🗣️', color: '#F59E0B' },
  { value: 'Broke Legend', emoji: '💸', color: '#10B981' },
  { value: '3 AM Overthinker', emoji: '🧠', color: '#8B5CF6' },
];

const ACHIEVEMENTS = [
  { value: "Sent 'Omw' while in bed", emoji: '🛏️' },
  { value: "Ignored a 'Seen' message", emoji: '👀' },
  { value: 'Stayed in bed 12 hours', emoji: '😴' },
  { value: 'Watched 100 Reels', emoji: '📱' },
  { value: 'Survived on 2 hours sleep', emoji: '☕' },
  { value: "Replied 'lol' to a serious text", emoji: '💀' },
  { value: "Googled 'Am I cooked'", emoji: '🔍' },
  { value: 'Ate cereal at 3 AM', emoji: '🥣' },
  { value: "Stalked an ex's profile", emoji: '🕵️' },
  { value: "Said 'no cap' unironically", emoji: '🧢' },
];

export interface FormData {
  name: string;
  status: string;
  achievements: string[];
  luckLevel: number;
  brainRotLevel: number;
  photo: string | null;
}

interface StepFormProps {
  onGenerate: (data: FormData) => void;
  isGenerating: boolean;
}

const TOTAL_STEPS = 6;

export default function StepForm({ onGenerate, isGenerating }: StepFormProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [luckLevel, setLuckLevel] = useState(50);
  const [brainRotLevel, setBrainRotLevel] = useState(50);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [direction, setDirection] = useState(1);

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return status.length > 0;
    if (step === 3) return achievements.length > 0;
    if (step === 4) return true;
    if (step === 5) return true;
    if (step === 6) return true;
    return false;
  };

  const toggleAchievement = (a: string) => {
    if (achievements.includes(a)) {
      setAchievements(achievements.filter(x => x !== a));
    } else {
      setAchievements([...achievements, a]);
    }
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    onGenerate({ name: name.trim(), status, achievements, luckLevel, brainRotLevel, photo });
  };

  const next = () => { if (step < TOTAL_STEPS) setStep(step + 1); else handleSubmit(); };
  const prev = () => { if (step > 1) setStep(step - 1); };
  const goNext = () => { setDirection(1); next(); };
  const goPrev = () => { setDirection(-1); prev(); };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  // Running aura tally for achievements step
  const runningAuraLoss = achievements.reduce((sum, a) => sum + (ACHIEVEMENT_AURA_COSTS[a] || -500), 0);

  const brainTier = getBrainRotTier(brainRotLevel);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-widest text-cyber-purple" style={{ fontFamily: 'var(--font-display)' }}>
            STEP {step}/{TOTAL_STEPS}
          </span>
          <span className="text-xs text-white/30 font-mono">{Math.round((step / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)' }}
            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[320px] relative">
        <AnimatePresence mode="wait" custom={direction}>
          {/* STEP 1: Name */}
          {step === 1 && (
            <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-purple to-cyber-cyan flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>SUBJECT ALIAS</h2>
                  <p className="text-xs text-white/40">What do they call you on the internet?</p>
                </div>
              </div>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your alias..."
                className="cyber-input w-full px-5 py-4 rounded-xl text-lg font-semibold"
                maxLength={20}
                autoFocus
                onKeyDown={e => e.key === 'Enter' && canProceed() && goNext()}
              />
              <p className="text-xs text-white/20 mt-3 text-right">{name.length}/20</p>
            </motion.div>
          )}

          {/* STEP 2: Status */}
          {step === 2 && (
            <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-pink to-cyber-purple flex items-center justify-center">
                  <Zap size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>MAIN CHARACTER ROLE</h2>
                  <p className="text-xs text-white/40">Current life classification</p>
                </div>
              </div>
              <div className="space-y-2">
                {STATUSES.map(s => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setStatus(s.value)}
                    className={`w-full px-5 py-3.5 rounded-xl text-left font-semibold flex items-center gap-3 transition-all duration-200 ${
                      status === s.value ? 'glass-strong border-cyber-purple shadow-lg shadow-cyber-purple/20' : 'glass hover:bg-white/[0.08]'
                    }`}
                    style={status === s.value ? { borderColor: s.color, boxShadow: `0 0 20px ${s.color}22` } : {}}
                  >
                    <span className="text-xl">{s.emoji}</span>
                    <span className={status === s.value ? 'text-white' : 'text-white/70'}>{s.value}</span>
                    {status === s.value && (
                      <motion.div layoutId="statusCheck" className="ml-auto w-5 h-5 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-cyan flex items-center justify-center">
                        <Sparkles size={12} className="text-white" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Achievements with Aura costs */}
          {step === 3 && (
            <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-cyan to-cyber-green flex items-center justify-center">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>ACHIEVEMENTS</h2>
                    <p className="text-xs text-white/40">Each one costs you aura ✨</p>
                  </div>
                </div>
                {/* Running aura tally */}
                {achievements.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-right"
                  >
                    <div className="text-[9px] text-white/30 tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>AURA HIT</div>
                    <div className="text-lg font-black text-red-400" style={{ fontFamily: 'var(--font-display)' }}>{runningAuraLoss.toLocaleString()}</div>
                  </motion.div>
                )}
              </div>
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,92,246,0.3) transparent' }}>
                {ACHIEVEMENTS.map(a => {
                  const cost = ACHIEVEMENT_AURA_COSTS[a.value] || -500;
                  const isSelected = achievements.includes(a.value);
                  return (
                    <button
                      key={a.value}
                      type="button"
                      onClick={() => toggleAchievement(a.value)}
                      className={`achievement-chip w-full px-4 py-3 rounded-xl text-left font-medium flex items-center gap-3 border ${
                        isSelected ? 'selected' : 'border-white/10 text-white/60'
                      }`}
                    >
                      <span className="text-lg flex-shrink-0">{a.emoji}</span>
                      <span className="text-sm flex-1">{a.value}</span>
                      <span className={`text-xs font-bold flex-shrink-0 ${
                        isSelected ? 'text-red-400' : 'text-white/25'
                      }`} style={{ fontFamily: 'var(--font-mono)' }}>
                        {cost.toLocaleString()} ✨
                      </span>
                      {isSelected && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-cyber-cyan text-xs font-bold flex-shrink-0">✓</motion.span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 4: Luck Level */}
          {step === 4 && (
            <motion.div key="step4" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-cyber-pink flex items-center justify-center">
                  <span className="text-xl">🍀</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>LUCK LEVEL</h2>
                  <p className="text-xs text-white/40">How blessed are you really?</p>
                </div>
              </div>
              <div className="glass rounded-2xl p-6 mt-4">
                <div className="text-center mb-6">
                  <motion.div
                    key={luckLevel}
                    initial={{ scale: 1.2, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-6xl font-black bg-gradient-to-r from-cyber-purple to-cyber-cyan bg-clip-text text-transparent"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {luckLevel}%
                  </motion.div>
                  <p className="text-xs text-white/40 mt-2">
                    {luckLevel < 20 ? '💀 Certified Unlucky' : luckLevel < 40 ? '😬 Mid at Best' : luckLevel < 60 ? '🤷 Average Human' : luckLevel < 80 ? '✨ Somewhat Blessed' : '🌟 Main Character Energy'}
                  </p>
                </div>
                <input type="range" min={0} max={100} value={luckLevel} onChange={e => setLuckLevel(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between mt-2 text-[10px] text-white/25 font-mono">
                  <span>0% CURSED</span>
                  <span>100% BLESSED</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Brain Rot Level (NEW) */}
          {step === 5 && (
            <motion.div key="step5" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-cyber-purple flex items-center justify-center">
                  <BrainCircuit size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>BRAIN ROT LEVEL</h2>
                  <p className="text-xs text-white/40">How far gone are you?</p>
                </div>
              </div>
              <div className="glass rounded-2xl p-6 mt-4">
                {/* Tier label */}
                <div className="text-center mb-4">
                  <motion.div
                    key={brainRotLevel}
                    initial={{ scale: 1.15, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl font-black"
                    style={{ fontFamily: 'var(--font-display)', color: brainTier.color }}
                  >
                    {brainRotLevel}%
                  </motion.div>
                  <motion.p
                    key={brainTier.label}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-sm font-bold mt-2"
                    style={{ color: brainTier.color }}
                  >
                    {brainTier.emoji} {brainTier.label}
                  </motion.p>
                </div>

                {/* Brain rot progress bar */}
                <div className="relative h-6 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <motion.div
                    className="h-full rounded-full relative"
                    animate={{ width: `${brainRotLevel}%` }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ background: brainRotLevel <= 30 ? 'linear-gradient(90deg, #10B981, #34D399)' : brainRotLevel <= 70 ? 'linear-gradient(90deg, #F59E0B, #EF4444)' : brainRotLevel <= 99 ? 'linear-gradient(90deg, #EF4444, #DC2626)' : 'linear-gradient(90deg, #DC2626, #7F1D1D)' }}
                  >
                    {brainRotLevel >= 71 && (
                      <div className="brain-rot-pulse absolute inset-0 rounded-full" />
                    )}
                  </motion.div>
                  {/* Tier markers */}
                  <div className="absolute inset-0 flex items-center pointer-events-none">
                    <div className="absolute left-[30%] w-px h-full bg-white/10" />
                    <div className="absolute left-[70%] w-px h-full bg-white/10" />
                    <div className="absolute left-[99%] w-px h-full bg-white/10" />
                  </div>
                </div>

                {/* Tier labels under bar */}
                <div className="flex text-[8px] text-white/20 font-mono mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
                  <span className="flex-1">Normal</span>
                  <span className="flex-1 text-center">Reel Addict</span>
                  <span className="flex-1 text-center">Skibidi</span>
                  <span className="text-right">☠️</span>
                </div>

                <input type="range" min={0} max={100} value={brainRotLevel} onChange={e => setBrainRotLevel(Number(e.target.value))} className="w-full" />
              </div>
            </motion.div>
          )}

          {/* STEP 6: Photo */}
          {step === 6 && (
            <motion.div key="step6" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center">
                  <Camera size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>MUGSHOT</h2>
                  <p className="text-xs text-white/40">Upload your profile pic (optional)</p>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              {photo ? (
                <div className="relative w-40 h-40 mx-auto">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-cyber-purple status-ring">
                    <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <button type="button" onClick={() => setPhoto(null)} className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-red-500/80 backdrop-blur flex items-center justify-center hover:bg-red-500 transition-colors">
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()} className="photo-upload w-full py-12 rounded-2xl flex flex-col items-center gap-3 cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <Upload size={24} className="text-white/30" />
                  </div>
                  <span className="text-sm text-white/40">Tap to upload</span>
                  <span className="text-xs text-white/20">JPG, PNG • Max 5MB</span>
                </button>
              )}
              <p className="text-center text-xs text-white/20 mt-4">Skip if you want the default avatar</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 mt-8">
        {step > 1 && (
          <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} type="button" onClick={goPrev} className="cyber-btn px-5 py-3.5 rounded-xl glass text-sm flex items-center gap-2 text-white/70 hover:text-white">
            <ChevronLeft size={16} /> BACK
          </motion.button>
        )}
        <motion.button
          type="button"
          onClick={goNext}
          disabled={!canProceed() || isGenerating}
          className={`cyber-btn flex-1 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-white disabled:opacity-30 disabled:cursor-not-allowed ${
            step === TOTAL_STEPS ? 'bg-gradient-to-r from-cyber-purple to-cyber-cyan' : 'bg-gradient-to-r from-cyber-purple/80 to-cyber-cyan/80'
          }`}
          whileHover={canProceed() ? { scale: 1.02 } : {}}
          whileTap={canProceed() ? { scale: 0.98 } : {}}
        >
          {isGenerating ? (
            <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Sparkles size={16} /></motion.div> GENERATING...</>
          ) : step === TOTAL_STEPS ? (
            <><Sparkles size={16} /> GENERATE LICENSE</>
          ) : (
            <>NEXT <ChevronRight size={16} /></>
          )}
        </motion.button>
      </div>
    </div>
  );
}
