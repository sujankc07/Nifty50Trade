import { useState, useEffect } from 'react';
import { fetchTradeHistory } from '../api/trade.js';
import TransactionTable from '../components/history/TransactionTable.jsx';
import PageWrapper from '../components/layout/PageWrapper.jsx';
import Spinner from '../components/common/Spinner.jsx';

const HistoryPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchTradeHistory(page)
      .then(res => {
        setData(res.data.transactions);
        setPages(res.data.pages);
        setTotal(res.data.total);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <PageWrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>History</h2>
        {total > 0 && (
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            {total} transaction{total !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {loading ? <Spinner /> : <TransactionTable transactions={data} />}

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 20 }}>
          {/* Prev */}
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '6px 12px', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 7, background: 'transparent', color: page === 1 ? 'rgba(255,255,255,0.2)' : '#fff',
              cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 13,
            }}
          >← Prev</button>

          {/* Page numbers */}
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              width: 32, height: 32,
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 7,
              background: page === p ? '#6366f1' : 'transparent',
              color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: page === p ? 700 : 400,
            }}>{p}</button>
          ))}

          {/* Next */}
          <button
            onClick={() => setPage(p => Math.min(pages, p + 1))}
            disabled={page === pages}
            style={{
              padding: '6px 12px', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 7, background: 'transparent', color: page === pages ? 'rgba(255,255,255,0.2)' : '#fff',
              cursor: page === pages ? 'not-allowed' : 'pointer', fontSize: 13,
            }}
          >Next →</button>
        </div>
      )}
    </PageWrapper>
  );
};

export default HistoryPage;