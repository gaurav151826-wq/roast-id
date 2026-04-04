import { forwardRef } from 'react';

interface ReceiptProps {
  name: string;
  vibe: string;
  addictions: string[];
  lifeProgress: number;
  transactionId: string;
}

const VIBE_PRICES: Record<string, string> = {
  'Cooked': '$0.00 (BANKRUPT)',
  'Chilling': '$4.20 (VIBES)',
  'Hustling': '$99.99 (GRIND)',
  'Overthinking': '$∞ (PRICELESS)',
};

const VIBE_EMOJI: Record<string, string> = {
  'Cooked': '🔥',
  'Chilling': '🧊',
  'Hustling': '⚡',
  'Overthinking': '🧠',
};

function generateBarcode() {
  const widths = [];
  for (let i = 0; i < 60; i++) {
    widths.push(Math.random() > 0.5 ? (Math.random() > 0.6 ? 3 : 2) : 1);
  }
  return widths;
}

function getProgressBar(pct: number) {
  const filled = Math.round(pct / 5);
  const empty = 20 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

function getDate() {
  const now = new Date();
  return now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
    + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(
  ({ name, vibe, addictions, lifeProgress, transactionId }, ref) => {
    const barcode = generateBarcode();
    const vibePrice = VIBE_PRICES[vibe] || '$?.??';
    const vibeEmoji = VIBE_EMOJI[vibe] || '🤷';

    const addictionPrices = addictions.map(a => {
      const hash = a.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      return { name: a, price: ((hash % 90) + 10) / 10 };
    });

    const subtotal = addictionPrices.reduce((s, a) => s + a.price, 0);

    return (
      <div
        ref={ref}
        className="torn-edge receipt-flicker"
        style={{
          width: '380px',
          background: '#FAFAF5',
          color: '#1A1A1A',
          fontFamily: "'Roboto Mono', 'Courier New', monospace",
          padding: '28px 24px 40px',
          position: 'relative',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Thermal noise dots */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23000'/%3E%3C/svg%3E")`, pointerEvents: 'none' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '4px', marginBottom: '4px', opacity: 0.5 }}>★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★</div>
          <div style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '3px', lineHeight: 1.1 }}>VIBE CHECK</div>
          <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '6px', marginTop: '2px' }}>INC.</div>
          <div style={{ fontSize: '10px', letterSpacing: '2px', marginTop: '8px', opacity: 0.6 }}>"WE DON'T DO REFUNDS"</div>
          <div style={{ fontSize: '10px', letterSpacing: '1px', marginTop: '4px', opacity: 0.5 }}>EST. 2026 • INTERNET HQ</div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '2px dashed #1A1A1A', margin: '12px 0', opacity: 0.4 }} />

        {/* Transaction info */}
        <div style={{ fontSize: '10px', opacity: 0.6, marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>TXN: #{transactionId}</span>
            <span>{getDate()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
            <span>CASHIER: AI-BOT-9000</span>
            <span>REG: 404</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '2px dashed #1A1A1A', margin: '12px 0', opacity: 0.4 }} />

        {/* Customer */}
        <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>CUSTOMER: {name.toUpperCase()}</div>
        <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
          STATUS: {vibeEmoji} {vibe.toUpperCase()} {vibeEmoji}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #1A1A1A', margin: '12px 0', opacity: 0.2 }} />

        {/* Items header */}
        <div style={{ fontSize: '11px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', marginBottom: '8px', opacity: 0.6 }}>
          <span>ITEM</span>
          <span>PRICE</span>
        </div>

        {/* Vibe item */}
        <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>1x CURRENT VIBE ({vibe.toUpperCase()})</span>
          <span>{vibePrice.split(' ')[0]}</span>
        </div>
        <div style={{ fontSize: '9px', opacity: 0.5, marginBottom: '8px', paddingLeft: '16px' }}>
          {VIBE_PRICES[vibe]?.match(/\((.+)\)/)?.[1] || ''}
        </div>

        {/* Addiction items */}
        {addictionPrices.map((a, i) => (
          <div key={i} style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>1x {a.name.toUpperCase()}</span>
            <span>${a.price.toFixed(2)}</span>
          </div>
        ))}

        {/* Divider */}
        <div style={{ borderTop: '1px solid #1A1A1A', margin: '12px 0', opacity: 0.2 }} />

        {/* Subtotal */}
        <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>SUBTOTAL</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>TAX (EMOTIONAL)</span>
          <span>$9.99</span>
        </div>
        <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>DISCOUNT (DELULU)</span>
          <span>-$0.00</span>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '2px dashed #1A1A1A', margin: '12px 0', opacity: 0.4 }} />

        {/* Total */}
        <div style={{ fontSize: '16px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>TOTAL</span>
          <span>MY SANITY</span>
        </div>
        <div style={{ fontSize: '10px', opacity: 0.5, textAlign: 'right', marginBottom: '12px' }}>PAYMENT: EXISTENTIAL CRISIS</div>

        {/* Divider */}
        <div style={{ borderTop: '2px dashed #1A1A1A', margin: '12px 0', opacity: 0.4 }} />

        {/* Life Progress */}
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '6px', letterSpacing: '2px' }}>LIFE PROGRESS</div>
          <div style={{ fontSize: '13px', fontFamily: "'Roboto Mono', monospace", letterSpacing: '1px' }}>
            {getProgressBar(lifeProgress)}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>{lifeProgress}%</div>
          <div style={{ fontSize: '9px', opacity: 0.5, marginTop: '2px' }}>
            {lifeProgress < 25 ? 'TUTORIAL MODE' : lifeProgress < 50 ? 'SIDE QUEST ENERGY' : lifeProgress < 75 ? 'MAIN CHARACTER ARC' : 'FINAL BOSS APPROACHING'}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #1A1A1A', margin: '12px 0', opacity: 0.2 }} />

        {/* Footer message */}
        <div style={{ textAlign: 'center', fontSize: '10px', opacity: 0.6, marginBottom: '16px', lineHeight: 1.6 }}>
          <div>THANK YOU FOR EXISTING!</div>
          <div>NO RETURNS • NO EXCHANGES</div>
          <div>ALL VIBES ARE FINAL</div>
          <div style={{ marginTop: '6px', fontSize: '9px' }}>"YOU'RE DOING GREAT SWEETIE" - MGMT</div>
        </div>

        {/* Barcode */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1px', marginBottom: '6px' }}>
            {barcode.map((w, i) => (
              <div
                key={i}
                className="barcode-line"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>
          <div style={{ fontSize: '8px', letterSpacing: '2px', opacity: 0.4 }}>
            VIBECHECK.PAGES.DEV
          </div>
        </div>

        {/* Stars footer */}
        <div style={{ textAlign: 'center', fontSize: '11px', letterSpacing: '4px', marginTop: '12px', opacity: 0.5 }}>★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★</div>
      </div>
    );
  }
);

Receipt.displayName = 'Receipt';
export default Receipt;
