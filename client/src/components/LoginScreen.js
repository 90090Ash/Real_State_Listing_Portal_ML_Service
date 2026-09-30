import React, { useState } from 'react';
import { darkGlassStyle, neonBtnStyle } from '../styles/theme';

function LoginScreen({ loginData, setLoginData, handleLoginSubmit }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!loginData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(loginData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!loginData.password) {
      newErrors.password = 'Password is required';
    } else if (loginData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(loginData.password)) {
      newErrors.password = 'Password must contain both letters and numbers';
    }

    if (isSignUp) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (confirmPassword !== loginData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (validate()) {
      try {
        await handleLoginSubmit(e, isSignUp);
      } catch (err) {
        setServerError(err.response?.data?.error || 'Authentication failed. Please try again.');
      }
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setConfirmPassword('');
    setLoginData({ ...loginData, password: '' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top left, #0f172a, #020617)',
      color: '#f8fafc',
      fontFamily: "'Rajdhani', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ ...darkGlassStyle, width: '100%', maxWidth: '440px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontFamily: "'Orbitron', sans-serif", color: '#38bdf8', fontSize: '26px', margin: '0 0 10px 0', textShadow: '0 0 12px rgba(56,189,248,0.5)' }}>
            INDORE NEXUS
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '15px' }}>Next-Gen Real Estate & AI Valuation Matrix</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
          <button 
            type="button" 
            onClick={() => !isSignUp ? null : toggleMode()} 
            style={{ background: 'none', border: 'none', color: !isSignUp ? '#38bdf8' : '#94a3b8', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', borderBottom: !isSignUp ? '2px solid #38bdf8' : 'none', paddingBottom: '4px' }}
          >
            LOGIN
          </button>
          <button 
            type="button" 
            onClick={() => isSignUp ? null : toggleMode()} 
            style={{ background: 'none', border: 'none', color: isSignUp ? '#38bdf8' : '#94a3b8', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', borderBottom: isSignUp ? '2px solid #38bdf8' : 'none', paddingBottom: '4px' }}
          >
            SIGN UP
          </button>
        </div>

        {serverError && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '14px' }}>
            {serverError}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#38bdf8', marginBottom: '6px', fontWeight: 'bold' }}>USER CREDENTIAL (EMAIL)</label>
            <input
              type="email"
              placeholder="agent@nexus.ai or buyer@nexus.ai"
              value={loginData.email}
              onChange={(e) => {
                setLoginData({ ...loginData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              style={{ width: '100%', padding: '12px', background: '#020617', border: `1px solid ${errors.email ? '#ef4444' : 'rgba(56, 189, 248, 0.3)'}`, borderRadius: '8px', color: '#fff', outline: 'none' }}
            />
            {errors.email && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#38bdf8', marginBottom: '6px', fontWeight: 'bold' }}>SECURITY ACCESS CODE</label>
            <input
              type="password"
              placeholder="••••••••"
              value={loginData.password}
              onChange={(e) => {
                setLoginData({ ...loginData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              style={{ width: '100%', padding: '12px', background: '#020617', border: `1px solid ${errors.password ? '#ef4444' : 'rgba(56, 189, 248, 0.3)'}`, borderRadius: '8px', color: '#fff', outline: 'none' }}
            />
            {errors.password && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.password}</span>}
          </div>

          {isSignUp && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#38bdf8', marginBottom: '6px', fontWeight: 'bold' }}>CONFIRM ACCESS CODE</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                }}
                style={{ width: '100%', padding: '12px', background: '#020617', border: `1px solid ${errors.confirmPassword ? '#ef4444' : 'rgba(56, 189, 248, 0.3)'}`, borderRadius: '8px', color: '#fff', outline: 'none' }}
              />
              {errors.confirmPassword && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.confirmPassword}</span>}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#38bdf8', marginBottom: '6px', fontWeight: 'bold' }}>PORTAL ACCESS MODE</label>
            <select
              value={loginData.role}
              onChange={(e) => setLoginData({ ...loginData, role: e.target.value })}
              style={{ width: '100%', padding: '12px', background: '#020617', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '8px', color: '#fff', outline: 'none' }}
            >
              <option value="buyer">BUYER / INVESTOR PORTAL</option>
              <option value="agent">LISTING AGENT DESK</option>
            </select>
          </div>

          <button type="submit" style={{ ...neonBtnStyle, width: '100%', padding: '14px', fontSize: '16px', marginTop: '10px' }}>
            {isSignUp ? 'REGISTER NEW ACCESS ⚡' : 'INITIALIZE PORTAL ACCESS ⚡'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;
