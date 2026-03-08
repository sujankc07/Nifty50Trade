import { formatINR, pnlColor, pnlPrefix, stripNS } from '../../utils/formatters';
import EmptyState from '../common/EmptyState';

const HoldingsSummary = ({ holdings = [] }) => (
  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: 'rgba(255,255,255,0.8)' }}>My Holdings</div>
    {holdings.length === 0
      ? <EmptyState icon="📂" message="No holdings yet. Start trading!" />
      : holdings.slice(0, 6).map(h => (
        <div key={h.symbol} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{stripNS(h.symbol)}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{h.quantity} shares</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{formatINR(h.currentValue)}</div>
            <div style={{ fontSize: 11, color: pnlColor(h.pnl) }}>{pnlPrefix(h.pnl)}{formatINR(h.pnl)}</div>
          </div>
        </div>
      ))
    }
  </div>
);

export default HoldingsSummary;