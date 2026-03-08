const StatCard = ({ icon, label, value, color = '#fff', sub }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14, padding: '18px 20px',
    transition: 'border-color 0.2s',
  }}>
    <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{sub}</div>}
  </div>
);

export default StatCard;