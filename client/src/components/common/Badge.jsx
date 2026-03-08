const Badge = ({ type }) => {
  const isBuy = type === 'BUY';
  return (
    <span style={{
      fontSize: 11, fontWeight: 700,
      padding: '3px 10px', borderRadius: 6,
      background: isBuy ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
      color: isBuy ? '#10b981' : '#ef4444',
    }}>
      {type}
    </span>
  );
};

export default Badge;