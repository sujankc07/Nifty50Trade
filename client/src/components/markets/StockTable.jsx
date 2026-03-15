import { formatINR, pnlColor, stripNS } from '../../utils/formatters';
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

const StockTable = ({ stocks, selectedSymbol, onSelect }) => {
  const isMobile = useIsMobile();
  const cols = isMobile ? '2fr 1fr 1fr' : '2fr 1fr 1fr 1fr';

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: cols, padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: 1 }}>
        <span>COMPANY</span>
        <span style={{ textAlign: 'right' }}>PRICE</span>
        <span style={{ textAlign: 'right' }}>CHANGE</span>
        {!isMobile && <span style={{ textAlign: 'right' }}>VOLUME</span>}
      </div>
      {stocks.map(s => (
        <div
          key={s.symbol}
          onClick={() => onSelect(s)}
          style={{
            display: 'grid', gridTemplateColumns: cols,
            padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)',
            cursor: 'pointer',
            background: selectedSymbol === s.symbol ? 'rgba(99,102,241,0.12)' : 'transparent',
            transition: 'background 0.15s',
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{stripNS(s.symbol)}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{s.name}</div>
          </div>
          <div style={{ textAlign: 'right', fontWeight: 600, fontSize: 13, alignSelf: 'center' }}>
            {formatINR(s.price, 2)}
          </div>
          <div style={{ textAlign: 'right', alignSelf: 'center' }}>
            <span style={{ color: (s.changePercent ?? 0) >= 0 ? '#10b981' : '#ef4444', fontSize: 13, fontWeight: 600 }}>
              {s.changePercent != null ? `${s.changePercent >= 0 ? '+' : ''}${s.changePercent.toFixed(2)}%` : '--'}
            </span>
          </div>
          {!isMobile && (
            <div style={{ textAlign: 'right', fontSize: 11, color: 'rgba(255,255,255,0.35)', alignSelf: 'center' }}>
              {s.volume?.toLocaleString('en-IN')}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StockTable;