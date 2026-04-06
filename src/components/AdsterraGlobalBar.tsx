import { useEffect } from 'react';

export default function AdsterraGlobalBar(): null {
  useEffect(() => {
    // Inject responsive styles for the global social bar
    const style = document.createElement('style');
    style.innerHTML = `
      #adsterra-global-social-bar{position:fixed;left:0;right:0;bottom:0;z-index:99999;display:flex;justify-content:center;pointer-events:auto}
      #adsterra-global-social-bar .adsterra-inner{width:100%;max-width:980px;margin:0 auto}
      @media(min-width:1024px){
        #adsterra-global-social-bar{bottom:14px}
        #adsterra-global-social-bar .adsterra-inner{max-width:980px}
      }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'adsterra-global-social-bar';
    const inner = document.createElement('div');
    inner.className = 'adsterra-inner';
    container.appendChild(inner);
    document.body.appendChild(container);

    const script = document.createElement('script');
    script.src = 'https://pl29061343.profitablecpmratenetwork.com/ed/64/34/ed6434358f84fc49e0c3bdac71bce512.js';
    script.async = true;
    inner.appendChild(script);

    return () => {
      try { script.remove(); } catch {}
      try { container.remove(); } catch {}
      try { style.remove(); } catch {}
    };
  }, []);

  return null;
}
