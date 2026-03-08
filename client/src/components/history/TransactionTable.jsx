import { useState, useEffect } from 'react';
import { formatINR, stripNS } from '../../utils/formatters';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
};

const TransactionTable = ({ transactions = [] }) => {
  const isMobile = useIsMobile();

  if (transactions.length === 0) return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
      <EmptyState icon="📋" message="No transactions yet" />
    </div>
  );

  // Mobile: card layout
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {transactions.map(tx => (
          <div key={tx._id} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '14px 16px',
          }}>
            {/* Row 1: Symbol + Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{stripNS(tx.symbol)}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{tx.companyName}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{formatINR(tx.total)}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                  {new Date(tx.createdAt).toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>

            {/* Row 2: Badge + Qty + Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Badge type={tx.type} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                {tx.quantity} shares
              </span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>@</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                {formatINR(tx.price, 2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop: table layout
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.6fr 0.5fr 1fr 1fr 1fr', padding: '11px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: 0.8 }}>
        <span>STOCK</span><span>TYPE</span>
        <span style={{ textAlign: 'right' }}>QTY</span>
        <span style={{ textAlign: 'right' }}>PRICE</span>
        <span style={{ textAlign: 'right' }}>TOTAL</span>
        <span style={{ textAlign: 'right' }}>DATE</span>
      </div>
      {transactions.map(tx => (
        <div key={tx._id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.6fr 0.5fr 1fr 1fr 1fr', padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{stripNS(tx.symbol)}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{tx.companyName}</div>
          </div>
          <Badge type={tx.type} />
          <div style={{ textAlign: 'right', fontSize: 13 }}>{tx.quantity}</div>
          <div style={{ textAlign: 'right', fontSize: 13 }}>{formatINR(tx.price, 2)}</div>
          <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 600 }}>{formatINR(tx.total)}</div>
          <div style={{ textAlign: 'right', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
            {new Date(tx.createdAt).toLocaleDateString('en-IN')}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionTable;