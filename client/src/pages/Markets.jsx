import { useState } from 'react';
import { useStocks } from '../hooks/useStocks.js';
import { searchStock } from '../api/stocks.js';
import StockTable from '../components/markets/StockTable.jsx';
import TradePanel from '../components/markets/TradePanel.jsx';
import PageWrapper from '../components/layout/PageWrapper.jsx';
import Spinner from '../components/common/Spinner.jsx';
import { useToast } from '../context/ToastContext.jsx';

const STOCKS_PER_PAGE = 10;

const MarketsPage = () => {
  const { stocks, loading, refetch } = useStocks();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [page, setPage] = useState(1);
  const { showToast } = useToast();

  // Filter preloaded list
  const filtered = stocks.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.symbol.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / STOCKS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * STOCKS_PER_PAGE, page * STOCKS_PER_PAGE);

  // Combine search result with paginated list
  const displayStocks = searchResult
    ? [searchResult, ...paginated.filter(s => s.symbol !== searchResult.symbol)]
    : paginated;

  // Reset to page 1 when search changes
  const handleSearchChange = (e) => {
    setSearch(e.target.value.toUpperCase());
    setSearchResult(null);
    setPage(1);
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      setSearching(true);
      setSearchResult(null);
      const symbol = search.trim().toUpperCase().replace('.NS', '');
      const res = await searchStock(symbol);
      setSearchResult(res.data);
      setSelected(res.data);
    } catch (err) {
      showToast('Stock not found. Only Nifty 50 stocks are supported e.g. RELIANCE, TCS, INFY', 'error');
    } finally {
      setSearching(false);
    }
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Markets</h2>
        <div style={{ display: 'flex', gap: 6, flex: 1, maxWidth: 320 }}>
          <input
            placeholder="🔍 Enter NSE symbol e.g. TCS"
            value={search}
            onChange={handleSearchChange}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            style={{
              flex: 1, padding: '8px 12px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 9, color: '#fff', fontSize: 13,
              outline: 'none', minWidth: 0,
            }}
          />
          <button onClick={handleSearch} disabled={searching} style={{
            padding: '8px 12px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            border: 'none', borderRadius: 9, color: '#fff',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            opacity: searching ? 0.7 : 1, whiteSpace: 'nowrap',
          }}>
            {searching ? '...' : 'Search'}
          </button>
          {searchResult && (
            <button onClick={() => { setSearchResult(null); setSearch(''); setSelected(null); setPage(1); }} style={{
              padding: '8px 10px', background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 9, color: 'rgba(255,255,255,0.5)',
              fontSize: 13, cursor: 'pointer',
            }}>✕</button>
          )}
        </div>
      </div>

      {loading
        ? <Spinner />
        : <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
            <div>
              <StockTable stocks={displayStocks} selectedSymbol={selected?.symbol} onSelect={setSelected} />

              {/* Pagination — only show when not searching */}
              {!searchResult && totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 12 }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                      padding: '6px 12px', border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 7, background: 'transparent',
                      color: page === 1 ? 'rgba(255,255,255,0.2)' : '#fff',
                      cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 13,
                    }}
                  >← Prev</button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)} style={{
                      width: 32, height: 32,
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 7,
                      background: page === p ? '#6366f1' : 'transparent',
                      color: '#fff', cursor: 'pointer', fontSize: 13,
                      fontWeight: page === p ? 700 : 400,
                    }}>{p}</button>
                  ))}

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{
                      padding: '6px 12px', border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 7, background: 'transparent',
                      color: page === totalPages ? 'rgba(255,255,255,0.2)' : '#fff',
                      cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: 13,
                    }}
                  >Next →</button>
                </div>
              )}

              {/* Stock count */}
              {!searchResult && (
                <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>
                  Showing {(page - 1) * STOCKS_PER_PAGE + 1}–{Math.min(page * STOCKS_PER_PAGE, filtered.length)} of {filtered.length} stocks
                </div>
              )}
            </div>

            <TradePanel stock={selected} onTradeSuccess={() => { }} />
          </div>
        </>
      }
    </PageWrapper>
  );
};

export default MarketsPage;