import { useState } from 'react';
import { buyStock, sellStock } from '../../api/trade';
import { addToWatchlist } from '../../api/watchlist';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatINR, pnlColor, stripNS } from '../../utils/formatters';
import EmptyState from '../common/EmptyState';

const TradePanel = ({ stock, onTradeSuccess }) => {
  const [tradeType, setTradeType] = useState('BUY');
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [watching, setWatching] = useState(false);
  const { updateBalance } = useAuth();
  const { showToast } = useToast();

  if (!stock) return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
      <EmptyState icon="👈" message="Select a stock from the list to trade" />
    </div>
  );

  const total = +(stock.price * qty).toFixed(2);

  const handleTrade = async () => {
    if (qty < 1) return showToast('Quantity must be at least 1', 'error');
    try {
      setLoading(true);
      const fn = tradeType === 'BUY' ? buyStock : sellStock;
      const res = await fn({ symbol: stock.symbol, quantity: qty });
      updateBalance(res.data.balance);
      showToast(res.data.msg);
      onTradeSuccess?.();
      setQty(1);
    } catch (err) {
      showToast(err.response?.data?.msg || 'Trade failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlist = async () => {
    try {
      setWatching(true);
      await addToWatchlist(stripNS(stock.symbol));
      showToast(`${stripNS(stock.symbol)} added to watchlist ⭐`);
    } catch (err) {
      showToast('Failed to add to watchlist', 'error');
    } finally {
      setWatching(false);
    }
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
      {/* Stock Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{stripNS(stock.symbol)}</h3>
            {/* Watchlist Button */}
            <button
              onClick={handleWatchlist}
              disabled={watching}
              title="Add to Watchlist"
              style={{
                background: 'rgba(255,193,7,0.1)',
                border: '1px solid rgba(255,193,7,0.3)',
                borderRadius: 7, padding: '3px 8px',
                cursor: watching ? 'not-allowed' : 'pointer',
                fontSize: 14, opacity: watching ? 0.6 : 1,
                transition: 'all 0.15s',
              }}
            >
              ⭐
            </button>
          </div>
          <p style={{ margin: '3px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{stock.name}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 21, fontWeight: 700 }}>{formatINR(stock.price, 2)}</div>
          <div style={{ fontSize: 12, color: pnlColor(stock.change) }}>
            {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)} ({stock.changePercent?.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Day High / Low */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[['Day High', stock.high], ['Day Low', stock.low]].map(([l, v]) => (
          <div key={l} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 12px' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{l}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{formatINR(v, 2)}</div>
          </div>
        ))}
      </div>

      {/* BUY / SELL Toggle */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 9, padding: 3, marginBottom: 14 }}>
        {['BUY', 'SELL'].map(t => (
          <button key={t} onClick={() => setTradeType(t)} style={{
            flex: 1, padding: '7px 0', border: 'none', borderRadius: 7, cursor: 'pointer',
            fontSize: 13, fontWeight: 700,
            background: tradeType === t ? (t === 'BUY' ? '#10b981' : '#ef4444') : 'transparent',
            color: tradeType === t ? '#fff' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.15s',
          }}>{t}</button>
        ))}
      </div>

      {/* Quantity */}
      <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>Quantity</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 32, height: 32, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, background: 'transparent', color: '#fff', fontSize: 18, cursor: 'pointer' }}>−</button>
        <input
          type="number" value={qty} min={1}
          onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
          style={{ flex: 1, padding: '7px 10px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#fff', fontSize: 14, textAlign: 'center', outline: 'none' }}
        />
        <button onClick={() => setQty(q => q + 1)} style={{ width: 32, height: 32, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, background: 'transparent', color: '#fff', fontSize: 18, cursor: 'pointer' }}>+</button>
      </div>

      {/* Total */}
      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 9, padding: '11px 13px', marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>Price/share</span>
          <span>{formatINR(stock.price, 2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700 }}>
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>Total</span>
          <span style={{ color: tradeType === 'BUY' ? '#10b981' : '#ef4444' }}>{formatINR(total)}</span>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleTrade}
        disabled={loading}
        style={{
          width: '100%', padding: '12px 0', border: 'none', borderRadius: 9,
          cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700,
          background: tradeType === 'BUY' ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#ef4444,#dc2626)',
          color: '#fff', opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Processing...' : tradeType === 'BUY' ? '🟢 Place Buy Order' : '🔴 Place Sell Order'}
      </button>
    </div>
  );
};

export default TradePanel;