import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const inputStyle = {
  width: '100%', padding: '12px 14px',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10, color: '#fff', fontSize: 14,
  marginBottom: 12, boxSizing: 'border-box', outline: 'none',
};

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.confirm)
      return showToast('All fields are required', 'error');
    if (form.name.trim().length < 2)
      return showToast('Name must be at least 2 characters', 'error');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return showToast('Please enter a valid email address', 'error');
    if (form.password.length < 6)
      return showToast('Password must be at least 6 characters', 'error');
    if (!/[A-Z]/.test(form.password))
      return showToast('Password must contain at least one uppercase letter', 'error');
    if (!/[0-9]/.test(form.password))
      return showToast('Password must contain at least one number', 'error');
    if (form.password !== form.confirm)
      return showToast('Passwords do not match', 'error');

    try {
      setLoading(true);
      const res = await registerUser({ name: form.name, email: form.email, password: form.password });
      login(res.data.token, res.data.user);
      showToast(`Welcome to Nifty50Trade, ${res.data.user.name}! 🚀`);
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.msg || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Create Account</h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 24 }}>
        Start with ₹1,00,000 virtual money 🎉
      </p>

      <input placeholder="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
      <input placeholder="Email Address" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={inputStyle} />
      <input type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} style={inputStyle} />
      <input type="password" placeholder="Confirm Password" value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} style={{ ...inputStyle, marginBottom: 20 }} />
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: -8, marginBottom: 12 }}>
        Min 6 characters, 1 uppercase letter, 1 number
      </p>
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
        {loading ? 'Creating account...' : 'Create Account →'}
      </button>

      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 20 }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
