import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, MessageCircle, Copy, Check } from 'lucide-react';
import { toPng } from 'html-to-image';

interface ShareButtonsProps {
  receiptRef: React.RefObject<HTMLDivElement | null>;
  name: string;
  vibe: string;
  lifeProgress: number;
}

export default function ShareButtons({ receiptRef, name, vibe, lifeProgress }: ShareButtonsProps) {
  const [downloadStep, setDownloadStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleDownload = async () => {
    if (downloadStep === 0) {
      setDownloadStep(1);
      // Step 1: "Ad" interstitial
      window.open('about:blank', '_blank');
      return;
    }

    // Step 2: Actual download
    if (!receiptRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(receiptRef.current, {
        width: 380,
        height: receiptRef.current.scrollHeight,
        pixelRatio: 3,
        backgroundColor: '#FAFAF5',
      });
      const link = document.createElement('a');
      link.download = `vibe-receipt-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
      setDownloadStep(0);
    }
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(
      `Yo, I just got my Life Receipt... I'm officially ${lifeProgress}% ${vibe.toLowerCase()}. Check yours here: ${siteUrl}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const shareTwitter = () => {
    const msg = encodeURIComponent(
      `Just got my Vibe Receipt 🧾\n\nStatus: ${vibe} ${lifeProgress}%\nPrice: My Sanity\n\nGet yours 👉 ${siteUrl}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${msg}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="flex flex-col gap-3 w-full max-w-[380px] mx-auto mt-6"
    >
      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="brutal-btn w-full py-3 text-base bg-neon-green text-brutal-black flex items-center justify-center gap-2"
      >
        <Download size={18} />
        {downloading ? 'EXPORTING...' : downloadStep === 0 ? 'DOWNLOAD PNG (9:16)' : '⚡ TAP AGAIN TO DOWNLOAD ⚡'}
      </button>

      <div className="flex gap-3">
        {/* WhatsApp */}
        <button
          onClick={shareWhatsApp}
          className="brutal-btn flex-1 py-3 text-sm flex items-center justify-center gap-2"
          style={{ background: '#25D366', color: '#fff' }}
        >
          <MessageCircle size={16} />
          WHATSAPP
        </button>

        {/* Twitter/X */}
        <button
          onClick={shareTwitter}
          className="brutal-btn flex-1 py-3 text-sm bg-brutal-white text-brutal-black flex items-center justify-center gap-2"
        >
          <Share2 size={16} />
          X / TWITTER
        </button>
      </div>

      {/* Copy link */}
      <button
        onClick={copyLink}
        className="brutal-btn w-full py-2.5 text-sm bg-neon-pink text-brutal-black flex items-center justify-center gap-2"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? 'COPIED!' : 'COPY LINK'}
      </button>
    </motion.div>
  );
}
