import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { usePortfolio } from '../hooks/usePortfolio.js';
import { sellStock } from '../api/trade.js';
import { useToast } from '../context/ToastContext.jsx';
import SummaryCards from '../components/dashboard/SummaryCards.jsx';
import PortfolioTable from '../components/portfolio/PortfolioTable.jsx';
import PageWrapper from '../components/layout/PageWrapper.jsx';
import Spinner from '../components/common/Spinner.jsx';
import { formatINR } from '../utils/formatters.js';

const PortfolioPage = () => {
  const { user, updateBalance } = useAuth();
  const { data, loading, refetch } = usePortfolio();
  const { showToast } = useToast();

  const [sellStock_, setSellStock] = useState(null);
  const [qty, setQty] = useState(1);
  const [selling, setSelling] = useState(false);

  const handleSellClick = (holding) => {
    setSellStock(holding);
    setQty(1);
  };

  const handleSellConfirm = async () => {
    if (qty < 1 || qty > sellStock_.quantity) return showToast('Invalid quantity', 'error');
    try {
      setSelling(true);
      const res = await sellStock({ symbol: sellStock_.symbol, quantity: qty });
      updateBalance(res.data.balance);
      showToast(res.data.msg || 'Sold successfully!');
      setSellStock(null);
      refetch();
    } catch (err) {
      showToast(err.response?.data?.msg || 'Sell failed', 'error');
    } finally {
      setSelling(false);
    }
  };

  return (
    <PageWrapper title="My Portfolio">
      {loading
        ? <Spinner />
        : <>
          <SummaryCards balance={user?.balance || 0} summary={data?.summary} />
          <PortfolioTable holdings={data?.holdings || []} onSell={handleSellClick} />
        </>
      }

      {/* Sell Modal */}
      {sellStock_ && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
        }}>
          <div style={{
            background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, padding: 28, width: '90%', maxWidth: 360,
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{sellStock_.symbol.replace('.NS', '')}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{sellStock_.companyName}</div>
              </div>
              <button onClick={() => setSellStock(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            {/* Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
              {[
                ['Available', `${sellStock_.quantity} shares`],
                ['Avg Price', formatINR(sellStock_.avgBuyPrice)],
                ['Current Price', formatINR(sellStock_.currentPrice)],
                ['P&L', formatINR(sellStock_.pnl)],
              ].map(([label, value]) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Quantity */}
            {/* Quantity */}
            <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>Quantity to Sell</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 32, height: 32, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, background: 'transparent', color: '#fff', fontSize: 18, cursor: 'pointer' }}>−</button>
              <input
                type="number" value={qty} min={1} max={sellStock_.quantity}
                onChange={e => setQty(Math.min(sellStock_.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                style={{ flex: 1, padding: '7px 10px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#fff', fontSize: 14, textAlign: 'center', outline: 'none' }}
              />
              <button onClick={() => setQty(q => Math.min(sellStock_.quantity, q + 1))} style={{ width: 32, height: 32, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, background: 'transparent', color: '#fff', fontSize: 18, cursor: 'pointer' }}>+</button>
            </div>

            {/* Total */}
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 9, padding: '10px 13px', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700 }}>
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>Total Proceeds</span>
                <span style={{ color: '#10b981' }}>{formatINR(sellStock_.currentPrice * qty)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setSellStock(null)} style={{
                flex: 1, padding: '10px 0', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 9, background: 'transparent', color: '#fff',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={handleSellConfirm} disabled={selling} style={{
                flex: 1, padding: '10px 0', border: 'none',
                borderRadius: 9, background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                color: '#fff', fontSize: 13, fontWeight: 600,
                cursor: selling ? 'not-allowed' : 'pointer', opacity: selling ? 0.7 : 1,
              }}>{selling ? 'Selling...' : '🔴 Confirm Sell'}</button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default PortfolioPage;