import { useEffect } from 'react';

export default function NativeBanner({ show = false }: { show?: boolean }) {
  useEffect(() => {
    if (!show) return;
    const id = 'container-cda3681aab05bbc16a2ae99dbf432a76';
    const el = document.getElementById(id);
    if (!el) return;
    const script = document.createElement('script');
    script.src = 'https://pl29061344.profitablecpmratenetwork.com/cda3681aab05bbc16a2ae99dbf432a76/invoke.js';
    script.async = true;
    el.appendChild(script);
    return () => {
      try { script.remove(); } catch {}
      el.innerHTML = '';
    };
  }, [show]);

  // wrapper ensures the ad is centered and responsive on desktop and mobile
  return (
    <div className="mt-4 w-full flex justify-center">
      <div id="container-cda3681aab05bbc16a2ae99dbf432a76" style={{ width: '100%', maxWidth: 980 }} />
    </div>
  );
}
