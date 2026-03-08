import StatCard from '../common/StatCard';
import { formatINR, pnlColor, pnlPrefix } from '../../utils/formatters';

const SummaryCards = ({ balance, summary }) => {
  const { invested = 0, current = 0, pnl = 0, pnlPercent = 0 } = summary || {};
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 20 }}>
      <StatCard icon="💰" label="Available Balance" value={formatINR(balance)} color="#10b981" />
      <StatCard icon="📥" label="Invested Value" value={formatINR(invested)} color="#6366f1" />
      <StatCard icon="📤" label="Current Value" value={formatINR(current)} color="#f59e0b" />
      <StatCard
        icon={pnl >= 0 ? '📈' : '📉'}
        label="Total P&L"
        value={`${pnlPrefix(pnl)}${formatINR(pnl)}`}
        color={pnlColor(pnl)}
        sub={`${pnlPrefix(pnlPercent)}${pnlPercent}%`}
      />
    </div>
  );
};

export default SummaryCards;