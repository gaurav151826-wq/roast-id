import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';
import StepForm from './components/StepForm';
import type { FormData } from './components/StepForm';
import RoastCard from './components/RoastCard';
import SharePanel from './components/SharePanel';
import AdsterraGlobalBar from './components/AdsterraGlobalBar';
import NativeBanner from './components/NativeBanner';
import { saveLicense } from './lib/db';

interface LicenseData extends FormData {
  issueId: string;
}

function generateIssueId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export default function App() {
  const [licenseData, setLicenseData] = useState<LicenseData | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(async (formData: FormData) => {
    setIsGenerating(true);
    setShowCard(false);
    setLicenseData(null);
    setIsVerified(false);

    const issueId = generateIssueId();

    saveLicense({
      name: formData.name,
      status: formData.status,
      achievements: JSON.stringify(formData.achievements),
      luck_level: formData.luckLevel,
      brain_rot_level: formData.brainRotLevel,
      issue_id: issueId,
    }).catch(err => console.error('Save error:', err));

    await new Promise(r => setTimeout(r, 1200));
    setLicenseData({ ...formData, issueId });
    await new Promise(r => setTimeout(r, 300));
    setShowCard(true);
    setIsGenerating(false);

    setTimeout(() => {
      document.getElementById('card-area')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
  }, []);

  const handleReset = () => {
    setShowCard(false);
    setTimeout(() => { setLicenseData(null); setIsVerified(false); }, 400);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

    return (
    <div className="min-h-screen cyber-bg grid-overlay scanline-effect">
      <AdsterraGlobalBar />
      <div className="w-full h-[50px] glass flex items-center justify-center border-b border-white/5 px-3">
        <span className="text-[9px] sm:text-[10px] text-white/15 tracking-[2px] sm:tracking-[4px] uppercase text-center" style={{ fontFamily: 'var(--font-mono)' }}>- AD SPACE -</span>
      </div>

      <div className="relative z-10 px-4 py-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2))', border: '1px solid rgba(139,92,246,0.3)' }}
            animate={{ boxShadow: ['0 0 20px rgba(139,92,246,0.2)', '0 0 40px rgba(6,182,212,0.3)', '0 0 20px rgba(139,92,246,0.2)'] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Shield size={28} className="text-cyber-purple" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black leading-none mb-2" style={{ fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #EC4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '2px' }}>ROAST</h1>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black leading-none" style={{ fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #06B6D4 0%, #EC4899 50%, #8B5CF6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '2px' }}>LICENSE</h1>
          <motion.p className="text-xs sm:text-sm mt-4 tracking-[1px] sm:tracking-wider px-2" style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>GET OFFICIALLY CERTIFIED. NO APPEALS.</motion.p>
        </motion.div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {!licenseData && (
            <motion.div key="form" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
              <div className="glass rounded-2xl p-6 md:p-8 neon-border">
                <StepForm onGenerate={handleGenerate} isGenerating={isGenerating} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <NativeBanner show={showAd} />

        {/* Card + Share */}
        <AnimatePresence>
          {licenseData && (
            <motion.div id="card-area" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
              <AnimatePresence>
                {showCard && (
                  <motion.div initial={{ opacity: 0, scale: 0.8, rotateX: 20, y: 40 }} animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }} transition={{ type: 'spring', stiffness: 80, damping: 15, mass: 1 }} style={{ perspective: '1000px' }} className="overflow-x-auto max-w-full pb-2">
                    <RoastCard ref={cardRef} name={licenseData.name} status={licenseData.status} achievements={licenseData.achievements} luckLevel={licenseData.luckLevel} brainRotLevel={licenseData.brainRotLevel} photo={licenseData.photo} issueId={licenseData.issueId} isVerified={isVerified} />
                  </motion.div>
                )}
              </AnimatePresence>
              {showCard && (
                <SharePanel cardRef={cardRef} name={licenseData.name} issueId={licenseData.issueId} isVerified={isVerified} onVerify={() => { setIsVerified(true); setShowAd(true); }} onReset={handleReset} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.footer className="text-center mt-20 pb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <div className="text-[9px] sm:text-[10px] tracking-[1.5px] sm:tracking-[3px] uppercase px-2" style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.12)' }}>ROAST LICENSE AUTHORITY © 2026 • ALL ROASTS FINAL</div>
        </motion.footer>
      </div>
    </div>
  );
}
