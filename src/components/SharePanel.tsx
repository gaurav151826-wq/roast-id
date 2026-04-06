import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeCheck, Check, RotateCcw, X, Loader2, Download, Instagram } from 'lucide-react';
import html2canvas from 'html2canvas';

interface SharePanelProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  name: string;
  issueId: string;
  isVerified: boolean;
  onVerify: () => void;
  onReset: () => void;
}

function Toast({ message, visible, onClose }: { message: string; visible: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] max-w-[90vw]"
        >
          <div style={{
            background: '#110B30', border: '1px solid rgba(139,92,246,0.35)',
            borderRadius: '14px', padding: '14px 20px', display: 'flex',
            alignItems: 'center', gap: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(139,92,246,0.15)',
            fontFamily: "'Exo 2', sans-serif",
          }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: 600, lineHeight: 1.4 }}>{message}</span>
            <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer', flexShrink: 0 }}>
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SharePanel({ cardRef, name, issueId, isVerified, onVerify, onReset }: SharePanelProps) {
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareDone, setShareDone] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const normalizedIssueId = issueId.trim().slice(0, 8).toLowerCase();
  const fileName = `roast-license-${name.toLowerCase().replace(/\s+/g, '-')}-${normalizedIssueId}.png`;

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message: msg, visible: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 6000);
  };

  // Capture the LIVE visible card, then paint onto a 1080x1920 Canvas
  const generateStoryBlob = useCallback(async (): Promise<Blob | null> => {
    const el = cardRef.current;
    if (!el) return null;

    try {
      const cardCanvas = await html2canvas(el, {
        backgroundColor: '#0B0620',
        useCORS: true,
        allowTaint: false,
        scale: 2,
        logging: false,
      });

      const W = 1080;
      const H = 1920;
      const story = document.createElement('canvas');
      story.width = W;
      story.height = H;
      const ctx = story.getContext('2d')!;

      // Background
      const grad = ctx.createLinearGradient(0, 0, W * 0.4, H);
      grad.addColorStop(0, '#030014');
      grad.addColorStop(0.25, '#0f172a');
      grad.addColorStop(0.5, '#1a0a3e');
      grad.addColorStop(0.75, '#0a1628');
      grad.addColorStop(1, '#030014');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Glow orbs
      const drawOrb = (x: number, y: number, r: number, c: string, a: number) => {
        const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
        rg.addColorStop(0, `rgba(${c},${a})`);
        rg.addColorStop(1, 'transparent');
        ctx.fillStyle = rg;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      };
      drawOrb(80, 200, 300, '139,92,246', 0.12);
      drawOrb(900, 1500, 280, '6,182,212', 0.10);
      drawOrb(650, 800, 200, '236,72,153', 0.07);

      // Title
      ctx.textAlign = 'center';
      ctx.fillStyle = '#8B5CF6';
      ctx.font = '900 48px Orbitron, sans-serif';
      ctx.fillText('ROAST LICENSE', W / 2, 155);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '500 14px JetBrains Mono, monospace';
      ctx.fillText('OFFICIALLY CERTIFIED - NO APPEALS', W / 2, 195);

      // Draw card centered
      const targetW = 920;
      const sf = targetW / cardCanvas.width;
      const dW = cardCanvas.width * sf;
      const dH = cardCanvas.height * sf;
      ctx.drawImage(cardCanvas, (W - dW) / 2, (H - dH) / 2 - 20, dW, dH);

      // (unique card link removed)

      // Branding
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.font = '600 16px JetBrains Mono, monospace';
      ctx.fillText('ROAST-LICENSE.COM', W / 2, H - 105);

      return new Promise<Blob | null>(resolve => {
        story.toBlob(blob => resolve(blob), 'image/png', 1.0);
      });
    } catch (err) {
      console.error('Capture failed:', err);
      return null;
    }
  }, [cardRef]);

  const triggerDownload = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  // DOWNLOAD
  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const blob = await generateStoryBlob();
      if (!blob) { showToast('Export failed - try again'); return; }
      triggerDownload(blob);
      showToast('Image saved to your device!');
    } catch (err) {
      console.error('Download error:', err);
      showToast('Download failed');
    } finally {
      setDownloading(false);
    }
  };

  // INSTA STORY / MESSAGES
  const handleInstaShare = async () => {
    if (sharing) return;
    setSharing(true);
    setShareDone(false);

    try {
      const blob = await generateStoryBlob();
      if (!blob) { showToast('Export failed - try again'); setSharing(false); return; }

      const file = new File([blob], fileName, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'My Roast License',
            text: `I'm officially cooked! See my card on ${siteUrl}.`,
          });
          setShareDone(true);
          setTimeout(() => setShareDone(false), 4000);
          return;
        } catch (err) {
          if ((err as Error).name === 'AbortError') { setSharing(false); return; }
        }
      }

      // Desktop fallback: download + open Instagram
      triggerDownload(blob);
      showToast('Image saved! Opening Instagram...');
      setTimeout(() => window.open('https://www.instagram.com/', '_blank'), 800);
    } catch (err) {
      console.error('Share error:', err);
      showToast('Something went wrong');
    } finally {
      setSharing(false);
    }
  };

  const handleVerify = () => {
    const smartlink = import.meta.env.VITE_SMARTLINK_URL || 'https://pl29061344.profitablecpmratenetwork.com/';
    try {
      window.open(smartlink, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('Failed to open smartlink', err);
    }
    // mark verified immediately in background
    try { onVerify(); } catch (err) { console.error('onVerify failed', err); }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="w-full max-w-[540px] mx-auto mt-8 space-y-3"
      >
        {!isVerified && (
          <motion.button
            onClick={handleVerify}
            className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 transition-all"
            style={{ fontFamily: 'var(--font-display)' }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,215,0,0.15)' }}
            whileTap={{ scale: 0.98 }}
          >
            <BadgeCheck size={18} /> GET VERIFIED
          </motion.button>
        )}

        {/* INSTA STORY / MESSAGES */}
        <motion.button
          onClick={handleInstaShare}
          disabled={sharing}
          className="cyber-btn w-full py-5 rounded-2xl text-base font-bold flex items-center justify-center gap-3 text-white relative overflow-hidden disabled:opacity-70"
          style={{
            background: 'linear-gradient(135deg, #E1306C, #F77737, #FCAF45)',
            boxShadow: '0 0 40px rgba(225,48,108,0.25), 0 4px 20px rgba(0,0,0,0.3)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '1.5px',
          }}
          whileHover={!sharing ? { scale: 1.03 } : {}}
          whileTap={!sharing ? { scale: 0.97 } : {}}
        >
          {!sharing && !shareDone && (
            <motion.div
              style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)', pointerEvents: 'none' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1 }}
            />
          )}
          <AnimatePresence mode="wait">
            {sharing ? (
              <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}><Loader2 size={22} /></motion.div>
                <span>PREPARING IMAGE...</span>
              </motion.div>
            ) : shareDone ? (
              <motion.div key="d" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                <Check size={22} />
                <span>SHARED!</span>
              </motion.div>
            ) : (
              <motion.div key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                <Instagram size={22} />
                <span>INSTA STORY / MESSAGES</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* SAVE TO GALLERY */}
        <motion.button
          onClick={handleDownload}
          disabled={downloading}
          className="cyber-btn w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 text-white relative overflow-hidden disabled:opacity-70"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
            boxShadow: '0 0 30px rgba(139,92,246,0.2)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '1px',
          }}
          whileHover={!downloading ? { scale: 1.02 } : {}}
          whileTap={!downloading ? { scale: 0.97 } : {}}
        >
          <AnimatePresence mode="wait">
            {downloading ? (
              <motion.div key="dl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}><Loader2 size={18} /></motion.div>
                <span>SAVING HD IMAGE...</span>
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Download size={18} />
                <span>SAVE TO GALLERY (1080x1920)</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <p className="text-center text-[10px] tracking-wider" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}>
          HD PNG - PERFECT FOR INSTAGRAM STORIES - 9:16 RATIO
        </p>

        

        <motion.button
          onClick={onReset}
          className="w-full py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 text-white/25 hover:text-white/50 transition-colors"
          whileHover={{ scale: 1.02 }}
        >
          <RotateCcw size={12} /> GENERATE ANOTHER
        </motion.button>
      </motion.div>

      <Toast message={toast.message} visible={toast.visible} onClose={() => setToast(t => ({ ...t, visible: false }))} />
    </>
  );
}
