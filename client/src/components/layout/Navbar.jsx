import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/formatters';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const links = [
    { to: '/dashboard', label: '🏠 Dashboard' },
    { to: '/markets', label: '📊 Markets' },
    { to: '/portfolio', label: '💼 Portfolio' },
    { to: '/watchlist', label: '⭐ Watchlist' },
    { to: '/history', label: '📋 History' },
  ];

  const navStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(10,10,20,0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    padding: '0 20px',
  };

  const innerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '56px',
  };

  const linkStyle = (isActive) => ({
    color: isActive ? '#6366f1' : 'rgba(255,255,255,0.6)',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: isActive ? 700 : 500,
    padding: '4px 10px',
    borderRadius: 7,
    background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  });

  return (
    <nav style={navStyle}>
      <div style={innerStyle}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <span style={{ fontSize: 20 }}> <img src="\stock.png" alt="page-logo" height={'30px'} /> </span>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: '-0.3px' }}>Nifty50Trade</span>
        </div>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="hide-mobile">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} style={({ isActive }) => linkStyle(isActive)}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Balance */}
          <div style={{
            fontSize: 13, fontWeight: 700, color: '#10b981',
            background: 'rgba(16,185,129,0.1)',
            padding: '4px 10px', borderRadius: 7, whiteSpace: 'nowrap',
            maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {formatINR(user?.balance || 0)}
          </div>

          {/* Logout - desktop */}
          <button onClick={handleLogout} className="hide-mobile" style={{
            background: 'rgba(249, 6, 6, 0.8)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontSize: 12,
            padding: '5px 12px', cursor: 'pointer', fontWeight: 600,
          }}>Logout</button>

          {/* Hamburger - mobile */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="hide-desktop"
            style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 7, color: '#fff', fontSize: 18,
              width: 36, height: 36, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '56px',
          left: 0,
          right: 0,
          background: 'rgba(10,10,20,0.98)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          zIndex: 99,
        }}>
          {links.map(l => (
            <NavLink
              key={l.to} to={l.to}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                ...linkStyle(isActive),
                padding: '10px 14px',
                fontSize: 14,
              })}
            >
              {l.label}
            </NavLink>
          ))}
          <button onClick={handleLogout} style={{
            marginTop: 8, padding: '10px 14px',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 7, color: '#ef4444', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', textAlign: 'left',
          }}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;