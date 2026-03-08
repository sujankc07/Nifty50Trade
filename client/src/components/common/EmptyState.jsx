const EmptyState = ({ icon = '📭', message }) => (
  <div style={{ textAlign: 'center', padding: '50px 20px', color: 'rgba(255,255,255,0.25)' }}>
    <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
    <p style={{ fontSize: 14 }}>{message}</p>
  </div>
);

export default EmptyState;