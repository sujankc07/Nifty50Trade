import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0f0f23 0%,#1a1a3e 50%,#0f1a2e 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Inter, system-ui, sans-serif',
    padding: '20px 16px', // prevents touching screen edges on mobile
  }}>
    <div style={{
      width: '100%',
      maxWidth: 420, // caps at 420 on desktop, full width on mobile
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 20,
      padding: 'clamp(24px, 5vw, 40px)', // smaller padding on mobile
      backdropFilter: 'blur(20px)',
    }}>
      {/* Brand */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}><img src="\stock.png" alt="page-logo" height={'60px'} /> </div>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: 0 }}>Nifty50Trade</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 6, fontSize: 13 }}>
          Nifty 50 Paper Trading Simulator
        </p>
      </div>

      <Outlet />
    </div>
  </div>
);

export default AuthLayout;