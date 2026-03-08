import { useState, useEffect } from 'react';
import { fetchWatchlist, removeWatchlist } from '../api/watchlist.js';
import { useToast } from '../context/ToastContext.jsx';
import { formatINR, pnlColor, pnlPrefix, stripNS } from '../utils/formatters.js';
import PageWrapper from '../components/layout/PageWrapper.jsx';
import Spinner from '../components/common/Spinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
};

const WatchlistPage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const isMobile = useIsMobile();

  const load = () => {
    setLoading(true);
    fetchWatchlist()
      .then(res => setStocks(res.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleRemove = async (symbol) => {
    await removeWatchlist(symbol);
    showToast('Removed from watchlist');
    load();
  };

  if (loading) return <PageWrapper><Spinner /></PageWrapper>;

  if (stocks.length === 0) return (
    <PageWrapper>
      <EmptyState icon="⭐" message="Your watchlist is empty. Add stocks from Markets!" />
    </PageWrapper>
  );

  // Mobile: card layout
  if (isMobile) {
    return (
      <PageWrapper>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>⭐ Watchlist</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stocks.map(s => (
            <div key={s.symbol} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '14px 16px',
            }}>
              {/* Row 1: Symbol + Price */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{stripNS(s.symbol)}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{formatINR(s.price, 2)}</div>
                  <div style={{ fontSize: 12, color: pnlColor(s.change), marginTop: 2 }}>
                    {pnlPrefix(s.change)}{s.change?.toFixed(2)} ({pnlPrefix(s.changePercent)}{s.changePercent?.toFixed(2)}%)
                  </div>
                </div>
              </div>

              {/* Row 2: Remove button */}
              <button
                onClick={() => handleRemove(stripNS(s.symbol))}
                style={{
                  width: '100%', padding: '7px 0',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 8, color: '#ef4444',
                  cursor: 'pointer', fontSize: 13, fontWeight: 600,
                }}
              >
                🗑️ Remove
              </button>
            </div>
          ))}
        </div>
      </PageWrapper>
    );
  }

  // Desktop layout
  return (
    <PageWrapper>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>⭐ Watchlist</h2>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
        {stocks.map(s => (
          <div key={s.symbol} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{stripNS(s.symbol)}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{s.name}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{formatINR(s.price, 2)}</div>
                <div style={{ fontSize: 12, color: pnlColor(s.change) }}>
                  {pnlPrefix(s.change)}{s.change?.toFixed(2)} ({pnlPrefix(s.changePercent)}{s.changePercent?.toFixed(2)}%)
                </div>
              </div>
              <button
                onClick={() => handleRemove(stripNS(s.symbol))}
                style={{ padding: '5px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 7, color: '#ef4444', cursor: 'pointer', fontSize: 12 }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};

export default WatchlistPage;