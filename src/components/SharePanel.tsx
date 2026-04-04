import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeCheck, Copy, Check, RotateCcw, X, Loader2, Link2, Download, Instagram } from 'lucide-react';
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
            <span style={{ fontSize: '20px' }}>📸</span>
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
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const cardUrl = `${siteUrl}/card/${issueId}`;
  const fileName = `roast-license-${name.toLowerCase().replace(/\s+/g, '-')}.png`;

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message: msg, visible: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 6000);
  };

  const generateStoryBlob = useCallback(async (): Promise<Blob | null> => {
    const cardEl = cardRef.current;
    if (!cardEl) return null;

    const cardCanvas = await html2canvas(cardEl, {
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
    const ctx = story.getContext('2d');
    if (!ctx) return null;

    const grad = ctx.createLinearGradient(0, 0, W * 0.4, H);
    grad.addColorStop(0, '#030014');
    grad.addColorStop(0.25, '#0f172a');
    grad.addColorStop(0.5, '#1a0a3e');
    grad.addColorStop(0.75, '#0a1628');
    grad.addColorStop(1, '#030014');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const drawOrb = (x: number, y: number, r: number, c: string, a: number) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${c},${a})`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    };
    drawOrb(80, 200, 300, '139,92,246', 0.12);
    drawOrb(900, 1500, 280, '6,182,212', 0.10);
    drawOrb(650, 800, 200, '236,72,153', 0.07);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#8B5CF6';
    ctx.font = '900 48px Orbitron, sans-serif';
    ctx.fillText('ROAST LICENSE', W / 2, 160);

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '500 14px JetBrains Mono, monospace';
    ctx.fillText('OFFICIALLY CERTIFIED \u2022 NO APPEALS', W / 2, 200);

    const cW = cardCanvas.width;
    const cH = cardCanvas.height;
    const targetW = 920;
    const sf = targetW / cW;
    const dW = cW * sf;
    const dH = cH * sf;
    const dX = (W - dW) / 2;
    const dY = (H - dH) / 2 - 20;
    ctx.drawImage(cardCanvas, dX, dY, dW, dH);

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '600 15px JetBrains Mono, monospace';
    ctx.fillText(`See this card: ${cardUrl}`, W / 2, H - 165);

    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.font = '600 16px JetBrains Mono, monospace';
    ctx.fillText('ROAST-LICENSE.COM', W / 2, H - 110);

    return new Promise<Blob | null>(resolve => {
      story.toBlob(b => resolve(b), 'image/png', 1.0);
    });
  }, [cardRef, cardUrl]);

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

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const blob = await generateStoryBlob();
      if (!blob) { showToast('Export failed \u2014 try again'); return; }
      triggerDownload(blob);
      showToast('Image saved to your device! \ud83d\udcf8');
    } catch (err) {
      console.error('Download error:', err);
      showToast('Download failed \u2014 please try again');
    } finally {
      setDownloading(false);
    }
  };

  const handleInstaShare = async () => {
    if (sharing) return;
    setSharing(true);
    setShareDone(false);

    try {
      const blob = await generateStoryBlob();
      if (!blob) { showToast('Export failed \u2014 try again'); setSharing(false); return; }

      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'My Roast License',
            text: `I'm officially cooked! \ud83d\udc80 See my card: ${cardUrl}`,
          });
          setShareDone(true);
          setTimeout(() => setShareDone(false), 4000);
          setSharing(false);
          return;
        } catch (err) {
          const e = err as Error;
          if (e.name === 'AbortError') { setSharing(false); return; }
        }
      }

      triggerDownload(blob);
      showToast('Image saved! Opening Instagram \u2014 upload to your Story \ud83d\udd25');
      setTimeout(() => {
        window.open('https://www.instagram.com/', '_blank');
      }, 800);
    } catch (err) {
      console.error('Share error:', err);
      showToast('Something went wrong \u2014 image downloaded instead');
    } finally {
      setSharing(false);
    }
  };

  const handleVerify = () => {
    try { window.open('about:blank', '_blank'); } catch {}
    onVerify();
  };

  const copyCardLink = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
      showToast('Link copied! Anyone who opens it sees your card \ud83e\udeaa');
      setTimeout(() => setCopied(false), 3000);
    } catch {}
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="w-full max-w-[500px] mx-auto mt-8 space-y-3"
      >
        {!isVerified && (
          <motion.button
            onClick={handleVerify}
            className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 transition-all"
            style={{ fontFamily: 'var(--font-display)' }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,215,0,0.15)' }}
            whileTap={{ scale: 0.98 }}
          >
            <BadgeCheck size={18} /> GET VERIFIED 🤡
          </motion.button>
        )}

        <motion.button
          onClick={handleInstaShare}
          disabled={sharing}
          className="cyber-btn w-full py-5 rounded-2xl text-base font-bold flex items-center justify-center gap-3 text-white relative overflow-hidden disabled:opacity-70"
          style={{
            background: 'linear-gradient(135deg, #E1306C, #F77737, #FCAF45)',
            boxShadow: '0 0 40px rgba(225,48,108,0.25), 0 0 80px rgba(247,119,55,0.1), 0 4px 20px rgba(0,0,0,0.3)',
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
                <span style={{ fontSize: '22px' }}>🔥</span><span>SHARED!</span>
              </motion.div>
            ) : (
              <motion.div key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                <Instagram size={22} /><span>INSTA STORY / MESSAGES</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          onClick={handleDownload}
          disabled={downloading}
          className="cyber-btn w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 text-white relative overflow-hidden disabled:opacity-70"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
            boxShadow: '0 0 30px rgba(139,92,246,0.2), 0 0 60px rgba(6,182,212,0.08)',
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
              <motion.div key="di" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Download size={18} /><span>SAVE TO GALLERY (1080×1920)</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <p className="text-center text-[10px] tracking-wider" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}>
          HD PNG • PERFECT FOR INSTA STORIES • 9:16 RATIO
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="glass rounded-xl p-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <Link2 size={12} className="text-cyber-cyan" />
            <span className="text-[10px] font-bold tracking-widest" style={{ fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.5)' }}>YOUR UNIQUE CARD LINK</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 rounded-lg text-xs truncate" style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', color: '#06B6D4', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>
              {cardUrl}
            </div>
            <motion.button
              onClick={copyCardLink}
              className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
              style={{
                background: copied ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(6,182,212,0.25))',
                border: copied ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(139,92,246,0.3)',
                color: copied ? '#10B981' : '#fff',
                fontFamily: 'var(--font-display)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'COPIED!' : 'COPY'}
            </motion.button>
          </div>
          <p className="text-[9px] mt-2" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}>
            Anyone with this link can view your Roast License 🪪
          </p>
        </motion.div>

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
