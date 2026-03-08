import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const inputStyle = {
  width: '100%', padding: '12px 14px',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10, color: '#fff', fontSize: 14,
  marginBottom: 12, boxSizing: 'border-box', outline: 'none',
};

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();



  const handleSubmit = async () => {
    if (!form.email || !form.password)
      return showToast('Please fill all fields', 'error');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return showToast('Please enter a valid email address', 'error');
    if (form.password.length < 6)
      return showToast('Password must be at least 6 characters', 'error');
    try {
      setLoading(true);
      const res = await loginUser(form);
      login(res.data.token, res.data.user);
      showToast(`Welcome back, ${res.data.user.name}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.msg || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Welcome back</h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 24 }}>
        Login to your Nifty50Trade account
      </p>

      <input
        placeholder="Email Address"
        value={form.email}
        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        style={{ ...inputStyle, marginBottom: 20 }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%', padding: '13px 0',
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          border: 'none', borderRadius: 10,
          color: '#fff', fontSize: 15, fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Logging in...' : 'Login →'}
      </button>

      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 20 }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>
          Register
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;