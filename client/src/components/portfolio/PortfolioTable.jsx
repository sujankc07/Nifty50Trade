import { useState, useEffect } from 'react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
};

const PortfolioTable = ({ holdings, onSell }) => {
  const isMobile = useIsMobile();

  if (!holdings?.length) return (
    <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' }}>
      No holdings yet. Go to Markets to buy stocks!
    </div>
  );

  // Mobile: card layout
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {holdings.map(h => (
          <div key={h.symbol} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '16px',
          }}>
            {/* Row 1: Symbol + Current Value & P&L % */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 17 }}>{h.symbol.replace('.NS', '')}</div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: 700, fontSize: 17, color: h.pnl >= 0 ? '#10b981' : '#ef4444' }}>
                  ₹{(h.currentValue ?? h.currentPrice * h.quantity)?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
                <span style={{ fontSize: 13, color: h.pnl >= 0 ? '#10b981' : '#ef4444', marginLeft: 6 }}>
                  ({h.pnl >= 0 ? '+' : ''}{h.pnlPercent?.toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* Row 2: Qty x ATP + LTP & day change */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                {h.quantity}
                <span style={{ color: 'rgba(255,255,255,0.25)', margin: '0 5px' }}>×</span>
                <span style={{ color: 'rgba(255,255,255,0.35)', marginRight: 4 }}>ATP</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>₹{h.avgBuyPrice?.toFixed(2)}</span>
              </div>
              <div style={{ fontSize: 13, textAlign: 'right' }}>
                <span style={{ color: 'rgba(255,255,255,0.35)', marginRight: 4 }}>LTP</span>
                <span style={{ color: h.change >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                  ₹{h.currentPrice?.toFixed(2)}
                </span>
                <span style={{ fontSize: 11, color: h.change >= 0 ? '#10b981' : '#ef4444', marginLeft: 4 }}>
                  ({h.change >= 0 ? '+' : ''}{h.changePercent?.toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* Sell Button */}
            <button
              onClick={() => onSell(h)}
              style={{
                width: '100%', padding: '9px 0', border: 'none',
                borderRadius: 8, background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              🔴 Sell
            </button>
          </div>
        ))}
      </div>
    );
  }

  // Desktop: table layout
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {['STOCK', 'QTY', 'AVG PRICE', 'CUR PRICE', 'INVESTED', 'CURRENT', 'P&L', 'ACTION'].map(h => (
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {holdings.map(h => (
            <tr key={h.symbol} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '12px' }}>
                <div style={{ fontWeight: 700 }}>{h.symbol.replace('.NS', '')}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{h.companyName}</div>
              </td>
              <td style={{ padding: '12px', fontSize: 13 }}>{h.quantity}</td>
              <td style={{ padding: '12px', fontSize: 13 }}>₹{h.avgBuyPrice?.toFixed(2)}</td>
              <td style={{ padding: '12px', fontSize: 13 }}>₹{h.currentPrice?.toFixed(2)}</td>
              <td style={{ padding: '12px', fontSize: 13 }}>₹{h.investedValue?.toLocaleString('en-IN')}</td>
              <td style={{ padding: '12px', fontSize: 13 }}>₹{h.currentValue?.toLocaleString('en-IN')}</td>
              <td style={{ padding: '12px', fontSize: 13, color: h.pnl >= 0 ? '#10b981' : '#ef4444' }}>
                {h.pnl >= 0 ? '+' : ''}₹{h.pnl?.toFixed(0)}<br />
                <span style={{ fontSize: 11 }}>({h.pnlPercent?.toFixed(2)}%)</span>
              </td>
              <td style={{ padding: '12px' }}>
                <button
                  onClick={() => onSell(h)}
                  style={{
                    padding: '5px 14px', border: 'none',
                    borderRadius: 7, background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                    color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Sell
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioTable;