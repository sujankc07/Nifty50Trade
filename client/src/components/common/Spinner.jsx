const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
    <div style={{
      width: 36,
      height: 36,
      borderRadius: '50%',
      border: '3px solid rgba(255,255,255,0.08)',
      borderTop: '3px solid #6366f1',
      animation: 'spin 0.7s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default Spinner;