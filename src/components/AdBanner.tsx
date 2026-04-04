import { useEffect, useRef } from 'react';

export default function AdBanner() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current) {
      adRef.current.innerHTML = `
        <script async="async" data-cfasync="false" src="https://pl29061344.profitablecpmratenetwork.com/cda3681aab05bbc16a2ae99dbf432a76/invoke.js"></script>
        <div id="container-cda3681aab05bbc16a2ae99dbf432a76"></div>
      `;
    }
  }, []);

  return (
    <div
      ref={adRef}
      id="ad-container"
      className="flex justify-center mt-5"
    />
  );
}